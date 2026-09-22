/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/box-log-shipper.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises71 = require("node:fs/promises");
var import_node_path146 = require("node:path");
init_zod();
init_errors();
init_system_errno();
var DEFAULT_LOG_DIR = "/tmp";
var BOX_LOG_SHIP_INTERVAL_MS = 2e3;
var BOX_LOG_SHIP_PROGRESS_INTERVAL_MS = 5 * 6e4;
var DEFAULT_MAX_BYTES_PER_READ = 256 * 1024;
var DEFAULT_MAX_LINES_PER_POLL = 1e3;
var DEFAULT_MAX_LAG_BYTES = 16 * 1024 * 1024;
var DEFAULT_MAX_LINE_BYTES = 64 * 1024;
var OFFSETS_FILE_NAME = "sand-log-shipper.offsets.json";
var LOG_SUFFIX = ".log";
var BOX_TELEMETRY_SOURCE = "sand-box-telemetry";
var NEWLINE3 = 10;
var DEFAULT_SUBDIR_PATTERN = /^sand-window-/;
var DEFAULT_EXCLUDED_SOURCE_PREFIXES = ["sand-notify-injector"];
var offsetsSchema = external_exports.record(external_exports.string(), external_exports.number().nonnegative());
var memorySampleCount = external_exports.number().int().nonnegative().max(1e6);
var memorySampleKb = external_exports.number().int().nonnegative().max(2 ** 40);
var boxDisplay = external_exports.number().int().nonnegative().max(256);
var boxInfrastructureEventSchema = external_exports.discriminatedUnion("kind", [
  external_exports.object({
    kind: external_exports.literal("boot_stage"),
    stage: external_exports.enum(SAND_BOX_BOOT_STAGES),
    durationMs: external_exports.number().int().nonnegative()
  }),
  external_exports.object({
    kind: external_exports.literal("boot_failure"),
    stage: external_exports.enum(SAND_BOX_BOOT_FAILURE_STAGES),
    reason: external_exports.enum(SAND_BOX_BOOT_FAILURE_REASONS),
    durationMs: external_exports.number().int().nonnegative()
  }),
  external_exports.object({
    kind: external_exports.literal("egress_tunnel"),
    outcome: external_exports.enum(SAND_EGRESS_TUNNEL_OUTCOMES),
    attempt: external_exports.number().int().positive(),
    exitStatus: external_exports.number().int().optional(),
    runtimeS: external_exports.number().int().nonnegative().optional()
  }),
  external_exports.object({
    kind: external_exports.literal("host_boot_fetch"),
    outcome: external_exports.enum(SAND_HOST_BOOT_FETCH_OUTCOMES),
    reason: external_exports.enum(SAND_HOST_BOOT_FETCH_REASONS),
    durationMs: external_exports.number().int().nonnegative(),
    swapMs: external_exports.number().int().nonnegative().optional(),
    fromVersion: external_exports.string().regex(/^[0-9a-f]{7,40}$/).optional(),
    toVersion: external_exports.string().regex(/^[0-9a-f]{7,40}$/).optional()
  }),
  external_exports.object({
    kind: external_exports.literal("exec_daemon_restart"),
    restartAttempt: external_exports.number().int().positive(),
    runtimeS: external_exports.number().int().nonnegative(),
    cause: external_exports.enum(SAND_EXEC_DAEMON_RESTART_CAUSES),
    exitStatus: external_exports.number().int()
  }),
  external_exports.object({
    kind: external_exports.literal("supervisor_restart"),
    restartAttempt: external_exports.number().int().positive(),
    runtimeS: external_exports.number().int().nonnegative(),
    cause: external_exports.enum(SAND_SUPERVISOR_RESTART_CAUSES),
    exitStatus: external_exports.number().int()
  }),
  external_exports.object({
    kind: external_exports.literal("cookie_persist"),
    phase: external_exports.enum(SAND_COOKIE_PERSIST_PHASES),
    outcome: external_exports.enum(SAND_COOKIE_PERSIST_OUTCOMES),
    seedCookies: external_exports.number().int().nonnegative(),
    injected: external_exports.number().int().nonnegative().optional(),
    missingAfter: external_exports.number().int().nonnegative().optional(),
    attempts: external_exports.number().int().nonnegative().optional()
  }),
  external_exports.object({
    kind: external_exports.literal("process_crash"),
    binary: external_exports.enum(SAND_PROCESS_CRASH_BINARIES),
    signal: external_exports.enum(SAND_PROCESS_CRASH_SIGNALS),
    count: external_exports.number().int().positive().max(1e4)
  }),
  external_exports.object({
    kind: external_exports.literal("web_bot_auth"),
    phase: external_exports.enum(SAND_WEB_BOT_AUTH_PHASES),
    reason: external_exports.enum(SAND_WEB_BOT_AUTH_REASONS),
    count: external_exports.number().int().positive().max(1e4)
  }),
  external_exports.object({
    kind: external_exports.literal("memory_sample"),
    memTotalKb: memorySampleKb,
    memAvailableKb: memorySampleKb,
    processes: memorySampleCount,
    pssFallbackProcesses: memorySampleCount,
    chromeProcesses: memorySampleCount,
    chromeProfiles: memorySampleCount,
    chromeRenderers: memorySampleCount,
    chromeTabs: memorySampleCount,
    chromeTabsProbedProfiles: memorySampleCount,
    chromeBrowserPssKb: memorySampleKb,
    chromeRendererPssKb: memorySampleKb,
    chromeGpuPssKb: memorySampleKb,
    chromeUtilityPssKb: memorySampleKb,
    chromeOtherPssKb: memorySampleKb,
    chromeRendererMaxPssKb: memorySampleKb,
    hostPssKb: memorySampleKb,
    desktopPssKb: memorySampleKb,
    otherPssKb: memorySampleKb
  }),
  external_exports.object({
    kind: external_exports.literal("chrome_profile_sample"),
    display: boxDisplay,
    processes: memorySampleCount,
    renderers: memorySampleCount,
    tabs: memorySampleCount.optional(),
    pssKb: memorySampleKb,
    rendererMaxPssKb: memorySampleKb,
    cpuMillicores: memorySampleCount.optional()
  }),
  external_exports.object({
    kind: external_exports.literal("chrome_launch"),
    display: boxDisplay,
    mode: external_exports.enum(SAND_CHROME_LAUNCH_MODES),
    attempt: external_exports.number().int().positive().max(1e6),
    outcome: external_exports.enum(SAND_CHROME_LAUNCH_OUTCOMES),
    durationMs: external_exports.number().int().nonnegative().max(6e5)
  })
]);
var BoxLogShipper = class {
  reportHostLog;
  reportBatch;
  reportBoxLogShip;
  skip;
  excludeSourcePrefixes;
  logDir;
  subdirPattern;
  polling;
  clock;
  maxBytesPerReadPerFile;
  maxLinesPerPoll;
  maxLagBytes;
  maxLineBytes;
  offsetsPath;
  writeOffsets;
  openFile;
  statFile;
  offsets = /* @__PURE__ */ new Map();
  pumpFailedPaths = /* @__PURE__ */ new Set();
  pendingDeliveryWindows = /* @__PURE__ */ new Map();
  pendingWindowStartedAtMs = /* @__PURE__ */ new Map();
  statFailedPaths = /* @__PURE__ */ new Set();
  pollingHandle;
  activePoll;
  hasLoadedOffsets = false;
  isDisposed = false;
  isOffsetsDirty = false;
  offsetsRevision = 0;
  lastProgressReportAtMs;
  offsetSaveFailure;
  pumpFailure;
  constructor(deps) {
    this.reportHostLog = deps.reportHostLog;
    this.reportBatch = deps.reportBatch;
    this.reportBoxLogShip = deps.reportBoxLogShip;
    this.logDir = deps.logDir ?? DEFAULT_LOG_DIR;
    this.skip = new Set(deps.skipPaths ?? []);
    this.excludeSourcePrefixes = deps.excludeSourcePrefixes ?? DEFAULT_EXCLUDED_SOURCE_PREFIXES;
    this.subdirPattern = deps.subdirPattern ?? DEFAULT_SUBDIR_PATTERN;
    this.polling = deps.polling;
    this.clock = deps.clock;
    this.maxBytesPerReadPerFile = deps.maxBytesPerReadPerFile ?? DEFAULT_MAX_BYTES_PER_READ;
    this.maxLinesPerPoll = deps.maxLinesPerPoll ?? DEFAULT_MAX_LINES_PER_POLL;
    this.maxLagBytes = deps.maxLagBytes ?? DEFAULT_MAX_LAG_BYTES;
    this.maxLineBytes = deps.maxLineBytes ?? DEFAULT_MAX_LINE_BYTES;
    this.offsetsPath = deps.offsetsPath ?? (0, import_node_path146.join)(this.logDir, OFFSETS_FILE_NAME);
    this.writeOffsets = deps.writeOffsets ?? writeFileAtomic;
    this.openFile = deps.openFile ?? import_promises71.open;
    this.statFile = deps.statFile ?? import_promises71.stat;
  }
  async start() {
    await this.loadOffsets();
    this.hasLoadedOffsets = true;
    let first = true;
    let resolveFirst = () => {
    };
    const firstPoll = new Promise((resolve29) => {
      resolveFirst = resolve29;
    });
    this.pollingHandle = this.polling.start(async () => {
      try {
        await this.poll();
      } catch (error42) {
        this.reportHostLog("error", `[sand-log-shipper] poll failed: ${errorLogTag(error42)}`);
      } finally {
        if (first) {
          first = false;
          resolveFirst();
        }
      }
    });
    await firstPoll;
  }
  async dispose() {
    await this.stopPolling();
    await this.saveOffsets();
  }
  async checkpointOffsets() {
    await this.saveOffsets(true);
  }
  async stopPolling() {
    this.isDisposed = true;
    this.pollingHandle?.dispose();
    this.pollingHandle = void 0;
    await this.activePoll;
  }
  async poll() {
    if (this.activePoll !== void 0 || this.isDisposed) return;
    const activePoll = this.pollOnce();
    this.activePoll = activePoll;
    try {
      await activePoll;
    } finally {
      if (this.activePoll === activePoll) {
        this.activePoll = void 0;
      }
    }
  }
  async pollOnce() {
    const listing = await this.listLogFiles();
    const snapshot = await this.snapshotLogFileSizes(listing);
    this.reconcileTruncatedOffsets(snapshot.files);
    let budget = this.maxLinesPerPoll;
    for (const file2 of snapshot.files) {
      if (budget <= 0) break;
      try {
        budget -= await this.pumpFile(file2, budget);
        this.pumpFailedPaths.delete(file2.path);
      } catch (error42) {
        this.pumpFailedPaths.add(file2.path);
        this.notePumpFailed(error42, 1);
      }
    }
    if (snapshot.complete && this.pumpFailedPaths.size > 0) {
      const listedPaths = /* @__PURE__ */ new Set();
      for (const file2 of snapshot.files) listedPaths.add(file2.path);
      for (const failedPath of this.pumpFailedPaths) {
        if (!listedPaths.has(failedPath)) this.pumpFailedPaths.delete(failedPath);
      }
    }
    if (this.pumpFailedPaths.size === 0) this.notePumpSucceeded();
    if (this.isOffsetsDirty) await this.saveOffsets();
    if (snapshot.complete) this.maybeReportProgress(snapshot.files);
    this.maybeRetryOffsetSaveFailure();
  }
  async listLogFiles() {
    const files = [];
    let complete = true;
    let entries;
    try {
      entries = await (0, import_promises71.readdir)(this.logDir, { withFileTypes: true });
    } catch (error42) {
      reportFallbackUnlessAbsent("box_log_shipper", error42);
      return { files, complete: false };
    }
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(LOG_SUFFIX)) {
        const path31 = (0, import_node_path146.join)(this.logDir, entry.name);
        const source = toSourceName(entry.name);
        if (!this.skip.has(path31) && !this.isExcludedSource(source)) {
          files.push({ path: path31, source });
        }
      } else if (entry.isDirectory() && this.subdirPattern.test(entry.name)) {
        const subdir = (0, import_node_path146.join)(this.logDir, entry.name);
        let subEntries;
        try {
          subEntries = await (0, import_promises71.readdir)(subdir, { withFileTypes: true });
        } catch {
          complete = false;
          continue;
        }
        for (const sub of subEntries) {
          if (!sub.isFile() || !sub.name.endsWith(LOG_SUFFIX)) continue;
          const path31 = (0, import_node_path146.join)(subdir, sub.name);
          const leaf = toSourceName(sub.name);
          if (this.skip.has(path31) || this.isExcludedSource(leaf)) continue;
          files.push({ path: path31, source: `${entry.name}/${leaf}` });
        }
      }
    }
    return { files, complete };
  }
  async snapshotLogFileSizes(listing) {
    const files = [];
    let complete = listing.complete;
    for (const file2 of listing.files) {
      let fileStat;
      try {
        fileStat = await this.statFile(file2.path);
      } catch (error42) {
        complete = false;
        if (findSystemErrno(error42) !== "ENOENT" && !this.statFailedPaths.has(file2.path)) {
          this.statFailedPaths.add(file2.path);
          this.reportHostLog(
            "error",
            `[sand-log-shipper] stat failed for ${file2.source} (${errorLogTag(error42)})`
          );
        }
        continue;
      }
      this.statFailedPaths.delete(file2.path);
      if (fileStat.isFile()) {
        files.push({ ...file2, size: fileStat.size });
      }
    }
    return { files, complete };
  }
  isExcludedSource(leaf) {
    return this.excludeSourcePrefixes.some((prefix) => leaf.startsWith(prefix));
  }
  reconcileTruncatedOffsets(files) {
    for (const file2 of files) {
      const offset = this.offsets.get(file2.path);
      if (offset !== void 0 && file2.size < offset) {
        const pending = this.pendingDeliveryWindows.get(file2.path);
        if (pending === void 0) {
          this.pendingWindowStartedAtMs.delete(file2.path);
        } else {
          pending.invalidated = true;
        }
        this.setOffset(file2.path, 0);
      }
    }
  }
  async pumpFile(file2, budget) {
    const { path: path31, source, size } = file2;
    if (this.pendingDeliveryWindows.has(path31)) return 0;
    let from2 = this.offsets.get(path31) ?? 0;
    if (size <= from2) {
      this.pendingWindowStartedAtMs.delete(path31);
      return 0;
    }
    let processed = 0;
    let candidateEndOffset = from2;
    const records2 = [];
    if (size - from2 > this.maxLagBytes) {
      const jumped = size - this.maxBytesPerReadPerFile;
      records2.push({
        kind: "log",
        source,
        line: `[sand-log-shipper] skipped ${jumped - from2} bytes (too far behind)`
      });
      processed += 1;
      from2 = jumped;
      candidateEndOffset = jumped;
    }
    const length = Math.min(size - from2, this.maxBytesPerReadPerFile);
    const buffer = Buffer.alloc(length);
    let bytesRead = 0;
    const handle = await this.openFile(path31, "r");
    try {
      ({ bytesRead } = await handle.read(buffer, 0, length, from2));
    } finally {
      await handle.close();
    }
    if (bytesRead <= 0) {
      this.reportDeliveryWindow(path31, candidateEndOffset, records2);
      return processed;
    }
    const chunk = buffer.subarray(0, bytesRead);
    const lastNewline = chunk.lastIndexOf(NEWLINE3);
    if (lastNewline === -1) {
      if (from2 + bytesRead < size) {
        const record2 = this.toTelemetryRecord({
          source,
          line: chunk.subarray(0, this.maxLineBytes).toString("utf8")
        });
        if (record2 !== void 0) records2.push(record2);
        candidateEndOffset = from2 + bytesRead;
        processed += 1;
      }
      this.reportDeliveryWindow(path31, candidateEndOffset, records2);
      return processed;
    }
    let cursor = 0;
    while (processed < budget) {
      const newline = chunk.indexOf(NEWLINE3, cursor);
      if (newline === -1 || newline > lastNewline) break;
      let line = chunk.subarray(cursor, newline).toString("utf8");
      cursor = newline + 1;
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.length > 0) {
        const record2 = this.toTelemetryRecord({ source, line });
        if (record2 !== void 0) records2.push(record2);
        processed += 1;
      }
    }
    candidateEndOffset = from2 + cursor;
    this.reportDeliveryWindow(path31, candidateEndOffset, records2);
    return processed;
  }
  toTelemetryRecord(entry) {
    if (entry.source !== BOX_TELEMETRY_SOURCE) {
      return { kind: "log", ...entry };
    }
    let value;
    try {
      value = JSON.parse(entry.line);
    } catch {
      return;
    }
    const parsed2 = boxInfrastructureEventSchema.safeParse(value);
    return parsed2.success ? { kind: "infrastructure", event: parsed2.data } : void 0;
  }
  reportDeliveryWindow(path31, candidateEndOffset, records2) {
    if (records2.length === 0) {
      this.setOffset(path31, candidateEndOffset);
      return;
    }
    const window2 = {
      candidateEndOffset,
      unsettledRecordCount: records2.length,
      didDropRecord: false,
      invalidated: false
    };
    if (!this.pendingWindowStartedAtMs.has(path31)) {
      this.pendingWindowStartedAtMs.set(path31, this.clock.monotonicNow());
    }
    this.pendingDeliveryWindows.set(path31, window2);
    this.reportBatch(records2, (settlement) => this.settleDeliveryWindow(path31, window2, settlement));
  }
  settleDeliveryWindow(path31, window2, settlement) {
    window2.unsettledRecordCount -= 1;
    if (settlement === "dropped") {
      window2.didDropRecord = true;
    }
    if (window2.unsettledRecordCount > 0) return;
    this.pendingDeliveryWindows.delete(path31);
    if (!window2.didDropRecord && !window2.invalidated) {
      this.setOffset(path31, window2.candidateEndOffset);
    }
  }
  setOffset(path31, offset) {
    const previous = this.offsets.get(path31);
    if (previous === offset) return;
    this.offsets.set(path31, offset);
    if (offset > (previous ?? 0)) {
      this.pendingWindowStartedAtMs.delete(path31);
    }
    this.isOffsetsDirty = true;
    this.offsetsRevision += 1;
  }
  async loadOffsets() {
    const raw = await (0, import_promises71.readFile)(this.offsetsPath, "utf8").catch((error42) => {
      if (findSystemErrno(error42) !== "ENOENT") {
        this.reportHostLog(
          "error",
          `[sand-log-shipper] offsets read failed (${errorLogTag(error42)})`
        );
      }
      return null;
    });
    if (raw === null) return;
    let parsed2;
    try {
      parsed2 = offsetsSchema.safeParse(JSON.parse(raw));
    } catch {
      return;
    }
    if (!parsed2.success) return;
    for (const [path31, offset] of Object.entries(parsed2.data)) {
      this.offsets.set(path31, offset);
    }
  }
  async saveOffsets(force = false) {
    if (!this.hasLoadedOffsets || !force && !this.isOffsetsDirty) return;
    const revision = this.offsetsRevision;
    const record2 = {};
    for (const [path31, offset] of this.offsets) record2[path31] = offset;
    try {
      await this.writeOffsets(this.offsetsPath, Buffer.from(JSON.stringify(record2)));
      if (this.offsetsRevision === revision) {
        this.isOffsetsDirty = false;
        this.noteOffsetSaveSucceeded();
      }
    } catch (error42) {
      this.isOffsetsDirty = true;
      this.noteOffsetSaveFailed(error42);
    }
  }
  maybeReportProgress(files) {
    const now = this.clock.monotonicNow();
    if (this.lastProgressReportAtMs !== void 0 && now - this.lastProgressReportAtMs < BOX_LOG_SHIP_PROGRESS_INTERVAL_MS) {
      return;
    }
    let bytesWritten = 0;
    let bytesDelivered = 0;
    for (const file2 of files) {
      bytesWritten = saturatingAdd(bytesWritten, file2.size);
      bytesDelivered = saturatingAdd(
        bytesDelivered,
        Math.min(file2.size, this.offsets.get(file2.path) ?? 0)
      );
    }
    let oldestPendingWindowAgeMs = 0;
    for (const startedAtMs of this.pendingWindowStartedAtMs.values()) {
      oldestPendingWindowAgeMs = Math.max(
        oldestPendingWindowAgeMs,
        toNonnegativeSafeInteger(now - startedAtMs)
      );
    }
    this.lastProgressReportAtMs = now;
    this.reportBoxLogShip({
      kind: "progress",
      bytesWritten,
      bytesDelivered,
      pendingWindowCount: toNonnegativeSafeInteger(this.pendingWindowStartedAtMs.size),
      oldestPendingWindowAgeMs
    });
  }
  notePumpFailed(error42, failureCount) {
    const errorClass = classifyOffsetSaveError(error42);
    const failure2 = this.pumpFailure;
    if (failure2 !== void 0) {
      failure2.errorClass = errorClass;
      failure2.failureCount = saturatingAdd(failure2.failureCount, failureCount);
      return;
    }
    this.pumpFailure = { errorClass, failureCount };
    this.reportBoxLogShip({ kind: "pump_failed", errorClass, failureCount });
  }
  notePumpSucceeded() {
    const failure2 = this.pumpFailure;
    if (failure2 === void 0) return;
    this.pumpFailure = void 0;
    this.reportBoxLogShip({
      kind: "pump_recovered",
      errorClass: failure2.errorClass,
      failureCount: failure2.failureCount
    });
  }
  maybeRetryOffsetSaveFailure() {
    const failure2 = this.offsetSaveFailure;
    if (failure2?.reportState.kind === "waiting_for_retry" && this.clock.monotonicNow() >= failure2.reportState.retryAtMs) {
      this.reportOffsetSaveFailure(failure2);
    }
  }
  noteOffsetSaveFailed(error42) {
    const errorClass = classifyOffsetSaveError(error42);
    const failure2 = this.offsetSaveFailure;
    if (failure2 !== void 0) {
      failure2.errorClass = errorClass;
      failure2.failureCount = saturatingAdd(failure2.failureCount, 1);
      return;
    }
    const next = {
      errorClass,
      failureCount: 1,
      reportState: { kind: "in_flight" }
    };
    this.offsetSaveFailure = next;
    this.reportOffsetSaveFailure(next);
  }
  reportOffsetSaveFailure(failure2) {
    failure2.reportState = { kind: "in_flight" };
    this.reportBoxLogShip(
      {
        kind: "save_failed",
        errorClass: failure2.errorClass,
        failureCount: failure2.failureCount
      },
      (settlement) => {
        if (this.offsetSaveFailure !== failure2 || failure2.reportState.kind !== "in_flight") {
          return;
        }
        failure2.reportState = settlement === "delivered" ? { kind: "delivered" } : {
          kind: "waiting_for_retry",
          retryAtMs: this.clock.monotonicNow() + BOX_LOG_SHIP_PROGRESS_INTERVAL_MS
        };
      }
    );
  }
  noteOffsetSaveSucceeded() {
    const failure2 = this.offsetSaveFailure;
    if (failure2 === void 0) return;
    this.offsetSaveFailure = void 0;
    this.reportBoxLogShip({
      kind: "save_recovered",
      errorClass: failure2.errorClass,
      failureCount: failure2.failureCount
    });
  }
};
function toSourceName(fileName) {
  return fileName.endsWith(LOG_SUFFIX) ? fileName.slice(0, -LOG_SUFFIX.length) : fileName;
}
function classifyOffsetSaveError(error42) {
  switch (findSystemErrno(error42)) {
    case "ENOSPC":
    case "EDQUOT":
      return "no_space";
    case "EACCES":
    case "EPERM":
      return "permission_denied";
    case "EROFS":
      return "read_only";
    case "ENOENT":
      return "missing_parent";
    case void 0:
      return "unknown";
    default:
      return "io";
  }
}
function saturatingAdd(total, value) {
  const boundedValue = toNonnegativeSafeInteger(value);
  return total >= Number.MAX_SAFE_INTEGER - boundedValue ? Number.MAX_SAFE_INTEGER : total + boundedValue;
}
function toNonnegativeSafeInteger(value) {
  if (!Number.isFinite(value)) return Number.MAX_SAFE_INTEGER;
  return Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.round(value)));
}

