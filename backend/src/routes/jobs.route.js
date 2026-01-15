import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  searchJobs,
  getRecommendedJobs,
  getJobCategories,
  //matchJobToResume,
  saveJob,
  getSavedJobs,
  unsaveJob,
} from "../controllers/jobs.controller.js";

const router = Router();

/* ---------------- PUBLIC ---------------- */
router.get("/search",verifyJWT,searchJobs);
router.get("/categories", verifyJWT, getJobCategories);

/* --------------- PROTECTED -------------- */
router.get("/recommended", verifyJWT, getRecommendedJobs);
//router.post("/match", verifyJWT, matchJobToResume);
router.post("/save", verifyJWT, saveJob);
router.get("/saved", verifyJWT, getSavedJobs);
router.delete("/saved/:jobId", verifyJWT, unsaveJob);

export default router;
