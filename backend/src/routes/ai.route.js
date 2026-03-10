import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { aiExecute } from "../controllers/ai.controller.js";

const router = Router();

router.post("/execute", verifyJWT, aiExecute);

export default router;
