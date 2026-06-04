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

# Voz para la narración (edge-tts, 100% gratis)
# Opciones: es-PR-KarinaNeural, es-MX-DaliaNeural, es-ES-ElviraNeural
TTS_VOICE = "es-PR-KarinaNeural"

# Cuántos videos crear por ejecución
VIDEOS_PER_RUN = 1

# Duración del video en segundos (30-60s = ideal para Shorts)
VIDEO_DURATION = 45

# ¿Qué tipo de videos quieres crear?
VIDEO_TOPICS = ["gaming setup", "video game", "esports", "gaming", "controller", "streamer", "pc gaming", "console gaming"]

# Reddit (opcional, si funciona en tu red)
REDDIT_SUBREDDITS = ["popular", "videos", "nextfuckinglevel", "interestingasfuck", "mildlyinteresting"]

# Categoría de YouTube (22 = People & Blogs, 24 = Entertainment, 28 = Science & Tech)
YOUTUBE_CATEGORY = "24"
