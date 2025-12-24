from client.mcp.client import get_mcp_client

def get_all_tools():
    mcp_client = get_mcp_client()
    return mcp_client.get_tools()
