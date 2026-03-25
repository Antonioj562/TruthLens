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