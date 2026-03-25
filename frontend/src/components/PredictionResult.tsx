import { PredictionResponse } from "../types/prediction";

type Props = { result: PredictionResponse | null };

export default function PredictionResult({ result }: Props) {
  if (!result) return null;

  const percent = Math.round(result.probability * 100);
  const fillColor = percent > 50 ? "#ef4444" : "#22c55e";

  return (
    <div className="result-card">
      <h2>{result.label}</h2>
      <p>Confidence: {percent}%</p>

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