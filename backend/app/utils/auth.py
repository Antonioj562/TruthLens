from typing import Optional

from flask import request

from app.database.db import users_collection


def get_bearer_token() -> Optional[str]:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    return auth_header.split(" ", 1)[1].strip()


def get_current_user():
    token = get_bearer_token()
    if not token:
        return None
    return users_collection.find_one({"token": token})
