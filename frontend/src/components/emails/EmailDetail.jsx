import React from "react";

export default function EmailDetail({ 
  email,
  onClose,
  onReply,
  onGenerateAiReply,   
  isAiLoading,
  onDelete,
  onToggleStar
}) {
  if (!email) return null;

  if (email.isLoading) {
    return (
      <div className="email-content-col">
        <p>Loading email…</p>
      </div>
    );
  }

  return (
    <div className="email-content-col">
      {/* HEADER */}
      <div className="email-detail-header">
        <div className="detail-top-row">
          <button className="back-btn-mobile" onClick={onClose}>← Back</button>

          <div className="detail-badges">
            <span className="ai-status-pill">✨ AI Ready</span>
          </div>

          <div className="detail-actions">
<button
  className={`action-icon-btn ${email.isStarred ? "starred" : ""}`}
  onClick={() => onToggleStar(email)}
  title="Star"
>
  {email.isStarred ? "⭐" : "☆"}
</button>

  <button
    className="action-icon-btn danger"
    onClick={() => onDelete(email)}
    title="Delete"
  >
    🗑
  </button>

  <button className="action-icon-btn" onClick={onClose}>
    ✕
  </button>
</div>

        </div>

        <h1 className="detail-subject">{email.subject || "(No subject)"}</h1>

        <div className="sender-card">
          <div className="sender-avatar">
            {email.sender ? email.sender.charAt(0) : "?"}
          </div>
          <div className="sender-meta">
            <span className="sender-name">
              {email.sender || "Unknown Sender"}
            </span>
            <span className="sender-email">
              &lt;recruiter@{email.company?.toLowerCase() || "company"}.com&gt;
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="email-body-content">
        {(email.body || email.preview || "")
          .split("\n")
          .map((line, i) => <p key={i}>{line}</p>)}
      </div>

      {/* FOOTER */}
      <div className="email-detail-footer">
    <button
  className="btn-secondary"
  onClick={() => {
    console.log("🟢 AI button clicked", email);
    onGenerateAiReply(email);
  }}
  disabled={isAiLoading}
>

          {isAiLoading ? "✨ Generating..." : "✨ Generate AI Reply"}
        </button>

        <button className="btn-primary" onClick={() => onReply(email)}>
          Reply to {email.sender ? email.sender.split(" ")[0] : "Sender"}
        </button>
      </div>
    </div>
  );
}
