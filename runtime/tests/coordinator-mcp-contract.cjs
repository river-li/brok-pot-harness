const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

function post(url, token, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

test("coordinator MCP bridges authenticated Gateway chat", async (t) => {
  const gatewayToken = "gateway-test-token";
  const mcpToken = "mcp-test-token";
  const transcripts = [];
  const calls = [];
  const gateway = http.createServer(async (req, res) => {
    if (req.headers.authorization !== `Bearer ${gatewayToken}`) {
      res.writeHead(401, { "content-type": "application/json" }).end(JSON.stringify({ error: "unauthorized" }));
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    calls.push({ path: req.url, body });
    res.setHeader("content-type", "application/json");
    if (req.url === "/api/listAgents") {
      res.end(JSON.stringify([{ id: "coord-1", name: "Coordinator", description: "routes tasks" }]));
      return;
    }
    if (req.url === "/api/searchAgents") {
      res.end(JSON.stringify([{ id: "coord-1", name: "Coordinator", description: "routes tasks" }]));
      return;
    }
    if (req.url === "/api/getAgentTranscript") {
      res.end(JSON.stringify(transcripts));
      return;
    }
    if (req.url === "/api/sendPrompt") {
      transcripts.push({ kind: "user-message", id: "u1", message: { type: "text", text: body.prompt } });
      setTimeout(() => {
        transcripts.push({
          kind: "send-message",
          id: "a1",
          message: { type: "text", text: "Delegation accepted." },
        });
      }, 25);
      res.end(JSON.stringify({ status: "accepted", clientNonce: body.clientNonce }));
      return;
    }
    res.writeHead(404).end(JSON.stringify({ error: "not found" }));
  });
  const gatewayPort = await listen(gateway);
  t.after(() => gateway.close());

  const mcpPort = 19000 + Math.floor(Math.random() * 1000);
  const child = spawn(
    process.execPath,
    [path.join(__dirname, "..", "mcp", "coordinator-server.cjs"), "--http"],
    {
      env: {
        ...process.env,
        SAND_HOST_GATEWAY_URL: `http://127.0.0.1:${gatewayPort}`,
        SAND_HOST_GATEWAY_TOKEN: gatewayToken,
        BROKPOT_MCP_HTTP_PORT: String(mcpPort),
        BROKPOT_MCP_SERVER_TOKEN: mcpToken,
      },
      stdio: ["ignore", "ignore", "pipe"],
    },
  );
  t.after(() => child.kill("SIGTERM"));

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("MCP server did not start")), 3000);
    child.stderr.on("data", (chunk) => {
      if (chunk.toString().includes("coordinator MCP listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once("exit", (code) => reject(new Error(`MCP server exited early: ${code}`)));
  });

  const base = `http://127.0.0.1:${mcpPort}/mcp`;
  const unauthorized = await post(base, "wrong", {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {},
  });
  assert.equal(unauthorized.status, 401);

  const initialized = await post(base, mcpToken, {
    jsonrpc: "2.0",
    id: 2,
    method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } },
  });
  assert.equal(initialized.status, 200);
  const initializeBody = await initialized.json();
  assert.equal(initializeBody.result.serverInfo.name, "brokpot-coordinator");

  const tools = await post(base, mcpToken, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/list",
    params: {},
  });
  const toolsBody = await tools.json();
  assert.deepEqual(
    toolsBody.result.tools.map((tool) => tool.name),
    ["brokpot_list_bots", "brokpot_chat_coordinator", "brokpot_read_transcript"],
  );

  const chat = await post(base, mcpToken, {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "brokpot_chat_coordinator",
      arguments: {
        agent_name: "Coordinator",
        message: "Create a worker and delegate the build.",
        timeout_ms: 2000,
        poll_interval_ms: 20,
      },
    },
  });
  const chatBody = await chat.json();
  assert.equal(chatBody.result.isError, undefined);
  const payload = JSON.parse(chatBody.result.content[0].text);
  assert.equal(payload.agent.id, "coord-1");
  assert.equal(payload.reply, "Delegation accepted.");
  assert.equal(payload.timed_out, false);
  assert.ok(calls.some((call) => call.path === "/api/sendPrompt" && call.body.agentId === "coord-1"));
});
