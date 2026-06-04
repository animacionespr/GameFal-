# =============================================
#  VIDEOBOT - CONFIGURACIÓN
#  Rellena tus API keys aquí (todas son gratis)
# =============================================

# Pexels API Key — Gratis en: https://www.pexels.com/api/
PEXELS_API_KEY = "rty7WNg80DS5bE4HqPTtzOouLiw1L4GwXbCbai0XpJLPraiC7FawMUyn"

# Archivo OAuth2 de YouTube — Gratis, ver SETUP.md
YOUTUBE_CLIENT_SECRETS = "client_secrets.json"

# ¿A qué plataformas subir?
UPLOAD_TO_YOUTUBE = False   # Requiere client_secrets.json
UPLOAD_TO_TIKTOK = False   # (requiere cuenta TikTok Business)

# --- Voz con ElevenLabs (gratis: 10,000 caracteres/mes en elevenlabs.io) ---
# Obtén tu API key en: https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY"

# ID de la voz que quieres usar (corre find_voice.py para buscar "Enrique Nieto")
ELEVENLABS_VOICE_ID = ""

# Voz de respaldo si ElevenLabs no está configurado (edge-tts, 100% gratis)
TTS_VOICE = "es-MX-JorgeNeural"  # voz masculina en español

# Cuántos videos crear por ejecución
VIDEOS_PER_RUN = 1

# Duración del video en segundos (30-60s = ideal para Shorts)
VIDEO_DURATION = 30  # mínimo 17s, 30s ideal para Shorts

# ¿Qué tipo de videos quieres crear?
VIDEO_TOPICS = ["gameplay", "video game gameplay", "esports highlights", "gaming moments", "game streaming", "pc gameplay", "console gameplay"]

# Reddit (opcional, si funciona en tu red)
REDDIT_SUBREDDITS = ["popular", "videos", "nextfuckinglevel", "interestingasfuck", "mildlyinteresting"]

# Categoría de YouTube (22 = People & Blogs, 24 = Entertainment, 28 = Science & Tech)
YOUTUBE_CATEGORY = "24"
