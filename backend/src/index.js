import { startEmailSyncJob } from "./jobs/emailSync.job.js";  // ← add at top
// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();



// Now import everything else
import {app} from "./app.js";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./db/index.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    })
    startEmailSyncJob();
})
.catch((err)=>{
    console.log("Failed due to error",err)
    throw err
});
