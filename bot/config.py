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
UPLOAD_TO_TIKTOK = False

# --- Twitch API (GRATIS en dev.twitch.tv) ---
# 1. Ve a https://dev.twitch.tv/console/apps → "Register Your Application"
# 2. Copia Client ID y genera un Client Secret
TWITCH_CLIENT_ID = "YOUR_TWITCH_CLIENT_ID"
TWITCH_CLIENT_SECRET = "YOUR_TWITCH_CLIENT_SECRET"

# --- Groq API — Scripts con IA (GRATIS en console.groq.com) ---
# Modelo llama3 ultra rápido, gratis para siempre
GROQ_API_KEY = "YOUR_GROQ_API_KEY"

# --- ElevenLabs — Voz personalizada (gratis: 10,000 chars/mes) ---
# https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY"
ELEVENLABS_VOICE_ID = ""  # Corre find_voice.py para obtener el ID

# Voz de respaldo gratuita (edge-tts, sin API key)
TTS_VOICE = "es-MX-JorgeNeural"

# Cuántos videos crear por ejecución
VIDEOS_PER_RUN = 1

# Duración del video en segundos
VIDEO_DURATION = 30

# Temas fallback si Twitch no está configurado
VIDEO_TOPICS = ["gameplay", "esports highlights", "gaming moments", "pc gameplay", "console gameplay"]

# Reddit (opcional)
REDDIT_SUBREDDITS = ["gaming", "pcgaming", "ps5", "xboxone", "nintendo"]

# Categoría YouTube (20 = Gaming)
YOUTUBE_CATEGORY = "20"

# Nombre de tu canal para el watermark
CHANNEL_NAME = "@TuCanal"
