from datetime import datetime
import secrets

from flask import Blueprint, jsonify, request
from pymongo.errors import PyMongoError
from werkzeug.security import check_password_hash, generate_password_hash

from app.database.db import is_db_available, users_collection

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/register", methods=["POST"])
def register():
    if not is_db_available():
        return jsonify({"error": "Database unavailable"}), 503

    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    try:
        existing = users_collection.find_one({"email": email})
        if existing:
            return jsonify({"error": "Email already registered"}), 409

        token = secrets.token_hex(24)
        user_doc = {
            "email": email,
            "password_hash": generate_password_hash(password),
            "token": token,
            "created_at": datetime.utcnow(),
        }
        users_collection.insert_one(user_doc)
    except PyMongoError:
        return jsonify({"error": "Failed to register user"}), 500

    return jsonify({"token": token, "user": {"email": email}}), 201


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    if not is_db_available():
        return jsonify({"error": "Database unavailable"}), 503

    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = users_collection.find_one({"email": email})
    except PyMongoError:
        return jsonify({"error": "Login failed"}), 500

    if not user or not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = secrets.token_hex(24)
    users_collection.update_one({"_id": user["_id"]}, {"$set": {"token": token}})

    return jsonify({"token": token, "user": {"email": email}})
