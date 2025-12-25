import React from "react";

export default function StatusCard({
  type = "resume", // resume | gmail | jobs | ai
  title = "Resume",
  statusText = "Parsed",
  lastUpdated = "Updated just now",
  state = "success", // success | warning | error
}) {
  
  // Define Icons based on Type and State
  const getIcon = () => {
    // 1. Error State is always a Cross
    if (state === "error") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    }

    // 2. AI Partial State (Warning)
    if (type === "ai" && state === "warning") {
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        );
    }

    // 3. Success States (Specific Icons per your request)
    switch (type) {
      case "resume":
        // Tick Mark
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case "gmail":
        // Connected Logo (Link)
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      case "jobs":
        // Synced Logo (Refresh Arrows)
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6"></path>
            <path d="M2.5 22v-6h6"></path>
            <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8"></path>
            <path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"></path>
          </svg>
        );
      case "ai":
      default:
        // Tick Mark for AI Ready
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
    }
  };

  // Main Icon (Left side)
  const getMainIcon = () => {
    if (type === "resume") return "📄";
    if (type === "gmail") return "✉️";
    if (type === "jobs") return "💼";
    if (type === "ai") return "🧠";
    return "📄";
  };

  return (
    <div className={`status-card ${state}`} tabIndex={0}>
      <div className="status-card-row">
        <div className="status-left">
          <div className="status-logo">
            {getMainIcon()}
          </div>

          <div className="status-text">
            <span className="status-title">{title}</span>
            <span className="status-main">{statusText}</span>
            <span className="status-sub">{lastUpdated}</span>
          </div>
        </div>

        <div className="status-right">
          {getIcon()}
        </div>
      </div>
    </div>
  );
}