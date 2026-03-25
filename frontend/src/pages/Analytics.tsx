import { useEffect, useState } from "react";
import { getAnalytics, getHistory } from "../services/api";
import { AccountStats, HistoryItem } from "../types/prediction";

type Props = {
  token: string;
};

export default function Analytics({ token }: Props) {
  const [data, setData] = useState<AccountStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAnalytics(token), getHistory(token)])
      .then(([stats, historyData]) => {
        setData(stats);
        setHistory(historyData.items);
      })
      .catch(() => setError("Could not load analytics right now."));
  }, [token]);

  if (error) {
    return (
      <div className="analytics-wrap">
        <p className="danger">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-wrap">
        <p className="loading">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-wrap">
      <h1 className="title">Analytics Dashboard</h1>

      <div className="analytics-grid">
        <div className="metric-card">
          <h2 className="metric-label">Total Predictions</h2>
          <p className="metric-value">{data.total_predictions}</p>
        </div>

        <div className="metric-card">
          <h2 className="metric-label">Fake News %</h2>
          <p className="metric-value danger">{data.fake_percentage}%</p>
        </div>

        <div className="metric-card">
          <h2 className="metric-label">Feedback Accuracy</h2>
          <p className="metric-value">{data.accuracy}%</p>
        </div>

        <div className="metric-card">
          <h2 className="metric-label">Feedback Count</h2>
          <p className="metric-value">{data.feedback_count}</p>
        </div>
      </div>

      <div className="history-panel">
        <h2 className="metric-label">Recent Article History</h2>
        {history.length === 0 && <p className="subtitle">No predictions yet.</p>}
        {history.map((item) => (
          <div key={item.id} className="history-row">
            <div>
              <p className="history-text">{item.text_preview || "(No text)"}</p>
              <p className="history-meta">
                Prediction: {item.prediction} | Confidence: {Math.round((item.probability || 0) * 100)}%
              </p>
            </div>
            <div className={item.feedback === "incorrect" ? "danger" : ""}>
              {item.feedback ? `Feedback: ${item.feedback}` : "No feedback"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}