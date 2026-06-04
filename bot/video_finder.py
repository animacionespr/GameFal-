import requests
import os

PEXELS_BASE = "https://api.pexels.com/videos"

FALLBACK_QUERIES = [
    "aerial nature", "city timelapse", "ocean waves", "mountain landscape",
    "sunset sky", "crowd people", "technology abstract", "space galaxy"
]


def search_videos(query, api_key, per_page=5):
    """Busca videos en Pexels (royalty-free, sin copyright)."""
    headers = {"Authorization": api_key}
    try:
        r = requests.get(
            f"{PEXELS_BASE}/search",
            headers=headers,
            params={
                "query": query,
                "per_page": per_page,
                "orientation": "portrait",   # 9:16 para Shorts/TikTok
                "size": "medium",
            },
            timeout=15,
        )
        videos = r.json().get("videos", [])
        if not videos:
            # Intentar sin filtro de orientación
            r = requests.get(
                f"{PEXELS_BASE}/search",
                headers=headers,
                params={"query": query, "per_page": per_page},
                timeout=15,
            )
            videos = r.json().get("videos", [])
        return videos
    except Exception as e:
        print(f"  [!] Error buscando videos: {e}")
        return []


def get_popular_videos(api_key, per_page=5):
    """Obtiene videos populares de Pexels como fallback."""
    headers = {"Authorization": api_key}
    try:
        r = requests.get(
            f"{PEXELS_BASE}/popular",
            headers=headers,
            params={"per_page": per_page},
            timeout=15,
        )
        return r.json().get("videos", [])
    except Exception:
        return []


def pick_best_file(video, prefer_portrait=True):
    """Selecciona el archivo de video de mejor calidad disponible."""
    files = video.get("video_files", [])
    if not files:
        return None

    if prefer_portrait:
        portrait = [f for f in files if f.get("height", 0) > f.get("width", 0)]
        if portrait:
            files = portrait

    # Ordenar por resolución (mayor primero) pero limitar a HD para no tardar mucho
    files_hd = [f for f in files if f.get("height", 0) <= 1920]
    files_sorted = sorted(files_hd or files, key=lambda x: x.get("width", 0) * x.get("height", 0), reverse=True)
    return files_sorted[0] if files_sorted else None


def download_video(video, output_path):
    """Descarga el video al disco."""
    best = pick_best_file(video)
    if not best:
        raise ValueError("No se encontró archivo de video descargable")

    url = best["link"]
    print(f"     Descargando ({best.get('width')}x{best.get('height')})...")

    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in r.iter_content(chunk_size=65536):
            f.write(chunk)

    return output_path
