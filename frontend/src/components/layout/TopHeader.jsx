import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout.css"; // Ensure we link the new styles

export default function TopHeader({ fullName = "Priyangshu Ghosh" }) {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("jobsy-theme") || "light");
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  const firstName = fullName.split(" ")[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Toggle Theme Logic
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("jobsy-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Signout Logic
  const handleSignOut = () => {
    navigate("/auth");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      <div className="top-header__left">
        <h1 className="greeting">
          {getGreeting()}, <span>{firstName}</span>
        </h1>
        <p className="subtitle">Here’s your job search snapshot</p>
      </div>

      <div className="top-header__right" ref={menuRef}>
        <span className="user-name">{fullName}</span>
        
        {/* Avatar acts as the trigger */}
        <div 
          className="avatar" 
          onClick={() => setShowMenu(!showMenu)}
          title="Open Menu"
        >
          {firstName.charAt(0)}
        </div>

        {/* Dropdown Menu */}
        <div className={`profile-dropdown ${showMenu ? "active" : ""}`}>
          <div className="dropdown-header">
            <strong>{fullName}</strong>
            <span>Job Seeker</span>
          </div>
          
          <div className="dropdown-divider"></div>

          <button className="dropdown-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            My Profile
          </button>

          <button className="dropdown-item" onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                Dark Mode
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                Light Mode
              </>
            )}
          </button>

          <div className="dropdown-divider"></div>

          <button className="dropdown-item danger" onClick={handleSignOut}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}