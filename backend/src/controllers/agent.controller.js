import { callMCP } from "../services/mcp.service.js";
import fetch from "node-fetch"

export async function executeAgentTool(req, res) {
  try {
    const userId = req.user._id;          // 🔥 USER RESOLVED HERE
    const { tool, args } = req.body;

    if (!tool) {
      return res.status(400).json({ error: "tool is required" });
    }

    const result = await callMCP({
      tool,
      args: args || {},
      userId
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Agent execution failed" });
  }
}

export async function emailReplyPreview(req, res) {
  try {
    const { messageId, tone = "professional" } = req.body;

    if (!messageId) {
      return res.status(400).json({
        error: "messageId is required"
      });
    }
    const jwt =
  req.headers.authorization?.replace("Bearer ", "") ||
  req.cookies?.accessToken;


    const response = await fetch(
      "http://localhost:9000/pipelines/email-reply-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Service-Key": process.env.SERVICE_KEY,
          "Authorization": `Bearer ${jwt}`   
        },
        body: JSON.stringify({
          messageId,
          tone,
          userId: req.user._id                     // 🔥 IMPORTANT
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();

    /**
     * data = {
     *   draft: {
     *     to,
     *     subject,
     *     body,
     *     threadId,
     *     in_reply_to
     *   }
     * }
     */

    return res.json(data);

  } catch (err) {
    console.error("❌ emailReplyPreview failed:", err);
    return res.status(500).json({
      error: "AI reply preview failed",
      details: err.message
    });
  }
}


export async function emailReplySend(req, res) {
  try {
    const { to, subject, body, threadId, in_reply_to } = req.body;
    console.log(to,"\n",subject,"\n",body,"\n",threadId,"\n",in_reply_to)

    if (!to || !subject || !body || !threadId || !in_reply_to) {
      return res.status(400).json({ error: "Invalid draft" });
    }

    const jwt =
  req.headers.authorization?.replace("Bearer ", "") ||
  req.cookies?.accessToken;

    const response = await fetch(
      "http://localhost:9000/pipelines/email-reply-send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Service-Key": process.env.SERVICE_KEY,
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
          draft: { to, subject, body, threadId, in_reply_to },
          userId: req.user._id
        })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error("❌ emailReplySend failed:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
