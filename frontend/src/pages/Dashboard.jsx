import { useState, useEffect } from "react";
import { getCurrentUser, startGmailSync, getGmailStatus, getEmailStats } from "../utils/api";
import "../styles/dashboard.css";
import "../styles/calendar.css";

import TopHeader from "../components/layout/TopHeader";
import Sidebar from "../components/layout/Sidebar";

import StatusCard from "../components/dashboard/StatusCard";
import ResumePolishCard from "../components/dashboard/ResumePolishCard";
import RecruiterActivity from "../components/dashboard/RecruiterActivity";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import CalendarWidget from "../components/dashboard/CalendarWidget";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gmail, setGmail] = useState({
    isConnected: false,
    timestamp: "Not connected",
  });
  const [emailStats, setEmailStats] = useState({ interviews: 0, rejections: 0, assessments: 0 });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userRes = await getCurrentUser();
        const gmailRes = await getGmailStatus();
        const statsRes = await getEmailStats();

        setUser(userRes.user);
        setEmailStats(statsRes);

        setGmail({
          isConnected: gmailRes.connected,
          timestamp: gmailRes.connected
            ? `Synced ${new Date(gmailRes.lastSync).toLocaleString()}`
            : "Not connected",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const data = {
    resume: {
      isParsed: true,
      timestamp: "Updated 2 hours ago",
    },
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-root">
        <TopHeader fullName={user?.fullname || "User"} />

        {/* ── 2-card status row ── */}
        <div className="dashboard-status-grid">
          <StatusCard
            type="resume"
            title="Resume"
            statusText={data.resume.isParsed ? "Parsed & Ready" : "Not Parsed"}
            lastUpdated={data.resume.timestamp}
            state={data.resume.isParsed ? "success" : "error"}
          />
          <StatusCard
            type="gmail"
            title="Gmail"
            statusText={gmail.isConnected ? "Connected" : "Not Connected"}
            lastUpdated={gmail.timestamp}
            state={gmail.isConnected ? "success" : "error"}
            onClick={!gmail.isConnected ? startGmailSync : undefined}
          />
        </div>

        {/* ── Polish + Recruiter side by side ── */}
        <div className="dashboard-main-grid">
          <ResumePolishCard />
          <RecruiterActivity
            interviews={emailStats.interviews}
            rejections={emailStats.rejections}
            assessments={emailStats.assessments}
          />
        </div>

        {/* ── Calendar + Events/AskJobsy ── */}
        <div className="dashboard-lower-grid">
          <CalendarWidget />
          <div className="lower-right-col">
            <UpcomingEvents />
          </div>
        </div>
      </main>
    </div>
  );
}
