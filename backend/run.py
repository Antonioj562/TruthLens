from pathlib import Path

from dotenv import load_dotenv

# Ensure env is loaded before any route imports pull in database/db.py.
_root = Path(__file__).resolve().parent
load_dotenv(_root / ".env")
load_dotenv(_root / "app" / "database" / ".env", override=True)

from app.app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)