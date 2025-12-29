import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")
JWT = os.getenv("BACKEND_JWT")

def save_emails(emails):
    if not JWT:
        raise RuntimeError("BACKEND_JWT missing in environment")

    res = requests.post(
        f"{BASE_URL}/api/emails",
        json=emails,
        headers={
            "Authorization": f"Bearer {JWT}",
            "Content-Type": "application/json"
        },
        timeout=10
    )

    res.raise_for_status()
    return res.json()
