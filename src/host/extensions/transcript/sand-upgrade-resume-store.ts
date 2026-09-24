/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/sand-upgrade-resume-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs95 = require("node:fs");
var import_node_path154 = require("node:path");
init_unknown_record();
function parseUpgradeResumeFile(raw) {
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
  const markers = [];
  for (const entry of pending) {
    const marker17 = coerceMarker2(entry);
    if (marker17 != null) markers.push(marker17);
  }
  return markers;
}
function coerceMarker2(entry) {
  if (!isUnknownRecord(entry)) return null;
  if (typeof entry.agentId !== "string" || entry.agentId.length === 0) return null;
  return {
    agentId: entry.agentId,
    markedAtMs: typeof entry.markedAtMs === "number" && Number.isFinite(entry.markedAtMs) ? entry.markedAtMs : 0,
    ...typeof entry.source === "string" ? { source: entry.source } : {},
    ...typeof entry.automationId === "string" ? { automationId: entry.automationId } : {},
    ...typeof entry.automationRunId === "string" ? { automationRunId: entry.automationRunId } : {},
    ...typeof entry.spendRequestId === "string" && entry.spendRequestId.length > 0 && entry.spendRequestId.length <= 256 ? { spendRequestId: entry.spendRequestId } : {}
  };
}
function upsertResumeMarker(existing, marker17) {
  return [...existing.filter((entry) => entry.agentId !== marker17.agentId), marker17];
}
var SandUpgradeResumeStore = class {
  filePath;
  constructor(rootDir) {
    this.filePath = (0, import_node_path154.join)(rootDir, SAND_UPGRADE_RESUME_FILE_NAME);
  }
  markPending(marker17) {
    try {
      const next = upsertResumeMarker(this.readPending(), marker17);
      this.write(next);
    } catch {
    }
  }
  listPending() {
    return this.readPending();
  }
  clear(agentId) {
    try {
      const remaining = this.readPending().filter((entry) => entry.agentId !== agentId);
      if (remaining.length === 0) {
        this.deleteFile();
      } else {
        this.write(remaining);
      }
    } catch {
    }
  }
  clearAll() {
    this.deleteFile();
  }
  readPending() {
    let raw;
    try {
      raw = (0, import_node_fs95.readFileSync)(this.filePath, "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("sand_upgrade_resume_store", error42);
      raw = null;
    }
    return parseUpgradeResumeFile(raw);
  }
  write(pending) {
    const file2 = { version: 1, pending };
    writeFileAtomicSync(this.filePath, JSON.stringify(file2));
  }
  deleteFile() {
    try {
      (0, import_node_fs95.rmSync)(this.filePath, { force: true });
    } catch {
    }
  }
};

function parseInterruptedUserTurnFile(raw) {
  if (raw == null) return [];
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (typeof value !== "object" || value === null || !Array.isArray(value.pending)) return [];
  const pending = [];
  for (const entry of value.pending) {
    if (!isUnknownRecord(entry)) continue;
    if (typeof entry.agentId !== "string" || entry.agentId.length === 0 || entry.agentId.length > 256) continue;
    if (typeof entry.userMessageId !== "string" || entry.userMessageId.length === 0 || entry.userMessageId.length > 256) continue;
    if (entry.state !== "accepted" && entry.state !== "running" && entry.state !== "interrupted") continue;
    pending.push({
      agentId: entry.agentId,
      userMessageId: entry.userMessageId,
      acceptedAtMs: Number.isFinite(entry.acceptedAtMs) ? entry.acceptedAtMs : 0,
      startedAtMs: Number.isFinite(entry.startedAtMs) ? entry.startedAtMs : 0,
      state: entry.state,
      ...entry.visibleAck === true ? { visibleAck: true } : {},
      ...Number.isFinite(entry.interruptedAtMs) ? { interruptedAtMs: entry.interruptedAtMs } : {}
    });
  }
  return pending;
}

var SandInterruptedUserTurnStore = class {
  constructor(rootDir) {
    this.filePath = (0, import_node_path154.join)(rootDir, SAND_INTERRUPTED_USER_TURNS_FILE_NAME);
  }
  filePath;
  listPending() {
    let raw;
    try {
      raw = (0, import_node_fs95.readFileSync)(this.filePath, "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("sand_interrupted_user_turn_store", error42);
      raw = null;
    }
    return parseInterruptedUserTurnFile(raw);
  }
  listInterrupted() {
    return this.listPending().filter((entry) => entry.state === "interrupted");
  }
  find(agentId, userMessageId) {
    return this.listPending().find((entry) => entry.agentId === agentId && entry.userMessageId === userMessageId) ?? null;
  }
  recordAccepted(agentId, userMessageId, acceptedAtMs = Date.now()) {
    const existing = this.find(agentId, userMessageId);
    if (existing?.state === "interrupted") return;
    this.upsert({ agentId, userMessageId, acceptedAtMs, startedAtMs: 0, state: "accepted" });
  }
  recordRunning(agentId, userMessageId, acceptedAtMs = Date.now()) {
    const existing = this.find(agentId, userMessageId);
    this.upsert({
      ...existing,
      agentId,
      userMessageId,
      acceptedAtMs: existing?.acceptedAtMs || acceptedAtMs,
      startedAtMs: Date.now(),
      state: "running",
      ...existing?.visibleAck === true ? { visibleAck: true } : {}
    });
  }
  markVisibleAck(agentId, userMessageIds) {
    const ids = new Set(userMessageIds);
    if (ids.size === 0) return;
    const pending = this.listPending();
    let changed = false;
    const next = pending.map((entry) => {
      if (entry.agentId !== agentId || !ids.has(entry.userMessageId) || entry.visibleAck === true) return entry;
      changed = true;
      return { ...entry, visibleAck: true };
    });
    if (changed) this.write(next);
  }
  upsert(marker) {
    const existing = this.listPending();
    const key = (entry) => `${entry.agentId}\u0000${entry.userMessageId}`;
    this.write([...existing.filter((entry) => key(entry) !== key(marker)), marker]);
  }
  markInterrupted(agentId, userMessageId) {
    const pending = this.listPending();
    let changed = false;
    const next = pending.map((entry) => {
      if (entry.agentId !== agentId || entry.userMessageId !== userMessageId) return entry;
      changed = true;
      return { ...entry, state: "interrupted", interruptedAtMs: Date.now() };
    });
    if (changed) this.write(next);
  }
  markRunningInterrupted() {
    const pending = this.listPending();
    let changed = false;
    const next = pending.map((entry) => {
      if (entry.state !== "accepted" && entry.state !== "running") return entry;
      changed = true;
      return { ...entry, state: "interrupted", interruptedAtMs: Date.now() };
    });
    if (changed) this.write(next);
    return next.filter((entry) => entry.state === "interrupted");
  }
  clear(agentId, userMessageId) {
    const remaining = this.listPending().filter((entry) => !(entry.agentId === agentId && entry.userMessageId === userMessageId));
    if (remaining.length === 0) {
      try {
        (0, import_node_fs95.rmSync)(this.filePath, { force: true });
      } catch (error42) {
        reportFallbackUnlessAbsent("sand_interrupted_user_turn_store", error42);
      }
      return;
    }
    this.write(remaining);
  }
  clearAgent(agentId, userMessageIds) {
    const ids = new Set(userMessageIds);
    if (ids.size === 0) return;
    const pending = this.listPending();
    const remaining = pending.filter((entry) => entry.agentId !== agentId || !ids.has(entry.userMessageId));
    if (remaining.length === pending.length) return;
    if (remaining.length === 0) {
      try {
        (0, import_node_fs95.rmSync)(this.filePath, { force: true });
      } catch (error42) {
        reportFallbackUnlessAbsent("sand_interrupted_user_turn_store", error42);
      }
      return;
    }
    this.write(remaining);
  }
  write(pending) {
    writeFileAtomicSync(this.filePath, JSON.stringify({ version: 1, pending }));
  }
};

