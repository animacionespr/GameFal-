#!/usr/bin/env python3
"""
VideoBot — Encuentra trending games en Twitch, descarga videos royalty-free,
genera scripts con IA, añade narración, crea thumbnail gaming y sube a YouTube.
"""

import os
import sys
import random
from datetime import datetime

import config
from trending import get_reddit_trending
from twitch_trending import get_trending_games
from video_finder import search_videos, get_popular_videos, download_video
from editor import generate_script, edit_video
from ai_script import generate_gaming_script
from thumbnail import create_thumbnail
from uploader import upload_youtube


def get_topics():
    """Obtiene temas virales — Twitch primero, luego Reddit, luego config."""

    # 1. Twitch (juegos más vistos ahora mismo)
    if config.TWITCH_CLIENT_ID != "YOUR_TWITCH_CLIENT_ID":
        print("  🎮 Obteniendo trending games de Twitch...")
        topics = get_trending_games(config.TWITCH_CLIENT_ID, config.TWITCH_CLIENT_SECRET)
        if topics:
            print(f"  ✅ {len(topics)} juegos trending en Twitch")
            return topics

    # 2. Reddit gaming
    print("  📱 Intentando Reddit...")
    topics = get_reddit_trending(config.REDDIT_SUBREDDITS, limit=20)
    if topics:
        print(f"  ✅ {len(topics)} posts encontrados en Reddit")
        return topics

    # 3. Fallback: temas del config
    print("  ⚠️  Usando temas del config...")
    topics = [{"title": q, "subreddit": "gaming", "score": 0,
                "search_query": q, "game_name": q}
               for q in config.VIDEO_TOPICS]
    random.shuffle(topics)
    return topics


def get_script(topic):
    """Genera script — Groq IA primero, luego plantilla."""
    game = topic.get("game_name", topic["title"])

    if config.GROQ_API_KEY != "YOUR_GROQ_API_KEY":
        print("  🤖 Generando script con IA (Groq)...")
        script = generate_gaming_script(game, config.GROQ_API_KEY)
        if script:
            return script

    return generate_script(topic["title"], topic.get("subreddit", ""))


def build_description(topic):
    game = topic.get("game_name", topic["title"])
    tags = f"#Gaming #Shorts #{game.replace(' ', '')} #Gameplay #Viral"
    return (
        f"{topic['title']}\n\n"
        f"Lo mejor del gaming en un video. Suscríbete para más contenido diario.\n\n"
        f"{tags}"
    )


def build_tags(topic):
    game = topic.get("game_name", topic["title"])
    base = ["gaming", "shorts", "gameplay", "viral", "games", game.lower()]
    extras = topic.get("search_query", "").split()
    return list(dict.fromkeys(base + extras))[:15]


def run():
    print("=" * 52)
    print("  VideoBot — Gaming Content Automation")
    print("=" * 52)

    if config.PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
        print("\n❌ Agrega tu PEXELS_API_KEY en config.py")
        sys.exit(1)

    if config.UPLOAD_TO_YOUTUBE and not os.path.exists(config.YOUTUBE_CLIENT_SECRETS):
        print("\n❌ No se encontró client_secrets.json — ver SETUP.md")
        sys.exit(1)

    os.makedirs("downloads", exist_ok=True)
    os.makedirs("output", exist_ok=True)
    os.makedirs("thumbnails", exist_ok=True)

    # Obtener temas
    print("\n📈 Buscando trending games...")
    topics = get_topics()
    topics_to_process = topics[:config.VIDEOS_PER_RUN]

    results = []
    for i, topic in enumerate(topics_to_process):
        game = topic.get("game_name", topic["title"])
        print(f"\n[{i+1}/{len(topics_to_process)}] 🎮 {game}")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")

        # Buscar video en Pexels
        query = topic.get("search_query", topic["title"])
        print(f"  🎬 Buscando video: '{query}'...")
        videos = search_videos(query, config.PEXELS_API_KEY)

        if not videos:
            print("  ⚠️  Sin resultados específicos, usando videos populares...")
            videos = get_popular_videos(config.PEXELS_API_KEY)

        if not videos:
            print("  ❌ Sin videos disponibles, saltando...")
            continue

        video = random.choice(videos[:3])

        # Descargar
        raw_path = f"downloads/raw_{timestamp}.mp4"
        try:
            download_video(video, raw_path)
        except Exception as e:
            print(f"  ❌ Error descargando: {e}")
            continue

        # Generar script
        script = get_script(topic)
        title = f"{game} — Gameplay Highlights"

        # Editar video
        output_path = f"output/video_{timestamp}.mp4"
        print(f"  ✂️  Editando con narración...")
        try:
            edit_video(
                raw_path, output_path,
                title=title,
                script=script,
                voice=config.TTS_VOICE,
                duration=config.VIDEO_DURATION,
                watermark=config.CHANNEL_NAME,
                elevenlabs_key=config.ELEVENLABS_API_KEY,
                elevenlabs_voice_id=config.ELEVENLABS_VOICE_ID,
            )
        except Exception as e:
            print(f"  ❌ Error editando: {e}")
            if os.path.exists(raw_path):
                os.remove(raw_path)
            continue

        if os.path.exists(raw_path):
            os.remove(raw_path)

        # Generar thumbnail
        thumb_path = f"thumbnails/thumb_{timestamp}.jpg"
        print(f"  🖼️  Generando thumbnail...")
        create_thumbnail(output_path, thumb_path, title=game.upper(), game_name=game)

        print(f"  ✅ Video: {output_path}")
        if os.path.exists(thumb_path):
            print(f"  ✅ Thumbnail: {thumb_path}")

        # Subir a YouTube
        if config.UPLOAD_TO_YOUTUBE:
            print(f"  📤 Subiendo a YouTube...")
            try:
                video_id = upload_youtube(
                    video_path=output_path,
                    title=title[:100],
                    description=build_description(topic),
                    tags=build_tags(topic),
                    category_id=config.YOUTUBE_CATEGORY,
                    client_secrets_file=config.YOUTUBE_CLIENT_SECRETS,
                    thumbnail_path=thumb_path if os.path.exists(thumb_path) else None,
                )
                url = f"https://youtube.com/watch?v={video_id}"
                print(f"  🎉 ¡Subido! {url}")
                results.append({"title": title, "url": url})
            except Exception as e:
                print(f"  ❌ Error subiendo: {e}")
        else:
            results.append({"title": title, "url": output_path})

    print("\n" + "=" * 52)
    print(f"  ✅ Terminado — {len(results)}/{len(topics_to_process)} videos")
    for r in results:
        print(f"     • {r['title'][:45]} → {r['url']}")
    print("=" * 52)


if __name__ == "__main__":
    run()
