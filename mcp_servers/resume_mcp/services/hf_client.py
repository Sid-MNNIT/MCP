"""
Hugging Face Inference Client (Free-tier friendly)
"""

import os
import requests


class HuggingFaceClient:
    BASE_URL = "https://api-inference.huggingface.co/models"

    def __init__(self):
        self.token = os.getenv("HF_API_TOKEN")
        self.model = os.getenv(
            "HF_MODEL",
            "mistralai/Mistral-7B-Instruct-v0.2"
        )

        if not self.token:
            raise RuntimeError("HF_API_TOKEN not set")

    def complete(self, prompt: str) -> dict:
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

        payload = {
            "inputs": prompt,
            "parameters": {
                "temperature": 0.2,
                "max_new_tokens": 300,
                "return_full_text": False,
            },
        }

        resp = requests.post(
            f"{self.BASE_URL}/{self.model}",
            headers=headers,
            json=payload,
            timeout=40,
        )

        resp.raise_for_status()
        text = resp.json()[0]["generated_text"]

        return self._safe_parse(text)

    def _safe_parse(self, text: str) -> dict:
        import json
        import re

        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return {"feedback": [], "score_adjustment": 0}

        try:
            return json.loads(match.group())
        except Exception:
            return {"feedback": [], "score_adjustment": 0}
