import { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/api";
import "../styles/dashboard.css";

import TopHeader from "../components/layout/TopHeader";
import Sidebar from "../components/layout/Sidebar";

import StatusCard from "../components/dashboard/StatusCard";
import ResumePolishCard from "../components/dashboard/ResumePolishCard";
import ResumeOverview from "../components/dashboard/ResumeOverview";
import JobMarketSnapshot from "../components/dashboard/JobMarketSnapshot";
import RecruiterActivity from "../components/dashboard/RecruiterActivity";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import AskJobsy from "../components/dashboard/AskJobsy";
import CalendarWidget from "../components/dashboard/CalendarWidget";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- MOCK DATA SOURCE (Replace with Backend Data later) ---
  const data = {
    resume: {
      isParsed: true,
      timestamp: "Updated 2 hours ago"
    },
    gmail: {
      isConnected: true,
      timestamp: "Synced 5 mins ago"
    },
    jobs: {
      isSynced: false,
      timestamp: "Last sync failed"
    }
  };

  // --- LOGIC: AI Readiness Calculation ---
  const successCount = [
    data.resume.isParsed, 
    data.gmail.isConnected, 
    data.jobs.isSynced
  ].filter(Boolean).length;

  let aiState = "error";
  let aiTitle = "Not Ready";
  
  if (successCount === 3) {
    aiState = "success";
    aiTitle = "Ready";
  } else if (successCount > 0) {
    aiState = "warning";
    aiTitle = "Partial";
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-root">
        <TopHeader fullName={user?.fullname || "User"} />

        <div className="dashboard-status-grid">
          {/* 1. RESUME CARD */}
          <StatusCard
            type="resume"
            title="Resume"
            statusText={data.resume.isParsed ? "Parsed & Ready" : "Not Parsed"}
            lastUpdated={data.resume.timestamp}
            state={data.resume.isParsed ? "success" : "error"}
          />

          {/* 2. GMAIL CARD */}
          <StatusCard
            type="gmail"
            title="Gmail"
            statusText={data.gmail.isConnected ? "Connected" : "Not Connected"}
            lastUpdated={data.gmail.timestamp}
            state={data.gmail.isConnected ? "success" : "error"}
          />

          {/* 3. JOBS CARD */}
          <StatusCard
            type="jobs"
            title="Jobs"
            statusText={data.jobs.isSynced ? "Synced" : "Not Synced"}
            lastUpdated={data.jobs.timestamp}
            state={data.jobs.isSynced ? "success" : "error"}
          />

          {/* 4. AI READINESS CARD (Calculated) */}
          <StatusCard
            type="ai"
            title="AI Readiness"
            statusText={aiTitle}
            lastUpdated="Based on setup"
            state={aiState}
          />
        </div>

        <div className="dashboard-main-grid">
          <ResumePolishCard />
          <ResumeOverview />
          <JobMarketSnapshot />
          <RecruiterActivity />
        </div>

        <div className="dashboard-lower-grid">
          <CalendarWidget />
          <div className="lower-right-col">
            <UpcomingEvents />
            <AskJobsy />
          </div>
        </div>
      </main>
    </div>
  );
}