import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials

# Minimal, safe, read-only access
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

def authenticate():
    """
    Handles Gmail OAuth2 authentication.
    Saves token locally after first login.
    """
    creds = None

    # Load existing token if present
    if os.path.exists("auth/token.json"):
        creds = Credentials.from_authorized_user_file(
            "auth/token.json", SCOPES
        )
        return creds

    # First-time OAuth flow
    flow = InstalledAppFlow.from_client_secrets_file(
        "auth/credentials.json",
        SCOPES
    )

    creds = flow.run_local_server(port=0)

    # Save token for future use
    with open("auth/token.json", "w") as token:
        token.write(creds.to_json())

    return creds
