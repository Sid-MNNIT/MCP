import redis

redis_client = redis.Redis(
    host="localhost",
    port=6380,
    decode_responses=True,
    socket_connect_timeout=5,
)

# hard fail if wrong
redis_client.ping()
print("🟢 Redis connected to jobsy-redis")
