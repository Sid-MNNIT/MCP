"""
Planner (GPT-4o-mini)
====================

Uses OpenAI chat.completions with a strict JSON-only prompt to decide:
- CHAT vs ACTION
- Which pipeline from PIPELINE_REGISTRY
- Extract arguments safely
"""

from typing import Dict, Any, List, Optional
import json

from client.ask_jobsy.registry.pipeline_registry import PIPELINE_REGISTRY
from client.llm.openai_client import get_openai_client, get_openai_model


# -------------------------------------------------
# Helpers
# -------------------------------------------------

def _build_registry_prompt() -> str:
    blocks = []
    for name, cfg in PIPELINE_REGISTRY.items():
        blocks.append(
            f"""
Pipeline name: {name}
Description: {cfg['description']}
Risk level: {cfg['risk']}
Required arguments: {cfg['required_args']}
Optional arguments: {cfg['optional_args']}
"""
        )
    return "\n".join(blocks)


def _build_context_prompt(context: List[Dict[str, Any]]) -> str:
    if not context:
        return "No prior conversation."
    return "\n".join(f"{t['role']}: {t['content']}" for t in context)


def _find_missing_args(pipeline_name: str, args: Dict[str, Any]) -> List[str]:
    required = PIPELINE_REGISTRY[pipeline_name]["required_args"]
    return [k for k in required if k not in args or args[k] in ("", None)]


# -------------------------------------------------
# Main planner
# -------------------------------------------------

async def planner_decide(
    user_message: str,
    conversation_context: Optional[List[Dict[str, Any]]] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    conversation_context = conversation_context or []
    metadata = metadata or {}

    client = get_openai_client()
    model = get_openai_model()  # should be gpt-4o-mini

    registry_prompt = _build_registry_prompt()
    context_prompt = _build_context_prompt(conversation_context)

    system_prompt = f"""
You are Jobsy Planner, a strict routing agent.

Your job is to decide whether the user intent is:
- CHAT (pure conversation, no system action)
- ACTION (execute exactly one pipeline)

--------------------------------------------------
RULES (DO NOT BREAK)
--------------------------------------------------
1. You MUST output VALID JSON ONLY.
2. Do NOT include explanations outside JSON.
3. NEVER invent pipelines or arguments.
4. If intent matches a pipeline, return ACTION
   EVEN IF required arguments are missing.
5. Choose EXACTLY ONE pipeline for ACTION.

--------------------------------------------------
AVAILABLE PIPELINES
--------------------------------------------------
{registry_prompt}

--------------------------------------------------
CONVERSATION CONTEXT
--------------------------------------------------
{context_prompt}

--------------------------------------------------
RESPONSE FORMAT (JSON ONLY)
--------------------------------------------------
{{
  "type": "CHAT | ACTION",
  "pipeline": "<pipeline_name or null>",
  "args": {{}},
  "confidence": 0.0,
  "reasoning": "Short explanation"
}}

--------------------------------------------------
EXAMPLES
--------------------------------------------------

User: hi
{{
  "type": "CHAT",
  "pipeline": null,
  "args": {{}},
  "confidence": 0.9,
  "reasoning": "User is greeting."
}}

User: Find me Python jobs in Bangalore
{{
  "type": "ACTION",
  "pipeline": "job_search",
  "args": {{
    "keywords": "Python",
    "location": "Bangalore"
  }},
  "confidence": 0.95,
  "reasoning": "User wants Python jobs in Bangalore."
}}

User: Reply to the recruiter email
{{
  "type": "ACTION",
  "pipeline": "email_reply_preview",
  "args": {{}},
  "confidence": 0.7,
  "reasoning": "User wants to reply to an email but did not specify message ID."
}}

Respond with JSON ONLY.
"""

    # -------------------------------------------------
    # OpenAI call (stable + deterministic)
    # -------------------------------------------------
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0,
        max_tokens=300,
    )

    raw_text = response.choices[0].message.content.strip()

    # -------------------------------------------------
    # Parse JSON safely
    # -------------------------------------------------
    try:
        decision = json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "type": "CHAT",
            "pipeline": None,
            "endpoint": None,
            "args": {},
            "missing": [],
            "risk": None,
            "requires_confirmation": False,
            "confidence": 0.4,
            "reasoning": "Planner could not parse model output",
        }

    # -------------------------------------------------
    # CHAT intent
    # -------------------------------------------------
    if decision.get("type") == "CHAT":
        return {
            "type": "CHAT",
            "pipeline": None,
            "endpoint": None,
            "args": {},
            "missing": [],
            "risk": None,
            "requires_confirmation": False,
            "confidence": decision.get("confidence", 0.6),
            "reasoning": decision.get("reasoning", "Conversational intent"),
        }

    # -------------------------------------------------
    # ACTION intent
    # -------------------------------------------------
    pipeline_name = decision.get("pipeline")

    if pipeline_name not in PIPELINE_REGISTRY:
        return {
            "type": "CHAT",
            "pipeline": None,
            "endpoint": None,
            "args": {},
            "missing": [],
            "risk": None,
            "requires_confirmation": False,
            "confidence": 0.3,
            "reasoning": "Invalid or unknown pipeline selected",
        }

    pipeline_cfg = PIPELINE_REGISTRY[pipeline_name]
    args = decision.get("args", {}) or {}

    missing_args = _find_missing_args(pipeline_name, args)

    return {
        "type": "ACTION",
        "pipeline": pipeline_name,
        "endpoint": pipeline_cfg["endpoint"],
        "args": args,
        "missing": missing_args,
        "risk": pipeline_cfg["risk"],
        "requires_confirmation": pipeline_cfg.get("requires_confirmation", False),
        "confidence": decision.get("confidence", 0.8),
        "reasoning": decision.get("reasoning", f"Matched pipeline '{pipeline_name}'"),
    }
