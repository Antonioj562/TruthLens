from flask import Blueprint, request, jsonify
from app.services.model_service import predict_article
from pymongo.errors import PyMongoError
from app.database.db import predictions_collection, is_db_available
from datetime import datetime
from app.utils.auth import get_current_user

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/predict", methods=["POST"])
def predict():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    result = predict_article(text)

    prediction_id = None
    if is_db_available():
        try:
            inserted = predictions_collection.insert_one({
                "text": text[:5000],  # truncate long text
                "prediction": result["label"].lower(),
                "probability": result["probability"],
                "user_id": str(user["_id"]),
                "created_at": datetime.utcnow()
            })
            prediction_id = str(inserted.inserted_id)
        except PyMongoError:
            pass

    return jsonify({**result, "prediction_id": prediction_id})