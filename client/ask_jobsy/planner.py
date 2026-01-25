from typing import List, Dict, Optional
from client.llm.llm_service import classify_request_requirements

async def planner_decide(
    user_message: str,
    conversation_context: Optional[List[Dict]] = None,
    metadata: Optional[dict] = None,
):
    """
    Planner that uses Groq LLM via the LLM service layer.
    """

    conversation_context = conversation_context or []
    metadata = metadata or {}

    # 🔹 Convert structured context → string (LLMs like this)
    context_text = "\n".join(
        f"{turn['role']}: {turn['content']}"
        for turn in conversation_context
    )

    # 🔹 Call LLM service (SYNC call inside async function is OK)
    llm_result = classify_request_requirements(
        user_message=user_message,
        conversation_context=context_text,
    )

    requires_rag = bool(llm_result.get("requires_rag", False))
    requires_tools = bool(llm_result.get("requires_tools", False))
    intent = llm_result.get("intent", "KNOWLEDGE").upper()

    return {
        "intent": intent,
        "requires_rag": requires_rag,
        "requires_tools": requires_tools,
        "tool_name": "sample_pipeline" if requires_tools else None,
        "rag_collections": ["dbt_metadata"] if requires_rag else [],
        "confidence": 0.85,
    }
