import React from "react";
import { Sparkles, SendHorizonal } from "lucide-react";

export default function AskJobsy() {
  const suggestions = ["Resume Tips", "Job Search Advice", "Interview Prep"];

  return (
    <div className="card ask-jobsy-card">
      <div className="ask-header" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "var(--accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--accent-primary)",
          }}
        >
          <Sparkles size={18} strokeWidth={2} />
        </div>
        <h3 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>Ask Jobsy</h3>
      </div>

      <div className="ask-input-wrapper" style={{ position: "relative" }}>
        <input type="text" placeholder="Ask me anything…" />
        <button
          className="ask-send-btn"
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--accent-gradient)",
            border: "none",
            borderRadius: 8,
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <SendHorizonal size={15} strokeWidth={2.5} />
        </button>
      </div>

      <div className="ask-suggestions">
        {suggestions.map((text) => (
          <button key={text} className="suggestion-pill">
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
