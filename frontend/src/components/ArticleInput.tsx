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
        placeholder="Paste article text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />

      <button
        onClick={() => onSubmit(text)}
        disabled={loading || text.length === 0}
        className="primary-btn"
      >
        {loading ? "Analyzing..." : "Analyze Article"}
      </button>
    </div>
  );
}