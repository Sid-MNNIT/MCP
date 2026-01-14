import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { executeAgentTool,emailReplyPreview,emailReplySend } from "../controllers/agent.controller.js";

const router = Router();

router.post(
  "/execute",
  verifyJWT,              
  executeAgentTool
);


router.post(
  "/email-reply-preview",
  verifyJWT,
  emailReplyPreview
);

router.post(
  "/email-reply-send",
  verifyJWT,
  emailReplySend
);



export default router;
