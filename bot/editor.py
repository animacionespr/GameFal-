import asyncio
import os
import subprocess
import textwrap
import random

try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False

try:
    from elevenlabs.client import ElevenLabs
    HAS_ELEVENLABS = True
except ImportError:
    HAS_ELEVENLABS = False

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

    if any(w in t for w in ["gaming", "game", "esport", "streamer", "console", "controller", "pc gaming", "playstation", "xbox", "nintendo", "videojuego"]):
        templates = [
            "Los videojuegos han evolucionado a un nivel increíble. "
            "Cada año los gráficos, las historias y la experiencia mejoran más. "
            "Comenta cuál es tu juego favorito del momento.",

            "El gaming ya no es solo un hobby — es cultura, es comunidad, es el futuro del entretenimiento. "
            "¿Eres más de PC o consola? Comenta abajo. "
            "Suscríbete para más contenido gamer.",

            "Mira este setup — cada detalle pensado para la mejor experiencia gaming posible. "
            "La competencia en los esports está a otro nivel. "
            "Dale like si eres gamer y sígueme para más.",

            "Los mejores jugadores del mundo hacen que parezca fácil, pero detrás hay horas y horas de práctica. "
            "El gaming profesional es tan competitivo como cualquier deporte. "
            "Suscríbete para no perderte más contenido así.",
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


async def _edge_tts_async(text, output_path, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def text_to_speech(text, output_path, voice="es-MX-JorgeNeural",
                   elevenlabs_key="", elevenlabs_voice_id=""):
    """Usa ElevenLabs si está configurado, si no usa edge-tts gratis."""

    # Intentar ElevenLabs primero
    if HAS_ELEVENLABS and elevenlabs_key and elevenlabs_key != "YOUR_ELEVENLABS_API_KEY" and elevenlabs_voice_id:
        try:
            print("     🎙️ Generando voz con ElevenLabs...")
            client = ElevenLabs(api_key=elevenlabs_key)
            audio = client.text_to_speech.convert(
                voice_id=elevenlabs_voice_id,
                text=text,
                model_id="eleven_multilingual_v2",
            )
            with open(output_path, "wb") as f:
                for chunk in audio:
                    f.write(chunk)
            return output_path
        except Exception as e:
            print(f"  [!] ElevenLabs error: {e} — usando edge-tts como respaldo")

    # Respaldo: edge-tts gratis
    if not HAS_EDGE_TTS:
        print("  [!] Sin TTS disponible — video sin narración")
        return None
    try:
        print("     🎙️ Generando voz con edge-tts...")
        asyncio.run(_edge_tts_async(text, output_path, voice))
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


def edit_video(input_path, output_path, title, script, voice, duration=45, watermark="",
               elevenlabs_key="", elevenlabs_voice_id=""):
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
    narr_available = text_to_speech(script, narr_path, voice,
                                    elevenlabs_key=elevenlabs_key,
                                    elevenlabs_voice_id=elevenlabs_voice_id)

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
