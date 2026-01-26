import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; // 1. Import the new page
import Auth from "./pages/Auth";
import Email from "./pages/Emails";
import Resume from "./pages/Resume";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Job from "./pages/Jobs"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/emails" 
        element={
          <ProtectedRoute>
            <Email />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/jobs" 
        element={
          <ProtectedRoute>
            <Job />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/resume" 
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;