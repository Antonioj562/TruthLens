from flask import Blueprint, jsonify
from pymongo.errors import PyMongoError

from app.database.db import feedback_collection, is_db_available, predictions_collection
from app.utils.auth import get_current_user

user_bp = Blueprint("user", __name__)


@user_bp.route("/me/stats", methods=["GET"])
def my_stats():
    if not is_db_available():
        return jsonify({"error": "Database unavailable"}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = str(user["_id"])

    try:
        total_predictions = predictions_collection.count_documents({"user_id": user_id})
        fake = predictions_collection.count_documents({"user_id": user_id, "prediction": "fake"})
        total_feedback = feedback_collection.count_documents({"user_id": user_id})
        correct_feedback = feedback_collection.count_documents({"user_id": user_id, "user_feedback": "correct"})
    except PyMongoError:
        return jsonify({"error": "Failed to load stats"}), 500

    fake_percentage = round((fake / total_predictions) * 100, 2) if total_predictions > 0 else 0
    accuracy = round((correct_feedback / total_feedback) * 100, 2) if total_feedback > 0 else 0

    return jsonify(
        {
            "total_predictions": total_predictions,
            "fake_percentage": fake_percentage,
            "feedback_count": total_feedback,
            "accuracy": accuracy,
        }
    )


@user_bp.route("/me/history", methods=["GET"])
def my_history():
    if not is_db_available():
        return jsonify({"error": "Database unavailable"}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = str(user["_id"])

    try:
        cursor = predictions_collection.find({"user_id": user_id}).sort("created_at", -1).limit(25)
        history = []
        for item in cursor:
            prediction_id = str(item["_id"])
            feedback = feedback_collection.find_one({"prediction_id": prediction_id})
            history.append(
                {
                    "id": prediction_id,
                    "text_preview": (item.get("text", "") or "")[:180],
                    "prediction": item.get("prediction"),
                    "probability": item.get("probability"),
                    "created_at": item.get("created_at").isoformat() if item.get("created_at") else None,
                    "feedback": feedback.get("user_feedback") if feedback else None,
                }
            )
    except PyMongoError:
        return jsonify({"error": "Failed to load history"}), 500

    return jsonify({"items": history})
