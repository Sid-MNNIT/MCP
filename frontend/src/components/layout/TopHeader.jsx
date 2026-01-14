import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "../../styles/layout.css";
import { logoutUser } from "../../utils/api";

export default function TopHeader({ fullName = "Priyangshu Ghosh", title, hideGreeting = false }) {
  const [theme, setTheme] = useState(localStorage.getItem("jobsy-theme") || "light");
  const [showMenu, setShowMenu] = useState(false);
  
  const navigate = useNavigate(); // ✅ Initialize hook
  const menuRef = useRef(null);
  
  const firstName = fullName ? fullName.split(" ")[0] : "User";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("jobsy-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleSignOut = async () => {
    try {
      const res = await logoutUser();
      if (res.success) navigate("/auth");
    } catch (error) {
      alert("Server error during logout");
    }
  };

  // Navigate to Profile
  const handleGoToProfile = () => {
    navigate("/profile");
    setShowMenu(false);
  };

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
        {hideGreeting ? (
          <h1 className="greeting" style={{ fontSize: '24px' }}>{title}</h1>
        ) : (
          <>
            <h1 className="greeting">
              {getGreeting()}, <span>{firstName}</span>
            </h1>
            <p className="subtitle">Here’s your job search snapshot</p>
          </>
        )}
      </div>

      <div className="top-header__right" ref={menuRef}>
        <span className="user-name">{fullName}</span>
        
        <div 
          className="avatar" 
          onClick={() => setShowMenu(!showMenu)}
          title="Open Menu"
        >
          {firstName.charAt(0)}
        </div>

        <div className={`profile-dropdown ${showMenu ? "active" : ""}`}>
          <div className="dropdown-header">
            <strong>{fullName}</strong>
            <span>Job Seeker</span>
          </div>
          
          <div className="dropdown-divider"></div>

          {/* ✅ CLICKABLE PROFILE LINK */}
          <button className="dropdown-item" onClick={handleGoToProfile}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            My Profile
          </button>

          <button className="dropdown-item" onClick={toggleTheme}>
             {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <div className="dropdown-divider"></div>

          <button className="dropdown-item danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}