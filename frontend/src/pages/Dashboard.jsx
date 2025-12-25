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
  
  // --- MOCK DATA SOURCE (Replace with Backend Data later) ---
  const data = {
    resume: {
      isParsed: true, // Change to false to test Red state
      timestamp: "Updated 2 hours ago"
    },
    gmail: {
      isConnected: true, // Change to false to test Red state
      timestamp: "Synced 5 mins ago"
    },
    jobs: {
      isSynced: false, // Change to true to test Green state
      timestamp: "Last sync failed"
    }
  };

  // --- LOGIC: AI Readiness Calculation ---
  // Count how many steps are successful
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

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-root">
        <TopHeader />

        <div className="dashboard-status-grid">
          {/* 1. RESUME CARD */}
          <StatusCard
            type="resume"
            title="Resume"
            // If parsed: "Parsed & Ready", else "Not Parsed"
            statusText={data.resume.isParsed ? "Parsed & Ready" : "Not Parsed"}
            lastUpdated={data.resume.timestamp}
            // If parsed: success (Green), else error (Red)
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