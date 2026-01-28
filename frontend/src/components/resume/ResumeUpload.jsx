import React from "react";

const ResumeUpload = ({ uploadedFile, onUpload, onRemove }) => {
  return (
    <div className="resume-column">
      <div className="resume-card">
        <div className="resume-card-header">
          <h3>Upload Resume</h3>
        </div>

        {!uploadedFile ? (
          <div className="upload-area">
            <input
              id="resume-file"
              type="file"
              accept=".pdf"
              onChange={onUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="resume-file" className="upload-label">
              <div className="upload-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="upload-text">Click to upload your resume</p>
              <p className="upload-hint">PDF format only • Maximum 5MB</p>
            </label>
          </div>
        ) : (
          <>
            <div className="file-info">
              <div className="file-icon-container">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="file-details">
                <p className="file-name">{uploadedFile.name}</p>
                <p className="file-size">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={onRemove}
                className="btn-remove"
                title="Remove file"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => document.getElementById("resume-file").click()}
              className="btn-replace"
            >
              Replace File
            </button>
            <input
              id="resume-file"
              type="file"
              accept=".pdf"
              onChange={onUpload}
              style={{ display: "none" }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;