# TruthLens

TruthLens is a full-stack web application designed to detect potential misinformation in online news articles using machine learning. The system analyzes user-submitted article text and returns a prediction indicating whether the content is likely real or fake.



## Tech Stack

Frontend:
- React
- TypeScript
- Bun package manager

Backend:
- Python
- Flask

Database:
- MongoDB

Deployment:
- Vercel (frontend hosting)

Machine Learning:
- Scikit-learn
- TF-IDF Vectorization
- K-Nearest Neighbors (KNN)

## Running the Project Locally
Backend
Install dependencies:
```
$ pip install -r requirements.txt
```
Run the Flask server:
```
$ python run.py
```
Frontend

Install dependencies using Bun:
```
bun install
```
Run the development server:
```
bun run dev
```


## API Endpoints
### POST /predict

Analyze article text and return a prediction.

Request
```
{
  "text": "Article text..."
}
```
Response
```
{
  "label": "Fake",
  "probability": 0.82
}
```
### POST /feedback
Submit feedback about prediction accuracy.

### GET /analytics
Returns usage statistics and prediction metrics.



## MongoDB Data Structure
Collection: predictions
```
{
  _id: ObjectId,
  text: String,
  prediction: "fake" | "real",
  probability: Number,
  created_at: Date
}
```

Collection: feedback
```
{
  _id: ObjectId,
  prediction_id: ObjectId,
  user_feedback: "correct" | "incorrect",
  created_at: Date
}
```