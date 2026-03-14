import os, json, re
from pathlib import Path
from typing import Dict, Any

try:
    from dotenv import load_dotenv
except Exception:
    load_dotenv = None

try:
    from groq import Groq
except Exception as e:
    raise RuntimeError("Groq SDK not installed. Run: pip install groq") from e

REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_MODEL = "llama-3.1-8b-instant"

_SYSTEM = (
    "You are a strict JSON generator and ATS resume reviewer. "
    "Return ONLY valid JSON. No markdown. No explanation. "
    "Give practical improvement feedback. Do NOT extract skills or recalculate experience."
)


def _parse_json(text):
    if not text:
        return {}
    text = re.sub(r'^```[a-z]*\n?', '', text.strip()).rstrip('`').strip()
    try:
        return json.loads(text)
    except Exception:
        m = re.search(r"\{.*\}", text, re.DOTALL)
        try:
            return json.loads(m.group()) if m else {}
        except Exception:
            return {}


class GroqClient:
    def __init__(self):
        if load_dotenv:
            env = REPO_ROOT / ".env"
            if env.exists():
                load_dotenv(dotenv_path=env, override=False)
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise RuntimeError("GROQ_API_KEY not set")
        self.model   = os.getenv("GROQ_MODEL", DEFAULT_MODEL)
        self._client = Groq(api_key=self.api_key)

    def complete(self, prompt: str) -> Dict[str, Any]:
        if not prompt:
            return {"feedback": [], "score_adjustment": 0}
        try:
            resp = self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": _SYSTEM},
                    {"role": "user",   "content": prompt},
                ],
                temperature=0.2,
                max_tokens=800,
            )
            parsed = _parse_json(resp.choices[0].message.content)
            feedback = parsed.get("feedback", [])
            if not isinstance(feedback, list):
                feedback = [str(feedback)]
            adj = max(-10, min(10, int(parsed.get("score_adjustment", 0) or 0)))
            return {"feedback": feedback, "score_adjustment": adj}
        except Exception:
            return {"feedback": ["LLM unavailable, ATS score used as-is"], "score_adjustment": 0}
