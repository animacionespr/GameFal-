#!/usr/bin/env python3
"""
Busca voces en ElevenLabs por nombre.
Uso: python3 find_voice.py
"""
import config

try:
    from elevenlabs.client import ElevenLabs
except ImportError:
    print("Instala elevenlabs: pip install elevenlabs")
    exit(1)

if config.ELEVENLABS_API_KEY == "YOUR_ELEVENLABS_API_KEY":
    print("Agrega tu ELEVENLABS_API_KEY en config.py")
    print("Gratis en: https://elevenlabs.io/app/settings/api-keys")
    exit(1)

client = ElevenLabs(api_key=config.ELEVENLABS_API_KEY)

search = input("¿Qué voz buscas? (ej: Enrique Nieto): ").strip().lower()

print(f"\nBuscando '{search}' en ElevenLabs...\n")

# Buscar en voces propias y compartidas
response = client.voices.get_all()
encontradas = []

for voice in response.voices:
    if search in voice.name.lower():
        encontradas.append(voice)

if not encontradas:
    print("No se encontró esa voz en tu biblioteca.")
    print("\nOpciones:")
    print("1. Ve a https://elevenlabs.io/voice-library y busca 'Enrique Nieto'")
    print("2. Agrégala a tu biblioteca y vuelve a correr este script")
    print("\nVoces disponibles en tu cuenta:")
    for v in response.voices[:10]:
        print(f"  ID: {v.voice_id} | Nombre: {v.name}")
else:
    print(f"✅ {len(encontradas)} voz(es) encontrada(s):\n")
    for v in encontradas:
        print(f"  Nombre : {v.name}")
        print(f"  ID     : {v.voice_id}")
        print(f"  Copia este ID en config.py → ELEVENLABS_VOICE_ID\n")
