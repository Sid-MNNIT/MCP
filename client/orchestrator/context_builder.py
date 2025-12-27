

def build_email_prompt(reply_context: dict) -> str:
    """
    Builds a deterministic, safe prompt for the LLM
    to generate an email reply body.

    Input:
        reply_context: dict
            Output of draft_reply MCP tool
            (after wrapper cleaning)

    Output:
        str: Prompt string for LLM
    """


    required_keys = ["to", "subject", "originalEmail", "guidelines"]
    for key in required_keys:
        if key not in reply_context:
            raise ValueError(f"reply_context missing required key: {key}")

    original = reply_context["originalEmail"]
    guidelines = reply_context["guidelines"]


    sender = original.get("from", "Unknown sender")
    subject = original.get("subject", "No subject")
    date = original.get("date", "Unknown date")
    body = original.get("body", "").strip()

    tone = guidelines.get("tone", "professional")
    style = guidelines.get("style", "clear and polite")
    length = guidelines.get("length", "short")


    prompt = f"""
You are an assistant that writes high-quality email replies.

### ORIGINAL EMAIL
From: {sender}
Subject: {subject}
Date: {date}

Body:
{body}

### REPLY INSTRUCTIONS
- Tone: {tone}
- Style: {style}
- Length: {length}

### STRICT RULES
- Write ONLY the email body.
- Do NOT include the subject line.
- Do NOT include greetings (e.g., "Hi", "Hello").
- Do NOT include a signature or name.
- Do NOT mention that you are an AI.
- Keep the reply relevant and concise.

### TASK
Write a suitable reply to the email above.
""".strip()

    return prompt
