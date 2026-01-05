import { callMCP } from "../services/mcp.service.js";

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
