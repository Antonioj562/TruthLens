from flask import Blueprint, request, jsonify
from pymongo.errors import PyMongoError
from app.database.db import feedback_collection, is_db_available
from datetime import datetime
from app.utils.auth import get_current_user

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST"])
def feedback():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    prediction_id = data.get("prediction_id")
    user_feedback = data.get("feedback")

    if user_feedback not in ["correct", "incorrect"]:
        return jsonify({"error": "Invalid feedback"}), 400

    if is_db_available():
        try:
            feedback_collection.insert_one({
                "prediction_id": prediction_id,
                "user_feedback": user_feedback,
                "user_id": str(user["_id"]),
                "created_at": datetime.utcnow()
            })
        except PyMongoError:
            pass

    return jsonify({"message": "Feedback submitted"})