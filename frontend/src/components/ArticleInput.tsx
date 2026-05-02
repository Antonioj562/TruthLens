import { useState } from "react";

type Props = {
  onSubmit: (text: string) => void;
  loading: boolean;
};

export default function ArticleInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState("");

  return (
    <div className="input-card">
      <textarea
        placeholder="Paste the full article text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />

      <div className="input-actions">
        <span className="input-hint">{text.length} characters</span>
        <button
          onClick={() => onSubmit(text)}
          disabled={loading || text.trim().length === 0}
          className="primary-btn"
        >
          {loading ? "Analyzing..." : "Analyze Article"}
        </button>
      </div>
    </div>
  );
}
