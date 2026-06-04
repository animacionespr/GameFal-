import asyncio
import os
import textwrap
import subprocess
from pathlib import Path

try:
    import edge_tts
    HAS_TTS = True
except ImportError:
    HAS_TTS = False

try:
    from moviepy.editor import (
        VideoFileClip, AudioFileClip, CompositeVideoClip,
        CompositeAudioClip, TextClip, ColorClip, concatenate_videoclips
    )
    HAS_MOVIEPY = True
except ImportError:
    HAS_MOVIEPY = False


# ---- Narración -------------------------------------------------------

def generate_script(topic_title, subreddit=""):
    """
    Genera un guión de narración basado en el tema viral.
    Sin IA externa — plantillas predefinidas. Puedes mejorarlo con GPT si quieres.
    """
    templates = [
        f"¡Esto se está volviendo viral ahora mismo! {topic_title}. "
        f"Uno de los momentos más comentados del día. "
        f"Dale like si te sorprendió y suscríbete para más contenido viral.",

        f"No vas a creer lo que está pasando. {topic_title}. "
        f"La gente en internet no puede dejar de hablar de esto. "
        f"Sígueme para no perderte los mejores videos del momento.",

        f"Trending ahora: {topic_title}. "
        f"Este video está rompiendo las redes sociales. "
        f"Comenta qué piensas y no te olvides de suscribirte.",
    ]
    import random
    return random.choice(templates)


async def _tts_async(text, output_path, voice):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def text_to_speech(text, output_path, voice="es-PR-KarinaNeural"):
    """Convierte texto a voz usando edge-tts (gratis, sin API key)."""
    if not HAS_TTS:
        print("  [!] edge-tts no instalado — video sin narración")
        return None
    asyncio.run(_tts_async(text, output_path, voice))
    return output_path if os.path.exists(output_path) else None


# ---- Edición de video ------------------------------------------------

def crop_to_portrait(clip):
    """Recorta el video a proporción 9:16 (Shorts / TikTok)."""
    w, h = clip.size
    target_w = int(h * 9 / 16)
    if target_w < w:
        x_center = w / 2
        clip = clip.crop(x1=x_center - target_w / 2, x2=x_center + target_w / 2)
    return clip


def add_title_overlay(clip, title):
    """Añade el título en la parte superior del video."""
    if not HAS_MOVIEPY:
        return clip
    wrapped = "\n".join(textwrap.wrap(title, width=28))
    try:
        txt = (
            TextClip(wrapped, fontsize=36, color="white",
                     stroke_color="black", stroke_width=2,
                     method="caption", size=(clip.w - 20, None))
            .set_position(("center", 40))
            .set_duration(clip.duration)
        )
        return CompositeVideoClip([clip, txt])
    except Exception as e:
        print(f"  [!] No se pudo agregar texto ({e}) — continuando sin overlay")
        return clip


def add_watermark(clip, text="@TuCanal"):
    """Añade marca de agua en la parte inferior."""
    if not HAS_MOVIEPY:
        return clip
    try:
        wm = (
            TextClip(text, fontsize=24, color="white",
                     stroke_color="black", stroke_width=1)
            .set_position(("center", clip.h - 60))
            .set_duration(clip.duration)
        )
        return CompositeVideoClip([clip, wm])
    except Exception:
        return clip


def edit_video(input_path, output_path, title, script, voice, duration=45, watermark=""):
    """
    Pipeline principal de edición:
    1. Carga y recorta a portrait 9:16
    2. Trim a la duración deseada
    3. Genera narración TTS
    4. Añade overlay de título + marca de agua
    5. Exporta
    """
    if not HAS_MOVIEPY:
        raise RuntimeError("moviepy no instalado. Ejecuta: pip install moviepy")

    audio_path = output_path.replace(".mp4", "_narr.mp3")

    # Generar narración
    narr_path = text_to_speech(script, audio_path, voice)

    # Cargar video
    clip = VideoFileClip(input_path)

    # Recortar a portrait
    clip = crop_to_portrait(clip)

    # Trim
    if clip.duration > duration:
        clip = clip.subclip(0, duration)

    # Mezclar audio
    if narr_path and os.path.exists(narr_path):
        narr_audio = AudioFileClip(narr_path)
        if narr_audio.duration > clip.duration:
            narr_audio = narr_audio.subclip(0, clip.duration)
        if clip.audio:
            mixed = CompositeAudioClip([clip.audio.volumex(0.08), narr_audio.volumex(1.0)])
            clip = clip.set_audio(mixed)
        else:
            clip = clip.set_audio(narr_audio)

    # Añadir textos
    clip = add_title_overlay(clip, title)
    if watermark:
        clip = add_watermark(clip, watermark)

    # Exportar
    clip.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        fps=30,
        preset="fast",
        logger=None,
    )

    # Limpiar archivos temporales
    clip.close()
    if narr_path and os.path.exists(narr_path):
        os.remove(narr_path)

    return output_path
