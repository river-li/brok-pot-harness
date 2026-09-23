var import_node_fs60 = require("node:fs");
var import_node_path101 = require("node:path");
var import_node_url13 = require("node:url");
var import_node_worker_threads2 = require("node:worker_threads");
init_errors();
init_invariant();
var MAX_INDEX_REBUILDS = 3;
var MAX_WORKER_RESPAWNS = 3;
var MAX_FAILED_JOB_RECONCILES = 3;
var SEARCH_INDEX_DISPOSE_TIMEOUT_MS = 2e3;
function defaultWorkerEntryPath() {
  return (0, import_node_path101.join)(
    (0, import_node_path101.dirname)((0, import_node_url13.fileURLToPath)(__import_meta_url)),
    "extensions",
    "content-search",
    "search-index-worker.cjs"
  );
}
var SearchIndexWorkerChannel = class {
  worker;
  pending = /* @__PURE__ */ new Map();
  nextRequestId = 1;
  isLost = false;
  constructor(entryPath, workerData) {
    this.worker = new import_node_worker_threads2.Worker(entryPath, { workerData });
    this.worker.on("message", (response) => {
      const settle = this.pending.get(response.requestId);
      if (settle == null) return;
      this.pending.delete(response.requestId);
      settle({ kind: "response", response });
    });
    this.worker.on("error", (error42) => this.lose(error42.message));
    this.worker.on("exit", (code) => this.lose(`search-index worker exited (${code})`));
  }
  lose(message) {
    if (this.isLost) return;
    this.isLost = true;
    for (const settle of this.pending.values()) settle({ kind: "lost", message });
    this.pending.clear();
  }
  request(build2) {
    if (this.isLost) {
      return Promise.resolve({ kind: "lost", message: "search-index worker is no longer running" });
    }
    const requestId2 = this.nextRequestId++;
    return new Promise((resolve29) => {
      this.pending.set(requestId2, resolve29);
      this.worker.postMessage(build2(requestId2));
    });
  }
  async terminate() {
    this.lose("search-index worker terminated");
    await this.worker.terminate();
  }
};
var WorkerSearchIndexJobPort = class {
  channel;
  constructor(entryPath, config2) {
    this.channel = new SearchIndexWorkerChannel(entryPath, { role: "writer", ...config2 });
  }
  async post(job) {
    const reply2 = await this.channel.request((requestId2) => ({ requestId: requestId2, job }));
    if (reply2.kind === "lost") {
      return {
        ok: false,
        message: reply2.message,
        isIndexCorrupt: false,
        isWorkerUnavailable: true
      };
    }
    const { response } = reply2;
    return response.ok ? { ok: true } : {
      ok: false,
      message: response.message ?? "search index job failed",
      isIndexCorrupt: response.isIndexCorrupt === true,
      isWorkerUnavailable: false
    };
  }
  terminate() {
    return this.channel.terminate();
  }
};
var WorkerSearchIndexQueryPort = class {
  channel;
  constructor(entryPath, config2) {
    this.channel = new SearchIndexWorkerChannel(entryPath, { role: "reader", ...config2 });
  }
  async run(query) {
    const reply2 = await this.channel.request((requestId2) => ({ requestId: requestId2, query }));
    if (reply2.kind === "lost") return { ok: false, reason: "reader-lost", message: reply2.message };
    const { response } = reply2;
    if (response.ok) return response;
    return response.isIndexCorrupt ? { ok: false, reason: "index-corrupt", message: response.message } : { ok: false, reason: "query-failed", errorClass: response.errorClass };
  }
  async searchMessages(query, limit) {
    const result = await this.run({ kind: "messages", query, limit });
    if (!result.ok) return result;
    invariant(result.kind === "messages", "search-index reader answered messages with media");
    return { ok: true, matches: result.matches };
  }
  async searchMedia(query, limit) {
    const result = await this.run({ kind: "media", query, limit });
    if (!result.ok) return result;
    invariant(result.kind === "media", "search-index reader answered media with messages");
    return { ok: true, matches: result.matches };
  }
  terminate() {
    return this.channel.terminate();
  }
};
var SandSearchIndexService = class {
  indexDbPath;
  agentsRootDir;
  createJobPort;
  createQueryPort;
  disposeDeadline;
  report;
  isFtsEnabled;
  db;
  port;
  queryPort;
  isUnavailable = false;
  isDisposed = false;
  isReconcileDone = false;
  isRebuildPending = false;
  pendingReindexCount = 0;
  rebuildCount = 0;
  workerRespawnCount = 0;
  readerRespawnCount = 0;
  failedJobReconcileCount = 0;
  jobTail = Promise.resolve();
  constructor(options2) {
    this.indexDbPath = options2.indexDbPath;
    this.agentsRootDir = options2.agentsRootDir;
    this.disposeDeadline = options2.disposeDeadline;
    this.report = options2.report ?? (() => {
    });
    this.isFtsEnabled = options2.isFtsAvailable ?? isFts5Available();
    const entryPath = options2.workerEntryPath ?? defaultWorkerEntryPath();
    this.createJobPort = options2.createJobPort ?? ((config2) => new WorkerSearchIndexJobPort(entryPath, config2));
    this.createQueryPort = options2.createQueryPort ?? ((config2) => new WorkerSearchIndexQueryPort(entryPath, config2));
  }
  start() {
    if (this.isDisposed || this.isUnavailable) return;
    if (this.db == null) {
      try {
        this.db = this.openAndMigrate();
      } catch (error42) {
        this.markUnavailable("open", error42);
        return;
      }
      this.isReconcileDone = this.safeReadReconcileDone();
    }
    this.enqueue({ kind: "reconcile" });
  }
  get isSearchReady() {
    return this.db != null && !this.isUnavailable && this.isReconcileDone && this.pendingReindexCount === 0;
  }
  searchMessages(query, limit) {
    return this.runQuery("search-messages", (port) => port.searchMessages(query, limit));
  }
  searchMedia(query, limit) {
    return this.runQuery("search-media", (port) => port.searchMedia(query, limit));
  }
  async runQuery(stage, run) {
    if (this.db == null || this.isDisposed || this.isUnavailable || this.isRebuildPending) {
      return null;
    }
    try {
      const port = this.getQueryPort();
      const result = await run(port);
      if (port !== this.queryPort) return null;
      if (result.ok) return result.matches;
      this.handleQueryFailure(stage, result);
    } catch (error42) {
      this.handleQueryFailure(stage, { reason: "query-failed", errorClass: errorLogTag(error42) });
    }
    return null;
  }
  applyMutation(mutation) {
    switch (mutation.kind) {
      case "entries-upserted":
        this.entriesUpserted(mutation.agentId, mutation.entries);
        return;
      case "entry-deleted":
        this.entryDeleted(mutation.agentId, mutation.entryId);
        return;
      case "conversation-cleared":
        this.conversationCleared(mutation.agentId);
        return;
      case "agent-removed":
        this.agentRemoved(mutation.agentId);
        return;
      case "agent-needs-reindex":
        this.agentNeedsReindex(mutation.agentId);
        return;
      default: {
        const exhaustive = mutation;
        return exhaustive;
      }
    }
  }
  entriesUpserted(agentId, entries) {
    const indexable = entries.filter(
      (entry) => entry.kind !== "spend-initiation"
    );
    if (indexable.length === 0) return;
    this.enqueue({ kind: "upsert-entries", agentId, entries: indexable });
  }
  entryDeleted(agentId, entryId) {
    this.enqueue({ kind: "delete-entry", agentId, entryId });
  }
  conversationCleared(agentId) {
    this.enqueue({ kind: "clear-agent", agentId });
  }
  agentRemoved(agentId) {
    this.enqueue({ kind: "clear-agent", agentId });
  }
  agentNeedsReindex(agentId) {
    if (this.isDisposed || this.isUnavailable || this.db == null) return;
    this.pendingReindexCount += 1;
    this.enqueue({ kind: "reindex-agents", agentIds: [agentId] });
  }
  whenIdle() {
    return this.jobTail;
  }
  async dispose() {
    this.isDisposed = true;
    await this.disposeDeadline.run(async () => await this.jobTail).catch((error42) => {
      this.report({ kind: "dispose_drain_cut", errorClass: errorLogTag(error42) });
    });
    await this.terminateWorker(this.port, "dispose");
    this.port = void 0;
    await this.terminateWorker(this.queryPort, "dispose");
    this.queryPort = void 0;
    try {
      this.db?.close();
    } catch {
    }
    this.db = void 0;
  }
  async terminateWorker(port, stage) {
    await port?.terminate().catch((error42) => {
      this.report({ kind: "worker_terminate_failed", stage, errorClass: errorLogTag(error42) });
    });
  }
  markUnavailable(stage, error42) {
    this.isUnavailable = true;
    const port = this.port;
    this.port = void 0;
    void this.terminateWorker(port, "unavailable teardown");
    const queryPort = this.queryPort;
    this.queryPort = void 0;
    void this.terminateWorker(queryPort, "unavailable teardown");
    try {
      this.db?.close();
    } catch {
    }
    this.db = void 0;
    this.report({ kind: "unavailable", stage, errorClass: errorLogTag(error42) });
  }
  safeReadReconcileDone() {
    const db = this.db;
    if (db == null) return false;
    try {
      return readReconcileDone(db);
    } catch {
      return false;
    }
  }
  openAndMigrate() {
    (0, import_node_fs60.mkdirSync)((0, import_node_path101.dirname)(this.indexDbPath), { recursive: true });
    let db;
    try {
      db = openSearchIndexDb(this.indexDbPath);
      const fileMode = readSearchIndexFileMode(db);
      if (fileMode !== "fresh" && fileMode === "fts" !== this.isFtsEnabled) {
        db.close();
        return this.recreateIndexFile();
      }
      ensureSearchIndexSchema(db, this.isFtsEnabled);
    } catch (error42) {
      this.report({ kind: "stage_failed", stage: "open", errorClass: errorLogTag(error42) });
      return this.recreateIndexFile();
    }
    if (readSearchIndexSchemaVersion(db) !== SEARCH_INDEX_SCHEMA_VERSION) {
      const isFreshFile = readSearchIndexSchemaVersion(db) === 0 && countIndexedMessages(db) === 0;
      if (isFreshFile) {
        stampSearchIndexSchemaVersion(db);
        return db;
      }
      try {
        db.close();
      } catch {
      }
      return this.recreateIndexFile();
    }
    return db;
  }
  recreateIndexFile() {
    this.removeIndexFiles();
    const db = openSearchIndexDb(this.indexDbPath);
    ensureSearchIndexSchema(db, this.isFtsEnabled);
    stampSearchIndexSchemaVersion(db);
    return db;
  }
  removeIndexFiles() {
    for (const suffix of ["", ...SQLITE_DB_SIDECAR_SUFFIXES]) {
      (0, import_node_fs60.rmSync)(`${this.indexDbPath}${suffix}`, { force: true });
    }
  }
  handleQueryFailure(stage, failure2) {
    if (this.isDisposed || this.isUnavailable) return;
    switch (failure2.reason) {
      case "index-corrupt":
        this.scheduleRebuild(stage, new Error(failure2.message));
        return;
      case "reader-lost":
        this.queryPort = void 0;
        this.readerRespawnCount += 1;
        if (this.readerRespawnCount > MAX_WORKER_RESPAWNS) {
          this.markUnavailable("worker-respawn", new Error(failure2.message));
          return;
        }
        this.report({ kind: "worker_respawn", count: this.readerRespawnCount });
        return;
      case "query-failed":
        this.report({ kind: "stage_failed", stage, errorClass: failure2.errorClass });
        return;
      default: {
        const exhaustive = failure2;
        return exhaustive;
      }
    }
  }
  scheduleRebuild(stage, error42) {
    if (this.isDisposed || this.isUnavailable || this.isRebuildPending) {
      return;
    }
    this.rebuildCount += 1;
    if (this.rebuildCount > MAX_INDEX_REBUILDS) {
      this.markUnavailable(stage, error42);
      return;
    }
    this.report({ kind: "corrupt_rebuild", stage, count: this.rebuildCount });
    this.isReconcileDone = false;
    this.isRebuildPending = true;
    const port = this.port;
    this.port = void 0;
    const queryPort = this.queryPort;
    this.queryPort = void 0;
    this.jobTail = this.jobTail.then(async () => {
      await this.terminateWorker(port, "rebuild");
      await this.terminateWorker(queryPort, "rebuild");
      try {
        this.db?.close();
      } catch {
      }
      this.db = this.recreateIndexFile();
    }).catch((rebuildError) => {
      this.markUnavailable("rebuild", rebuildError);
    }).finally(() => {
      this.isRebuildPending = false;
    });
    this.enqueue({ kind: "reconcile" });
  }
  getPort() {
    if (this.port == null) {
      this.port = this.createJobPort({
        indexDbPath: this.indexDbPath,
        agentsRootDir: this.agentsRootDir
      });
    }
    return this.port;
  }
  getQueryPort() {
    if (this.queryPort == null) {
      this.queryPort = this.createQueryPort({
        indexDbPath: this.indexDbPath,
        isFtsEnabled: this.isFtsEnabled
      });
    }
    return this.queryPort;
  }
  enqueue(job) {
    if (this.isDisposed || this.isUnavailable || this.db == null) return;
    this.jobTail = this.jobTail.then(() => this.runJob(job)).catch((error42) => {
      this.report({ kind: "dispatch_failed", errorClass: errorLogTag(error42) });
    });
  }
  async runJob(job) {
    try {
      await this.dispatchJob(job);
    } finally {
      if (job.kind === "reindex-agents") {
        this.pendingReindexCount = Math.max(0, this.pendingReindexCount - 1);
      }
    }
  }
  async dispatchJob(job) {
    if (this.isDisposed || this.isUnavailable || this.db == null) return;
    const result = await this.getPort().post(job);
    if (result.ok) {
      if (job.kind === "reconcile") this.isReconcileDone = true;
      return;
    }
    if (result.isIndexCorrupt) {
      this.scheduleRebuild(`job-${job.kind}`, new Error(result.message));
      return;
    }
    if (result.isWorkerUnavailable) {
      this.port = void 0;
      this.workerRespawnCount += 1;
      if (this.workerRespawnCount > MAX_WORKER_RESPAWNS) {
        this.markUnavailable("worker-respawn", new Error(result.message));
        return;
      }
      this.report({ kind: "worker_respawn", count: this.workerRespawnCount });
      this.isReconcileDone = false;
      this.enqueue({ kind: "reconcile" });
      return;
    }
    this.failedJobReconcileCount += 1;
    if (this.failedJobReconcileCount > MAX_FAILED_JOB_RECONCILES) {
      this.markUnavailable(`job-${job.kind}`, new Error(result.message));
      return;
    }
    if (job.kind === "reindex-agents") {
      this.report({ kind: "job_retry", stage: job.kind, count: this.failedJobReconcileCount });
      this.pendingReindexCount += 1;
      this.enqueue(job);
      return;
    }
    this.report({ kind: "job_reconcile", stage: job.kind, count: this.failedJobReconcileCount });
    this.isReconcileDone = false;
    this.enqueue({ kind: "reconcile" });
  }
};
function countIndexedMessages(db) {
  try {
    const row = db.prepare("SELECT COUNT(*) AS count FROM messages").get();
    return typeof row?.count === "number" ? row.count : 0;
  } catch {
    return 0;
  }
}
