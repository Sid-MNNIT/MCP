import json
from typing import List, Dict

from client.orchestrator.redis_client import redis_client

CONTEXT_TTL_SECONDS = 3600
MAX_TURNS = 10


def get_conversation_context(conversation_id: str | None) -> List[Dict]:
    if not conversation_id:
        return []

    key = f"jobsy:conversation:{conversation_id}"

    data = redis_client.get(key)
    if not data:
        return []

    return json.loads(data)


def save_conversation_turn(
    conversation_id: str | None,
    user_message: str,
    assistant_message: str,
):
    if not conversation_id:
        return

    key = f"jobsy:conversation:{conversation_id}"

    history = get_conversation_context(conversation_id)

    history.append({"role": "user", "content": user_message})
    history.append({"role": "assistant", "content": assistant_message})

    
    history = history[-(MAX_TURNS * 2):]

    redis_client.setex(
        key,
        CONTEXT_TTL_SECONDS,
        json.dumps(history),
    )
