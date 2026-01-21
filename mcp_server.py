import sys
import json
from tools.gmail import (
    fetch_messages,
    get_message_details,
    build_email_summary
)

# -------------------------------------
# Tool registry
# -------------------------------------
def fetch_job_emails(limit: int = 5):
    messages = fetch_messages(max_results=limit)
    results = []

    for m in messages:
        details = get_message_details(m["id"])
        summary = build_email_summary(details)
        results.append(summary)

    return results


TOOLS = {
    "fetch_job_emails": {
        "description": "Fetch recent job or interview related emails from Gmail",
        "input_schema": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "description": "Number of emails to fetch",
                    "default": 5
                }
            }
        },
        "handler": fetch_job_emails
    }
}

# -------------------------------------
# MCP stdio loop
# -------------------------------------
def main():
    for line in sys.stdin:
        request = json.loads(line)

        method = request.get("method")
        request_id = request.get("id")

        try:
            # Tool call
            if method == "tools/call":
                name = request["params"]["name"]
                args = request["params"].get("arguments", {})

                tool = TOOLS[name]
                result = tool["handler"](**args)

                response = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": result
                }

            # Tool listing
            elif method == "tools/list":
                response = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": [
                        {
                            "name": name,
                            "description": tool["description"],
                            "input_schema": tool["input_schema"]
                        }
                        for name, tool in TOOLS.items()
                    ]
                }

            else:
                raise ValueError(f"Unknown method: {method}")

        except Exception as e:
            response = {
                "jsonrpc": "2.0",
                "id": request_id,
                "error": {
                    "message": str(e)
                }
            }

        sys.stdout.write(json.dumps(response) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
