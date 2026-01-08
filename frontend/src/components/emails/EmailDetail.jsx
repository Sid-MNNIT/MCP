import React from "react";

export default function EmailDetail({ email, onClose, onReply, onAiReply, isAiLoading }) {
  if (!email) return null;

  return (
    <div className="email-content-col">
      {/* HEADER */}
      <div className="email-detail-header">
        <div className="detail-top-row">
          <button className="back-btn-mobile" onClick={onClose}>← Back</button>
          
          <div className="detail-badges">
             <span className="ai-status-pill">✨ AI Ready</span>
             {email.tag && <span className={`status-dot dot-${email.tagType}`}></span>}
          </div>
          
          <div className="detail-actions">
            <button className="action-icon-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <h1 className="detail-subject">{email.subject}</h1>

        <div className="sender-card">
          <div className="sender-avatar">{email.sender.charAt(0)}</div>
          <div className="sender-meta">
            <span className="sender-name">{email.sender}</span>
            <span className="sender-email">&lt;recruiter@{email.company?.toLowerCase() || 'company'}.com&gt;</span>
          </div>
        </div>
      </div>
      
      {/* BODY (Scrollable) */}
      <div className="email-body-content">
        {email.body.split('\n').map((line, i) => (
          <p key={i}>{line}<br/></p>
        ))}
      </div>

      {/* FOOTER (Fixed) */}
      <div className="email-detail-footer">
        <button 
          className="btn-secondary" 
          onClick={() => onAiReply(email)}
          disabled={isAiLoading}
        >
          {isAiLoading ? "✨ Generating..." : "✨ Generate AI Reply"}
        </button>
        
        {/* ✅ Triggers onReply */}
        <button className="btn-primary" onClick={() => onReply(email)}>
          Reply to {email.sender.split(' ')[0]}
        </button>
      </div>
    </div>
  );
}