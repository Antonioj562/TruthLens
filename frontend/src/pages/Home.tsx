import { useState } from "react";
import ArticleInput from "../components/ArticleInput";
import PredictionResult from "../components/PredictionResult";
import FeedbackButtons from "../components/FeedbackButtons";
import { predictArticle } from "../services/api";
import type { PredictionResponse } from "../types/prediction";

type Props = {
  token: string;
};

export default function Home({ token }: Props) {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (text: string) => {
    setLoading(true);
    try {
      const data = await predictArticle(text, token);
      setResult(data);
    } catch {
      console.error("Error analyzing article");
    }
    setLoading(false);
  };

  return (
    <div className="home-wrap">
      <h1 className="title">TruthLens</h1>
      <p className="subtitle">
        Analyze news articles using AI to determine if they are real or fake.
      </p>

      <div className="panel">
        <ArticleInput onSubmit={handleSubmit} loading={loading} />

        {loading && (
          <div className="loading">Analyzing article...</div>
        )}

        {result && (
          <div>
            <PredictionResult result={result} />
          </div>
        )}

        {result && (
          <div className="feedback-row">
            <FeedbackButtons
              token={token}
              predictionId={result.prediction_id ?? null}
              verdictLabel={result.label}
            />
          </div>
        )}
      </div>

      <p className="footer-note">Built for Fake News Detection</p>
    </div>
  );
}