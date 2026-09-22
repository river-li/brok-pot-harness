/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/auth/identity-socket-server.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises45 = require("node:fs/promises");
var import_node_http4 = __toESM(require("node:http"), 1);
var import_node_net4 = __toESM(require("node:net"), 1);
var import_node_path93 = require("node:path");
init_dist2();
init_scheduling();
init_errors();
init_system_errno();
var MAX_BODY_BYTES2 = 4096;
var MAX_AUD_LEN = 512;
var MAX_NONCE_LEN = 512;
var MAX_SUB_CLAIM_LEN = 64;
var NONCE_PRINTABLE_ASCII = /^[\x21-\x7e]+$/;
var RATE_LIMIT_BURST = 10;
var RATE_LIMIT_REFILL_PER_SEC = 0.5;
var SELF_IMPOSED_RETRY_AFTER_SECONDS = 1;
var HEADER_READ_TIMEOUT_MS = 2e3;
var CONNECTION_SERVE_TIMEOUT_MS = 3e4;
var PER_BOX_CONNECTION_LIMIT = 8;
var BOX_MINT_CONCURRENCY = 8;
var SATURATED_RESPONSE_TIMEOUT_MS = 2e3;
var SATURATED_RESPONSE = 'HTTP/1.1 503 Service Unavailable\r\ncontent-type: application/json\r\nretry-after: 1\r\nconnection: close\r\ncontent-length: 21\r\n\r\n{"error":"saturated"}';
var headerReadDeadline = createDeadlinePolicy({
  name: "grok-bot-box-identity-socket-header-read",
  timeoutMs: HEADER_READ_TIMEOUT_MS
});
var connectionServeDeadline = createDeadlinePolicy({
  name: "grok-bot-box-identity-socket-connection-serve",
  timeoutMs: CONNECTION_SERVE_TIMEOUT_MS
});
var saturatedWriteDeadline = createDeadlinePolicy({
  name: "grok-bot-box-identity-socket-saturated-write",
  timeoutMs: SATURATED_RESPONSE_TIMEOUT_MS
});
var GUEST_OIDC_API_USAGE = `POST /v1/tokens/oidc on the Unix socket at $CURSOR_AGENT_SOCKET with Content-Type: application/json. JSON body (max 4096 bytes): aud (required string) \u2014 relying-party audience written to the token's aud claim (e.g. sts.amazonaws.com); non-empty printable ASCII, max 512 bytes; nonce (optional string) \u2014 echoed into the token's nonce claim for replay protection; omit, null, or empty for none; printable ASCII (no spaces or control characters), max 512 bytes; sub_claim (optional string) \u2014 published identity claim name to project into sub as "<name>:<value>" for verifiers that only match on sub/aud; supported names are listed as x_cursor_sub_claims_supported in the OIDC discovery document; omit, null, or empty for the default subject; max 64 UTF-16 code units. Do not send agent_id, tenantId, or podId \u2014 the box attests identity. Success: {"token":"<jwt>","expires_at":<unix_seconds>}.`;
var TokenBucket = class {
  tokens;
  lastRefillMs;
  constructor() {
    this.tokens = RATE_LIMIT_BURST;
    this.lastRefillMs = performance.now();
  }
  tryConsume() {
    const now = performance.now();
    const elapsedSec = (now - this.lastRefillMs) / 1e3;
    if (elapsedSec > 0) {
      this.tokens = Math.min(
        RATE_LIMIT_BURST,
        this.tokens + elapsedSec * RATE_LIMIT_REFILL_PER_SEC
      );
      this.lastRefillMs = now;
    }
    if (this.tokens < 1) {
      return false;
    }
    this.tokens -= 1;
    return true;
  }
};
function sendJson(args) {
  const payload = JSON.stringify(args.body);
  const headers = {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
    connection: "close"
  };
  if (args.retryAfterSeconds !== void 0) {
    headers["retry-after"] = String(args.retryAfterSeconds);
  }
  args.res.writeHead(args.status, headers);
  args.res.end(payload);
}
function sendInvalid(args) {
  sendJson({
    res: args.res,
    status: args.status,
    body: { error: args.code, usage: GUEST_OIDC_API_USAGE },
    retryAfterSeconds: args.retryAfterSeconds
  });
}
async function unlinkIfPresent(socketPath) {
  try {
    await (0, import_promises45.unlink)(socketPath);
  } catch (error42) {
    if (findSystemErrno(error42) !== "ENOENT") throw error42;
  }
}
function waitForSocketClose(socket) {
  return new Promise((resolve29) => {
    if (socket.destroyed) {
      resolve29();
      return;
    }
    socket.once("close", () => resolve29());
  });
}
function destroyOnDeadline(error42, socket) {
  if (error42 instanceof DeadlineExceededError) {
    socket.destroy();
  }
}
function sendError(args) {
  sendJson({
    res: args.res,
    status: args.status,
    body: { error: args.code },
    retryAfterSeconds: args.retryAfterSeconds
  });
}
function parseGuestBody(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw.toString("utf8"));
  } catch {
    return { ok: false, status: 400, code: "invalid_json" };
  }
  if (parsed2 === null || typeof parsed2 !== "object" || Array.isArray(parsed2)) {
    return { ok: false, status: 400, code: "invalid_json" };
  }
  if (!("aud" in parsed2) || typeof parsed2.aud !== "string") {
    return { ok: false, status: 400, code: "invalid_json" };
  }
  const audience = parsed2.aud.trim();
  if (audience.length === 0 || audience.length > MAX_AUD_LEN) {
    return { ok: false, status: 400, code: "invalid_aud" };
  }
  if (!NONCE_PRINTABLE_ASCII.test(audience)) {
    return { ok: false, status: 400, code: "invalid_aud" };
  }
  let nonce;
  if ("nonce" in parsed2 && parsed2.nonce !== void 0 && parsed2.nonce !== null) {
    if (typeof parsed2.nonce !== "string") {
      return { ok: false, status: 400, code: "invalid_json" };
    }
    if (parsed2.nonce.length > 0) {
      if (parsed2.nonce.length > MAX_NONCE_LEN || !NONCE_PRINTABLE_ASCII.test(parsed2.nonce)) {
        return { ok: false, status: 400, code: "invalid_nonce" };
      }
      nonce = parsed2.nonce;
    }
  }
  let subClaim;
  if ("sub_claim" in parsed2 && parsed2.sub_claim !== void 0 && parsed2.sub_claim !== null) {
    if (typeof parsed2.sub_claim !== "string") {
      return { ok: false, status: 400, code: "invalid_json" };
    }
    if (parsed2.sub_claim.length > MAX_SUB_CLAIM_LEN) {
      return { ok: false, status: 400, code: "invalid_sub_claim" };
    }
    const trimmed = parsed2.sub_claim.trim();
    subClaim = trimmed.length > 0 ? trimmed : void 0;
  }
  return {
    ok: true,
    request: {
      audience,
      ...nonce !== void 0 ? { nonce } : {},
      ...subClaim !== void 0 ? { subClaim } : {}
    }
  };
}
function readBoundedBody(req) {
  return new Promise((resolve29, reject2) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.byteLength;
      if (total > MAX_BODY_BYTES2) {
        resolve29("too_large");
        req.removeAllListeners("data");
        req.removeAllListeners("end");
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve29(Buffer.concat(chunks)));
    req.on("error", reject2);
  });
}
function mapBackendStatusToGuestStatus(status) {
  switch (status) {
    case 400:
    case 401:
    case 403:
    case 404:
    case 429:
    case 503:
      return status;
    case 408:
    case 504:
      return 504;
    default:
      return 502;
  }
}
function mapMintResult(res, minted) {
  switch (minted.kind) {
    case "minted":
      sendJson({
        res,
        status: 200,
        body: { token: minted.token, expires_at: minted.expiresAtUnixSeconds }
      });
      return;
    case "backend_status": {
      const guestStatus = mapBackendStatusToGuestStatus(minted.status);
      const send = guestStatus === 400 ? sendInvalid : sendError;
      send({
        res,
        status: guestStatus,
        code: "backend_error",
        retryAfterSeconds: minted.retryAfterSeconds
      });
      return;
    }
    case "transport":
      sendError({
        res,
        status: minted.timedOut ? 504 : 502,
        code: "backend_unreachable"
      });
      return;
    case "malformed_response":
      sendError({ res, status: 502, code: "backend_unreachable" });
      return;
    case "host_error":
      sendError({ res, status: 500, code: "host_error" });
  }
}
async function startGrokBotBoxIdentitySocketServer(options2) {
  const socketPath = options2.socketPath ?? GROK_BOT_BOX_IDENTITY_SOCKET_PATH;
  await (0, import_promises45.mkdir)((0, import_node_path93.dirname)(socketPath), { recursive: true, mode: 448 });
  await unlinkIfPresent(socketPath);
  const rateLimiter = new TokenBucket();
  let inFlightMints = 0;
  const tryAcquireMintPermit = () => {
    if (inFlightMints >= BOX_MINT_CONCURRENCY) {
      return void 0;
    }
    inFlightMints += 1;
    let released = false;
    return () => {
      if (released) {
        return;
      }
      released = true;
      inFlightMints -= 1;
    };
  };
  const headerReadCancels = /* @__PURE__ */ new WeakMap();
  const httpServer = import_node_http4.default.createServer({ keepAliveTimeout: 0 }, (req, res) => {
    headerReadCancels.get(req.socket)?.abort();
    void (async () => {
      if (req.method !== "POST") {
        sendInvalid({ res, status: 405, code: "method_not_allowed" });
        return;
      }
      const requestPath2 = (req.url ?? "").split("?")[0];
      if (requestPath2 !== CURSOR_AGENT_OIDC_TOKEN_PATH) {
        sendInvalid({ res, status: 404, code: "not_found" });
        return;
      }
      const contentType = req.headers["content-type"];
      if (contentType === void 0 || !contentType.startsWith("application/json")) {
        sendInvalid({ res, status: 415, code: "invalid_content_type" });
        return;
      }
      const body = await readBoundedBody(req);
      if (body === "too_large") {
        sendInvalid({ res, status: 413, code: "body_too_large" });
        return;
      }
      const parsed2 = parseGuestBody(body);
      if (!parsed2.ok) {
        sendInvalid({ res, status: parsed2.status, code: parsed2.code });
        return;
      }
      if (!rateLimiter.tryConsume()) {
        sendError({
          res,
          status: 429,
          code: "rate_limited",
          retryAfterSeconds: SELF_IMPOSED_RETRY_AFTER_SECONDS
        });
        return;
      }
      const releaseMintPermit = tryAcquireMintPermit();
      if (releaseMintPermit === void 0) {
        sendError({
          res,
          status: 503,
          code: "saturated",
          retryAfterSeconds: SELF_IMPOSED_RETRY_AFTER_SECONDS
        });
        return;
      }
      try {
        mapMintResult(res, await options2.mint(parsed2.request));
      } finally {
        releaseMintPermit();
      }
    })().catch((error42) => {
      options2.log(`identity socket request failed: ${errorLogTag(error42)}`);
      if (!res.headersSent) {
        sendError({ res, status: 500, code: "host_error" });
      } else {
        res.destroy();
      }
    });
  });
  const liveSockets = /* @__PURE__ */ new Set();
  const rejectedSockets = /* @__PURE__ */ new Set();
  const acceptor = import_node_net4.default.createServer((socket) => {
    if (liveSockets.size >= PER_BOX_CONNECTION_LIMIT) {
      rejectedSockets.add(socket);
      socket.once("close", () => {
        rejectedSockets.delete(socket);
      });
      void saturatedWriteDeadline.run(() => waitForSocketClose(socket)).catch((error42) => destroyOnDeadline(error42, socket));
      socket.end(SATURATED_RESPONSE);
      return;
    }
    liveSockets.add(socket);
    socket.once("close", () => {
      liveSockets.delete(socket);
    });
    void connectionServeDeadline.run(() => waitForSocketClose(socket)).catch((error42) => destroyOnDeadline(error42, socket));
    const headerReadCancel = new AbortController();
    headerReadCancels.set(socket, headerReadCancel);
    void headerReadDeadline.run(() => waitForSocketClose(socket), headerReadCancel.signal).catch((error42) => destroyOnDeadline(error42, socket));
    httpServer.emit("connection", socket);
  });
  const closeListener = async () => {
    for (const socket of [...liveSockets, ...rejectedSockets]) {
      socket.destroy();
    }
    httpServer.close();
    await new Promise((resolve29) => acceptor.close(() => resolve29()));
  };
  await new Promise((resolve29, reject2) => {
    acceptor.once("error", reject2);
    acceptor.listen(socketPath, () => {
      acceptor.off("error", reject2);
      resolve29();
    });
  });
  try {
    await (0, import_promises45.chmod)(socketPath, 384);
  } catch (error42) {
    await closeListener();
    await unlinkIfPresent(socketPath);
    throw error42;
  }
  for (const server of [acceptor, httpServer]) {
    server.on("error", (error42) => {
      options2.log(`identity socket listener error: ${errorLogTag(error42)}`);
    });
  }
  return {
    socketPath,
    stop: async () => {
      await closeListener();
      await unlinkIfPresent(socketPath);
    }
  };
}

