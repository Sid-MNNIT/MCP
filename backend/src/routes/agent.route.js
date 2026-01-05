import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { executeAgentTool } from "../controllers/agent.controller.js";

const router = Router();

router.post(
  "/execute",
  verifyJWT,              
  executeAgentTool
);

export default router;
