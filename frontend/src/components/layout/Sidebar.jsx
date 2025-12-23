import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <span className="sidebar-logo">Jobsy</span>

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        <a className="active">
          <span className="icon">🏠</span>
          <span className="label">Dashboard</span>
        </a>
        <a>
          <span className="icon">📄</span>
          <span className="label">Resume</span>
        </a>
        <a>
          <span className="icon">💼</span>
          <span className="label">Jobs</span>
        </a>
        <a>
          <span className="icon">✉️</span>
          <span className="label">Emails</span>
        </a>
        <a>
          <span className="icon">🤖</span>
          <span className="label">Ask AI</span>
        </a>
        <a>
          <span className="icon">⚙️</span>
          <span className="label">Settings</span>
        </a>
      </nav>
    </aside>
  );
}
