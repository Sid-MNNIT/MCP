import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Service-Key"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --------------------
// Route imports
// --------------------
import userRouter from "./routes/user.route.js";
import userAuthRouter from "./routes/google_auth.route.js"
import emailRoutes from "./routes/email.route.js";
import agentRoutes from "./routes/agent.route.js";
import internalGoogleRoutes from "./routes/internal_google.route.js";
import googleSyncRoutes from "./routes/google_sync.route.js"
// --------------------
// Route mounting
// --------------------
app.use("/api/user", userRouter);

// auth = login / register / me
app.use("/api/auth", userAuthRouter);



// emails CRUD
app.use("/api/emails", emailRoutes);

// backend → orchestrator
app.use("/api/agent", agentRoutes);

// 🔐 INTERNAL SERVICE ROUTES (VERY IMPORTANT)
app.use("/internal/google", internalGoogleRoutes);

app.use("/sync/google",googleSyncRoutes)

// --------------------
// Health check
// --------------------
app.get("/", (req, res) => {
  res.send("Hey Ladies");
});

// --------------------
// 404 handler
// --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { app };
