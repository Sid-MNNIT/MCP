"""
Groq Client for resume_mcp (Drop-in replacement for HuggingFaceClient)

Goal:
- Provide the same interface as HF client: complete(prompt) -> dict
- Use Groq SDK internally (fast + reliable)
- Auto-load .env from repo root (Vinod-MCP/.env)
- Make JSON output strict for LLMScorer usage

Required env:
- GROQ_API_KEY

Optional env:
- GROQ_MODEL (default: llama-3.1-8b-instant)
"""

from __future__ import annotations

import os
import json
import re
from pathlib import Path
from typing import Optional, Dict, Any

# dotenv is optional but recommended
try:
    from dotenv import load_dotenv
except Exception:
    load_dotenv = None

# Groq SDK
try:
    from groq import Groq
except Exception as e:
    raise RuntimeError("Groq SDK not installed. Run: pip install groq") from e

# Locate repo root 
REPO_ROOT = Path(__file__).resolve().parents[3]
ENV_PATH = REPO_ROOT / ".env"

DEFAULT_MODEL = "llama-3.1-8b-instant"


def _load_env():
    """Load environment variables from repo root .env (if present)."""
    if load_dotenv is None:
        return
    if ENV_PATH.exists():
        load_dotenv(dotenv_path=ENV_PATH, override=False)


def _safe_parse_json(text: str) -> Dict[str, Any]:
    """
    Robust JSON extractor.
    Handles:
    - pure JSON
    - JSON inside markdown ```json ... ```
    - extra text around JSON
    """
    if not text:
        return {"feedback": [], "score_adjustment": 0}

    cleaned = text.strip()

    # Remove markdown code fences
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "").strip()

    # Try direct JSON
    try:
        obj = json.loads(cleaned)
        if isinstance(obj, dict):
            return obj
    except Exception:
        pass

    # Try regex extracting { ... }
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        return {"feedback": [], "score_adjustment": 0}

    try:
        return json.loads(match.group())
    except Exception:
        return {"feedback": [], "score_adjustment": 0}

# Prompting: Make output STRICT JSON
SYSTEM_JSON_ENFORCER = """
You are a strict JSON generator.

Rules:
- You MUST return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT add extra words.
- Do NOT add explanations.
- Output must be a single JSON object.
""".strip()


RESUME_ATS_ASSISTANT_SYSTEM = """
You are an ATS resume reviewer.

Your job:
- Give practical resume improvement feedback
- Adjust ATS score slightly if needed

Strict rules:
- Do NOT extract new skills
- Do NOT recalculate experience
- Do NOT override deterministic ATS logic
- Never output anything except JSON
""".strip()

# Groq Client wrapper 
class GroqClient:
    """
    Provides:
      complete(prompt:str) -> dict

    Designed to replace HuggingFaceClient so LLMScorer remains unchanged.
    """

    def __init__(self):
        _load_env()

        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise RuntimeError(f"GROQ_API_KEY not set (checked system env and {ENV_PATH})")

        self.model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)

        # singleton-like internal Groq SDK client
        self._client = Groq(api_key=self.api_key)

    def complete(self, prompt: str) -> dict:
        """
        Takes the already-built prompt from llm_scorer.py
        and returns parsed JSON dict:
          {feedback: [...], score_adjustment: int}
        """
        if not prompt or not isinstance(prompt, str):
            return {"feedback": [], "score_adjustment": 0}

        try:
            response = self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_JSON_ENFORCER},
                    {"role": "system", "content": RESUME_ATS_ASSISTANT_SYSTEM},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=300,
            )

            raw_text = response.choices[0].message.content.strip()
            parsed = _safe_parse_json(raw_text)

            # Guardrails
            feedback = parsed.get("feedback", [])
            if not isinstance(feedback, list):
                feedback = [str(feedback)]

            adj = parsed.get("score_adjustment", 0)
            try:
                adj = int(adj)
            except Exception:
                adj = 0

            # clamp
            adj = max(-10, min(10, adj))

            return {
                "feedback": feedback,
                "score_adjustment": adj,
            }

        except Exception:
            # Always fail safe, never crash ATS pipeline
            return {
                "feedback": ["LLM unavailable, ATS score used as-is"],
                "score_adjustment": 0,
            }
