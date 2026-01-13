import React, { useState } from "react";
import "../../styles/profile.css";

export default function ChangePasswordModal({ onClose }) {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Mock API Call: Changing Password", passwords);
    alert("Password updated (Simulated)");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <div className="modal-header">
          <h3>Change Password</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" name="current" className="form-input" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="new" className="form-input" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirm" className="form-input" onChange={handleChange} required />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-social">Cancel</button>
            <button type="submit" className="btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}