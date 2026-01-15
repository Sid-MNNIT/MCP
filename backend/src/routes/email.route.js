import { Router } from "express";
import {
  storeEmail,
  listEmails,
   deleteEmail,
   getUserEmail
} from "../controllers/email.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, storeEmail);


router.get("/fetch-email", verifyJWT, getUserEmail);


router.get("/", verifyJWT, listEmails);
router.delete("/:id", verifyJWT, deleteEmail);

// email tool call routes


export default router;
