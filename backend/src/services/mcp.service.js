/**
 * Call MCP Orchestrator
 * 
 * Supports two modes:
 * 1. Pipeline mode: { endpoint: "/pipelines/job-search", args: {...}, userId, jwt }
 * 2. Legacy mode: { tool: "search_jobs", args: {...}, userId }
 */
import fetch from "node-fetch";

const ORCHESTRATOR_URL = "http://localhost:9000";

export async function callMCP({ tool, args, userId, endpoint, jwt }) {
  console.log("SERVICE_KEY:", process.env.SERVICE_KEY);

  // Determine URL and body format based on mode
  const url = endpoint 
    ? `${ORCHESTRATOR_URL}${endpoint}`           
    : `${ORCHESTRATOR_URL}/agent/execute`;      
  
  const body = endpoint 
    ? { ...args, userId }                         
    : { tool, userId, args: { ...args, userId } }; 

  console.log(`🔄 Calling MCP: ${endpoint || `/agent/execute (tool: ${tool})`}`);

  // Build headers - include JWT if provided
  const headers = {
    "Content-Type": "application/json",
    "X-Service-Key": process.env.SERVICE_KEY
  };

  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ MCP Error: ${res.status} - ${errorText}`);
    throw new Error(errorText || `MCP request failed with status ${res.status}`);
  }
 
  return res.json();
}