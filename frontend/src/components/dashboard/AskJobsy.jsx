import React from "react";

export default function AskJobsy() {
  const suggestions = ["Resume Tips", "Job Search Advice", "Interview Prep"];

  return (
    <div className="card ask-jobsy-card">
      <div className="ask-header">
        <div className="ask-avatar">
          {/* Robot Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
        </div>
        <h3>Ask Jobsy</h3>
      </div>

      <div className="ask-input-wrapper">
        <input type="text" placeholder="Ask me anything..." />
        <button className="ask-send-btn">
          {/* Arrow Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
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