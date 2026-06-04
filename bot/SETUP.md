# VideoBot — Guía de instalación (todo gratis)

## Lo que necesitas

| Cosa | Costo | Tiempo |
|------|-------|--------|
| Python 3.9+ | Gratis | Ya lo tienes |
| Pexels API Key | Gratis | 2 min |
| Google Cloud (YouTube API) | Gratis | 10 min |
| ffmpeg | Gratis | 2 min |

---

## Paso 1 — Instalar dependencias

```bash
cd bot
pip install -r requirements.txt
```

También necesitas **ffmpeg** (lo usa moviepy):

- **Mac**: `brew install ffmpeg`
- **Windows**: Descarga desde https://ffmpeg.org/download.html y agrega al PATH
- **Linux**: `sudo apt install ffmpeg`

---

## Paso 2 — API Key de Pexels (2 min)

1. Ve a https://www.pexels.com/api/
2. Crea cuenta gratuita
3. Copia tu API Key
4. Abre `config.py` y reemplaza `YOUR_PEXELS_API_KEY`

---

## Paso 3 — Configurar YouTube API (10 min)

### 3.1 — Crear proyecto en Google Cloud

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo (ej: "VideoBot")
3. En el menú izquierdo → **APIs y servicios** → **Biblioteca**
4. Busca **YouTube Data API v3** → Habilitar

### 3.2 — Crear credenciales OAuth2

1. Ve a **APIs y servicios** → **Credenciales**
2. Click **+ Crear credenciales** → **ID de cliente de OAuth**
3. Tipo de aplicación: **Aplicación de escritorio**
4. Nombre: "VideoBot"
5. Descarga el JSON
6. Renómbralo a `client_secrets.json` y ponlo en la carpeta `bot/`

### 3.3 — Primera ejecución

La primera vez que corras el bot, se abrirá el navegador para que inicies sesión con tu cuenta de Google/YouTube y des permiso. Después se guarda automáticamente (`token.pickle`) y no vuelve a pedir permiso.

---

## Paso 4 — Personalizar

Abre `config.py` y ajusta:

- `VIDEOS_PER_RUN` = cuántos videos crear cada vez que lo ejecutas
- `VIDEO_DURATION` = duración en segundos (30-60 ideal para Shorts)
- `TTS_VOICE` = voz de narración
- En `main.py` línea del `watermark` — cambia `@TuCanal` por tu canal real

---

## Paso 5 — Ejecutar

```bash
cd bot
python main.py
```

---

## Automatizar (ejecutar cada día sin hacer nada)

### En Mac/Linux — cron job

```bash
crontab -e
# Agregar esta línea para ejecutar todos los días a las 10am:
0 10 * * * /usr/bin/python3 /ruta/a/bot/main.py >> /ruta/a/bot/log.txt 2>&1
```

### En Windows — Programador de tareas

Crear tarea que ejecute `python main.py` diariamente.

### En la nube — GitHub Actions (gratis)

Si pushas el repo a GitHub, puedes agregar un workflow `.github/workflows/daily.yml`:

```yaml
name: VideoBot Daily
on:
  schedule:
    - cron: '0 14 * * *'  # 10am Puerto Rico (UTC-4)
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pip install -r bot/requirements.txt && sudo apt install ffmpeg -y
      - run: python bot/main.py
        env:
          PEXELS_API_KEY: ${{ secrets.PEXELS_API_KEY }}
```

---

## Fuentes de videos royalty-free adicionales

- **Pexels**: https://pexels.com (usado por el bot)
- **Pixabay**: https://pixabay.com/api/ (también gratis)
- **Coverr**: https://coverr.co

## Qué significa "sin copyright"

Los videos de Pexels tienen licencia Pexels License — puedes usarlos comercialmente, no necesitas dar crédito (aunque es buena práctica). Son 100% seguros para monetización en YouTube.

## Consejos para monetizar más rápido

1. **Consistencia** — Sube 1-2 videos por día mínimo
2. **Shorts** — Los videos de 30-60s tienen más alcance ahora mismo
3. **Niche** — Elige un tema específico (naturaleza, datos curiosos, tecnología)
4. **Thumbnails** — Eventualmente agrega thumbnails personalizados
5. **Descripción** — El bot ya añade hashtags relevantes automáticamente
