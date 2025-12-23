import React, { useState } from 'react';

export default function Signin({ onSwitchToLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      // Automatically go to Login after success
      onSwitchToLogin();
    }, 1500);
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-header">
        <span className="auth-logo">Jobsy</span>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Already have an account? 
          <span className="auth-link" onClick={onSwitchToLogin}>Log in</span>
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" placeholder="e.g. John Doe" required />
        </div>

        {/* Email & Age (Grid Layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="name@company.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input type="number" className="form-input" placeholder="18+" min="1" required />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" required />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-input" placeholder="••••••••" required />
        </div>

        <button type="submit" className="btn-auth-primary">
          {isLoading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="auth-divider">Or continue with</div>

      <button type="button" className="btn-social">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.45H18.46C18.18 15.93 17.32 17.18 16.05 18.03V21H19.91C22.17 18.92 23.52 15.86 23.52 12.29Z" fill="#4285F4"/>
          <path d="M12 24C15.24 24 17.96 22.92 19.91 21.12L16.05 18.03C14.97 18.75 13.59 19.18 12 19.18C8.87 19.18 6.22 17.07 5.27 14.24H1.28V17.33C3.26 21.26 7.33 24 12 24Z" fill="#34A853"/>
          <path d="M5.27 14.24C5.03 13.52 4.9 12.77 4.9 12C4.9 11.23 5.03 10.48 5.27 9.76V6.67H1.28C0.46 8.28 0 10.1 0 12C0 13.9 0.46 15.72 1.28 17.33L5.27 14.24Z" fill="#FBBC05"/>
          <path d="M12 4.82C13.76 4.82 15.34 5.43 16.58 6.62L20.01 3.19C17.96 1.27 15.24 0 12 0C7.33 0 3.26 2.74 1.28 6.67L5.27 9.76C6.22 12.59 8.87 14.82 12 14.82V4.82Z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>
    </div>
  );
}