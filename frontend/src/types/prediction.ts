export type PredictionResponse = {
  label: string;
  probability: number;
  prediction_id?: string | null;
};

export type FeedbackPayload = {
  prediction_id?: string | null;
  feedback: "correct" | "incorrect";
};

export type AccountStats = {
  total_predictions: number;
  fake_percentage: number;
  feedback_count: number;
  accuracy: number;
};

export type HistoryItem = {
  id: string;
  text_preview: string;
  prediction: string;
  probability: number;
  created_at: string | null;
  feedback: "correct" | "incorrect" | null;
};

export type HistoryResponse = {
  items: HistoryItem[];
};

export type AdminUserStats = {
  user_id: string;
  email: string;
  total_predictions: number;
  feedback_count: number;
  accuracy: number;
  fake_percentage: number;
};

export type AdminAnalyticsResponse = {
  overview: {
    user_count: number;
    total_predictions: number;
    feedback_count: number;
    verified_accuracy: number;
  };
  users: AdminUserStats[];
};
