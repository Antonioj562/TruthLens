import { useEffect, useState } from "react";
import { sendFeedback } from "../services/api";

type Props = {
  token: string;
  predictionId: string | null;
  verdictLabel: string;
};

function formatVerdict(label: string) {
  const t = label.trim();
  if (!t) return "this article";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

export default function FeedbackButtons({ token, predictionId, verdictLabel }: Props) {
  const [selected, setSelected] = useState<"correct" | "incorrect" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedChoice, setSavedChoice] = useState<"correct" | "incorrect" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verdict = formatVerdict(verdictLabel);

  useEffect(() => {
    setSelected(null);
    setSubmitting(false);
    setSavedChoice(null);
    setError(null);
  }, [predictionId]);

  const handleClick = async (type: "correct" | "incorrect") => {
    if (savedChoice !== null || submitting) return;
    setSelected(type);
    setError(null);
    setSubmitting(true);
    try {
      await sendFeedback(
        {
          prediction_id: predictionId,
          feedback: type,
        },
        token
      );
      setSavedChoice(type);
    } catch (err) {
      setSelected(null);
      setError(err instanceof Error ? err.message : "Could not save feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const locked = savedChoice !== null;
  const showNoIdNote = !predictionId;

  return (
    <div className="feedback-block">
      <p className="feedback-heading">How did we do?</p>
      <p className="feedback-prompt">
        The model labeled this as <strong>{verdict}</strong>. Tell us whether that judgment matches what you think about this article.
      </p>
      {showNoIdNote && (
        <p className="feedback-warn">
          This prediction was not saved to the database, so feedback won’t show up in your analytics history until the database is available.
        </p>
      )}

      <div className="feedback-actions">
        <button
          type="button"
          onClick={() => handleClick("correct")}
          className="feedback-btn feedback-btn-ok"
          disabled={submitting || locked}
          aria-pressed={selected === "correct"}
        >
          {submitting && selected === "correct" ? "Sending…" : "Verdict looks right"}
        </button>

        <button
          type="button"
          onClick={() => handleClick("incorrect")}
          className="feedback-btn feedback-btn-bad"
          disabled={submitting || locked}
          aria-pressed={selected === "incorrect"}
        >
          {submitting && selected === "incorrect" ? "Sending…" : "Verdict looks wrong"}
        </button>
      </div>

      {error && <p className="feedback-error">{error}</p>}

      {savedChoice && (
        <div
          className={`feedback-confirmation ${savedChoice === "correct" ? "is-positive" : "is-negative"}`}
          role="status"
        >
          <span className="feedback-confirmation-title">Feedback saved</span>
          <p className="feedback-confirmation-text">
            {savedChoice === "correct"
              ? `We linked your account to this result: you agree the "${verdict}" call was right. It will count toward your feedback accuracy.`
              : `We linked your account to this result: you flagged the "${verdict}" call as wrong. It will count toward your feedback accuracy.`}
          </p>
        </div>
      )}
    </div>
  );
}
