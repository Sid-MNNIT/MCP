# mcp_servers/gmail_mcp/auth/gmail_auth.py

from pathlib import Path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

BASE_DIR = Path(__file__).resolve().parent
TOKEN_PATH = BASE_DIR / "token.json"


def get_gmail_service():
    """
    Returns an authenticated Gmail service.

    ❗ OAuth must be completed beforehand by running:
       python -m auth.oauth_setup
    """

    if not TOKEN_PATH.exists():
        raise RuntimeError(
            "Gmail OAuth not completed. "
            "Run: python -m auth.oauth_setup"
        )

    creds = Credentials.from_authorized_user_file(
        TOKEN_PATH,
        SCOPES
    )

    # ✅ Safe, non-interactive refresh
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        TOKEN_PATH.write_text(creds.to_json())

    if not creds.valid:
        raise RuntimeError(
            "Invalid Gmail credentials. "
            "Delete token.json and re-run oauth setup."
        )

    return build("gmail", "v1", credentials=creds)
