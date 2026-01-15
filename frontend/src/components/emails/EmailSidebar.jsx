import React from "react";
import {
  PenSquare,
  Inbox,
  RefreshCw,
} from "lucide-react";

export default function EmailSidebar({
  onComposeClick,
  onShowEmails,
  onSync,
  isSyncing,
  lastSynced,
}) {
  return (
    <div className="email-sidebar">

      {/* ===== TOP ACTIONS ===== */}
      <div className="sidebar-actions">

        {/* Compose */}
        <button className="sidebar-btn primary" onClick={onComposeClick}>
          <PenSquare size={18} />
          <span>Compose</span>
        </button>

        {/* Inbox / Show Emails */}
        <button className="sidebar-btn" onClick={onShowEmails}>
          <Inbox size={18} />
          <span>Emails</span>
        </button>

      </div>

      {/* ===== FOOTER / SYNC ===== */}
      <div className="sidebar-footer">
        <div className="sync-card">



          <button
            className={`sidebar-btn sync ${isSyncing ? "syncing" : ""}`}
            onClick={onSync}
            disabled={isSyncing}
          >
            <RefreshCw
              size={16}
              className={isSyncing ? "spin-anim" : ""}
            />
            <span>{isSyncing ? "Syncing…" : "Re-ingest Gmail"}</span>
          </button>

        </div>
      </div>
    </div>
  );
}
