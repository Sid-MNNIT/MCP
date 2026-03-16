# client/backend_client/email_api.py
import os
import requests

BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")
SERVICE_KEY = os.getenv("SERVICE_KEY", "")

def save_email(email: dict, jwt: str = None, user_id: str = None):
    
    if not jwt and not user_id:
        raise RuntimeError("Either JWT or user_id is required for save_email")

    headers = {
        "Content-Type": "application/json",
        "X-Service-Key": SERVICE_KEY,
    }
    payload = email.copy()
    
    if jwt:
        headers["Authorization"] = f"Bearer {jwt}"
    
    if user_id:
        # Cron flow: pass userId in header so the Node auth middleware
        # service-key bypass can identify the user without a JWT
        headers["X-User-Id"] = str(user_id)
        payload["userId"] = user_id

    res = requests.post(
        f"{BASE_URL}/api/emails",
        json=payload,
        headers=headers,
        timeout=10
    )

    res.raise_for_status()
    return res.json()