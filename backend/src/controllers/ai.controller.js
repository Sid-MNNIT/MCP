import { executePipeline } from "../services/ai.service.js";

export async function aiExecute(req, res) {
  try {
    const { endpoint, args } = req.body;

    const userId = req.user._id;
    const jwt =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    const result = await executePipeline({
      endpoint,
      args,
      userId,
      jwt
    });

    res.json(result);
  } catch (err) {
    console.error("❌ AI execute failed:", err.message);
    res.status(500).json({ error: err.message });
  }
}
