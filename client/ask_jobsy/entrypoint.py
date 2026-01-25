# client/orchestrator/entrypoint.py

from typing import Optional, Dict, Any

from client.ask_jobsy.planner import planner_decide
from client.ask_jobsy.rag import run_rag
from client.ask_jobsy.executor import run_tool
from client.ask_jobsy.memory import (
    get_conversation_context,
    save_conversation_turn
)
#from client.as.responder import generate_final_response


async def handle_user_message(
    jwt: str,
    user_message: str,
    conversation_id: Optional[str],
    metadata: Dict[str, Any],
):
    """
    Core brain of Ask Jobsy.
    """


    conversation_context = get_conversation_context(conversation_id)

    plan = await planner_decide(
        user_message=user_message,
        conversation_context=conversation_context,
        metadata=metadata,
    )
   

    """
    plan example:
    {
        "intent": "KNOWLEDGE | ACTION | BOTH",
        "requires_rag": true,
        "requires_tools": false,
        "tool_name": null,
        "rag_collections": ["dbt_metadata"],
        "confidence": 0.91
    }
    """

    rag_context = None
    if plan["requires_rag"]:
        rag_context = await run_rag(
            query=user_message,
            collections=plan.get("rag_collections", []),
        )

    # -----------------------------
    # 4. MCP / Tool Execution
    # -----------------------------
    tool_result = None
    if plan["requires_tools"]:
        tool_result = await run_tool(
            tool_name=plan["tool_name"],
            metadata=metadata,
            jwt=jwt,
        )

    # -----------------------------
    # 5. Final Response LLM
    # -----------------------------
    final_response = await generate_final_response(
        user_message=user_message,
        conversation_context=conversation_context,
        rag_context=rag_context,
        tool_result=tool_result,
        plan=plan,
    )

    # -----------------------------
    # 6. Persist memory
    # -----------------------------
    save_conversation_turn(
        conversation_id=conversation_id,
        user_message=user_message,
        assistant_message=final_response,
    )

    return {
        "response": final_response,
        "conversation_id": conversation_id,
        "metadata": {
            "plan": plan,
        },
    }
