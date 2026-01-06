# client/backend_client/email_api.py

import os
import requests
from client.backend_client.auth import get_current_jwt

BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")

def save_email(email: dict):
    jwt = get_current_jwt()
    if not jwt:
        raise RuntimeError("JWT not set. Call set_current_jwt() first.")

    res = requests.post(
        f"{BASE_URL}/api/emails",
        json=email,
        headers={
            "Authorization": f"Bearer {jwt}",
            "Content-Type": "application/json"
        },
        timeout=10
    )

    res.raise_for_status()
    return res.json()
