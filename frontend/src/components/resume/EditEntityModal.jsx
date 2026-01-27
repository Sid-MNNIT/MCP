import React, { useState } from "react";
// Assumes you have global modal styles in profile.css or similar
export default function EditEntityModal({ title, fields, initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(initialData);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-fade-in">
        <div className="modal-header"><h3>Edit {title}</h3><button className="close-btn" onClick={onClose}>&times;</button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="modal-form">
          {fields.map((field) => (
            <div className="form-group" key={field.key}>
              <label>{field.label}</label>
              {field.type === 'textarea' ? <textarea name={field.key} className="form-input textarea" value={formData[field.key] || ""} onChange={handleChange} rows={4} /> : <input type="text" name={field.key} className="form-input" value={formData[field.key] || ""} onChange={handleChange} />}
            </div>
          ))}
          <div className="modal-actions"><button type="button" className="btn-edit" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary">Save Changes</button></div>
        </form>
      </div>
    </div>
  );
}