import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// routes import
import userRouter from "./routes/user.route.js"
import userAuthRouter from "./routes/google_auth.route.js"

// routes declaration
app.use("/api/user", userRouter)
app.use("/api/auth", userAuthRouter)

app.get("/", (req, res) => {
  res.send("Hey Ladies")
});


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler - Must be LAST and have exactly 4 parameters
app.use((err, req, res, next) => {
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error("Error:", err);
  console.error("Stack:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export { app };