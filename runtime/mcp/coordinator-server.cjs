#!/usr/bin/env node
"use strict";

const http = require("node:http");
const readline = require("node:readline");
const { randomUUID, timingSafeEqual } = require("node:crypto");

const MCP_PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "brokpot-gateway", version: "0.3.0" };
const DEFAULT_GATEWAY_URL = "http://127.0.0.1:1540";
const DEFAULT_HTTP_PORT = 1541;
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_WAIT_MS = 30000;
const HOST_ACCOUNT_SLOT = "host";

class McpDeadlineExceededError extends Error {
  constructor() {
    super("The MCP wait deadline expired before the Gateway operation completed.");
    this.name = "McpDeadlineExceededError";
  }
}

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

function remainingBudget(deadlineMs, fallbackMs = 30000) {
  if (deadlineMs == null) return fallbackMs;
  const remaining = deadlineMs - Date.now();
  if (remaining <= 0) throw new McpDeadlineExceededError();
  return Math.max(1, Math.min(fallbackMs, remaining));
}

async function gatewayCall(method, args = {}, options = {}) {
  const authToken = options.token || process.env.SAND_HOST_GATEWAY_TOKEN;
  if (!authToken) throw new Error("A Brokpot Gateway token is required.");
  const timeoutMs = remainingBudget(options.deadlineMs, options.timeoutMs || 30000);
  let response;
  let text;
  try {
    response = await fetch(new URL(`/api/${method}`, gatewayBase()), {
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
    text = await response.text();
  } catch (error) {
    if (options.deadlineMs != null && (Date.now() >= options.deadlineMs || error?.name === "TimeoutError" || error?.name === "AbortError")) {
      throw new McpDeadlineExceededError();
    }
    throw error;
  }

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
  await gatewayCall(
    "getHostStatus",
    { includeManagedCapabilities: false },
    { token, timeoutMs: 5000 },
  );
}

function userVisibleUpdate(entry) {
  if (!entry) return null;

  if (entry.kind === "send-message") {
    const message = entry.message;
    if (!message || typeof message.type !== "string") return null;
    const base = {
      id: entry.id || null,
      kind: "message",
      message_type: message.type,
      timestamp_ms: entry.timestampMs || entry.createdAtMs || null,
      channel: message.channel || null,
    };

    if (message.type === "text") {
      const text =
        typeof message.content === "string"
          ? message.content
          : typeof message.text === "string"
            ? message.text
            : "";
      return { ...base, text, requires_user_action: false };
    }

    if (message.type === "attachment") {
      return {
        ...base,
        attachment: {
          url: typeof message.url === "string" ? message.url : null,
          file_name: typeof message.file_name === "string" ? message.file_name : null,
          alt: typeof message.alt === "string" ? message.alt : null,
        },
        requires_user_action: false,
      };
    }

    if (message.type === "widget") {
      return {
        ...base,
        prompt: typeof message.widget?.prompt === "string" ? message.widget.prompt : "Bot requested input.",
        options: Array.isArray(message.widget?.options)
          ? message.widget.options.map((option) => ({
              label: option?.label ?? null,
              value: option?.value ?? null,
              description: option?.description ?? null,
            }))
          : [],
        responded_value: entry.respondedValue ?? null,
        dismissed: entry.widgetDismissed === true,
        requires_user_action: entry.respondedValue == null && entry.widgetDismissed !== true,
        action_surface: "existing-brokpot-ui",
      };
    }

    if (message.type === "auto-review-approval") {
      const approval = message.approval || {};
      const status = approval.status || null;
      return {
        ...base,
        summary: approval.summary || "Auto-review requested approval.",
        request_id: approval.requestId || null,
        status,
        requires_user_action: status === "pending",
        action_surface: "existing-brokpot-ui",
      };
    }

    if (message.type === "local-tool-permission") {
      const ask = message.ask || {};
      const status = ask.status || null;
      return {
        ...base,
        summary:
          ask.action || ask.target
            ? `Permission requested for ${ask.action || "local action"}${ask.target ? `: ${ask.target}` : ""}.`
            : "Bot requested permission to use a local computer capability.",
        request_id: ask.requestId || null,
        status,
        requires_user_action: status === "pending",
        action_surface: "existing-brokpot-ui",
      };
    }

    if (message.type === "secret-request" || message.type === "credential-request") {
      return {
        ...base,
        summary: "Bot requested a credential through the existing secure Brokpot UI.",
        requires_user_action: true,
        action_surface: "existing-brokpot-ui",
      };
    }

    if (message.type === "cursor-agent") {
      return {
        ...base,
        cloud_agent_id: message.bcId || null,
        requires_user_action: false,
      };
    }

    return {
      ...base,
      summary: `Bot emitted a ${message.type} message/card.`,
      requires_user_action: false,
    };
  }

  if (entry.kind === "notice" || entry.kind === "error" || entry.kind === "event") {
    return {
      id: entry.id || null,
      kind: entry.kind,
      timestamp_ms: entry.timestampMs || entry.createdAtMs || null,
      entry,
      requires_user_action: false,
    };
  }

  return null;
}

function encodeCursorAt(agentId, transcript, index) {
  const bounded = Math.max(0, Math.min(index, transcript.length));
  const anchor = bounded > 0 ? transcript[bounded - 1] : null;
  const payload = {
    v: 1,
    agent_id: agentId,
    index: bounded,
    anchor_id: typeof anchor?.id === "string" ? anchor.id : null,
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

function cursorStart(transcript, decoded) {
  if (decoded == null) return { start: Math.max(0, transcript.length - 20), rebased: false };
  if (decoded.anchor_id != null) {
    const anchor = transcript.findIndex((entry) => entry?.id === decoded.anchor_id);
    if (anchor >= 0) return { start: anchor + 1, rebased: false };
    return { start: 0, rebased: true };
  }
  if (decoded.index === 0) return { start: 0, rebased: false };
  return { start: 0, rebased: true };
}

function matchingRosterAgents(agents, name) {
  const normalized = name.trim().toLowerCase();
  return agents.filter(
    (agent) => typeof agent?.name === "string" && agent.name.trim().toLowerCase() === normalized,
  );
}

async function resolveAgent(args, token, deadlineMs) {
  const agents = await gatewayCall("listAgents", {}, { token, deadlineMs });
  if (typeof args.agent_id === "string" && args.agent_id.trim()) {
    const found = agents.find((agent) => agent.id === args.agent_id.trim());
    if (!found) throw new Error(`No Bot found with id ${args.agent_id}.`);
    return found;
  }

  const name = typeof args.agent_name === "string" ? args.agent_name.trim() : "";
  if (!name) throw new Error("Provide agent_id or agent_name.");

  const matches = matchingRosterAgents(agents, name);
  if (matches.length === 0) throw new Error(`No Bot named "${name}" exists in the Host roster.`);
  if (matches.length > 1) {
    const choices = matches
      .slice(0, 8)
      .map((agent) => `${agent.name} (${agent.id})`)
      .join(", ");
    throw new Error(`Multiple Bots are named "${name}": ${choices}. Use agent_id.`);
  }
  return matches[0];
}

async function listAgents(args, token) {
  const rows = await gatewayCall("listAgents", {}, { token });
  const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
  const filtered = !query
    ? rows
    : rows.filter((agent) =>
        [agent?.id, agent?.name, agent?.title, agent?.description]
          .some((value) => typeof value === "string" && value.toLowerCase().includes(query)),
      );
  return filtered.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description || "",
    title: agent.title || "",
    run_state: agent.runState || agent.run_state || null,
    is_group: agent.isGroup === true || agent.is_group === true,
  }));
}

async function acceptanceRecord(agentId, clientNonce, token, deadlineMs) {
  const status = await gatewayCall(
    "promptAcceptanceStatus",
    {
      accountSlot: HOST_ACCOUNT_SLOT,
      clientNonce,
      agentId,
    },
    { token, deadlineMs },
  );
  return status?.outcome === "found" && status.record && typeof status.record === "object"
    ? status.record
    : null;
}

function boundaryIndexForAcceptedMessage(transcript, record, clientNonce) {
  const echoEntryId = typeof record?.echoEntryId === "string" ? record.echoEntryId : null;
  if (echoEntryId != null) {
    const index = transcript.findIndex((entry) => entry?.id === echoEntryId);
    if (index >= 0) return index + 1;
  }
  const nonceIndex = transcript.findIndex(
    (entry) =>
      (entry?.kind === "message" || entry?.kind === "user-attachment") &&
      entry?.clientNonce === clientNonce,
  );
  return nonceIndex >= 0 ? nonceIndex + 1 : null;
}

async function sendMessage(args, token) {
  const message = typeof args.message === "string" ? args.message.trim() : "";
  if (!message) throw new Error("message must be a non-empty string.");

  const agent = await resolveAgent(args, token);
  const clientNonce =
    typeof args.message_id === "string" && args.message_id.trim()
      ? args.message_id.trim()
      : randomUUID();

  const beforeStatus = await acceptanceRecord(agent.id, clientNonce, token);
  const before = await gatewayCall("getAgentTranscript", { id: agent.id }, { token });
  const fallbackBoundary = encodeCursorAt(agent.id, before, before.length);

  const acceptance = await gatewayCall(
    "sendPrompt",
    { prompt: message, agentId: agent.id, clientNonce },
    { token },
  );

  const [record, after] = await Promise.all([
    acceptanceRecord(agent.id, clientNonce, token),
    gatewayCall("getAgentTranscript", { id: agent.id }, { token }),
  ]);
  const boundaryIndex = boundaryIndexForAcceptedMessage(after, record, clientNonce);

  if (boundaryIndex == null && beforeStatus != null) {
    throw new Error(
      "The message_id was already accepted, but its original transcript boundary could not be recovered safely. Read the transcript directly instead of advancing a new updates cursor.",
    );
  }

  return {
    agent: { id: agent.id, name: agent.name },
    message_id: clientNonce,
    accepted: acceptance?.accepted !== false,
    acceptance,
    acceptance_record: record,
    updates_cursor:
      boundaryIndex == null
        ? fallbackBoundary
        : encodeCursorAt(agent.id, after, boundaryIndex),
  };
}

async function getUpdates(args, token, deadlineMs) {
  const decoded = decodeCursor(args.cursor);
  const agent = decoded != null
    ? await resolveAgent({ agent_id: decoded.agent_id }, token, deadlineMs)
    : await resolveAgent(args, token, deadlineMs);

  if (
    decoded != null &&
    typeof args.agent_id === "string" &&
    args.agent_id.trim() &&
    args.agent_id.trim() !== decoded.agent_id
  ) throw new Error("cursor belongs to a different Bot.");

  const transcript = await gatewayCall(
    "getAgentTranscript",
    { id: agent.id },
    { token, deadlineMs },
  );
  const { start, rebased } = cursorStart(transcript, decoded);
  const limit = Number.isInteger(args.limit) ? Math.min(Math.max(args.limit, 1), 100) : 50;

  const updates = [];
  let consumedThrough = start;
  let scanned = 0;
  for (let index = start; index < transcript.length; index += 1) {
    const update = userVisibleUpdate(transcript[index]);
    scanned += 1;
    if (update != null) updates.push(update);
    consumedThrough = index + 1;
    if (updates.length >= limit) break;
  }

  return {
    agent: { id: agent.id, name: agent.name },
    updates,
    cursor: encodeCursorAt(agent.id, transcript, consumedThrough),
    cursor_rebased: rebased,
    transcript_entries_seen: scanned,
    has_more: consumedThrough < transcript.length,
  };
}

async function waitForUpdates(args, token) {
  const timeoutMs = Number.isInteger(args.timeout_ms)
    ? Math.min(Math.max(args.timeout_ms, 250), MAX_WAIT_MS)
    : 20000;
  const pollMs = Number.isInteger(args.poll_interval_ms)
    ? Math.min(Math.max(args.poll_interval_ms, 100), 5000)
    : 750;
  const deadlineMs = Date.now() + timeoutMs;
  let cursor = args.cursor;
  let latest = null;

  while (Date.now() < deadlineMs) {
    try {
      latest = await getUpdates({ ...args, cursor }, token, deadlineMs);
    } catch (error) {
      if (error instanceof McpDeadlineExceededError) {
        return {
          ...(latest || {
            agent: null,
            updates: [],
            cursor: cursor || null,
            cursor_rebased: false,
            transcript_entries_seen: 0,
            has_more: false,
          }),
          timed_out: true,
        };
      }
      throw error;
    }

    cursor = latest.cursor;
    if (latest.updates.length > 0) return { ...latest, timed_out: false };
    const remaining = deadlineMs - Date.now();
    if (remaining <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(pollMs, remaining)));
  }

  return {
    ...(latest || {
      agent: null,
      updates: [],
      cursor: cursor || null,
      cursor_rebased: false,
      transcript_entries_seen: 0,
      has_more: false,
    }),
    timed_out: true,
  };
}

async function readTranscript(args, token) {
  const agent = await resolveAgent(args, token);
  const limit = Number.isInteger(args.limit) ? Math.min(Math.max(args.limit, 1), 100) : 20;
  const transcript = await gatewayCall("getAgentTranscript", { id: agent.id }, { token });
  return {
    agent: { id: agent.id, name: agent.name },
    cursor: encodeCursorAt(agent.id, transcript, transcript.length),
    entries: transcript.slice(-limit),
  };
}

async function getAgentStatus(args, token) {
  const agent = await resolveAgent(args, token);
  const [subagents, asyncTasks, outline, host] = await Promise.all([
    gatewayCall("getSubagents", { id: agent.id }, { token }),
    gatewayCall("getAsyncTasks", { id: agent.id }, { token }),
    gatewayCall("getConversationOutline", { id: agent.id }, { token }),
    gatewayCall("getHostStatus", { includeManagedCapabilities: false }, { token }),
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
      "List or filter Bots in the authenticated Brokpot Host roster. Use this to discover coordinators, project managers, groups, or other Bots and obtain stable agent ids.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "brokpot_send_message",
    description:
      "Reliably submit a message to one roster Bot and return after the existing sendPrompt RPC accepts it. This does not wait for the Bot or downstream agents to finish. Reusing message_id is idempotent and preserves the original update boundary. Pass updates_cursor to brokpot_get_updates or brokpot_wait_for_updates.",
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
      "Read new user-visible Bot messages, attachments, input cards, approvals, notices, and errors since an opaque transcript cursor. Pagination never advances beyond entries actually consumed.",
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
      "Long-poll for the next user-visible update without waiting for the whole task to finish. The shared deadline, including Gateway I/O, is bounded to 30 seconds. Use the returned cursor for the next call.",
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
      "Read recent raw transcript entries for one roster Bot for audit/debugging, including group/coordinator conversations when the caller intentionally wants to inspect them.",
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
    const tools = context.oauth ? TOOLS.map((tool) => {
      const securitySchemes = [{ type: "oauth2", scopes: [toolScope(tool.name)] }];
      return { ...tool, securitySchemes, _meta: { securitySchemes } };
    }) : TOOLS;
    return { jsonrpc: "2.0", id, result: { tools } };
  }
  if (method === "tools/call") {
    try {
      const result = await callTool(params?.name, params?.arguments || {}, context.gatewayToken);
      return { jsonrpc: "2.0", id, result };
    } catch (error) {
      if (context.oauth && error?.status === 401) {
        context.authorization.revoke();
        return { jsonrpc: "2.0", id, result: { isError: true,
          content: [{ type: "text", text: "Reconnect Brokpot: Gateway authorization is no longer valid." }],
          _meta: { "mcp/www_authenticate": [context.oauth.challenge()] } } };
      }
      return {
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: context.oauth && error?.status ? "Gateway request failed." : error instanceof Error ? error.message : String(error) }],
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
  if (Array.isArray(supplied)) supplied = supplied[0];
  const a = Buffer.from(typeof supplied === "string" ? supplied : "");
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
  const match = typeof auth === "string" && /^Bearer ([^\s]+)$/i.exec(auth);
  return match ? match[1] : "";
}

function toolScope(name) {
  return name === "brokpot_send_message" ? "brokpot:write" : "brokpot:read";
}

function createHttpServer({ oauth = null, secondFactor = process.env.BROKPOT_MCP_SERVER_TOKEN, publicOrigin } = {}) {
  const server = http.createServer((req, res) => {
    void (async () => {
      if (oauth && await oauth.handle(req, res)) return;
      if (req.url !== "/mcp") {
        res.writeHead(404).end();
        return;
      }
      if (oauth && req.headers.origin && req.headers.origin !== publicOrigin) {
        res.writeHead(403).end();
        return;
      }
      const token = bearerToken(req);
      const authorization = oauth ? oauth.authenticate(token) : null;
      const gatewayToken = oauth ? authorization?.gatewayToken : token;
      if (!gatewayToken) {
        res.writeHead(401, { "content-type": "application/json", "cache-control": "no-store", ...(oauth ? { "www-authenticate": oauth.challenge() } : {}) });
        res.end(JSON.stringify({ error: oauth ? "invalid_token" : "Brokpot Gateway bearer token required" }));
        return;
      }
      if (!oauth && secondFactor && !sameToken(req.headers["x-brokpot-mcp-token"], secondFactor)) {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "secondary MCP token required" }));
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(405, { allow: "POST" }).end();
        return;
      }
      const request = await readJson(req);
      if (oauth && request?.method === "tools/call" && !authorization.scopes.includes(toolScope(request.params?.name))) {
        const challenge = oauth.challenge("insufficient_scope", [toolScope(request.params?.name)]);
        res.writeHead(403, { "content-type": "application/json", "cache-control": "no-store", "www-authenticate": challenge });
        res.end(JSON.stringify({ jsonrpc: "2.0", id: request.id ?? null, result: { isError: true,
          content: [{ type: "text", text: "Additional Brokpot permission is required." }], _meta: { "mcp/www_authenticate": [challenge] } } }));
        return;
      }
      try {
        const response = await dispatch(request, { gatewayToken, oauth, authorization });
        if (response == null) {
          res.writeHead(202).end();
          return;
        }
        res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
        res.end(JSON.stringify(response));
      } catch (error) {
        const status = error?.status === 401 ? 401 : 500;
        if (oauth && status === 401) authorization.revoke();
        res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store", ...(oauth && status === 401 ? { "www-authenticate": oauth.challenge() } : {}) });
        res.end(JSON.stringify({ error: oauth ? (status === 401 ? "invalid_token" : "Gateway request failed") : error instanceof Error ? error.message : String(error) }));
      }
    })().catch((error) => {
      const status = error instanceof SyntaxError ? 400 : 500;
      res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify({ error: oauth ? "Invalid MCP request" : error instanceof Error ? error.message : String(error) }));
    });
  });
  server.once("close", () => oauth?.close());
  return server;
}

function runHttp() {
  const host = process.env.BROKPOT_MCP_HTTP_HOST || "127.0.0.1";
  const port = envInt("BROKPOT_MCP_HTTP_PORT", DEFAULT_HTTP_PORT, 1, 65535);
  const { oauthConfig, createOAuthServer } = require("./oauth-server.cjs");
  const config = oauthConfig();
  const oauth = config ? createOAuthServer(config, { verifyGatewayToken }) : null;
  const server = createHttpServer({ oauth, publicOrigin: config?.issuer });
  server.listen(port, host, () => {
    process.stderr.write(`Brokpot MCP listening on http://${host}:${port}/mcp\n`);
  });
}

if (require.main === module) {
  if (process.argv.includes("--http")) runHttp();
  else runStdio();
}

module.exports = { createHttpServer };
