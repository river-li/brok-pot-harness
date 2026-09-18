var import_node_fs94 = require("node:fs");
var import_node_path153 = require("node:path");
init_unknown_record();
function parseAckObligationsFile(raw) {
  if (raw == null) return [];
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (typeof value !== "object" || value === null) return [];
  const pending = value.pending;
  if (!Array.isArray(pending)) return [];
  const obligations = [];
  for (const entry of pending) {
    const obligation = coerceObligation(entry);
    if (obligation != null) obligations.push(obligation);
  }
  return obligations;
}
function finiteNumber(value, fallback2) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback2;
}
function coerceObligation(entry) {
  if (!isUnknownRecord(entry)) return null;
  if (typeof entry.agentId !== "string" || entry.agentId.length === 0) return null;
  const createdAtMs2 = finiteNumber(entry.createdAtMs, 0);
  return {
    agentId: entry.agentId,
    createdAtMs: createdAtMs2,
    lastSendAtMs: finiteNumber(entry.lastSendAtMs, createdAtMs2),
    ...typeof entry.lastInterruptAtMs === "number" && Number.isFinite(entry.lastInterruptAtMs) ? { lastInterruptAtMs: entry.lastInterruptAtMs } : {},
    coalescedCount: Math.max(1, finiteNumber(entry.coalescedCount, 1)),
    redriveAttempts: Math.max(0, finiteNumber(entry.redriveAttempts, 0))
  };
}
var SandAckObligationStore = class {
  filePath;
  cache = null;
  constructor(rootDir) {
    this.filePath = (0, import_node_path153.join)(rootDir, SAND_ACK_OBLIGATIONS_FILE_NAME);
  }
  get(agentId) {
    return this.readPending().find((entry) => entry.agentId === agentId);
  }
  list() {
    return this.readPending();
  }
  recordSend(agentId, send) {
    const existing = this.get(agentId);
    const obligation = existing == null ? {
      agentId,
      createdAtMs: send.atMs,
      lastSendAtMs: send.atMs,
      coalescedCount: 1,
      redriveAttempts: 0
    } : {
      ...existing,
      lastSendAtMs: send.atMs,
      coalescedCount: existing.coalescedCount + 1
    };
    this.upsert(obligation);
    return { obligation, created: existing == null };
  }
  recordInterrupt(agentId, atMs) {
    const existing = this.get(agentId);
    if (existing == null) return;
    this.upsert({ ...existing, lastInterruptAtMs: atMs });
  }
  recordRedriveAttempt(agentId) {
    const existing = this.get(agentId);
    if (existing == null) return void 0;
    const next = {
      ...existing,
      redriveAttempts: existing.redriveAttempts + 1
    };
    this.upsert(next);
    return next;
  }
  clear(agentId) {
    try {
      const remaining = this.readPending().filter((entry) => entry.agentId !== agentId);
      if (remaining.length === this.readPending().length) return;
      this.write(remaining);
    } catch {
    }
  }
  upsert(obligation) {
    try {
      this.write([
        ...this.readPending().filter((entry) => entry.agentId !== obligation.agentId),
        obligation
      ]);
    } catch {
    }
  }
  readPending() {
    if (this.cache != null) return this.cache;
    let raw;
    try {
      raw = (0, import_node_fs94.readFileSync)(this.filePath, "utf8");
    } catch (error41) {
      reportFallbackUnlessAbsent("sand_ack_obligation_store", error41);
      raw = null;
    }
    this.cache = parseAckObligationsFile(raw);
    return this.cache;
  }
  write(pending) {
    const file2 = { version: 1, pending };
    writeFileAtomicSync(this.filePath, JSON.stringify(file2));
    this.cache = pending;
  }
};
