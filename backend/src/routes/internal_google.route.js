import express from "express";
import { serviceAuth } from "../middleware/service_auth.js";
import { OAuthToken } from "../models/oauth_token.model.js";

const router = express.Router();

import { google } from "googleapis";

router.post("/gmail/token", serviceAuth, async (req, res) => {
  const { userId } = req.body;

  const tokenDoc = await OAuthToken.findOne({
    userId,
    provider: "google"
  });

  if (!tokenDoc) {
    return res.status(400).json({ error: "Gmail not connected" });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_SYNC_ID,
    process.env.GOOGLE_SYNC_SECRET,
    process.env.GOOGLE_SYNC_URI
  );

  oauth2Client.setCredentials({
    access_token: tokenDoc.accessToken,
    refresh_token: tokenDoc.refreshToken,
    expiry_date: tokenDoc.expiryDate,
  });

  // 🔁 Refresh if expired
  if (tokenDoc.expiryDate && tokenDoc.expiryDate < Date.now()) {
    const { credentials } = await oauth2Client.refreshAccessToken();

    tokenDoc.accessToken = credentials.access_token;
    tokenDoc.expiryDate = credentials.expiry_date;
    await tokenDoc.save();
  }

  res.json({
    accessToken: tokenDoc.accessToken
  });
});


export default router;
