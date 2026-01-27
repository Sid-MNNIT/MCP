import { Router } from "express";
import {
  storeEmail,
  listEmails,
   deleteEmail,
   getUserEmail,
   executeAgentTool,
   emailReplyPreview,
   emailReplySend,
   emailSync
} from "../controllers/email.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, storeEmail);


router.get("/fetch-email", verifyJWT, getUserEmail);


router.get("/", verifyJWT, listEmails);
router.delete("/:id", verifyJWT, deleteEmail);




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

router.post(
  "/email-sync",
  verifyJWT,
  emailSync
)




export default router;
