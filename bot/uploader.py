import os
import pickle

try:
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    HAS_GOOGLE = True
except ImportError:
    HAS_GOOGLE = False

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
TOKEN_FILE = "token.pickle"


def _get_credentials(client_secrets_file):
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "rb") as f:
            creds = pickle.load(f)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file, SCOPES)
            # run_local_server abre el navegador para autenticarte (solo la primera vez)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(creds, f)

    return creds


def upload_youtube(video_path, title, description, tags, category_id, client_secrets_file):
    """
    Sube un video a YouTube.
    La primera vez abre el navegador para que des permiso.
    Después el token se guarda y no vuelve a pedir permiso.
    """
    if not HAS_GOOGLE:
        raise RuntimeError(
            "Librerías de Google no instaladas.\n"
            "Ejecuta: pip install google-api-python-client google-auth-oauthlib"
        )

    creds = _get_credentials(client_secrets_file)
    youtube = build("youtube", "v3", credentials=creds)

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": tags,
            "categoryId": category_id,
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(video_path, mimetype="video/mp4", chunksize=10 * 1024 * 1024, resumable=True)

    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            print(f"     Subiendo... {pct}%", end="\r")

    print()
    return response["id"]
