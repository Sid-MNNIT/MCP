import asyncio
from client.ask_jobsy.planner import planner_decide
from client.ask_jobsy.memory import get_conversation_context


async def test_planner():
    conversation_id = "12345"

    # 🔹 fetch real conversation context from Redis
    conversation_context = get_conversation_context(conversation_id)

    # 🔹 simulate a new user message
    user_message = "Why is it on Sunday?"

    result = await planner_decide(
        user_message=user_message,
        conversation_context=conversation_context,
        metadata={}
    )

    print("\n=== PLANNER RESULT ===")
    print(result)


if __name__ == "__main__":
    asyncio.run(test_planner())
