import React, { useState } from "react";

export default function ComposeModal({ onClose, initialData }) {
  const [to, setTo] = useState(initialData?.to || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [body, setBody] = useState(initialData?.body || "");

  return (
    <div className="compose-overlay">
      <div className="compose-window">
        
        {/* HEADER */}
        <div className="compose-header">
          <span className="compose-title">New Message</span>
          <button className="icon-btn-close" onClick={onClose}>✕</button>
        </div>

        {/* INPUTS ROW */}
        <div className="compose-inputs">
          <div className="input-row">
            <span className="input-label">To:</span>
            <input 
              type="text" 
              className="clean-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              autoFocus={!initialData}
            />
          </div>
          <div className="input-row">
            <span className="input-label">Subject:</span>
            <input 
              type="text" 
              className="clean-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this about?"
            />
          </div>
        </div>

        {/* EDITOR AREA */}
        <textarea 
          className="compose-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing here..."
          autoFocus={!!initialData}
        />

        {/* FOOTER ACTIONS */}
        <div className="compose-footer">
          <div className="footer-left">
            <button className="btn-ai-magic">
              <span className="magic-icon">✨</span>
              Ask AI to Write
            </button>
            <button className="btn-icon-tool" title="Attach File">📎</button>
            <button className="btn-icon-tool" title="Insert Image">🖼️</button>
          </div>
          
          <div className="footer-right">
            <button className="btn-ghost" onClick={onClose}>Discard</button>
            <button className="btn-send-primary">
              Send Email
              <span style={{ marginLeft: "6px" }}>→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}