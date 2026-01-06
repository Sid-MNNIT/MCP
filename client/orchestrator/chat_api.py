
from fastapi import FastAPI, Request, HTTPException
from client.orchestrator.entrypoint import handle_user_message

app = FastAPI()


@app.post("/chat")
async def chat(request: Request):
    """
    Entry point for user chat.
    """

   
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing JWT")

    jwt = auth.replace("Bearer ", "")

   
    body = await request.json()

    if "text" not in body:
        raise HTTPException(status_code=400, detail="text is required")
    
    print("🟢 /chat called")
    print("JWT (first 20 chars):", jwt[:20])


    
    response = await handle_user_message(jwt, body)

    
    return response
