import os
import requests
from gmail_client import build_gmail_service
from dotenv import load_dotenv
load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")
SERVICE_KEY = os.getenv("SERVICE_KEY")

# In-memory cache (per MCP process)
_gmail_service_cache = {}


def get_gmail_service(user_id: str):
    """
    Returns a Gmail service for a given user.
    Token is fetched ONCE and cached.
    """



    if user_id in _gmail_service_cache:
        return _gmail_service_cache[user_id]

    # 🔐 Ask backend for access token
    res = requests.post(
        f"{BACKEND_URL}/internal/google/gmail/token",
        json={"userId": user_id},
        headers={"X-Service-Key": SERVICE_KEY},
        timeout=10
    )
    res.raise_for_status()

    access_token = res.json()["accessToken"]

    service = build_gmail_service(access_token)

    _gmail_service_cache[user_id] = service
    return service




