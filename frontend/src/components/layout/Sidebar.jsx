import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/dashboard.css"; // Uses your existing dashboard.css

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
        {/* DASHBOARD */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="icon">🏠</span>
          <span className="label">Dashboard</span>
        </NavLink>

        

        {/* Placeholders for other routes */}
        <NavLink 
          to="/resume" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="icon">📄</span>
          <span className="label">Resume</span>
        </NavLink>

        <NavLink 
          to="/jobs" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="icon">💼</span>
          <span className="label">Jobs</span>
        </NavLink>

        <NavLink 
          to="/emails" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="icon">✉️</span>
          <span className="label">Emails</span>
        </NavLink>

        <NavLink 
          to="/ask-ai" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="icon">🤖</span>
          <span className="label">Ask AI</span>
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <span className="icon">⚙️</span>
          <span className="label">Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}