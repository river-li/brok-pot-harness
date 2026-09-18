var import_node_fs58 = require("node:fs");
var import_node_path101 = require("node:path");
var import_node_url13 = require("node:url");
var import_node_worker_threads2 = require("node:worker_threads");
init_errors();
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
var WorkerSearchIndexJobPort = class {
  worker;
  pending = /* @__PURE__ */ new Map();
  nextRequestId = 1;
  isDead = false;
  constructor(entryPath, config2) {
    this.worker = new import_node_worker_threads2.Worker(entryPath, { workerData: config2 });
    this.worker.on("message", (response) => {
      const settle = this.pending.get(response.requestId);
      if (settle == null) return;
      this.pending.delete(response.requestId);
      settle(
        response.ok ? { ok: true } : {
          ok: false,
          message: response.message ?? "search index job failed",
          isIndexCorrupt: response.isIndexCorrupt === true,
          isWorkerUnavailable: false
        }
      );
    });
    this.worker.on("error", (error41) => this.die(error41));
    this.worker.on("exit", (code) => this.die(new Error(`search-index worker exited (${code})`)));
  }
  die(error41) {
    if (this.isDead) return;
    this.isDead = true;
    const failure2 = {
      ok: false,
      message: error41.message,
      isIndexCorrupt: false,
      isWorkerUnavailable: true
    };
    for (const settle of this.pending.values()) settle(failure2);
    this.pending.clear();
  }
  post(job) {
    if (this.isDead) {
      return Promise.resolve({
        ok: false,
        message: "search-index worker is no longer running",
        isIndexCorrupt: false,
        isWorkerUnavailable: true
      });
    }
    const requestId2 = this.nextRequestId++;
    return new Promise((resolve29) => {
      this.pending.set(requestId2, resolve29);
      const request3 = { requestId: requestId2, job };
      this.worker.postMessage(request3);
    });
  }
  async terminate() {
    this.die(new Error("search-index worker terminated"));
    await this.worker.terminate();
  }
};
var SandSearchIndexService = class {
  indexDbPath;
  agentsRootDir;
  createJobPort;
  disposeDeadline;
  report;
  isFtsEnabled;
  db;
  port;
  isUnavailable = false;
  isDisposed = false;
  isReconcileDone = false;
  isRebuildPending = false;
  pendingReindexCount = 0;
  rebuildCount = 0;
  workerRespawnCount = 0;
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
  }
  start() {
    if (this.isDisposed || this.isUnavailable) return;
    if (this.db == null) {
      try {
        this.db = this.openAndMigrate();
      } catch (error41) {
        this.markUnavailable("open", error41);
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
    const db = this.db;
    if (db == null || this.isUnavailable) return null;
    try {
      return searchMessages(db, query, limit, this.isFtsEnabled);
    } catch (error41) {
      this.handleIndexFailure("search-messages", error41);
      return null;
    }
  }
  searchMedia(query, limit) {
    const db = this.db;
    if (db == null || this.isUnavailable) return null;
    try {
      return searchMedia(db, query, limit, this.isFtsEnabled);
    } catch (error41) {
      this.handleIndexFailure("search-media", error41);
      return null;
    }
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
    await this.disposeDeadline.run(async () => await this.jobTail).catch((error41) => {
      this.report({ kind: "dispose_drain_cut", errorClass: errorLogTag(error41) });
    });
    await this.terminateWorker(this.port, "dispose");
    this.port = void 0;
    try {
      this.db?.close();
    } catch {
    }
    this.db = void 0;
  }
  async terminateWorker(port, stage) {
    await port?.terminate().catch((error41) => {
      this.report({ kind: "worker_terminate_failed", stage, errorClass: errorLogTag(error41) });
    });
  }
  markUnavailable(stage, error41) {
    this.isUnavailable = true;
    const port = this.port;
    this.port = void 0;
    void this.terminateWorker(port, "unavailable teardown");
    try {
      this.db?.close();
    } catch {
    }
    this.db = void 0;
    this.report({ kind: "unavailable", stage, errorClass: errorLogTag(error41) });
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
    (0, import_node_fs58.mkdirSync)((0, import_node_path101.dirname)(this.indexDbPath), { recursive: true });
    let db;
    try {
      db = openSearchIndexDb(this.indexDbPath);
      const fileMode = readSearchIndexFileMode(db);
      if (fileMode !== "fresh" && fileMode === "fts" !== this.isFtsEnabled) {
        db.close();
        return this.recreateIndexFile();
      }
      ensureSearchIndexSchema(db, this.isFtsEnabled);
    } catch (error41) {
      this.report({ kind: "stage_failed", stage: "open", errorClass: errorLogTag(error41) });
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
      (0, import_node_fs58.rmSync)(`${this.indexDbPath}${suffix}`, { force: true });
    }
  }
  handleIndexFailure(stage, error41) {
    if (this.isDisposed || this.isUnavailable) return;
    if (isSqliteCorruptError(error41)) {
      this.scheduleRebuild(stage, error41);
      return;
    }
    this.report({ kind: "stage_failed", stage, errorClass: errorLogTag(error41) });
  }
  scheduleRebuild(stage, error41) {
    if (this.isDisposed || this.isUnavailable || this.isRebuildPending) {
      return;
    }
    this.rebuildCount += 1;
    if (this.rebuildCount > MAX_INDEX_REBUILDS) {
      this.markUnavailable(stage, error41);
      return;
    }
    this.report({ kind: "corrupt_rebuild", stage, count: this.rebuildCount });
    this.isReconcileDone = false;
    this.isRebuildPending = true;
    const port = this.port;
    this.port = void 0;
    this.jobTail = this.jobTail.then(async () => {
      await this.terminateWorker(port, "rebuild");
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
  enqueue(job) {
    if (this.isDisposed || this.isUnavailable || this.db == null) return;
    this.jobTail = this.jobTail.then(() => this.runJob(job)).catch((error41) => {
      this.report({ kind: "dispatch_failed", errorClass: errorLogTag(error41) });
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
