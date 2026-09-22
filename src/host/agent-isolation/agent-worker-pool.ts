function defaultWorkerEntryPath2() {
  const here = (0, import_node_path126.dirname)((0, import_node_url14.fileURLToPath)(__import_meta_url));
  return (0, import_node_path126.join)(here, "agent-isolation", "agent-store-worker.cjs");
}
function rebuildWorkerError(response) {
  const error42 = new Error(response.message);
  if (response.name != null) error42.name = response.name;
  if (response.code != null) {
    error42.code = response.code;
  }
  return error42;
}
var AgentWorkerConnection = class {
  constructor(workerEntryPath, boot, onExit, reportHostLog) {
    this.onExit = onExit;
    this.worker = new import_node_worker_threads3.Worker(workerEntryPath, {
      workerData: boot,
      stdout: true,
      stderr: true
    });
    forwardStream(this.worker.stdout, (message) => reportHostLog("info", message));
    forwardStream(this.worker.stderr, (message) => reportHostLog("error", message));
    this.worker.on("message", (response) => {
      const entry = this.pending.get(response.requestId);
      if (entry == null) return;
      if (response.kind === "walk-export-closure-progress") {
        entry.onProgress?.(response.progress);
        return;
      }
      this.pending.delete(response.requestId);
      if (response.kind === "error") {
        entry.reject(rebuildWorkerError(response));
      } else {
        entry.resolve(response);
      }
    });
    this.worker.on("error", (error42) => this.die(error42));
    this.worker.on("exit", (code) => {
      if (code !== 0) this.die(new Error(`worker exited with code ${code}`));
      else this.die(new Error("worker exited"));
    });
  }
  onExit;
  worker;
  pending = /* @__PURE__ */ new Map();
  nextRequestId = 1;
  isDead = false;
  lastActivityAt = Date.now();
  workerThreadId = null;
  workerPid = null;
  die(error42) {
    if (this.isDead) return;
    this.isDead = true;
    for (const [, entry] of this.pending) entry.reject(error42);
    this.pending.clear();
    this.onExit(this);
  }
  send(build2, transfer = [], onProgress) {
    if (this.isDead) {
      return Promise.reject(new Error("worker is no longer running"));
    }
    this.lastActivityAt = Date.now();
    const requestId2 = this.nextRequestId++;
    const request5 = build2(requestId2);
    return new Promise((resolve29, reject2) => {
      this.pending.set(requestId2, {
        resolve: (response) => {
          this.lastActivityAt = Date.now();
          resolve29(response);
        },
        reject: (error42) => {
          this.lastActivityAt = Date.now();
          reject2(error42);
        },
        ...onProgress === void 0 ? {} : { onProgress }
      });
      this.worker.postMessage(request5, transfer);
    });
  }
  activityAt() {
    return this.lastActivityAt;
  }
  threadId() {
    return this.workerThreadId;
  }
  pid() {
    return this.workerPid;
  }
  async init(boot) {
    const response = await this.send(
      (requestId2) => ({
        kind: "init",
        requestId: requestId2,
        agentId: boot.agentId,
        blobDbPath: boot.blobDbPath,
        busyTimeoutMs: boot.busyTimeoutMs
      })
    );
    this.workerThreadId = response.threadId;
    this.workerPid = response.pid;
  }
  async setBlob(blobId, blobData) {
    await this.send((requestId2) => ({
      kind: "set-blob",
      requestId: requestId2,
      blobId,
      blobData
    }));
  }
  async getBlob(blobId) {
    const response = await this.send(
      (requestId2) => ({ kind: "get-blob", requestId: requestId2, blobId })
    );
    return response.blobData;
  }
  async findLatestRootBlobId() {
    const response = await this.send(
      (requestId2) => ({ kind: "find-latest-root", requestId: requestId2 })
    );
    return response.rootId;
  }
  async clearBlobs() {
    await this.send((requestId2) => ({ kind: "clear-blobs", requestId: requestId2 }));
  }
  async clearStaleCheckpointRoots(retainedRootIdHex) {
    const response = await this.send((requestId2) => ({
      kind: "clear-stale-roots",
      requestId: requestId2,
      retainedRootIdHex
    }));
    return response.deleted;
  }
  async collectGarbage(retainedRootIdHex, pendingWriteRetentionMs) {
    const response = await this.send(
      (requestId2) => ({
        kind: "collect-garbage",
        requestId: requestId2,
        retainedRootIdHex,
        pendingWriteRetentionMs
      })
    );
    return response.result;
  }
  async verifyLegacyBlobRetirement(retainedRootIdHex, legacyBlobDbPath) {
    const response = await this.send((requestId2) => ({
      kind: "verify-legacy-blob-retirement",
      requestId: requestId2,
      retainedRootIdHex,
      legacyBlobDbPath
    }));
    return response.verdict;
  }
  async walkExportClosure(retainedRootIdHex, limits, onProgress) {
    const response = await this.send(
      (requestId2) => ({
        kind: "walk-export-closure",
        requestId: requestId2,
        retainedRootIdHex,
        maxClosureBytes: limits.maxClosureBytes,
        maxClosureBlobs: limits.maxClosureBlobs
      }),
      [],
      onProgress
    );
    return response.result;
  }
  async getBlobsByHexIds(blobIdsHex) {
    const response = await this.send(
      (requestId2) => ({ kind: "get-blobs", requestId: requestId2, blobIdsHex })
    );
    return response.blobs;
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
var DEFAULT_IDLE_TIMEOUT_MS = 5 * 6e4;
var DEFAULT_MAX_WORKERS = 64;
var DEFAULT_SWEEP_INTERVAL_MS = 3e4;
var AgentWorkerPool = class {
  constructor(options2) {
    this.options = options2;
    this.workerEntryPath = options2.workerEntryPath ?? defaultWorkerEntryPath2();
    this.busyTimeoutMs = options2.busyTimeoutMs ?? 5e3;
    this.idleTimeoutMs = options2.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS;
    this.maxWorkers = options2.maxWorkers ?? DEFAULT_MAX_WORKERS;
    this.sweepIntervalMs = options2.sweepIntervalMs ?? DEFAULT_SWEEP_INTERVAL_MS;
  }
  options;
  workerEntryPath;
  busyTimeoutMs;
  idleTimeoutMs;
  maxWorkers;
  sweepIntervalMs;
  connections = /* @__PURE__ */ new Map();
  activeOps = /* @__PURE__ */ new Map();
  sweepTimer = null;
  async ensure(agentId, blobDbPath, legacyBlobDbPath) {
    const existing = this.connections.get(blobDbPath);
    if (existing != null) return existing;
    this.evictForCapacity();
    const boot = {
      agentId,
      blobDbPath,
      busyTimeoutMs: this.busyTimeoutMs,
      legacyBlobDbPath
    };
    const connection = new AgentWorkerConnection(
      this.workerEntryPath,
      boot,
      (self2) => {
        if (this.connections.get(blobDbPath) === self2) {
          this.connections.delete(blobDbPath);
          if (this.connections.size === 0) this.stopSweep();
        }
      },
      this.options.reportHostLog
    );
    this.connections.set(blobDbPath, connection);
    this.startSweep();
    await connection.init(boot);
    this.options.reportHostLog(
      "info",
      `[agent-isolation] spawned worker for agent ${agentId} on thread ${connection.threadId()} (pid ${connection.pid()}, active workers: ${this.connections.size})`
    );
    return connection;
  }
  async setBlob(agentId, blobDbPath, blobId, blobData, legacyBlobDbPath) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      await connection.setBlob(blobId, blobData);
    } finally {
      this.release(blobDbPath);
    }
  }
  async getBlob(agentId, blobDbPath, blobId, legacyBlobDbPath) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.getBlob(blobId);
    } finally {
      this.release(blobDbPath);
    }
  }
  async findLatestRootBlobId({
    agentId,
    blobDbPath,
    legacyBlobDbPath
  }) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.findLatestRootBlobId();
    } finally {
      this.release(blobDbPath);
    }
  }
  async clearBlobs(agentId, blobDbPath, legacyBlobDbPath) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      await connection.clearBlobs();
    } finally {
      this.release(blobDbPath);
    }
  }
  async clearStaleCheckpointRoots(agentId, blobDbPath, retainedRootIdHex, legacyBlobDbPath) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.clearStaleCheckpointRoots(retainedRootIdHex);
    } finally {
      this.release(blobDbPath);
    }
  }
  async collectConversationGarbage({
    agentId,
    blobDbPath,
    retainedRootIdHex,
    pendingWriteRetentionMs,
    legacyBlobDbPath
  }) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.collectGarbage(retainedRootIdHex, pendingWriteRetentionMs);
    } finally {
      this.release(blobDbPath);
    }
  }
  async verifyLegacyBlobRetirement({
    agentId,
    blobDbPath,
    legacyBlobDbPath,
    retainedRootIdHex
  }) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.verifyLegacyBlobRetirement(retainedRootIdHex, legacyBlobDbPath);
    } finally {
      this.release(blobDbPath);
    }
  }
  async walkExportClosure({
    agentId,
    blobDbPath,
    retainedRootIdHex,
    legacyBlobDbPath,
    maxClosureBytes,
    maxClosureBlobs,
    onProgress
  }) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.walkExportClosure(
        retainedRootIdHex,
        {
          maxClosureBytes,
          maxClosureBlobs
        },
        onProgress
      );
    } finally {
      this.release(blobDbPath);
    }
  }
  async getConversationBlobsByHexIds({ agentId, blobDbPath, legacyBlobDbPath }, blobIdsHex) {
    this.retain(blobDbPath);
    try {
      const connection = await this.ensure(agentId, blobDbPath, legacyBlobDbPath);
      return await connection.getBlobsByHexIds(blobIdsHex);
    } finally {
      this.release(blobDbPath);
    }
  }
  async closeStore(blobDbPath) {
    const connection = this.connections.get(blobDbPath);
    if (connection == null) return;
    this.connections.delete(blobDbPath);
    if (this.connections.size === 0) this.stopSweep();
    await connection.close();
  }
  async closeAll() {
    this.stopSweep();
    const all = [...this.connections.values()];
    this.connections.clear();
    await Promise.all(all.map((connection) => connection.close()));
  }
  activeWorkerCount() {
    return this.connections.size;
  }
  describeWorkers() {
    return [...this.connections].map(([blobDbPath, connection]) => ({
      blobDbPath,
      threadId: connection.threadId(),
      pid: connection.pid()
    }));
  }
  retain(blobDbPath) {
    this.activeOps.set(blobDbPath, (this.activeOps.get(blobDbPath) ?? 0) + 1);
  }
  release(blobDbPath) {
    const next = (this.activeOps.get(blobDbPath) ?? 0) - 1;
    if (next <= 0) this.activeOps.delete(blobDbPath);
    else this.activeOps.set(blobDbPath, next);
  }
  isRetained(blobDbPath) {
    return (this.activeOps.get(blobDbPath) ?? 0) > 0;
  }
  evictForCapacity() {
    if (this.connections.size < this.maxWorkers) return;
    let victimPath = null;
    let oldestActivity = Infinity;
    for (const [path31, connection] of this.connections) {
      if (this.isRetained(path31)) continue;
      if (connection.activityAt() < oldestActivity) {
        oldestActivity = connection.activityAt();
        victimPath = path31;
      }
    }
    if (victimPath == null) return;
    const victim = this.connections.get(victimPath);
    if (victim == null) return;
    this.connections.delete(victimPath);
    void victim.close();
  }
  startSweep() {
    if (this.sweepTimer != null) return;
    if (!Number.isFinite(this.idleTimeoutMs)) return;
    const timer = setInterval(() => this.sweepIdle(), this.sweepIntervalMs);
    timer.unref();
    this.sweepTimer = timer;
  }
  stopSweep() {
    if (this.sweepTimer == null) return;
    clearInterval(this.sweepTimer);
    this.sweepTimer = null;
  }
  sweepIdle() {
    const now = Date.now();
    for (const [path31, connection] of [...this.connections]) {
      if (this.isRetained(path31)) continue;
      if (now - connection.activityAt() < this.idleTimeoutMs) continue;
      this.connections.delete(path31);
      void connection.close();
    }
    if (this.connections.size === 0) this.stopSweep();
  }
};
