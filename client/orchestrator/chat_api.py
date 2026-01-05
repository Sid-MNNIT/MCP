
from fastapi import FastAPI, Request, HTTPException
from client.orchestrator.entrypoint import handle_user_message

app = FastAPI()


@app.post("/chat")
async def chat(request: Request):
    """
    Entry point for user chat.
    """

    # 1️⃣ Extract JWT
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing JWT")

    jwt = auth.replace("Bearer ", "")

    # 2️⃣ Extract user message
    body = await request.json()

    if "text" not in body:
        raise HTTPException(status_code=400, detail="text is required")

    # 3️⃣ Run agent pipeline
    response = await handle_user_message(jwt, body)

    # 4️⃣ Return response to frontend
    return response
