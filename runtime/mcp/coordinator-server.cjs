#!/usr/bin/env node
"use strict";

const http = require("node:http");
const readline = require("node:readline");
const { randomUUID, timingSafeEqual } = require("node:crypto");

const MCP_PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "brokpot-coordinator", version: "0.1.0" };
const DEFAULT_GATEWAY_URL = "http://127.0.0.1:1540";
const DEFAULT_HTTP_PORT = 1541;
const MAX_BODY_BYTES = 1024 * 1024;

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

function gatewayConfig() {
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
  const token = process.env.SAND_HOST_GATEWAY_TOKEN;
  if (!token) throw new Error("SAND_HOST_GATEWAY_TOKEN is required.");
  return { base, token };
}

async function gatewayCall(method, args = {}, timeoutMs = 30000) {
  const { base, token } = gatewayConfig();
  const response = await fetch(new URL(`/api/${method}`, base), {
    method: "POST",
    redirect: "error",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
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
    throw new Error(detail);
  }
  return payload;
}

function visibleText(entry) {
  if (!entry || entry.kind !== "send-message") return null;
  const message = entry.message;
  if (!message || message.type !== "text" || typeof message.text !== "string") return null;
  return message.text;
}

async function resolveAgent(args) {
  if (typeof args.agent_id === "string" && args.agent_id.trim()) {
    const agents = await gatewayCall("listAgents");
    const found = agents.find((agent) => agent.id === args.agent_id.trim());
    if (!found) throw new Error(`No Bot found with id ${args.agent_id}.`);
    return found;
  }
  const name = typeof args.agent_name === "string" ? args.agent_name.trim() : "";
  if (!name) throw new Error("Provide agent_id or agent_name.");
  const agents = await gatewayCall("searchAgents", { query: name, limit: 20 });
  const exact = agents.filter((agent) => String(agent.name || "").toLowerCase() === name.toLowerCase());
  const candidates = exact.length ? exact : agents;
  if (candidates.length === 0) throw new Error(`No Bot matched "${name}".`);
  if (candidates.length > 1) {
    const choices = candidates.slice(0, 8).map((agent) => `${agent.name} (${agent.id})`).join(", ");
    throw new Error(`Multiple Bots matched "${name}": ${choices}. Use agent_id.`);
  }
  return candidates[0];
}

async function listBots(args) {
  const query = typeof args.query === "string" ? args.query.trim() : "";
  const rows = query
    ? await gatewayCall("searchAgents", { query, limit: 50 })
    : await gatewayCall("listAgents");
  return rows.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description || "",
    title: agent.title || "",
  }));
}

async function readTranscript(args) {
  const agent = await resolveAgent(args);
  const limit = Number.isInteger(args.limit) ? Math.min(Math.max(args.limit, 1), 100) : 20;
  const transcript = await gatewayCall("getAgentTranscript", { id: agent.id });
  const tail = transcript.slice(-limit);
  return {
    agent: { id: agent.id, name: agent.name },
    entries: tail.map((entry) => ({
      kind: entry.kind,
      id: entry.id || null,
      timestampMs: entry.timestampMs || entry.createdAtMs || null,
      text: visibleText(entry),
      raw: visibleText(entry) == null ? entry : undefined,
    })),
  };
}

async function chatCoordinator(args) {
  const message = typeof args.message === "string" ? args.message.trim() : "";
  if (!message) throw new Error("message must be a non-empty string.");
  const agent = await resolveAgent(args);
  const timeoutMs = Number.isInteger(args.timeout_ms)
    ? Math.min(Math.max(args.timeout_ms, 1000), 300000)
    : 120000;
  const pollMs = Number.isInteger(args.poll_interval_ms)
    ? Math.min(Math.max(args.poll_interval_ms, 100), 5000)
    : 750;

  const before = await gatewayCall("getAgentTranscript", { id: agent.id });
  const baselineLength = before.length;
  const clientNonce = randomUUID();
  const acceptance = await gatewayCall(
    "sendPrompt",
    {
      prompt: message,
      agentId: agent.id,
      clientNonce,
    },
    Math.min(timeoutMs, 30000),
  );

  const deadline = Date.now() + timeoutMs;
  let newest = null;
  while (Date.now() < deadline) {
    const transcript = await gatewayCall("getAgentTranscript", { id: agent.id });
    const newEntries = transcript.slice(Math.min(baselineLength, transcript.length));
    const visible = newEntries.map(visibleText).filter(Boolean);
    if (visible.length > 0) {
      newest = visible[visible.length - 1];
      return {
        agent: { id: agent.id, name: agent.name },
        acceptance,
        reply: newest,
        timed_out: false,
      };
    }
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }
  return {
    agent: { id: agent.id, name: agent.name },
    acceptance,
    reply: newest,
    timed_out: true,
    note: "The prompt was accepted but no visible coordinator reply arrived before timeout. Use brokpot_read_transcript to continue polling.",
  };
}

const TOOLS = [
  {
    name: "brokpot_list_bots",
    description:
      "List Bots on the configured Brokpot Host, or search them by name/description. Use this to identify the coordinator Bot id before chatting.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_chat_coordinator",
    description:
      "Send a user message to one Bot/coordinator through the authenticated Brokpot Gateway and wait for the next visible text reply. The coordinator can then use its own native tools to create Bots, delegate work, or operate the Host.",
    inputSchema: {
      type: "object",
      properties: {
        agent_id: { type: "string" },
        agent_name: { type: "string" },
        message: { type: "string" },
        timeout_ms: { type: "integer", minimum: 1000, maximum: 300000 },
        poll_interval_ms: { type: "integer", minimum: 100, maximum: 5000 },
      },
      required: ["message"],
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_read_transcript",
    description:
      "Read the most recent transcript entries for one Bot/coordinator. Useful after a long delegated task where the first chat call timed out or returned only an acknowledgment.",
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

async function callTool(name, args) {
  if (name === "brokpot_list_bots") return textResult(await listBots(args || {}));
  if (name === "brokpot_chat_coordinator") return textResult(await chatCoordinator(args || {}));
  if (name === "brokpot_read_transcript") return textResult(await readTranscript(args || {}));
  return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
}

async function dispatch(request) {
  const { id, method, params } = request || {};
  if (method === "notifications/initialized" || method === "notifications/cancelled") return null;
  if (method === "initialize") {
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
  if (method === "ping") return { jsonrpc: "2.0", id, result: {} };
  if (method === "tools/list")
    return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  if (method === "tools/call") {
    try {
      const result = await callTool(params?.name, params?.arguments || {});
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
    void dispatch(request)
      .then((response) => {
        if (response) process.stdout.write(JSON.stringify(response) + "\n");
      })
      .catch((error) => {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: "2.0",
            id: request.id ?? null,
            error: { code: -32603, message: error instanceof Error ? error.message : String(error) },
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

function runHttp() {
  const host = process.env.BROKPOT_MCP_HTTP_HOST || "127.0.0.1";
  const port = envInt("BROKPOT_MCP_HTTP_PORT", DEFAULT_HTTP_PORT, 1, 65535);
  const serverToken = process.env.BROKPOT_MCP_SERVER_TOKEN;
  if (!serverToken) throw new Error("BROKPOT_MCP_SERVER_TOKEN is required in --http mode.");
  const server = http.createServer((req, res) => {
    void (async () => {
      if (req.url !== "/mcp") {
        res.writeHead(404).end();
        return;
      }
      const auth = req.headers.authorization || "";
      if (!auth.startsWith("Bearer ") || !sameToken(auth.slice(7), serverToken)) {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "unauthorized" }));
        return;
      }
      if (req.method === "GET") {
        res.writeHead(405, { allow: "POST" }).end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(405, { allow: "POST" }).end();
        return;
      }
      const request = await readJson(req);
      const response = await dispatch(request);
      if (response == null) {
        res.writeHead(202).end();
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    })().catch((error) => {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
    });
  });
  server.listen(port, host, () => {
    process.stderr.write(`Brokpot coordinator MCP listening on http://${host}:${port}/mcp\n`);
  });
}

if (process.argv.includes("--http")) runHttp();
else runStdio();
