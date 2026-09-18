var import_node_fs96 = require("node:fs");
var import_node_path155 = require("node:path");
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
    this.filePath = (0, import_node_path155.join)(rootDir, SAND_UPGRADE_RESUME_FILE_NAME);
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
      raw = (0, import_node_fs96.readFileSync)(this.filePath, "utf8");
    } catch (error41) {
      reportFallbackUnlessAbsent("sand_upgrade_resume_store", error41);
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
      (0, import_node_fs96.rmSync)(this.filePath, { force: true });
    } catch {
    }
  }
};
