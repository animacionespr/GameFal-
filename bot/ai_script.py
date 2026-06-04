import requests

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def generate_gaming_script(game_name, groq_api_key):
    """
    Genera un guión único de 3-4 oraciones para un video de gaming
    usando Groq (gratis en groq.com — llama3 ultra rápido).
    """
    if not groq_api_key or groq_api_key == "YOUR_GROQ_API_KEY":
        return None

    prompt = (
        f"Escribe exactamente 3 oraciones en español para narrar un video corto de YouTube Shorts "
        f"sobre el videojuego '{game_name}'. "
        f"Tono: emocionante, como un gamer apasionado. "
        f"Menciona el juego por nombre. "
        f"Termina pidiendo suscripción o like. "
        f"Solo las 3 oraciones, sin introducción ni explicación."
    )

    try:
        r = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
                "temperature": 0.8,
            },
            timeout=15,
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"  [!] Groq error: {e} — usando plantilla")
        return None
