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
      <div className="page-heading">
        <span className="eyebrow">Article classifier</span>
        <h1 className="title">Spot questionable news before it spreads.</h1>
        <p className="subtitle">
          Paste a news article and TruthLens will estimate whether the writing resembles real or fake news.
        </p>
      </div>

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

      <p className="footer-note">Use the result as a signal, then verify important claims with trusted sources.</p>
    </div>
  );
}
