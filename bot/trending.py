import requests
import random

HEADERS = {"User-Agent": "VideoBot/1.0 (content automation)"}


def get_reddit_trending(subreddits, limit=20):
    """
    Obtiene posts virales de Reddit sin necesitar cuenta ni API key.
    Reddit permite acceder a JSON público libremente.
    """
    topics = []
    for sub in subreddits:
        try:
            url = f"https://www.reddit.com/r/{sub}/hot.json"
            r = requests.get(url, headers=HEADERS, params={"limit": limit}, timeout=10)
            if r.status_code != 200:
                continue
            posts = r.json()["data"]["children"]
            for post in posts:
                d = post["data"]
                if d.get("is_video") or d.get("stickied"):
                    continue
                topics.append({
                    "title": d["title"],
                    "subreddit": d["subreddit"],
                    "score": d["score"],
                    "search_query": _extract_keywords(d["title"]),
                })
        except Exception as e:
            print(f"  [!] Error en r/{sub}: {e}")
    # Ordenar por score y devolver los más virales
    topics.sort(key=lambda x: x["score"], reverse=True)
    return topics


def _extract_keywords(title):
    """Extrae palabras clave del título para buscar en Pexels."""
    stop_words = {
        "the", "a", "an", "is", "in", "on", "at", "to", "for", "of",
        "and", "or", "but", "with", "this", "that", "was", "are", "be",
        "it", "he", "she", "they", "my", "i", "you", "we", "how", "why",
        "what", "when", "who", "just", "not", "from", "by", "after",
    }
    words = title.lower().split()
    keywords = [w.strip(".,!?\"'()[]") for w in words if w not in stop_words and len(w) > 3]
    # Devolver máximo 3 keywords
    return " ".join(keywords[:3]) if keywords else "viral moment"
