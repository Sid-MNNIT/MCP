from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

from auth.gmail_auth import SCOPES

BASE_DIR = Path(__file__).resolve().parent
CREDENTIALS_PATH = BASE_DIR / "credentials.json"
TOKEN_PATH = BASE_DIR / "token.json"

if __name__ == "__main__":
    flow = InstalledAppFlow.from_client_secrets_file(
        CREDENTIALS_PATH,
        SCOPES
    )
    creds = flow.run_local_server(port=0)
    TOKEN_PATH.write_text(creds.to_json())
    print("✅ Gmail OAuth completed successfully.")
