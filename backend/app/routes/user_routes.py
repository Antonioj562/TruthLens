from flask import Blueprint, jsonify
from pymongo.errors import PyMongoError

from app.database.db import feedback_collection, is_db_available, predictions_collection, users_collection
from app.utils.auth import get_current_user, is_admin_user

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


@user_bp.route("/admin/stats", methods=["GET"])
def admin_stats():
    if not is_db_available():
        return jsonify({"error": "Database unavailable"}), 503

    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if not is_admin_user(user):
        return jsonify({"error": "Forbidden"}), 403

    try:
        users = list(users_collection.find({}, {"email": 1}))
        user_rows = []
        overview = {
            "user_count": 0,
            "total_predictions": 0,
            "feedback_count": 0,
            "verified_accuracy": 0,
        }
        total_correct_feedback = 0

        for account in users:
            user_id = str(account["_id"])
            total_predictions = predictions_collection.count_documents({"user_id": user_id})
            fake_predictions = predictions_collection.count_documents({"user_id": user_id, "prediction": "fake"})
            feedback_count = feedback_collection.count_documents({"user_id": user_id})
            correct_feedback = feedback_collection.count_documents({"user_id": user_id, "user_feedback": "correct"})

            fake_percentage = round((fake_predictions / total_predictions) * 100, 2) if total_predictions > 0 else 0
            accuracy = round((correct_feedback / feedback_count) * 100, 2) if feedback_count > 0 else 0

            user_rows.append(
                {
                    "user_id": user_id,
                    "email": account.get("email", "Unknown user"),
                    "total_predictions": total_predictions,
                    "feedback_count": feedback_count,
                    "accuracy": accuracy,
                    "fake_percentage": fake_percentage,
                }
            )

            overview["user_count"] += 1
            overview["total_predictions"] += total_predictions
            overview["feedback_count"] += feedback_count
            total_correct_feedback += correct_feedback

        overview["verified_accuracy"] = (
            round((total_correct_feedback / overview["feedback_count"]) * 100, 2)
            if overview["feedback_count"] > 0
            else 0
        )

        user_rows.sort(key=lambda item: (-item["total_predictions"], item["email"]))
    except PyMongoError:
        return jsonify({"error": "Failed to load admin stats"}), 500

    return jsonify({"overview": overview, "users": user_rows})
