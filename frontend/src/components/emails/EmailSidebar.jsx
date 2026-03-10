import React from "react";
import {
  PenSquare,
  Inbox,
  RefreshCw,
  Star,
  Send
} from "lucide-react";


export default function EmailSidebar({
  onComposeClick,
  onShowInbox,
  onShowSent,
  onShowStarred,
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
        <button className="sidebar-btn" onClick={onShowInbox}>
          <Inbox size={18} />
          <span>Inbox</span>
        </button>
        <button className="sidebar-btn" onClick={onShowSent}>
  <Send size={18} />
  <span>Sent</span>
</button>


        {/* Starred Emails */}
<button className="sidebar-btn" onClick={onShowStarred}>
  <Star size={18} />
  <span>Starred</span>
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
            <span>{isSyncing ? "Syncing…" : "Sync Email"}</span>
          </button>

        </div>
      </div>
    </div>
  );
}
