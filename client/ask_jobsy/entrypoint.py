from typing import Optional, Dict, Any

from client.ask_jobsy.planner import planner_decide
from client.ask_jobsy.executor import run_pipeline
from client.ask_jobsy.validator import validate_plan
from client.ask_jobsy.memory import (
    get_conversation_context,
    save_conversation_turn,
)


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

    Flow:
    User → Planner → Validator → Executor → Memory
    """

    metadata = metadata or {}

 
    conversation_context = get_conversation_context(conversation_id)


    plan = await planner_decide(
        user_message=user_message,
        conversation_context=conversation_context,
        metadata=metadata,
    )

   
    if plan["type"] == "CHAT":
        # Generate a real conversational reply using the LLM
        from client.llm.openai_client import get_openai_client, get_openai_model
        client = get_openai_client()
        model = get_openai_model()

        context_messages = [
            {"role": t["role"], "content": t["content"]}
            for t in conversation_context
        ]

        chat_response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Jobsy AI, a friendly and knowledgeable job search assistant. "
                        "Help the user with their job search, career advice, interview tips, "
                        "resume guidance, and anything related to finding a job. "
                        "Be concise, warm, and helpful."
                    ),
                },
                *context_messages,
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
            max_tokens=500,
        )

        reply = chat_response.choices[0].message.content.strip()

        save_conversation_turn(
            conversation_id=conversation_id,
            user_message=user_message,
            assistant_message=reply,
        )

        return {
            "response": reply,
            "conversation_id": conversation_id,
            "metadata": {"plan": plan},
        }


    validation = validate_plan(plan)

    if validation["status"] == "BLOCKED":
        save_conversation_turn(
            conversation_id=conversation_id,
            user_message=user_message,
            assistant_message=validation["message"],
        )

        return {
            "response": validation["message"],
            "conversation_id": conversation_id,
            "metadata": {"plan": plan},
        }

    if validation["status"] == "NEEDS_CONFIRMATION":
        save_conversation_turn(
            conversation_id=conversation_id,
            user_message=user_message,
            assistant_message=validation["message"],
        )

        return {
            "response": validation["message"],
            "conversation_id": conversation_id,
            "metadata": {"plan": plan},
        }

    # -----------------------------
    # 5. Execute pipeline
    # -----------------------------
    result = await run_pipeline(
        pipeline_name=plan["pipeline"],
        endpoint=plan["endpoint"],
        args=plan["args"],
        jwt=jwt,
    )

    # -----------------------------
    # 6. Summarize result into human-readable reply
    # -----------------------------
    from client.llm.openai_client import get_openai_client, get_openai_model
    import json as _json

    _client = get_openai_client()
    _model = get_openai_model()

    try:
        result_text = _json.dumps(result, indent=2) if isinstance(result, dict) else str(result)
    except Exception:
        result_text = str(result)

    summary_response = _client.chat.completions.create(
        model=_model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Jobsy AI, a friendly job search assistant. "
                    "The user asked a question and a backend pipeline ran and returned data. "
                    "Summarize the pipeline result in a clear, concise, friendly message for the user. "
                    "Do not show raw JSON. Highlight the most important information. "
                    "If it's a list of jobs, summarize the top ones. "
                    "If it's emails, summarize key details. "
                    "Keep it conversational and under 300 words."
                ),
            },
            {"role": "user", "content": f"User asked: {user_message}"},
            {"role": "assistant", "content": f"Pipeline result data:\n{result_text}"},
            {"role": "user", "content": "Now summarize this result in a friendly, readable way."},
        ],
        temperature=0.5,
        max_tokens=600,
    )

    human_reply = summary_response.choices[0].message.content.strip()

    # -----------------------------
    # 7. Persist memory
    # -----------------------------
    save_conversation_turn(
        conversation_id=conversation_id,
        user_message=user_message,
        assistant_message=human_reply,
    )

    # -----------------------------
    # 8. Final response
    # -----------------------------
    return {
        "response": human_reply,
        "conversation_id": conversation_id,
        "metadata": {"plan": plan},
    }
