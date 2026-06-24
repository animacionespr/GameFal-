#!/usr/bin/env python3
"""
TikTok Viral Video Finder - Gaming & Humor
Uso: python3 tiktok_viral.py
Requiere: pip install requests
"""

import requests
import json
from datetime import datetime

# ─── CONFIG ───────────────────────────────────────────────────────────────────
RAPIDAPI_KEY = "TU_API_KEY_AQUI"  # https://rapidapi.com → busca "tiktok-scraper7"
TOP_N = 10

CATEGORIES = {
    "gaming": ["gaming", "gamer", "videogames", "ps5", "xbox", "nintendo", "pcgaming", "fortnite", "minecraft"],
    "humor":  ["humor", "funny", "memes", "comedy", "lol", "viral", "parati", "fyp"],
}

# Umbral mínimo para considerar un video viral
MIN_VIEWS    = 500_000
MIN_LIKES    = 50_000
MIN_SHARE_RATIO = 0.03   # shares/views > 3%

# ─── API ──────────────────────────────────────────────────────────────────────
HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com",
}

def fetch_trending(hashtag: str) -> list:
    url = "https://tiktok-scraper7.p.rapidapi.com/feed/search"
    params = {"keywords": hashtag, "region": "US", "count": "30", "cursor": "0",
              "publish_time": "1", "sort_type": "0"}
    try:
        r = requests.get(url, headers=HEADERS, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        return data.get("data", {}).get("videos", [])
    except Exception as e:
        print(f"  [!] Error en #{hashtag}: {e}")
        return []

# ─── SCORING ──────────────────────────────────────────────────────────────────
def virality_score(v: dict) -> float:
    views    = v.get("play_count", 0)
    likes    = v.get("digg_count", 0)
    shares   = v.get("share_count", 0)
    comments = v.get("comment_count", 0)

    if views == 0:
        return 0.0

    engagement = (likes + shares * 3 + comments * 2) / views
    share_ratio = shares / views if views else 0
    score = views * engagement * (1 + share_ratio * 10)
    return round(score, 2)

def is_viral(v: dict) -> bool:
    views  = v.get("play_count", 0)
    likes  = v.get("digg_count", 0)
    shares = v.get("share_count", 0)
    share_ratio = shares / views if views else 0
    return views >= MIN_VIEWS and likes >= MIN_LIKES and share_ratio >= MIN_SHARE_RATIO

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print(f"\n{'='*60}")
    print(f"  TikTok Viral Finder — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}\n")

    all_videos = {}

    for category, hashtags in CATEGORIES.items():
        print(f"[{category.upper()}] Buscando...")
        for tag in hashtags:
            for v in fetch_trending(tag):
                vid_id = v.get("video_id") or v.get("id")
                if vid_id and vid_id not in all_videos:
                    v["_category"] = category
                    all_videos[vid_id] = v

    # Filtrar virales y ordenar por score
    virales = [v for v in all_videos.values() if is_viral(v)]
    virales.sort(key=virality_score, reverse=True)
    top = virales[:TOP_N]

    if not top:
        print("No se encontraron videos virales con los criterios actuales.")
        print("Prueba bajando MIN_VIEWS o MIN_LIKES en el script.")
        return

    print(f"\nTop {len(top)} videos virales confirmados:\n")
    print(f"{'#':<3} {'Categoría':<10} {'Vistas':>10} {'Likes':>9} {'Shares':>8} {'Score':>12}  Autor / Descripción")
    print("-" * 90)

    results = []
    for i, v in enumerate(top, 1):
        views    = v.get("play_count", 0)
        likes    = v.get("digg_count", 0)
        shares   = v.get("share_count", 0)
        author   = v.get("author", {}).get("unique_id", "?")
        desc     = (v.get("title") or v.get("desc") or "")[:45]
        cat      = v.get("_category", "?")
        score    = virality_score(v)
        url      = f"https://www.tiktok.com/@{author}/video/{v.get('video_id') or v.get('id')}"

        print(f"{i:<3} {cat:<10} {views:>10,} {likes:>9,} {shares:>8,} {score:>12,.0f}  @{author} — {desc}")
        print(f"    {url}")
        print()

        results.append({"rank": i, "category": cat, "author": author,
                        "views": views, "likes": likes, "shares": shares,
                        "score": score, "url": url, "desc": desc})

    # Guardar JSON
    out_file = f"viral_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nResultados guardados en: {out_file}")

if __name__ == "__main__":
    main()
