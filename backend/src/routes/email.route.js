import { Router } from "express";
import {
  storeEmail,
  listEmails,
   deleteEmail,
} from "../controllers/email.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, storeEmail);
router.get("/", verifyJWT, listEmails);
router.delete("/:id", verifyJWT, deleteEmail);


export default router;
