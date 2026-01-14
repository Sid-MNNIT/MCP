import React, { useState } from "react";
import "../../styles/profile.css";

export default function EducationModal({ initialData, onClose, onSave, onDelete }) {
  // ✅ INITIAL STATE: separate degree and fieldOfStudy
  const [form, setForm] = useState(initialData || {
    degree: "",
    fieldOfStudy: "",
    school: "",
    year: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <div className="modal-header">
          <h3>{initialData ? "Edit Education" : "Add Education"}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="modal-form">
          
          {/* ✅ SPLIT ROW: Degree + Major */}
          <div className="form-row">
            <div className="form-group">
              <label>Degree</label>
              <input 
                type="text" 
                name="degree" 
                value={form.degree} 
                onChange={handleChange} 
                className="form-input" 
                required 
                placeholder="e.g. B.Tech" 
              />
            </div>
            <div className="form-group">
              <label>Course / Major</label>
              <input 
                type="text" 
                name="fieldOfStudy" 
                value={form.fieldOfStudy} 
                onChange={handleChange} 
                className="form-input" 
                required 
                placeholder="e.g. Electrical Engineering" 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>School / University</label>
            <input 
              type="text" 
              name="school" 
              value={form.school} 
              onChange={handleChange} 
              className="form-input" 
              required 
              placeholder="e.g. Engineering University" 
            />
          </div>

          <div className="form-group">
            <label>Year of Passing</label>
            <input 
              type="text" 
              name="year" 
              value={form.year} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="e.g. 2021" 
            />
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