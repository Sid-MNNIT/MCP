# client/orchestrator/entrypoint.py

from client.backend_client.auth import set_current_jwt, clear_current_jwt
from client.orchestrator.planner import decide_workflow
from client.orchestrator.runner import run_workflow


async def handle_user_message(jwt_from_frontend: str, payload: dict):
    """
    SINGLE entrypoint for all user interactions
    """

    try:
        # 1️⃣ Bind JWT to this request
        set_current_jwt(jwt_from_frontend)

        # 2️⃣ Decide workflow
        workflow = decide_workflow(payload)

        # 3️⃣ Run workflow
        return await run_workflow(workflow, payload)

    finally:
        # 4️⃣ Always clean JWT (even on error)
        clear_current_jwt()
