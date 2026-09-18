var MAX_ROOT_BLOB_BYTES = 8 * 1024 * 1024;
var MAX_STALE_ROOT_SCAN_BYTES = 64 * 1024 * 1024;
var EXPORT_CLOSURE_PROGRESS_BLOB_INTERVAL = 128;
var EXPORT_CLOSURE_PROGRESS_BYTE_INTERVAL = 8 * 1024 * 1024;
var MAX_TRACKED_RECENT_WRITES = 16384;
var VACUUM_MIN_DELETED_BYTES = 64 * 1024 * 1024;
var VACUUM_MIN_DELETED_SHARE = 1 / 8;
function toHex2(bytes) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex");
}
function rowBlobBytes(row) {
  if (row == null || typeof row !== "object" || !("data" in row)) return void 0;
  return row.data instanceof Uint8Array ? row.data : void 0;
}
function rowLength(row) {
  if (row == null || typeof row !== "object" || !("len" in row)) return void 0;
  return typeof row.len === "number" ? row.len : void 0;
}
function scoreRootCandidate(data, presentIds) {
  if (data.length > MAX_ROOT_BLOB_BYTES) return null;
  let structure;
  try {
    structure = ConversationStateStructure.fromBinary(data);
  } catch {
    return null;
  }
  const turns = structure.turns;
  if (turns.length === 0) return null;
  for (const turnId of turns) {
    if (!presentIds.has(toHex2(turnId))) return null;
  }
  return {
    turns: turns.length,
    rootPrompts: structure.rootPromptMessagesJson.length,
    bytes: data.length
  };
}
function isBetterRoot(candidate, best) {
  if (best == null) return true;
  if (candidate.turns !== best.turns) return candidate.turns > best.turns;
  if (candidate.rootPrompts !== best.rootPrompts) {
    return candidate.rootPrompts > best.rootPrompts;
  }
  return candidate.bytes > best.bytes;
}
function findLatestRootBlobIdInDatabase(db) {
  const presentIds = /* @__PURE__ */ new Set();
  const idStatement = db.prepare("SELECT id FROM blobs");
  for (const row of idStatement.iterate()) {
    if (typeof row.id === "string") presentIds.add(row.id);
  }
  let bestId = null;
  let bestScore = null;
  const blobStatement = db.prepare("SELECT id, data FROM blobs");
  for (const row of blobStatement.iterate()) {
    if (typeof row.id !== "string" || !(row.data instanceof Uint8Array)) {
      continue;
    }
    const score = scoreRootCandidate(row.data, presentIds);
    if (score != null && isBetterRoot(score, bestScore)) {
      bestScore = score;
      bestId = row.id;
    }
  }
  return bestId != null ? fromHex(bestId) : null;
}
var ExportClosureLimitExceededError = class extends Error {
};
var ConversationBlobStoreDb = class {
  db;
  getBlobStmt;
  setBlobStmt;
  clearBlobsStmt;
  /*
   * A node:sqlite row iterator does not keep its StatementSync reachable. Once the statement is
   * collected its sqlite3_stmt is finalized and the next row throws ERR_INVALID_STATE ("statement
   * has been finalized"), so the statement is held on `this` for the store's lifetime. Observed on
   * Node v22.14.0, SQLite 3.47.2.
   * https://nodejs.org/docs/latest-v22.x/api/sqlite.html#class-statementsync
   * https://nodejs.org/docs/latest-v22.x/api/errors.html#err_invalid_state
   */
  scanBlobIndexStmt;
  blobLengthStmt;
  recentWriteMsByHexId = /* @__PURE__ */ new Map();
  log;
  isClosed = false;
  constructor(options) {
    const log = options.log;
    this.log = log;
    this.db = openConversationBlobDb({
      dbPath: options.blobDbPath,
      agentId: options.agentId,
      busyTimeoutMs: options.busyTimeoutMs,
      log
    });
    if (options.legacyBlobDbPath != null) {
      this.adoptLegacyBlobs(options.legacyBlobDbPath, log);
    }
    this.getBlobStmt = this.db.prepare("SELECT data FROM blobs WHERE id = ?");
    this.setBlobStmt = this.db.prepare(
      "INSERT INTO blobs (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data"
    );
    this.clearBlobsStmt = this.db.prepare("DELETE FROM blobs");
    this.scanBlobIndexStmt = this.db.prepare("SELECT id, length(data) AS len FROM blobs");
    this.blobLengthStmt = this.db.prepare("SELECT length(data) AS len FROM blobs WHERE id = ?");
  }
  adoptLegacyBlobs(legacyBlobDbPath, log) {
    const migrationState = readConversationBlobMigrationState(this.db);
    if (migrationState !== "unstarted" && migrationState !== "recovery-rebuilt") {
      return;
    }
    if (!(0, import_node_fs4.existsSync)(legacyBlobDbPath)) return;
    try {
      this.db.prepare("ATTACH DATABASE ? AS legacy").run(legacyBlobDbPath);
      try {
        this.db.exec("INSERT OR IGNORE INTO blobs (id, data) SELECT id, data FROM legacy.blobs");
      } finally {
        this.db.exec("DETACH DATABASE legacy");
      }
    } catch (error) {
      log(`[agent-store-worker] legacy blob adoption failed: ${String(error)}`);
      return;
    }
    this.db.exec(`PRAGMA user_version = ${CONVERSATION_BLOB_ADOPTION_COMPLETE}`);
  }
  getBlob(blobId) {
    if (this.isClosed) return void 0;
    const row = this.getBlobStmt.get(toHex2(blobId));
    return row?.data instanceof Uint8Array ? row.data : void 0;
  }
  findLatestRootBlobId() {
    if (this.isClosed) return void 0;
    return findLatestRootBlobIdInDatabase(this.db) ?? void 0;
  }
  walkExportClosure(retainedRootIdHex, limits = {}, onProgress) {
    if (this.isClosed || retainedRootIdHex.length === 0) {
      return { outcome: "skipped", reason: "no-root" };
    }
    const rootLength = rowLength(this.blobLengthStmt.get(retainedRootIdHex));
    if (rootLength == null) return { outcome: "skipped", reason: "no-root" };
    let closureBlobCount = 1;
    let closureByteSize = rootLength;
    let reportedBlobCount = 0;
    let reportedByteSize = 0;
    const reportProgress = (force = false) => {
      if (onProgress === void 0 || closureBlobCount === reportedBlobCount && closureByteSize === reportedByteSize || !force && closureBlobCount - reportedBlobCount < EXPORT_CLOSURE_PROGRESS_BLOB_INTERVAL && closureByteSize - reportedByteSize < EXPORT_CLOSURE_PROGRESS_BYTE_INTERVAL) {
        return;
      }
      onProgress({ closureBlobCount, closureByteSize });
      reportedBlobCount = closureBlobCount;
      reportedByteSize = closureByteSize;
    };
    reportProgress(true);
    if (1 > (limits.maxClosureBlobs ?? Infinity) || rootLength > (limits.maxClosureBytes ?? Infinity)) {
      return { outcome: "skipped", reason: "oversize" };
    }
    const storedRoot = rowBlobBytes(this.getBlobStmt.get(retainedRootIdHex));
    if (storedRoot == null) return { outcome: "skipped", reason: "no-root" };
    const rootBytes = new Uint8Array(storedRoot);
    let walk;
    try {
      walk = collectReachableBlobHexIds({
        rootBytes,
        getBlobByHexId: (hexId) => rowBlobBytes(this.getBlobStmt.get(hexId)),
        onBlobReference: (hexId) => {
          closureBlobCount += 1;
          closureByteSize += rowLength(this.blobLengthStmt.get(hexId)) ?? 0;
          reportProgress();
          if (closureBlobCount > (limits.maxClosureBlobs ?? Infinity) || closureByteSize > (limits.maxClosureBytes ?? Infinity)) {
            throw new ExportClosureLimitExceededError();
          }
        }
      });
    } catch (error) {
      reportProgress(true);
      if (error instanceof ExportClosureLimitExceededError) {
        return { outcome: "skipped", reason: "oversize" };
      }
      this.log(`[agent-store-worker] export closure root undecodable: ${errorLogTag(error)}`);
      return { outcome: "skipped", reason: "root-undecodable" };
    }
    reportProgress(true);
    const reachableHexIds = [...walk.blobTypeByHexId.keys()];
    return {
      outcome: "walked",
      rootBytes,
      rootHexId: (0, import_node_crypto.createHash)("sha256").update(rootBytes).digest("hex"),
      reachableHexIds,
      unresolvedProtoRefs: walk.unresolvedProtoRefs,
      closureByteSize
    };
  }
  getBlobsByHexIds(hexIds) {
    if (this.isClosed) return hexIds.map(() => void 0);
    return hexIds.map((hexId) => {
      const bytes = rowBlobBytes(this.getBlobStmt.get(hexId));
      return bytes == null ? void 0 : new Uint8Array(bytes);
    });
  }
  setBlob(blobId, blobData) {
    if (this.isClosed) return;
    const hexId = toHex2(blobId);
    this.setBlobStmt.run(hexId, blobData);
    this.recentWriteMsByHexId.delete(hexId);
    this.recentWriteMsByHexId.set(hexId, Date.now());
    while (this.recentWriteMsByHexId.size > MAX_TRACKED_RECENT_WRITES) {
      const oldest = this.recentWriteMsByHexId.keys().next().value;
      if (oldest == null) break;
      this.recentWriteMsByHexId.delete(oldest);
    }
  }
  clearBlobs() {
    if (this.isClosed) return;
    this.clearBlobsStmt.run();
  }
  clearStaleCheckpointRoots(retainedRootIdHex) {
    if (this.isClosed) return 0;
    const presentIds = /* @__PURE__ */ new Set();
    const candidateIds = [];
    for (const row of this.scanBlobIndexStmt.iterate()) {
      if (typeof row.id !== "string") continue;
      presentIds.add(row.id);
      if (row.id !== retainedRootIdHex && typeof row.len === "number" && row.len > 0 && row.len <= MAX_STALE_ROOT_SCAN_BYTES) {
        candidateIds.push(row.id);
      }
    }
    const staleRootIds = [];
    for (const id of candidateIds) {
      const row = this.getBlobStmt.get(id);
      const data = row?.data;
      if (!(data instanceof Uint8Array)) continue;
      if ((0, import_node_crypto.createHash)("sha256").update(data).digest("hex") !== id) continue;
      let structure;
      try {
        structure = ConversationStateStructure.fromBinary(data);
      } catch {
        continue;
      }
      if (structure.turns.length === 0) continue;
      const isWalkableRoot = structure.turns.every(
        (turnId) => turnId.length === 32 && presentIds.has(toHex2(turnId))
      );
      if (isWalkableRoot) staleRootIds.push(id);
    }
    if (staleRootIds.length === 0) return 0;
    const deleteBlobStmt = this.db.prepare("DELETE FROM blobs WHERE id = ?");
    let deleted = 0;
    let inTransaction = false;
    try {
      this.db.exec("BEGIN IMMEDIATE");
      inTransaction = true;
      for (const id of staleRootIds) {
        deleted += Number(deleteBlobStmt.run(id).changes);
      }
      this.db.exec("COMMIT");
    } catch (error) {
      if (inTransaction) this.db.exec("ROLLBACK");
      throw error;
    }
    return deleted;
  }
  collectGarbage({
    retainedRootIdHex,
    pendingWriteRetentionMs
  }) {
    if (this.isClosed) {
      return { outcome: "skipped", reason: "no-root" };
    }
    const rootRow = this.getBlobStmt.get(retainedRootIdHex);
    if (!(rootRow?.data instanceof Uint8Array)) {
      return { outcome: "skipped", reason: "no-root" };
    }
    let walk;
    try {
      walk = collectReachableBlobHexIds({
        rootBytes: rootRow.data,
        getBlobByHexId: (hexId) => {
          const row = this.getBlobStmt.get(hexId);
          return row?.data instanceof Uint8Array ? row.data : void 0;
        }
      });
    } catch {
      return { outcome: "skipped", reason: "root-undecodable" };
    }
    if (walk.unresolvedProtoRefs > 0) {
      return {
        outcome: "skipped",
        reason: "unresolved-refs",
        unresolvedProtoRefs: walk.unresolvedProtoRefs
      };
    }
    const pendingWriteFloorMs = Date.now() - pendingWriteRetentionMs;
    const deletableHexIds = [];
    let deletedBytes = 0;
    let liveRows = 0;
    let liveBytes = 0;
    let retainedPendingRows = 0;
    const liveBytesByType = {};
    for (const row of this.scanBlobIndexStmt.iterate()) {
      if (typeof row.id !== "string" || typeof row.len !== "number") continue;
      const liveBlobType = row.id === retainedRootIdHex ? "ConversationStateStructure" : liveBlobTypeNameOf(walk.blobTypeByHexId.get(row.id));
      if (liveBlobType != null) {
        liveRows += 1;
        liveBytes += row.len;
        liveBytesByType[liveBlobType] = (liveBytesByType[liveBlobType] ?? 0) + row.len;
        continue;
      }
      const lastWriteMs = this.recentWriteMsByHexId.get(row.id);
      if (lastWriteMs != null && lastWriteMs > pendingWriteFloorMs) {
        retainedPendingRows += 1;
        liveRows += 1;
        liveBytes += row.len;
        liveBytesByType.pending = (liveBytesByType.pending ?? 0) + row.len;
        continue;
      }
      deletableHexIds.push(row.id);
      deletedBytes += row.len;
    }
    if (deletableHexIds.length > 0) {
      const deleteBlobStmt = this.db.prepare("DELETE FROM blobs WHERE id = ?");
      let inTransaction = false;
      try {
        this.db.exec("BEGIN IMMEDIATE");
        inTransaction = true;
        for (const hexId of deletableHexIds) {
          deleteBlobStmt.run(hexId);
        }
        this.db.exec("COMMIT");
      } catch (error) {
        if (inTransaction) this.db.exec("ROLLBACK");
        throw error;
      }
    }
    const vacuumed = deletedBytes >= VACUUM_MIN_DELETED_BYTES || deletedBytes > 0 && deletedBytes >= (deletedBytes + liveBytes) * VACUUM_MIN_DELETED_SHARE;
    if (vacuumed) {
      this.db.exec("VACUUM");
    }
    this.db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
    return {
      outcome: "collected",
      deletedRows: deletableHexIds.length,
      deletedBytes,
      liveRows,
      liveBytes,
      liveBytesByType,
      retainedPendingRows,
      vacuumed
    };
  }
  verifyLegacyBlobRetirement(retainedRootIdHex, legacyBlobDbPath) {
    if (this.isClosed) {
      return {
        isRetirable: false,
        reason: "store-closed",
        legacyRows: 0,
        legacyBytes: 0
      };
    }
    return verifyLegacyBlobRetirement({
      db: this.db,
      legacyBlobDbPath,
      retainedRootIdHex
    });
  }
  close() {
    if (this.isClosed) return;
    this.isClosed = true;
    this.db.close();
  }
};
