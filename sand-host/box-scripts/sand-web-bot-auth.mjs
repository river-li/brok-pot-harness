import { appendFileSync, existsSync, renameSync, watch, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { pathToFileURL } from "node:url";

import {
  WEB_BOT_AUTH_SIGNATURE_SOURCES,
  WEB_BOT_AUTH_SIGNED_CACHE_PATH,
  WEB_BOT_AUTH_SIGNED_TTL_MS,
} from "./box-contract.generated.mjs";
import {
  CDP_ERROR_CODES,
  CdpError,
  connectBrowser,
  discoverChromeDebugPorts,
  discoverMonitorPorts,
  isCdpTargetGone,
} from "./cdp-cookies.mjs";

export const WEB_BOT_AUTH_MARKER = "/tmp/sand-web-bot-auth";
export const WEB_BOT_AUTH_XHR_FETCH_MARKER = "/tmp/sand-web-bot-auth-xhr-fetch";
export const WEB_BOT_AUTH_IFRAMES_MARKER = "/tmp/sand-web-bot-auth-iframes";
export const WEB_BOT_AUTH_DEFAULT_SCOPE = Object.freeze({
  xhrFetch: false,
  iframes: false,
});
export const TUNNEL_CLIENT_MARKER = "/tmp/sand-egress-tunnel-client";
export const WEB_BOT_AUTH_SIGNED_MAX_ENTRIES = 64;
export const WEB_BOT_AUTH_FAILURE_REPORT_INTERVAL_MS = 60_000;
export const WEB_BOT_AUTH_FAILURE_COUNT_MAX = 10_000;
const BOX_TELEMETRY_LOG_PATH = process.env.SAND_BOX_TELEMETRY_LOG ?? "/tmp/sand-box-telemetry.log";
const FALLBACK_FAILURE_REASON = {
  fetch_enable: "protocol_error",
  tick: "unexpected_error",
};

function log(message) {
  process.stderr.write(`sand-web-bot-auth ${message}\n`);
}

function logUnlessTargetGone(step) {
  return (error) => {
    if (!isCdpTargetGone(error)) log(`${step} failed: ${String(error)}`);
  };
}

export function classifyWebBotAuthFailure(error, phase) {
  if (error instanceof CdpError) {
    if (error.code === CDP_ERROR_CODES.sendTimeout || error.code === CDP_ERROR_CODES.openTimeout) {
      return "timeout";
    }
    if (error.code === CDP_ERROR_CODES.connectionClosed) return "connection_closed";
  }
  return FALLBACK_FAILURE_REASON[phase];
}

function emitWebBotAuthFailure(event, error) {
  process.stderr.write(
    `sand-web-bot-auth ${event.phase} failed (${event.reason} x${event.count}): ${String(error)}\n`,
  );
  try {
    appendFileSync(BOX_TELEMETRY_LOG_PATH, `${JSON.stringify(event)}\n`, "utf8");
  } catch (appendError) {
    process.stderr.write(`sand-web-bot-auth telemetry append failed: ${String(appendError)}\n`);
  }
}

export class WebBotAuthFailureReporter {
  constructor({
    emit = emitWebBotAuthFailure,
    now = Date.now,
    intervalMs = WEB_BOT_AUTH_FAILURE_REPORT_INTERVAL_MS,
  } = {}) {
    this.emit = emit;
    this.now = now;
    this.intervalMs = intervalMs;
    this.windows = new Map();
  }

  report(phase, error) {
    const reason = classifyWebBotAuthFailure(error, phase);
    const key = `${phase}:${reason}`;
    const nowMs = this.now();
    const open = this.windows.get(key);
    if (open != null && nowMs < open.endsAtMs) {
      open.suppressed += 1;
      return;
    }
    this.emit(
      {
        kind: "web_bot_auth",
        phase,
        reason,
        count: Math.min((open?.suppressed ?? 0) + 1, WEB_BOT_AUTH_FAILURE_COUNT_MAX),
      },
      error,
    );
    this.windows.set(key, { suppressed: 0, endsAtMs: nowMs + this.intervalMs });
  }
}

export function isWebBotAuthEnabled(markerPath = WEB_BOT_AUTH_MARKER) {
  return existsSync(markerPath);
}

export function isTunnelClientAttached(markerPath = TUNNEL_CLIENT_MARKER) {
  return existsSync(markerPath);
}

export function watchWebBotAuthMarkers(onChange, { dir } = {}) {
  const markerNames = new Set([basename(WEB_BOT_AUTH_MARKER), basename(TUNNEL_CLIENT_MARKER)]);
  try {
    return watch(dir ?? dirname(WEB_BOT_AUTH_MARKER), (_event, filename) => {
      if (filename == null || markerNames.has(filename)) onChange(filename);
    });
  } catch {
    return null;
  }
}

function writeSignedCacheFile(path, text) {
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, path);
}

export class WebBotAuthSignedOriginCache {
  constructor({
    path = WEB_BOT_AUTH_SIGNED_CACHE_PATH,
    now = Date.now,
    ttlMs = WEB_BOT_AUTH_SIGNED_TTL_MS,
    maxEntries = WEB_BOT_AUTH_SIGNED_MAX_ENTRIES,
    writeFile = writeSignedCacheFile,
  } = {}) {
    this.path = path;
    this.now = now;
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.writeFile = writeFile;
    this.entries = new Map();
  }

  record({ origin, signed, source }) {
    if (typeof origin !== "string" || origin.length === 0) return;
    const atMs = this.now();
    this.entries.delete(origin);
    const entry = { signed: signed === true, atMs };
    if (entry.signed && WEB_BOT_AUTH_SIGNATURE_SOURCES.includes(source)) {
      entry.source = source;
    }
    this.entries.set(origin, entry);
    this.prune(atMs);
    try {
      this.flush();
    } catch (error) {
      log(`signed-origin cache write failed: ${String(error)}`);
    }
  }

  prune(nowMs) {
    for (const [origin, entry] of this.entries) {
      if (nowMs - entry.atMs > this.ttlMs) this.entries.delete(origin);
    }
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      this.entries.delete(oldest);
    }
  }

  flush() {
    const payload = {};
    for (const [origin, entry] of this.entries) payload[origin] = entry;
    this.writeFile(this.path, JSON.stringify(payload));
  }
}

const SIGN_PATH = "/sand-box/web-bot-auth-signature";
const RENEWAL_PATH = "/sand-box/inference-credential";
const DEFAULT_BACKEND_URL = "https://api2.cursor.sh";
const REQUEST_TIMEOUT_MS = 1_000;
const OFF_HOT_PATH_RENEWAL_TIMEOUT_MS = 2_000;
const RENEWAL_BACKOFF_MS = 5_000;
const HOST_MATCHED_TOKEN_EXPIRY_LEEWAY_MS = 30_000;
const TOKEN_FALLBACK_TTL_MS = 10 * 60_000;
const FORBIDDEN_STREAK_LIMIT = 3;
const FORBIDDEN_COOLDOWN_MS = 5 * 60_000;
const BACKOFF_FALLBACK_MS = 60_000;
const BROWSER_ATTACH_POLL_INTERVAL_MS = 100;
const MARKER_WATCH_BACKSTOP_POLL_INTERVAL_MS = 1_000;
const HEADER_CACHE_TTL_FALLBACK_MS = 25_000;
const HEADER_CACHE_MAX_ENTRIES = 64;
const SIGNATURE_HEADER_NAMES = ["Signature", "Signature-Input", "Signature-Agent"];
const SIGNATURE_HEADER_NAMES_LOWER = new Set(
  SIGNATURE_HEADER_NAMES.map((name) => name.toLowerCase()),
);

export const WEB_BOT_AUTH_DOCUMENT_FETCH_ENABLE_PATTERNS = [
  { resourceType: "Document", requestStage: "Request" },
];
export const WEB_BOT_AUTH_FETCH_ENABLE_PATTERNS = [
  { resourceType: "Document", requestStage: "Request" },
  { resourceType: "XHR", requestStage: "Request" },
  { resourceType: "Fetch", requestStage: "Request" },
];

const ATTACH_IFRAME_TARGETS = {
  autoAttach: true,
  waitForDebuggerOnStart: true,
  flatten: true,
  filter: [{ type: "iframe", exclude: false }, { exclude: true }],
};
const DETACH_IFRAME_TARGETS = {
  autoAttach: false,
  waitForDebuggerOnStart: false,
  flatten: true,
};
const SIGNED_SESSION_TARGET_TYPES = new Set(["page", "iframe"]);

export function webBotAuthFetchEnablePatterns(scope) {
  return scope.xhrFetch
    ? WEB_BOT_AUTH_FETCH_ENABLE_PATTERNS
    : WEB_BOT_AUTH_DOCUMENT_FETCH_ENABLE_PATTERNS;
}

function isSameWebBotAuthScope(a, b) {
  return a.xhrFetch === b.xhrFetch && a.iframes === b.iframes;
}

export function isWebBotAuthSigningCandidate(
  params,
  topFrameId,
  requestUrl,
  scope = WEB_BOT_AUTH_DEFAULT_SCOPE,
) {
  if (requestUrl?.protocol !== "https:") return false;
  const resourceType = params?.resourceType;
  if (
    !webBotAuthFetchEnablePatterns(scope).some((pattern) => pattern.resourceType === resourceType)
  ) {
    return false;
  }
  if (resourceType === "Document") {
    return scope.iframes || params.frameId === topFrameId;
  }
  return true;
}

function parseSignatureHeaders(value) {
  if (value == null || typeof value !== "object") return null;
  const parsed = {};
  for (const name of SIGNATURE_HEADER_NAMES) {
    if (typeof value[name] !== "string" || value[name].length === 0) return null;
    parsed[name] = value[name];
  }
  return parsed;
}

function parseCacheTtlMs(body) {
  const seconds = body?.cacheTtlSeconds;
  if (seconds === 0) return 0;
  if (typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0) {
    return seconds * 1_000;
  }
  return HEADER_CACHE_TTL_FALLBACK_MS;
}

function parseRetryAfterMs(value, nowMs) {
  if (value == null) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000;
  const atMs = Date.parse(value);
  if (!Number.isFinite(atMs)) return null;
  return Math.max(0, atMs - nowMs);
}

function parseJwtExpiryMs(token) {
  try {
    const payload = token.split(".")[1];
    if (payload == null) return null;
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed.exp === "number" && Number.isFinite(parsed.exp) ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(fetchImpl, url, init, timeoutMs, readBody) {
  const signal = AbortSignal.timeout(timeoutMs);
  const timeout = new Promise((_, reject) => {
    signal.addEventListener(
      "abort",
      () => reject(new Error("web bot auth backend request timed out")),
      { once: true },
    );
  });
  const request = (async () => {
    const response = await fetchImpl(url, { ...init, signal });
    const body = await readBody(response);
    return { response, body };
  })();
  return await Promise.race([request, timeout]);
}

function unexpiredAccessToken(cached, nowMs) {
  return cached != null && nowMs < cached.expiresAtMs ? cached.accessToken : null;
}

async function readSigningResponseBody(response) {
  if (response.status === 200) return await response.json();
  if (response.status === 403) {
    return await response.json().catch((error) => {
      log(`403 body is not JSON: ${error?.name ?? String(error)}`);
      return null;
    });
  }
  return null;
}

export class SessionTokenSource {
  constructor({
    credential,
    renewalEndpoint,
    fetchImpl = fetch,
    now = Date.now,
    timeoutMs = OFF_HOT_PATH_RENEWAL_TIMEOUT_MS,
    backoffMs = RENEWAL_BACKOFF_MS,
  }) {
    this.credential = credential;
    this.renewalEndpoint = renewalEndpoint;
    this.fetchImpl = fetchImpl;
    this.now = now;
    this.timeoutMs = timeoutMs;
    this.backoffMs = backoffMs;
    this.cached = null;
    this.nextRenewalAtMs = 0;
    this.renewalInFlight = null;
  }

  invalidate() {
    this.cached = null;
  }

  async getToken() {
    const nowMs = this.now();
    if (
      this.cached != null &&
      nowMs < this.cached.expiresAtMs - HOST_MATCHED_TOKEN_EXPIRY_LEEWAY_MS
    ) {
      return this.cached.accessToken;
    }
    if (nowMs < this.nextRenewalAtMs) {
      return unexpiredAccessToken(this.cached, nowMs);
    }
    if (this.renewalInFlight == null) {
      this.renewalInFlight = this.renew().finally(() => {
        this.renewalInFlight = null;
      });
    }
    return (await this.renewalInFlight) ?? unexpiredAccessToken(this.cached, this.now());
  }

  async renew() {
    try {
      const { response, body } = await fetchWithTimeout(
        this.fetchImpl,
        this.renewalEndpoint,
        {
          method: "POST",
          redirect: "error",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ credential: this.credential }),
        },
        this.timeoutMs,
        async (res) => (res.status === 200 ? await res.json() : null),
      );
      const accessToken = typeof body?.accessToken === "string" ? body.accessToken : "";
      if (response.status !== 200 || accessToken === "") throw new Error();
      const expiresAtMs =
        typeof body.expiresAtMs === "number" && Number.isFinite(body.expiresAtMs)
          ? body.expiresAtMs
          : (parseJwtExpiryMs(accessToken) ?? this.now() + TOKEN_FALLBACK_TTL_MS);
      this.cached = { accessToken, expiresAtMs };
      return accessToken;
    } catch {
      this.nextRenewalAtMs = this.now() + this.backoffMs;
      return null;
    }
  }
}

export function resolveWebBotAuthConfig(env = process.env) {
  const credential = env.SAND_INFERENCE_RENEWAL_CREDENTIAL?.trim() ?? "";
  if (credential === "") return null;
  const base = env.SAND_BACKEND_URL ?? env.CURSOR_API_BASE_URL ?? DEFAULT_BACKEND_URL;
  if (!URL.canParse(SIGN_PATH, base)) return null;
  return {
    credential,
    endpoint: new URL(SIGN_PATH, base).toString(),
    renewalEndpoint: new URL(RENEWAL_PATH, base).toString(),
  };
}

export class WebBotAuthSigner {
  constructor({
    endpoint,
    getToken,
    fetchImpl = fetch,
    now = Date.now,
    timeoutMs = REQUEST_TIMEOUT_MS,
    forbiddenStreakLimit = FORBIDDEN_STREAK_LIMIT,
    forbiddenCooldownMs = FORBIDDEN_COOLDOWN_MS,
    onUnauthenticated = () => {},
  }) {
    this.endpoint = endpoint;
    this.getToken = getToken;
    this.fetchImpl = fetchImpl;
    this.now = now;
    this.timeoutMs = timeoutMs;
    this.forbiddenStreakLimit = forbiddenStreakLimit;
    this.forbiddenCooldownMs = forbiddenCooldownMs;
    this.onUnauthenticated = onUnauthenticated;
    this.consecutiveForbidden = 0;
    this.nextProbeAtMs = 0;
    this.probeInFlight = false;
    this.disabledOriginNextProbeAtMs = new Map();
    this.headerCache = new Map();
    this.headerInFlight = new Map();
  }

  cachedHeaders(origin) {
    const entry = this.headerCache.get(origin);
    if (entry == null) return null;
    if (this.now() >= entry.expiresAtMs) {
      this.headerCache.delete(origin);
      return null;
    }
    return entry.headers;
  }

  rememberHeaders(origin, headers, ttlMs) {
    if (ttlMs <= 0) return;
    this.headerCache.delete(origin);
    this.headerCache.set(origin, {
      headers,
      expiresAtMs: this.now() + ttlMs,
    });
    while (this.headerCache.size > HEADER_CACHE_MAX_ENTRIES) {
      const oldest = this.headerCache.keys().next().value;
      this.headerCache.delete(oldest);
    }
  }

  async getHeaders({ origin }) {
    const startedAtMs = this.now();
    for (const [disabledOrigin, nextProbeAtMs] of this.disabledOriginNextProbeAtMs) {
      if (startedAtMs >= nextProbeAtMs) {
        this.disabledOriginNextProbeAtMs.delete(disabledOrigin);
      }
    }
    if (this.disabledOriginNextProbeAtMs.has(origin)) return null;
    const cached = this.cachedHeaders(origin);
    if (cached != null) return { headers: cached, source: "box_cache" };
    const inflight = this.headerInFlight.get(origin);
    if (inflight != null) return await inflight;
    if (this.probeInFlight) return null;
    if (startedAtMs < this.nextProbeAtMs) return null;
    const isProbe = this.nextProbeAtMs > 0;
    const flight = this.fetchSignatureHeaders(origin, { isProbe });
    this.headerInFlight.set(origin, flight);
    try {
      return await flight;
    } finally {
      if (this.headerInFlight.get(origin) === flight) {
        this.headerInFlight.delete(origin);
      }
    }
  }

  async fetchSignatureHeaders(origin, { isProbe }) {
    if (isProbe) {
      this.probeInFlight = true;
      this.nextProbeAtMs = 0;
    }
    try {
      const token = await this.getToken();
      if (token == null) return null;
      const { response, body } = await fetchWithTimeout(
        this.fetchImpl,
        this.endpoint,
        {
          method: "POST",
          redirect: "error",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ url: origin }),
        },
        this.timeoutMs,
        readSigningResponseBody,
      );
      if (response.status === 401) {
        this.onUnauthenticated();
        this.headerCache.clear();
        this.nextProbeAtMs = this.now() + BACKOFF_FALLBACK_MS;
        return null;
      }
      if (response.status === 403) {
        const signingEnabledButOriginNotAllowlisted = body?.reason === "origin_not_allowed";
        if (signingEnabledButOriginNotAllowlisted) {
          this.disabledOriginNextProbeAtMs.set(origin, this.now() + this.forbiddenCooldownMs);
          this.consecutiveForbidden = 0;
          this.nextProbeAtMs = 0;
          return null;
        }
        this.consecutiveForbidden += 1;
        if (this.consecutiveForbidden >= this.forbiddenStreakLimit) {
          this.nextProbeAtMs = this.now() + this.forbiddenCooldownMs;
        }
        return null;
      }
      if (response.status === 429) {
        this.nextProbeAtMs =
          this.now() +
          (parseRetryAfterMs(response.headers.get("retry-after"), this.now()) ??
            BACKOFF_FALLBACK_MS);
        return null;
      }
      if (response.status !== 200) {
        this.nextProbeAtMs = this.now() + BACKOFF_FALLBACK_MS;
        return null;
      }
      this.consecutiveForbidden = 0;
      this.nextProbeAtMs = 0;
      this.disabledOriginNextProbeAtMs.delete(origin);
      const headers = parseSignatureHeaders(body?.headers);
      if (headers == null) return null;
      this.rememberHeaders(origin, headers, parseCacheTtlMs(body));
      return {
        headers,
        source: body?.cacheHit === true ? "fleet_cache" : "fresh",
      };
    } catch {
      this.nextProbeAtMs = this.now() + BACKOFF_FALLBACK_MS;
      return null;
    } finally {
      if (isProbe) this.probeInFlight = false;
    }
  }
}

export function mergeRequestHeaders(requestHeaders, signatureHeaders) {
  const headers = [];
  for (const [name, value] of Object.entries(requestHeaders ?? {})) {
    if (SIGNATURE_HEADER_NAMES_LOWER.has(name.toLowerCase())) continue;
    headers.push({ name, value: String(value) });
  }
  for (const name of SIGNATURE_HEADER_NAMES) {
    headers.push({ name, value: signatureHeaders[name] });
  }
  return headers;
}

export async function continueWebBotAuthRequest({
  browser,
  sessionId,
  params,
  topFrameId,
  signer,
  isEnabled = () => false,
  getScope = () => WEB_BOT_AUTH_DEFAULT_SCOPE,
  signedOriginCache,
}) {
  let headers = null;
  let signatureSource = undefined;
  let consideredOrigin = null;
  try {
    const request = params?.request;
    const requestUrl = typeof request?.url === "string" ? new URL(request.url) : null;
    const isSigningCandidate = () =>
      isEnabled() && isWebBotAuthSigningCandidate(params, topFrameId, requestUrl, getScope());
    if (isSigningCandidate()) {
      consideredOrigin = requestUrl.origin;
      const signed = await signer.getHeaders({ origin: requestUrl.origin });
      if (signed != null && isSigningCandidate()) {
        headers = mergeRequestHeaders(request.headers, signed.headers);
        signatureSource = signed.source;
      }
    }
  } catch (error) {
    log(`a paused request continues unsigned: ${String(error)}`);
  }
  const continuation = { requestId: params?.requestId };
  if (headers != null) continuation.headers = headers;
  await browser
    .send("Fetch.continueRequest", continuation, sessionId)
    .catch(logUnlessTargetGone("Fetch.continueRequest"));
  if (consideredOrigin != null) {
    signedOriginCache?.record({
      origin: consideredOrigin,
      signed: headers != null,
      source: headers != null ? signatureSource : undefined,
    });
  }
}

export async function configureWebBotAuthBrowser(
  browser,
  signer,
  {
    isEnabled = () => false,
    getScope = () => WEB_BOT_AUTH_DEFAULT_SCOPE,
    signedOriginCache,
    failures,
  } = {},
) {
  const topFrameBySession = new Map();
  const enableFetch = async (sessionId) => {
    await browser
      .send("Fetch.enable", { patterns: webBotAuthFetchEnablePatterns(getScope()) }, sessionId)
      .catch((error) => failures?.report("fetch_enable", error));
  };
  const autoAttachIframes = async (sessionId, iframes) => {
    await browser
      .send(
        "Target.setAutoAttach",
        iframes ? ATTACH_IFRAME_TARGETS : DETACH_IFRAME_TARGETS,
        sessionId,
      )
      .catch(logUnlessTargetGone("Target.setAutoAttach"));
  };
  const enableFetchThenResume = async (sessionId, waitingForDebugger) => {
    try {
      await enableFetch(sessionId);
      if (getScope().iframes) await autoAttachIframes(sessionId, true);
    } finally {
      if (waitingForDebugger) {
        await browser
          .send("Runtime.runIfWaitingForDebugger", {}, sessionId)
          .catch(logUnlessTargetGone("Runtime.runIfWaitingForDebugger"));
      }
    }
  };
  const applyScope = async () => {
    const { iframes } = getScope();
    for (const sessionId of [...topFrameBySession.keys()]) {
      if (!topFrameBySession.has(sessionId)) continue;
      await enableFetch(sessionId);
      await autoAttachIframes(sessionId, iframes);
    }
  };
  browser.onEvent((message) => {
    const sessionId = message.sessionId;
    if (
      message.method === "Target.attachedToTarget" &&
      SIGNED_SESSION_TARGET_TYPES.has(message.params?.targetInfo?.type) &&
      typeof message.params?.sessionId === "string"
    ) {
      const attachedSessionId = message.params.sessionId;
      const targetId = message.params.targetInfo.targetId;
      topFrameBySession.set(attachedSessionId, typeof targetId === "string" ? targetId : undefined);
      void browser
        .send("Page.getFrameTree", {}, attachedSessionId)
        .then((result) => {
          const frameId = result?.frameTree?.frame?.id;
          if (typeof frameId === "string") {
            topFrameBySession.set(attachedSessionId, frameId);
          }
        })
        .catch(logUnlessTargetGone("Page.getFrameTree"));
      void enableFetchThenResume(attachedSessionId, message.params.waitingForDebugger === true);
      return;
    }
    if (
      message.method === "Target.detachedFromTarget" &&
      typeof message.params?.sessionId === "string"
    ) {
      topFrameBySession.delete(message.params.sessionId);
      return;
    }
    if (message.method === "Fetch.requestPaused" && typeof sessionId === "string") {
      void continueWebBotAuthRequest({
        browser,
        sessionId,
        params: message.params,
        topFrameId: topFrameBySession.get(sessionId),
        signer,
        isEnabled,
        getScope,
        signedOriginCache,
      });
    }
  });
  await browser.send("Target.setAutoAttach", {
    autoAttach: true,
    waitForDebuggerOnStart: false,
    flatten: true,
    filter: [{ type: "page", exclude: false }, { exclude: true }],
  });
  return { applyScope };
}

export function discoverSigningPorts({ x11Dir, procRoot } = {}) {
  const ports = new Set(discoverMonitorPorts(x11Dir));
  for (const port of discoverChromeDebugPorts(procRoot)) ports.add(port);
  return [...ports].sort((a, b) => a - b);
}

export class WebBotAuthDaemon {
  constructor({
    signer,
    discoverPorts = discoverSigningPorts,
    connect = connectBrowser,
    isEnabled = () => false,
    getScope = () => WEB_BOT_AUTH_DEFAULT_SCOPE,
    prefetchToken = async () => {},
    signedOriginCache,
    failures,
  }) {
    this.signer = signer;
    this.discoverPorts = discoverPorts;
    this.connect = connect;
    this.isEnabled = isEnabled;
    this.getScope = getScope;
    this.prefetchToken = prefetchToken;
    this.signedOriginCache = signedOriginCache;
    this.failures = failures;
    this.browsers = new Map();
    this.lastAppliedScope = null;
  }

  async detachAll() {
    const closing = [];
    for (const [port, { browser }] of this.browsers) {
      this.browsers.delete(port);
      closing.push(
        (async () => {
          await browser.send("Fetch.disable", {}).catch(logUnlessTargetGone("Fetch.disable"));
          browser.close();
        })(),
      );
    }
    this.lastAppliedScope = null;
    await Promise.all(closing);
  }

  async tick() {
    if (this.signer == null || !this.isEnabled()) {
      await this.detachAll();
      return false;
    }
    try {
      void (async () => this.prefetchToken())().catch((error) => {
        log(`token prefetch failed: ${String(error)}`);
      });
      const scope = this.getScope();
      if (this.lastAppliedScope !== null && !isSameWebBotAuthScope(scope, this.lastAppliedScope)) {
        for (const { applyScope } of this.browsers.values()) {
          await applyScope();
        }
      }
      this.lastAppliedScope = scope;
      for (const port of this.discoverPorts()) {
        const existing = this.browsers.get(port);
        if (existing != null && !existing.browser.isClosed) continue;
        let browser = null;
        try {
          browser = await this.connect(port);
          const { applyScope } = await configureWebBotAuthBrowser(browser, this.signer, {
            isEnabled: () => this.isEnabled(),
            getScope: () => this.getScope(),
            signedOriginCache: this.signedOriginCache,
            failures: this.failures,
          });
          this.browsers.set(port, { browser, applyScope });
        } catch {
          browser?.close();
        }
      }
      for (const [port, { browser }] of this.browsers) {
        if (browser.isClosed) {
          this.browsers.delete(port);
        }
      }
      return true;
    } catch (error) {
      this.failures?.report("tick", error);
      return false;
    }
  }
}

async function main() {
  const config = resolveWebBotAuthConfig();
  let signer = null;
  let tokenSource = null;
  if (config != null) {
    tokenSource = new SessionTokenSource(config);
    signer = new WebBotAuthSigner({
      endpoint: config.endpoint,
      getToken: () => tokenSource.getToken(),
      onUnauthenticated: () => tokenSource.invalidate(),
    });
  }
  const daemon = new WebBotAuthDaemon({
    signer,
    isEnabled: () => isWebBotAuthEnabled() && !isTunnelClientAttached(),
    getScope: () => ({
      xhrFetch: isWebBotAuthEnabled(WEB_BOT_AUTH_XHR_FETCH_MARKER),
      iframes: isWebBotAuthEnabled(WEB_BOT_AUTH_IFRAMES_MARKER),
    }),
    prefetchToken: () => tokenSource?.getToken(),
    signedOriginCache: new WebBotAuthSignedOriginCache(),
    failures: new WebBotAuthFailureReporter(),
  });
  let wakeRequested = false;
  let releaseSleep = null;
  const markerWatcher = watchWebBotAuthMarkers(() => {
    wakeRequested = true;
    releaseSleep?.();
  });
  for (;;) {
    const enabled = await daemon.tick();
    const interval =
      enabled || markerWatcher == null
        ? BROWSER_ATTACH_POLL_INTERVAL_MS
        : MARKER_WATCH_BACKSTOP_POLL_INTERVAL_MS;
    if (!wakeRequested) {
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, interval);
        releaseSleep = () => {
          clearTimeout(timer);
          resolve();
        };
      });
      releaseSleep = null;
    }
    wakeRequested = false;
  }
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
