var DOMAIN_REFUSALS = [
  BotTemplateImportAccessDeniedError,
  BotTemplateStoreNotFound,
  SandAgentStoreUnreadableError,
  SandAutomationRunNowRefusedError,
  SandFeedbackVoteTargetError,
  SandGenerateImageError,
  SandMcpConfigError,
  SandMcpOAuthCompletionRejectedError,
  SandSearchUnavailableError,
  SandSecretStoreFailedError,
  SandServerRoomSendError,
  SandSkillPublishError,
  ServerAgentProxyRefusedError
];
function statusForCommandError(error41) {
  if (error41 instanceof SandGatewayRequestError) {
    return 400;
  }
  if (error41 instanceof ServerAgentProxyUnavailableError) return 502;
  return DOMAIN_REFUSALS.some((refusal) => error41 instanceof refusal) ? 409 : 500;
}
var GATEWAY_FAILURE_CODES = /* @__PURE__ */ new Set([
  BOT_TEMPLATE_IMPORT_ACCESS_DENIED_CODE,
  SAND_AGENT_RENAME_REFUSED,
  CHROME_COOKIE_IMPORT_UNAVAILABLE,
  GATEWAY_UNKNOWN_METHOD_FAILURE_CODE,
  NONCE_DIGEST_MISMATCH,
  SAND_AUTOMATION_RUN_NOW_REFUSED,
  SAND_AUTO_REVIEW_STALE,
  SAND_BOT_TEMPLATE_NOT_FOUND,
  SAND_GENERATE_IMAGE_REFUSED,
  SAND_MCP_CONFIG_FAILURE_CODE,
  SAND_SECRET_SAVE_REFUSED,
  SAND_SKILL_PUBLISH_REFUSED
]);
function gatewayFailureCodeFor(error41) {
  if (error41 instanceof BotTemplateImportAccessDeniedError) {
    return BOT_TEMPLATE_IMPORT_ACCESS_DENIED_CODE;
  }
  if (error41 instanceof SandSkillPublishError) return SAND_SKILL_PUBLISH_REFUSED;
  if (error41 instanceof SandGenerateImageError) return SAND_GENERATE_IMAGE_REFUSED;
  if (error41 instanceof SandMcpConfigError) return SAND_MCP_CONFIG_FAILURE_CODE;
  if (error41 instanceof ServerAgentProxyRefusedError) return error41.failureCode ?? void 0;
  if (error41 == null || typeof error41 !== "object") return void 0;
  const { code, failureCode } = error41;
  const declared = typeof failureCode === "string" ? failureCode : code;
  return typeof declared === "string" && GATEWAY_FAILURE_CODES.has(declared) ? declared : void 0;
}
var GATEWAY_REQUEST_ID_HEADER = "x-sand-request-id";
var sseHeartbeatPolicy = createIdleWatchdogPolicy({
  name: "gateway.sse-heartbeat",
  idleMs: 15e3
});
var MAX_REQUEST_PAYLOAD_BYTES = 256 * 1024 * 1024;
var MAX_BODY_BYTES = maxLocalExecUploadFrameBytes(MAX_REQUEST_PAYLOAD_BYTES);
function parseArgs(body, parse11) {
  let parsed2;
  try {
    parsed2 = body.length > 0 ? JSON.parse(body) : {};
  } catch (error41) {
    throw new SandGatewayRequestError(`request body is not valid JSON: ${String(error41)}`, {
      cause: error41
    });
  }
  try {
    return parse11(parsed2);
  } catch (error41) {
    throw new SandGatewayRequestError(`request body has the wrong shape: ${errorMessage(error41)}`, {
      cause: error41
    });
  }
}
async function readBody(req) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new SandGatewayRequestError("Request body is too large.");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}
var GZIP_MIN_BYTES = 1400;
function clientAcceptsGzip(req) {
  const header = req.headers["accept-encoding"];
  const value = Array.isArray(header) ? header.join(",") : header;
  return typeof value === "string" && value.toLowerCase().includes("gzip");
}
function clientWantsSlimAvatars(req) {
  const header = req.headers[GATEWAY_SLIM_AVATARS_HEADER];
  const value = Array.isArray(header) ? header[0] : header;
  return value === "1";
}
var GATEWAY_NO_STORE_HEADER = { "cache-control": "no-store" };
function respondJson(res, value, req) {
  const raw = Buffer.from(JSON.stringify(value ?? null), "utf8");
  const respondRaw = () => {
    res.writeHead(200, {
      "content-type": "application/json",
      "content-length": raw.byteLength,
      ...GATEWAY_NO_STORE_HEADER,
      [GATEWAY_MINT_DEDUPE_HEADER]: "1"
    });
    res.end(raw);
  };
  if (req != null && raw.byteLength >= GZIP_MIN_BYTES && clientAcceptsGzip(req)) {
    (0, import_node_zlib2.gzip)(raw, (error41, gzipped) => {
      if (res.destroyed || res.writableEnded || res.headersSent) return;
      if (error41 != null) {
        respondRaw();
        return;
      }
      res.writeHead(200, {
        "content-type": "application/json",
        "content-encoding": "gzip",
        "content-length": gzipped.byteLength,
        vary: "Accept-Encoding",
        ...GATEWAY_NO_STORE_HEADER,
        [GATEWAY_MINT_DEDUPE_HEADER]: "1"
      });
      res.end(gzipped);
    });
    return;
  }
  respondRaw();
}
function respondErrorPayload(res, status, args) {
  const body = JSON.stringify({
    error: args.message,
    ...args.failureCode === void 0 ? {} : { failureCode: args.failureCode },
    ...args.skillPublishRefusalKind === void 0 ? {} : { skillPublishRefusalKind: args.skillPublishRefusalKind },
    ...args.mcpConfigFailure === void 0 ? {} : { mcpConfigFailure: args.mcpConfigFailure }
  });
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(body),
    ...GATEWAY_NO_STORE_HEADER
  });
  res.end(body);
}
function respondError(res, status, message) {
  respondErrorPayload(res, status, { message });
}
function isAuthorized(req, expectedToken) {
  const header = req.headers.authorization;
  if (typeof header !== "string") return false;
  const prefix = `${GATEWAY_AUTH_SCHEME} `;
  if (!header.startsWith(prefix)) return false;
  const provided = Buffer.from(header.slice(prefix.length));
  const expected = Buffer.from(expectedToken);
  return provided.length === expected.length && (0, import_node_crypto15.timingSafeEqual)(provided, expected);
}
function hostHeaderHostname(req) {
  const header = req.headers.host;
  if (typeof header !== "string" || header.length === 0) return null;
  try {
    return new URL(`http://${header}`).hostname;
  } catch {
    return null;
  }
}
var SECRET_VALUE_COMMANDS = /* @__PURE__ */ new Set(["syncUserSecrets"]);
function rejectUntrustedBrowserRequest(deps, req, res) {
  if (req.headers.origin !== void 0) {
    respondError(res, 403, "browser-origin gateway requests are not allowed");
    return true;
  }
  if (deps.authToken == null) {
    const hostname3 = hostHeaderHostname(req);
    if (hostname3 == null || !isLoopbackHost(hostname3)) {
      respondError(res, 403, "untrusted gateway host");
      return true;
    }
  }
  return false;
}
function requestId(req) {
  const header = req.headers[GATEWAY_REQUEST_ID_HEADER];
  const value = Array.isArray(header) ? header[0] : header;
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function commandTrace(req) {
  const header = req.headers[GATEWAY_TRACEPARENT_HEADER];
  const value = Array.isArray(header) ? header[0] : header;
  const parsed2 = parseTraceparent(value);
  if (parsed2 === void 0) return {};
  return { traceparent: value, traceId: parsed2.traceId, spanId: parsed2.spanId };
}
async function routeCommand(api, method, body, res, req, onCommandError, onCommandComplete) {
  if (!isSandGatewayMethod(method)) {
    return respondErrorPayload(res, 404, {
      message: `unknown gateway method: ${method}`,
      failureCode: GATEWAY_UNKNOWN_METHOD_FAILURE_CODE
    });
  }
  const avatars = clientWantsSlimAvatars(req) ? "slim" : "inline";
  const id = requestId(req);
  const { traceparent, ...traceIds } = commandTrace(req);
  const commandSpan = beginGatewayCommandTrace({ traceparent, method });
  const startedAt = Date.now();
  let result;
  try {
    try {
      result = await runGatewayCommand(api, method, body, avatars);
    } finally {
      commandSpan?.span.end();
    }
  } catch (error41) {
    if (onCommandError != null && statusForCommandError(error41) >= 500) {
      try {
        const { reason, errorClass, errno } = classifyGatewayCommandError(error41);
        onCommandError({
          method,
          reason,
          errorClass,
          errno,
          durationMs: Date.now() - startedAt,
          requestId: id,
          ...traceIds
        });
      } catch {
      }
    }
    throw error41;
  }
  if (onCommandComplete != null) {
    try {
      onCommandComplete({
        method,
        durationMs: Date.now() - startedAt,
        requestId: id,
        ...traceIds
      });
    } catch {
    }
  }
  return respondJson(res, result, req);
}
function openSseStream(deps, req, res, register) {
  const isGzipEnabled = !deps.sseGzipDisabled && clientAcceptsGzip(req);
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-store, no-transform",
    connection: "keep-alive",
    ...isGzipEnabled ? { "content-encoding": "gzip", vary: "Accept-Encoding" } : {}
  });
  const gzip4 = isGzipEnabled ? (0, import_node_zlib2.createGzip)({ flush: import_node_zlib2.constants.Z_SYNC_FLUSH }) : null;
  if (gzip4 != null) gzip4.pipe(res);
  const sink = gzip4 ?? res;
  sink.write("retry: 1000\n\n");
  const heartbeat = sseHeartbeatPolicy.arm(() => {
    sink.write(":ping\n\n");
    heartbeat.kick();
  });
  const unsubscribe = register((data) => {
    sink.write(`data: ${data}

`);
    heartbeat.kick();
  });
  res.on("close", () => {
    heartbeat.dispose();
    unsubscribe();
    gzip4?.destroy();
  });
}
function parseSubscribedChannels(url2) {
  const raw = url2.searchParams.get("channels");
  if (raw === null) return void 0;
  const channels = raw.split(",").flatMap((channel) => {
    const trimmed = channel.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  });
  return channels.length > 0 ? new Set(channels) : void 0;
}
function handleEvents(deps, req, res, subscribedChannels) {
  const isSlim = clientWantsSlimAvatars(req);
  res.on("close", () => deps.onEventStreamClosed?.());
  openSseStream(
    deps,
    req,
    res,
    (write) => deps.subscribe((event) => {
      if (subscribedChannels !== void 0 && !subscribedChannels.has(event.channel)) {
        return;
      }
      write(JSON.stringify(isSlim ? stripInlineAvatarsFromEvent(event) : event));
    })
  );
}
var DATA_URL_PATTERN = /^data:([a-z0-9.+/-]+);base64,(.*)$/i;
var AVATAR_NO_EXECUTE_HEADERS = {
  "content-disposition": "attachment",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; sandbox"
};
async function handleAvatarImage(deps, req, res, url2) {
  if (req.headers["sec-fetch-site"] === "cross-site") {
    return respondError(res, 403, "cross-site avatar loads are not allowed");
  }
  const agentId = decodeURIComponent(url2.pathname.slice(GATEWAY_AVATARS_PATH.length + 1));
  if (agentId.length === 0) {
    return respondError(res, 404, "missing agent id");
  }
  const avatar = await deps.api.getAgentAvatar({ id: agentId });
  const match2 = avatar.dataUrl == null ? null : DATA_URL_PATTERN.exec(avatar.dataUrl);
  if (avatar.version == null || match2?.[1] == null || match2[2] == null) {
    return respondError(res, 404, "agent has no avatar");
  }
  const requestedVersion = url2.searchParams.get("v");
  if (requestedVersion != null && requestedVersion !== avatar.version) {
    return respondError(res, 404, "no such avatar version");
  }
  const etag = `"${avatar.version}"`;
  const cacheHeaders = requestedVersion != null ? { "cache-control": "private, max-age=31536000, immutable", etag } : { "cache-control": "no-store", etag };
  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, cacheHeaders);
    res.end();
    return;
  }
  const bytes = Buffer.from(match2[2], "base64");
  res.writeHead(200, {
    ...cacheHeaders,
    ...AVATAR_NO_EXECUTE_HEADERS,
    "content-type": match2[1],
    "content-length": bytes.byteLength
  });
  res.end(bytes);
}
function handleLocalExecRequests(deps, req, res) {
  const bridge = deps.localExec;
  if (bridge == null) {
    return respondError(res, 404, "local-exec channel not enabled");
  }
  openSseStream(
    deps,
    req,
    res,
    (write) => bridge.registerProvider((frame) => write(JSON.stringify(frame)))
  );
}
function handleLocalExecResponses(deps, body, res) {
  const bridge = deps.localExec;
  if (bridge == null) {
    return respondError(res, 404, "local-exec channel not enabled");
  }
  const batch = parseArgs(body, parseSandLocalExecResponseBatch);
  bridge.submitResponses(batch);
  respondJson(res, { ok: true });
}
function handleWebAuthnRequests(deps, req, res) {
  const bridge = deps.webauthn;
  if (bridge == null) {
    return respondError(res, 404, "webauthn channel not enabled");
  }
  openSseStream(
    deps,
    req,
    res,
    (write) => bridge.registerProvider((frame) => write(JSON.stringify(frame)))
  );
}
function handleWebAuthnResponses(deps, body, res) {
  const bridge = deps.webauthn;
  if (bridge == null) {
    return respondError(res, 404, "webauthn channel not enabled");
  }
  const batch = parseArgs(body, parseSandWebAuthnResponseBatch);
  bridge.submitResponses(batch);
  respondJson(res, { ok: true });
}
function handleCookieOriginApprovalRequests(deps, req, res) {
  const bridge = deps.cookieOriginApproval;
  if (bridge == null) {
    return respondError(res, 404, "cookie-origin-approval channel not enabled");
  }
  openSseStream(
    deps,
    req,
    res,
    (write) => bridge.registerProvider((frame) => write(JSON.stringify(frame)))
  );
}
function handleCookieOriginApprovalResponses(deps, body, res) {
  const bridge = deps.cookieOriginApproval;
  if (bridge == null) {
    return respondError(res, 404, "cookie-origin-approval channel not enabled");
  }
  const batch = parseArgs(body, parseSandCookieOriginApprovalResponseBatch);
  bridge.submitResponses(batch);
  respondJson(res, { ok: true });
}
async function startGatewayServer(deps) {
  const host = deps.host ?? "127.0.0.1";
  const requestListener = (req, res) => {
    void handleRequest(deps, req, res).catch((error41) => {
      const message = errorMessage(error41);
      if (!res.headersSent) {
        const failureCode = gatewayFailureCodeFor(error41);
        respondErrorPayload(res, statusForCommandError(error41), {
          message,
          ...failureCode === void 0 ? {} : { failureCode },
          ...error41 instanceof SandSkillPublishError && error41.refusalKind !== void 0 ? { skillPublishRefusalKind: error41.refusalKind } : {},
          ...error41 instanceof SandMcpConfigError && error41.failure !== void 0 ? { mcpConfigFailure: error41.failure } : {}
        });
      } else res.end();
    });
  };
  const server = deps.tls != null ? (0, import_node_https3.createServer)({ cert: deps.tls.cert, key: deps.tls.key }, requestListener) : (0, import_node_http3.createServer)(requestListener);
  await new Promise((resolve29, reject2) => {
    server.once("error", reject2);
    server.listen(deps.port ?? 0, host, () => {
      server.off("error", reject2);
      resolve29();
    });
  });
  const address = server.address();
  return {
    port: address.port,
    close: () => new Promise((resolve29, reject2) => {
      server.closeAllConnections();
      server.close((error41) => error41 != null ? reject2(error41) : resolve29());
    })
  };
}
async function handleRequest(deps, req, res) {
  const url2 = new URL(req.url ?? "/", "http://127.0.0.1");
  if (rejectUntrustedBrowserRequest(deps, req, res)) return;
  if (req.method === "GET" && url2.pathname === GATEWAY_HEALTH_PATH) {
    const health = deps.getHealth();
    const payload = {
      ok: true,
      pid: process.pid,
      isBusy: health.isBusy,
      ...health.busyOnlyAwaitingApproval !== void 0 ? { busyOnlyAwaitingApproval: health.busyOnlyAwaitingApproval } : {},
      activeAgentId: health.activeAgentId,
      startedAt: deps.startedAt,
      lastBusyAtMs: health.lastBusyAtMs
    };
    return respondJson(res, payload);
  }
  const isEvents = req.method === "GET" && url2.pathname === GATEWAY_EVENTS_PATH;
  const isPrepareUpgrade = req.method === "POST" && url2.pathname === GATEWAY_PREPARE_UPGRADE_PATH;
  const isAvatar = req.method === "GET" && url2.pathname.startsWith(`${GATEWAY_AVATARS_PATH}/`);
  const isLocalExecRequests = req.method === "GET" && url2.pathname === GATEWAY_LOCAL_EXEC_REQUESTS_PATH;
  const isLocalExecResponses = req.method === "POST" && url2.pathname === GATEWAY_LOCAL_EXEC_RESPONSES_PATH;
  const isWebAuthnRequests = req.method === "GET" && url2.pathname === GATEWAY_WEBAUTHN_REQUESTS_PATH;
  const isWebAuthnResponses = req.method === "POST" && url2.pathname === GATEWAY_WEBAUTHN_RESPONSES_PATH;
  const isCookieOriginApprovalRequests = req.method === "GET" && url2.pathname === GATEWAY_COOKIE_ORIGIN_APPROVAL_REQUESTS_PATH;
  const isCookieOriginApprovalResponses = req.method === "POST" && url2.pathname === GATEWAY_COOKIE_ORIGIN_APPROVAL_RESPONSES_PATH;
  const isCommand = req.method === "POST" && url2.pathname.startsWith(`${GATEWAY_API_PREFIX}/`);
  if (isEvents || isAvatar || isCommand || isPrepareUpgrade || isLocalExecRequests || isLocalExecResponses || isWebAuthnRequests || isWebAuthnResponses || isCookieOriginApprovalRequests || isCookieOriginApprovalResponses) {
    if ((isLocalExecRequests || isLocalExecResponses) && deps.authToken == null) {
      return respondError(res, 401, "local-exec requires gateway authentication");
    }
    if ((isWebAuthnRequests || isWebAuthnResponses) && deps.authToken == null) {
      return respondError(res, 401, "webauthn requires gateway authentication");
    }
    if ((isCookieOriginApprovalRequests || isCookieOriginApprovalResponses) && deps.authToken == null) {
      return respondError(res, 401, "cookie-origin-approval requires gateway authentication");
    }
    if (deps.authToken != null && !isAuthorized(req, deps.authToken)) {
      return respondError(res, 401, "unauthorized");
    }
    if (isPrepareUpgrade) {
      const result = deps.prepareForUpgrade != null ? await deps.prepareForUpgrade() : { quiescing: false, runningTurns: 0 };
      return respondJson(res, result);
    }
    if (isLocalExecRequests || isLocalExecResponses) {
      deps.onDesktopContact?.();
    }
    if (isLocalExecRequests) {
      return handleLocalExecRequests(deps, req, res);
    }
    if (isLocalExecResponses) {
      return handleLocalExecResponses(deps, await readBody(req), res);
    }
    if (isWebAuthnRequests) {
      return handleWebAuthnRequests(deps, req, res);
    }
    if (isWebAuthnResponses) {
      return handleWebAuthnResponses(deps, await readBody(req), res);
    }
    if (isCookieOriginApprovalRequests) {
      return handleCookieOriginApprovalRequests(deps, req, res);
    }
    if (isCookieOriginApprovalResponses) {
      return handleCookieOriginApprovalResponses(deps, await readBody(req), res);
    }
    if (isEvents) {
      return handleEvents(deps, req, res, parseSubscribedChannels(url2));
    }
    if (isAvatar) {
      return handleAvatarImage(deps, req, res, url2);
    }
    const method = url2.pathname.slice(GATEWAY_API_PREFIX.length + 1);
    if (deps.authToken == null && SECRET_VALUE_COMMANDS.has(method)) {
      return respondError(res, 401, `${method} requires gateway authentication`);
    }
    const body = await readBody(req);
    return routeCommand(
      deps.api,
      method,
      body,
      res,
      req,
      deps.onCommandError,
      deps.onCommandComplete
    );
  }
  respondError(res, 404, `not found: ${req.method} ${url2.pathname}`);
}
