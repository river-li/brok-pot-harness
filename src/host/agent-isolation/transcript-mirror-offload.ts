function defaultMirrorWorkerEntryPath() {
  const here = (0, import_node_path180.dirname)((0, import_node_url19.fileURLToPath)(__import_meta_url));
  return (0, import_node_path180.join)(here, "agent-isolation", "transcript-mirror-worker.cjs");
}
var DEFAULT_MIRROR_WORKERS = 2;
var MirrorWorkerConnection = class {
  constructor(workerEntryPath, onExit, reportHostLog) {
    this.onExit = onExit;
    this.worker = new import_node_worker_threads4.Worker(workerEntryPath, { stdout: true, stderr: true });
    forwardStream(this.worker.stdout, (message) => reportHostLog("info", message));
    forwardStream(this.worker.stderr, (message) => reportHostLog("error", message));
    this.worker.on("message", (response) => {
      const entry = this.pending.get(response.requestId);
      if (entry == null) return;
      this.pending.delete(response.requestId);
      if (response.kind === "error") entry.reject(new Error(response.message));
      else entry.resolve(response);
    });
    this.worker.on("error", (error42) => this.die(error42));
    this.worker.on("exit", (code) => {
      this.die(new Error(`mirror worker exited with code ${code}`));
    });
  }
  onExit;
  worker;
  pending = /* @__PURE__ */ new Map();
  nextRequestId = 1;
  isDead = false;
  die(error42) {
    if (this.isDead) return;
    this.isDead = true;
    for (const [, entry] of this.pending) entry.reject(error42);
    this.pending.clear();
    this.onExit(this);
  }
  isAlive() {
    return !this.isDead;
  }
  send(build2, transfer = []) {
    if (this.isDead) {
      return Promise.reject(new Error("mirror worker is no longer running"));
    }
    const requestId2 = this.nextRequestId++;
    const request5 = build2(requestId2);
    return new Promise((resolve29, reject2) => {
      this.pending.set(requestId2, {
        resolve: (response) => resolve29(response),
        reject: reject2
      });
      this.worker.postMessage(request5, transfer);
    });
  }
  async write(job) {
    const response = await this.send(
      (requestId2) => ({ kind: "mirror-write", requestId: requestId2, ...job }),
      [job.stateBlobId.buffer]
    );
    return response.written;
  }
  async close() {
    if (this.isDead) return;
    try {
      await this.send((requestId2) => ({ kind: "close", requestId: requestId2 }));
    } catch {
    }
    await this.worker.terminate();
  }
};
var MirrorOffloadPoolClosedError = class extends SandDomainError {
  name = "MirrorOffloadPoolClosedError";
  constructor() {
    super("mirror offload pool is closed");
  }
};
var TranscriptMirrorOffloadPool = class {
  constructor(options2) {
    this.options = options2;
    this.workerEntryPath = options2.workerEntryPath ?? defaultMirrorWorkerEntryPath();
    this.maxWorkers = options2.maxWorkers ?? DEFAULT_MIRROR_WORKERS;
    this.workers = new Array(this.maxWorkers).fill(null);
  }
  options;
  workerEntryPath;
  maxWorkers;
  workers;
  lanes = /* @__PURE__ */ new Map();
  isClosed = false;
  workerIndexFor(conversationId) {
    let hash = 0;
    for (let i = 0; i < conversationId.length; i++) {
      hash = hash * 31 + conversationId.charCodeAt(i) | 0;
    }
    return Math.abs(hash) % this.maxWorkers;
  }
  connectionFor(conversationId) {
    if (this.isClosed) throw new MirrorOffloadPoolClosedError();
    const index = this.workerIndexFor(conversationId);
    const existing = this.workers[index];
    if (existing != null && existing.isAlive()) return existing;
    const connection = new MirrorWorkerConnection(
      this.workerEntryPath,
      (self2) => {
        if (this.workers[index] === self2) this.workers[index] = null;
      },
      this.options.reportHostLog
    );
    this.workers[index] = connection;
    return connection;
  }
  write(job) {
    if (this.isClosed) {
      return Promise.reject(new MirrorOffloadPoolClosedError());
    }
    const lane = this.lanes.get(job.conversationId) ?? {
      isRunning: false,
      queued: null
    };
    this.lanes.set(job.conversationId, lane);
    return new Promise((resolve29, reject2) => {
      const resolver = { resolve: resolve29, reject: reject2 };
      if (lane.isRunning) {
        if (lane.queued == null) {
          lane.queued = { job, resolvers: [resolver] };
        } else {
          lane.queued.job = job;
          lane.queued.resolvers.push(resolver);
        }
        return;
      }
      lane.isRunning = true;
      void this.runJob(lane, { job, resolvers: [resolver] });
    });
  }
  async runJob(lane, entry) {
    try {
      const written = await this.connectionFor(entry.job.conversationId).write(entry.job);
      for (const resolver of entry.resolvers) resolver.resolve(written);
    } catch (error42) {
      const failure2 = error42 instanceof Error ? error42 : new Error(String(error42));
      for (const resolver of entry.resolvers) resolver.reject(failure2);
    } finally {
      const next = lane.queued;
      lane.queued = null;
      if (next != null) {
        void this.runJob(lane, next);
      } else {
        lane.isRunning = false;
        this.lanes.delete(entry.job.conversationId);
      }
    }
  }
  async closeAll() {
    this.isClosed = true;
    const open9 = this.workers.filter((worker) => worker != null);
    this.workers.fill(null);
    await Promise.all(open9.map((worker) => worker.close()));
  }
};
function warnStaleMirror(conversationId, reason, error42) {
  reportHostDiagnostic({
    kind: "transcript_mirror_stale",
    agentId: conversationId,
    reason,
    errorClass: error42 !== void 0 ? errorLogTag(error42) : void 0
  });
}
var OffloadingTranscriptMirror = class _OffloadingTranscriptMirror {
  constructor(inline, pool, options2, previousRootPromptCount = 0) {
    this.inline = inline;
    this.pool = pool;
    this.options = options2;
    this.previousRootPromptCount = previousRootPromptCount;
  }
  inline;
  pool;
  options;
  previousRootPromptCount;
  writeLane = Promise.resolve();
  static forTranscriptsDir(pool, options2, previousRootPromptCount = 0) {
    return new _OffloadingTranscriptMirror(
      new LegacyFileTranscriptMirror(options2.transcriptsDir),
      pool,
      options2,
      previousRootPromptCount
    );
  }
  async writeSerialized(ctx, conversationId, state, blobStore, stateBlobId) {
    const writtenCount = await this.inline.writeIncremental(
      ctx,
      conversationId,
      state,
      blobStore,
      this.previousRootPromptCount
    );
    if (writtenCount != null) {
      this.previousRootPromptCount = writtenCount;
      return;
    }
    const isFileBackedStore = blobStore instanceof WorkerBlobStore;
    if (!isFileBackedStore) {
      const written = await this.inline.writeFull(ctx, conversationId, state, blobStore);
      if (written) {
        this.previousRootPromptCount = state.rootPromptMessagesJson.length;
      } else {
        warnStaleMirror(conversationId, "full-write-failed");
      }
      return;
    }
    if (stateBlobId == null || stateBlobId.length === 0) {
      warnStaleMirror(conversationId, "worker-unavailable");
      return;
    }
    try {
      const written = await this.pool().write({
        conversationId,
        stateBlobId: new Uint8Array(stateBlobId),
        blobDbPaths: this.options.blobDbPaths,
        transcriptsDir: this.options.transcriptsDir
      });
      if (written) {
        this.previousRootPromptCount = state.rootPromptMessagesJson.length;
        return;
      }
      warnStaleMirror(conversationId, "worker-write-failed");
    } catch (error42) {
      warnStaleMirror(conversationId, "worker-write-failed", error42);
    }
  }
  write(ctx, conversationId, state, blobStore, stateBlobId) {
    const write2 = this.writeLane.then(
      () => this.writeSerialized(ctx, conversationId, state, blobStore, stateBlobId)
    );
    this.writeLane = write2.then(
      () => void 0,
      () => void 0
    );
    return write2;
  }
};
