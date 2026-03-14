from langchain_mcp_adapters.client import MultiServerMCPClient
from client.mcp.server import SERVERS

# langchain-mcp-adapters 0.1.0+ removed context manager support.
# The new API: just instantiate and call get_tools() directly.
# We cache the client instance and the tools list separately.

_client: MultiServerMCPClient | None = None


async def get_mcp_client() -> MultiServerMCPClient:
    """
    Returns a singleton MultiServerMCPClient.
    In langchain-mcp-adapters >= 0.1.0, no __aenter__ is needed —
    just instantiate and call get_tools() / ainvoke() directly.
    """
    global _client
    if _client is None:
        _client = MultiServerMCPClient(SERVERS)
    return _client


async def close_mcp_client():
    """Reset the singleton on shutdown."""
    global _client
    _client = None
