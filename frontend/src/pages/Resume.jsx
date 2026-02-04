import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import { getCurrentUser, uploadResume, getMyResume, getResumeFileUrl } from "../utils/api";

import "../styles/dashboard.css";
import "../styles/resume.css";

import ResumeUpload from "../components/resume/ResumeUpload";
import ATSScore from "../components/resume/ATSScore";
import ResumeMetadata from "../components/resume/ResumeMetadata";

export default function Resume() {
  const [user, setUser] = useState(null);

  // this is the local file user selects (actual File object)
  const [uploadedFile, setUploadedFile] = useState(null);

  // resume metadata stored in DB
  const [resumeMeta, setResumeMeta] = useState(null);

  const [scoreData, setScoreData] = useState(null);
  const [metadataData, setMetadataData] = useState(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  // ----------------------------
  // Load user
  // ----------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.user);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  // ----------------------------
  // Load existing resume from backend on page open
  // ----------------------------
  useEffect(() => {
    const loadResume = async () => {
      setIsLoadingResume(true);
      try {
        const res = await getMyResume();

        // Your backend sends ApiResponse
        const payload = res?.data;

        if (!payload?.hasResume) {
          setResumeMeta(null);
          setScoreData(null);
          setMetadataData(null);
          return;
        }

        setResumeMeta(payload.resume || null);

        // Map backend → UI shapes
        const score = payload.score || null;
        const parsed = payload.parsed_resume || null;

        if (score) setScoreData(score);

        // UI expects { entities: {...} }
        if (parsed?.entities) {
          setMetadataData({ entities: parsed.entities });
        } else if (parsed?.result?.entities) {
          // fallback if structure differs
          setMetadataData({ entities: parsed.result.entities });
        } else {
          setMetadataData(null);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setIsLoadingResume(false);
      }
    };

    loadResume();
  }, []);

  // ----------------------------
  // File selection
  // ----------------------------
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);

      // reset old results until upload
      setScoreData(null);
      setMetadataData(null);
    } else {
      alert("Please upload a PDF file");
    }
  };

  // ----------------------------
  // Upload + parse
  // ----------------------------
  const handleCalculate = async () => {
    if (!uploadedFile) {
      alert("Please upload a resume first!");
      return;
    }

    setIsCalculating(true);

    try {
      const res = await uploadResume(uploadedFile);
      const payload = res?.data;

      if (!payload) throw new Error("Invalid response from backend");

      // store metadata for showing on UI
      setResumeMeta(payload.resume || null);

      // score directly matches ATSScore.jsx expectation
      setScoreData(payload.score || null);

      // parsed_resume contains entities
      const parsed = payload.parsed_resume || {};
      setMetadataData(parsed?.entities ? { entities: parsed.entities } : null);

      // keep uploadedFile OR clear it - your choice
      // setUploadedFile(null);
    } catch (err) {
      console.error(err);
      alert("Resume upload/parse failed. Check console for details.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setScoreData(null);
    setMetadataData(null);
  };

  const handleOpenResume = () => {
    window.open(getResumeFileUrl(), "_blank");
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader
          fullName={user?.fullname || "User"}
          title="Resume Analysis"
          hideGreeting
        />

        <div className="resume-container">
          {/* Show existing resume open button if resume exists */}
          {resumeMeta && (
            <div className="resume-open-banner" style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>Saved Resume:</strong> {resumeMeta.filename}
                  {isLoadingResume && <span style={{ marginLeft: 10 }}>(loading...)</span>}
                </div>
                <button className="btn-replace" onClick={handleOpenResume}>
                  Open PDF
                </button>
              </div>
            </div>
          )}

          <ResumeUpload
            uploadedFile={uploadedFile}
            onUpload={handleFileUpload}
            onRemove={handleRemoveFile}
          />

          <ATSScore
            scoreData={scoreData}
            uploadedFile={uploadedFile}
            isCalculating={isCalculating}
            onCalculate={handleCalculate}
          />

          <ResumeMetadata metadataData={metadataData} />
        </div>
      </main>
    </div>
  );
}
