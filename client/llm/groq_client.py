import os
from dotenv import load_dotenv


from groq import Groq
load_dotenv()


_client: Groq | None = None


def get_groq_client() -> Groq:
    """
    Returns a singleton Groq client.
    """
    global _client

    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY not set")

        _client = Groq(api_key=api_key)

    return _client
