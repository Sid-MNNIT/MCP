# client/backend_client/email_api.py
import os
import requests

BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")

def save_email(email: dict, jwt: str):
    if not jwt:
        raise RuntimeError("JWT is required for save_email")

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
