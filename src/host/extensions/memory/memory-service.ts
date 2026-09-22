var PROFILE_FILENAME = MEMORY_PROFILE_FILENAME;
var LOG_DIRNAME = MEMORY_LOG_DIRNAME;
var FACT_LINE = MEMORY_FACT_LINE;
var PROFILE_HEADER = MEMORY_PROFILE_HEADER;
var LOG_HEADER = MEMORY_LOG_HEADER;
var MEMORY_SYNTHESIS_INPUT_LIMIT = 512;
var MEMORY_SYNTHESIS_METADATA_DIRNAME = MEMORY_DREAMING_DIRNAME;
var MEMORY_SYNTHESIS_REFRESH_FILENAME = "next-refresh-at";
var MEMORY_SYNTHESIS_EXPLICIT_DIRNAME = "explicit";
var MEMORY_SYNTHESIS_GENERATED_DIRNAME = "synthesized";
var MEMORY_SYNTHESIS_TOMBSTONE_DIRNAME = "tombstones";
function agentMemoryHasContent(agentDir) {
  const memoryDir = getAgentMemoryDir(agentDir);
  const logDir = (0, import_node_path122.join)(memoryDir, LOG_DIRNAME);
  let logFiles;
  try {
    logFiles = (0, import_node_fs74.readdirSync)(logDir).filter((name17) => name17.endsWith(".md")).map((name17) => (0, import_node_path122.join)(logDir, name17));
  } catch (error42) {
    reportFallbackUnlessAbsent("memory_service", error42);
    logFiles = [];
  }
  for (const file2 of [(0, import_node_path122.join)(memoryDir, PROFILE_FILENAME), ...logFiles]) {
    let raw;
    try {
      raw = (0, import_node_fs74.readFileSync)(file2, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      const match2 = FACT_LINE.exec(line);
      if (match2 == null) continue;
      if (normalizeMemoryContent(match2[2] ?? "").length > 0) return true;
    }
  }
  return false;
}
function parseFacts(raw, kind, base, path31) {
  return parseMemoryFacts(raw, kind, base, path31).map((fact) => ({ ...fact, origin: "legacy" }));
}
var byMostRecent = memoryFactsByMostRecent;
var toRecord = memoryFactToRecord;
var serializeFactLine = serializeMemoryFactLine;
var FileMemoryStore = class {
  constructor(memoryDir, dreaming) {
    this.memoryDir = memoryDir;
    this.dreaming = dreaming;
    this.profileFile = (0, import_node_path122.join)(memoryDir, PROFILE_FILENAME);
    this.logDir = (0, import_node_path122.join)(memoryDir, LOG_DIRNAME);
    const metadataDir = (0, import_node_path122.join)(memoryDir, MEMORY_SYNTHESIS_METADATA_DIRNAME);
    this.explicitDir = (0, import_node_path122.join)(metadataDir, MEMORY_SYNTHESIS_EXPLICIT_DIRNAME);
    this.generatedDir = (0, import_node_path122.join)(metadataDir, MEMORY_SYNTHESIS_GENERATED_DIRNAME);
    this.refreshFile = (0, import_node_path122.join)(metadataDir, MEMORY_SYNTHESIS_REFRESH_FILENAME);
    this.tombstoneDir = (0, import_node_path122.join)(metadataDir, MEMORY_SYNTHESIS_TOMBSTONE_DIRNAME);
    this.evidenceDir = getMemoryEvidenceDir(memoryDir);
  }
  memoryDir;
  dreaming;
  profileFile;
  logDir;
  explicitDir;
  generatedDir;
  refreshFile;
  tombstoneDir;
  evidenceDir;
  captureMemoryEvidence = (evidence) => {
    this.dreaming?.record(evidence);
  };
  get recordMemoryEvidence() {
    return this.dreaming?.isEnabled() === true ? this.captureMemoryEvidence : void 0;
  }
  getLocation() {
    return this.memoryDir;
  }
  read(path31) {
    try {
      return (0, import_node_fs74.readFileSync)(path31, "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("memory_service", error42);
      return "";
    }
  }
  logFiles() {
    let names3;
    try {
      names3 = (0, import_node_fs74.readdirSync)(this.logDir);
    } catch (error42) {
      reportFallbackUnlessAbsent("memory_service", error42);
      return [];
    }
    return names3.filter((name17) => name17.endsWith(".md")).sort().map((name17) => (0, import_node_path122.join)(this.logDir, name17));
  }
  logFileForDate(createdAt) {
    const bucket = formatMemoryDate(createdAt).slice(0, 7);
    return (0, import_node_path122.join)(this.logDir, `${bucket}.md`);
  }
  profileFacts() {
    return parseFacts(this.read(this.profileFile), "profile", 0, this.profileFile);
  }
  logFacts() {
    const facts = [];
    for (const file2 of this.logFiles()) {
      for (const fact of parseFacts(this.read(file2), "log", facts.length, file2)) {
        facts.push(fact);
      }
    }
    return facts;
  }
  allFacts() {
    return [...this.profileFacts(), ...this.logFacts()];
  }
  writeAtomic(path31, content) {
    writeFileAtomicSync(path31, content);
  }
  tombstonePath(content) {
    return (0, import_node_path122.join)(this.tombstoneDir, `${memoryIdFor(content)}.deleted`);
  }
  originPath(content, origin) {
    const dir = origin === "explicit" ? this.explicitDir : this.generatedDir;
    return (0, import_node_path122.join)(dir, `${memoryIdFor(content)}.memory`);
  }
  hasOrigin(content, origin) {
    try {
      return (0, import_node_fs74.statSync)(this.originPath(content, origin)).isFile();
    } catch (error42) {
      reportFallbackUnlessAbsent("memory_service", error42);
      return false;
    }
  }
  memoryOrigin(content) {
    if (this.hasOrigin(content, "explicit")) return "explicit";
    if (this.hasOrigin(content, "synthesis")) return "synthesis";
    return "legacy";
  }
  markOrigin(content, origin) {
    this.writeAtomic(this.originPath(content, origin), "");
  }
  clearOrigins(content) {
    (0, import_node_fs74.rmSync)(this.originPath(content, "explicit"), { force: true });
    (0, import_node_fs74.rmSync)(this.originPath(content, "synthesis"), { force: true });
  }
  isTombstoned(content) {
    try {
      return (0, import_node_fs74.statSync)(this.tombstonePath(content)).isFile();
    } catch (error42) {
      reportFallbackUnlessAbsent("memory_service", error42);
      return false;
    }
  }
  markTombstone(content) {
    this.writeAtomic(this.tombstonePath(content), "");
  }
  clearTombstone(content) {
    (0, import_node_fs74.rmSync)(this.tombstonePath(content), { force: true });
  }
  recall(recentLimit) {
    const safeLimit = Number.isFinite(recentLimit) && recentLimit > 0 ? Math.floor(recentLimit) : 0;
    const profile = this.profileFacts().sort(byMostRecent).slice(0, MEMORY_PROFILE_PROMPT_LIMIT).map(toRecord);
    return { profile, recent: this.recallLogFacts(safeLimit) };
  }
  recallLogFacts(limit) {
    if (limit === 0) return [];
    return this.logFacts().sort((a, b2) => memoryRecallRank(b2) - memoryRecallRank(a) || byMostRecent(a, b2)).slice(0, limit).map(toRecord);
  }
  listMemories(limit) {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 0;
    if (safeLimit === 0) return [];
    return [
      ...this.profileFacts().sort(byMostRecent).map(toRecord),
      ...this.logFacts().sort(byMostRecent).map(toRecord)
    ].slice(0, safeLimit);
  }
  countMemories() {
    return this.allFacts().length;
  }
  addMemory(content, createdAt, kind) {
    const normalized = normalizeMemoryContent(content);
    if (normalized.length === 0) return null;
    const key = memoryDedupeKey(normalized);
    const existing = this.allFacts().find((fact) => memoryDedupeKey(fact.content) === key);
    if (existing != null) {
      if (this.dreaming?.isEnabled() === true) {
        this.clearTombstone(existing.content);
        this.clearOrigins(existing.content);
        this.markOrigin(existing.content, "explicit");
      }
      return null;
    }
    const path31 = kind === "profile" ? this.profileFile : this.logFileForDate(createdAt);
    const header = kind === "profile" ? PROFILE_HEADER : LOG_HEADER;
    const raw = this.read(path31);
    const base = raw.length === 0 ? header : raw;
    const separator = base.endsWith("\n") || base.length === 0 ? "" : "\n";
    this.writeAtomic(path31, `${base}${separator}${serializeFactLine(normalized, createdAt)}
`);
    if (this.dreaming?.isEnabled() === true) {
      this.clearTombstone(normalized);
      this.clearOrigins(normalized);
      this.markOrigin(normalized, "explicit");
    }
    return { id: memoryIdFor(normalized), content: normalized, createdAt, kind };
  }
  removeMemoryByContent(content) {
    const normalized = normalizeMemoryContent(content);
    if (normalized.length === 0) return false;
    return this.removeMemory(memoryIdFor(normalized));
  }
  removeMemory(id) {
    for (const path31 of [this.profileFile, ...this.logFiles()]) {
      const raw = this.read(path31);
      if (raw.length === 0) continue;
      const kind = path31 === this.profileFile ? "profile" : "log";
      const fact = parseFacts(raw, kind, 0, path31).find((memory) => memory.id === id);
      if (fact == null) continue;
      const lines2 = raw.split("\n");
      lines2.splice(fact.firstLine, fact.lastLine - fact.firstLine + 1);
      this.writeAtomic(path31, lines2.join("\n"));
      if (this.dreaming?.isEnabled() === true) {
        this.clearOrigins(fact.content);
        this.markTombstone(fact.content);
      }
      return true;
    }
    return false;
  }
  prepareSynthesis() {
    const state = this.readSynthesisState();
    const seen = /* @__PURE__ */ new Set();
    const memories = [...state.facts].sort(
      (a, b2) => Number(b2.origin === "explicit") - Number(a.origin === "explicit") || Number(b2.kind === "profile") - Number(a.kind === "profile") || byMostRecent(a, b2)
    ).filter((memory) => {
      if (seen.has(memory.id)) return false;
      seen.add(memory.id);
      return true;
    }).slice(0, MEMORY_SYNTHESIS_INPUT_LIMIT).map((memory) => ({
      id: memory.id,
      content: memory.content,
      createdAt: memory.createdAt,
      kind: memory.kind,
      origin: memory.origin
    }));
    return { fingerprint: state.fingerprint, memories };
  }
  applySynthesis(snapshot, changes, now) {
    const state = this.readSynthesisState();
    if (state.fingerprint !== snapshot.fingerprint) return "stale";
    const allowedIds = new Set(snapshot.memories.map((memory) => memory.id));
    const currentById = new Map(state.facts.map((memory) => [memory.id, memory]));
    const finalKeys = new Map(
      state.facts.map((memory) => [memoryDedupeKey(memory.content), memory.id])
    );
    const changedIds = /* @__PURE__ */ new Set();
    const removals = [];
    const additions = [];
    for (const change of changes) {
      if (change.action === "create") {
        const content2 = normalizeMemoryContent(change.content);
        if (content2.length === 0) return "invalid";
        if (this.isTombstoned(content2)) continue;
        const key = memoryDedupeKey(content2);
        if (finalKeys.has(key)) continue;
        finalKeys.set(key, memoryIdFor(content2));
        additions.push({ content: content2, createdAt: now, kind: change.kind });
        continue;
      }
      if (!allowedIds.has(change.id) || changedIds.has(change.id)) {
        return "invalid";
      }
      const existing = currentById.get(change.id);
      if (existing == null || existing.origin === "explicit") {
        return "invalid";
      }
      if (change.action === "remove") {
        changedIds.add(change.id);
        finalKeys.delete(memoryDedupeKey(existing.content));
        removals.push(existing);
        continue;
      }
      const content = normalizeMemoryContent(change.content);
      if (content.length === 0) return "invalid";
      if (this.isTombstoned(content)) continue;
      const oldKey = memoryDedupeKey(existing.content);
      const nextKey = memoryDedupeKey(content);
      const conflictingId = finalKeys.get(nextKey);
      if (conflictingId != null && conflictingId !== existing.id) {
        return "invalid";
      }
      changedIds.add(change.id);
      finalKeys.delete(oldKey);
      finalKeys.set(nextKey, memoryIdFor(content));
      removals.push(existing);
      additions.push({ content, createdAt: now, kind: change.kind });
    }
    const rawByPath = new Map(state.files.map((file2) => [file2.path, file2.raw]));
    const removalsByPath = /* @__PURE__ */ new Map();
    for (const removal of removals) {
      const pathRemovals = removalsByPath.get(removal.path) ?? [];
      pathRemovals.push(removal);
      removalsByPath.set(removal.path, pathRemovals);
    }
    const touchedPaths = /* @__PURE__ */ new Set();
    for (const [path31, pathRemovals] of removalsByPath) {
      const lines2 = (rawByPath.get(path31) ?? "").split("\n");
      for (const removal of pathRemovals.sort((a, b2) => b2.firstLine - a.firstLine)) {
        lines2.splice(removal.firstLine, removal.lastLine - removal.firstLine + 1);
      }
      rawByPath.set(path31, lines2.join("\n"));
      touchedPaths.add(path31);
    }
    for (const addition of additions) {
      const path31 = addition.kind === "profile" ? this.profileFile : this.logFileForDate(addition.createdAt);
      const header = addition.kind === "profile" ? PROFILE_HEADER : LOG_HEADER;
      const raw = rawByPath.get(path31) ?? "";
      const base = raw.length === 0 ? header : raw;
      const separator = base.endsWith("\n") || base.length === 0 ? "" : "\n";
      rawByPath.set(
        path31,
        `${base}${separator}${serializeFactLine(addition.content, addition.createdAt)}
`
      );
      touchedPaths.add(path31);
    }
    for (const path31 of [...touchedPaths].sort()) {
      this.writeAtomic(path31, rawByPath.get(path31) ?? "");
    }
    for (const removal of removals) {
      this.clearOrigins(removal.content);
    }
    for (const addition of additions) {
      this.clearOrigins(addition.content);
      this.markOrigin(addition.content, "synthesis");
    }
    this.markTemporalReview(now);
    return "committed";
  }
  hasMemories() {
    return this.countMemories() > 0;
  }
  readSpooledEvidence() {
    if (!(0, import_node_fs74.existsSync)(this.evidenceDir)) return [];
    const evidence = [];
    for (const name17 of (0, import_node_fs74.readdirSync)(this.evidenceDir).sort()) {
      const id = memoryEvidenceIdFromFileName(name17);
      if (id === null) continue;
      const parsed2 = parseMemoryEvidenceFile(this.read((0, import_node_path122.join)(this.evidenceDir, name17)));
      if (parsed2 === null || parsed2.id !== id) {
        (0, import_node_fs74.rmSync)((0, import_node_path122.join)(this.evidenceDir, name17), { force: true });
        continue;
      }
      evidence.push(parsed2);
    }
    return evidence.sort((a, b2) => a.occurredAt - b2.occurredAt);
  }
  clearSpooledEvidence(ids) {
    for (const id of ids) {
      if (memoryEvidenceIdFromFileName(memoryEvidenceFileName(id)) === null) continue;
      (0, import_node_fs74.rmSync)((0, import_node_path122.join)(this.evidenceDir, memoryEvidenceFileName(id)), { force: true });
    }
  }
  isTemporalReviewDue(now) {
    const nextRefreshAt = Number.parseInt(this.read(this.refreshFile).trim(), 10);
    return !Number.isFinite(nextRefreshAt) || nextRefreshAt <= now;
  }
  markTemporalReview(now) {
    this.writeAtomic(this.refreshFile, `${now + MEMORY_SYNTHESIS_REFRESH_INTERVAL_MS}
`);
  }
  readSynthesisState() {
    const files = [
      {
        path: this.profileFile,
        kind: "profile",
        raw: this.read(this.profileFile)
      }
    ];
    for (const path31 of this.logFiles()) {
      files.push({ path: path31, kind: "log", raw: this.read(path31) });
    }
    const hash = (0, import_node_crypto58.createHash)("sha256");
    const facts = [];
    for (const file2 of files) {
      hash.update(file2.path);
      hash.update("\0");
      hash.update(file2.raw);
      hash.update("\0");
      for (const memory of parseFacts(file2.raw, file2.kind, facts.length, file2.path)) {
        facts.push({ ...memory, origin: this.memoryOrigin(memory.content) });
      }
    }
    return {
      files,
      facts,
      fingerprint: hash.digest("hex")
    };
  }
};
function listShardAgentIds(shardsDir) {
  let entries;
  try {
    entries = (0, import_node_fs74.readdirSync)(shardsDir, { withFileTypes: true });
  } catch (error42) {
    reportFallbackUnlessAbsent("memory_service", error42);
    return [];
  }
  return entries.filter((entry) => entry.isDirectory() && isSafeFolderId(entry.name)).map((entry) => entry.name).sort();
}
function shardVia(agentId, resolveAgentName) {
  const resolved = resolveAgentName(agentId)?.trim();
  return resolved != null && resolved.length > 0 ? resolved : agentId;
}
function readByAgentShardRecalls(shardsDir, recentLimit, resolveAgentName) {
  const shards = [];
  for (const agentId of listShardAgentIds(shardsDir)) {
    const recall = new FileMemoryStore((0, import_node_path122.join)(shardsDir, agentId)).recall(recentLimit);
    if (recall.profile.length === 0 && recall.recent.length === 0) continue;
    shards.push({ via: shardVia(agentId, resolveAgentName), recall });
  }
  return shards;
}
function readByAgentShardRecords(shardsDir, resolveAgentName) {
  return mergeUserMemoryShardRecords(
    listShardAgentIds(shardsDir).map((agentId) => ({
      via: shardVia(agentId, resolveAgentName),
      records: new FileMemoryStore((0, import_node_path122.join)(shardsDir, agentId)).listMemories(MEMORY_SCAN_ALL)
    }))
  );
}
var UserMemoryStore = class {
  constructor(sandRoot, ownAgentId, resolveAgentName) {
    this.resolveAgentName = resolveAgentName;
    this.userMemoryDir = getUserMemoryDir(sandRoot);
    this.shardsDir = getUserMemoryShardsDir(sandRoot);
    this.ownShardDir = getUserMemoryShardDir(sandRoot, ownAgentId);
  }
  resolveAgentName;
  userMemoryDir;
  shardsDir;
  ownShardDir;
  getLocation() {
    return this.userMemoryDir;
  }
  getOwnShardLocation() {
    return this.ownShardDir;
  }
  recall(limits) {
    return mergeUserMemoryShards(
      readByAgentShardRecalls(this.shardsDir, limits.recentLimit, this.resolveAgentName),
      limits
    );
  }
  listAll() {
    return readByAgentShardRecords(this.shardsDir, this.resolveAgentName);
  }
};
var MemoryService = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  synthesisService = null;
  createAgentStore(agentDir) {
    const agentId = (0, import_node_path122.basename)(agentDir);
    return new FileMemoryStore(getAgentMemoryDir(agentDir), {
      isEnabled: () => this.synthesisService != null,
      record: (evidence) => {
        this.synthesisService?.recordTurn(agentId, evidence);
      }
    });
  }
  agentHasContent(agentDir) {
    return agentMemoryHasContent(agentDir);
  }
  enableMemorySynthesis(options2) {
    if (this.synthesisService != null) return;
    const synthesis = new MemorySynthesisService({
      ...options2,
      getTarget: (agentId) => this.synthesisTargetForAgent(agentId),
      listTargets: () => this.listSynthesisTargets()
    });
    this.synthesisService = synthesis;
    synthesis.start();
  }
  createUserMemory(options2) {
    return new UserMemoryStore(this.options.sandRoot, options2.agentId, options2.resolveAgentName);
  }
  dispose() {
    this.synthesisService?.dispose();
    this.synthesisService = null;
  }
  synthesisTargetForAgent(agentId) {
    if (!isSafeFolderId(agentId)) return null;
    const agentDir = (0, import_node_path122.join)(this.options.agentsRootDir, agentId);
    try {
      if (!(0, import_node_fs74.statSync)(agentDir).isDirectory()) return null;
    } catch (error42) {
      reportFallbackUnlessAbsent("memory_service", error42);
      return null;
    }
    return new FileMemoryStore(getAgentMemoryDir(agentDir));
  }
  listSynthesisTargets() {
    let entries;
    try {
      entries = (0, import_node_fs74.readdirSync)(this.options.agentsRootDir, {
        withFileTypes: true
      });
    } catch (error42) {
      reportFallbackUnlessAbsent("memory_service", error42);
      return [];
    }
    const targets = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || !isSafeFolderId(entry.name)) continue;
      const target = this.synthesisTargetForAgent(entry.name);
      if (target != null) {
        targets.push({ agentId: entry.name, target });
      }
    }
    return targets.sort((a, b2) => a.agentId.localeCompare(b2.agentId));
  }
};
