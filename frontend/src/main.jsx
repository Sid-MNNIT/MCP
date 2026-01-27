import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";
import "./styles/theme.css";

// Initialize theme from localStorage or default to light
const savedTheme = localStorage.getItem("jobsy-theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
if (!localStorage.getItem("jobsy-theme")) {
  localStorage.setItem("jobsy-theme", "light");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
