import asyncio
from client.orchestrator.entrypoint import handle_user_message

JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTUwMzU3OWIyNGJmOGQ0ZTU3YzNiMjgiLCJlbWFpbCI6InJpdGlrQGV4YW1wbGUuY29tIiwiZnVsbG5hbWUiOiJSaXR2aWsgUmFpIiwiaWF0IjoxNzY3NzI4NjM5LCJleHAiOjE3Njc4MTUwMzl9.aLM37P1i5G0m_sx-YUqxHhrpQA6L_mR1_ZAZXFsiZDQ"

async def test_draft():
    payload = {
        "text": "draft a reply",
        "message_id": "19b939d1d2ae0a4b",
        "tone": "professional"
    }

    result = await handle_user_message(JWT, payload)
    print("\n✅ RESULT\n", result)


if __name__ == "__main__":
    asyncio.run(test_draft())
