import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import { getCurrentUser } from "../utils/api";

import "../styles/dashboard.css";
import "../styles/resume.css";

import ResumeUpload from "../components/resume/ResumeUpload";
import ATSScore from "../components/resume/ATSScore";
import ResumeMetadata from "../components/resume/ResumeMetadata";

export default function Resume() {
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [metadataData, setMetadataData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setScoreData(null);
      setMetadataData(null);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleCalculate = async () => {
    if (!uploadedFile) {
      alert("Please upload a resume first!");
      return;
    }

    setIsCalculating(true);

    // TODO: Replace with actual API call to resume MCP
    setTimeout(() => {
      setScoreData({
        final_score: 78,
        ats: {
          total_score: 78,
          breakdown: {
            contact: 15,
            experience: 18,
            skills: 20,
            education: 12,
            format: 13,
          },
        },
        llm_feedback: [
          {
            type: "success",
            text: "Strong technical skills section with relevant keywords",
          },
          {
            type: "warning",
            text: "Experience descriptions could be more quantitative",
          },
          {
            type: "error",
            text: "Missing leadership and management keywords",
          },
          {
            type: "success",
            text: "Clear and well-structured education section",
          },
        ],
      });

      setMetadataData({
        entities: {
          skills: [
            "Python",
            "Flask",
            "FastAPI",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Kubernetes",
            "Git",
            "AWS",
            "MongoDB",
            "React",
            "Node.js",
          ],
          experience_years: 3,
          companies: ["Alpha Technologies", "Beta Corp", "Gamma Solutions"],
          education_count: 1,
          certifications_count: 2,
        },
      });

      setIsCalculating(false);
    }, 2000);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setScoreData(null);
    setMetadataData(null);
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