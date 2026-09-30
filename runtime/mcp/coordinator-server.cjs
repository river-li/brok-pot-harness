#!/usr/bin/env node
"use strict";

const http = require("node:http");
const readline = require("node:readline");
const { randomUUID, timingSafeEqual } = require("node:crypto");

const MCP_PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "brokpot-gateway", version: "0.2.0" };
const DEFAULT_GATEWAY_URL = "http://127.0.0.1:1540";
const DEFAULT_HTTP_PORT = 1541;
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_WAIT_MS = 30000;

function envInt(name, fallback, min, max) {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max)
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  return parsed;
}

function isLoopback(hostname) {
  const value = hostname.toLowerCase();
  return value === "localhost" || value === "127.0.0.1" || value === "::1" || value === "[::1]";
}

function gatewayBase() {
  const base = new URL(process.env.SAND_HOST_GATEWAY_URL || DEFAULT_GATEWAY_URL);
  if (!["http:", "https:"].includes(base.protocol))
    throw new Error("SAND_HOST_GATEWAY_URL must use http or https.");
  if (
    base.protocol === "http:" &&
    !isLoopback(base.hostname) &&
    process.env.BROKPOT_MCP_ALLOW_INSECURE_REMOTE !== "1"
  ) {
    throw new Error(
      "Refusing to send a Gateway token over remote plaintext HTTP. Use an SSH loopback tunnel, HTTPS, or BROKPOT_MCP_ALLOW_INSECURE_REMOTE=1.",
    );
  }
  return base;
}

async function gatewayCall(method, args = {}, timeoutMs = 30000, token) {
  const authToken = token || process.env.SAND_HOST_GATEWAY_TOKEN;
  if (!authToken) throw new Error("A Brokpot Gateway token is required.");
  const response = await fetch(new URL(`/api/${method}`, gatewayBase()), {
    method: "POST",
    redirect: "error",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${authToken}`,
      "x-sand-slim-avatars": "1",
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && typeof payload.error === "string"
        ? payload.error
        : `Gateway request failed (${response.status}).`;
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function verifyGatewayToken(token) {
  await gatewayCall("getHostStatus", { includeManagedCapabilities: false }, 5000, token);
}

function messageText(entry) {
  if (!entry || entry.kind !== "send-message") return null;
  const message = entry.message;
  if (!message || message.type !== "text") return null;
  if (typeof message.content === "string") return message.content;
  if (typeof message.text === "string") return message.text;
  return null;
}

function outboundUpdate(entry) {
  const text = messageText(entry);
  if (text != null) {
    return {
      id: entry.id || null,
      kind: "message",
      text,
      timestamp_ms: entry.timestampMs || entry.createdAtMs || null,
      channel: entry.message?.channel || null,
    };
  }
  if (entry?.kind === "notice" || entry?.kind === "error" || entry?.kind === "event") {
    return {
      id: entry.id || null,
      kind: entry.kind,
      timestamp_ms: entry.timestampMs || entry.createdAtMs || null,
      entry,
    };
  }
  return null;
}

function encodeCursor(agentId, transcript) {
  const last = transcript.length > 0 ? transcript[transcript.length - 1] : null;
  const payload = {
    v: 1,
    agent_id: agentId,
    index: transcript.length,
    anchor_id: typeof last?.id === "string" ? last.id : null,
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodeCursor(cursor) {
  if (typeof cursor !== "string" || cursor.length === 0) return null;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    if (
      parsed?.v !== 1 ||
      typeof parsed.agent_id !== "string" ||
      !Number.isInteger(parsed.index) ||
      parsed.index < 0
    ) throw new Error("invalid");
    return parsed;
  } catch {
    throw new Error("cursor is invalid.");
  }
}

async function resolveAgent(args, token) {
  if (typeof args.agent_id === "string" && args.agent_id.trim()) {
    const agents = await gatewayCall("listAgents", {}, 30000, token);
    const found = agents.find((agent) => agent.id === args.agent_id.trim());
    if (!found) throw new Error(`No Bot found with id ${args.agent_id}.`);
    return found;
  }
  const name = typeof args.agent_name === "string" ? args.agent_name.trim() : "";
  if (!name) throw new Error("Provide agent_id or agent_name.");
  const agents = await gatewayCall("searchAgents", { query: name, limit: 20 }, 30000, token);
  const exact = agents.filter((agent) => String(agent.name || "").toLowerCase() === name.toLowerCase());
  const candidates = exact.length ? exact : agents;
  if (candidates.length === 0) throw new Error(`No Bot matched "${name}".`);
  if (candidates.length > 1) {
    const choices = candidates.slice(0, 8).map((agent) => `${agent.name} (${agent.id})`).join(", ");
    throw new Error(`Multiple Bots matched "${name}": ${choices}. Use agent_id.`);
  }
  return candidates[0];
}

async function listAgents(args, token) {
  const query = typeof args.query === "string" ? args.query.trim() : "";
  const rows = query
    ? await gatewayCall("searchAgents", { query, limit: 100 }, 30000, token)
    : await gatewayCall("listAgents", {}, 30000, token);
  return rows.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description || "",
    title: agent.title || "",
    run_state: agent.runState || agent.run_state || null,
    is_group: agent.isGroup === true || agent.is_group === true,
  }));
}

async function sendMessage(args, token) {
  const message = typeof args.message === "string" ? args.message.trim() : "";
  if (!message) throw new Error("message must be a non-empty string.");
  const agent = await resolveAgent(args, token);
  const before = await gatewayCall("getAgentTranscript", { id: agent.id }, 30000, token);
  const cursor = encodeCursor(agent.id, before);
  const clientNonce = typeof args.message_id === "string" && args.message_id.trim()
    ? args.message_id.trim()
    : randomUUID();
  const acceptance = await gatewayCall(
    "sendPrompt",
    { prompt: message, agentId: agent.id, clientNonce },
    30000,
    token,
  );
  return {
    agent: { id: agent.id, name: agent.name },
    message_id: clientNonce,
    accepted: true,
    acceptance,
    updates_cursor: cursor,
  };
}

function cursorStart(transcript, decoded) {
  if (decoded == null) return { start: Math.max(0, transcript.length - 20), rebased: false };
  if (decoded.anchor_id != null) {
    const anchor = transcript.findIndex((entry) => entry?.id === decoded.anchor_id);
    if (anchor >= 0) return { start: anchor + 1, rebased: false };
  }
  if (decoded.index <= transcript.length) return { start: decoded.index, rebased: true };
  return { start: 0, rebased: true };
}

async function getUpdates(args, token) {
  const decoded = decodeCursor(args.cursor);
  const agent = decoded != null
    ? await resolveAgent({ agent_id: decoded.agent_id }, token)
    : await resolveAgent(args, token);
  if (
    decoded != null &&
    typeof args.agent_id === "string" &&
    args.agent_id.trim() &&
    args.agent_id.trim() !== decoded.agent_id
  ) throw new Error("cursor belongs to a different Bot.");
  const transcript = await gatewayCall("getAgentTranscript", { id: agent.id }, 30000, token);
  const { start, rebased } = cursorStart(transcript, decoded);
  const maxUpdates = Number.isInteger(args.limit) ? Math.min(Math.max(args.limit, 1), 100) : 50;
  const updates = transcript
    .slice(start)
    .map(outboundUpdate)
    .filter(Boolean)
    .slice(0, maxUpdates);
  return {
    agent: { id: agent.id, name: agent.name },
    updates,
    cursor: encodeCursor(agent.id, transcript),
    cursor_rebased: rebased,
    transcript_entries_seen: Math.max(0, transcript.length - start),
  };
}

async function waitForUpdates(args, token) {
  const timeoutMs = Number.isInteger(args.timeout_ms)
    ? Math.min(Math.max(args.timeout_ms, 250), MAX_WAIT_MS)
    : 20000;
  const pollMs = Number.isInteger(args.poll_interval_ms)
    ? Math.min(Math.max(args.poll_interval_ms, 100), 5000)
    : 750;
  const deadline = Date.now() + timeoutMs;
  let cursor = args.cursor;
  let latest;
  do {
    latest = await getUpdates({ ...args, cursor }, token);
    cursor = latest.cursor;
    if (latest.updates.length > 0) {
      return { ...latest, timed_out: false };
    }
    if (Date.now() >= deadline) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(pollMs, Math.max(0, deadline - Date.now()))));
  } while (Date.now() < deadline);
  return { ...latest, cursor, timed_out: true };
}

async function readTranscript(args, token) {
  const agent = await resolveAgent(args, token);
  const limit = Number.isInteger(args.limit) ? Math.min(Math.max(args.limit, 1), 100) : 20;
  const transcript = await gatewayCall("getAgentTranscript", { id: agent.id }, 30000, token);
  return {
    agent: { id: agent.id, name: agent.name },
    cursor: encodeCursor(agent.id, transcript),
    entries: transcript.slice(-limit),
  };
}

async function getAgentStatus(args, token) {
  const agent = await resolveAgent(args, token);
  const [subagents, asyncTasks, outline, host] = await Promise.all([
    gatewayCall("getSubagents", { id: agent.id }, 30000, token),
    gatewayCall("getAsyncTasks", { id: agent.id }, 30000, token),
    gatewayCall("getConversationOutline", { id: agent.id }, 30000, token),
    gatewayCall("getHostStatus", { includeManagedCapabilities: false }, 30000, token),
  ]);
  return {
    agent,
    host: {
      is_busy: host?.isBusy ?? null,
      active_agent_id: host?.activeAgentId ?? null,
      busy_only_awaiting_approval: host?.busyOnlyAwaitingApproval ?? null,
      last_busy_at_ms: host?.lastBusyAtMs ?? null,
    },
    subagents,
    async_tasks: asyncTasks,
    recent_outline: Array.isArray(outline) ? outline.slice(-30) : outline,
  };
}

const TOOLS = [
  {
    name: "brokpot_list_agents",
    description:
      "List or search Bots on the authenticated Brokpot Host. Use this to discover coordinators, project managers, groups, or other Bots and obtain stable agent ids.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_send_message",
    description:
      "Reliably submit a message to one Bot and return immediately after the Host accepts it. This does not wait for the Bot or any downstream agents to finish. The returned updates_cursor can be passed to brokpot_get_updates or brokpot_wait_for_updates.",
    inputSchema: {
      type: "object",
      properties: {
        agent_id: { type: "string" },
        agent_name: { type: "string" },
        message: { type: "string" },
        message_id: { type: "string", description: "Optional idempotency key/client nonce." },
      },
      required: ["message"],
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_get_updates",
    description:
      "Read new user-visible Bot messages/notices since an opaque transcript cursor. It is safe to call repeatedly for long-running work; the Host transcript remains the source of truth.",
    inputSchema: {
      type: "object",
      properties: {
        cursor: { type: "string" },
        agent_id: { type: "string" },
        agent_name: { type: "string" },
        limit: { type: "integer", minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_wait_for_updates",
    description:
      "Long-poll for new user-visible updates without waiting for the whole task to finish. The wait is bounded to 30 seconds; use the returned cursor for the next call.",
    inputSchema: {
      type: "object",
      properties: {
        cursor: { type: "string" },
        agent_id: { type: "string" },
        agent_name: { type: "string" },
        limit: { type: "integer", minimum: 1, maximum: 100 },
        timeout_ms: { type: "integer", minimum: 250, maximum: 30000 },
        poll_interval_ms: { type: "integer", minimum: 100, maximum: 5000 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_get_agent_status",
    description:
      "Inspect an agent's existing Host state without changing orchestration: current subagents, async tasks, recent conversation outline, and Host busy/active state.",
    inputSchema: {
      type: "object",
      properties: {
        agent_id: { type: "string" },
        agent_name: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_read_transcript",
    description:
      "Read recent raw transcript entries for a Bot for audit/debugging, including group/coordinator conversations when the caller intentionally wants to inspect them.",
    inputSchema: {
      type: "object",
      properties: {
        agent_id: { type: "string" },
        agent_name: { type: "string" },
        limit: { type: "integer", minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
];

function textResult(value) {
  return {
    content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
  };
}

async function callTool(name, args, token) {
  if (name === "brokpot_list_agents") return textResult(await listAgents(args || {}, token));
  if (name === "brokpot_send_message") return textResult(await sendMessage(args || {}, token));
  if (name === "brokpot_get_updates") return textResult(await getUpdates(args || {}, token));
  if (name === "brokpot_wait_for_updates") return textResult(await waitForUpdates(args || {}, token));
  if (name === "brokpot_get_agent_status") return textResult(await getAgentStatus(args || {}, token));
  if (name === "brokpot_read_transcript") return textResult(await readTranscript(args || {}, token));
  return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
}

async function dispatch(request, context) {
  const { id, method, params } = request || {};
  if (method === "notifications/initialized" || method === "notifications/cancelled") return null;
  if (method === "initialize") {
    await verifyGatewayToken(context.gatewayToken);
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
      },
    };
  }
  if (method === "ping") {
    await verifyGatewayToken(context.gatewayToken);
    return { jsonrpc: "2.0", id, result: {} };
  }
  if (method === "tools/list") {
    await verifyGatewayToken(context.gatewayToken);
    return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  }
  if (method === "tools/call") {
    try {
      const result = await callTool(params?.name, params?.arguments || {}, context.gatewayToken);
      return { jsonrpc: "2.0", id, result };
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
        },
      };
    }
  }
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

function runStdio() {
  const gatewayToken = process.env.SAND_HOST_GATEWAY_TOKEN;
  if (!gatewayToken) throw new Error("SAND_HOST_GATEWAY_TOKEN is required in stdio mode.");
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on("line", (line) => {
    if (!line.trim()) return;
    let request;
    try {
      request = JSON.parse(line);
    } catch {
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }) + "\n");
      return;
    }
    void dispatch(request, { gatewayToken })
      .then((response) => {
        if (response) process.stdout.write(JSON.stringify(response) + "\n");
      })
      .catch((error) => {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: "2.0",
            id: request.id ?? null,
            error: { code: error?.status === 401 ? -32001 : -32603, message: error instanceof Error ? error.message : String(error) },
          }) + "\n",
        );
      });
  });
}

function sameToken(supplied, expected) {
  const a = Buffer.from(supplied || "");
  const b = Buffer.from(expected || "");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("request body too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function bearerToken(req) {
  const auth = req.headers.authorization || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : "";
}

function runHttp() {
  const host = process.env.BROKPOT_MCP_HTTP_HOST || "127.0.0.1";
  const port = envInt("BROKPOT_MCP_HTTP_PORT", DEFAULT_HTTP_PORT, 1, 65535);
  const secondFactor = process.env.BROKPOT_MCP_SERVER_TOKEN;
  const server = http.createServer((req, res) => {
    void (async () => {
      if (req.url !== "/mcp") {
        res.writeHead(404).end();
        return;
      }
      const gatewayToken = bearerToken(req);
      if (!gatewayToken) {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Brokpot Gateway bearer token required" }));
        return;
      }
      if (secondFactor && !sameToken(req.headers["x-brokpot-mcp-token"], secondFactor)) {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "secondary MCP token required" }));
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(405, { allow: "POST" }).end();
        return;
      }
      const request = await readJson(req);
      try {
        const response = await dispatch(request, { gatewayToken });
        if (response == null) {
          res.writeHead(202).end();
          return;
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (error) {
        const status = error?.status === 401 ? 401 : 500;
        res.writeHead(status, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
      }
    })().catch((error) => {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
    });
  });
  server.listen(port, host, () => {
    process.stderr.write(`Brokpot MCP listening on http://${host}:${port}/mcp\n`);
  });
}

if (process.argv.includes("--http")) runHttp();
else runStdio();
