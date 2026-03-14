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

        // only set score if it's a real result, not an empty {} from a failed pipeline
        if (score?.final_score !== undefined) setScoreData(score);

        // pass full parsed_resume so ResumeMetadata has both entities + sections
        if (parsed?.entities) {
          setMetadataData(parsed);
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
      // do NOT clear scoreData/metadataData here — the stored results stay
      // visible until the user actually clicks Calculate and a new upload succeeds
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
      // only set score if pipeline actually returned a real result
      setScoreData(payload.score?.final_score !== undefined ? payload.score : null);

      // pass full parsed_resume so ResumeMetadata has both entities + sections
      const parsed = payload.parsed_resume || {};
      setMetadataData(parsed?.entities ? parsed : null);

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
    // only deselect the local file — stored DB results remain visible
    setUploadedFile(null);
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

        {/* 3-column grid — always locked */}
        <div className="resume-container">
          <ResumeUpload
            uploadedFile={uploadedFile}
            resumeMeta={resumeMeta}
            isLoadingResume={isLoadingResume}
            onUpload={handleFileUpload}
            onRemove={handleRemoveFile}
            onOpenResume={handleOpenResume}
          />

          <ATSScore
            scoreData={scoreData}
            uploadedFile={uploadedFile}
            isCalculating={isCalculating}
            isLoadingResume={isLoadingResume}
            onCalculate={handleCalculate}
          />

          <ResumeMetadata metadataData={metadataData} />
        </div>
      </main>
    </div>
  );
}
