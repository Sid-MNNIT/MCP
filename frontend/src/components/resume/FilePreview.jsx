import React from 'react';

// Icons
const PdfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-2h1.5a1.5 1.5 0 0 1 0 3H9z"/><path d="M12 15v-3"/><path d="M15 15v-1a2 2 0 0 0-2-2"/></svg>;

export default function FilePreview({ fileName, fileSize, uploadTime }) {
  return (
    <div className="resume-card file-card">
      <div className="card-header-simple">
        <h3>Original Document</h3>
      </div>
      <div className="file-preview-box">
        <div className="pdf-icon-badge">
          <PdfIcon />
          <span className="badge-text">PDF</span>
        </div>
        <div className="file-info">
          <span className="name">{fileName || "document.pdf"}</span>
          <span className="size">{fileSize || "0 MB"} • {uploadTime || "Just now"}</span>
        </div>
      </div>
      <button className="text-btn">Replace File</button>
    </div>
  );
}