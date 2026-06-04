import asyncio
import os
import subprocess
import textwrap
import random

try:
    import edge_tts
    HAS_TTS = True
except ImportError:
    HAS_TTS = False

try:
    import imageio_ffmpeg
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FFMPEG = "ffmpeg"


# ---- Narración -------------------------------------------------------

def generate_script(topic_title, subreddit=""):
    """
    Genera narración que describe el video honestamente
    según su categoría/tema visual.
    """
    t = topic_title.lower()

    if any(w in t for w in ["beach", "ocean", "sea", "playa", "mar", "wave"]):
        templates = [
            "Mira esta increíble toma aérea de la playa. "
            "El color del agua, la arena blanca... momentos como este nos recuerdan lo hermoso que es el planeta. "
            "Suscríbete para más videos relajantes de naturaleza.",

            "Pocas cosas son más relajantes que el sonido y la vista del océano desde las alturas. "
            "Este tipo de escena es perfecta para desconectarte del estrés del día. "
            "Dale like si esto te dio paz.",
        ]
    elif any(w in t for w in ["aerial", "drone", "sky", "aéreo", "cielo", "vuelo"]):
        templates = [
            "Las tomas aéreas nos dan una perspectiva del mundo que muy pocos pueden ver en persona. "
            "Desde arriba todo se ve diferente, más pequeño, más tranquilo. "
            "Suscríbete para más contenido así.",

            "Ver el mundo desde el aire siempre impresiona. "
            "Este drone capturó algo realmente especial. "
            "Comenta qué lugar te gustaría ver desde las alturas.",
        ]
    elif any(w in t for w in ["nature", "forest", "mountain", "naturaleza", "bosque", "montaña"]):
        templates = [
            "La naturaleza nunca deja de sorprender. "
            "Estos paisajes nos recuerdan lo importante que es proteger nuestro planeta. "
            "Dale like si esto te inspiró.",

            "Hay lugares en el mundo que parecen de otro planeta. "
            "La naturaleza es el mejor artista que existe. "
            "Suscríbete para más videos de paisajes increíbles.",
        ]
    elif any(w in t for w in ["city", "urban", "street", "ciudad", "calle"]):
        templates = [
            "Las ciudades tienen su propia belleza, especialmente desde esta perspectiva. "
            "La vida urbana vista desde otro ángulo. "
            "Comenta qué ciudad quisieras visitar.",

            "Cada ciudad tiene su propia energía y personalidad. "
            "¿Reconoces este lugar? Comenta abajo. "
            "Suscríbete para más contenido urbano.",
        ]
    else:
        templates = [
            f"Imágenes de {topic_title} que vale la pena ver. "
            "A veces los mejores momentos son los más simples. "
            "Dale like si te gustó y suscríbete para más.",

            f"Disfruta estas tomas de {topic_title}. "
            "El mundo está lleno de momentos hermosos esperando ser capturados. "
            "Sígueme para no perderte el próximo video.",
        ]

    return random.choice(templates)


async def _tts_async(text, output_path, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def text_to_speech(text, output_path, voice="es-PR-KarinaNeural"):
    if not HAS_TTS:
        print("  [!] edge-tts no disponible — sin narración")
        return None
    try:
        asyncio.run(_tts_async(text, output_path, voice))
        return output_path if os.path.exists(output_path) else None
    except Exception as e:
        print(f"  [!] TTS error: {e}")
        return None


# ---- Edición con ffmpeg ----------------------------------------------

def _escape_ffmpeg_text(text):
    """Escapa caracteres especiales para el filtro drawtext de ffmpeg."""
    return (text
            .replace("\\", "\\\\")
            .replace("'", "\\'")
            .replace(":", "\\:")
            .replace("[", "\\[")
            .replace("]", "\\]"))


def edit_video(input_path, output_path, title, script, voice, duration=45, watermark=""):
    """
    Edita el video con ffmpeg puro:
    1. Recorta a portrait 9:16
    2. Trim a duración deseada
    3. Añade narración TTS
    4. Añade texto en pantalla
    5. Exporta MP4
    """
    narr_path = output_path.replace(".mp4", "_narr.mp3")

    # Generar narración
    narr_available = text_to_speech(script, narr_path, voice)

    # Construir filtros de video
    title_short = title[:50] + ("..." if len(title) > 50 else "")
    title_escaped = _escape_ffmpeg_text(title_short)

    video_filter = (
        "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,"
        "scale=1080:1920,"
        f"drawtext=text='{title_escaped}'"
        ":fontsize=48:fontcolor=white:x=(w-text_w)/2:y=80"
        ":borderw=3:bordercolor=black"
    )

    if watermark:
        wm_escaped = _escape_ffmpeg_text(watermark)
        video_filter += (
            f",drawtext=text='{wm_escaped}'"
            ":fontsize=32:fontcolor=white:x=(w-text_w)/2:y=h-80"
            ":borderw=2:bordercolor=black"
        )

    # Detectar si el video tiene audio
    probe = subprocess.run(
        [FFMPEG, "-i", input_path],
        capture_output=True, text=True
    )
    has_audio = "Audio:" in probe.stderr

    if narr_available and os.path.exists(narr_path):
        if has_audio:
            audio_filter = (
                f"[0:v]{video_filter}[vout];"
                "[0:a]volume=0.05[orig];"
                "[1:a]volume=1.0[narr];"
                "[orig][narr]amix=inputs=2:duration=shortest[aout]"
            )
            cmd = [
                FFMPEG, "-y",
                "-i", input_path,
                "-i", narr_path,
                "-t", str(duration),
                "-filter_complex", audio_filter,
                "-map", "[vout]",
                "-map", "[aout]",
                "-c:v", "libx264",
                "-c:a", "aac",
                "-preset", "fast",
                "-crf", "23",
                "-r", "30",
                "-shortest",
                output_path
            ]
        else:
            # Video sin audio — usar solo narración
            cmd = [
                FFMPEG, "-y",
                "-i", input_path,
                "-i", narr_path,
                "-t", str(duration),
                "-filter_complex", f"[0:v]{video_filter}[vout]",
                "-map", "[vout]",
                "-map", "1:a",
                "-c:v", "libx264",
                "-c:a", "aac",
                "-preset", "fast",
                "-crf", "23",
                "-r", "30",
                "-shortest",
                output_path
            ]
    else:
        # Sin narración — solo video con filtro
        cmd = [
            FFMPEG, "-y",
            "-i", input_path,
            "-t", str(duration),
            "-filter_complex", f"[0:v]{video_filter}[vout]",
            "-map", "[vout]",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-r", "30",
            output_path
        ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg error:\n{result.stderr[-500:]}")

    # Limpiar audio temporal
    if narr_available and os.path.exists(narr_path):
        os.remove(narr_path)

    return output_path
