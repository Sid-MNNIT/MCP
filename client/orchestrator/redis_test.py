import json
from client.orchestrator.redis_client import redis_client

history = [
    {"role": "user", "content": "Hey tell me about my amazon interview"}
]

redis_client.set(
    "jobsy:conversation:12345",
    json.dumps(history)
)

print(redis_client.get("jobsy:conversation:12345"))
# print(redis_client.get("jobsy:poof"))