var import_node_crypto70 = require("node:crypto");
var import_node_fs92 = require("node:fs");
var import_node_path151 = require("node:path");
init_scheduling();
init_errors();
init_unknown_record();
var PromptAcceptanceRejectedError = class extends SandDomainError {
  name = "PromptAcceptanceRejectedError";
};
var SAND_SEND_ACCEPTANCE_FILE_NAME = "send-acceptance.json";
var MAX_RECORDS = 256;
function sendInputDigest(input) {
  return (0, import_node_crypto70.createHash)("sha256").update(canonicalSendInput(input), "utf8").digest("hex");
}
var PromptAcceptanceDigestMismatchError = class extends SandDomainError {
  name = "PromptAcceptanceDigestMismatchError";
  code = NONCE_DIGEST_MISMATCH;
  constructor(clientNonce) {
    super(
      `${NONCE_DIGEST_MISMATCH}: clientNonce ${clientNonce} was already accepted with a different input digest`
    );
  }
};
var MAX_DEGRADED_WINDOWS = 8;
var EMPTY_GAPS = {
  evictionHorizonMs: null,
  degradedWindows: [],
  corruptResetAtMs: null
};
function withEvictionHorizon(gaps, acceptedAtMs) {
  const base = gaps ?? EMPTY_GAPS;
  return {
    ...base,
    evictionHorizonMs: Math.max(base.evictionHorizonMs ?? acceptedAtMs, acceptedAtMs)
  };
}
function withDegradedWindow(gaps, window2) {
  const base = gaps ?? EMPTY_GAPS;
  if (base.degradedWindows.length >= MAX_DEGRADED_WINDOWS) {
    const kept = base.degradedWindows.slice(0, -1);
    const last = base.degradedWindows[base.degradedWindows.length - 1];
    return {
      ...base,
      degradedWindows: [
        ...kept,
        {
          fromMs: Math.min(last.fromMs, window2.fromMs),
          toMs: Math.max(last.toMs, window2.toMs)
        }
      ]
    };
  }
  return { ...base, degradedWindows: [...base.degradedWindows, window2] };
}
function withCorruptReset(gaps, atMs) {
  const base = gaps ?? EMPTY_GAPS;
  return {
    ...base,
    corruptResetAtMs: Math.max(base.corruptResetAtMs ?? atMs, atMs)
  };
}
var STATUSES = PROMPT_ACCEPTANCE_STATUSES;
function parseSendAcceptanceFile(raw) {
  if (raw == null) return { records: [], gaps: null, damaged: false };
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return { records: [], gaps: null, damaged: true };
  }
  if (typeof value !== "object" || value === null) {
    return { records: [], gaps: null, damaged: true };
  }
  const rawRecords = value.records;
  if (!Array.isArray(rawRecords)) {
    return { records: [], gaps: null, damaged: true };
  }
  let damaged = false;
  const records2 = [];
  for (const entry of rawRecords) {
    const record2 = coerceRecord(entry);
    if (record2 == null) {
      damaged = true;
    } else {
      records2.push(record2);
    }
  }
  const gapsField = value.historyGaps;
  const gaps = coerceGaps(gapsField);
  if (gaps === "malformed") {
    return { records: records2, gaps: null, damaged: true };
  }
  return { records: records2, gaps, damaged };
}
function coerceGaps(value) {
  if (value === void 0 || value === null) return null;
  if (!isUnknownRecord(value)) return "malformed";
  const horizon = value.evictionHorizonMs ?? null;
  if (horizon !== null && !isFiniteNumber3(horizon)) return "malformed";
  const reset = value.corruptResetAtMs ?? null;
  if (reset !== null && !isFiniteNumber3(reset)) return "malformed";
  if (!Array.isArray(value.degradedWindows)) return "malformed";
  const windows = [];
  for (const entry of value.degradedWindows) {
    if (!isUnknownRecord(entry)) return "malformed";
    if (!isFiniteNumber3(entry.fromMs) || !isFiniteNumber3(entry.toMs)) {
      return "malformed";
    }
    windows.push({ fromMs: entry.fromMs, toMs: entry.toMs });
  }
  return {
    evictionHorizonMs: horizon,
    degradedWindows: windows,
    corruptResetAtMs: reset
  };
}
function isFiniteNumber3(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function coerceRecord(entry) {
  if (!isUnknownRecord(entry)) return null;
  if (typeof entry.accountSlot !== "string" || entry.accountSlot.length === 0) {
    return null;
  }
  if (typeof entry.clientNonce !== "string" || entry.clientNonce.length === 0) {
    return null;
  }
  if (typeof entry.inputDigest !== "string" || entry.inputDigest.length === 0) {
    return null;
  }
  if (typeof entry.agentId !== "string") return null;
  const status = STATUSES.find((candidate) => candidate === entry.status);
  if (status == null) return null;
  if (typeof entry.acceptedAtMs !== "number" || !Number.isFinite(entry.acceptedAtMs)) {
    return null;
  }
  return {
    accountSlot: entry.accountSlot,
    clientNonce: entry.clientNonce,
    inputDigest: entry.inputDigest,
    status,
    acceptedAtMs: entry.acceptedAtMs,
    agentId: entry.agentId,
    echoEntryId: typeof entry.echoEntryId === "string" ? entry.echoEntryId : null,
    rejectionCode: typeof entry.rejectionCode === "string" ? entry.rejectionCode : null
  };
}
function recordKey2(accountSlot, clientNonce) {
  return `${accountSlot}\0${clientNonce}`;
}
var PromptAcceptanceLedger = class {
  constructor(rootDir, nowMs2 = () => Date.now(), flipPersistPolicy = createDebouncePolicy({
    name: "sand-send-acceptance-flip-persist",
    delayMs: 0
  })) {
    this.nowMs = nowMs2;
    this.filePath = rootDir == null ? null : (0, import_node_path151.join)(rootDir, SAND_SEND_ACCEPTANCE_FILE_NAME);
    this.persistDeferredFlip = flipPersistPolicy.wrap(() => {
      if (this.hasDeferredFlip) this.persist();
    });
  }
  nowMs;
  filePath;
  loaded = null;
  degradedSinceMs = null;
  markerMayExist = false;
  hasDeferredFlip = false;
  persistDeferredFlip;
  dispose() {
    if (this.hasDeferredFlip) this.persist();
    this.persistDeferredFlip.dispose();
  }
  lookup(args) {
    const loaded = this.load();
    const record2 = loaded.records.get(recordKey2(args.accountSlot, args.clientNonce));
    if (record2 != null) return { outcome: "found", record: record2 };
    if (loaded.gaps != null || this.degradedSinceMs != null) {
      return { outcome: "unknown-durability" };
    }
    return { outcome: "not-found" };
  }
  admitSend(args) {
    const found = this.lookup(args);
    if (found.outcome !== "found") return { kind: "dispatch" };
    if (found.record.inputDigest !== args.inputDigest) {
      throw new PromptAcceptanceDigestMismatchError(args.clientNonce);
    }
    if (found.record.status === "rejected") {
      throw new PromptAcceptanceRejectedError(
        `send rejected: ${found.record.rejectionCode ?? "unknown"} (replaying the nonce's original outcome)`
      );
    }
    return { kind: "duplicate", record: found.record };
  }
  recordPending(input) {
    const key = recordKey2(input.accountSlot, input.clientNonce);
    const existing = this.load().records.get(key);
    if (existing != null) {
      if (existing.inputDigest !== input.inputDigest) {
        throw new PromptAcceptanceDigestMismatchError(input.clientNonce);
      }
      return existing;
    }
    const record2 = {
      accountSlot: input.accountSlot,
      clientNonce: input.clientNonce,
      inputDigest: input.inputDigest,
      status: "pending",
      acceptedAtMs: this.nowMs(),
      agentId: input.agentId,
      echoEntryId: input.echoEntryId,
      rejectionCode: null
    };
    this.load().records.set(key, record2);
    this.evictPastCap();
    this.persist();
    return record2;
  }
  markAccepted(args) {
    const key = recordKey2(args.accountSlot, args.clientNonce);
    const existing = this.load().records.get(key);
    if (existing == null || existing.status !== "pending") return;
    this.load().records.set(key, { ...existing, status: "accepted" });
    this.hasDeferredFlip = true;
    this.persistDeferredFlip();
  }
  markRejected(args) {
    const key = recordKey2(args.accountSlot, args.clientNonce);
    const existing = this.load().records.get(key);
    if (existing == null || existing.status !== "pending") return;
    this.load().records.set(key, {
      ...existing,
      status: "rejected",
      rejectionCode: args.rejectionCode
    });
    this.persist();
  }
  clear(args) {
    const deleted = this.load().records.delete(recordKey2(args.accountSlot, args.clientNonce));
    if (deleted) this.persist();
  }
  clearUnlessAccepted(args) {
    const record2 = this.load().records.get(recordKey2(args.accountSlot, args.clientNonce));
    if (record2 == null || record2.status === "accepted") return;
    this.clear(args);
  }
  evictPastCap() {
    const loaded = this.load();
    if (loaded.records.size <= MAX_RECORDS) return;
    let oldestPending = null;
    let oldestCompleted = null;
    for (const [key, record2] of loaded.records) {
      if (record2.status === "pending") {
        oldestPending ??= key;
      } else {
        oldestCompleted ??= key;
        break;
      }
    }
    const evict = oldestCompleted ?? oldestPending;
    if (evict == null) return;
    const evicted = loaded.records.get(evict);
    loaded.records.delete(evict);
    if (evicted != null) {
      loaded.gaps = withEvictionHorizon(loaded.gaps, evicted.acceptedAtMs);
    }
  }
  markerPath() {
    return this.filePath == null ? null : `${this.filePath}.degraded`;
  }
  load() {
    if (this.loaded != null) return this.loaded;
    let raw = null;
    if (this.filePath != null) {
      try {
        raw = (0, import_node_fs92.readFileSync)(this.filePath, "utf8");
      } catch (error41) {
        reportFallbackUnlessAbsent("prompt_acceptance_ledger", error41);
        raw = null;
      }
    }
    const parsed2 = parseSendAcceptanceFile(raw);
    let gaps = parsed2.gaps;
    let repairNeeded = false;
    if (parsed2.damaged && this.filePath != null) {
      try {
        (0, import_node_fs92.copyFileSync)(this.filePath, `${this.filePath}.corrupt-${this.nowMs()}`);
      } catch {
      }
      gaps = withCorruptReset(gaps, this.nowMs());
      repairNeeded = true;
    }
    const markerSinceMs = this.readDegradedMarker();
    if (markerSinceMs != null) {
      gaps = withDegradedWindow(gaps, {
        fromMs: markerSinceMs,
        toMs: this.nowMs()
      });
      this.markerMayExist = true;
      repairNeeded = true;
    }
    this.loaded = {
      records: new Map(
        parsed2.records.map((record2) => [recordKey2(record2.accountSlot, record2.clientNonce), record2])
      ),
      gaps
    };
    if (repairNeeded) this.persist();
    return this.loaded;
  }
  readDegradedMarker() {
    const markerPath = this.markerPath();
    if (markerPath == null) return null;
    let raw;
    try {
      raw = (0, import_node_fs92.readFileSync)(markerPath, "utf8");
    } catch (error41) {
      reportFallbackUnlessAbsent("prompt_acceptance_ledger", error41);
      return null;
    }
    try {
      const value = JSON.parse(raw);
      if (isFiniteNumber3(value.sinceMs)) return value.sinceMs;
    } catch {
    }
    return 0;
  }
  persist() {
    this.hasDeferredFlip = false;
    const loaded = this.loaded;
    if (this.filePath == null || loaded == null) return;
    const nowMs2 = this.nowMs();
    const gaps = this.degradedSinceMs == null ? loaded.gaps : withDegradedWindow(loaded.gaps, {
      fromMs: this.degradedSinceMs,
      toMs: nowMs2
    });
    const file2 = {
      version: 1,
      records: [...loaded.records.values()],
      ...gaps == null ? {} : { historyGaps: gaps }
    };
    try {
      writeFileAtomicSync(this.filePath, JSON.stringify(file2));
    } catch (error41) {
      this.enterDegraded(nowMs2, error41);
      return;
    }
    loaded.gaps = gaps;
    this.degradedSinceMs = null;
    this.removeDegradedMarker();
  }
  enterDegraded(nowMs2, error41) {
    this.degradedSinceMs ??= nowMs2;
    reportHostDiagnostic({
      kind: "send_ledger_degraded",
      errorClass: errorLogTag(error41)
    });
    if (this.markerMayExist) return;
    const markerPath = this.markerPath();
    if (markerPath == null) return;
    try {
      (0, import_node_fs92.writeFileSync)(markerPath, JSON.stringify({ version: 1, sinceMs: this.degradedSinceMs }));
      this.markerMayExist = true;
    } catch {
    }
  }
  removeDegradedMarker() {
    if (!this.markerMayExist) return;
    const markerPath = this.markerPath();
    if (markerPath == null) return;
    try {
      (0, import_node_fs92.rmSync)(markerPath, { force: true });
      this.markerMayExist = false;
    } catch {
    }
  }
};
