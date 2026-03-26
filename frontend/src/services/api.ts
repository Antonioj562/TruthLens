import { AuthResponse } from "../types/auth";
import {
  AccountStats,
  FeedbackPayload,
  HistoryResponse,
  PredictionResponse,
} from "../types/prediction";

const BASE_URL = "https://truth-lens-backend-ruddy.vercel.app"; // Flask backend

async function errorMessageFromResponse(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (typeof data?.error === "string" && data.error) return data.error;
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await errorMessageFromResponse(res));
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await errorMessageFromResponse(res));
  return res.json();
}

export async function predictArticle(text: string, token: string): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}

export async function sendFeedback(payload: FeedbackPayload, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorMessageFromResponse(res));
}

export async function getAnalytics(token: string): Promise<AccountStats> {
  const res = await fetch(`${BASE_URL}/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return res.json();
}

export async function getHistory(token: string): Promise<HistoryResponse> {
  const res = await fetch(`${BASE_URL}/me/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }
  return res.json();
}