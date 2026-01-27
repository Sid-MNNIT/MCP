import httpx

BASE_URL = "http://localhost:5000"

async def execute_tool(tool: str, args: dict, jwt: str):
    if not jwt:
        raise RuntimeError("JWT is required for execute_tool")
    print(jwt,"Agent-api-py")

    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            f"{BASE_URL}/api/emails/execute",
            json={
                "tool": tool,
                "args": args
            },
            headers={
                "Authorization": f"Bearer {jwt}",
                "Content-Type": "application/json"
            }
        )

    if res.status_code >= 400:
        print("\n🔴 BACKEND ERROR RESPONSE")
        print("Status:", res.status_code)
        print("Body:", res.text)
        raise RuntimeError("Backend agent execution failed")

    return res.json()



