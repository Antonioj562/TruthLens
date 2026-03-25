from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import os

# Load .env before MONGO_URI is read (Atlas URI lives here or in backend/.env).
_db_dir = Path(__file__).resolve().parent
_backend_dir = _db_dir.parent.parent
load_dotenv(_backend_dir / ".env")
load_dotenv(_db_dir / ".env", override=True)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Atlas cold starts can exceed 3s; keep a bit of headroom for dev.
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000, connectTimeoutMS=10000)
db = client["TruthLens"]
predictions_collection = db.predictions
feedback_collection = db.feedback
users_collection = db.users


def is_db_available() -> bool:
    try:
        client.admin.command("ping")
        return True
    except PyMongoError:
        return False