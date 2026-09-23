var CONFIG_FILENAME = AUTOMATION_CONFIG_FILENAME;
var RUNS_FILENAME = AUTOMATION_RUNS_FILENAME;
var parseStoredConfig = parseStoredAutomationConfig;
var serializeConfig = serializeStoredAutomationConfig;
var serializeRuns = serializeStoredAutomationRuns;
var clampRunDetail = clampAutomationRunDetail;
var clampCoalescedRunIds = clampAutomationCoalescedRunIds;
var AUTOMATION_CHANGE_DEBOUNCE_MS = 50;
function inspectAgentAutomationDefinitions(agentDir) {
  try {
    if (!(0, import_node_fs55.statSync)(agentDir).isDirectory()) {
      return { state: "agent_missing", validDefinitionCount: 0 };
    }
  } catch (error42) {
    reportFallbackUnlessAbsent("automation_store", error42);
    return { state: "agent_missing", validDefinitionCount: 0 };
  }
  const automationsDir = getAgentAutomationsDir(agentDir);
  let entries;
  try {
    entries = (0, import_node_fs55.readdirSync)(automationsDir, { withFileTypes: true });
  } catch (error42) {
    reportFallbackUnlessAbsent("automation_store", error42);
    return { state: "dir_missing", validDefinitionCount: 0 };
  }
  let candidateCount = 0;
  let validDefinitionCount = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || !isSafeFolderId(entry.name)) continue;
    candidateCount += 1;
    const configPath = (0, import_node_path96.join)(automationsDir, entry.name, CONFIG_FILENAME);
    let raw;
    try {
      raw = (0, import_node_fs55.readFileSync)(configPath, "utf8");
    } catch {
      continue;
    }
    let fallbackCreatedAt = Date.now();
    try {
      const stats = (0, import_node_fs55.statSync)(configPath);
      fallbackCreatedAt = Math.floor(stats.birthtimeMs || stats.mtimeMs);
    } catch {
    }
    if (parseStoredConfig(raw, fallbackCreatedAt) != null) {
      validDefinitionCount += 1;
    }
  }
  if (validDefinitionCount > 0) {
    return { state: "valid", validDefinitionCount };
  }
  return {
    state: candidateCount > 0 ? "configs_invalid" : "dir_empty",
    validDefinitionCount: 0
  };
}
function agentHasAutomations(agentDir) {
  return inspectAgentAutomationDefinitions(agentDir).validDefinitionCount > 0;
}
var FileAutomationStore = class {
  constructor(automationsDir, resolveUserTimeZone = () => void 0, isFiveMinuteAutomationFloorEnabled = () => false, clock = realClock) {
    this.automationsDir = automationsDir;
    this.resolveUserTimeZone = resolveUserTimeZone;
    this.isFiveMinuteAutomationFloorEnabled = isFiveMinuteAutomationFloorEnabled;
    this.dir = new WatchedDirectory(
      automationsDir,
      createDebouncePolicy({
        name: "sand-automation-store-change",
        delayMs: AUTOMATION_CHANGE_DEBOUNCE_MS,
        clock
      })
    );
  }
  automationsDir;
  resolveUserTimeZone;
  isFiveMinuteAutomationFloorEnabled;
  dir;
  getLocation() {
    return this.dir.getLocation();
  }
  setOnChange(onChange) {
    this.dir.setOnChange(onChange);
  }
  configPath(id) {
    return (0, import_node_path96.join)(this.automationsDir, id, CONFIG_FILENAME);
  }
  runsPath(id) {
    return (0, import_node_path96.join)(this.automationsDir, id, RUNS_FILENAME);
  }
  toRecord({
    id,
    config: config2,
    deriveNextRunAt
  }) {
    return automationRecordFromConfig({
      id,
      config: this.isFiveMinuteAutomationFloorEnabled() || config2.pendingNotices.length === 0 ? config2 : { ...config2, pendingNotices: [] },
      runs: this.readRuns(id),
      filePath: this.configPath(id),
      nextRunAt: deriveNextRunAt && config2.isEnabled ? earliestAutomationNextRunAt(config2, this.resolveUserTimeZone()) : null
    });
  }
  readRuns(id) {
    let raw;
    try {
      raw = (0, import_node_fs55.readFileSync)(this.runsPath(id), "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("automation_store", error42);
      return [];
    }
    return parseStoredAutomationRuns(raw);
  }
  writeRuns(id, runs) {
    this.dir.writeFileAtomic(this.runsPath(id), serializeRuns(runs));
  }
  readConfig(id) {
    const path31 = this.configPath(id);
    let raw;
    try {
      raw = (0, import_node_fs55.readFileSync)(path31, "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("automation_store", error42);
      return null;
    }
    let fallbackCreatedAt = Date.now();
    try {
      fallbackCreatedAt = Math.floor((0, import_node_fs55.statSync)(path31).birthtimeMs || (0, import_node_fs55.statSync)(path31).mtimeMs);
    } catch {
    }
    const parsed2 = parseStoredConfig(raw, fallbackCreatedAt);
    if (parsed2 == null || !this.isFiveMinuteAutomationFloorEnabled()) return parsed2;
    const migrated = migrateAutomationConfigToMinimumInterval(
      parsed2,
      SAND_AUTOMATION_MIN_INTERVAL_MS
    );
    if (migrated !== parsed2) this.writeConfig(id, migrated);
    return migrated;
  }
  writeConfig(id, config2) {
    this.dir.writeFileAtomic(this.configPath(id), serializeConfig(config2));
  }
  listIds() {
    return this.dir.listSubdirectoryNames();
  }
  list() {
    const automations = [];
    for (const id of this.listIds()) {
      const config2 = this.readConfig(id);
      if (config2 != null) {
        automations.push(this.toRecord({ id, config: config2, deriveNextRunAt: true }));
      }
    }
    return automations.sort((a, b2) => {
      const aNext = a.nextRunAt ?? Number.POSITIVE_INFINITY;
      const bNext = b2.nextRunAt ?? Number.POSITIVE_INFINITY;
      if (aNext !== bNext) return aNext - bNext;
      return a.createdAt - b2.createdAt;
    });
  }
  listDefinitions() {
    const automations = [];
    for (const id of this.listIds()) {
      const config2 = this.readConfig(id);
      if (config2 != null) {
        automations.push(this.toRecord({ id, config: config2, deriveNextRunAt: false }));
      }
    }
    return automations.sort((a, b2) => a.createdAt - b2.createdAt);
  }
  get(id) {
    if (!isSafeFolderId(id)) return null;
    const config2 = this.readConfig(id);
    return config2 == null ? null : this.toRecord({ id, config: config2, deriveNextRunAt: true });
  }
  count() {
    return this.listIds().filter((id) => this.readConfig(id) != null).length;
  }
  uniqueId(name17) {
    return uniqueAutomationId(name17, new Set(this.listIds()));
  }
  upsert(spec, provenance, createdAt = Date.now()) {
    const config2 = automationConfigFromSpec(spec, {
      createdAt,
      provenance,
      ...this.isFiveMinuteAutomationFloorEnabled() ? { minimumIntervalMs: SAND_AUTOMATION_MIN_INTERVAL_MS } : {}
    });
    if (config2 == null) return null;
    if (this.count() >= AUTOMATION_MAX_PER_AGENT) return null;
    const id = this.uniqueId(config2.name);
    this.writeConfig(id, config2);
    return this.toRecord({ id, config: config2, deriveNextRunAt: true });
  }
  update(id, spec, provenance) {
    if (!isSafeFolderId(id)) return null;
    const config2 = this.readConfig(id);
    if (config2 == null) return null;
    const next = automationConfigWithSpec(
      config2,
      spec,
      provenance,
      this.isFiveMinuteAutomationFloorEnabled() ? SAND_AUTOMATION_MIN_INTERVAL_MS : void 0
    );
    if (next == null) return null;
    this.writeConfig(id, next);
    return this.toRecord({ id, config: next, deriveNextRunAt: true });
  }
  markNoticeRaised(id, notice) {
    if (!isSafeFolderId(id) || !isAutomationNoticeId(notice)) return null;
    const config2 = this.readConfig(id);
    if (config2 == null) return null;
    if (config2.raisedNotices.includes(notice)) {
      return this.toRecord({ id, config: config2, deriveNextRunAt: true });
    }
    const next = {
      ...config2,
      pendingNotices: config2.pendingNotices.filter((entry) => entry !== notice),
      raisedNotices: [...config2.raisedNotices, notice]
    };
    this.writeConfig(id, next);
    return this.toRecord({ id, config: next, deriveNextRunAt: true });
  }
  setEnabled(id, isEnabled) {
    if (!isSafeFolderId(id)) return null;
    const config2 = this.readConfig(id);
    if (config2 == null) return null;
    if (config2.isEnabled === isEnabled) {
      return this.toRecord({ id, config: config2, deriveNextRunAt: true });
    }
    const next = { ...config2, isEnabled };
    this.writeConfig(id, next);
    return this.toRecord({ id, config: next, deriveNextRunAt: true });
  }
  recordRun(id, at3 = Date.now()) {
    return this.recordRunWith({ id, at: at3, deriveNextRunAt: true });
  }
  recordRunDefinition(id, at3 = Date.now()) {
    return this.recordRunWith({ id, at: at3, deriveNextRunAt: false });
  }
  recordRunWith({
    id,
    at: at3,
    deriveNextRunAt
  }) {
    if (!isSafeFolderId(id)) return null;
    const config2 = this.readConfig(id);
    if (config2 == null) return null;
    const next = { ...config2, lastRunAt: at3 };
    this.writeConfig(id, next);
    return this.toRecord({ id, config: next, deriveNextRunAt });
  }
  beginRun({
    id,
    trigger: trigger2,
    at: at3 = Date.now(),
    event,
    runId = (0, import_node_crypto41.randomUUID)(),
    coalescedRunIds
  }) {
    if (!isSafeFolderId(id)) return null;
    if (this.readConfig(id) == null) return null;
    const runs = this.readRuns(id);
    const existing = runs.find((run2) => run2.id === runId);
    if (existing !== void 0) return existing;
    const eventSummary = clampRunDetail(event);
    const absorbed = clampCoalescedRunIds(coalescedRunIds);
    const run = {
      id: runId,
      trigger: trigger2,
      startedAt: at3,
      finishedAt: null,
      status: "running",
      ...eventSummary != null ? { event: eventSummary } : {},
      ...absorbed != null ? { coalescedRunIds: absorbed } : {}
    };
    this.writeRuns(id, [run, ...runs].slice(0, AUTOMATION_MAX_RUN_HISTORY));
    return run;
  }
  setRunRequestIdDefinition({
    id,
    runId,
    requestId: requestId2
  }) {
    if (!isSafeFolderId(id) || this.readConfig(id) == null) return;
    const normalizedRequestId = requestId2.trim();
    if (normalizedRequestId.length === 0) return;
    const runs = this.readRuns(id);
    const index = runs.findIndex((run) => run.id === runId);
    const existing = index === -1 ? null : runs[index];
    if (existing == null || existing.requestId != null) return;
    const nextRuns = [...runs];
    nextRuns[index] = { ...existing, requestId: normalizedRequestId };
    this.writeRuns(id, nextRuns);
  }
  finishRun(id, runId, status, at3 = Date.now(), detail) {
    return this.finishRunWith({
      id,
      runId,
      status,
      at: at3,
      ...detail !== void 0 ? { detail } : {},
      deriveNextRunAt: true
    });
  }
  finishRunDefinition({
    id,
    runId,
    status,
    at: at3 = Date.now(),
    detail,
    errorKind,
    requestId: requestId2
  }) {
    return this.finishRunWith({
      id,
      runId,
      status,
      at: at3,
      ...detail !== void 0 ? { detail } : {},
      ...errorKind !== void 0 ? { errorKind } : {},
      ...requestId2 !== void 0 ? { requestId: requestId2 } : {},
      deriveNextRunAt: false
    });
  }
  finishRunWith({
    id,
    runId,
    status,
    at: at3,
    detail,
    errorKind,
    requestId: requestId2,
    deriveNextRunAt
  }) {
    if (!isSafeFolderId(id)) return null;
    const config2 = this.readConfig(id);
    if (config2 == null) return null;
    const runs = this.readRuns(id);
    const index = runs.findIndex((run) => run.id === runId);
    const existing = index === -1 ? null : runs[index];
    if (existing == null) {
      return this.toRecord({ id, config: config2, deriveNextRunAt });
    }
    const clampedDetail = clampRunDetail(detail);
    const normalizedRequestId = requestId2?.trim();
    const updated = {
      ...existing,
      finishedAt: at3,
      status,
      ...clampedDetail != null ? { detail: clampedDetail } : {},
      ...errorKind != null ? { errorKind } : {},
      ...existing.requestId == null && normalizedRequestId != null && normalizedRequestId.length > 0 ? { requestId: normalizedRequestId } : {}
    };
    const nextRuns = [...runs];
    nextRuns[index] = updated;
    this.writeRuns(id, nextRuns);
    return this.toRecord({ id, config: config2, deriveNextRunAt });
  }
  remove(id) {
    if (!isSafeFolderId(id)) return false;
    const automationDir = (0, import_node_path96.join)(this.automationsDir, id);
    let existed = false;
    try {
      existed = (0, import_node_fs55.statSync)(automationDir).isDirectory();
    } catch (error42) {
      reportFallbackUnlessAbsent("automation_store", error42);
      return false;
    }
    if (!existed) return false;
    (0, import_node_fs55.rmSync)(automationDir, { recursive: true, force: true });
    this.dir.scheduleNotify();
    return true;
  }
};
