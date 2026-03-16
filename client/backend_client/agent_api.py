import httpx
import os

BASE_URL = "http://localhost:5000"
SERVICE_KEY = os.getenv("SERVICE_KEY", "")

async def execute_tool(tool: str, args: dict, jwt: str = None, user_id: str = None):
    """
    Execute MCP tool - handles both user (JWT) and cron (user_id) flows
    """
    if not jwt and not user_id:
        raise RuntimeError("Either JWT or user_id is required for execute_tool")

    source = "cron" if (user_id and not jwt) else "user"    
    
    if source == "cron":
        print(f"🤖 [CRON] Executing tool: {tool} for user: {user_id}")
    else:
        print(f"👤 [USER] Executing tool: {tool} with JWT")

    headers = {
        "Content-Type": "application/json",
        "X-Service-Key": SERVICE_KEY,  # Always send service key
    }
    
    if jwt:
        headers["Authorization"] = f"Bearer {jwt}"

    if user_id:
        # Always send X-User-Id when available so Node's service-key bypass works
        headers["X-User-Id"] = str(user_id)

    if source == "cron":
        headers["X-Request-Source"] = "cron"
    
    payload = {"tool": tool, "args": args}
    
    if user_id:
        payload["userId"] = user_id

    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            f"{BASE_URL}/api/emails/execute",
            json=payload,
            headers=headers
        )

    if res.status_code >= 400:
        print("\n🔴 BACKEND ERROR RESPONSE")
        print("Status:", res.status_code)
        print("Body:", res.text)
        raise RuntimeError("Backend agent execution failed")

    return res.json()