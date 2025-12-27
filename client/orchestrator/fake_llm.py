def generate_fake_email_reply(prompt: str) -> str:
    """
    Deterministic replacement for LLM.
    Used ONLY for testing send_email pipeline.
    """

    return (
        "Thank you for sharing the update.\n\n"
        "I have reviewed the details and will take the necessary steps.\n"
        "Please let me know if any additional information is required.\n\n"
        "Best regards,"
    )
