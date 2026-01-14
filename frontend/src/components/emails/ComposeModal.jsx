import React, { useState, useEffect } from "react";

export default function ComposeModal({
  onClose,
  initialData,
  onAskAi,
  onSend,
  isAiLoading,
  isSending

}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // 🔥 Sync with parent updates (AI paste fix)
  useEffect(() => {
    if (initialData) {
      setTo(initialData.to || "");
      setSubject(initialData.subject || "");
      setBody(initialData.body || "");
    }
  }, [initialData]);

  return (
    <div className="compose-overlay">
      <div className="compose-window">

        {/* HEADER */}
        <div className="compose-header">
          <span className="compose-title">New Message</span>
          <button className="icon-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* TO + SUBJECT */}
        <div className="compose-inputs">
          <div className="input-row">
            <span className="input-label">To:</span>
            <input
              className="clean-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="input-row">
            <span className="input-label">Subject:</span>
            <input
              className="clean-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        {/* BODY */}
        <textarea
          className="compose-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing here..."
        />

        {/* FOOTER */}
        <div className="compose-footer">
          <div className="footer-left">
            <button
              className="btn-ai-magic"
              onClick={onAskAi}
              disabled={isAiLoading}
            >
              {isAiLoading ? "✨ Writing..." : "✨ Ask AI to Write"}
            </button>
          </div>

          <div className="footer-right">
            <button className="btn-ghost" onClick={onClose}>
              Discard
            </button>

 <button
  className="btn-send-primary"
  disabled={isSending}
  onClick={() =>
    onSend({
      to,
      subject,
      body,
      threadId: initialData.threadId,
      in_reply_to: initialData.in_reply_to
    })
  }
>
  {isSending ? "Sending…" : "Send Email →"}
</button>

          </div>
        </div>

      </div>
    </div>
  );
}
