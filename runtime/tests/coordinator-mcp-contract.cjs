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

function post(url, gatewayToken, body, secondaryToken) {
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${gatewayToken}`,
      ...(secondaryToken ? { "x-brokpot-mcp-token": secondaryToken } : {}),
    },
    body: JSON.stringify(body),
  });
}

test("Brokpot MCP authenticates with Gateway token and supports long-running observation", async (t) => {
  const gatewayToken = "gateway-test-token";
  const secondaryToken = "secondary-test-token";
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

    if (req.url === "/api/getHostStatus") {
      res.end(JSON.stringify({ ok: true, isBusy: true, activeAgentId: "coord-1", lastBusyAtMs: 123 }));
      return;
    }
    if (req.url === "/api/listAgents") {
      res.end(JSON.stringify([{ id: "coord-1", name: "Steve", description: "coordinates work", runState: "running" }]));
      return;
    }
    if (req.url === "/api/searchAgents") {
      res.end(JSON.stringify([{ id: "coord-1", name: "Steve", description: "coordinates work", runState: "running" }]));
      return;
    }
    if (req.url === "/api/getAgentTranscript") {
      res.end(JSON.stringify(transcripts));
      return;
    }
    if (req.url === "/api/sendPrompt") {
      transcripts.push({ kind: "message", role: "user", id: body.clientNonce, content: body.prompt });
      res.end(JSON.stringify({ status: "accepted" }));
      return;
    }
    if (req.url === "/api/getSubagents") {
      res.end(JSON.stringify([{ subagentId: "sub-1", subagentType: "executor", title: "Implement migration", status: "running", startedAtMs: 100 }]));
      return;
    }
    if (req.url === "/api/getAsyncTasks") {
      res.end(JSON.stringify([{ kind: "subagent", id: "sub-1", status: "running" }]));
      return;
    }
    if (req.url === "/api/getConversationOutline") {
      res.end(JSON.stringify([{ kind: "tool-call", id: "t1", name: "Task", status: "pending", summary: "Delegating implementation" }]));
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
        BROKPOT_MCP_HTTP_PORT: String(mcpPort),
        BROKPOT_MCP_SERVER_TOKEN: secondaryToken,
      },
      stdio: ["ignore", "ignore", "pipe"],
    },
  );
  t.after(() => child.kill("SIGTERM"));

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("MCP server did not start")), 3000);
    child.stderr.on("data", (chunk) => {
      if (chunk.toString().includes("Brokpot MCP listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once("exit", (code) => reject(new Error(`MCP server exited early: ${code}`)));
  });

  const base = `http://127.0.0.1:${mcpPort}/mcp`;

  const missingGateway = await fetch(base, {
    method: "POST",
    headers: { "content-type": "application/json", "x-brokpot-mcp-token": secondaryToken },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
  });
  assert.equal(missingGateway.status, 401);

  const missingSecondFactor = await post(base, gatewayToken, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });
  assert.equal(missingSecondFactor.status, 401);

  const initialized = await post(base, gatewayToken, {
    jsonrpc: "2.0",
    id: 3,
    method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } },
  }, secondaryToken);
  assert.equal(initialized.status, 200);

  const toolsResponse = await post(base, gatewayToken, {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/list",
    params: {},
  }, secondaryToken);
  const toolsBody = await toolsResponse.json();
  assert.deepEqual(
    toolsBody.result.tools.map((tool) => tool.name),
    [
      "brokpot_list_agents",
      "brokpot_send_message",
      "brokpot_get_updates",
      "brokpot_wait_for_updates",
      "brokpot_get_agent_status",
      "brokpot_read_transcript",
    ],
  );

  const sendResponse = await post(base, gatewayToken, {
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: {
      name: "brokpot_send_message",
      arguments: { agent_name: "Steve", message: "Please coordinate the billing migration." },
    },
  }, secondaryToken);
  const sendBody = await sendResponse.json();
  const sent = JSON.parse(sendBody.result.content[0].text);
  assert.equal(sent.agent.id, "coord-1");
  assert.equal(sent.accepted, true);
  assert.ok(sent.message_id);
  assert.ok(sent.updates_cursor);

  transcripts.push({
    kind: "send-message",
    id: "a1",
    timestampMs: 200,
    message: { type: "text", content: "I delegated implementation and am waiting on the executor." },
  });

  const updateResponse = await post(base, gatewayToken, {
    jsonrpc: "2.0",
    id: 6,
    method: "tools/call",
    params: {
      name: "brokpot_get_updates",
      arguments: { cursor: sent.updates_cursor },
    },
  }, secondaryToken);
  const updateBody = await updateResponse.json();
  const updates = JSON.parse(updateBody.result.content[0].text);
  assert.equal(updates.updates.length, 1);
  assert.equal(updates.updates[0].text, "I delegated implementation and am waiting on the executor.");

  const statusResponse = await post(base, gatewayToken, {
    jsonrpc: "2.0",
    id: 7,
    method: "tools/call",
    params: {
      name: "brokpot_get_agent_status",
      arguments: { agent_id: "coord-1" },
    },
  }, secondaryToken);
  const statusBody = await statusResponse.json();
  const status = JSON.parse(statusBody.result.content[0].text);
  assert.equal(status.subagents[0].status, "running");
  assert.equal(status.async_tasks[0].id, "sub-1");
  assert.equal(status.host.active_agent_id, "coord-1");

  assert.ok(calls.some((call) => call.path === "/api/sendPrompt" && call.body.agentId === "coord-1"));
});
