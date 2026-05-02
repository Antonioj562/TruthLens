import { PredictionResponse } from "../types/prediction";

type Props = { result: PredictionResponse | null };

export default function PredictionResult({ result }: Props) {
  if (!result) return null;

  const percent = Math.round(result.probability * 100);
  const fillColor = percent > 50 ? "#ef4444" : "#22c55e";
  const tone = percent > 50 ? "is-risk" : "is-clear";

  return (
    <div className={`result-card ${tone}`}>
      <div>
        <span className="result-kicker">Model verdict</span>
        <h2>{result.label}</h2>
      </div>
      <p className="result-confidence">{percent}% confidence</p>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
            background: fillColor,
          }}
        />
      </div>
    </div>
  );
}
