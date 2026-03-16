from pathlib import Path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# Google Calendar scope
SCOPES = ["https://www.googleapis.com/auth/calendar"]

# Always resolve paths relative to this file
BASE_DIR = Path(__file__).parent
TOKEN_FILE = BASE_DIR / "token.json"
CREDENTIALS_FILE = BASE_DIR / "credentials.json"


def get_calendar_credentials():
    creds = None

    # Load existing token if present and non-empty
    if TOKEN_FILE.exists() and TOKEN_FILE.stat().st_size > 10:
        try:
            creds = Credentials.from_authorized_user_file(
                TOKEN_FILE, SCOPES
            )
        except Exception:
            creds = None  # Invalid token file, will re-auth

    # If no valid creds, do OAuth
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE,
                SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Save token for future runs
        TOKEN_FILE.write_text(creds.to_json())

    return creds