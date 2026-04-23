import os
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


def is_admin_user(user) -> bool:
    if not user:
        return False

    if user.get("is_admin") is True or user.get("role") == "admin":
        return True

    admin_emails = {
        email.strip().lower()
        for email in os.getenv("ADMIN_EMAILS", "").split(",")
        if email.strip()
    }
    user_email = (user.get("email") or "").strip().lower()
    return user_email in admin_emails
