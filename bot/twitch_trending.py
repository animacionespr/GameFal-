import requests

TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
TWITCH_API_BASE = "https://api.twitch.tv/helix"


def get_twitch_token(client_id, client_secret):
    r = requests.post(TWITCH_TOKEN_URL, params={
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials",
    }, timeout=10)
    r.raise_for_status()
    return r.json()["access_token"]


def get_trending_games(client_id, client_secret, limit=10):
    """Obtiene los juegos más vistos en Twitch ahora mismo."""
    try:
        token = get_twitch_token(client_id, client_secret)
        headers = {
            "Client-ID": client_id,
            "Authorization": f"Bearer {token}",
        }
        r = requests.get(
            f"{TWITCH_API_BASE}/games/top",
            headers=headers,
            params={"first": limit},
            timeout=10,
        )
        r.raise_for_status()
        games = r.json().get("data", [])
        topics = []
        for g in games:
            name = g["name"]
            topics.append({
                "title": f"{name} gameplay highlights",
                "subreddit": "gaming",
                "score": 9999,
                "search_query": f"{name} gameplay",
                "game_name": name,
            })
        return topics
    except Exception as e:
        print(f"  [!] Twitch error: {e}")
        return []


def get_trending_clips(client_id, client_secret, game_id, limit=5):
    """Obtiene clips virales de un juego específico."""
    try:
        token = get_twitch_token(client_id, client_secret)
        headers = {
            "Client-ID": client_id,
            "Authorization": f"Bearer {token}",
        }
        r = requests.get(
            f"{TWITCH_API_BASE}/clips",
            headers=headers,
            params={"game_id": game_id, "first": limit},
            timeout=10,
        )
        r.raise_for_status()
        return r.json().get("data", [])
    except Exception as e:
        print(f"  [!] Twitch clips error: {e}")
        return []
