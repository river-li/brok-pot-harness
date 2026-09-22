/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/local-index.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var fs6 = __toESM(require("node:fs"), 1);
var path7 = __toESM(require("node:path"), 1);
var CURRENT_SCHEMA_VERSION = 4;
var PRIVATE_FILE_MODE2 = 384;
var META_DELETION_ARMED = "deletion_armed";
var META_FILES_ROOT_DEV = "files_root_dev";
var META_FILES_ROOT_INO = "files_root_ino";
var META_TOMBSTONE_CURSOR_MS = "tombstone_cursor_ms";
var META_LAST_COMPLETE_ROUND_MS = "last_complete_round_ms";
var META_INDEX_CREATED_MS = "index_created_ms";
var META_TOMBSTONE_ROUNDS_SINCE_INCLUDE = "tombstone_rounds_since_include";
var META_TOMBSTONE_LAST_INCLUDE_MS = "tombstone_last_include_ms";
var LocalIndexError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "LocalIndexError";
  }
};
var LocalAgentStoreIndex = class _LocalAgentStoreIndex {
  static open(indexPath, options2) {
    const resolvedPath = path7.resolve(indexPath);
    const existing = _LocalAgentStoreIndex.openHandles.get(resolvedPath);
    if (existing !== void 0 && !existing.closed) {
      return existing;
    }
    assertNoSymlinkInPath(resolvedPath);
    ensureSecureDirectoryChain(path7.dirname(resolvedPath));
    assertNoSymlinkInPath(resolvedPath);
    let preexistingMtimeMs;
    try {
      const mtimeMs = fs6.statSync(resolvedPath).mtimeMs;
      if (Number.isFinite(mtimeMs) && mtimeMs > 0) {
        preexistingMtimeMs = Math.floor(mtimeMs);
      }
    } catch (_a19) {
    }
    const opened = openSecureSqlitePath(resolvedPath, PRIVATE_FILE_MODE2);
    let db;
    try {
      db = new options2.sqlite(opened.sqlitePath);
      opened.verifyOpenedInode();
      restrictIndexFileModes(resolvedPath);
      const index = new _LocalAgentStoreIndex(resolvedPath, db);
      index.opened = opened;
      index.migrate(preexistingMtimeMs);
      index.restrictFileModes();
      _LocalAgentStoreIndex.openHandles.set(resolvedPath, index);
      return index;
    } catch (error42) {
      db === null || db === void 0 ? void 0 : db.close();
      opened.close();
      throw error42;
    }
  }
  constructor(indexPath, db) {
    this.indexPath = indexPath;
    this.db = db;
    this.closed = false;
  }
  close() {
    var _a19;
    if (this.closed) {
      return;
    }
    this.db.close();
    (_a19 = this.opened) === null || _a19 === void 0 ? void 0 : _a19.close();
    this.opened = void 0;
    this.closed = true;
    _LocalAgentStoreIndex.openHandles.delete(this.indexPath);
  }
  getFile(relPath) {
    const row = this.db.prepare("SELECT rel_path, last_synced_sha, last_seen_etag, size, last_synced_ms, direction, state, tombstone_etag, deleted_at_ms FROM files WHERE rel_path = ?").get(relPath);
    return row === void 0 ? void 0 : fileEntryFromRow(row);
  }
  listFiles() {
    const rows = this.db.prepare("SELECT rel_path, last_synced_sha, last_seen_etag, size, last_synced_ms, direction, state, tombstone_etag, deleted_at_ms FROM files ORDER BY rel_path ASC").all();
    return rows.map(fileEntryFromRow);
  }
  /** True if any live (non-tombstoned) file is a descendant of `dir`. */
  hasLiveDescendantFiles(dir) {
    if (dir === "") {
      return this.hasLiveFilesUnder("");
    }
    const range2 = sqliteDescendantRange(dir);
    const row = this.db.prepare(`SELECT 1 AS ok FROM files
         WHERE state != 'tombstoned'
           AND rel_path >= ? AND rel_path < ?
         LIMIT 1`).get(range2.start, range2.end);
    return row !== void 0;
  }
  /** True if any live (non-tombstoned) file is `dir` or a descendant. */
  hasLiveFilesUnder(dir) {
    if (dir === "") {
      const row2 = this.db.prepare("SELECT 1 AS ok FROM files WHERE state != 'tombstoned' LIMIT 1").get();
      return row2 !== void 0;
    }
    const range2 = sqliteDescendantRange(dir);
    const row = this.db.prepare(`SELECT 1 AS ok FROM files
         WHERE state != 'tombstoned'
           AND (rel_path = ? OR (rel_path >= ? AND rel_path < ?))
         LIMIT 1`).get(dir, range2.start, range2.end);
    return row !== void 0;
  }
  upsertFile(entry) {
    var _a19, _b2;
    const state = (_a19 = entry.state) !== null && _a19 !== void 0 ? _a19 : "live";
    const tombstoneEtag = state === "tombstoned" ? entry.tombstoneEtag : null;
    const deletedAtMs = state === "tombstoned" ? entry.deletedAtMs : null;
    this.db.prepare(`
        INSERT INTO files (
          rel_path,
          last_synced_sha,
          last_seen_etag,
          size,
          last_synced_ms,
          direction,
          state,
          tombstone_etag,
          deleted_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(rel_path) DO UPDATE SET
          last_synced_sha = excluded.last_synced_sha,
          last_seen_etag = excluded.last_seen_etag,
          size = excluded.size,
          last_synced_ms = excluded.last_synced_ms,
          direction = excluded.direction,
          state = excluded.state,
          tombstone_etag = excluded.tombstone_etag,
          deleted_at_ms = excluded.deleted_at_ms
      `).run(entry.relPath, entry.lastSyncedSha, (_b2 = entry.lastSeenEtag) !== null && _b2 !== void 0 ? _b2 : null, entry.size, entry.lastSyncedMs, entry.direction, state, tombstoneEtag !== null && tombstoneEtag !== void 0 ? tombstoneEtag : null, deletedAtMs !== null && deletedAtMs !== void 0 ? deletedAtMs : null);
    this.restrictFileModes();
  }
  listPendingDeletes() {
    const rows = this.db.prepare("SELECT rel_path, base_etag, requested_at_ms, mutation_id FROM pending_deletes ORDER BY rel_path ASC").all();
    return rows.map((row) => {
      var _a19;
      return {
        relPath: row.rel_path,
        baseEtag: row.base_etag,
        requestedAtMs: row.requested_at_ms,
        mutationId: (_a19 = row.mutation_id) !== null && _a19 !== void 0 ? _a19 : void 0
      };
    });
  }
  hasPendingDelete(relPath) {
    const row = this.db.prepare("SELECT rel_path FROM pending_deletes WHERE rel_path = ?").get(relPath);
    return row !== void 0;
  }
  /** True if any pending delete is `dir` or a descendant. */
  hasPendingDeletesUnder(dir) {
    if (dir === "") {
      const row2 = this.db.prepare("SELECT 1 AS ok FROM pending_deletes LIMIT 1").get();
      return row2 !== void 0;
    }
    const range2 = sqliteDescendantRange(dir);
    const row = this.db.prepare(`SELECT 1 AS ok FROM pending_deletes
         WHERE rel_path = ? OR (rel_path >= ? AND rel_path < ?)
         LIMIT 1`).get(dir, range2.start, range2.end);
    return row !== void 0;
  }
  upsertPendingDelete(entry) {
    var _a19;
    this.db.prepare(`
        INSERT INTO pending_deletes (
          rel_path,
          base_etag,
          requested_at_ms,
          mutation_id
        ) VALUES (?, ?, ?, ?)
        ON CONFLICT(rel_path) DO UPDATE SET
          base_etag = excluded.base_etag,
          requested_at_ms = excluded.requested_at_ms,
          mutation_id = excluded.mutation_id
      `).run(entry.relPath, entry.baseEtag, entry.requestedAtMs, (_a19 = entry.mutationId) !== null && _a19 !== void 0 ? _a19 : null);
    this.restrictFileModes();
  }
  removePendingDelete(relPath) {
    const result = this.db.prepare("DELETE FROM pending_deletes WHERE rel_path = ?").run(relPath);
    return result.changes > 0;
  }
  listPendingRmdirs() {
    const rows = this.db.prepare("SELECT rel_path, requested_at_ms FROM pending_rmdirs ORDER BY (LENGTH(rel_path) - LENGTH(REPLACE(rel_path, '/', ''))) DESC, rel_path ASC").all();
    return rows.map((row) => ({
      relPath: row.rel_path,
      requestedAtMs: row.requested_at_ms
    }));
  }
  hasPendingRmdir(relPath) {
    const row = this.db.prepare("SELECT rel_path FROM pending_rmdirs WHERE rel_path = ?").get(relPath);
    return row !== void 0;
  }
  upsertPendingRmdir(entry) {
    this.db.prepare(`
        INSERT INTO pending_rmdirs (rel_path, requested_at_ms)
        VALUES (?, ?)
        ON CONFLICT(rel_path) DO UPDATE SET
          requested_at_ms = excluded.requested_at_ms
      `).run(entry.relPath, entry.requestedAtMs);
    this.restrictFileModes();
  }
  removePendingRmdir(relPath) {
    const result = this.db.prepare("DELETE FROM pending_rmdirs WHERE rel_path = ?").run(relPath);
    return result.changes > 0;
  }
  /** Recovery-mode escape hatch: drop every unflushed deletion intent. */
  clearPendingDeletes() {
    const result = this.db.prepare("DELETE FROM pending_deletes").run();
    this.db.prepare("DELETE FROM pending_rmdirs").run();
    return result.changes;
  }
  /**
   * Durable recovery step: unarm scan-based deletion, forget the recorded
   * `files/` root identity, and drop every unflushed deletion intent in one
   * shot. Called when the identity guard trips so a subsequent round starts
   * from the legacy restore semantics until a clean round re-arms. Returns
   * the number of pending deletes cleared.
   */
  disarmDeletionAndClearPending() {
    const disarm = this.db.transaction(() => {
      this.db.prepare(`
          INSERT INTO meta (key, value)
          VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run(META_DELETION_ARMED, "0");
      this.db.prepare("DELETE FROM meta WHERE key = ?").run(META_FILES_ROOT_DEV);
      this.db.prepare("DELETE FROM meta WHERE key = ?").run(META_FILES_ROOT_INO);
      this.db.prepare("DELETE FROM pending_rmdirs").run();
      return this.db.prepare("DELETE FROM pending_deletes").run().changes;
    });
    const cleared = disarm();
    this.restrictFileModes();
    return cleared;
  }
  /**
   * Arms scan-based deletion and records the `files/` root identity in one
   * SQLite transaction so a crash cannot leave `deletion_armed=1` without
   * both identity keys (which the next round would treat as compromised).
   */
  armDeletionWithIdentity(identity) {
    const arm = this.db.transaction(() => {
      const upsert = this.db.prepare(`
        INSERT INTO meta (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `);
      upsert.run(META_DELETION_ARMED, "1");
      upsert.run(META_FILES_ROOT_DEV, String(identity.dev));
      upsert.run(META_FILES_ROOT_INO, String(identity.ino));
    });
    arm();
    this.restrictFileModes();
  }
  deleteFile(relPath) {
    const result = this.db.prepare("DELETE FROM files WHERE rel_path = ?").run(relPath);
    if (result.changes > 0) {
      this.restrictFileModes();
    }
    return result.changes > 0;
  }
  getMeta(key) {
    const row = this.db.prepare("SELECT value FROM meta WHERE key = ?").get(key);
    return row === null || row === void 0 ? void 0 : row.value;
  }
  setMeta(entry) {
    this.db.prepare(`
        INSERT INTO meta (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(entry.key, entry.value);
    this.restrictFileModes();
  }
  migrate(preexistingMtimeMs) {
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("synchronous = NORMAL");
    this.db.pragma("busy_timeout = 5000");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    const version3 = this.getMeta("schema_version");
    if (version3 === void 0) {
      this.createCurrentSchema();
      this.ensureIndexCreatedMs(preexistingMtimeMs);
      return;
    }
    const parsedVersion = Number(version3);
    if (!Number.isInteger(parsedVersion) || parsedVersion < 1 || parsedVersion > CURRENT_SCHEMA_VERSION) {
      throw new LocalIndexError("unsupported_schema_version", `Unsupported agent store index schema version: ${version3}`);
    }
    this.createFilesTableIfNeeded();
    if (parsedVersion < 2) {
      this.migrateV1ToV2();
    }
    if (parsedVersion < 3) {
      this.migrateV2ToV3();
    }
    if (parsedVersion < 4) {
      this.migrateV3ToV4();
    }
    this.ensureIndexCreatedMs(preexistingMtimeMs);
  }
  ensureIndexCreatedMs(preexistingMtimeMs) {
    const existing = this.getMeta(META_INDEX_CREATED_MS);
    if (existing !== void 0 && existing !== "") {
      const parsed2 = Number(existing);
      if (Number.isSafeInteger(parsed2) && parsed2 > 0) {
        return;
      }
    }
    const createdMs = preexistingMtimeMs !== void 0 && preexistingMtimeMs > 0 ? preexistingMtimeMs : Date.now();
    this.setMeta({
      key: META_INDEX_CREATED_MS,
      value: String(createdMs)
    });
  }
  createCurrentSchema() {
    this.createFilesTableIfNeeded();
    this.createPendingDeletesTableIfNeeded();
    this.createPendingRmdirsTableIfNeeded();
    this.setMeta({
      key: "schema_version",
      value: String(CURRENT_SCHEMA_VERSION)
    });
  }
  createFilesTableIfNeeded() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS files (
        rel_path TEXT PRIMARY KEY,
        last_synced_sha TEXT NOT NULL,
        last_seen_etag TEXT,
        size INTEGER NOT NULL,
        last_synced_ms INTEGER NOT NULL,
        direction TEXT NOT NULL CHECK(direction IN ('pulled', 'pushed')),
        state TEXT NOT NULL DEFAULT 'live' CHECK(state IN ('live', 'tombstoned')),
        tombstone_etag TEXT,
        deleted_at_ms INTEGER
      );
    `);
  }
  createPendingDeletesTableIfNeeded() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pending_deletes (
        rel_path TEXT PRIMARY KEY,
        base_etag TEXT NOT NULL,
        requested_at_ms INTEGER NOT NULL,
        mutation_id TEXT
      );
    `);
  }
  migrateV1ToV2() {
    const columns = this.db.prepare("PRAGMA table_info(files)").all();
    if (columns.some((column) => column.name === "last_seen_sha")) {
      this.db.exec("ALTER TABLE files RENAME COLUMN last_seen_sha TO last_synced_sha");
    }
    if (!columns.some((column) => column.name === "last_seen_etag")) {
      this.db.exec("ALTER TABLE files ADD COLUMN last_seen_etag TEXT");
    }
    this.setMeta({
      key: "schema_version",
      value: "2"
    });
  }
  migrateV2ToV3() {
    const columns = this.db.prepare("PRAGMA table_info(files)").all();
    if (!columns.some((column) => column.name === "state")) {
      this.db.exec("ALTER TABLE files ADD COLUMN state TEXT NOT NULL DEFAULT 'live' CHECK(state IN ('live', 'tombstoned'))");
    }
    if (!columns.some((column) => column.name === "tombstone_etag")) {
      this.db.exec("ALTER TABLE files ADD COLUMN tombstone_etag TEXT");
    }
    if (!columns.some((column) => column.name === "deleted_at_ms")) {
      this.db.exec("ALTER TABLE files ADD COLUMN deleted_at_ms INTEGER");
    }
    this.createPendingDeletesTableIfNeeded();
    this.setMeta({
      key: "schema_version",
      value: "3"
    });
  }
  migrateV3ToV4() {
    this.createPendingRmdirsTableIfNeeded();
    this.setMeta({
      key: "schema_version",
      value: String(CURRENT_SCHEMA_VERSION)
    });
  }
  createPendingRmdirsTableIfNeeded() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pending_rmdirs (
        rel_path TEXT PRIMARY KEY,
        requested_at_ms INTEGER NOT NULL
      );
    `);
  }
  restrictFileModes() {
    restrictIndexFileModes(this.indexPath);
  }
};
LocalAgentStoreIndex.openHandles = /* @__PURE__ */ new Map();
function fileEntryFromRow(row) {
  var _a19, _b2, _c2;
  return {
    relPath: row.rel_path,
    lastSyncedSha: row.last_synced_sha,
    lastSeenEtag: (_a19 = row.last_seen_etag) !== null && _a19 !== void 0 ? _a19 : void 0,
    size: row.size,
    lastSyncedMs: row.last_synced_ms,
    direction: row.direction,
    state: row.state,
    tombstoneEtag: (_b2 = row.tombstone_etag) !== null && _b2 !== void 0 ? _b2 : void 0,
    deletedAtMs: (_c2 = row.deleted_at_ms) !== null && _c2 !== void 0 ? _c2 : void 0
  };
}
function sqliteDescendantRange(dir) {
  return { start: `${dir}/`, end: `${dir}0` };
}
function restrictIndexFileModes(indexPath) {
  for (const filePath of [indexPath, `${indexPath}-wal`, `${indexPath}-shm`]) {
    if (fs6.existsSync(filePath)) {
      fs6.chmodSync(filePath, PRIVATE_FILE_MODE2);
    }
  }
}

