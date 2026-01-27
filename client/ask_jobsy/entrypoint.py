from typing import Optional, Dict, Any

from client.ask_jobsy.planner import planner_decide
from client.ask_jobsy.executor import run_pipeline
from client.ask_jobsy.memory import (
    get_conversation_context,
    save_conversation_turn,
)
from client.ask_jobsy.registry.pipeline_registry import PIPELINE_REGISTRY


# -------------------------------------------------
# Executor Validator
# -------------------------------------------------

def validate_execution(plan: Dict[str, Any]) -> None:
    """
    Hard validation before executing any pipeline.
    Raises ValueError if execution is unsafe.
    """

    if plan["type"] != "ACTION":
        raise ValueError("Execution attempted for non-ACTION plan")

    pipeline = plan.get("pipeline")
    if pipeline not in PIPELINE_REGISTRY:
        raise ValueError(f"Unknown pipeline: {pipeline}")

    cfg = PIPELINE_REGISTRY[pipeline]

    # Ensure required args are present
    missing = plan.get("missing", [])
    if missing:
        raise ValueError(
            f"Missing required arguments for '{pipeline}': {missing}"
        )

    # Confirmation guard
    if cfg.get("requires_confirmation") and not plan.get("confirmed", False):
        raise ValueError("Pipeline requires explicit confirmation")

    # Risk guard (future-proof)
    if cfg["risk"] == "HIGH":
        raise ValueError("High-risk pipeline blocked without approval")


# -------------------------------------------------
# Main Entrypoint
# -------------------------------------------------

async def handle_user_message(
    jwt: str,
    user_message: str,
    conversation_id: Optional[str],
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Core brain of Ask Jobsy.
    Planner → Validator → Executor → Memory
    """

    metadata = metadata or {}

    # -----------------------------
    # 1. Load conversation context
    # -----------------------------
    conversation_context = get_conversation_context(conversation_id)

    # -----------------------------
    # 2. Planner
    # -----------------------------
    plan = await planner_decide(
        user_message=user_message,
        conversation_context=conversation_context,
        metadata=metadata,
    )

    # -----------------------------
    # 3. CHAT intent (no execution)
    # -----------------------------
    if plan["type"] == "CHAT":
        save_conversation_turn(
            conversation_id=conversation_id,
            user_message=user_message,
            assistant_message=plan["reasoning"],
        )

        return {
            "response": plan["reasoning"],
            "conversation_id": conversation_id,
            "metadata": {"plan": plan},
        }

    # -----------------------------
    # 4. ACTION intent
    # -----------------------------
    try:
        validate_execution(plan)
    except ValueError as e:
        # Soft failure → ask follow-up instead of crashing
        save_conversation_turn(
            conversation_id=conversation_id,
            user_message=user_message,
            assistant_message=str(e),
        )

        return {
            "response": str(e),
            "conversation_id": conversation_id,
            "metadata": {"plan": plan},
        }

    # -----------------------------
    # 5. Execute pipeline
    # -----------------------------
    result = await run_pipeline(
        pipeline_name=plan["pipeline"],
        args=plan["args"],
        jwt=jwt,
        metadata=metadata,
    )

    # -----------------------------
    # 6. Persist memory
    # -----------------------------
    save_conversation_turn(
        conversation_id=conversation_id,
        user_message=user_message,
        assistant_message=str(result),
    )

    # -----------------------------
    # 7. Final response
    # -----------------------------
    return {
        "response": result,
        "conversation_id": conversation_id,
        "metadata": {"plan": plan},
    }
