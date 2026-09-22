/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/cursor-backend/cursor-inference.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function enhancedObfuscate(bytes) {
  let lastByte = 165;
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = (bytes[i] ^ lastByte) + i % 256;
    lastByte = bytes[i];
  }
  return bytes;
}
function createCursorChecksum(machineId) {
  const unixKiloSeconds = Math.floor(Date.now() / 1e6);
  const bytes = new Uint8Array([
    unixKiloSeconds >> 40 & 255,
    unixKiloSeconds >> 32 & 255,
    unixKiloSeconds >> 24 & 255,
    unixKiloSeconds >> 16 & 255,
    unixKiloSeconds >> 8 & 255,
    unixKiloSeconds & 255
  ]);
  const checksum = Buffer.from(enhancedObfuscate(bytes)).toString("base64url");
  return `${checksum}${machineId}`;
}
function installSandCursorBackendClientDefaultTeamIdGetter(getTeamId) {
  const installation = { getTeamId };
  sandTeamIdGetterInstallations.push(installation);
  return () => {
    const index = sandTeamIdGetterInstallations.indexOf(installation);
    if (index !== -1) sandTeamIdGetterInstallations.splice(index, 1);
  };
}
function getSandCursorBackendClientDefaultTeamIdGetter() {
  return sandTeamIdGetterInstallations.at(-1)?.getTeamId;
}
function sandRunPrivacyModeFallback() {
  return PrivacyMode.NO_TRAINING;
}
function getSandGhostModeHeaderFromPrivacyMode(privacyMode) {
  return privacyMode === PrivacyMode.USAGE_DATA_TRAINING_ALLOWED || privacyMode === PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED ? "false" : "true";
}
function privacyLookupErrorLabel(error42) {
  if (error42 instanceof ConnectError) return Code[error42.code];
  return error42 instanceof Error ? error42.name : typeof error42;
}
async function fetchSandPrivacyMode({
  backend,
  accessToken,
  machineId,
  teamId
}) {
  const client = createSandCursorBackendClient(DashboardService2, {
    backend,
    getAccessToken: async () => accessToken,
    getTeamId: async () => teamId,
    getMachineId: async () => machineId
  });
  const response = await client.getUserPrivacyMode(
    new GetUserPrivacyModeRequest({
      inferredPrivacyMode: PrivacyMode.NO_STORAGE
    }),
    { timeoutMs: PRIVACY_MODE_FETCH_TIMEOUT_MS }
  );
  return response.privacyMode;
}
async function settlePrivacyMode(fetchPrivacyMode, options2) {
  try {
    return await fetchPrivacyMode(options2);
  } catch (error42) {
    console.info(
      `[sand:privacy] privacy-mode lookup failed, using privacy-safe fallback backend=${options2.backend.backendUrl} error=${privacyLookupErrorLabel(error42)}`
    );
    return void 0;
  }
}
async function resolveCachedSandPrivacyMode(options2, fetchPrivacyMode) {
  const accountScope = accountScopeOfToken({ accessToken: options2.accessToken });
  const cached2 = cachedPrivacyMode;
  if (cached2?.backendUrl === options2.backend.backendUrl && cached2.accountScope === accountScope && cached2.teamId === options2.teamId && (cached2.expiresAt === void 0 || Date.now() <= cached2.expiresAt)) {
    return await cached2.value;
  }
  const startedAt = Date.now();
  const value = settlePrivacyMode(fetchPrivacyMode, options2);
  const entry = {
    backendUrl: options2.backend.backendUrl,
    accountScope,
    ...options2.teamId !== void 0 ? { teamId: options2.teamId } : {},
    value
  };
  cachedPrivacyMode = entry;
  const privacyMode = await value;
  entry.expiresAt = startedAt + (privacyMode === void 0 ? PRIVACY_MODE_FALLBACK_CACHE_MAX_AGE_MS : PRIVACY_MODE_CACHE_MAX_AGE_MS);
  return privacyMode;
}
async function resolveSandPrivacyMode(options2, fetchPrivacyMode = fetchSandPrivacyMode) {
  return await resolveCachedSandPrivacyMode(options2, fetchPrivacyMode);
}
async function resolveSandRunPrivacyMode(options2, fetchPrivacyMode = fetchSandPrivacyMode) {
  try {
    const backendUrl = options2.backend.backendUrl;
    const [accessToken, machineId, teamId] = await Promise.all([
      options2.getAccessToken({ backendUrl }),
      options2.getMachineId(),
      options2.getTeamId?.()
    ]);
    const accountScopeAtStart = accountScopeOfToken({ accessToken });
    const privacyMode = await resolveCachedSandPrivacyMode(
      {
        backend: options2.backend,
        accessToken,
        machineId,
        ...teamId !== void 0 ? { teamId } : {}
      },
      fetchPrivacyMode
    );
    const [currentAccessToken, currentTeamId2] = await Promise.all([
      options2.getAccessToken({ backendUrl }),
      options2.getTeamId?.()
    ]);
    if (accountScopeOfToken({ accessToken: currentAccessToken }) !== accountScopeAtStart || currentTeamId2 !== teamId) {
      return sandRunPrivacyModeFallback();
    }
    switch (privacyMode) {
      case PrivacyMode.NO_STORAGE:
      case PrivacyMode.NO_TRAINING:
      case PrivacyMode.USAGE_DATA_TRAINING_ALLOWED:
      case PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED:
        return privacyMode;
      case PrivacyMode.UNSPECIFIED:
      case void 0:
      default:
        return sandRunPrivacyModeFallback();
    }
  } catch {
    return sandRunPrivacyModeFallback();
  }
}
async function resolveSandGhostModeHeader(options2, fetchPrivacyMode = fetchSandPrivacyMode) {
  return getSandGhostModeHeaderFromPrivacyMode(
    await resolveSandPrivacyMode(options2, fetchPrivacyMode)
  );
}
async function resolveSandBackendAuthContext(options2) {
  const teamId = await options2.getTeamId?.({
    expectedAccountScope: accountScopeOfToken({ accessToken: options2.accessToken })
  });
  return {
    accessToken: options2.accessToken,
    ...teamId !== void 0 && Number.isSafeInteger(teamId) && teamId > 0 ? { teamId } : {}
  };
}
function resolveDefaultedTeamIdGetter(options2) {
  return Object.hasOwn(options2, "getTeamId") ? options2.getTeamId : getSandCursorBackendClientDefaultTeamIdGetter();
}
async function resolveSandBackendAuth(options2, backendUrl) {
  if ("authMode" in options2 && options2.authMode === "anonymous") {
    return { mode: "anonymous" };
  }
  if ("authMode" in options2) {
    const accessToken2 = await options2.getAccessToken({ backendUrl });
    if (accessToken2 == null || accessToken2.length === 0) {
      return { mode: "anonymous" };
    }
    return {
      mode: "required",
      ...await resolveSandBackendAuthContext({
        accessToken: accessToken2,
        getTeamId: resolveDefaultedTeamIdGetter(options2)
      })
    };
  }
  const accessToken = await options2.getAccessToken({ backendUrl });
  return {
    mode: "required",
    ...await resolveSandBackendAuthContext({
      accessToken,
      getTeamId: resolveDefaultedTeamIdGetter(options2)
    })
  };
}
function applySandInferenceRequestContext(headers, context2) {
  if (context2 == null) return;
  const inferenceProxyJwt = context2.inferenceProxyJwt?.trim();
  if (inferenceProxyJwt != null && inferenceProxyJwt.length > 0 && !inferenceProxyJwt.startsWith("$")) {
    headers.set("x-inference-authentication-jwt", inferenceProxyJwt);
  }
  headers.set("x-cursor-workload", context2.workload);
  headers.set("x-cursor-workload-job-id", context2.jobId);
  headers.set("x-cursor-workload-user", context2.user);
  if (context2.trafficType != null && context2.trafficType.length > 0) {
    headers.set("x-cursor-traffic-type", context2.trafficType);
  }
  if (context2.provider429RetryPolicy != null && context2.provider429RetryPolicy.length > 0) {
    headers.set("x-cursor-provider-429-retry-policy", context2.provider429RetryPolicy);
  }
}
async function resolveSandBackendRequestHeaders(options2, isPrivacyModeLookup) {
  const resolveGhostModeHeader = options2.resolveGhostModeHeader ?? resolveSandGhostModeHeader;
  const [auth2, machineId] = await Promise.all([
    resolveSandBackendAuth(options2, options2.backend.backendUrl),
    options2.getMachineId()
  ]);
  const ghostModeHeader = auth2.mode === "anonymous" || isPrivacyModeLookup ? "true" : await resolveGhostModeHeader({
    backend: options2.backend,
    accessToken: auth2.accessToken,
    machineId,
    ...auth2.teamId !== void 0 ? { teamId: auth2.teamId } : {}
  });
  const headers = new Headers();
  if (auth2.mode === "required") {
    headers.set("authorization", `Bearer ${auth2.accessToken}`);
    if (auth2.teamId !== void 0) {
      headers.set("x-cursor-team-id", String(auth2.teamId));
    }
  }
  if (machineId.length > 0) {
    headers.set("x-cursor-checksum", createCursorChecksum(machineId));
  }
  headers.set("x-cursor-client-type", SAND_CLIENT_TYPE);
  headers.set("x-cursor-client-version", options2.backend.clientVersion);
  headers.set("x-cursor-client-os", options2.backend.clientOS);
  headers.set(SAND_BOX_NAMESPACE_HEADER, options2.backend.boxNamespace);
  headers.set("x-ghost-mode", ghostModeHeader);
  for (const [headerName, headerValue] of Object.entries(
    buildSandRequestLineageHeaders(options2.lineage)
  )) {
    headers.set(headerName, headerValue);
  }
  applySandInferenceRequestContext(headers, options2.inferenceRequestContext);
  applyLocalCliModeHeader(headers);
  return headers;
}
async function resolveSandBackendRequestHeaderRecord(options2) {
  const headers = await resolveSandBackendRequestHeaders(options2, false);
  return {
    backendUrl: options2.backend.backendUrl,
    headers: Object.fromEntries(headers.entries())
  };
}
function createSandInferenceInterceptor(options2) {
  return (next) => async (req) => {
    const isPrivacyModeLookup = req.service.typeName === DashboardService2.typeName && req.method.name === DashboardService2.methods.getUserPrivacyMode.name;
    const isGrokBotInferenceStream = req.service.typeName === "aiserver.v1.InferenceService" && req.method.name === "Stream";
    const getGrokBotAccessToken = isGrokBotInferenceStream && !("authMode" in options2) ? options2.getGrokBotAccessToken : void 0;
    const [headers, grokBotAccessToken] = await Promise.all([
      resolveSandBackendRequestHeaders(options2, isPrivacyModeLookup),
      getGrokBotAccessToken?.({ backendUrl: options2.backend.backendUrl })
    ]);
    if (grokBotAccessToken != null && grokBotAccessToken.length > 0) {
      headers.set("authorization", `Bearer ${grokBotAccessToken}`);
    }
    const pinnedRequestId = req.header.get("x-request-id");
    const requestId2 = pinnedRequestId != null && pinnedRequestId !== "" ? pinnedRequestId : crypto.randomUUID();
    req.header.delete("authorization");
    req.header.delete("x-cursor-team-id");
    for (const [headerName, headerValue] of headers.entries()) {
      req.header.set(headerName, headerValue);
    }
    req.header.set("x-request-id", requestId2);
    options2.onRequestId?.(requestId2);
    const onUnauthenticatedResponse = "authMode" in options2 || grokBotAccessToken != null ? void 0 : options2.onUnauthenticatedResponse;
    const sessionBearer = bearerOf(headers.get("authorization"));
    try {
      return await next(req);
    } catch (error42) {
      if (onUnauthenticatedResponse != null && sessionBearer != null && error42 instanceof ConnectError && error42.code === Code.Unauthenticated) {
        onUnauthenticatedResponse({
          backendUrl: options2.backend.backendUrl,
          accessToken: sessionBearer
        });
      }
      throw error42;
    }
  };
}
function bearerOf(authorization) {
  const token = authorization?.replace(/^Bearer /, "");
  return token != null && token.length > 0 ? token : void 0;
}
function createSafeHttp1ConnectTransport(options2) {
  const httpClient = createNodeHttpClient({ httpVersion: "1.1" });
  return createTransport({
    baseUrl: options2.baseUrl,
    httpClient: (request5) => httpClient(
      request5.signal !== void 0 ? request5 : { ...request5, signal: new AbortController().signal }
    ),
    useBinaryFormat: options2.useBinaryFormat ?? true,
    interceptors: options2.interceptors,
    sendCompression: null,
    acceptCompression: [compressionGzip, compressionBrotli],
    ...validateReadWriteMaxBytes(void 0, void 0, void 0)
  });
}
function createSandBackendTransport(options2) {
  return createSafeHttp1ConnectTransport({
    baseUrl: options2.backend.backendUrl,
    interceptors: [createSandRpcTracingInterceptor(), createSandInferenceInterceptor(options2)]
  });
}
function createSandCursorBackendClient(service, options2) {
  const { backend } = options2;
  invariant(backend != null, "createSandCursorBackendClient: options.backend is required");
  return createClient(service, createSandBackendTransport({ ...options2, backend }));
}
var sandTeamIdGetterInstallations, PRIVACY_MODE_CACHE_MAX_AGE_MS, PRIVACY_MODE_FALLBACK_CACHE_MAX_AGE_MS, PRIVACY_MODE_FETCH_TIMEOUT_MS, cachedPrivacyMode;
var init_cursor_inference = __esm({
  "src/shared/node/cursor-backend/cursor-inference.ts"() {
    "use strict";
    init_request();
    init_esm2();
    init_esm3();
    init_protocol();
    init_protocol_connect();
    init_sand_agent_model();
    init_invariant();
    init_request_lineage();
    init_proto();
    init_cursor_token();
    init_sand_client_metadata();
    init_rpc_tracing();
    init_sand_client_metadata();
    sandTeamIdGetterInstallations = [];
    PRIVACY_MODE_CACHE_MAX_AGE_MS = 5 * 6e4;
    PRIVACY_MODE_FALLBACK_CACHE_MAX_AGE_MS = 1e4;
    PRIVACY_MODE_FETCH_TIMEOUT_MS = 3e3;
  }
});

