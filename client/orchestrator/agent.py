from client.orchestrator.tool_executor import get_all_tools
from client.llm.claude import get_llm

def run_agent(user_input: str):
    llm = get_llm()
    tools = get_all_tools()

    # later: planner decides which tool to call
    return {
        "llm": llm,
        "tools": tools,
        "input": user_input
    }
