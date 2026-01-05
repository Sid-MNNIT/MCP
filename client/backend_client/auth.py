

_CURRENT_JWT = None

def set_current_jwt(jwt: str):
    global _CURRENT_JWT
    _CURRENT_JWT = jwt

def get_current_jwt() -> str:
    if not _CURRENT_JWT:
        raise RuntimeError("JWT not set in context")
    return _CURRENT_JWT

def clear_current_jwt():
    global _CURRENT_JWT
    _CURRENT_JWT = None
