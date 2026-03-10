import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import "../styles/dashboard.css";
import "../styles/askai.css";

const BASE_URL = "http://localhost:5000/api";

const SUGGESTIONS = [
  "Summarize my recent rejection emails",
  "Any interview scheduled this week?",
  "Find me React developer jobs in Bangalore",
  "Draft a follow-up email for my last interview",
  "How is my job search going?",
];

function TypingDots() {
  return (
    <div className="ai-typing-indicator">
      <span /><span /><span />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`ai-message-row ${isUser ? "user" : "assistant"}`}>
      {!isUser && (
        <div className="ai-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
          </svg>
        </div>
      )}
      <div className={`ai-bubble ${isUser ? "user" : "assistant"}`}>
        {typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content, null, 2)}
      </div>
      {isUser && <div className="ai-user-avatar">You</div>}
    </div>
  );
}

export default function AskAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm Jobsy AI 👋 Ask me anything about your job search — emails, interviews, job listings, or career advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/ai/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          endpoint: "/ask-jobsy",
          args: {
            text: trimmed,
            conversation_id: conversationId,
            metadata: {},
          },
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      const reply =
        typeof data.response === "string"
          ? data.response
          : JSON.stringify(data.response, null, 2);

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="ai-page">

        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-left">
            <div className="ai-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <div>
              <h1 className="ai-header-title">Ask Jobsy</h1>
              <span className="ai-header-sub">Your AI job search assistant</span>
            </div>
          </div>
          <div className="ai-status-pill">
            <span className="ai-status-dot" />
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="ai-thread">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="ai-message-row assistant">
              <div className="ai-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <div className="ai-bubble assistant">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion Pills — only shown before first message */}
        {showSuggestions && (
          <div className="ai-suggestions-bar">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="ai-suggestion-pill" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-input-bar">
          <div className="ai-input-wrapper">
            <textarea
              ref={inputRef}
              className="ai-textarea"
              rows={1}
              placeholder="Ask about your jobs, emails, interviews…"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className={`ai-send-btn ${loading || !input.trim() ? "disabled" : ""}`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="ai-disclaimer">
            Jobsy AI can make mistakes. Always verify important information.
          </p>
        </div>

      </main>
    </div>
  );
}