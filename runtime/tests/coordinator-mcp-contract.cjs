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

function delayResponse(res, delayMs) {
  return new Promise((resolve) => {
    const finish = () => {
      clearTimeout(timer);
      res.off("close", finish);
      resolve();
    };
    const timer = setTimeout(finish, delayMs);
    res.once("close", finish);
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

async function callTool(base, token, secondaryToken, id, name, args) {
  const response = await post(
    base,
    token,
    { jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } },
    secondaryToken,
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.result.isError, undefined, body.result.content?.[0]?.text);
  return JSON.parse(body.result.content[0].text);
}

function makeHarness(t, options = {}) {
  const gatewayToken = "gateway-test-token";
  const secondaryToken = "secondary-test-token";
  const transcripts = [];
  const accepted = new Map();
  const calls = [];
  const pendingRequests = new Set();
  const requestErrors = [];
  const abortedResponses = [];
  const roster =
    options.roster ??
    [
      { id: "coord-1", name: "Steve", description: "coordinates work", runState: "running" },
      { id: "worker-1", name: "Builder", description: "implementation worker", runState: "idle" },
    ];

  async function handleRequest(req, res) {
    if (req.headers.authorization !== `Bearer ${gatewayToken}`) {
      res.writeHead(401, { "content-type": "application/json" }).end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    calls.push({ path: req.url, body });
    res.setHeader("content-type", "application/json");

    if (options.stallBodyPath === req.url) {
      // Flush headers and part of a valid response, then wait for client abort.
      const closed = new Promise((resolve) => res.once("close", resolve));
      res.write("[");
      await closed;
      return;
    }
    if (typeof options.delayMs === "number" && options.delayMs > 0) {
      await delayResponse(res, options.delayMs);
    }
    if (res.destroyed) return;

    if (req.url === "/api/getHostStatus") {
      res.end(JSON.stringify({ ok: true, isBusy: true, activeAgentId: "coord-1", lastBusyAtMs: 123 }));
      return;
    }
    if (req.url === "/api/listAgents") {
      res.end(JSON.stringify(roster));
      return;
    }
    if (req.url === "/api/searchAgents") {
      // Real shape: transcript-content search hits, not roster rows.
      res.end(JSON.stringify([
        { agentId: "worker-1", entryId: "t1", role: "assistant", timestampMs: 10, snippet: "Steve was mentioned here" },
      ]));
      return;
    }
    if (req.url === "/api/getAgentTranscript") {
      res.end(JSON.stringify(transcripts));
      return;
    }
    if (req.url === "/api/promptAcceptanceStatus") {
      const record = accepted.get(body.clientNonce);
      res.end(
        JSON.stringify(
          record == null
            ? { outcome: "not-found" }
            : {
                outcome: "found",
                record: {
                  accountSlot: "host",
                  clientNonce: body.clientNonce,
                  inputDigest: "fixture",
                  status: "accepted",
                  acceptedAtMs: record.acceptedAtMs,
                  agentId: record.agentId,
                  echoEntryId: record.echoEntryId,
                  rejectionCode: null,
                },
              },
        ),
      );
      return;
    }
    if (req.url === "/api/sendPrompt") {
      const existing = accepted.get(body.clientNonce);
      if (existing == null) {
        const entry = {
          kind: "message",
          role: "user",
          id: `user-${body.clientNonce}`,
          content: body.prompt,
          clientNonce: body.clientNonce,
          timestampMs: 100,
        };
        transcripts.push(entry);
        accepted.set(body.clientNonce, {
          agentId: body.agentId,
          echoEntryId: entry.id,
          acceptedAtMs: Date.now(),
        });
      }
      res.end(JSON.stringify({ accepted: true }));
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
  }

  const gateway = http.createServer((req, res) => {
    res.once("close", () => {
      if (!res.writableFinished) abortedResponses.push(req.url);
    });
    const pending = handleRequest(req, res).catch((error) => {
      // Client deadline expiration can also interrupt request-body consumption.
      if (!(req.aborted && error.code === "ECONNRESET")) requestErrors.push(error);
      res.destroy();
    }).finally(() => pendingRequests.delete(pending));
    pendingRequests.add(pending);
  });

  let child;
  let base;

  return {
    gatewayToken,
    secondaryToken,
    transcripts,
    accepted,
    calls,
    abortedResponses,
    roster,
    async drainRequests() {
      await Promise.all([...pendingRequests]);
    },
    async start() {
      const gatewayPort = await listen(gateway);
      t.after(async () => {
        if (child && child.exitCode == null && child.signalCode == null) {
          const exited = new Promise((resolve) => child.once("close", resolve));
          child.kill("SIGTERM");
          await exited;
        }
        const closed = new Promise((resolve, reject) => gateway.close((error) => error ? reject(error) : resolve()));
        gateway.closeAllConnections();
        await Promise.all([closed, ...pendingRequests]);
        assert.deepEqual(requestErrors, [], "unexpected fake Gateway request failures");
      });

      const mcpPort = 19000 + Math.floor(Math.random() * 1000);
      child = spawn(
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

      base = `http://127.0.0.1:${mcpPort}/mcp`;
      return base;
    },
    base: () => base,
  };
}

test("Brokpot MCP authenticates with Gateway token and exposes the current tool set", async (t) => {
  const h = makeHarness(t);
  const base = await h.start();

  const missingGateway = await fetch(base, {
    method: "POST",
    headers: { "content-type": "application/json", "x-brokpot-mcp-token": h.secondaryToken },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
  });
  assert.equal(missingGateway.status, 401);

  const missingSecondFactor = await post(base, h.gatewayToken, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });
  assert.equal(missingSecondFactor.status, 401);

  const initialized = await post(
    base,
    h.gatewayToken,
    {
      jsonrpc: "2.0",
      id: 3,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } },
    },
    h.secondaryToken,
  );
  assert.equal(initialized.status, 200);

  const toolsResponse = await post(
    base,
    h.gatewayToken,
    { jsonrpc: "2.0", id: 4, method: "tools/list", params: {} },
    h.secondaryToken,
  );
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
});

test("agent name resolution uses roster summaries, not transcript search hits", async (t) => {
  const h = makeHarness(t);
  const base = await h.start();

  const sent = await callTool(base, h.gatewayToken, h.secondaryToken, 10, "brokpot_send_message", {
    agent_name: "Steve",
    message: "Coordinate the migration.",
  });
  assert.equal(sent.agent.id, "coord-1");
  assert.equal(h.calls.some((call) => call.path === "/api/searchAgents"), false);

  const listed = await callTool(base, h.gatewayToken, h.secondaryToken, 11, "brokpot_list_agents", {
    query: "steve",
  });
  assert.deepEqual(listed.map((agent) => agent.id), ["coord-1"]);
});

test("duplicate Bot names require agent_id even when transcript content mentions the name", async (t) => {
  const h = makeHarness(t, {
    roster: [
      { id: "coord-a", name: "Steve", description: "one" },
      { id: "coord-b", name: "Steve", description: "two" },
      { id: "other", name: "Other", description: "Steve appears in transcript only" },
    ],
  });
  const base = await h.start();

  const response = await post(
    base,
    h.gatewayToken,
    {
      jsonrpc: "2.0",
      id: 12,
      method: "tools/call",
      params: {
        name: "brokpot_send_message",
        arguments: { agent_name: "Steve", message: "Hello" },
      },
    },
    h.secondaryToken,
  );
  const body = await response.json();
  assert.equal(body.result.isError, true);
  assert.match(body.result.content[0].text, /Multiple Bots are named/);
});

test("update pagination preserves unread visible messages across non-visible entries", async (t) => {
  const h = makeHarness(t);
  const base = await h.start();

  const sent = await callTool(base, h.gatewayToken, h.secondaryToken, 20, "brokpot_send_message", {
    agent_name: "Steve",
    message: "Start.",
    message_id: "page-test",
  });

  h.transcripts.push(
    { kind: "send-message", id: "m1", message: { type: "text", content: "one" } },
    { kind: "tool-call", id: "internal", name: "Task", status: "pending" },
    { kind: "send-message", id: "m2", message: { type: "text", content: "two" } },
    { kind: "send-message", id: "m3", message: { type: "text", content: "three" } },
  );

  const page1 = await callTool(base, h.gatewayToken, h.secondaryToken, 21, "brokpot_get_updates", {
    cursor: sent.updates_cursor,
    limit: 1,
  });
  assert.deepEqual(page1.updates.map((u) => u.text), ["one"]);
  assert.equal(page1.has_more, true);

  const page2 = await callTool(base, h.gatewayToken, h.secondaryToken, 22, "brokpot_get_updates", {
    cursor: page1.cursor,
    limit: 1,
  });
  assert.deepEqual(page2.updates.map((u) => u.text), ["two"]);
  assert.equal(page2.transcript_entries_seen, 2);

  const page3 = await callTool(base, h.gatewayToken, h.secondaryToken, 23, "brokpot_get_updates", {
    cursor: page2.cursor,
    limit: 5,
  });
  assert.deepEqual(page3.updates.map((u) => u.text), ["three"]);
});

test("retrying an accepted message_id preserves the original reply boundary", async (t) => {
  const h = makeHarness(t);
  const base = await h.start();

  const first = await callTool(base, h.gatewayToken, h.secondaryToken, 30, "brokpot_send_message", {
    agent_name: "Steve",
    message: "Do the work.",
    message_id: "retry-1",
  });
  h.transcripts.push({
    kind: "send-message",
    id: "reply-1",
    message: { type: "text", content: "Started and delegated." },
  });

  const retry = await callTool(base, h.gatewayToken, h.secondaryToken, 31, "brokpot_send_message", {
    agent_name: "Steve",
    message: "Do the work.",
    message_id: "retry-1",
  });

  const updates = await callTool(base, h.gatewayToken, h.secondaryToken, 32, "brokpot_get_updates", {
    cursor: retry.updates_cursor,
  });
  assert.deepEqual(updates.updates.map((u) => u.text), ["Started and delegated."]);
  assert.equal(first.message_id, retry.message_id);
});

test("non-text user-visible messages surface approval and attachment updates", async (t) => {
  const h = makeHarness(t);
  const base = await h.start();

  const sent = await callTool(base, h.gatewayToken, h.secondaryToken, 40, "brokpot_send_message", {
    agent_name: "Steve",
    message: "Run it.",
    message_id: "cards",
  });

  h.transcripts.push(
    {
      kind: "send-message",
      id: "approval",
      message: {
        type: "auto-review-approval",
        approval: { requestId: "approve-1", summary: "Run deployment command", status: "pending" },
      },
    },
    {
      kind: "send-message",
      id: "attachment",
      message: {
        type: "attachment",
        url: "file:///workspace/result.md",
        file_name: "result.md",
      },
    },
  );

  const updates = await callTool(base, h.gatewayToken, h.secondaryToken, 41, "brokpot_get_updates", {
    cursor: sent.updates_cursor,
    limit: 10,
  });
  assert.equal(updates.updates[0].message_type, "auto-review-approval");
  assert.equal(updates.updates[0].requires_user_action, true);
  assert.equal(updates.updates[0].action_surface, "existing-brokpot-ui");
  assert.equal(updates.updates[1].message_type, "attachment");
  assert.equal(updates.updates[1].attachment.file_name, "result.md");
});

test("agent status observes existing Host subagents, async tasks, outline, and busy state", async (t) => {
  const h = makeHarness(t);
  const base = await h.start();

  const status = await callTool(base, h.gatewayToken, h.secondaryToken, 50, "brokpot_get_agent_status", {
    agent_id: "coord-1",
  });
  assert.equal(status.subagents[0].status, "running");
  assert.equal(status.async_tasks[0].id, "sub-1");
  assert.equal(status.host.active_agent_id, "coord-1");
});

test("long-poll deadline bounds slow Gateway I/O", async (t) => {
  const h = makeHarness(t, { delayMs: 300 });
  const base = await h.start();

  // Establish a cursor outside the measured wait.
  h.transcripts.push({ kind: "message", role: "user", id: "seed", content: "seed" });
  const cursorResult = await callTool(base, h.gatewayToken, h.secondaryToken, 60, "brokpot_read_transcript", {
    agent_id: "coord-1",
    limit: 1,
  });

  const started = Date.now();
  const waited = await callTool(base, h.gatewayToken, h.secondaryToken, 61, "brokpot_wait_for_updates", {
    cursor: cursorResult.cursor,
    timeout_ms: 250,
    poll_interval_ms: 100,
  });
  const elapsed = Date.now() - started;

  assert.equal(waited.timed_out, true);
  assert.equal(waited.cursor, cursorResult.cursor);
  assert.deepEqual(waited.updates, []);
  assert.ok(elapsed < 550, `expected bounded wait, got ${elapsed}ms`);
  await h.drainRequests();
  assert.deepEqual(h.abortedResponses, ["/api/listAgents"]);
});

test("long-poll deadline preserves the cursor when headers arrive before a stalled body", async (t) => {
  const options = {};
  const h = makeHarness(t, options);
  const base = await h.start();
  h.transcripts.push({ kind: "message", role: "user", id: "seed", content: "seed" });
  const initial = await callTool(base, h.gatewayToken, h.secondaryToken, 70, "brokpot_read_transcript", {
    agent_id: "coord-1",
  });
  h.transcripts.push({ kind: "send-message", id: "later", message: { type: "text", content: "still unread" } });
  options.stallBodyPath = "/api/getAgentTranscript";

  const started = Date.now();
  const waited = await callTool(base, h.gatewayToken, h.secondaryToken, 71, "brokpot_wait_for_updates", {
    cursor: initial.cursor,
    timeout_ms: 250,
  });
  const elapsed = Date.now() - started;
  assert.equal(waited.timed_out, true);
  assert.equal(waited.cursor, initial.cursor);
  assert.deepEqual(waited.updates, []);
  assert.ok(elapsed < 550, `expected bounded body read, got ${elapsed}ms`);
  await h.drainRequests();
  assert.deepEqual(h.abortedResponses, ["/api/getAgentTranscript"]);

  delete options.stallBodyPath;
  const resumed = await callTool(base, h.gatewayToken, h.secondaryToken, 72, "brokpot_get_updates", {
    cursor: waited.cursor,
  });
  assert.deepEqual(resumed.updates.map((update) => update.id), ["later"]);
});

test("long-poll shares one deadline across sequential roster and transcript requests", async (t) => {
  const options = {};
  const h = makeHarness(t, options);
  const base = await h.start();
  h.transcripts.push({ kind: "message", role: "user", id: "seed", content: "seed" });
  const initial = await callTool(base, h.gatewayToken, h.secondaryToken, 80, "brokpot_read_transcript", {
    agent_id: "coord-1",
  });
  h.transcripts.push({ kind: "send-message", id: "later", message: { type: "text", content: "still unread" } });
  // Each response fits individually; their combined latency exceeds the budget.
  options.delayMs = 180;
  const callStart = h.calls.length;

  const started = Date.now();
  const waited = await callTool(base, h.gatewayToken, h.secondaryToken, 81, "brokpot_wait_for_updates", {
    cursor: initial.cursor,
    timeout_ms: 250,
  });
  const elapsed = Date.now() - started;
  assert.equal(waited.timed_out, true);
  assert.equal(waited.cursor, initial.cursor);
  assert.deepEqual(waited.updates, []);
  assert.deepEqual(h.calls.slice(callStart).map((call) => call.path), ["/api/listAgents", "/api/getAgentTranscript"]);
  assert.ok(elapsed < 550, `expected one shared budget, got ${elapsed}ms`);
  await h.drainRequests();
  assert.deepEqual(h.abortedResponses, ["/api/getAgentTranscript"]);
});
