var import_node_fs94 = require("node:fs");
var import_node_path153 = require("node:path");
init_unknown_record();
var PENDING_WAKE_KINDS = SAND_ASYNC_TASK_KINDS;
function parsePendingWakeFile(raw) {
  if (raw == null) return [];
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (typeof value !== "object" || value === null) return [];
  return coercePendingWakeMarkers(value.pending);
}
function coercePendingWakeMarkers(value) {
  if (!Array.isArray(value)) return [];
  const markers = [];
  for (const entry of value) {
    const marker17 = coerceMarker(entry);
    if (marker17 != null) markers.push(marker17);
  }
  return markers;
}
function isAsyncTaskLabelKind(value) {
  switch (value) {
    case "background_task":
    case "background_command":
    case "cloud_agent":
      return true;
    default:
      return false;
  }
}
function coerceAsyncTaskLabelDescriptor(entry) {
  if (!isAsyncTaskLabelKind(entry.labelKind)) return null;
  const params = entry.labelParams;
  if (typeof params !== "object" || params === null || !("id" in params)) return null;
  if (typeof params.id !== "string" || params.id.length === 0) return null;
  return { labelKind: entry.labelKind, labelParams: { id: params.id } };
}
function coerceMarker(entry) {
  if (!isUnknownRecord(entry)) return null;
  if (typeof entry.agentId !== "string" || entry.agentId.length === 0) return null;
  if (typeof entry.workId !== "string" || entry.workId.length === 0) return null;
  if (!PENDING_WAKE_KINDS.includes(entry.kind)) return null;
  const quietOrigin = coerceQuietOrigin(entry.quietOrigin);
  const labelDescriptor = coerceAsyncTaskLabelDescriptor(entry);
  return {
    agentId: entry.agentId,
    kind: entry.kind,
    workId: entry.workId,
    markedAtMs: typeof entry.markedAtMs === "number" && Number.isFinite(entry.markedAtMs) ? entry.markedAtMs : 0,
    ...quietOrigin != null ? { quietOrigin } : {},
    ...typeof entry.title === "string" && entry.title.length > 0 ? { title: entry.title } : {},
    ...labelDescriptor ?? {},
    ...typeof entry.subagentType === "string" && entry.subagentType.length > 0 ? { subagentType: entry.subagentType } : {},
    ...typeof entry.automationRunUuid === "string" && entry.automationRunUuid.length > 0 ? { automationRunUuid: entry.automationRunUuid } : {},
    ...entry.interruptedByRecreate === true ? { interruptedByRecreate: true } : {},
    ...entry.hiddenCard === true ? { hiddenCard: true } : {}
  };
}
function coerceQuietOrigin(value) {
  if (typeof value !== "object" || value === null) return null;
  const automation = value.automation;
  if (!isUnknownRecord(automation)) return {};
  if (typeof automation.id === "string" && automation.id.length > 0 && typeof automation.name === "string") {
    return { automation: { id: automation.id, name: automation.name } };
  }
  return {};
}
function markerKeyMatches(marker17, agentId, kind, workId) {
  return marker17.agentId === agentId && marker17.kind === kind && marker17.workId === workId;
}
function upsertPendingWakeMarker(existing, marker17) {
  return [
    ...existing.filter(
      (entry) => !markerKeyMatches(entry, marker17.agentId, marker17.kind, marker17.workId)
    ),
    marker17
  ];
}
var SandPendingWakeStore = class {
  filePath;
  constructor(rootDir) {
    this.filePath = (0, import_node_path153.join)(rootDir, SAND_PENDING_WAKE_FILE_NAME);
  }
  markPending(marker17) {
    this.write(upsertPendingWakeMarker(this.readPending(), marker17));
  }
  listPending() {
    return this.readPending();
  }
  hasPending(agentId, kind, workId) {
    return this.readPending().some((entry) => markerKeyMatches(entry, agentId, kind, workId));
  }
  clearOne(agentId, kind, workId) {
    try {
      const existing = this.readPending();
      const remaining = existing.filter((entry) => !markerKeyMatches(entry, agentId, kind, workId));
      if (remaining.length === existing.length) return false;
      if (remaining.length === 0) {
        this.deleteFile();
      } else {
        this.write(remaining);
      }
      return true;
    } catch {
      return false;
    }
  }
  clearAgent(agentId) {
    try {
      const existing = this.readPending();
      const remaining = existing.filter((entry) => entry.agentId !== agentId);
      if (remaining.length === existing.length) return;
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
  pruneStale(maxAgeMs, nowMs2 = Date.now()) {
    try {
      const existing = this.readPending();
      const pruned = existing.filter((entry) => nowMs2 - entry.markedAtMs > maxAgeMs);
      if (pruned.length === 0) return [];
      const remaining = existing.filter((entry) => nowMs2 - entry.markedAtMs <= maxAgeMs);
      if (remaining.length === 0) {
        this.deleteFile();
      } else {
        this.write(remaining);
      }
      return pruned;
    } catch {
      return [];
    }
  }
  readPending() {
    let raw;
    try {
      raw = (0, import_node_fs94.readFileSync)(this.filePath, "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("sand_pending_wake_store", error42);
      raw = null;
    }
    return parsePendingWakeFile(raw);
  }
  write(pending) {
    const file2 = { version: 1, pending };
    writeFileAtomicSync(this.filePath, JSON.stringify(file2));
  }
  deleteFile() {
    try {
      (0, import_node_fs94.rmSync)(this.filePath, { force: true });
    } catch {
    }
  }
};
