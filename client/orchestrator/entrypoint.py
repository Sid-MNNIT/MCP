from client.backend_client.auth import set_current_jwt, clear_current_jwt
from client.orchestrator.planner import decide_workflow
from client.orchestrator.runner import run_workflow


async def handle_user_message(jwt_from_frontend: str, user_message: dict):
    """
    This is the ONLY entrypoint for user interaction.
    """

    try:
        # 🔐 Bind user identity
        set_current_jwt(jwt_from_frontend)

        # 🧠 LLM decides WHICH WORKFLOW
        workflow = decide_workflow(user_message)

        # 🔥 Run the workflow
        return await run_workflow(workflow, user_message)

    finally:
        clear_current_jwt()
