# Email decoding + parsing

'''decode_base64()
extract_headers()
extract_body()'''

# utils/email_utils.py
import base64

def decode_base64(data: str) -> str:
    if not data:
        return ""
    return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")


def extract_headers(headers):
    result = {}
    for h in headers:
        if h["name"] in ["From", "To", "Subject", "Date"]:
            result[h["name"].lower()] = h["value"]
    return result


def extract_body(payload):
    if "parts" in payload:
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain":
                return decode_base64(part["body"].get("data"))
        for part in payload["parts"]:
            if part["mimeType"] == "text/html":
                return decode_base64(part["body"].get("data"))
    return decode_base64(payload.get("body", {}).get("data"))
