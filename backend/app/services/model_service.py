import pickle
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # go to backend/

MODEL_PATH = BASE_DIR / "ml" / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "ml" / "vectorizer.pkl"
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(VECTORIZER_PATH, "rb") as f:
    vectorizer = pickle.load(f)

def predict_article(text: str):
    """Predict if a single article is fake or real"""
    vec = vectorizer.transform([text])
    pred_class = model.predict(vec)[0]
    pred_prob = model.predict_proba(vec)[0][1]  # probability of "real"

    label = "Real" if pred_class == 1 else "Fake"
    probability = round(float(pred_prob), 4)

    return {
        "label": label,
        "probability": probability
    }