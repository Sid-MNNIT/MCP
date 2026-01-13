import React from "react";
import { RefreshCw } from "lucide-react"; // Make sure you have: npm install lucide-react

const FOLDERS = [
  { id: "all", label: "Inbox", count: 12, icon: "📥" },
  { id: "sent", label: "Sent", count: 0, icon: "📤" },
  { id: "drafts", label: "Drafts", count: 2, icon: "📄" },
  { id: "interviews", label: "Interviews", count: 3, icon: "🎥" },
  { id: "rejections", label: "Rejections", count: 5, icon: "🔴" },
  { id: "assessments", label: "Assessments", count: 1, icon: "📝" },
  { id: "offers", label: "Offers", count: 1, icon: "🎉" },
];

export default function EmailSidebar({ 
  selectedFolder, 
  onSelectFolder, 
  onComposeClick,
  lastSynced,    // <--- New Prop
  isSyncing,     // <--- New Prop
  onSync         // <--- New Prop
}) {
  return (
    <div className="email-sidebar">
      {/* --- Top Section --- */}
      <div>
        <div className="compose-btn-wrapper">
          <button className="btn-compose" onClick={onComposeClick}>
            <span>✏️</span> Compose
          </button>
        </div>

        <h3 className="email-section-title">Mailboxes</h3>
        
        <div className="folder-list">
          {FOLDERS.map((folder) => (
            <button
              key={folder.id}
              className={`folder-item ${selectedFolder === folder.id ? "active" : ""}`}
              onClick={() => onSelectFolder(folder.id)}
            >
              <div className="folder-left">
                <span className="folder-icon">{folder.icon}</span>
                <span className="folder-label">{folder.label}</span>
              </div>
              {folder.count > 0 && <span className="folder-count">{folder.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* --- New Sync Footer (Pushes to bottom) --- */}
      <div className="sidebar-footer">
        <div className="sync-card">
          <div className="sync-header-row">
            <span className="sync-label">Last Synced</span>
            <span className="sync-time">{lastSynced || "Never"}</span>
          </div>
          <button 
            className={`btn-sidebar-sync ${isSyncing ? 'spinning' : ''}`} 
            onClick={onSync}
            disabled={isSyncing}
          >
            <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
            {isSyncing ? "Syncing..." : "Sync Emails"}
          </button>
        </div>
      </div>
    </div>
  );
}