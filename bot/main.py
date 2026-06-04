#!/usr/bin/env python3
"""
VideoBot — Encuentra trends virales, descarga videos royalty-free,
les añade narración y los sube automáticamente a YouTube.
Todas las herramientas son GRATIS.
"""

import os
import sys
import random
from datetime import datetime

import config
from trending import get_reddit_trending
from video_finder import search_videos, get_popular_videos, download_video, FALLBACK_QUERIES
from editor import generate_script, edit_video
from uploader import upload_youtube


def build_description(topic):
    tags_str = " ".join(f"#{t}" for t in [topic["subreddit"], "viral", "trending", "shorts"])
    return (
        f"{topic['title']}\n\n"
        f"Video viral del momento — contenido sin copyright de Pexels.\n\n"
        f"{tags_str}"
    )


def build_tags(topic):
    base = ["viral", "trending", "shorts", topic["subreddit"]]
    extras = topic.get("search_query", "").split()
    return list(dict.fromkeys(base + extras))[:15]  # YouTube max 15 tags útiles


def run():
    print("=" * 50)
    print("  VideoBot — Automatización de contenido viral")
    print("=" * 50)

    # Validar config
    if config.PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
        print("\n❌ Error: Agrega tu PEXELS_API_KEY en config.py")
        print("   Gratis en: https://www.pexels.com/api/")
        sys.exit(1)

    if config.UPLOAD_TO_YOUTUBE and not os.path.exists(config.YOUTUBE_CLIENT_SECRETS):
        print("\n❌ Error: No se encontró client_secrets.json")
        print("   Ver instrucciones en SETUP.md")
        sys.exit(1)

    os.makedirs("downloads", exist_ok=True)
    os.makedirs("output", exist_ok=True)

    # 1. Obtener temas
    print("\n📈 Buscando temas virales en Reddit...")
    topics = get_reddit_trending(config.REDDIT_SUBREDDITS, limit=20)
    if not topics:
        print("  ⚠️  Reddit no disponible, usando temas del config...")
        topics = [{"title": q, "subreddit": q, "score": 0, "search_query": q}
                  for q in config.VIDEO_TOPICS]
        random.shuffle(topics)

    print(f"  ✅ {len(topics)} temas encontrados")
    topics_to_process = topics[:config.VIDEOS_PER_RUN]

    # 2. Procesar cada tema
    results = []
    for i, topic in enumerate(topics_to_process):
        print(f"\n[{i+1}/{len(topics_to_process)}] 🔥 {topic['title'][:60]}")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")

        # Buscar video en Pexels
        query = topic["search_query"]
        print(f"  🎬 Buscando video: '{query}'...")
        videos = search_videos(query, config.PEXELS_API_KEY)

        if not videos:
            # Fallback: video popular de Pexels
            print("  ⚠️  Sin resultados, usando video popular de Pexels...")
            videos = get_popular_videos(config.PEXELS_API_KEY)

        if not videos:
            print("  ❌ No se encontró video, saltando...")
            continue

        video = random.choice(videos[:3])  # Variar entre los mejores 3

        # Descargar
        raw_path = f"downloads/raw_{timestamp}.mp4"
        try:
            download_video(video, raw_path)
        except Exception as e:
            print(f"  ❌ Error descargando: {e}")
            continue

        # Editar
        output_path = f"output/video_{timestamp}.mp4"
        title = topic["title"][:80]
        script = generate_script(topic["title"], topic["subreddit"])

        print(f"  ✂️  Editando y añadiendo narración...")
        try:
            edit_video(
                raw_path,
                output_path,
                title=title,
                script=script,
                voice=config.TTS_VOICE,
                duration=config.VIDEO_DURATION,
                watermark="@TuCanal",
                elevenlabs_key=config.ELEVENLABS_API_KEY,
                elevenlabs_voice_id=config.ELEVENLABS_VOICE_ID,
            )
        except Exception as e:
            print(f"  ❌ Error editando: {e}")
            if os.path.exists(raw_path):
                os.remove(raw_path)
            continue

        # Limpiar descarga original
        if os.path.exists(raw_path):
            os.remove(raw_path)

        print(f"  ✅ Video listo: {output_path}")

        # Subir a YouTube
        if config.UPLOAD_TO_YOUTUBE:
            print(f"  📤 Subiendo a YouTube...")
            try:
                video_id = upload_youtube(
                    video_path=output_path,
                    title=title,
                    description=build_description(topic),
                    tags=build_tags(topic),
                    category_id=config.YOUTUBE_CATEGORY,
                    client_secrets_file=config.YOUTUBE_CLIENT_SECRETS,
                )
                url = f"https://youtube.com/watch?v={video_id}"
                print(f"  🎉 ¡Subido! {url}")
                results.append({"title": title, "url": url})
            except Exception as e:
                print(f"  ❌ Error subiendo: {e}")
        else:
            print(f"  💾 Video guardado localmente (UPLOAD_TO_YOUTUBE=False)")
            results.append({"title": title, "url": output_path})

    # Resumen
    print("\n" + "=" * 50)
    print(f"  ✅ VideoBot terminó — {len(results)}/{len(topics_to_process)} videos procesados")
    for r in results:
        print(f"     • {r['title'][:50]} → {r['url']}")
    print("=" * 50)


if __name__ == "__main__":
    run()
