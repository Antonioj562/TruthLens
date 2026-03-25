from flask import Blueprint, jsonify
from pymongo.errors import PyMongoError
from app.database.db import predictions_collection, is_db_available
from app.utils.auth import get_current_user

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/analytics", methods=["GET"])
def analytics():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if not is_db_available():
        return jsonify({
            "total_predictions": 0,
            "fake_percentage": 0,
            "warning": "MongoDB is unavailable. Start MongoDB to view stored analytics."
        }), 200

    try:
        user_id = str(user["_id"])
        total = predictions_collection.count_documents({"user_id": user_id})
        fake = predictions_collection.count_documents({"user_id": user_id, "prediction": "fake"})
        fake_percentage = round((fake / total) * 100, 2) if total > 0 else 0
    except PyMongoError:
        return jsonify({
            "total_predictions": 0,
            "fake_percentage": 0,
            "warning": "MongoDB query failed."
        }), 200

    return jsonify({
        "total_predictions": total,
        "fake_percentage": fake_percentage
    })