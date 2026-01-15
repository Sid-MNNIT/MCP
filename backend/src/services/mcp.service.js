import fetch from "node-fetch";

const ORCHESTRATOR_URL = "http://localhost:9000";

export async function callMCP({ tool, args, userId }) {
  console.log("SERVICE_KEY:", process.env.SERVICE_KEY);

  const res = await fetch(`${ORCHESTRATOR_URL}/agent/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Key": process.env.SERVICE_KEY
    },
    body: JSON.stringify({
      tool,
      userId,                 
      args: {
        ...args,
        userId               
      }
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
 
  return res.json();
}
