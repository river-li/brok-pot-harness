/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/loopback-sand-box.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
var import_promises52 = require("node:fs/promises");
var import_node_os24 = require("node:os");
var import_node_path109 = require("node:path");
var import_promises53 = require("node:timers/promises");
init_dist2();
init_dist2();
init_dist4();

// @recovered-fragment 2/3
init_system_errno();

// @recovered-fragment 3/3
var EXEC_DAEMON_PORT = SAND_BOX_PORTS.primaryExecDaemon;
var VNC_PORT = SAND_BOX_PRIMARY_NOVNC_PORT;
var DEFAULT_AUTH_TOKEN = "local";
var DAEMON_READY_TIMEOUT_MS = 9e4;
var DAEMON_WATCHDOG_INTERVAL_MS = 3e4;
function resolveVncBaseUrl(envName, fallback) {
  if (process.env.GROKBOT_REMOTE_SERVER_MODE !== "1") return fallback;
  try {
    const url = new URL(process.env[envName] ?? "");
    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (url.protocol !== "http:" || !["127.0.0.1", "localhost", "::1"].includes(hostname)) return "";
    return url.origin;
  } catch {
    return "";
  }
}
var LoopbackSandBox = class {
  host;
  authToken;
  telemetry = createNoopSandTelemetry();
  hasTelemetry = false;
  readyTimeoutMs;
  pollIntervalMs;
  watchdogIntervalMs;
  protectedBoxPaths;
  terminalsFolder;
  daemonWatchdogStarted = false;
  daemonWatchdogAbort = new AbortController();
  daemonWatchdogRun;
  daemonWatchdogPoll;
  daemonForegroundReadyWaits = 0;
  daemonWatchdogState;
  daemonWatchdogUnreadySince;
  daemonWatchdogUnreadyAttempts = 0;
  windowConnections = /* @__PURE__ */ new Map();
  createRemoteAccessor;
  runStartWindow;
  uploadFileViaExecDaemon;
  pingBox;
  pingBoxClassified;
  constructor(options2 = {}) {
    this.host = options2.host ?? "127.0.0.1";
    this.authToken = options2.authToken ?? DEFAULT_AUTH_TOKEN;
    if (options2.telemetry !== void 0) {
      this.setTelemetry(options2.telemetry);
    }
    this.readyTimeoutMs = options2.readyTimeoutMs ?? DAEMON_READY_TIMEOUT_MS;
    this.pollIntervalMs = options2.pollIntervalMs ?? 500;
    this.watchdogIntervalMs = options2.watchdogIntervalMs ?? DAEMON_WATCHDOG_INTERVAL_MS;
    this.protectedBoxPaths = options2.protectedBoxPaths ?? [];
    const cursorDataDir = options2.cursorDataDir?.trim();
    this.terminalsFolder = (0, import_node_path109.join)(
      cursorDataDir != null && cursorDataDir.length > 0 ? cursorDataDir : (0, import_node_path109.join)(options2.homeDir ?? (0, import_node_os24.homedir)(), ".cursor"),
      "projects",
      "workspace",
      "terminals"
    );
    this.createRemoteAccessor = options2.createRemoteAccessor ?? createBoxRemoteResourceAccessor;
    this.runStartWindow = options2.runStartWindow ?? runStartWindow;
    this.uploadFileViaExecDaemon = options2.uploadFileViaExecDaemon ?? uploadFileViaExecDaemon;
    this.pingBox = options2.pingBox ?? pingBox;
    this.pingBoxClassified = options2.pingBoxClassified ?? pingBoxClassified;
  }
  setTelemetry(telemetry) {
    this.telemetry = telemetry;
    this.hasTelemetry = true;
  }
  async assertFileReadAllowed(boxPath) {
    await assertPathOutsideProtectedRoots(this.protectedBoxPaths, boxPath, "/workspace");
  }
  protectRemoteAccessor(remoteAccessor) {
    return new CombinedResourceAccessor(remoteAccessor, [
      resourceEntry(readExecutorResource, {
        execute: async (ctx, args, options2) => {
          await this.assertFileReadAllowed(args.path);
          return await remoteAccessor.get(readExecutorResource).execute(ctx, args, options2);
        }
      })
    ]);
  }
  describe() {
    return { backend: "loopback" };
  }
  getTerminalsFolder() {
    return this.terminalsFolder;
  }
  async isAvailable() {
    return true;
  }
  primaryEndpoint() {
    return {
      host: this.host,
      port: EXEC_DAEMON_PORT,
      authToken: this.authToken
    };
  }
  async ensureReady(_ctx, _agentId) {
    const endpoint = this.primaryEndpoint();
    await this.waitUntilReady(_ctx, endpoint);
    const vncBaseUrl = resolveVncBaseUrl("SAND_REMOTE_VNC_PRIMARY_URL", `http://${this.host}:${VNC_PORT}`);
    return {
      remoteAccessor: this.protectRemoteAccessor(this.createRemoteAccessor(endpoint)),
      vncUrl: vncBaseUrl.length === 0 ? "" : `${vncBaseUrl}/vnc.html`,
      terminalsFolder: this.terminalsFolder
    };
  }
  async applyEnvironment(ctx, update) {
    const endpoint = this.primaryEndpoint();
    await this.waitUntilReady(ctx, endpoint);
    await applyBoxEnvironmentViaTransport(ctx, createBoxTransport(endpoint), update);
  }
  async loadMcpServers(ctx, configJson) {
    const endpoint = this.primaryEndpoint();
    await this.waitUntilReady(ctx, endpoint);
    return await loadBoxMcpServersViaTransport(ctx, createBoxTransport(endpoint), configJson);
  }
  async mcpResourceAccessor(ctx) {
    const endpoint = this.primaryEndpoint();
    await this.waitUntilReady(ctx, endpoint);
    return this.createRemoteAccessor(endpoint);
  }
  maxWindows() {
    return SAND_BOX_MAX_WINDOWS;
  }
  async ensureWindow(ctx, agentId, windowIndex, opts) {
    if (isPrimaryWindowIndex(windowIndex)) {
      return primarySandBoxWindow(await this.ensureReady(ctx, agentId));
    }
    const ownerToken = opts?.ownerToken;
    const key = sandBoxWindowKey(agentId, windowIndex);
    const cached2 = this.windowConnections.get(key);
    if (cached2 !== void 0 && cached2.ownerToken === ownerToken && await this.pingBox(ctx, cached2.endpoint)) {
      return cached2.window;
    }
    this.windowConnections.delete(key);
    const primary = await this.ensureReady(ctx, agentId);
    await this.runStartWindow(ctx, primary.remoteAccessor, windowIndex, ownerToken);
    const token = String(windowIndex);
    const headers = {
      [SAND_BOX_DISPLAY_HEADER]: token
    };
    if (ownerToken !== void 0) {
      headers[SAND_BOX_WINDOW_OWNER_HEADER] = ownerToken;
    }
    const endpoint = {
      host: this.host,
      port: SAND_BOX_PORTS.windowRouter,
      authToken: this.authToken,
      headers
    };
    await this.waitUntilReady(ctx, endpoint);
    const forkVncBaseUrl = resolveVncBaseUrl("SAND_REMOTE_VNC_FORK_URL", `http://${this.host}:${SAND_BOX_FORK_NOVNC_PORT}`);
    const window2 = {
      windowIndex,
      computerUse: this.protectRemoteAccessor(this.createRemoteAccessor(endpoint)),
      vncUrl: forkVncBaseUrl.length === 0 ? "" : `${forkVncBaseUrl}/vnc.html?path=${encodeURIComponent(
        `websockify?token=${token}`
      )}`,
      mcp: createWindowMcpHost({
        loadMcpServers: (loadCtx, configJson) => loadBoxMcpServersViaTransport(loadCtx, createBoxTransport(endpoint), configJson),
        mcpResourceAccessor: async () => this.createRemoteAccessor(endpoint)
      })
    };
    this.windowConnections.set(key, { window: window2, endpoint, ownerToken });
    return window2;
  }
  async releaseWindow(ctx, agentId, windowIndex) {
    if (windowIndex == null || isPrimaryWindowIndex(windowIndex)) {
      return;
    }
    this.windowConnections.delete(sandBoxWindowKey(agentId, windowIndex));
    try {
      const primary = await this.ensureReady(ctx, agentId);
      await runStopWindow(ctx, primary.remoteAccessor, windowIndex);
    } catch {
    }
  }
  async hibernate(_ctx, agentId) {
    clearAgentWindowConnections(this.windowConnections, agentId);
  }
  async runState(_ctx, _agentId) {
    return "running";
  }
  async listBoxes() {
    return [{ agentId: "", running: true }];
  }
  async dispose() {
    this.daemonWatchdogAbort.abort();
    await this.daemonWatchdogRun;
  }
  async uploadFile(ctx, agentId, boxPath, data) {
    const connection = await this.ensureReady(ctx, agentId);
    await this.uploadFileViaExecDaemon(
      ctx,
      connection.remoteAccessor,
      resolveBoxWorkspacePath(boxPath),
      data
    );
  }
  async downloadFile(_ctx, _agentId, boxPath, options2) {
    const resolvedPath = resolveBoxWorkspacePath(boxPath);
    await this.assertFileReadAllowed(resolvedPath);
    try {
      if (options2?.maxBytes != null) {
        const size = (await (0, import_promises52.stat)(resolvedPath)).size;
        if (size > options2.maxBytes) {
          throw new BoxFileTooLargeError(
            `download from box ${resolvedPath} refused: ${size} bytes is over the ${options2.maxBytes}-byte limit`
          );
        }
      }
      return await (0, import_promises52.readFile)(resolvedPath);
    } catch (error42) {
      if (findSystemErrno(error42) === "ENOENT") {
        throw new BoxFileUnreadableError(
          `download from box ${resolvedPath} failed (file missing)`,
          { cause: error42 }
        );
      }
      throw error42;
    }
  }
  async waitUntilReady(ctx, endpoint, timeoutMs = this.readyTimeoutMs) {
    if (endpoint.port !== EXEC_DAEMON_PORT) {
      return await this.waitUntilReadyUncoordinated(ctx, endpoint, timeoutMs);
    }
    this.daemonForegroundReadyWaits += 1;
    try {
      await this.daemonWatchdogPoll;
      return await this.waitUntilReadyUncoordinated(ctx, endpoint, timeoutMs);
    } finally {
      this.daemonForegroundReadyWaits -= 1;
    }
  }
  async waitUntilReadyUncoordinated(ctx, endpoint, timeoutMs) {
    const start = Date.now();
    const target = `${endpoint.host}:${endpoint.port}`;
    let attempts2 = 0;
    let last;
    let unreadySince;
    while (Date.now() - start < timeoutMs) {
      attempts2 += 1;
      last = await this.pingBoxClassified(ctx, endpoint);
      if (last.outcome === "ok") {
        const isPrimary = endpoint.port === EXEC_DAEMON_PORT;
        const watchdogObservedOutage = isPrimary && this.daemonWatchdogState === "unready";
        if (attempts2 > 1 || watchdogObservedOutage) {
          const episodeStart = watchdogObservedOutage ? this.daemonWatchdogUnreadySince ?? start : unreadySince ?? start;
          this.telemetry.reportDaemonPing({
            outcome: "ok",
            attempts: watchdogObservedOutage ? this.daemonWatchdogUnreadyAttempts + attempts2 : attempts2,
            durationMs: Date.now() - (watchdogObservedOutage ? episodeStart : start),
            unreadyDurationMs: Date.now() - episodeStart,
            readinessState: "ready_after_retry",
            target
          });
        }
        if (isPrimary) {
          this.daemonWatchdogState = "ready";
          this.daemonWatchdogUnreadySince = void 0;
          this.daemonWatchdogUnreadyAttempts = 0;
          this.startDaemonWatchdog(endpoint);
        }
        return;
      }
      unreadySince ??= Date.now();
      await (0, import_promises53.setTimeout)(this.pollIntervalMs);
    }
    const outcome = last == null || last.outcome === "ok" ? "refused" : last.outcome;
    this.telemetry.reportDaemonPing({
      outcome,
      attempts: attempts2,
      durationMs: Date.now() - start,
      unreadyDurationMs: Date.now() - (unreadySince ?? start),
      readinessState: daemonPingReadinessState(outcome),
      target,
      causeSummary: last?.causeSummary
    });
    if (endpoint.port === EXEC_DAEMON_PORT && this.daemonWatchdogStarted) {
      if (this.daemonWatchdogState === "ready") {
        this.daemonWatchdogUnreadySince = unreadySince ?? start;
        this.daemonWatchdogUnreadyAttempts = attempts2;
      } else {
        this.daemonWatchdogUnreadyAttempts += attempts2;
      }
      this.daemonWatchdogState = "unready";
    }
    throw new SandBoxDaemonUnreachableError(
      outcome,
      `loopback sand box exec-daemon at ${target} not ready within ${timeoutMs}ms (last ping: ${outcome}${last?.causeSummary != null ? ` [${last.causeSummary}]` : ""})`
    );
  }
  startDaemonWatchdog(endpoint) {
    if (!this.hasTelemetry || this.daemonWatchdogStarted || this.watchdogIntervalMs <= 0) {
      return;
    }
    this.daemonWatchdogState = "ready";
    this.daemonWatchdogStarted = true;
    this.daemonWatchdogRun = this.runDaemonWatchdog(endpoint);
  }
  async runDaemonWatchdog(endpoint) {
    try {
      while (!this.daemonWatchdogAbort.signal.aborted) {
        await (0, import_promises53.setTimeout)(this.watchdogIntervalMs, void 0, {
          ref: false,
          signal: this.daemonWatchdogAbort.signal
        });
        if (this.daemonForegroundReadyWaits > 0) continue;
        const poll = this.pollDaemonWatchdog(endpoint);
        this.daemonWatchdogPoll = poll;
        try {
          await poll;
        } finally {
          if (this.daemonWatchdogPoll === poll) {
            this.daemonWatchdogPoll = void 0;
          }
        }
      }
    } catch (error42) {
      if (!this.daemonWatchdogAbort.signal.aborted) throw error42;
    }
  }
  async pollDaemonWatchdog(endpoint) {
    const pollStartedAt = Date.now();
    const result = await this.pingBoxClassified(createContext(), endpoint);
    const now = Date.now();
    if (result.outcome === "ok") {
      if (this.daemonWatchdogState === "unready") {
        const unreadySince = this.daemonWatchdogUnreadySince ?? pollStartedAt;
        this.telemetry.reportDaemonPing({
          outcome: "ok",
          attempts: this.daemonWatchdogUnreadyAttempts + 1,
          durationMs: now - unreadySince,
          unreadyDurationMs: now - unreadySince,
          readinessState: "ready_after_retry",
          target: `${endpoint.host}:${endpoint.port}`
        });
      }
      this.daemonWatchdogState = "ready";
      this.daemonWatchdogUnreadySince = void 0;
      this.daemonWatchdogUnreadyAttempts = 0;
      return;
    }
    if (this.daemonWatchdogState === "ready") {
      this.daemonWatchdogState = "unready";
      this.daemonWatchdogUnreadySince = pollStartedAt;
      this.daemonWatchdogUnreadyAttempts = 1;
      this.telemetry.reportDaemonPing({
        outcome: result.outcome,
        attempts: 1,
        durationMs: now - pollStartedAt,
        unreadyDurationMs: now - pollStartedAt,
        readinessState: daemonPingReadinessState(result.outcome),
        target: `${endpoint.host}:${endpoint.port}`,
        causeSummary: result.causeSummary
      });
    } else {
      this.daemonWatchdogUnreadyAttempts += 1;
    }
  }
};
function daemonPingReadinessState(outcome) {
  if (outcome === "refused") return "up_but_exec_refused";
  if (outcome === "timeout") return "up_but_exec_unresponsive";
  return "up_but_exec_disconnected";
}

