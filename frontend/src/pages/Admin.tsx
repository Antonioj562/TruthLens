import { useEffect, useState } from "react";
import { getAdminAnalytics } from "../services/api";
import { AdminAnalyticsResponse } from "../types/prediction";

type Props = {
  token: string;
};

export default function Admin({ token }: Props) {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminAnalytics(token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load admin analytics."));
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
        <p className="loading">Loading admin analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-wrap">
      <h1 className="title">Admin Dashboard</h1>
      <p className="subtitle">View prediction totals, feedback activity, and fake-news rates across all accounts.</p>

      <div className="analytics-grid admin-overview-grid">
        <div className="metric-card">
          <h2 className="metric-label">Tracked Users</h2>
          <p className="metric-value">{data.overview.user_count}</p>
        </div>

        <div className="metric-card">
          <h2 className="metric-label">All Predictions</h2>
          <p className="metric-value">{data.overview.total_predictions}</p>
        </div>

        <div className="metric-card">
          <h2 className="metric-label">All Feedback</h2>
          <p className="metric-value">{data.overview.feedback_count}</p>
        </div>

        <div className="metric-card">
          <h2 className="metric-label">Verified Model Accuracy</h2>
          <p className="metric-value">{data.overview.verified_accuracy}%</p>
        </div>
      </div>

      <div className="history-panel admin-panel">
        <h2 className="metric-label">Account Breakdown</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Total Predictions</th>
                <th>Feedback Count</th>
                <th>Accuracy</th>
                <th>Fake News %</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((item) => (
                <tr key={item.user_id}>
                  <td>{item.email}</td>
                  <td>{item.total_predictions}</td>
                  <td>{item.feedback_count}</td>
                  <td>{item.accuracy}%</td>
                  <td className="danger">{item.fake_percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
