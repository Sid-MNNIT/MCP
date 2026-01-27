import fetch from "node-fetch";

const ORCHESTRATOR_URL = "http://localhost:9000";

export async function callMCP({
  tool,
  args = {},
  userId,
  endpoint,
  jwt
}) {
  console.log("SERVICE_KEY:", process.env.SERVICE_KEY);

  const isPipeline = Boolean(endpoint);

  const url = isPipeline
    ? `${ORCHESTRATOR_URL}${endpoint}`
    : `${ORCHESTRATOR_URL}/agent/execute`;

  const headers = {
    "Content-Type": "application/json",
    "X-Service-Key": process.env.SERVICE_KEY
  };

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  const body = isPipeline
    ? { ...args, userId }
    : {
        tool,
        userId,
        args: {
          ...args,
          userId          // ✅ KEEP mutation for tools
        }
      };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `MCP ${isPipeline ? "pipeline" : "tool"} failed: ${text}`
    );
  }

  return res.json();
}
