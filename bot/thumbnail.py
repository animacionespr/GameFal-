import subprocess
import os
import textwrap

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

import imageio_ffmpeg
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def extract_frame(video_path, output_path, time_sec=2):
    """Extrae un frame del video para usar como fondo del thumbnail."""
    cmd = [
        FFMPEG, "-y",
        "-ss", str(time_sec),
        "-i", video_path,
        "-vframes", "1",
        "-q:v", "2",
        output_path,
    ]
    subprocess.run(cmd, capture_output=True)
    return os.path.exists(output_path)


def create_thumbnail(video_path, output_path, title, game_name=""):
    """
    Genera thumbnail estilo gaming:
    - Frame del video como fondo
    - Overlay oscuro degradado
    - Título en texto grande y bold
    - Nombre del juego abajo
    """
    if not HAS_PIL:
        print("  [!] Pillow no instalado — sin thumbnail")
        return None

    # Tamaño estándar YouTube
    W, H = 1280, 720

    # Extraer frame del video
    frame_path = output_path.replace(".jpg", "_frame.jpg")
    has_frame = extract_frame(video_path, frame_path)

    if has_frame:
        bg = Image.open(frame_path).convert("RGB")
        bg = bg.resize((W, H), Image.LANCZOS)
        # Oscurecer y desenfocar ligeramente para que el texto resalte
        bg = bg.filter(ImageFilter.GaussianBlur(radius=2))
        enhancer = ImageEnhance.Brightness(bg)
        bg = enhancer.enhance(0.45)
    else:
        # Fondo negro con gradiente si no hay frame
        bg = Image.new("RGB", (W, H), color=(10, 10, 20))

    draw = ImageDraw.Draw(bg)

    # Degradado oscuro en la parte inferior
    for y in range(H // 2, H):
        alpha = int(180 * (y - H // 2) / (H // 2))
        draw.rectangle([(0, y), (W, y)], fill=(0, 0, 0, alpha))

    # Intentar cargar fuente bold, si no hay usar default
    font_title = None
    font_game = None
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font_title = ImageFont.truetype(fp, 90)
                font_game = ImageFont.truetype(fp, 48)
                break
            except Exception:
                continue

    if font_title is None:
        font_title = ImageFont.load_default()
        font_game = ImageFont.load_default()

    # Título principal — centrado, texto grande
    title_wrapped = "\n".join(textwrap.wrap(title.upper(), width=22))
    lines = title_wrapped.split("\n")

    y_start = H // 2 - (len(lines) * 100) // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font_title)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        # Sombra
        draw.text((x + 4, y_start + 4), line, font=font_title, fill=(0, 0, 0))
        # Texto principal amarillo neón gaming
        draw.text((x, y_start), line, font=font_title, fill=(255, 220, 0))
        y_start += 105

    # Nombre del juego abajo — rojo gaming
    if game_name:
        game_text = f"🎮 {game_name.upper()}"
        bbox = draw.textbbox((0, 0), game_text, font=font_game)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        draw.text((x + 2, H - 90 + 2), game_text, font=font_game, fill=(0, 0, 0))
        draw.text((x, H - 90), game_text, font=font_game, fill=(255, 60, 60))

    # Guardar
    bg.save(output_path, "JPEG", quality=95)

    # Limpiar frame temporal
    if os.path.exists(frame_path):
        os.remove(frame_path)

    return output_path
