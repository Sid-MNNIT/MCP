from client.ask_jobsy.memory import (
    save_conversation_turn,
    get_conversation_context,
)

save_conversation_turn(
    conversation_id="12345",
    user_message="Hey when is my interview",
    assistant_message="It is on Sunday",
)

context = get_conversation_context("12345")
print(context)
