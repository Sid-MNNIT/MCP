import React, { useState } from "react";
import "../../styles/profile.css";

export default function ExperienceModal({ initialData, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(initialData || {
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <div className="modal-header">
          <h3>{initialData ? "Edit Experience" : "Add Experience"}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="modal-form">
          <div className="form-group">
            <label>Role / Title</label>
            <input type="text" name="role" value={form.role} onChange={handleChange} className="form-input" required placeholder="e.g. Senior Developer" />
          </div>
          
          <div className="form-group">
            <label>Company</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} className="form-input" required placeholder="e.g. Google" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="text" name="startDate" value={form.startDate} onChange={handleChange} className="form-input" placeholder="e.g. Jan 2023" />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="text" name="endDate" value={form.endDate} onChange={handleChange} className="form-input" placeholder="Present" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-input textarea" rows="3" placeholder="Describe your impact..."></textarea>
          </div>

          <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
            {initialData ? (
              <button type="button" onClick={() => onDelete(initialData.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
            ) : <div></div>}
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} className="btn-social">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}