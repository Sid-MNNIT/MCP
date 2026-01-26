
import { callMCP } from "./mcp.service.js";

class EmailService {

  async executeTool({ tool, args, userId, jwt }) {
    if (!tool) {
      throw new Error("tool is required");
    }

    return callMCP({
      tool,
      args,
      userId,
      jwt
    });
  }


  async previewEmailReply({ messageId, tone, userId, jwt }) {
    if (!messageId) {
      throw new Error("messageId is required");
    }

    return callMCP({
      endpoint: "/pipelines/email-reply-preview",
      args: {
        messageId,
        tone
      },
      userId,
      jwt
    });
  }


  async sendEmailReply({ draft, userId, jwt }) {
    const { to, subject, body, threadId, in_reply_to } = draft || {};

    if (!to || !subject || !body || !threadId || !in_reply_to) {
      throw new Error("Invalid draft");
    }

    return callMCP({
      endpoint: "/pipelines/email-reply-send",
      args: {
        draft
      },
      userId,
      jwt
    });
  }


  async syncEmails({ userId, jwt }) {
    if (!jwt) {
      throw new Error("JWT missing");
    }

    return callMCP({
      endpoint: "/pipelines/email-sync",
      userId,
      jwt
    });
  }
}

export const emailService = new EmailService();
