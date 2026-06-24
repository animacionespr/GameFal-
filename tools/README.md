# TikTok Viral Finder

Script personal para encontrar videos virales de Gaming y Humor en TikTok.

## Setup (una sola vez)

```bash
pip3 install requests
```

1. Ve a https://rapidapi.com y crea una cuenta gratis
2. Busca **"tiktok-scraper7"** y suscríbete (tiene tier gratis)
3. Copia tu API Key y pégala en `tiktok_viral.py` donde dice `TU_API_KEY_AQUI`

## Uso diario

```bash
cd tools
python3 tiktok_viral.py
```

## Qué te muestra

- Top 10 videos virales confirmados (Gaming + Humor)
- Vistas, likes, shares y score de viralidad
- Link directo al video en TikTok
- Guarda los resultados en un archivo JSON con la fecha

## Criterios de viralidad

Un video se considera viral si tiene:
- Mínimo 500,000 vistas
- Mínimo 50,000 likes
- Ratio shares/vistas > 3%
