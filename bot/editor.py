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
    templates = [
        f"¡Esto se está volviendo viral ahora mismo! {topic_title}. "
        f"Uno de los momentos más comentados del día. "
        f"Dale like si te sorprendió y suscríbete para más contenido viral.",

        f"No vas a creer lo que está pasando. {topic_title}. "
        f"La gente en internet no puede dejar de hablar de esto. "
        f"Sígueme para no perderte los mejores videos del momento.",

        f"Trending ahora mismo: {topic_title}. "
        f"Este video está rompiendo las redes sociales. "
        f"Comenta qué piensas y no te olvides de suscribirte.",
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
