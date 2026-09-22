var SOFT_LIMIT_DEFAULT_BYTES = 256 * 1024 * 1024;
var HARD_LIMIT_DEFAULT_BYTES = 1024 * 1024 * 1024;
var GC_PENDING_WRITE_RETENTION_MS = 6e4;
var SOFT_GC_MIN_INTERVAL_MS = 30 * 6e4;
var pinnedConversationEnvironment = {
  softLimitBytes: void 0,
  hardLimitBytes: void 0,
  gc: void 0
};
function pinConversationEnvironment(environment) {
  pinnedConversationEnvironment = environment;
}
var pinnedSizeLimitsReader = null;
function pinConversationSizeLimitsReader(reader) {
  pinnedSizeLimitsReader = reader;
}
function configuredLimitBytes(field) {
  const megabytes = pinnedSizeLimitsReader?.()[field];
  if (megabytes == null || !Number.isFinite(megabytes) || megabytes <= 0) return void 0;
  return Math.floor(megabytes * 1024 * 1024);
}
function conversationSoftLimitBytes() {
  return pinnedConversationEnvironment.softLimitBytes ?? configuredLimitBytes("soft_limit_mb") ?? SOFT_LIMIT_DEFAULT_BYTES;
}
function conversationHardLimitBytes() {
  return pinnedConversationEnvironment.hardLimitBytes ?? configuredLimitBytes("hard_limit_mb") ?? HARD_LIMIT_DEFAULT_BYTES;
}
var pinnedConversationGcEnabled = false;
function pinConversationGc(enabled) {
  pinnedConversationGcEnabled = enabled;
}
var pinnedConversationGcReporter = null;
function pinConversationGcReporter(reporter) {
  pinnedConversationGcReporter = reporter;
}
function reportConversationGcVerdict(trigger2, dbPath, verdict, stillOverCap = false) {
  const agentId = (0, import_node_path131.basename)((0, import_node_path131.dirname)(dbPath));
  if (verdict == null) {
    pinnedConversationGcReporter?.({ trigger: trigger2, agentId, outcome: "skipped", skipReason: "no-root" });
    return;
  }
  if (verdict.outcome === "failed") {
    pinnedConversationGcReporter?.({ trigger: trigger2, agentId, outcome: "failed" });
    return;
  }
  if (verdict.outcome === "skipped") {
    pinnedConversationGcReporter?.({
      trigger: trigger2,
      agentId,
      outcome: "skipped",
      skipReason: verdict.reason,
      ...verdict.unresolvedProtoRefs !== void 0 ? { unresolvedProtoRefs: verdict.unresolvedProtoRefs } : {}
    });
    return;
  }
  pinnedConversationGcReporter?.({
    trigger: trigger2,
    agentId,
    outcome: "collected",
    deletedRows: verdict.deletedRows,
    deletedBytes: verdict.deletedBytes,
    liveRows: verdict.liveRows,
    liveBytes: verdict.liveBytes,
    liveBytesByType: verdict.liveBytesByType,
    vacuumed: verdict.vacuumed,
    stillOverCap
  });
}
function isConversationGcEnabled() {
  return pinnedConversationEnvironment.gc ?? pinnedConversationGcEnabled;
}
var SandConversationTooLargeError = class extends SandDomainError {
  name = "SandConversationTooLargeError";
  isConversationTooLarge = true;
  constructor(sizeBytes, limitBytes) {
    super(
      `This conversation's stored state is ${Math.round(sizeBytes / (1024 * 1024))} MB, over the ${Math.round(limitBytes / (1024 * 1024))} MB limit, and compaction could not shrink it. Start a new conversation with this agent to continue.`
    );
  }
};
async function measureConversationBlobBytes(blobDbPath) {
  let total = 0;
  for (const path31 of [blobDbPath, `${blobDbPath}-wal`]) {
    total += await (0, import_promises63.stat)(path31).then(
      (stats) => stats.size,
      () => 0
    );
  }
  return total;
}
var softGcStateByBlobDbPath = /* @__PURE__ */ new Map();
function blobDbPathFor(dbPath) {
  return (0, import_node_path131.join)((0, import_node_path131.dirname)(dbPath), CONVERSATION_BLOBS_FILENAME);
}
async function runConversationGc(host, dbPath, db) {
  const liveRootBlobId = db.get("latestRootBlobId");
  if (liveRootBlobId.length === 0) return null;
  return await host.requireWorkerPool().collectConversationGarbage({
    agentId: (0, import_node_path131.basename)((0, import_node_path131.dirname)(dbPath)),
    blobDbPath: blobDbPathFor(dbPath),
    retainedRootIdHex: toHex3(liveRootBlobId),
    pendingWriteRetentionMs: GC_PENDING_WRITE_RETENTION_MS,
    legacyBlobDbPath: dbPath
  });
}
function scheduleConversationSizeMaintenance(host, dbPath, db) {
  if (!isConversationGcEnabled()) return;
  const blobDbPath = blobDbPathFor(dbPath);
  const state = softGcStateByBlobDbPath.get(blobDbPath) ?? { inFlight: false, lastRunMs: 0 };
  softGcStateByBlobDbPath.set(blobDbPath, state);
  if (state.inFlight || Date.now() - state.lastRunMs < SOFT_GC_MIN_INTERVAL_MS) return;
  state.inFlight = true;
  state.lastRunMs = Date.now();
  void (async () => {
    try {
      const sizeBytes = await measureConversationBlobBytes(blobDbPath) + db.legacyConversationBlobBytes();
      if (sizeBytes < conversationSoftLimitBytes()) return;
      const result = await runConversationGc(host, dbPath, db);
      reportConversationGcVerdict("soft_schedule", dbPath, result);
    } catch (error42) {
      reportConversationGcVerdict("soft_schedule", dbPath, { outcome: "failed" });
      reportSessionDiagnostic({
        family: "maintenance",
        kind: "conversation_gc_failed",
        agentId: (0, import_node_path131.basename)((0, import_node_path131.dirname)(dbPath)),
        errorClass: errorLogTag(error42)
      });
    } finally {
      state.inFlight = false;
    }
  })();
}
async function ensureConversationCapacityForTurn(host, dbPath, db) {
  if (!isConversationGcEnabled()) return;
  const blobDbPath = blobDbPathFor(dbPath);
  const sizeBytes = await measureConversationBlobBytes(blobDbPath);
  const hardLimitBytes = conversationHardLimitBytes();
  if (sizeBytes < hardLimitBytes) {
    scheduleConversationSizeMaintenance(host, dbPath, db);
    return;
  }
  let result = null;
  try {
    result = await runConversationGc(host, dbPath, db);
  } catch (error42) {
    reportConversationGcVerdict("turn_gate", dbPath, { outcome: "failed" });
    reportSessionDiagnostic({
      family: "maintenance",
      kind: "conversation_gc_failed",
      agentId: (0, import_node_path131.basename)((0, import_node_path131.dirname)(dbPath)),
      errorClass: errorLogTag(error42)
    });
    return;
  }
  const sweepProvedRemainingBytesLive = result?.outcome === "collected";
  if (!sweepProvedRemainingBytesLive) {
    reportConversationGcVerdict("turn_gate", dbPath, result);
    return;
  }
  const afterBytes = await measureConversationBlobBytes(blobDbPath);
  const stillOverCap = afterBytes >= hardLimitBytes;
  reportConversationGcVerdict("turn_gate", dbPath, result, stillOverCap);
  if (stillOverCap) {
    throw new SandConversationTooLargeError(afterBytes, hardLimitBytes);
  }
}
