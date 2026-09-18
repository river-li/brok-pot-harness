var import_promises6 = require("node:fs/promises");
init_errors();
init_cursor_token();
init_sand_client_metadata();
var SandCredentialRenewalError = class extends SandDomainError {
  name = "SandCredentialRenewalError";
  httpStatus;
  constructor(message, options2) {
    super(message, options2);
    this.httpStatus = options2?.httpStatus;
  }
};
var SAND_INFERENCE_RENEWAL_CREDENTIAL_ENV = "SAND_INFERENCE_RENEWAL_CREDENTIAL";
var REFRESH_LEEWAY_MS = 2 * 60 * 1e3;
var MIN_REFRESH_INTERVAL_MS = 30 * 1e3;
var MAX_REFRESH_INTERVAL_MS = 30 * 60 * 1e3;
var CREDENTIAL_RETRY_BASE_DELAY_MS = 5 * 1e3;
var CREDENTIAL_RETRY_MAX_DELAY_MS = 5 * 60 * 1e3;
var DEV_TOKEN_FILE_POLL_INTERVAL_MS = 5 * 1e3;
var DEFAULT_TTL_MS = 10 * 60 * 1e3;
var RENEWAL_PATH = "/sand-box/inference-credential";
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
async function renewSandBoxInferenceCredential(args) {
  const fetchImpl = args.fetchImpl ?? fetch;
  const response = await fetchImpl(new URL(RENEWAL_PATH, args.backend.backendUrl).toString(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...getSandBackendClientHeaders(args.backend)
    },
    body: JSON.stringify({ credential: args.credential })
  });
  if (!response.ok) {
    throw new SandCredentialRenewalError(
      `Sand inference-credential renewal failed (HTTP ${response.status}).`,
      { httpStatus: response.status }
    );
  }
  const parsed2 = await response.json();
  const accessToken = typeof parsed2.accessToken === "string" ? parsed2.accessToken : "";
  if (accessToken.length === 0) {
    throw new SandCredentialRenewalError("Sand inference-credential renewal returned no token.");
  }
  const expiresAtMs = typeof parsed2.expiresAtMs === "number" && Number.isFinite(parsed2.expiresAtMs) ? parsed2.expiresAtMs : getAccessTokenExpiryMs(accessToken) ?? Date.now() + DEFAULT_TTL_MS;
  const grokBotToken = typeof parsed2.grokBotToken === "string" && parsed2.grokBotToken.length > 0 ? parsed2.grokBotToken : accessToken;
  return { accessToken, grokBotToken, expiresAtMs };
}
var SAND_DEV_INFERENCE_TOKEN_FILE_ENV = "SAND_DEV_INFERENCE_TOKEN_FILE";
async function readDevInferenceCredentialFile(args) {
  const read = args.readFileImpl ?? ((path31) => (0, import_promises6.readFile)(path31, "utf8"));
  const raw = await read(args.path);
  const parsed2 = JSON.parse(raw);
  const accessToken = typeof parsed2.accessToken === "string" ? parsed2.accessToken : "";
  if (accessToken.length === 0) {
    throw new SandCredentialRenewalError(
      `Dev inference token file ${args.path} has no accessToken yet.`
    );
  }
  const expiresAtMs = typeof parsed2.expiresAtMs === "number" && Number.isFinite(parsed2.expiresAtMs) ? parsed2.expiresAtMs : getAccessTokenExpiryMs(accessToken) ?? Date.now() + DEFAULT_TTL_MS;
  const grokBotToken = typeof parsed2.grokBotToken === "string" && parsed2.grokBotToken.length > 0 ? parsed2.grokBotToken : accessToken;
  return { accessToken, grokBotToken, expiresAtMs };
}
function isSameCredential(a, b2) {
  return b2 !== void 0 && a.accessToken === b2.accessToken && a.grokBotToken === b2.grokBotToken && a.expiresAtMs === b2.expiresAtMs;
}
var SandInferenceCredentialRenewer = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  abort = new AbortController();
  loop;
  consecutiveFailures = 0;
  adopted;
  interruptWait;
  onDemandRenewal;
  start() {
    this.loop ??= this.run();
  }
  close() {
    this.abort.abort();
    this.completeOnDemandRenewal();
  }
  requestImmediateRenewal() {
    if (this.abort.signal.aborted) return Promise.resolve(false);
    if (this.onDemandRenewal !== void 0) {
      return this.onDemandRenewal.promise.then(() => true);
    }
    const interrupt = this.interruptWait;
    if (interrupt === void 0) return Promise.resolve(false);
    const renewal = Promise.withResolvers();
    this.onDemandRenewal = renewal;
    interrupt();
    return renewal.promise.then(() => true);
  }
  async run() {
    try {
      while (!this.abort.signal.aborted) {
        this.onDemandRenewal ??= Promise.withResolvers();
        const next = await this.cycle();
        this.completeOnDemandRenewal();
        if (next === null) return;
        await this.waitFor(next);
      }
    } finally {
      this.completeOnDemandRenewal();
    }
  }
  completeOnDemandRenewal() {
    this.onDemandRenewal?.resolve();
    this.onDemandRenewal = void 0;
  }
  async cycle() {
    const cycleStartedAtMs = Date.now();
    try {
      const credential = this.options.getCredential();
      if (credential == null || credential.length === 0) {
        return { kind: "refresh", delayMs: MAX_REFRESH_INTERVAL_MS };
      }
      const renewed = await this.options.renew(credential);
      if (this.abort.signal.aborted) return null;
      this.consecutiveFailures = 0;
      if (!isSameCredential(renewed, this.adopted)) {
        this.adopted = renewed;
        this.options.setCredential(renewed);
        this.reportResult("renewed", Date.now() - cycleStartedAtMs);
      }
      const untilRefresh = renewed.expiresAtMs - Date.now() - REFRESH_LEEWAY_MS;
      return {
        kind: "refresh",
        delayMs: Math.min(
          clamp(untilRefresh, MIN_REFRESH_INTERVAL_MS, MAX_REFRESH_INTERVAL_MS),
          this.options.pollIntervalMs ?? MAX_REFRESH_INTERVAL_MS
        )
      };
    } catch (error41) {
      if (this.abort.signal.aborted) return null;
      this.consecutiveFailures += 1;
      this.reportResult(
        "failed",
        Date.now() - cycleStartedAtMs,
        redactRenewalErrorForReport(error41 instanceof Error ? error41.message : String(error41))
      );
      return { kind: "backoff", attempt: this.consecutiveFailures };
    }
  }
  async waitFor(next) {
    const signal = this.abort.signal;
    if (signal.aborted) return;
    if (next.kind === "backoff") {
      const scheduled = this.options.retry.schedule(next.attempt, signal);
      let interrupted = false;
      const interrupt = () => {
        interrupted = true;
        scheduled.dispose();
      };
      if (this.options.allowImmediateRenewalDuringBackoff) this.interruptWait = interrupt;
      try {
        await scheduled.elapsed;
      } catch (error41) {
        if (signal.aborted || interrupted) return;
        console.warn(`[sand-credential-renewer] backoff wait failed (${errorLogTag(error41)})`);
      } finally {
        if (this.interruptWait === interrupt) this.interruptWait = void 0;
      }
      return;
    }
    await new Promise((resolve29) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        scheduled.dispose();
        signal.removeEventListener("abort", finish);
        if (this.interruptWait === finish) {
          this.interruptWait = void 0;
        }
        resolve29();
      };
      const scheduled = this.options.clock.schedule(next.delayMs, finish);
      this.interruptWait = finish;
      signal.addEventListener("abort", finish, { once: true });
    });
  }
  reportResult(outcome, durationMs, errorSummary) {
    try {
      this.options.onResult?.({
        outcome,
        consecutiveFailures: this.consecutiveFailures,
        durationMs,
        errorSummary
      });
    } catch {
    }
  }
};
function redactRenewalErrorForReport(raw) {
  return raw.replace(/https?:\/\/\S+/gi, "<url>").replace(/\/[^\s"']+/g, "<path>").replace(/[A-Za-z0-9_-]{24,}/g, "<id>").replace(/\s+/g, " ").trim().slice(0, 160);
}
