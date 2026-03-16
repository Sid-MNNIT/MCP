import dotenv from "dotenv";
dotenv.config();
import {app} from "./app.js";
import { startEmailSyncJob } from "./jobs/emailSync.job.js";  

import express from "express";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { cronService } from "./services/cron.service.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
        
         // Start cron jobs
      console.log("🚀 Initializing cron jobs...");
      startEmailSyncJob(); // handles both email ingest + calendar event creation

    });
})
.catch((err)=>{
    console.log("Failed due to error",err)
    throw err
});


process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM received: shutting down gracefully');
    cronService.stopAllJobs();
    mongoose.connection.close(() => {
      console.log('📦 Database connection closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('⚠️  SIGINT received: shutting down gracefully');
    cronService.stopAllJobs();
    mongoose.connection.close(() => {
      console.log('📦 Database connection closed');
      process.exit(0);
    });
  });