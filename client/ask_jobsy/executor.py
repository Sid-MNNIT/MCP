# client/orchestrator/executor.py

async def run_tool(tool_name: str, metadata: dict, jwt: str):
    """
    Execute a whitelisted tool / pipeline.
    """

    if not tool_name:
        return None

    # NEVER allow arbitrary execution
    allowed_tools = {"sample_pipeline"}

    if tool_name not in allowed_tools:
        raise ValueError(f"Tool '{tool_name}' is not allowed")

    # Stub execution
    return {
        "tool": tool_name,
        "status": "success",
        "output": "Pipeline executed successfully (stub)"
    }
