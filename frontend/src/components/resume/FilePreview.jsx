import React, { useRef } from 'react';

// Icons
const UploadCloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 15v-2h1.5a1.5 1.5 0 0 1 0 3H9z" />
    <path d="M12 15v-3" />
    <path d="M15 15v-1a2 2 0 0 0-2-2" />
  </svg>
);

export default function FilePreview({ file, onFileUpload }) {
  const fileInputRef = useRef(null);
  
  const handleTrigger = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="resume-section">
      <div className="resume-section-header">
        <h3>Original Document</h3>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf" 
        style={{ display: 'none' }} 
      />

      {!file ? (
        <div className="upload-empty-state" onClick={handleTrigger}>
          <div style={{ color: 'var(--text-muted)' }}>
            <UploadCloudIcon />
          </div>
          
          <div className="upload-text-group">
            <span className="upload-title">Upload your resume</span>
            <span className="upload-subtitle">Drag & Drop or click to browse</span>
            <span className="upload-meta">PDF Only • Max 5MB</span>
          </div>
          
          <button className="btn-upload-primary">Select File</button>
        </div>
      ) : (
        <>
          <div className="file-preview-box populated">
            <PdfIcon />
            <span className="pdf-badge">PDF</span>
            <div style={{ marginTop: 8 }}>
               <div className="file-name">{file.name}</div>
               <div className="file-meta">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
          <button className="btn-edit-full" onClick={handleTrigger}>Replace File</button>
        </>
      )}
    </div>
  );
}