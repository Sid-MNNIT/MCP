import redis

_r = redis.Redis(
    host="localhost",
    port=6380,
    decode_responses=True,
    socket_connect_timeout=2,
)

try:
    _r.ping()
    print("🟢 Redis connected on port 6380")
    redis_client = _r
except Exception as e:
    print(f"⚠️  Redis unavailable ({e}). Conversation memory disabled — chat still works.")
    redis_client = None
