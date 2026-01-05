import { google} from "googleapis"
import { OAuthToken } from "../models/oauth_token.model"

export async function getGmailClient(userId) {
  const token = await OAuthToken.findOne({ userId, provider: "google" });
  if (!token) throw new Error("Gmail not connected");

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    expiry_date: token.expiryDate,
  });

  const gmail = google.gmail({ version: "v1", auth });
  return gmail;
}
