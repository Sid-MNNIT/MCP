import React, { useState } from "react";
import "../../styles/profile.css";

export default function AvatarModal({ currentAvatar, onClose, onSave }) {
  const [url, setUrl] = useState(currentAvatar);

  const handleSave = () => {
    onSave(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={url} alt="Profile Full" className="avatar-full-preview" />
        
        <div className="avatar-controls">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Paste image URL here..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn-social" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Set Profile Picture</button>
          </div>
        </div>
      </div>
    </div>
  );
}