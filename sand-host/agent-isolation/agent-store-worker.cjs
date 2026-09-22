const __mod=require('node:module');const __p=require('node:path');const __depsDir=__p.join(__dirname,'..','deps');process.env.NODE_PATH=__depsDir+(process.env.NODE_PATH?__p.delimiter+process.env.NODE_PATH:'');__mod.Module._initPaths();const __import_meta_url=require('node:url').pathToFileURL(__filename).href;
"use strict";

// src/host/agent-isolation/agent-store-worker.ts
var import_node_worker_threads = require("node:worker_threads");

// src/shared/invariant.ts
var SandInvariantViolation = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SandInvariantViolation";
  }
};
var installedReporter = null;
var STRIPPED_MESSAGE = "Invariant violation (message stripped in packaged builds; the stack identifies the site)";
function messagesStripped() {
  return false;
}
var FRAME_LINE = /^at /;
function topApplicationFrame(violation) {
  const stack = violation.stack;
  if (typeof stack !== "string" || !stack.startsWith(headerOf(violation))) return null;
  for (const raw of stack.slice(headerOf(violation).length).split("\n")) {
    const frame = raw.trim();
    if (!FRAME_LINE.test(frame)) continue;
    return frame;
  }
  return null;
}
function headerOf(violation) {
  return violation.message === "" ? violation.name : `${violation.name}: ${violation.message}`;
}
function invariant(condition, message) {
  if (condition) return;
  failInvariant(message, invariant);
}
function failInvariant(message, boundary) {
  let violationMessage;
  if (messagesStripped()) {
    violationMessage = STRIPPED_MESSAGE;
  } else if (typeof message === "function") {
    violationMessage = message();
  } else {
    violationMessage = message;
  }
  const violation = new SandInvariantViolation(violationMessage);
  let frame = null;
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(violation, boundary);
    if (installedReporter !== null) frame = topApplicationFrame(violation);
  }
  installedReporter?.({ name: violation.name, frame });
  throw violation;
}

// src/host/agent-isolation/conversation-blob-db.ts
var import_node_fs2 = require("node:fs");
var import_node_path = require("node:path");
var import_node_sqlite3 = require("node:sqlite");

// src/shared/errors/system-errno.ts
function findSystemErrno(error) {
  const seen = /* @__PURE__ */ new Set();
  let current = error;
  while (current != null && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const code = current.code;
    if (typeof code === "string" && /^E[A-Z_]+$/.test(code)) return code;
    current = current.cause;
  }
  return void 0;
}

// src/shared/errors/errors.ts
var SandDomainError = class extends Error {
};
function errorLogTag(error) {
  if (!(error instanceof Error)) return typeof error;
  const ownCode = error.code;
  const code = ownCode != null && ownCode.length > 0 ? ownCode : findSystemErrno(error);
  return code !== void 0 ? `${error.name} (${code})` : error.name;
}

// ../dune/scheduling/dist/internal/policies.js
var JITTER_SPREAD = { none: 0, equal: 1 / 2, full: 1 };

// src/host/storage/sqlite-busy.ts
var SQLITE_BUSY = 5;
var SQLITE_LOCKED = 6;
var SQLITE_IOERR = 10;
var SQLITE_CORRUPT = 11;
var SQLITE_CANTOPEN = 14;
var SQLITE_NOTADB = 26;
var SQLITE_PRIMARY_CODES = /* @__PURE__ */ new Map([
  ["SQLITE_BUSY", SQLITE_BUSY],
  ["SQLITE_LOCKED", SQLITE_LOCKED],
  ["SQLITE_IOERR", SQLITE_IOERR],
  ["SQLITE_CORRUPT", SQLITE_CORRUPT],
  ["SQLITE_CANTOPEN", SQLITE_CANTOPEN],
  ["SQLITE_NOTADB", SQLITE_NOTADB]
]);
function sqlitePrimaryCode(error) {
  if (!(error instanceof Error)) return void 0;
  if ("errcode" in error && typeof error.errcode === "number" && Number.isInteger(error.errcode)) {
    return error.errcode & 255;
  }
  if ("code" in error && typeof error.code === "string") {
    return SQLITE_PRIMARY_CODES.get(error.code.split("_", 2).join("_"));
  }
  return void 0;
}
function isSqliteIoError(error) {
  return sqlitePrimaryCode(error) === SQLITE_IOERR;
}
function isSqliteCantOpenError(error) {
  return sqlitePrimaryCode(error) === SQLITE_CANTOPEN;
}
function isSqliteCorruptError(error) {
  const code = sqlitePrimaryCode(error);
  return code === SQLITE_CORRUPT || code === SQLITE_NOTADB;
}

// src/host/storage/sqlite-recovery.ts
var import_node_fs = require("node:fs");
var import_node_sqlite2 = require("node:sqlite");

// src/shared/parse/unknown-record.ts
function isUnknownRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ../packages/grok-bot-harness/src/host-diagnostics.ts
var pinnedReporter = null;
function reportHostDiagnostic(diagnostic) {
  pinnedReporter?.(diagnostic);
}

// src/host/fallback-diagnostics.ts
var reported = /* @__PURE__ */ new Set();
function reportFallback(stage, error) {
  const errorClass = errorLogTag(error);
  const key = `${stage} ${errorClass}`;
  if (reported.has(key)) return;
  reported.add(key);
  reportHostDiagnostic({ kind: "fallback_taken", stage, errorClass });
}

// src/host/storage/store-db.ts
var import_node_sqlite = require("node:sqlite");
var DB_BUSY_TIMEOUT_MS = 5e3;
function applyStorePragmas(db, options) {
  db.exec(`PRAGMA busy_timeout = ${options.busyTimeoutMs ?? DB_BUSY_TIMEOUT_MS}`);
  try {
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA synchronous = NORMAL");
  } catch (error) {
    if (options.allowWalFailure !== true) throw error;
  }
  if (options.incrementalAutoVacuum === true) {
    db.exec("PRAGMA auto_vacuum = INCREMENTAL");
  }
}
var SQLITE_DB_SIDECAR_SUFFIXES = ["-wal", "-shm", "-journal"];

// src/host/storage/sqlite-recovery.ts
function removeSqliteSidecars(dbPath) {
  for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
    try {
      (0, import_node_fs.rmSync)(`${dbPath}${suffix}`, { force: true, recursive: true });
    } catch {
    }
  }
}
function removePathWithRetries(options) {
  const attempts = Math.max(1, options.attempts ?? 1);
  let removeError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      (0, import_node_fs.rmSync)(options.path, {
        force: true,
        recursive: options.recursive === true
      });
      removeError = void 0;
      break;
    } catch (error) {
      removeError = error;
      if (attempt < attempts - 1) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, options.retryDelayMs ?? 50);
      }
    }
  }
  if (removeError != null) throw removeError;
}
function removeSqliteDb(options) {
  removePathWithRetries({
    path: options.dbPath,
    attempts: options.attempts,
    retryDelayMs: options.retryDelayMs
  });
  for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
    removePathWithRetries({
      path: `${options.dbPath}${suffix}`,
      attempts: options.attempts,
      retryDelayMs: options.retryDelayMs,
      recursive: true
    });
  }
}
function quarantineCorruptSqliteDb(options) {
  const { dbPath } = options;
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const quarantinePath = options.quarantinePath ?? `${dbPath}.corrupt-${stamp}`;
  try {
    (0, import_node_fs.rmSync)(quarantinePath, { force: true });
    removeSqliteSidecars(quarantinePath);
  } catch {
  }
  try {
    (0, import_node_fs.renameSync)(dbPath, quarantinePath);
  } catch (error) {
    const renameErrorCode = error.code ?? "error";
    let copied = false;
    try {
      (0, import_node_fs.copyFileSync)(dbPath, quarantinePath);
      copied = true;
      for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
        const sidecar = `${dbPath}${suffix}`;
        if ((0, import_node_fs.existsSync)(sidecar)) {
          try {
            (0, import_node_fs.copyFileSync)(sidecar, `${quarantinePath}${suffix}`);
          } catch {
          }
        }
      }
    } catch {
      if (options.preserveSourceOnCopyFailure === true) {
        return {
          quarantinePath: dbPath,
          copied: false,
          renameErrorCode
        };
      }
      copied = false;
    }
    removeSqliteDb({
      dbPath,
      attempts: options.removeAttempts,
      retryDelayMs: options.removeRetryDelayMs
    });
    return {
      quarantinePath: copied ? quarantinePath : null,
      copied,
      renameErrorCode
    };
  }
  for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
    try {
      const sidecar = `${dbPath}${suffix}`;
      if ((0, import_node_fs.existsSync)(sidecar)) {
        (0, import_node_fs.renameSync)(sidecar, `${quarantinePath}${suffix}`);
      }
    } catch {
      (0, import_node_fs.rmSync)(`${dbPath}${suffix}`, { force: true });
    }
  }
  return { quarantinePath, copied: false, renameErrorCode: null };
}
function openSqliteForSalvage(options) {
  const { dbPath } = options;
  if (!(0, import_node_fs.existsSync)(dbPath)) return void 0;
  const open = () => {
    const db = new import_node_sqlite2.DatabaseSync(dbPath);
    try {
      if (options.busyTimeoutMs != null) {
        db.exec(`PRAGMA busy_timeout = ${options.busyTimeoutMs}`);
      }
      db.prepare("PRAGMA schema_version").get();
      return db;
    } catch (error) {
      try {
        db.close();
      } catch {
      }
      throw error;
    }
  };
  try {
    return open();
  } catch (error) {
    if (!isSqliteIoError(error) && !isSqliteCantOpenError(error) && !isSqliteCorruptError(error)) {
      return void 0;
    }
    removeSqliteSidecars(dbPath);
    try {
      return open();
    } catch (retryError) {
      if (isSqliteCorruptError(retryError)) {
        try {
          return new import_node_sqlite2.DatabaseSync(dbPath);
        } catch (error2) {
          reportFallback("sqlite_recovery", error2);
          return void 0;
        }
      }
      return void 0;
    }
  }
}
var statementByRowIterator = /* @__PURE__ */ new WeakMap();
function pinnedRowIterator(statement) {
  const iterator = statement.iterate();
  statementByRowIterator.set(iterator, statement);
  return iterator;
}
function copySalvageableSqliteRows(source, selectSql, insert, toParams) {
  let iterator;
  try {
    iterator = pinnedRowIterator(source.prepare(selectSql));
  } catch {
    return 0;
  }
  let copied = 0;
  try {
    for (; ; ) {
      let next;
      try {
        next = iterator.next();
      } catch {
        break;
      }
      if (next.done) break;
      if (!isUnknownRecord(next.value)) continue;
      try {
        insert.run(...toParams(next.value));
        copied += 1;
      } catch {
      }
    }
  } finally {
    try {
      iterator.return?.(void 0);
    } catch {
    }
  }
  return copied;
}

// src/host/agent-isolation/conversation-blob-db.ts
var CONVERSATION_BLOB_SCHEMA = `
CREATE TABLE IF NOT EXISTS blobs (
  id TEXT PRIMARY KEY,
  data BLOB NOT NULL
) STRICT;
`;
var CONVERSATION_BLOB_MIGRATION_UNSTARTED = 0;
var CONVERSATION_BLOB_ADOPTION_COMPLETE = 1;
var CONVERSATION_BLOB_RECOVERY_REBUILT = 2;
function readConversationBlobMigrationState(db) {
  let version;
  try {
    version = db.prepare("PRAGMA user_version").get()?.user_version;
  } catch {
    return "unknown";
  }
  switch (version ?? CONVERSATION_BLOB_MIGRATION_UNSTARTED) {
    case CONVERSATION_BLOB_MIGRATION_UNSTARTED:
      return "unstarted";
    case CONVERSATION_BLOB_ADOPTION_COMPLETE:
      return "adoption-complete";
    case CONVERSATION_BLOB_RECOVERY_REBUILT:
      return "recovery-rebuilt";
    default:
      return "unknown";
  }
}
var DISK_RECOVERY = {
  openSqliteForSalvage,
  quarantineCorruptSqliteDb,
  removeSqliteDb
};
var ConversationBlobRecoveryError = class extends SandDomainError {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
  code;
  name = "ConversationBlobRecoveryError";
};
function openConfiguredConversationBlobDb(dbPath, busyTimeoutMs) {
  const db = new import_node_sqlite3.DatabaseSync(dbPath);
  try {
    applyStorePragmas(db, { busyTimeoutMs, allowWalFailure: true });
    db.exec(CONVERSATION_BLOB_SCHEMA);
    return db;
  } catch (error) {
    try {
      db.close();
    } catch {
    }
    throw error;
  }
}
function runQuickCheck(db) {
  const row = db.prepare("PRAGMA quick_check").get();
  return row?.quick_check === "ok" ? "healthy" : "corrupt";
}
function getHealth(db) {
  try {
    return runQuickCheck(db);
  } catch (error) {
    return isSqliteCorruptError(error) ? "corrupt" : "unavailable";
  }
}
function getHealthOnDisk(options) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let db;
    try {
      db = new import_node_sqlite3.DatabaseSync(options.dbPath, { readOnly: true });
      db.exec(`PRAGMA busy_timeout = ${options.busyTimeoutMs}`);
      return runQuickCheck(db);
    } catch (error) {
      if (attempt === 0 && (isSqliteIoError(error) || isSqliteCantOpenError(error))) {
        try {
          db?.close();
        } catch {
        }
        db = void 0;
        removeSqliteSidecars(options.dbPath);
        continue;
      }
      return isSqliteCorruptError(error) ? "corrupt" : "unavailable";
    } finally {
      try {
        db?.close();
      } catch {
      }
    }
  }
  return "unavailable";
}
function recoverConversationBlobDb(options) {
  const recovery = options.recovery ?? DISK_RECOVERY;
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const intendedQuarantinePath = `${options.dbPath}.corrupt-${stamp}`;
  const intentPath = `${intendedQuarantinePath}.intent`;
  (0, import_node_fs2.writeFileSync)(intentPath, "");
  const quarantine = recovery.quarantineCorruptSqliteDb({
    dbPath: options.dbPath,
    quarantinePath: intendedQuarantinePath,
    preserveSourceOnCopyFailure: true,
    removeAttempts: Math.ceil(options.busyTimeoutMs / 50),
    removeRetryDelayMs: 50
  });
  const pendingPath = `${quarantine.quarantinePath ?? intendedQuarantinePath}.pending`;
  (0, import_node_fs2.renameSync)(intentPath, pendingPath);
  if (quarantine.renameErrorCode != null) {
    if (quarantine.quarantinePath == null) {
      options.log?.(
        `[agent-store-worker] could not quarantine conversation-blobs.db for agent=${options.agentId} (rename ${quarantine.renameErrorCode}); resetting without a preserved copy`
      );
    } else if (quarantine.copied) {
      options.log?.(
        `[agent-store-worker] quarantined conversation-blobs.db by copy for agent=${options.agentId} (rename ${quarantine.renameErrorCode})`
      );
    } else {
      options.log?.(
        `[agent-store-worker] could not copy quarantine for conversation-blobs.db for agent=${options.agentId} (rename ${quarantine.renameErrorCode}); recovering from the source in place`
      );
    }
  }
  return finishConversationBlobRecovery({
    options,
    quarantinePath: quarantine.quarantinePath,
    pendingPath
  });
}
function openConversationBlobRecoveryTarget(options, dbPath) {
  const recovery = options.recovery ?? DISK_RECOVERY;
  const open = () => openConfiguredConversationBlobDb(dbPath, options.busyTimeoutMs);
  const remove = () => recovery.removeSqliteDb({
    dbPath,
    attempts: Math.ceil(options.busyTimeoutMs / 50),
    retryDelayMs: 50
  });
  let retriedWithoutSidecars = false;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let db;
    try {
      db = open();
    } catch (error) {
      if ((isSqliteIoError(error) || isSqliteCantOpenError(error)) && !retriedWithoutSidecars) {
        retriedWithoutSidecars = true;
        removeSqliteSidecars(dbPath);
        continue;
      }
      if (!isSqliteIoError(error) && !isSqliteCorruptError(error) && !isSqliteCantOpenError(error)) {
        throw error;
      }
      remove();
      continue;
    }
    const health = getHealth(db);
    if (health === "healthy") return db;
    try {
      db.close();
    } catch {
    }
    if (health === "unavailable") {
      throw new ConversationBlobRecoveryError(
        "SAND_BLOB_RECOVERY_TARGET_UNHEALTHY",
        "conversation blob recovery target is temporarily unavailable"
      );
    }
    remove();
  }
  throw new ConversationBlobRecoveryError(
    "SAND_BLOB_RECOVERY_TARGET_UNHEALTHY",
    "failed to create a healthy conversation blob database"
  );
}
function installCompletedConversationBlobReplacement(options) {
  const health = getHealthOnDisk({
    dbPath: options.replacementPath,
    busyTimeoutMs: options.busyTimeoutMs
  });
  if (health === "unavailable") {
    throw new ConversationBlobRecoveryError(
      "SAND_BLOB_RECOVERY_SOURCE_UNAVAILABLE",
      "completed conversation blob replacement is temporarily unavailable"
    );
  }
  if (health === "corrupt") return void 0;
  let replacement;
  try {
    replacement = openConfiguredConversationBlobDb(options.replacementPath, options.busyTimeoutMs);
    const configuredHealth = getHealth(replacement);
    if (configuredHealth === "corrupt") return void 0;
    if (configuredHealth === "unavailable") {
      throw new ConversationBlobRecoveryError(
        "SAND_BLOB_RECOVERY_SOURCE_UNAVAILABLE",
        "completed conversation blob replacement became unavailable"
      );
    }
    const replacementState = readConversationBlobMigrationState(replacement);
    if (replacementState !== "recovery-rebuilt" && replacementState !== "adoption-complete") {
      return void 0;
    }
    replacement.exec("PRAGMA wal_checkpoint(TRUNCATE)");
    replacement.exec("PRAGMA journal_mode = DELETE");
  } catch (error) {
    if (isSqliteCorruptError(error)) return void 0;
    throw error;
  } finally {
    try {
      replacement?.close();
    } catch {
    }
  }
  removeSqliteSidecars(options.replacementPath);
  options.recovery.removeSqliteDb({ dbPath: options.dbPath });
  (0, import_node_fs2.renameSync)(options.replacementPath, options.dbPath);
  const installed = openConfiguredConversationBlobDb(options.dbPath, options.busyTimeoutMs);
  if (getHealth(installed) !== "healthy") {
    installed.close();
    throw new ConversationBlobRecoveryError(
      "SAND_BLOB_RECOVERY_INSTALL_UNHEALTHY",
      "installed completed conversation blob replacement is unhealthy"
    );
  }
  if (options.pendingPath != null) {
    (0, import_node_fs2.rmSync)(options.pendingPath, { force: true });
  }
  return installed;
}
function finishConversationBlobRecovery(args) {
  const { options } = args;
  const recovery = options.recovery ?? DISK_RECOVERY;
  let pendingPath = args.pendingPath;
  let quarantinePath = args.quarantinePath;
  let replacementPath = `${quarantinePath ?? options.dbPath}.replacement`;
  if (!(0, import_node_fs2.existsSync)(options.dbPath) && (0, import_node_fs2.existsSync)(replacementPath)) {
    const installed = installCompletedConversationBlobReplacement({
      dbPath: options.dbPath,
      replacementPath,
      pendingPath,
      busyTimeoutMs: options.busyTimeoutMs,
      recovery
    });
    if (installed != null) return installed;
    const hasSeparateQuarantine = quarantinePath != null && quarantinePath !== options.dbPath && (0, import_node_fs2.existsSync)(quarantinePath);
    if (!hasSeparateQuarantine) {
      quarantinePath = replacementPath;
      replacementPath = `${replacementPath}.replacement`;
    }
  }
  if ((0, import_node_fs2.existsSync)(options.dbPath)) {
    let existing;
    const sourceHealth = getHealthOnDisk({
      dbPath: options.dbPath,
      busyTimeoutMs: options.busyTimeoutMs
    });
    if (sourceHealth === "unavailable") {
      throw new ConversationBlobRecoveryError(
        "SAND_BLOB_RECOVERY_SOURCE_UNAVAILABLE",
        "conversation blob recovery source is temporarily unavailable"
      );
    }
    if (sourceHealth === "healthy") {
      try {
        existing = openConfiguredConversationBlobDb(options.dbPath, options.busyTimeoutMs);
      } catch (error) {
        if (!isSqliteCorruptError(error)) {
          throw new ConversationBlobRecoveryError(
            "SAND_BLOB_RECOVERY_SOURCE_UNAVAILABLE",
            "healthy conversation blob recovery source could not be configured"
          );
        }
      }
      const configuredHealth = existing == null ? "corrupt" : getHealth(existing);
      if (configuredHealth === "healthy" && existing != null) {
        if (quarantinePath != null) {
          recovery.removeSqliteDb({
            dbPath: `${quarantinePath}.replacement`
          });
        }
        if (pendingPath != null) (0, import_node_fs2.rmSync)(pendingPath, { force: true });
        return existing;
      }
      if (configuredHealth === "unavailable") {
        try {
          existing?.close();
        } catch {
        }
        throw new ConversationBlobRecoveryError(
          "SAND_BLOB_RECOVERY_SOURCE_UNAVAILABLE",
          "conversation blob recovery source became temporarily unavailable"
        );
      }
    }
    try {
      existing?.close();
    } catch {
    }
    if (quarantinePath === options.dbPath) {
    } else if (quarantinePath != null && !(0, import_node_fs2.existsSync)(quarantinePath)) {
      const quarantine = recovery.quarantineCorruptSqliteDb({
        dbPath: options.dbPath,
        quarantinePath,
        preserveSourceOnCopyFailure: true,
        removeAttempts: Math.ceil(options.busyTimeoutMs / 50),
        removeRetryDelayMs: 50
      });
      quarantinePath = quarantine.quarantinePath;
      const resumedPendingPath = quarantinePath == null ? null : `${quarantinePath}.pending`;
      if (pendingPath != null && resumedPendingPath != null && pendingPath !== resumedPendingPath) {
        (0, import_node_fs2.renameSync)(pendingPath, resumedPendingPath);
        pendingPath = resumedPendingPath;
      }
      replacementPath = `${quarantinePath ?? options.dbPath}.replacement`;
    } else {
      recovery.removeSqliteDb({
        dbPath: options.dbPath,
        attempts: Math.ceil(options.busyTimeoutMs / 50),
        retryDelayMs: 50
      });
    }
  }
  recovery.removeSqliteDb({ dbPath: replacementPath });
  const freshDb = openConversationBlobRecoveryTarget(options, replacementPath);
  let salvagedBlobs = 0;
  try {
    if (quarantinePath != null) {
      const source = recovery.openSqliteForSalvage({
        dbPath: quarantinePath,
        busyTimeoutMs: options.busyTimeoutMs
      });
      if (source == null && (0, import_node_fs2.existsSync)(quarantinePath)) {
        throw new ConversationBlobRecoveryError(
          "SAND_BLOB_RECOVERY_QUARANTINE_UNREADABLE",
          "quarantined conversation blob database is unreadable"
        );
      }
      if (source != null) {
        try {
          salvagedBlobs = copySalvageableSqliteRows(
            source,
            "SELECT id, data FROM blobs",
            freshDb.prepare("INSERT OR IGNORE INTO blobs (id, data) VALUES (?, ?)"),
            (row) => [row.id, row.data]
          );
        } finally {
          try {
            source.close();
          } catch {
          }
        }
      }
    }
    freshDb.exec(`PRAGMA user_version = ${CONVERSATION_BLOB_RECOVERY_REBUILT}`);
    freshDb.exec("PRAGMA wal_checkpoint(TRUNCATE)");
    freshDb.exec("PRAGMA journal_mode = DELETE");
  } finally {
    try {
      freshDb.close();
    } catch {
    }
  }
  removeSqliteSidecars(replacementPath);
  recovery.removeSqliteDb({
    dbPath: options.dbPath,
    attempts: Math.ceil(options.busyTimeoutMs / 50),
    retryDelayMs: 50
  });
  (0, import_node_fs2.renameSync)(replacementPath, options.dbPath);
  const installedDb = openConfiguredConversationBlobDb(options.dbPath, options.busyTimeoutMs);
  if (getHealth(installedDb) !== "healthy") {
    installedDb.close();
    throw new ConversationBlobRecoveryError(
      "SAND_BLOB_RECOVERY_INSTALL_UNHEALTHY",
      "installed conversation blob recovery is unhealthy"
    );
  }
  const info = {
    outcome: salvagedBlobs > 0 ? "recovered" : "reset",
    quarantinePath,
    salvagedBlobs
  };
  options.log?.(
    `[agent-store-worker] conversation-blobs.db recovery: outcome=${info.outcome} agent=${options.agentId} quarantine=${info.quarantinePath != null ? (0, import_node_path.basename)(info.quarantinePath) : "none"} salvaged.blobs=${info.salvagedBlobs}`
  );
  try {
    options.onRecovery?.(info);
  } catch {
  }
  if (pendingPath != null) (0, import_node_fs2.rmSync)(pendingPath, { force: true });
  return installedDb;
}
function findPendingRecovery(dbPath, recovery) {
  const dir = (0, import_node_path.dirname)(dbPath);
  const dbName = (0, import_node_path.basename)(dbPath);
  const prefix = `${dbName}.corrupt-`;
  const names = (0, import_node_fs2.readdirSync)(dir);
  const quarantineMarkerNames = names.filter(
    (name) => name.startsWith(prefix) && (name.endsWith(".intent") || name.endsWith(".pending"))
  ).sort();
  const inPlaceMarkerName = `${dbName}.pending`;
  const markerNames = [
    ...names.includes(inPlaceMarkerName) ? [inPlaceMarkerName] : [],
    ...quarantineMarkerNames
  ];
  const markerName = markerNames.at(-1);
  const quarantinePathFor = (name) => {
    const markerPath = (0, import_node_path.join)(dir, name);
    if (name === `${dbName}.pending`) return dbPath;
    const suffix = name.endsWith(".intent") ? ".intent" : ".pending";
    return markerPath.slice(0, -suffix.length);
  };
  const activeReplacement = markerName == null ? null : `${quarantinePathFor(markerName)}.replacement`;
  for (const name of names) {
    if ((name.startsWith(prefix) || name === `${dbName}.replacement`) && name.endsWith(".replacement")) {
      const replacementPath = (0, import_node_path.join)(dir, name);
      if (replacementPath !== activeReplacement) {
        recovery.removeSqliteDb({ dbPath: replacementPath });
      }
    }
  }
  if (markerName == null) return void 0;
  for (const staleName of markerNames.slice(0, -1)) {
    (0, import_node_fs2.rmSync)((0, import_node_path.join)(dir, staleName), { force: true });
    recovery.removeSqliteDb({
      dbPath: `${quarantinePathFor(staleName)}.replacement`
    });
  }
  const pendingPath = (0, import_node_path.join)(dir, markerName);
  return {
    pendingPath,
    quarantinePath: quarantinePathFor(markerName)
  };
}
function openConversationBlobDb(options) {
  (0, import_node_fs2.mkdirSync)((0, import_node_path.dirname)(options.dbPath), { recursive: true });
  const pending = findPendingRecovery(options.dbPath, options.recovery ?? DISK_RECOVERY);
  if (pending != null) {
    return finishConversationBlobRecovery({
      options,
      quarantinePath: pending.quarantinePath,
      pendingPath: pending.pendingPath
    });
  }
  let db;
  try {
    db = openConfiguredConversationBlobDb(options.dbPath, options.busyTimeoutMs);
  } catch (error) {
    if (isSqliteIoError(error) || isSqliteCantOpenError(error)) {
      removeSqliteSidecars(options.dbPath);
      try {
        db = openConfiguredConversationBlobDb(options.dbPath, options.busyTimeoutMs);
      } catch (retryError) {
        if (isSqliteCorruptError(retryError)) {
          return recoverConversationBlobDb(options);
        }
        throw retryError;
      }
    } else if (isSqliteCorruptError(error)) {
      return recoverConversationBlobDb(options);
    } else {
      throw error;
    }
  }
  let health;
  try {
    health = runQuickCheck(db);
  } catch (error) {
    try {
      db.close();
    } catch {
    }
    if (isSqliteIoError(error) || isSqliteCantOpenError(error)) {
      removeSqliteSidecars(options.dbPath);
      try {
        db = openConfiguredConversationBlobDb(options.dbPath, options.busyTimeoutMs);
        health = runQuickCheck(db);
      } catch (retryError) {
        if (isSqliteIoError(retryError) || isSqliteCantOpenError(retryError) || isSqliteCorruptError(retryError)) {
          return recoverConversationBlobDb(options);
        }
        throw retryError;
      }
    } else if (isSqliteCorruptError(error)) {
      return recoverConversationBlobDb(options);
    } else {
      throw new ConversationBlobRecoveryError(
        "SAND_BLOB_RECOVERY_SOURCE_UNAVAILABLE",
        "conversation blob database health check is temporarily unavailable"
      );
    }
  }
  if (health === "healthy") return db;
  try {
    db.close();
  } catch {
  }
  return recoverConversationBlobDb(options);
}

// src/host/agent-isolation/conversation-blob-store.ts
var import_node_crypto = require("node:crypto");
var import_node_fs4 = require("node:fs");

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/assert.js
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}
var FLOAT32_MAX = 34028234663852886e22;
var FLOAT32_MIN = -34028234663852886e22;
var UINT32_MAX = 4294967295;
var INT32_MAX = 2147483647;
var INT32_MIN = -2147483648;
function assertInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid int 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
    throw new Error("invalid int 32: " + arg);
}
function assertUInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid uint 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
    throw new Error("invalid uint 32: " + arg);
}
function assertFloat32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid float 32: " + typeof arg);
  if (!Number.isFinite(arg))
    return;
  if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
    throw new Error("invalid float 32: " + arg);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/enum.js
var enumTypeSymbol = /* @__PURE__ */ Symbol("@bufbuild/protobuf/enum-type");
var pendingEnumType = /* @__PURE__ */ new WeakMap();
function enumTypeInfo(enumObject) {
  const attached = enumObject[enumTypeSymbol];
  if (attached) {
    return attached;
  }
  const pending = pendingEnumType.get(enumObject);
  if (!pending) {
    return void 0;
  }
  const built = makeEnumType(pending.typeName, pending.values.map((v) => ({
    no: v.no,
    name: v.name,
    localName: enumObject[v.no]
  })), pending.opt);
  enumObject[enumTypeSymbol] = built;
  pendingEnumType.delete(enumObject);
  return built;
}
function getEnumType(enumObject) {
  const t = enumTypeInfo(enumObject);
  assert(t, "missing enum type on enum object");
  return t;
}
function setEnumType(enumObject, typeName, values, opt) {
  pendingEnumType.set(enumObject, { typeName, values, opt });
  if (enumObject[enumTypeSymbol] !== void 0) {
    delete enumObject[enumTypeSymbol];
  }
}
function makeEnumType(typeName, values, _opt) {
  const names = /* @__PURE__ */ Object.create(null);
  const numbers = /* @__PURE__ */ Object.create(null);
  const normalValues = [];
  for (const value of values) {
    const n = normalizeEnumValue(value);
    normalValues.push(n);
    names[value.name] = n;
    numbers[value.no] = n;
  }
  return {
    typeName,
    values: normalValues,
    // We do not surface options at this time
    // options: opt?.options ?? Object.create(null),
    findName(name) {
      return names[name];
    },
    findNumber(no) {
      return numbers[no];
    }
  };
}
function makeEnum(typeName, values, opt) {
  const enumObject = {};
  for (const value of values) {
    const n = normalizeEnumValue(value);
    enumObject[n.localName] = n.no;
    enumObject[n.no] = n.localName;
  }
  setEnumType(enumObject, typeName, values, opt);
  return enumObject;
}
function normalizeEnumValue(value) {
  if ("localName" in value) {
    return value;
  }
  return Object.assign(Object.assign({}, value), { localName: value.name });
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/message.js
var Message = class {
  /**
   * Compare with a message of the same type.
   * Note that this function disregards extensions and unknown fields.
   */
  equals(other) {
    return this.getType().runtime.util.equals(this.getType(), this, other);
  }
  /**
   * Create a deep copy.
   */
  clone() {
    return this.getType().runtime.util.clone(this);
  }
  /**
   * Parse from binary data, merging fields.
   *
   * Repeated fields are appended. Map entries are added, overwriting
   * existing keys.
   *
   * If a message field is already present, it will be merged with the
   * new data.
   */
  fromBinary(bytes, options) {
    const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
    format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
    return this;
  }
  /**
   * Parse a message from a JSON value.
   */
  fromJson(jsonValue, options) {
    const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
    format.readMessage(type, jsonValue, opt, this);
    return this;
  }
  /**
   * Parse a message from a JSON string.
   */
  fromJsonString(jsonString, options) {
    let json;
    try {
      json = JSON.parse(jsonString);
    } catch (e) {
      throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${e instanceof Error ? e.message : String(e)}`);
    }
    return this.fromJson(json, options);
  }
  /**
   * Serialize the message to binary data.
   */
  toBinary(options) {
    const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer = opt.writerFactory();
    bin.writeMessage(this, writer, opt);
    return writer.finish();
  }
  /**
   * Serialize the message to a JSON value, a JavaScript value that can be
   * passed to JSON.stringify().
   */
  toJson(options) {
    const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
    return json.writeMessage(this, opt);
  }
  /**
   * Serialize the message to a JSON string.
   */
  toJsonString(options) {
    var _a;
    const value = this.toJson(options);
    return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
  }
  /**
   * Override for serialization behavior. This will be invoked when calling
   * JSON.stringify on this message (i.e. JSON.stringify(msg)).
   *
   * Note that this will not serialize google.protobuf.Any with a packed
   * message because the protobuf JSON format specifies that it needs to be
   * unpacked, and this is only possible with a type registry to look up the
   * message type.  As a result, attempting to serialize a message with this
   * type will throw an Error.
   *
   * This method is protected because you should not need to invoke it
   * directly -- instead use JSON.stringify or toJsonString for
   * stringified JSON.  Alternatively, if actual JSON is desired, you should
   * use toJson.
   */
  toJSON() {
    return this.toJson({
      emitDefaultValues: true
    });
  }
  /**
   * Retrieve the MessageType of this message - a singleton that represents
   * the protobuf message declaration and provides metadata for reflection-
   * based operations.
   */
  getType() {
    return Object.getPrototypeOf(this).constructor;
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/message-type.js
function makeMessageType(runtime, typeName, fields, opt) {
  var _a;
  const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
  const type = {
    [localName]: function(data) {
      runtime.util.initFields(this);
      runtime.util.initPartial(data, this);
    }
  }[localName];
  Object.setPrototypeOf(type.prototype, new Message());
  Object.assign(type, {
    runtime,
    typeName,
    fields: runtime.util.newFieldList(fields),
    fromBinary(bytes, options) {
      return new type().fromBinary(bytes, options);
    },
    fromJson(jsonValue, options) {
      return new type().fromJson(jsonValue, options);
    },
    fromJsonString(jsonString, options) {
      return new type().fromJsonString(jsonString, options);
    },
    equals(a, b) {
      return runtime.util.equals(type, a, b);
    }
  });
  return type;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/google/varint.js
function varint64read() {
  let lowBits = 0;
  let highBits = 0;
  for (let shift = 0; shift < 28; shift += 7) {
    let b = this.buf[this.pos++];
    lowBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  let middleByte = this.buf[this.pos++];
  lowBits |= (middleByte & 15) << 28;
  highBits = (middleByte & 112) >> 4;
  if ((middleByte & 128) == 0) {
    this.assertBounds();
    return [lowBits, highBits];
  }
  for (let shift = 3; shift <= 31; shift += 7) {
    let b = this.buf[this.pos++];
    highBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  throw new Error("invalid varint");
}
function varint64write(lo, hi, bytes) {
  for (let i = 0; i < 28; i = i + 7) {
    const shift = lo >>> i;
    const hasNext = !(shift >>> 7 == 0 && hi == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
  const hasMoreBits = !(hi >> 3 == 0);
  bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
  if (!hasMoreBits) {
    return;
  }
  for (let i = 3; i < 31; i = i + 7) {
    const shift = hi >>> i;
    const hasNext = !(shift >>> 7 == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  bytes.push(hi >>> 31 & 1);
}
var TWO_PWR_32_DBL = 4294967296;
function int64FromString(dec) {
  const minus = dec[0] === "-";
  if (minus) {
    dec = dec.slice(1);
  }
  const base = 1e6;
  let lowBits = 0;
  let highBits = 0;
  function add1e6digit(begin, end) {
    const digit1e6 = Number(dec.slice(begin, end));
    highBits *= base;
    lowBits = lowBits * base + digit1e6;
    if (lowBits >= TWO_PWR_32_DBL) {
      highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
      lowBits = lowBits % TWO_PWR_32_DBL;
    }
  }
  add1e6digit(-24, -18);
  add1e6digit(-18, -12);
  add1e6digit(-12, -6);
  add1e6digit(-6);
  return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
function int64ToString(lo, hi) {
  let bits = newBits(lo, hi);
  const negative = bits.hi & 2147483648;
  if (negative) {
    bits = negate(bits.lo, bits.hi);
  }
  const result = uInt64ToString(bits.lo, bits.hi);
  return negative ? "-" + result : result;
}
function uInt64ToString(lo, hi) {
  ({ lo, hi } = toUnsigned(lo, hi));
  if (hi <= 2097151) {
    return String(TWO_PWR_32_DBL * hi + lo);
  }
  const low = lo & 16777215;
  const mid = (lo >>> 24 | hi << 8) & 16777215;
  const high = hi >> 16 & 65535;
  let digitA = low + mid * 6777216 + high * 6710656;
  let digitB = mid + high * 8147497;
  let digitC = high * 2;
  const base = 1e7;
  if (digitA >= base) {
    digitB += Math.floor(digitA / base);
    digitA %= base;
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base);
    digitB %= base;
  }
  return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
  return { lo: lo >>> 0, hi: hi >>> 0 };
}
function newBits(lo, hi) {
  return { lo: lo | 0, hi: hi | 0 };
}
function negate(lowBits, highBits) {
  highBits = ~highBits;
  if (lowBits) {
    lowBits = ~lowBits + 1;
  } else {
    highBits += 1;
  }
  return newBits(lowBits, highBits);
}
var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
  const partial = String(digit1e7);
  return "0000000".slice(partial.length) + partial;
};
function varint32write(value, bytes) {
  if (value >= 0) {
    while (value > 127) {
      bytes.push(value & 127 | 128);
      value = value >>> 7;
    }
    bytes.push(value);
  } else {
    for (let i = 0; i < 9; i++) {
      bytes.push(value & 127 | 128);
      value = value >> 7;
    }
    bytes.push(1);
  }
}
function varint32read() {
  let b = this.buf[this.pos++];
  let result = b & 127;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 7;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 14;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 21;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 15) << 28;
  for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
    b = this.buf[this.pos++];
  if ((b & 128) != 0)
    throw new Error("invalid varint");
  this.assertBounds();
  return result >>> 0;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
function makeInt64Support() {
  const dv = new DataView(new ArrayBuffer(8));
  const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
  if (ok) {
    const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
    return {
      zero: BigInt(0),
      supported: true,
      parse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > MAX || bi < MIN) {
          throw new Error(`int64 invalid: ${value}`);
        }
        return bi;
      },
      uParse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > UMAX || bi < UMIN) {
          throw new Error(`uint64 invalid: ${value}`);
        }
        return bi;
      },
      enc(value) {
        dv.setBigInt64(0, this.parse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      uEnc(value) {
        dv.setBigInt64(0, this.uParse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      dec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigInt64(0, true);
      },
      uDec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigUint64(0, true);
      }
    };
  }
  const assertInt64String = (value) => assert(/^-?[0-9]+$/.test(value), `int64 invalid: ${value}`);
  const assertUInt64String = (value) => assert(/^[0-9]+$/.test(value), `uint64 invalid: ${value}`);
  return {
    zero: "0",
    supported: false,
    parse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return value;
    },
    uParse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return value;
    },
    enc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return int64FromString(value);
    },
    uEnc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return int64FromString(value);
    },
    dec(lo, hi) {
      return int64ToString(lo, hi);
    },
    uDec(lo, hi) {
      return uInt64ToString(lo, hi);
    }
  };
}
var protoInt64 = makeInt64Support();

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/scalar.js
var ScalarType;
(function(ScalarType2) {
  ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
  ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
  ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
  ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
  ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
  ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
  ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
  ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
  ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
  ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
  ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
  ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
  ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
  ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
  ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));
var LongType;
(function(LongType2) {
  LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
  LongType2[LongType2["STRING"] = 1] = "STRING";
})(LongType || (LongType = {}));

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/scalars.js
function scalarEquals(type, a, b) {
  if (a === b) {
    return true;
  }
  if (type == ScalarType.BYTES) {
    if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  switch (type) {
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return a == b;
  }
  return false;
}
function scalarZeroValue(type, longType) {
  switch (type) {
    case ScalarType.BOOL:
      return false;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return longType == 0 ? protoInt64.zero : "0";
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      return 0;
    case ScalarType.BYTES:
      return new Uint8Array(0);
    case ScalarType.STRING:
      return "";
    default:
      return 0;
  }
}
function isScalarZeroValue(type, value) {
  switch (type) {
    case ScalarType.BOOL:
      return value === false;
    case ScalarType.STRING:
      return value === "";
    case ScalarType.BYTES:
      return value instanceof Uint8Array && !value.byteLength;
    default:
      return value == 0;
  }
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/binary-encoding.js
var WireType;
(function(WireType2) {
  WireType2[WireType2["Varint"] = 0] = "Varint";
  WireType2[WireType2["Bit64"] = 1] = "Bit64";
  WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
  WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
  WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
  WireType2[WireType2["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var BinaryWriter = class {
  constructor(textEncoder) {
    this.stack = [];
    this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
    this.chunks = [];
    this.buf = [];
  }
  /**
   * Return all bytes written and reset this writer.
   */
  finish() {
    this.chunks.push(new Uint8Array(this.buf));
    let len = 0;
    for (let i = 0; i < this.chunks.length; i++)
      len += this.chunks[i].length;
    let bytes = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }
    this.chunks = [];
    return bytes;
  }
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork() {
    this.stack.push({ chunks: this.chunks, buf: this.buf });
    this.chunks = [];
    this.buf = [];
    return this;
  }
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join() {
    let chunk = this.finish();
    let prev = this.stack.pop();
    if (!prev)
      throw new Error("invalid state, fork stack empty");
    this.chunks = prev.chunks;
    this.buf = prev.buf;
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(fieldNo, type) {
    return this.uint32((fieldNo << 3 | type) >>> 0);
  }
  /**
   * Write a chunk of raw bytes.
   */
  raw(chunk) {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    this.chunks.push(chunk);
    return this;
  }
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(value) {
    assertUInt32(value);
    while (value > 127) {
      this.buf.push(value & 127 | 128);
      value = value >>> 7;
    }
    this.buf.push(value);
    return this;
  }
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(value) {
    assertInt32(value);
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `bool` value, a variant.
   */
  bool(value) {
    this.buf.push(value ? 1 : 0);
    return this;
  }
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(value) {
    this.uint32(value.byteLength);
    return this.raw(value);
  }
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(value) {
    let chunk = this.textEncoder.encode(value);
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(value) {
    assertFloat32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(value) {
    let chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(value) {
    assertUInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(value) {
    assertInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(value) {
    assertInt32(value);
    value = (value << 1 ^ value >> 31) >>> 0;
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(value) {
    let tc = protoInt64.enc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(value) {
    let tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
    varint64write(lo, hi, this.buf);
    return this;
  }
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(value) {
    let tc = protoInt64.uEnc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
};
var BinaryReader = class {
  constructor(buf, textDecoder) {
    this.varint64 = varint64read;
    this.uint32 = varint32read;
    this.buf = buf;
    this.len = buf.length;
    this.pos = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
  }
  /**
   * Reads a tag - field number and wire type.
   */
  tag() {
    let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
    if (fieldNo <= 0 || wireType < 0 || wireType > 5)
      throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
    return [fieldNo, wireType];
  }
  /**
   * Skip one element and return the skipped data.
   *
   * When skipping StartGroup, provide the tags field number to check for
   * matching field number in the EndGroup tag.
   */
  skip(wireType, fieldNo) {
    let start = this.pos;
    switch (wireType) {
      case WireType.Varint:
        while (this.buf[this.pos++] & 128) {
        }
        break;
      // eslint-disable-next-line
      // @ts-ignore TS7029: Fallthrough case in switch
      case WireType.Bit64:
        this.pos += 4;
      // eslint-disable-next-line
      // @ts-ignore TS7029: Fallthrough case in switch
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let len = this.uint32();
        this.pos += len;
        break;
      case WireType.StartGroup:
        for (; ; ) {
          const [fn, wt] = this.tag();
          if (wt === WireType.EndGroup) {
            if (fieldNo !== void 0 && fn !== fieldNo) {
              throw new Error("invalid end group tag");
            }
            break;
          }
          this.skip(wt, fn);
        }
        break;
      default:
        throw new Error("cant skip wire type " + wireType);
    }
    this.assertBounds();
    return this.buf.subarray(start, this.pos);
  }
  /**
   * Throws error if position in byte array is out of range.
   */
  assertBounds() {
    if (this.pos > this.len)
      throw new RangeError("premature EOF");
  }
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32() {
    let zze = this.uint32();
    return zze >>> 1 ^ -(zze & 1);
  }
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64() {
    return protoInt64.dec(...this.varint64());
  }
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64() {
    return protoInt64.uDec(...this.varint64());
  }
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64() {
    let [lo, hi] = this.varint64();
    let s = -(lo & 1);
    lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
    hi = hi >>> 1 ^ s;
    return protoInt64.dec(lo, hi);
  }
  /**
   * Read a `bool` field, a variant.
   */
  bool() {
    let [lo, hi] = this.varint64();
    return lo !== 0 || hi !== 0;
  }
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64() {
    return protoInt64.uDec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64() {
    return protoInt64.dec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, true);
  }
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes() {
    let len = this.uint32(), start = this.pos;
    this.pos += len;
    this.assertBounds();
    return this.buf.subarray(start, start + len);
  }
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text.
   */
  string() {
    return this.textDecoder.decode(this.bytes());
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/extensions.js
function makeExtension(runtime, typeName, extendee, field) {
  let fi;
  return {
    typeName,
    extendee,
    get field() {
      if (!fi) {
        const i = typeof field == "function" ? field() : field;
        i.name = typeName.split(".").pop();
        i.jsonName = `[${typeName}]`;
        fi = runtime.util.newFieldList([i]).list()[0];
      }
      return fi;
    },
    runtime
  };
}
function createExtensionContainer(extension) {
  const localName = extension.field.localName;
  const container = /* @__PURE__ */ Object.create(null);
  container[localName] = initExtensionField(extension);
  return [container, () => container[localName]];
}
function initExtensionField(ext) {
  const field = ext.field;
  if (field.repeated) {
    return [];
  }
  if (field.default !== void 0) {
    return field.default;
  }
  switch (field.kind) {
    case "enum":
      return field.T.values[0].no;
    case "scalar":
      return scalarZeroValue(field.T, field.L);
    case "message":
      const T = field.T, value = new T();
      return T.fieldWrapper ? T.fieldWrapper.unwrapField(value) : value;
    case "map":
      throw "map fields are not allowed to be extensions";
  }
}
function filterUnknownFields(unknownFields, field) {
  if (!field.repeated && (field.kind == "enum" || field.kind == "scalar")) {
    for (let i = unknownFields.length - 1; i >= 0; --i) {
      if (unknownFields[i].no == field.no) {
        return [unknownFields[i]];
      }
    }
    return [];
  }
  return unknownFields.filter((uf) => uf.no === field.no);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/proto-base64.js
var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var decTable = [];
for (let i = 0; i < encTable.length; i++)
  decTable[encTable[i].charCodeAt(0)] = i;
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");
var protoBase64 = {
  /**
   * Decodes a base64 string to a byte array.
   *
   * - ignores white-space, including line breaks and tabs
   * - allows inner padding (can decode concatenated base64 strings)
   * - does not require padding
   * - understands base64url encoding:
   *   "-" instead of "+",
   *   "_" instead of "/",
   *   no padding
   */
  dec(base64Str) {
    let es = base64Str.length * 3 / 4;
    if (base64Str[base64Str.length - 2] == "=")
      es -= 2;
    else if (base64Str[base64Str.length - 1] == "=")
      es -= 1;
    let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
    for (let i = 0; i < base64Str.length; i++) {
      b = decTable[base64Str.charCodeAt(i)];
      if (b === void 0) {
        switch (base64Str[i]) {
          // @ts-ignore TS7029: Fallthrough case in switch
          case "=":
            groupPos = 0;
          // reset state when padding found
          // @ts-ignore TS7029: Fallthrough case in switch
          case "\n":
          case "\r":
          case "	":
          case " ":
            continue;
          // skip white-space, and padding
          default:
            throw Error("invalid base64 string.");
        }
      }
      switch (groupPos) {
        case 0:
          p = b;
          groupPos = 1;
          break;
        case 1:
          bytes[bytePos++] = p << 2 | (b & 48) >> 4;
          p = b;
          groupPos = 2;
          break;
        case 2:
          bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
          p = b;
          groupPos = 3;
          break;
        case 3:
          bytes[bytePos++] = (p & 3) << 6 | b;
          groupPos = 0;
          break;
      }
    }
    if (groupPos == 1)
      throw Error("invalid base64 string.");
    return bytes.subarray(0, bytePos);
  },
  /**
   * Encode a byte array to a base64 string.
   */
  enc(bytes) {
    let base64 = "", groupPos = 0, b, p = 0;
    for (let i = 0; i < bytes.length; i++) {
      b = bytes[i];
      switch (groupPos) {
        case 0:
          base64 += encTable[b >> 2];
          p = (b & 3) << 4;
          groupPos = 1;
          break;
        case 1:
          base64 += encTable[p | b >> 4];
          p = (b & 15) << 2;
          groupPos = 2;
          break;
        case 2:
          base64 += encTable[p | b >> 6];
          base64 += encTable[b & 63];
          groupPos = 0;
          break;
      }
    }
    if (groupPos) {
      base64 += encTable[p];
      base64 += "=";
      if (groupPos == 1)
        base64 += "=";
    }
    return base64;
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/extension-accessor.js
function getExtension(message, extension, options) {
  assertExtendee(extension, message);
  const opt = extension.runtime.bin.makeReadOptions(options);
  const ufs = filterUnknownFields(message.getType().runtime.bin.listUnknownFields(message), extension.field);
  const [container, get] = createExtensionContainer(extension);
  for (const uf of ufs) {
    extension.runtime.bin.readField(container, opt.readerFactory(uf.data), extension.field, uf.wireType, opt);
  }
  return get();
}
function setExtension(message, extension, value, options) {
  assertExtendee(extension, message);
  const readOpt = extension.runtime.bin.makeReadOptions(options);
  const writeOpt = extension.runtime.bin.makeWriteOptions(options);
  if (hasExtension(message, extension)) {
    const ufs = message.getType().runtime.bin.listUnknownFields(message).filter((uf) => uf.no != extension.field.no);
    message.getType().runtime.bin.discardUnknownFields(message);
    for (const uf of ufs) {
      message.getType().runtime.bin.onUnknownField(message, uf.no, uf.wireType, uf.data);
    }
  }
  const writer = writeOpt.writerFactory();
  let f = extension.field;
  if (!f.opt && !f.repeated && (f.kind == "enum" || f.kind == "scalar")) {
    f = Object.assign(Object.assign({}, extension.field), { opt: true });
  }
  extension.runtime.bin.writeField(f, value, writer, writeOpt);
  const reader = readOpt.readerFactory(writer.finish());
  while (reader.pos < reader.len) {
    const [no, wireType] = reader.tag();
    const data = reader.skip(wireType, no);
    message.getType().runtime.bin.onUnknownField(message, no, wireType, data);
  }
}
function hasExtension(message, extension) {
  const messageType = message.getType();
  return extension.extendee.typeName === messageType.typeName && !!messageType.runtime.bin.listUnknownFields(message).find((uf) => uf.no == extension.field.no);
}
function assertExtendee(extension, message) {
  assert(extension.extendee.typeName == message.getType().typeName, `extension ${extension.typeName} can only be applied to message ${extension.extendee.typeName}`);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/reflect.js
function isFieldSet(field, target) {
  const localName = field.localName;
  if (field.repeated) {
    return target[localName].length > 0;
  }
  if (field.oneof) {
    return target[field.oneof.localName].case === localName;
  }
  switch (field.kind) {
    case "enum":
    case "scalar":
      if (field.opt || field.req) {
        return target[localName] !== void 0;
      }
      if (field.kind == "enum") {
        return target[localName] !== field.T.values[0].no;
      }
      return !isScalarZeroValue(field.T, target[localName]);
    case "message":
      return target[localName] !== void 0;
    case "map":
      return Object.keys(target[localName]).length > 0;
  }
}
function clearField(field, target) {
  const localName = field.localName;
  const implicitPresence = !field.opt && !field.req;
  if (field.repeated) {
    target[localName] = [];
  } else if (field.oneof) {
    target[field.oneof.localName] = { case: void 0 };
  } else {
    switch (field.kind) {
      case "map":
        target[localName] = {};
        break;
      case "enum":
        target[localName] = implicitPresence ? field.T.values[0].no : void 0;
        break;
      case "scalar":
        target[localName] = implicitPresence ? scalarZeroValue(field.T, field.L) : void 0;
        break;
      case "message":
        target[localName] = void 0;
        break;
    }
  }
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/is-message.js
function isMessage(arg, type) {
  if (arg === null || typeof arg != "object") {
    return false;
  }
  if (!Object.getOwnPropertyNames(Message.prototype).every((m) => m in arg && typeof arg[m] == "function")) {
    return false;
  }
  const actualType = arg.getType();
  if (actualType === null || typeof actualType != "function" || !("typeName" in actualType) || typeof actualType.typeName != "string") {
    return false;
  }
  return type === void 0 ? true : actualType.typeName == type.typeName;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/field-wrapper.js
function wrapField(type, value) {
  if (isMessage(value) || !type.fieldWrapper) {
    return value;
  }
  return type.fieldWrapper.wrapField(value);
}
var wktWrapperToScalarType = {
  "google.protobuf.DoubleValue": ScalarType.DOUBLE,
  "google.protobuf.FloatValue": ScalarType.FLOAT,
  "google.protobuf.Int64Value": ScalarType.INT64,
  "google.protobuf.UInt64Value": ScalarType.UINT64,
  "google.protobuf.Int32Value": ScalarType.INT32,
  "google.protobuf.UInt32Value": ScalarType.UINT32,
  "google.protobuf.BoolValue": ScalarType.BOOL,
  "google.protobuf.StringValue": ScalarType.STRING,
  "google.protobuf.BytesValue": ScalarType.BYTES
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/json-format.js
var jsonReadDefaults = {
  ignoreUnknownFields: false
};
var jsonWriteDefaults = {
  emitDefaultValues: false,
  enumAsInteger: false,
  useProtoFieldName: false,
  prettySpaces: 0
};
function makeReadOptions(options) {
  return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
}
function makeWriteOptions(options) {
  return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
}
var tokenNull = /* @__PURE__ */ Symbol();
var tokenIgnoredUnknownEnum = /* @__PURE__ */ Symbol();
function makeJsonFormat() {
  return {
    makeReadOptions,
    makeWriteOptions,
    readMessage(type, json, options, message) {
      if (json == null || Array.isArray(json) || typeof json != "object") {
        throw new Error(`cannot decode message ${type.typeName} from JSON: ${debugJsonValue(json)}`);
      }
      message = message !== null && message !== void 0 ? message : new type();
      const oneofSeen = /* @__PURE__ */ new Map();
      const registry = options.typeRegistry;
      for (const [jsonKey, jsonValue] of Object.entries(json)) {
        const field = type.fields.findJsonName(jsonKey);
        if (field) {
          if (field.oneof) {
            if (jsonValue === null && field.kind == "scalar") {
              continue;
            }
            const seen = oneofSeen.get(field.oneof);
            if (seen !== void 0) {
              throw new Error(`cannot decode message ${type.typeName} from JSON: multiple keys for oneof "${field.oneof.name}" present: "${seen}", "${jsonKey}"`);
            }
            oneofSeen.set(field.oneof, jsonKey);
          }
          readField(message, jsonValue, field, options, type);
        } else {
          let found = false;
          if ((registry === null || registry === void 0 ? void 0 : registry.findExtension) && jsonKey.startsWith("[") && jsonKey.endsWith("]")) {
            const ext = registry.findExtension(jsonKey.substring(1, jsonKey.length - 1));
            if (ext && ext.extendee.typeName == type.typeName) {
              found = true;
              const [container, get] = createExtensionContainer(ext);
              readField(container, jsonValue, ext.field, options, ext);
              setExtension(message, ext, get(), options);
            }
          }
          if (!found && !options.ignoreUnknownFields) {
            throw new Error(`cannot decode message ${type.typeName} from JSON: key "${jsonKey}" is unknown`);
          }
        }
      }
      return message;
    },
    writeMessage(message, options) {
      const type = message.getType();
      const json = {};
      let field;
      try {
        for (field of type.fields.byNumber()) {
          if (!isFieldSet(field, message)) {
            if (field.req) {
              throw `required field not set`;
            }
            if (!options.emitDefaultValues) {
              continue;
            }
            if (!canEmitFieldDefaultValue(field)) {
              continue;
            }
          }
          const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
          const jsonValue = writeField(field, value, options);
          if (jsonValue !== void 0) {
            json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
          }
        }
        const registry = options.typeRegistry;
        if (registry === null || registry === void 0 ? void 0 : registry.findExtensionFor) {
          for (const uf of type.runtime.bin.listUnknownFields(message)) {
            const ext = registry.findExtensionFor(type.typeName, uf.no);
            if (ext && hasExtension(message, ext)) {
              const value = getExtension(message, ext, options);
              const jsonValue = writeField(ext.field, value, options);
              if (jsonValue !== void 0) {
                json[ext.field.jsonName] = jsonValue;
              }
            }
          }
        }
      } catch (e) {
        const m = field ? `cannot encode field ${type.typeName}.${field.name} to JSON` : `cannot encode message ${type.typeName} to JSON`;
        const r = e instanceof Error ? e.message : String(e);
        throw new Error(m + (r.length > 0 ? `: ${r}` : ""));
      }
      return json;
    },
    readScalar(type, json, longType) {
      return readScalar(type, json, longType !== null && longType !== void 0 ? longType : LongType.BIGINT, true);
    },
    writeScalar(type, value, emitDefaultValues) {
      if (value === void 0) {
        return void 0;
      }
      if (emitDefaultValues || isScalarZeroValue(type, value)) {
        return writeScalar(type, value);
      }
      return void 0;
    },
    debug: debugJsonValue
  };
}
function debugJsonValue(json) {
  if (json === null) {
    return "null";
  }
  switch (typeof json) {
    case "object":
      return Array.isArray(json) ? "array" : "object";
    case "string":
      return json.length > 100 ? "string" : `"${json.split('"').join('\\"')}"`;
    default:
      return String(json);
  }
}
function readField(target, jsonValue, field, options, parentType) {
  let localName = field.localName;
  if (field.repeated) {
    assert(field.kind != "map");
    if (jsonValue === null) {
      return;
    }
    if (!Array.isArray(jsonValue)) {
      throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
    }
    const targetArray = target[localName];
    for (const jsonItem of jsonValue) {
      if (jsonItem === null) {
        throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`);
      }
      switch (field.kind) {
        case "message":
          targetArray.push(field.T.fromJson(jsonItem, options));
          break;
        case "enum":
          const enumValue = readEnum(field.T, jsonItem, options.ignoreUnknownFields, true);
          if (enumValue !== tokenIgnoredUnknownEnum) {
            targetArray.push(enumValue);
          }
          break;
        case "scalar":
          try {
            targetArray.push(readScalar(field.T, jsonItem, field.L, true));
          } catch (e) {
            let m = `cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`;
            if (e instanceof Error && e.message.length > 0) {
              m += `: ${e.message}`;
            }
            throw new Error(m);
          }
          break;
      }
    }
  } else if (field.kind == "map") {
    if (jsonValue === null) {
      return;
    }
    if (typeof jsonValue != "object" || Array.isArray(jsonValue)) {
      throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
    }
    const targetMap = target[localName];
    for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)) {
      if (jsonMapValue === null) {
        throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: map value null`);
      }
      let key;
      try {
        key = readMapKey(field.K, jsonMapKey);
      } catch (e) {
        let m = `cannot decode map key for field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
        if (e instanceof Error && e.message.length > 0) {
          m += `: ${e.message}`;
        }
        throw new Error(m);
      }
      switch (field.V.kind) {
        case "message":
          targetMap[key] = field.V.T.fromJson(jsonMapValue, options);
          break;
        case "enum":
          const enumValue = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields, true);
          if (enumValue !== tokenIgnoredUnknownEnum) {
            targetMap[key] = enumValue;
          }
          break;
        case "scalar":
          try {
            targetMap[key] = readScalar(field.V.T, jsonMapValue, LongType.BIGINT, true);
          } catch (e) {
            let m = `cannot decode map value for field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
            if (e instanceof Error && e.message.length > 0) {
              m += `: ${e.message}`;
            }
            throw new Error(m);
          }
          break;
      }
    }
  } else {
    if (field.oneof) {
      target = target[field.oneof.localName] = { case: localName };
      localName = "value";
    }
    switch (field.kind) {
      case "message":
        const messageType = field.T;
        if (jsonValue === null && messageType.typeName != "google.protobuf.Value") {
          return;
        }
        let currentValue = target[localName];
        if (isMessage(currentValue)) {
          currentValue.fromJson(jsonValue, options);
        } else {
          target[localName] = currentValue = messageType.fromJson(jsonValue, options);
          if (messageType.fieldWrapper && !field.oneof) {
            target[localName] = messageType.fieldWrapper.unwrapField(currentValue);
          }
        }
        break;
      case "enum":
        const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields, false);
        switch (enumValue) {
          case tokenNull:
            clearField(field, target);
            break;
          case tokenIgnoredUnknownEnum:
            break;
          default:
            target[localName] = enumValue;
            break;
        }
        break;
      case "scalar":
        try {
          const scalarValue = readScalar(field.T, jsonValue, field.L, false);
          switch (scalarValue) {
            case tokenNull:
              clearField(field, target);
              break;
            default:
              target[localName] = scalarValue;
              break;
          }
        } catch (e) {
          let m = `cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
          if (e instanceof Error && e.message.length > 0) {
            m += `: ${e.message}`;
          }
          throw new Error(m);
        }
        break;
    }
  }
}
function readMapKey(type, json) {
  if (type === ScalarType.BOOL) {
    switch (json) {
      case "true":
        json = true;
        break;
      case "false":
        json = false;
        break;
    }
  }
  return readScalar(type, json, LongType.BIGINT, true).toString();
}
function readScalar(type, json, longType, nullAsZeroValue) {
  if (json === null) {
    if (nullAsZeroValue) {
      return scalarZeroValue(type, longType);
    }
    return tokenNull;
  }
  switch (type) {
    // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
    // Either numbers or strings are accepted. Exponent notation is also accepted.
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      if (json === "NaN")
        return Number.NaN;
      if (json === "Infinity")
        return Number.POSITIVE_INFINITY;
      if (json === "-Infinity")
        return Number.NEGATIVE_INFINITY;
      if (json === "") {
        break;
      }
      if (typeof json == "string" && json.trim().length !== json.length) {
        break;
      }
      if (typeof json != "string" && typeof json != "number") {
        break;
      }
      const float = Number(json);
      if (Number.isNaN(float)) {
        break;
      }
      if (!Number.isFinite(float)) {
        break;
      }
      if (type == ScalarType.FLOAT)
        assertFloat32(float);
      return float;
    // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.UINT32:
      let int32;
      if (typeof json == "number")
        int32 = json;
      else if (typeof json == "string" && json.length > 0) {
        if (json.trim().length === json.length)
          int32 = Number(json);
      }
      if (int32 === void 0)
        break;
      if (type == ScalarType.UINT32 || type == ScalarType.FIXED32)
        assertUInt32(int32);
      else
        assertInt32(int32);
      return int32;
    // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      if (typeof json != "number" && typeof json != "string")
        break;
      const long = protoInt64.parse(json);
      return longType ? long.toString() : long;
    case ScalarType.FIXED64:
    case ScalarType.UINT64:
      if (typeof json != "number" && typeof json != "string")
        break;
      const uLong = protoInt64.uParse(json);
      return longType ? uLong.toString() : uLong;
    // bool:
    case ScalarType.BOOL:
      if (typeof json !== "boolean")
        break;
      return json;
    // string:
    case ScalarType.STRING:
      if (typeof json !== "string") {
        break;
      }
      try {
        encodeURIComponent(json);
      } catch (e) {
        throw new Error("invalid UTF8");
      }
      return json;
    // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
    // Either standard or URL-safe base64 encoding with/without paddings are accepted.
    case ScalarType.BYTES:
      if (json === "")
        return new Uint8Array(0);
      if (typeof json !== "string")
        break;
      return protoBase64.dec(json);
  }
  throw new Error();
}
function readEnum(type, json, ignoreUnknownFields, nullAsZeroValue) {
  if (json === null) {
    if (type.typeName == "google.protobuf.NullValue") {
      return 0;
    }
    return nullAsZeroValue ? type.values[0].no : tokenNull;
  }
  switch (typeof json) {
    case "number":
      if (Number.isInteger(json)) {
        return json;
      }
      break;
    case "string":
      const value = type.findName(json);
      if (value !== void 0) {
        return value.no;
      }
      if (ignoreUnknownFields) {
        return tokenIgnoredUnknownEnum;
      }
      break;
  }
  throw new Error(`cannot decode enum ${type.typeName} from JSON: ${debugJsonValue(json)}`);
}
function canEmitFieldDefaultValue(field) {
  if (field.repeated || field.kind == "map") {
    return true;
  }
  if (field.oneof) {
    return false;
  }
  if (field.kind == "message") {
    return false;
  }
  if (field.opt || field.req) {
    return false;
  }
  return true;
}
function writeField(field, value, options) {
  if (field.kind == "map") {
    assert(typeof value == "object" && value != null);
    const jsonObj = {};
    const entries = Object.entries(value);
    switch (field.V.kind) {
      case "scalar":
        for (const [entryKey, entryValue] of entries) {
          jsonObj[entryKey.toString()] = writeScalar(field.V.T, entryValue);
        }
        break;
      case "message":
        for (const [entryKey, entryValue] of entries) {
          jsonObj[entryKey.toString()] = entryValue.toJson(options);
        }
        break;
      case "enum":
        const enumType2 = field.V.T;
        for (const [entryKey, entryValue] of entries) {
          jsonObj[entryKey.toString()] = writeEnum(enumType2, entryValue, options.enumAsInteger);
        }
        break;
    }
    return options.emitDefaultValues || entries.length > 0 ? jsonObj : void 0;
  }
  if (field.repeated) {
    assert(Array.isArray(value));
    const jsonArr = [];
    switch (field.kind) {
      case "scalar":
        for (let i = 0; i < value.length; i++) {
          jsonArr.push(writeScalar(field.T, value[i]));
        }
        break;
      case "enum":
        for (let i = 0; i < value.length; i++) {
          jsonArr.push(writeEnum(field.T, value[i], options.enumAsInteger));
        }
        break;
      case "message":
        for (let i = 0; i < value.length; i++) {
          jsonArr.push(value[i].toJson(options));
        }
        break;
    }
    return options.emitDefaultValues || jsonArr.length > 0 ? jsonArr : void 0;
  }
  switch (field.kind) {
    case "scalar":
      return writeScalar(field.T, value);
    case "enum":
      return writeEnum(field.T, value, options.enumAsInteger);
    case "message":
      return wrapField(field.T, value).toJson(options);
  }
}
function writeEnum(type, value, enumAsInteger) {
  var _a;
  assert(typeof value == "number");
  if (type.typeName == "google.protobuf.NullValue") {
    return null;
  }
  if (enumAsInteger) {
    return value;
  }
  const val = type.findNumber(value);
  return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value;
}
function writeScalar(type, value) {
  switch (type) {
    // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
    case ScalarType.INT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
      assert(typeof value == "number");
      return value;
    // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
    // Either numbers or strings are accepted. Exponent notation is also accepted.
    case ScalarType.FLOAT:
    // assertFloat32(value);
    case ScalarType.DOUBLE:
      assert(typeof value == "number");
      if (Number.isNaN(value))
        return "NaN";
      if (value === Number.POSITIVE_INFINITY)
        return "Infinity";
      if (value === Number.NEGATIVE_INFINITY)
        return "-Infinity";
      return value;
    // string:
    case ScalarType.STRING:
      assert(typeof value == "string");
      return value;
    // bool:
    case ScalarType.BOOL:
      assert(typeof value == "boolean");
      return value;
    // JSON value will be a decimal string. Either numbers or strings are accepted.
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      assert(typeof value == "bigint" || typeof value == "string" || typeof value == "number");
      return value.toString();
    // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
    // Either standard or URL-safe base64 encoding with/without paddings are accepted.
    case ScalarType.BYTES:
      assert(value instanceof Uint8Array);
      return protoBase64.enc(value);
  }
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/binary-format.js
var unknownFieldsSymbol = /* @__PURE__ */ Symbol("@bufbuild/protobuf/unknown-fields");
var readDefaults = {
  readUnknownFields: true,
  readerFactory: (bytes) => new BinaryReader(bytes)
};
var writeDefaults = {
  writeUnknownFields: true,
  writerFactory: () => new BinaryWriter()
};
function makeReadOptions2(options) {
  return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
}
function makeWriteOptions2(options) {
  return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
}
function makeBinaryFormat() {
  return {
    makeReadOptions: makeReadOptions2,
    makeWriteOptions: makeWriteOptions2,
    listUnknownFields(message) {
      var _a;
      return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
    },
    discardUnknownFields(message) {
      delete message[unknownFieldsSymbol];
    },
    writeUnknownFields(message, writer) {
      const m = message;
      const c = m[unknownFieldsSymbol];
      if (c) {
        for (const f of c) {
          writer.tag(f.no, f.wireType).raw(f.data);
        }
      }
    },
    onUnknownField(message, no, wireType, data) {
      const m = message;
      if (!Array.isArray(m[unknownFieldsSymbol])) {
        m[unknownFieldsSymbol] = [];
      }
      m[unknownFieldsSymbol].push({ no, wireType, data });
    },
    readMessage(message, reader, lengthOrEndTagFieldNo, options, delimitedMessageEncoding) {
      const type = message.getType();
      const end = delimitedMessageEncoding ? reader.len : reader.pos + lengthOrEndTagFieldNo;
      let fieldNo, wireType;
      while (reader.pos < end) {
        [fieldNo, wireType] = reader.tag();
        if (delimitedMessageEncoding === true && wireType == WireType.EndGroup) {
          break;
        }
        const field = type.fields.find(fieldNo);
        if (!field) {
          const data = reader.skip(wireType, fieldNo);
          if (options.readUnknownFields) {
            this.onUnknownField(message, fieldNo, wireType, data);
          }
          continue;
        }
        readField2(message, reader, field, wireType, options);
      }
      if (delimitedMessageEncoding && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      (wireType != WireType.EndGroup || fieldNo !== lengthOrEndTagFieldNo)) {
        throw new Error(`invalid end group tag`);
      }
    },
    readField: readField2,
    writeMessage(message, writer, options) {
      const type = message.getType();
      for (const field of type.fields.byNumber()) {
        if (!isFieldSet(field, message)) {
          if (field.req) {
            throw new Error(`cannot encode field ${type.typeName}.${field.name} to binary: required field not set`);
          }
          continue;
        }
        const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
        writeField2(field, value, writer, options);
      }
      if (options.writeUnknownFields) {
        this.writeUnknownFields(message, writer);
      }
      return writer;
    },
    writeField(field, value, writer, options) {
      if (value === void 0) {
        return void 0;
      }
      writeField2(field, value, writer, options);
    }
  };
}
function readField2(target, reader, field, wireType, options) {
  let { repeated, localName } = field;
  if (field.oneof) {
    target = target[field.oneof.localName];
    if (target.case != localName) {
      delete target.value;
    }
    target.case = localName;
    localName = "value";
  }
  switch (field.kind) {
    case "scalar":
    case "enum":
      const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
      let read = readScalar2;
      if (field.kind == "scalar" && field.L > 0) {
        read = readScalarLTString;
      }
      if (repeated) {
        let arr = target[localName];
        const isPacked = wireType == WireType.LengthDelimited && scalarType != ScalarType.STRING && scalarType != ScalarType.BYTES;
        if (isPacked) {
          let e = reader.uint32() + reader.pos;
          while (reader.pos < e) {
            arr.push(read(reader, scalarType));
          }
        } else {
          arr.push(read(reader, scalarType));
        }
      } else {
        target[localName] = read(reader, scalarType);
      }
      break;
    case "message":
      const messageType = field.T;
      if (repeated) {
        target[localName].push(readMessageField(reader, new messageType(), options, field));
      } else {
        if (isMessage(target[localName])) {
          readMessageField(reader, target[localName], options, field);
        } else {
          target[localName] = readMessageField(reader, new messageType(), options, field);
          if (messageType.fieldWrapper && !field.oneof && !field.repeated) {
            target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
          }
        }
      }
      break;
    case "map":
      let [mapKey, mapVal] = readMapEntry(field, reader, options);
      target[localName][mapKey] = mapVal;
      break;
  }
}
function readMessageField(reader, message, options, field) {
  const format = message.getType().runtime.bin;
  const delimited = field === null || field === void 0 ? void 0 : field.delimited;
  format.readMessage(
    message,
    reader,
    delimited ? field.no : reader.uint32(),
    // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    options,
    delimited
  );
  return message;
}
function readMapEntry(field, reader, options) {
  const length = reader.uint32(), end = reader.pos + length;
  let key, val;
  while (reader.pos < end) {
    const [fieldNo] = reader.tag();
    switch (fieldNo) {
      case 1:
        key = readScalar2(reader, field.K);
        break;
      case 2:
        switch (field.V.kind) {
          case "scalar":
            val = readScalar2(reader, field.V.T);
            break;
          case "enum":
            val = reader.int32();
            break;
          case "message":
            val = readMessageField(reader, new field.V.T(), options, void 0);
            break;
        }
        break;
    }
  }
  if (key === void 0) {
    key = scalarZeroValue(field.K, LongType.BIGINT);
  }
  if (typeof key != "string" && typeof key != "number") {
    key = key.toString();
  }
  if (val === void 0) {
    switch (field.V.kind) {
      case "scalar":
        val = scalarZeroValue(field.V.T, LongType.BIGINT);
        break;
      case "enum":
        val = field.V.T.values[0].no;
        break;
      case "message":
        val = new field.V.T();
        break;
    }
  }
  return [key, val];
}
function readScalarLTString(reader, type) {
  const v = readScalar2(reader, type);
  return typeof v == "bigint" ? v.toString() : v;
}
function readScalar2(reader, type) {
  switch (type) {
    case ScalarType.STRING:
      return reader.string();
    case ScalarType.BOOL:
      return reader.bool();
    case ScalarType.DOUBLE:
      return reader.double();
    case ScalarType.FLOAT:
      return reader.float();
    case ScalarType.INT32:
      return reader.int32();
    case ScalarType.INT64:
      return reader.int64();
    case ScalarType.UINT64:
      return reader.uint64();
    case ScalarType.FIXED64:
      return reader.fixed64();
    case ScalarType.BYTES:
      return reader.bytes();
    case ScalarType.FIXED32:
      return reader.fixed32();
    case ScalarType.SFIXED32:
      return reader.sfixed32();
    case ScalarType.SFIXED64:
      return reader.sfixed64();
    case ScalarType.SINT64:
      return reader.sint64();
    case ScalarType.UINT32:
      return reader.uint32();
    case ScalarType.SINT32:
      return reader.sint32();
  }
}
function writeField2(field, value, writer, options) {
  assert(value !== void 0);
  const repeated = field.repeated;
  switch (field.kind) {
    case "scalar":
    case "enum":
      let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
      if (repeated) {
        assert(Array.isArray(value));
        if (field.packed) {
          writePacked(writer, scalarType, field.no, value);
        } else {
          for (const item of value) {
            writeScalar2(writer, scalarType, field.no, item);
          }
        }
      } else {
        writeScalar2(writer, scalarType, field.no, value);
      }
      break;
    case "message":
      if (repeated) {
        assert(Array.isArray(value));
        for (const item of value) {
          writeMessageField(writer, options, field, item);
        }
      } else {
        writeMessageField(writer, options, field, value);
      }
      break;
    case "map":
      assert(typeof value == "object" && value != null);
      for (const [key, val] of Object.entries(value)) {
        writeMapEntry(writer, options, field, key, val);
      }
      break;
  }
}
function writeMapEntry(writer, options, field, key, value) {
  writer.tag(field.no, WireType.LengthDelimited);
  writer.fork();
  let keyValue = key;
  switch (field.K) {
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
      keyValue = Number.parseInt(key);
      break;
    case ScalarType.BOOL:
      assert(key == "true" || key == "false");
      keyValue = key == "true";
      break;
  }
  writeScalar2(writer, field.K, 1, keyValue);
  switch (field.V.kind) {
    case "scalar":
      writeScalar2(writer, field.V.T, 2, value);
      break;
    case "enum":
      writeScalar2(writer, ScalarType.INT32, 2, value);
      break;
    case "message":
      assert(value !== void 0);
      writer.tag(2, WireType.LengthDelimited).bytes(value.toBinary(options));
      break;
  }
  writer.join();
}
function writeMessageField(writer, options, field, value) {
  const message = wrapField(field.T, value);
  if (field.delimited)
    writer.tag(field.no, WireType.StartGroup).raw(message.toBinary(options)).tag(field.no, WireType.EndGroup);
  else
    writer.tag(field.no, WireType.LengthDelimited).bytes(message.toBinary(options));
}
function writeScalar2(writer, type, fieldNo, value) {
  assert(value !== void 0);
  let [wireType, method] = scalarTypeInfo(type);
  writer.tag(fieldNo, wireType)[method](value);
}
function writePacked(writer, type, fieldNo, value) {
  if (!value.length) {
    return;
  }
  writer.tag(fieldNo, WireType.LengthDelimited).fork();
  let [, method] = scalarTypeInfo(type);
  for (let i = 0; i < value.length; i++) {
    writer[method](value[i]);
  }
  writer.join();
}
function scalarTypeInfo(type) {
  let wireType = WireType.Varint;
  switch (type) {
    case ScalarType.BYTES:
    case ScalarType.STRING:
      wireType = WireType.LengthDelimited;
      break;
    case ScalarType.DOUBLE:
    case ScalarType.FIXED64:
    case ScalarType.SFIXED64:
      wireType = WireType.Bit64;
      break;
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.FLOAT:
      wireType = WireType.Bit32;
      break;
  }
  const method = ScalarType[type].toLowerCase();
  return [wireType, method];
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/util-common.js
function makeUtilCommon() {
  return {
    setEnumType,
    initPartial(source, target) {
      if (source === void 0) {
        return;
      }
      const type = target.getType();
      for (const member of type.fields.byMember()) {
        const localName = member.localName, t = target, s = source;
        if (s[localName] == null) {
          continue;
        }
        switch (member.kind) {
          case "oneof":
            const sk = s[localName].case;
            if (sk === void 0) {
              continue;
            }
            const sourceField = member.findField(sk);
            let val = s[localName].value;
            if (sourceField && sourceField.kind == "message" && !isMessage(val, sourceField.T)) {
              val = new sourceField.T(val);
            } else if (sourceField && sourceField.kind === "scalar" && sourceField.T === ScalarType.BYTES) {
              val = toU8Arr(val);
            }
            t[localName] = { case: sk, value: val };
            break;
          case "scalar":
          case "enum":
            let copy = s[localName];
            if (member.T === ScalarType.BYTES) {
              copy = member.repeated ? copy.map(toU8Arr) : toU8Arr(copy);
            }
            t[localName] = copy;
            break;
          case "map":
            switch (member.V.kind) {
              case "scalar":
              case "enum":
                if (member.V.T === ScalarType.BYTES) {
                  for (const [k, v] of Object.entries(s[localName])) {
                    t[localName][k] = toU8Arr(v);
                  }
                } else {
                  Object.assign(t[localName], s[localName]);
                }
                break;
              case "message":
                const messageType = member.V.T;
                for (const k of Object.keys(s[localName])) {
                  let val2 = s[localName][k];
                  if (!messageType.fieldWrapper) {
                    val2 = new messageType(val2);
                  }
                  t[localName][k] = val2;
                }
                break;
            }
            break;
          case "message":
            const mt = member.T;
            if (member.repeated) {
              t[localName] = s[localName].map((val2) => isMessage(val2, mt) ? val2 : new mt(val2));
            } else {
              const val2 = s[localName];
              if (mt.fieldWrapper) {
                if (
                  // We can't use BytesValue.typeName as that will create a circular import
                  mt.typeName === "google.protobuf.BytesValue"
                ) {
                  t[localName] = toU8Arr(val2);
                } else {
                  t[localName] = val2;
                }
              } else {
                t[localName] = isMessage(val2, mt) ? val2 : new mt(val2);
              }
            }
            break;
        }
      }
    },
    // TODO use isFieldSet() here to support future field presence
    equals(type, a, b) {
      if (a === b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      return type.fields.byMember().every((m) => {
        const va = a[m.localName];
        const vb = b[m.localName];
        if (m.repeated) {
          if (va.length !== vb.length) {
            return false;
          }
          switch (m.kind) {
            case "message":
              return va.every((a2, i) => m.T.equals(a2, vb[i]));
            case "scalar":
              return va.every((a2, i) => scalarEquals(m.T, a2, vb[i]));
            case "enum":
              return va.every((a2, i) => scalarEquals(ScalarType.INT32, a2, vb[i]));
          }
          throw new Error(`repeated cannot contain ${m.kind}`);
        }
        switch (m.kind) {
          case "message":
            let a2 = va;
            let b2 = vb;
            if (m.T.fieldWrapper) {
              if (a2 !== void 0 && !isMessage(a2)) {
                a2 = m.T.fieldWrapper.wrapField(a2);
              }
              if (b2 !== void 0 && !isMessage(b2)) {
                b2 = m.T.fieldWrapper.wrapField(b2);
              }
            }
            return m.T.equals(a2, b2);
          case "enum":
            return scalarEquals(ScalarType.INT32, va, vb);
          case "scalar":
            return scalarEquals(m.T, va, vb);
          case "oneof":
            if (va.case !== vb.case) {
              return false;
            }
            const s = m.findField(va.case);
            if (s === void 0) {
              return true;
            }
            switch (s.kind) {
              case "message":
                return s.T.equals(va.value, vb.value);
              case "enum":
                return scalarEquals(ScalarType.INT32, va.value, vb.value);
              case "scalar":
                return scalarEquals(s.T, va.value, vb.value);
            }
            throw new Error(`oneof cannot contain ${s.kind}`);
          case "map":
            const keys = Object.keys(va).concat(Object.keys(vb));
            switch (m.V.kind) {
              case "message":
                const messageType = m.V.T;
                return keys.every((k) => messageType.equals(va[k], vb[k]));
              case "enum":
                return keys.every((k) => scalarEquals(ScalarType.INT32, va[k], vb[k]));
              case "scalar":
                const scalarType = m.V.T;
                return keys.every((k) => scalarEquals(scalarType, va[k], vb[k]));
            }
            break;
        }
      });
    },
    // TODO use isFieldSet() here to support future field presence
    clone(message) {
      const type = message.getType(), target = new type(), any = target;
      for (const member of type.fields.byMember()) {
        const source = message[member.localName];
        let copy;
        if (member.repeated) {
          copy = source.map(cloneSingularField);
        } else if (member.kind == "map") {
          copy = any[member.localName];
          for (const [key, v] of Object.entries(source)) {
            copy[key] = cloneSingularField(v);
          }
        } else if (member.kind == "oneof") {
          const f = member.findField(source.case);
          copy = f ? { case: source.case, value: cloneSingularField(source.value) } : { case: void 0 };
        } else {
          copy = cloneSingularField(source);
        }
        any[member.localName] = copy;
      }
      for (const uf of type.runtime.bin.listUnknownFields(message)) {
        type.runtime.bin.onUnknownField(any, uf.no, uf.wireType, uf.data);
      }
      return target;
    }
  };
}
function cloneSingularField(value) {
  if (value === void 0) {
    return value;
  }
  if (isMessage(value)) {
    return value.clone();
  }
  if (value instanceof Uint8Array) {
    const c = new Uint8Array(value.byteLength);
    c.set(value);
    return c;
  }
  return value;
}
function toU8Arr(input) {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/proto-runtime.js
function makeProtoRuntime(syntax, newFieldList, initFields) {
  return {
    syntax,
    json: makeJsonFormat(),
    bin: makeBinaryFormat(),
    util: Object.assign(Object.assign({}, makeUtilCommon()), {
      newFieldList,
      initFields
    }),
    makeMessageType(typeName, fields, opt) {
      return makeMessageType(this, typeName, fields, opt);
    },
    makeEnum,
    makeEnumType,
    getEnumType,
    makeExtension(typeName, extendee, field) {
      return makeExtension(this, typeName, extendee, field);
    }
  };
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/field-list.js
var InternalFieldList = class {
  constructor(fields, normalizer) {
    this._fields = fields;
    this._normalizer = normalizer;
  }
  findJsonName(jsonName) {
    if (!this.jsonNames) {
      const t = {};
      for (const f of this.list()) {
        t[f.jsonName] = t[f.name] = f;
      }
      this.jsonNames = t;
    }
    return this.jsonNames[jsonName];
  }
  find(fieldNo) {
    if (!this.numbers) {
      const t = {};
      for (const f of this.list()) {
        t[f.no] = f;
      }
      this.numbers = t;
    }
    return this.numbers[fieldNo];
  }
  list() {
    if (!this.all) {
      this.all = this._normalizer(this._fields);
    }
    return this.all;
  }
  byNumber() {
    if (!this.numbersAsc) {
      this.numbersAsc = this.list().concat().sort((a, b) => a.no - b.no);
    }
    return this.numbersAsc;
  }
  byMember() {
    if (!this.members) {
      this.members = [];
      const a = this.members;
      let o;
      for (const f of this.list()) {
        if (f.oneof) {
          if (f.oneof !== o) {
            o = f.oneof;
            a.push(o);
          }
        } else {
          a.push(f);
        }
      }
    }
    return this.members;
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/names.js
function localFieldName(protoName, inOneof) {
  const name = protoCamelCase(protoName);
  if (inOneof) {
    return name;
  }
  return safeObjectProperty(safeMessageProperty(name));
}
function localOneofName(protoName) {
  return localFieldName(protoName, false);
}
var fieldJsonName = protoCamelCase;
function protoCamelCase(snakeCase) {
  let capNext = false;
  const b = [];
  for (let i = 0; i < snakeCase.length; i++) {
    let c = snakeCase.charAt(i);
    switch (c) {
      case "_":
        capNext = true;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        b.push(c);
        capNext = false;
        break;
      default:
        if (capNext) {
          capNext = false;
          c = c.toUpperCase();
        }
        b.push(c);
        break;
    }
  }
  return b.join("");
}
var reservedObjectProperties = /* @__PURE__ */ new Set([
  // names reserved by JavaScript
  "constructor",
  "toString",
  "toJSON",
  "valueOf"
]);
var reservedMessageProperties = /* @__PURE__ */ new Set([
  // names reserved by the runtime
  "getType",
  "clone",
  "equals",
  "fromBinary",
  "fromJson",
  "fromJsonString",
  "toBinary",
  "toJson",
  "toJsonString",
  // names reserved by the runtime for the future
  "toObject"
]);
var fallback = (name) => `${name}$`;
var safeMessageProperty = (name) => {
  if (reservedMessageProperties.has(name)) {
    return fallback(name);
  }
  return name;
};
var safeObjectProperty = (name) => {
  if (reservedObjectProperties.has(name)) {
    return fallback(name);
  }
  return name;
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/field.js
var InternalOneofInfo = class {
  constructor(name) {
    this.kind = "oneof";
    this.repeated = false;
    this.packed = false;
    this.opt = false;
    this.req = false;
    this.default = void 0;
    this.fields = [];
    this.name = name;
    this.localName = localOneofName(name);
  }
  addField(field) {
    assert(field.oneof === this, `field ${field.name} not one of ${this.name}`);
    this.fields.push(field);
  }
  findField(localName) {
    if (!this._lookup) {
      this._lookup = /* @__PURE__ */ Object.create(null);
      for (let i = 0; i < this.fields.length; i++) {
        this._lookup[this.fields[i].localName] = this.fields[i];
      }
    }
    return this._lookup[localName];
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/private/field-normalize.js
function normalizeFieldInfos(fieldInfos, packedByDefault) {
  var _a, _b, _c, _d, _e, _f;
  const r = [];
  let o;
  for (const field of typeof fieldInfos == "function" ? fieldInfos() : fieldInfos) {
    const f = field;
    f.localName = localFieldName(field.name, field.oneof !== void 0);
    f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
    f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
    if (field.kind == "scalar") {
      f.L = (_c = field.L) !== null && _c !== void 0 ? _c : LongType.BIGINT;
    }
    f.delimited = (_d = field.delimited) !== null && _d !== void 0 ? _d : false;
    f.req = (_e = field.req) !== null && _e !== void 0 ? _e : false;
    f.opt = (_f = field.opt) !== null && _f !== void 0 ? _f : false;
    if (field.packed === void 0) {
      if (packedByDefault) {
        f.packed = field.kind == "enum" || field.kind == "scalar" && field.T != ScalarType.BYTES && field.T != ScalarType.STRING;
      } else {
        f.packed = false;
      }
    }
    if (field.oneof !== void 0) {
      const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
      if (!o || o.name != ooname) {
        o = new InternalOneofInfo(ooname);
      }
      f.oneof = o;
      o.addField(f);
    }
    r.push(f);
  }
  return r;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/proto3.js
var proto3 = makeProtoRuntime(
  "proto3",
  (fields) => {
    return new InternalFieldList(fields, (source) => normalizeFieldInfos(source, true));
  },
  // TODO merge with proto2 and initExtensionField, also see initPartial, equals, clone
  (target) => {
    for (const member of target.getType().fields.byMember()) {
      if (member.opt) {
        continue;
      }
      const name = member.localName, t = target;
      if (member.repeated) {
        t[name] = [];
        continue;
      }
      switch (member.kind) {
        case "oneof":
          t[name] = { case: void 0 };
          break;
        case "enum":
          t[name] = 0;
          break;
        case "map":
          t[name] = {};
          break;
        case "scalar":
          t[name] = scalarZeroValue(member.T, member.L);
          break;
        case "message":
          break;
      }
    }
  }
);

// ../node_modules/.pnpm/@bufbuild+protobuf@1.10.1_patch_hash=b56e7d63154958cee98db228b1c9efd9a1cb20db048af22a56bba107b262264e/node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/struct_pb.js
var NullValue;
(function(NullValue2) {
  NullValue2[NullValue2["NULL_VALUE"] = 0] = "NULL_VALUE";
})(NullValue || (NullValue = {}));
proto3.util.setEnumType(NullValue, "google.protobuf.NullValue", [
  { no: 0, name: "NULL_VALUE" }
]);
var Struct = class _Struct extends Message {
  constructor(data) {
    super();
    this.fields = {};
    proto3.util.initPartial(data, this);
  }
  toJson(options) {
    const json = {};
    for (const [k, v] of Object.entries(this.fields)) {
      json[k] = v.toJson(options);
    }
    return json;
  }
  fromJson(json, options) {
    if (typeof json != "object" || json == null || Array.isArray(json)) {
      throw new Error("cannot decode google.protobuf.Struct from JSON " + proto3.json.debug(json));
    }
    for (const [k, v] of Object.entries(json)) {
      this.fields[k] = Value.fromJson(v);
    }
    return this;
  }
  static fromBinary(bytes, options) {
    return new _Struct().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Struct().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Struct().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Struct, a, b);
  }
};
Struct.runtime = proto3;
Struct.typeName = "google.protobuf.Struct";
Struct.fields = proto3.util.newFieldList(() => [
  { no: 1, name: "fields", kind: "map", K: 9, V: { kind: "message", T: Value } }
]);
var Value = class _Value extends Message {
  constructor(data) {
    super();
    this.kind = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  toJson(options) {
    switch (this.kind.case) {
      case "nullValue":
        return null;
      case "numberValue":
        if (!Number.isFinite(this.kind.value)) {
          throw new Error("google.protobuf.Value cannot be NaN or Infinity");
        }
        return this.kind.value;
      case "boolValue":
        return this.kind.value;
      case "stringValue":
        return this.kind.value;
      case "structValue":
      case "listValue":
        return this.kind.value.toJson(Object.assign(Object.assign({}, options), { emitDefaultValues: true }));
    }
    throw new Error("google.protobuf.Value must have a value");
  }
  fromJson(json, options) {
    switch (typeof json) {
      case "number":
        this.kind = { case: "numberValue", value: json };
        break;
      case "string":
        this.kind = { case: "stringValue", value: json };
        break;
      case "boolean":
        this.kind = { case: "boolValue", value: json };
        break;
      case "object":
        if (json === null) {
          this.kind = { case: "nullValue", value: NullValue.NULL_VALUE };
        } else if (Array.isArray(json)) {
          this.kind = { case: "listValue", value: ListValue.fromJson(json) };
        } else {
          this.kind = { case: "structValue", value: Struct.fromJson(json) };
        }
        break;
      default:
        throw new Error("cannot decode google.protobuf.Value from JSON " + proto3.json.debug(json));
    }
    return this;
  }
  static fromBinary(bytes, options) {
    return new _Value().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Value().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Value().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Value, a, b);
  }
};
Value.runtime = proto3;
Value.typeName = "google.protobuf.Value";
Value.fields = proto3.util.newFieldList(() => [
  { no: 1, name: "null_value", kind: "enum", T: proto3.getEnumType(NullValue), oneof: "kind" },
  { no: 2, name: "number_value", kind: "scalar", T: 1, oneof: "kind" },
  { no: 3, name: "string_value", kind: "scalar", T: 9, oneof: "kind" },
  { no: 4, name: "bool_value", kind: "scalar", T: 8, oneof: "kind" },
  { no: 5, name: "struct_value", kind: "message", T: Struct, oneof: "kind" },
  { no: 6, name: "list_value", kind: "message", T: ListValue, oneof: "kind" }
]);
var ListValue = class _ListValue extends Message {
  constructor(data) {
    super();
    this.values = [];
    proto3.util.initPartial(data, this);
  }
  toJson(options) {
    return this.values.map((v) => v.toJson());
  }
  fromJson(json, options) {
    if (!Array.isArray(json)) {
      throw new Error("cannot decode google.protobuf.ListValue from JSON " + proto3.json.debug(json));
    }
    for (let e of json) {
      this.values.push(Value.fromJson(e));
    }
    return this;
  }
  static fromBinary(bytes, options) {
    return new _ListValue().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListValue().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListValue().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListValue, a, b);
  }
};
ListValue.runtime = proto3;
ListValue.typeName = "google.protobuf.ListValue";
ListValue.fields = proto3.util.newFieldList(() => [
  { no: 1, name: "values", kind: "message", T: Value, repeated: true }
]);

// ../packages/proto/dist/runtime/compact.js
function defineOwn(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
  return value;
}
function fieldType(runtime, refs, token) {
  if (token.charAt(0) !== "#") {
    return { kind: "scalar", T: Number(token) };
  }
  const ref = refs[Number(token.slice(1))];
  return typeof ref === "function" ? { kind: "message", T: ref } : { kind: "enum", T: runtime.getEnumType(ref) };
}
function fieldsFromDescriptor(runtime, descriptor) {
  const entries = descriptor[0].split("|");
  const refs = descriptor.slice(1);
  const fields = [];
  for (let i = 1; i < entries.length; i++) {
    const tokens = entries[i].split(" ");
    const no = Number(tokens[0]);
    const name = tokens[1];
    let type = tokens[2];
    let mod = tokens[3];
    const last = type.charAt(type.length - 1);
    if (last === "?" || last === "*") {
      mod = last;
      type = type.slice(0, -1);
    }
    const comma = type.indexOf(",");
    if (comma !== -1) {
      fields.push({
        no,
        name,
        kind: "map",
        K: Number(type.slice(0, comma)),
        V: fieldType(runtime, refs, type.slice(comma + 1))
      });
      continue;
    }
    const field = Object.assign({ no, name }, fieldType(runtime, refs, type));
    if (mod === "?") {
      field.opt = true;
    } else if (mod === "*") {
      field.repeated = true;
    } else if (mod !== void 0) {
      field.oneof = mod;
    }
    fields.push(field);
  }
  return fields;
}
function nameFromDescriptor(descriptor) {
  const text = descriptor[0];
  const bar = text.indexOf("|");
  return bar === -1 ? text : text.slice(0, bar);
}
var CompactMessage = class extends Message {
  static get typeName() {
    const cls = this;
    return defineOwn(cls, "typeName", cls.$p() + nameFromDescriptor(cls.$()));
  }
  static get fields() {
    const cls = this;
    const descriptor = cls.$();
    const runtime = cls.runtime;
    const thunk = () => fieldsFromDescriptor(runtime, descriptor);
    return defineOwn(cls, "fields", runtime.util.newFieldList(thunk));
  }
};
function enumLocalNames(enumName, names) {
  const prefix = (enumName.charAt(0) + enumName.slice(1).replace(/[A-Z]/g, (c) => "_" + c)).toLowerCase() + "_";
  const stripped = [];
  for (const name of names) {
    if (!name.toLowerCase().startsWith(prefix)) {
      return names.slice();
    }
    const local = name.slice(prefix.length);
    if (local === "" || /^[0-9]/.test(local)) {
      return names.slice();
    }
    stripped.push(local);
  }
  return stripped;
}
function enumValuePrefix(enumName) {
  return (enumName.charAt(0) + enumName.slice(1).replace(/[A-Z]/g, (c) => "_" + c)).toUpperCase() + "_";
}
function enumType(runtime, packagePrefix, enumName, values, names) {
  const simpleName = enumName.slice(enumName.lastIndexOf(".") + 1);
  let protoNames;
  let localNames;
  if (names === 1) {
    const prefix = enumValuePrefix(simpleName);
    localNames = values.map((v) => v[1]);
    protoNames = localNames.map((local) => prefix + local);
  } else {
    protoNames = values.map((v) => v[1]);
    localNames = names === void 0 ? enumLocalNames(simpleName, protoNames) : names;
  }
  const enumObject = {};
  const infos = [];
  for (let i = 0; i < values.length; i++) {
    const no = values[i][0];
    enumObject[localNames[i]] = no;
    enumObject[no] = localNames[i];
    infos.push({ no, name: protoNames[i] });
  }
  runtime.util.setEnumType(enumObject, packagePrefix + enumName, infos);
  return enumObject;
}

// ../packages/proto/dist/generated/agent/v1/subagents_pb.js
var __protoPackage = "agent.v1.";
var __protoMessage3 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage;
  }
};
var CustomSubagentPermissionMode = /* @__PURE__ */ enumType(proto3, __protoPackage, "CustomSubagentPermissionMode", [[0, "UNSPECIFIED"], [1, "DEFAULT"], [2, "READONLY"], [3, "AGENT_ONLY"]], 1);
var SubagentExecutionEnvironment = /* @__PURE__ */ enumType(proto3, __protoPackage, "SubagentExecutionEnvironment", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD"]], 1);
var SubagentBackgroundReason = /* @__PURE__ */ enumType(proto3, __protoPackage, "SubagentBackgroundReason", [[0, "UNSPECIFIED"], [1, "AGENT_REQUEST"], [2, "USER_REQUEST"], [3, "QUEUED_FOLLOW_UP"]], 1);
var BackgroundTaskCompletionReason = /* @__PURE__ */ enumType(proto3, __protoPackage, "BackgroundTaskCompletionReason", [[0, "UNSPECIFIED"], [1, "TASK_FINISHED"], [2, "TASK_PROGRESS"], [3, "WORKER_REPARENTED"], [4, "WORKER_MESSAGE"], [5, "WORKER_NEEDS_ATTENTION"]], 1);
var TaskMode = /* @__PURE__ */ enumType(proto3, __protoPackage, "TaskMode", [[0, "UNSPECIFIED"], [1, "AGENT"], [2, "PLAN"]], 1);
var SubagentType = class _SubagentType extends __protoMessage3 {
  constructor(data) {
    super();
    this.type = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentType().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentType().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentType().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentType, a, b);
  }
  static $() {
    return ["SubagentType|1 unspecified #0 type|2 computer_use #1 type|3 custom #2 type|4 explore #3 type|5 media_review #4 type|6 bash #5 type|7 browser_use #6 type|8 shell #7 type|9 vm_setup_helper #8 type|10 debug #9 type|11 cursor_guide #10 type|12 watch_video #11 type", SubagentTypeUnspecified, SubagentTypeComputerUse, SubagentTypeCustom, SubagentTypeExplore, SubagentTypeMediaReview, SubagentTypeBash, SubagentTypeBrowserUse, SubagentTypeShell, SubagentTypeVmSetupHelper, SubagentTypeDebug, SubagentTypeCursorGuide, SubagentTypeWatchVideo];
  }
};
var SubagentTypeUnspecified = class _SubagentTypeUnspecified extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeUnspecified().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeUnspecified().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeUnspecified().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeUnspecified, a, b);
  }
  static $() {
    return ["SubagentTypeUnspecified"];
  }
};
var SubagentTypeComputerUse = class _SubagentTypeComputerUse extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeComputerUse().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeComputerUse().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeComputerUse().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeComputerUse, a, b);
  }
  static $() {
    return ["SubagentTypeComputerUse"];
  }
};
var SubagentTypeExplore = class _SubagentTypeExplore extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeExplore().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeExplore().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeExplore().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeExplore, a, b);
  }
  static $() {
    return ["SubagentTypeExplore"];
  }
};
var SubagentTypeMediaReview = class _SubagentTypeMediaReview extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeMediaReview().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeMediaReview().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeMediaReview().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeMediaReview, a, b);
  }
  static $() {
    return ["SubagentTypeMediaReview"];
  }
};
var SubagentTypeBash = class _SubagentTypeBash extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeBash().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeBash().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeBash().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeBash, a, b);
  }
  static $() {
    return ["SubagentTypeBash"];
  }
};
var SubagentTypeShell = class _SubagentTypeShell extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeShell().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeShell().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeShell().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeShell, a, b);
  }
  static $() {
    return ["SubagentTypeShell"];
  }
};
var SubagentTypeBrowserUse = class _SubagentTypeBrowserUse extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeBrowserUse().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeBrowserUse().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeBrowserUse().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeBrowserUse, a, b);
  }
  static $() {
    return ["SubagentTypeBrowserUse"];
  }
};
var SubagentTypeVmSetupHelper = class _SubagentTypeVmSetupHelper extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeVmSetupHelper().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeVmSetupHelper().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeVmSetupHelper().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeVmSetupHelper, a, b);
  }
  static $() {
    return ["SubagentTypeVmSetupHelper"];
  }
};
var SubagentTypeDebug = class _SubagentTypeDebug extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeDebug().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeDebug().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeDebug().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeDebug, a, b);
  }
  static $() {
    return ["SubagentTypeDebug"];
  }
};
var SubagentTypeCursorGuide = class _SubagentTypeCursorGuide extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeCursorGuide().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeCursorGuide().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeCursorGuide().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeCursorGuide, a, b);
  }
  static $() {
    return ["SubagentTypeCursorGuide"];
  }
};
var SubagentTypeWatchVideo = class _SubagentTypeWatchVideo extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeWatchVideo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeWatchVideo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeWatchVideo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeWatchVideo, a, b);
  }
  static $() {
    return ["SubagentTypeWatchVideo"];
  }
};
var SubagentTypeCustom = class _SubagentTypeCustom extends __protoMessage3 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeCustom().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeCustom().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeCustom().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeCustom, a, b);
  }
  static $() {
    return ["SubagentTypeCustom|1 name 9"];
  }
};
var CustomSubagent = class _CustomSubagent extends __protoMessage3 {
  constructor(data) {
    super();
    this.fullPath = "";
    this.name = "";
    this.description = "";
    this.tools = [];
    this.model = "";
    this.prompt = "";
    this.permissionMode = CustomSubagentPermissionMode.UNSPECIFIED;
    this.isBackground = false;
    this.forceDefaultModel = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CustomSubagent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CustomSubagent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CustomSubagent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CustomSubagent, a, b);
  }
  static $() {
    return ["CustomSubagent|1 full_path 9|2 name 9|3 description 9|4 tools 9*|5 model 9|6 prompt 9|7 permission_mode #0|8 is_background 8|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 force_default_model 8|14 source 9?", CustomSubagentPermissionMode];
  }
};

// ../packages/proto/dist/generated/agent/v1/sandbox_pb.js
var __protoPackage2 = "agent.v1.";
var __protoMessage32 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage2;
  }
};
var NetworkPolicyLoggingConfig = class _NetworkPolicyLoggingConfig extends __protoMessage32 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _NetworkPolicyLoggingConfig().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _NetworkPolicyLoggingConfig().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _NetworkPolicyLoggingConfig().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_NetworkPolicyLoggingConfig, a, b);
  }
  static $() {
    return ["NetworkPolicyLoggingConfig|1 decision_log_path 9?|2 log_format 9?"];
  }
};
var NetworkPolicy = class _NetworkPolicy extends __protoMessage32 {
  constructor(data) {
    super();
    this.deny = [];
    this.allow = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _NetworkPolicy().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _NetworkPolicy().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _NetworkPolicy().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_NetworkPolicy, a, b);
  }
  static $() {
    return ["NetworkPolicy|1 version 13?|2 default_action #0?|3 deny 9*|4 allow 9*|5 logging #1?", NetworkPolicy_DefaultAction, NetworkPolicyLoggingConfig];
  }
};
var NetworkPolicy_DefaultAction = /* @__PURE__ */ enumType(proto3, __protoPackage2, "NetworkPolicy.DefaultAction", [[0, "UNSPECIFIED"], [1, "ALLOW"], [2, "DENY"]], 1);
var SandboxPolicy = class _SandboxPolicy extends __protoMessage32 {
  constructor(data) {
    super();
    this.type = SandboxPolicy_Type.UNSPECIFIED;
    this.additionalReadwritePaths = [];
    this.additionalReadonlyPaths = [];
    this.readBoundary = SandboxPolicy_ReadBoundaryMode.UNSPECIFIED;
    this.additionalReadPaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SandboxPolicy().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SandboxPolicy().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SandboxPolicy().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SandboxPolicy, a, b);
  }
  static $() {
    return ["SandboxPolicy|1 type #0|2 network_access 8?|3 additional_readwrite_paths 9*|4 additional_readonly_paths 9*|5 debug_output_dir 9?|7 disable_tmp_write 8?|8 allowlist_escalated 8?|9 enable_shared_build_cache 8?|10 network_policy #1?|11 network_policy_strict 8?|12 capture_denies 8?|13 skip_statsig_defaults 8?|14 read_boundary #2|15 additional_read_paths 9*", SandboxPolicy_Type, NetworkPolicy, SandboxPolicy_ReadBoundaryMode];
  }
};
var SandboxPolicy_Type = /* @__PURE__ */ enumType(proto3, __protoPackage2, "SandboxPolicy.Type", [[0, "UNSPECIFIED"], [1, "INSECURE_NONE"], [2, "WORKSPACE_READWRITE"], [3, "WORKSPACE_READONLY"]], 1);
var SandboxPolicy_ReadBoundaryMode = /* @__PURE__ */ enumType(proto3, __protoPackage2, "SandboxPolicy.ReadBoundaryMode", [[0, "UNSPECIFIED"], [1, "SYSTEM"], [2, "WORKSPACE"]], 1);

// ../packages/proto/dist/generated/agent/v1/utils_pb.js
var __protoPackage3 = "agent.v1.";
var __protoMessage33 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage3;
  }
};
var Range = class _Range extends __protoMessage33 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Range().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Range().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Range().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Range, a, b);
  }
  static $() {
    return ["Range|1 start #0|2 end #0", Position];
  }
};
var Position = class _Position extends __protoMessage33 {
  constructor(data) {
    super();
    this.line = 0;
    this.column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Position().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Position().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Position().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Position, a, b);
  }
  static $() {
    return ["Position|1 line 13|2 column 13"];
  }
};
var OutputLocation = class _OutputLocation extends __protoMessage33 {
  constructor(data) {
    super();
    this.filePath = "";
    this.sizeBytes = protoInt64.zero;
    this.lineCount = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _OutputLocation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _OutputLocation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _OutputLocation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_OutputLocation, a, b);
  }
  static $() {
    return ["OutputLocation|1 file_path 9|2 size_bytes 3|3 line_count 3"];
  }
};
var SmartModeApproval = class _SmartModeApproval extends __protoMessage33 {
  constructor(data) {
    super();
    this.requestId = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SmartModeApproval().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SmartModeApproval().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SmartModeApproval().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SmartModeApproval, a, b);
  }
  static $() {
    return ["SmartModeApproval|1 request_id 9|2 reason 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/hook_additional_context_pb.js
var __protoPackage4 = "agent.v1.";
var __protoMessage34 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage4;
  }
};
var HookAdditionalContext = class _HookAdditionalContext extends __protoMessage34 {
  constructor(data) {
    super();
    this.hookEventName = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _HookAdditionalContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _HookAdditionalContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _HookAdditionalContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_HookAdditionalContext, a, b);
  }
  static $() {
    return ["HookAdditionalContext|1 hook_event_name 9|2 content 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/shell_exec_pb.js
var __protoPackage5 = "agent.v1.";
var __protoMessage35 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage5;
  }
};
var TimeoutBehavior = /* @__PURE__ */ enumType(proto3, __protoPackage5, "TimeoutBehavior", [[0, "UNSPECIFIED"], [1, "CANCEL"], [2, "BACKGROUND"]], 1);
var ShellBackgroundReason = /* @__PURE__ */ enumType(proto3, __protoPackage5, "ShellBackgroundReason", [[0, "UNSPECIFIED"], [1, "TIMEOUT"], [2, "USER_REQUEST"]], 1);
var ShellAbortReason = /* @__PURE__ */ enumType(proto3, __protoPackage5, "ShellAbortReason", [[0, "UNSPECIFIED"], [1, "USER_ABORT"], [2, "TIMEOUT"]], 1);
var ShellCommandParsingResult = class _ShellCommandParsingResult extends __protoMessage35 {
  constructor(data) {
    super();
    this.parsingFailed = false;
    this.executableCommands = [];
    this.hasRedirects = false;
    this.hasCommandSubstitution = false;
    this.redirects = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellCommandParsingResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellCommandParsingResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellCommandParsingResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellCommandParsingResult, a, b);
  }
  static $() {
    return ["ShellCommandParsingResult|1 parsing_failed 8|2 executable_commands #0*|3 has_redirects 8|4 has_command_substitution 8|5 all_redirects_are_dev_null 8?|6 redirects #1*", ShellCommandParsingResult_ExecutableCommand, ShellCommandParsingResult_Redirect];
  }
};
var ShellCommandParsingResult_ExecutableCommandArg = class _ShellCommandParsingResult_ExecutableCommandArg extends __protoMessage35 {
  constructor(data) {
    super();
    this.type = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellCommandParsingResult_ExecutableCommandArg().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellCommandParsingResult_ExecutableCommandArg().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellCommandParsingResult_ExecutableCommandArg().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellCommandParsingResult_ExecutableCommandArg, a, b);
  }
  static $() {
    return ["ShellCommandParsingResult.ExecutableCommandArg|1 type 9|2 value 9"];
  }
};
var ShellCommandParsingResult_ExecutableCommand = class _ShellCommandParsingResult_ExecutableCommand extends __protoMessage35 {
  constructor(data) {
    super();
    this.name = "";
    this.args = [];
    this.fullText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellCommandParsingResult_ExecutableCommand().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellCommandParsingResult_ExecutableCommand().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellCommandParsingResult_ExecutableCommand().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellCommandParsingResult_ExecutableCommand, a, b);
  }
  static $() {
    return ["ShellCommandParsingResult.ExecutableCommand|1 name 9|2 args #0*|3 full_text 9", ShellCommandParsingResult_ExecutableCommandArg];
  }
};
var ShellCommandParsingResult_Redirect = class _ShellCommandParsingResult_Redirect extends __protoMessage35 {
  constructor(data) {
    super();
    this.operator = "";
    this.destinationFds = [];
    this.targetNodeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellCommandParsingResult_Redirect().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellCommandParsingResult_Redirect().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellCommandParsingResult_Redirect().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellCommandParsingResult_Redirect, a, b);
  }
  static $() {
    return ["ShellCommandParsingResult.Redirect|1 operator 9|2 destination_fds 13*|3 target_node_type 9|4 target_text 9?"];
  }
};
var CommandClassifierResult = class _CommandClassifierResult extends __protoMessage35 {
  constructor(data) {
    super();
    this.commands = [];
    this.suggestedSandboxMode = CommandClassifierResult_SuggestedSandboxMode.UNSPECIFIED;
    this.classificationFailed = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommandClassifierResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommandClassifierResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommandClassifierResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommandClassifierResult, a, b);
  }
  static $() {
    return ["CommandClassifierResult|1 commands #0*|2 suggested_sandbox_mode #1|3 classification_failed 8", CommandClassifierResult_ClassifiedCommand, CommandClassifierResult_SuggestedSandboxMode];
  }
};
var CommandClassifierResult_SuggestedSandboxMode = /* @__PURE__ */ enumType(proto3, __protoPackage5, "CommandClassifierResult.SuggestedSandboxMode", [[0, "UNSPECIFIED"], [1, "SANDBOX"], [2, "NO_SANDBOX"], [3, "UNDETERMINED"]], 1);
var CommandClassifierResult_ClassifiedCommand = class _CommandClassifierResult_ClassifiedCommand extends __protoMessage35 {
  constructor(data) {
    super();
    this.name = "";
    this.arguments = [];
    this.subcommandTokens = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommandClassifierResult_ClassifiedCommand().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommandClassifierResult_ClassifiedCommand().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommandClassifierResult_ClassifiedCommand().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommandClassifierResult_ClassifiedCommand, a, b);
  }
  static $() {
    return ["CommandClassifierResult.ClassifiedCommand|1 name 9|2 arguments 9*|3 suggested_allowlist_entry 9?|4 subcommand_tokens 9*"];
  }
};
var ShellOutputNotificationConfig = class _ShellOutputNotificationConfig extends __protoMessage35 {
  constructor(data) {
    super();
    this.pattern = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellOutputNotificationConfig().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellOutputNotificationConfig().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellOutputNotificationConfig().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellOutputNotificationConfig, a, b);
  }
  static $() {
    return ["ShellOutputNotificationConfig|1 pattern 9|2 reason 9|3 debounce 1?|4 notification_limit 5?"];
  }
};
var ShellHookApprovalRequirement = class _ShellHookApprovalRequirement extends __protoMessage35 {
  constructor(data) {
    super();
    this.kind = ShellHookApprovalRequirement_Kind.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellHookApprovalRequirement().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellHookApprovalRequirement().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellHookApprovalRequirement().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellHookApprovalRequirement, a, b);
  }
  static $() {
    return ["ShellHookApprovalRequirement|1 kind #0|2 reason 9?", ShellHookApprovalRequirement_Kind];
  }
};
var ShellHookApprovalRequirement_Kind = /* @__PURE__ */ enumType(proto3, __protoPackage5, "ShellHookApprovalRequirement.Kind", [[0, "UNSPECIFIED"], [1, "FORCE_PROMPT"]], 1);
var ShellArgs = class _ShellArgs extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.timeout = 0;
    this.toolCallId = "";
    this.simpleCommands = [];
    this.hasInputRedirect = false;
    this.hasOutputRedirect = false;
    this.isBackground = false;
    this.skipApproval = false;
    this.timeoutBehavior = TimeoutBehavior.UNSPECIFIED;
    this.closeStdin = false;
    this.adminCommandDenylist = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellArgs, a, b);
  }
  static $() {
    return ["ShellArgs|1 command 9|2 working_directory 9|3 timeout 5|4 tool_call_id 9|5 simple_commands 9*|6 has_input_redirect 8|7 has_output_redirect 8|8 parsing_result #0|9 requested_sandbox_policy #1?|10 file_output_threshold_bytes 4?|11 is_background 8|12 skip_approval 8|13 timeout_behavior #2|14 hard_timeout 5?|15 description 9?|16 classifier_result #3?|17 close_stdin 8|18 output_notification #4?|19 smart_mode_approval #5?|20 hook_approval_requirement #6?|21 conversation_id 9?|22 admin_command_denylist 9*|23 request_id 9?|24 secret_scope_id 9?", ShellCommandParsingResult, SandboxPolicy, TimeoutBehavior, CommandClassifierResult, ShellOutputNotificationConfig, SmartModeApproval, ShellHookApprovalRequirement];
  }
};
var ShellResult = class _ShellResult extends __protoMessage35 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellResult, a, b);
  }
  static $() {
    return ["ShellResult|1 success #0 result|2 failure #1 result|3 timeout #2 result|4 rejected #3 result|5 spawn_error #4 result|7 permission_denied #5 result|101 sandbox_policy #6?|102 is_background 8?|103 terminals_folder 9?|104 pid 13?", ShellSuccess, ShellFailure, ShellTimeout, ShellRejected, ShellSpawnError, ShellPermissionDenied, SandboxPolicy];
  }
};
var ShellSuccess = class _ShellSuccess extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.exitCode = 0;
    this.signal = "";
    this.stdout = "";
    this.stderr = "";
    this.executionTime = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellSuccess, a, b);
  }
  static $() {
    return ["ShellSuccess|1 command 9|2 working_directory 9|3 exit_code 5|4 signal 9|5 stdout 9|6 stderr 9|7 execution_time 5|8 output_location #0?|9 shell_id 13?|10 interleaved_output 9?|11 pid 13?|12 ms_to_wait 5?|13 local_execution_time_ms 5?|14 background_reason #1?|15 output_head 9?|16 output_tail 9?|17 elided_chars 13?", OutputLocation, ShellBackgroundReason];
  }
};
var ShellFailure = class _ShellFailure extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.exitCode = 0;
    this.signal = "";
    this.stdout = "";
    this.stderr = "";
    this.executionTime = 0;
    this.aborted = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellFailure, a, b);
  }
  static $() {
    return ["ShellFailure|1 command 9|2 working_directory 9|3 exit_code 5|4 signal 9|5 stdout 9|6 stderr 9|7 execution_time 5|8 output_location #0?|9 interleaved_output 9?|10 abort_reason #1?|11 aborted 8|12 local_execution_time_ms 5?|13 output_head 9?|14 output_tail 9?|15 elided_chars 13?", OutputLocation, ShellAbortReason];
  }
};
var ShellTimeout = class _ShellTimeout extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.timeoutMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellTimeout().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellTimeout().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellTimeout().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellTimeout, a, b);
  }
  static $() {
    return ["ShellTimeout|1 command 9|2 working_directory 9|3 timeout_ms 5"];
  }
};
var ShellRejected = class _ShellRejected extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.reason = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellRejected, a, b);
  }
  static $() {
    return ["ShellRejected|1 command 9|2 working_directory 9|3 reason 9|4 is_readonly 8"];
  }
};
var ShellPermissionDenied = class _ShellPermissionDenied extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.error = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellPermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellPermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellPermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellPermissionDenied, a, b);
  }
  static $() {
    return ["ShellPermissionDenied|1 command 9|2 working_directory 9|3 error 9|4 is_readonly 8"];
  }
};
var ShellSpawnError = class _ShellSpawnError extends __protoMessage35 {
  constructor(data) {
    super();
    this.command = "";
    this.workingDirectory = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellSpawnError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellSpawnError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellSpawnError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellSpawnError, a, b);
  }
  static $() {
    return ["ShellSpawnError|1 command 9|2 working_directory 9|3 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/shell_tool_pb.js
var __protoPackage6 = "agent.v1.";
var __protoMessage36 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage6;
  }
};
var ShellToolCall = class _ShellToolCall extends __protoMessage36 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellToolCall, a, b);
  }
  static $() {
    return ["ShellToolCall|1 args #0|2 result #1|3 description 9?", ShellArgs, ShellResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/delete_exec_pb.js
var __protoPackage7 = "agent.v1.";
var __protoMessage37 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage7;
  }
};
var DeleteArgs = class _DeleteArgs extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteArgs, a, b);
  }
  static $() {
    return ["DeleteArgs|1 path 9|2 tool_call_id 9"];
  }
};
var DeleteResult = class _DeleteResult extends __protoMessage37 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteResult, a, b);
  }
  static $() {
    return ["DeleteResult|1 success #0 result|2 file_not_found #1 result|3 not_file #2 result|4 permission_denied #3 result|5 file_busy #4 result|6 rejected #5 result|7 error #6 result", DeleteSuccess, DeleteFileNotFound, DeleteNotFile, DeletePermissionDenied, DeleteFileBusy, DeleteRejected, DeleteError];
  }
};
var DeleteSuccess = class _DeleteSuccess extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.deletedFile = "";
    this.fileSize = protoInt64.zero;
    this.prevContent = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteSuccess, a, b);
  }
  static $() {
    return ["DeleteSuccess|1 path 9|2 deleted_file 9|3 file_size 3|4 prev_content 9"];
  }
};
var DeleteFileNotFound = class _DeleteFileNotFound extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteFileNotFound().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteFileNotFound().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteFileNotFound().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteFileNotFound, a, b);
  }
  static $() {
    return ["DeleteFileNotFound|1 path 9"];
  }
};
var DeleteNotFile = class _DeleteNotFile extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.actualType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteNotFile().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteNotFile().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteNotFile().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteNotFile, a, b);
  }
  static $() {
    return ["DeleteNotFile|1 path 9|2 actual_type 9"];
  }
};
var DeletePermissionDenied = class _DeletePermissionDenied extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.clientVisibleError = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeletePermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeletePermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeletePermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeletePermissionDenied, a, b);
  }
  static $() {
    return ["DeletePermissionDenied|1 path 9|2 client_visible_error 9|3 is_readonly 8"];
  }
};
var DeleteFileBusy = class _DeleteFileBusy extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteFileBusy().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteFileBusy().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteFileBusy().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteFileBusy, a, b);
  }
  static $() {
    return ["DeleteFileBusy|1 path 9"];
  }
};
var DeleteRejected = class _DeleteRejected extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteRejected, a, b);
  }
  static $() {
    return ["DeleteRejected|1 path 9|2 reason 9"];
  }
};
var DeleteError = class _DeleteError extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteError, a, b);
  }
  static $() {
    return ["DeleteError|1 path 9|2 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/delete_tool_pb.js
var __protoPackage8 = "agent.v1.";
var __protoMessage38 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage8;
  }
};
var DeleteToolCall = class _DeleteToolCall extends __protoMessage38 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteToolCall, a, b);
  }
  static $() {
    return ["DeleteToolCall|1 args #0|2 result #1", DeleteArgs, DeleteResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/glob_tool_pb.js
var __protoPackage9 = "agent.v1.";
var __protoMessage39 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage9;
  }
};
var GlobToolArgs = class _GlobToolArgs extends __protoMessage39 {
  constructor(data) {
    super();
    this.globPattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GlobToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GlobToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GlobToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GlobToolArgs, a, b);
  }
  static $() {
    return ["GlobToolArgs|1 target_directory 9?|2 glob_pattern 9"];
  }
};
var GlobToolResult = class _GlobToolResult extends __protoMessage39 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GlobToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GlobToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GlobToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GlobToolResult, a, b);
  }
  static $() {
    return ["GlobToolResult|1 success #0 result|2 error #1 result", GlobToolSuccess, GlobToolError];
  }
};
var GlobToolError = class _GlobToolError extends __protoMessage39 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GlobToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GlobToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GlobToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GlobToolError, a, b);
  }
  static $() {
    return ["GlobToolError|1 error 9"];
  }
};
var GlobToolSuccess = class _GlobToolSuccess extends __protoMessage39 {
  constructor(data) {
    super();
    this.pattern = "";
    this.path = "";
    this.files = [];
    this.totalFiles = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GlobToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GlobToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GlobToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GlobToolSuccess, a, b);
  }
  static $() {
    return ["GlobToolSuccess|1 pattern 9|2 path 9|3 files 9*|4 total_files 5|5 client_truncated 8|6 ripgrep_truncated 8"];
  }
};
var GlobToolCall = class _GlobToolCall extends __protoMessage39 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GlobToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GlobToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GlobToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GlobToolCall, a, b);
  }
  static $() {
    return ["GlobToolCall|1 args #0|2 result #1", GlobToolArgs, GlobToolResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/grep_exec_pb.js
var __protoPackage10 = "agent.v1.";
var __protoMessage310 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage10;
  }
};
var GrepArgs = class _GrepArgs extends __protoMessage310 {
  constructor(data) {
    super();
    this.pattern = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepArgs, a, b);
  }
  static $() {
    return ["GrepArgs|1 pattern 9|2 path 9?|3 glob 9?|4 output_mode 9?|5 context_before 5?|6 context_after 5?|7 context 5?|8 case_insensitive 8?|9 type 9?|10 head_limit 5?|11 multiline 8?|12 sort 9?|13 sort_ascending 8?|14 tool_call_id 9|15 sandbox_policy #0?|16 offset 5?", SandboxPolicy];
  }
};
var GrepResult = class _GrepResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepResult, a, b);
  }
  static $() {
    return ["GrepResult|1 success #0 result|2 error #1 result", GrepSuccess, GrepError];
  }
};
var GrepError = class _GrepError extends __protoMessage310 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepError, a, b);
  }
  static $() {
    return ["GrepError|1 error 9"];
  }
};
var GrepSuccess = class _GrepSuccess extends __protoMessage310 {
  constructor(data) {
    super();
    this.pattern = "";
    this.path = "";
    this.outputMode = "";
    this.workspaceResults = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepSuccess, a, b);
  }
  static $() {
    return ["GrepSuccess|1 pattern 9|2 path 9|3 output_mode 9|4 workspace_results 9,#0|5 active_editor_result #0?", GrepUnionResult];
  }
};
var GrepUnionResult = class _GrepUnionResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepUnionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepUnionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepUnionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepUnionResult, a, b);
  }
  static $() {
    return ["GrepUnionResult|1 count #0 result|2 files #1 result|3 content #2 result", GrepCountResult, GrepFilesResult, GrepContentResult];
  }
};
var GrepCountResult = class _GrepCountResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.counts = [];
    this.totalFiles = 0;
    this.totalMatches = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepCountResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepCountResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepCountResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepCountResult, a, b);
  }
  static $() {
    return ["GrepCountResult|1 counts #0*|2 total_files 5|3 total_matches 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", GrepFileCount];
  }
};
var GrepFileCount = class _GrepFileCount extends __protoMessage310 {
  constructor(data) {
    super();
    this.file = "";
    this.count = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepFileCount().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepFileCount().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepFileCount().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepFileCount, a, b);
  }
  static $() {
    return ["GrepFileCount|1 file 9|2 count 5"];
  }
};
var GrepFilesResult = class _GrepFilesResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.files = [];
    this.totalFiles = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepFilesResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepFilesResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepFilesResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepFilesResult, a, b);
  }
  static $() {
    return ["GrepFilesResult|1 files 9*|2 total_files 5|3 client_truncated 8|4 ripgrep_truncated 8|5 head_limit_applied 5?|6 offset_applied 5?"];
  }
};
var GrepContentResult = class _GrepContentResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.matches = [];
    this.totalLines = 0;
    this.totalMatchedLines = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepContentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepContentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepContentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepContentResult, a, b);
  }
  static $() {
    return ["GrepContentResult|1 matches #0*|2 total_lines 5|3 total_matched_lines 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", GrepFileMatch];
  }
};
var GrepFileMatch = class _GrepFileMatch extends __protoMessage310 {
  constructor(data) {
    super();
    this.file = "";
    this.matches = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepFileMatch().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepFileMatch().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepFileMatch().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepFileMatch, a, b);
  }
  static $() {
    return ["GrepFileMatch|1 file 9|2 matches #0*", GrepContentMatch];
  }
};
var GrepContentMatch = class _GrepContentMatch extends __protoMessage310 {
  constructor(data) {
    super();
    this.lineNumber = 0;
    this.content = "";
    this.contentTruncated = false;
    this.isContextLine = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepContentMatch().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepContentMatch().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepContentMatch().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepContentMatch, a, b);
  }
  static $() {
    return ["GrepContentMatch|1 line_number 5|2 content 9|3 content_truncated 8|4 is_context_line 8"];
  }
};

// ../packages/proto/dist/generated/agent/v1/grep_tool_pb.js
var __protoPackage11 = "agent.v1.";
var __protoMessage311 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage11;
  }
};
var GrepToolCall = class _GrepToolCall extends __protoMessage311 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepToolCall, a, b);
  }
  static $() {
    return ["GrepToolCall|1 args #0|2 result #1", GrepArgs, GrepResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/cursor_rules_pb.js
var __protoPackage12 = "agent.v1.";
var __protoMessage312 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage12;
  }
};
var CursorRuleSource = /* @__PURE__ */ enumType(proto3, __protoPackage12, "CursorRuleSource", [[0, "UNSPECIFIED"], [1, "TEAM"], [2, "USER"]], 1);
var CursorRuleTypeGlobal = class _CursorRuleTypeGlobal extends __protoMessage312 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeGlobal().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeGlobal().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeGlobal().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeGlobal, a, b);
  }
  static $() {
    return ["CursorRuleTypeGlobal"];
  }
};
var CursorRuleTypeFileGlobs = class _CursorRuleTypeFileGlobs extends __protoMessage312 {
  constructor(data) {
    super();
    this.globs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeFileGlobs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeFileGlobs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeFileGlobs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeFileGlobs, a, b);
  }
  static $() {
    return ["CursorRuleTypeFileGlobs|1 globs 9*"];
  }
};
var CursorRuleTypeAgentFetched = class _CursorRuleTypeAgentFetched extends __protoMessage312 {
  constructor(data) {
    super();
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeAgentFetched().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeAgentFetched().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeAgentFetched().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeAgentFetched, a, b);
  }
  static $() {
    return ["CursorRuleTypeAgentFetched|1 description 9"];
  }
};
var CursorRuleTypeManuallyAttached = class _CursorRuleTypeManuallyAttached extends __protoMessage312 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleTypeManuallyAttached().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleTypeManuallyAttached().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleTypeManuallyAttached().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleTypeManuallyAttached, a, b);
  }
  static $() {
    return ["CursorRuleTypeManuallyAttached"];
  }
};
var CursorRuleType = class _CursorRuleType extends __protoMessage312 {
  constructor(data) {
    super();
    this.type = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRuleType().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRuleType().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRuleType().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRuleType, a, b);
  }
  static $() {
    return ["CursorRuleType|1 global #0 type|2 file_globbed #1 type|3 agent_fetched #2 type|4 manually_attached #3 type", CursorRuleTypeGlobal, CursorRuleTypeFileGlobs, CursorRuleTypeAgentFetched, CursorRuleTypeManuallyAttached];
  }
};
var CursorRule = class _CursorRule extends __protoMessage312 {
  constructor(data) {
    super();
    this.fullPath = "";
    this.content = "";
    this.source = CursorRuleSource.UNSPECIFIED;
    this.environments = [];
    this.disabledEnvironments = [];
    this.scopedTo = [];
    this.frontmatter = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRule().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRule().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRule().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRule, a, b);
  }
  static $() {
    return ["CursorRule|1 full_path 9|2 content 9|3 type #0|4 source #1|5 git_remote_origin 9?|6 parse_error 9?|7 environments 9*|8 disabled_environments 9*|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 scoped_to 9*|14 frontmatter 9|15 is_required 8?", CursorRuleType, CursorRuleSource];
  }
};

// ../packages/proto/dist/generated/agent/v1/read_tool_pb.js
var __protoPackage13 = "agent.v1.";
var __protoMessage313 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage13;
  }
};
var ReadToolCall = class _ReadToolCall extends __protoMessage313 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolCall, a, b);
  }
  static $() {
    return ["ReadToolCall|1 args #0|2 result #1", ReadToolArgs, ReadToolResult];
  }
};
var ReadToolArgs = class _ReadToolArgs extends __protoMessage313 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolArgs, a, b);
  }
  static $() {
    return ["ReadToolArgs|1 path 9|2 offset 5?|3 limit 5?|5 include_line_numbers 8?"];
  }
};
var ReadToolResult = class _ReadToolResult extends __protoMessage313 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolResult, a, b);
  }
  static $() {
    return ["ReadToolResult|1 success #0 result|2 error #1 result", ReadToolSuccess, ReadToolError];
  }
};
var ReadRange = class _ReadRange extends __protoMessage313 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadRange, a, b);
  }
  static $() {
    return ["ReadRange|1 start_line 13|2 end_line 13"];
  }
};
var ReadToolSuccess = class _ReadToolSuccess extends __protoMessage313 {
  constructor(data) {
    super();
    this.output = { case: void 0 };
    this.isEmpty = false;
    this.exceededLimit = false;
    this.totalLines = 0;
    this.fileSize = 0;
    this.path = "";
    this.relatedCursorRulePaths = [];
    this.relatedCursorRules = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolSuccess, a, b);
  }
  static $() {
    return ["ReadToolSuccess|1 content 9 output|6 data 12 output|9 data_blob_id 12 output|10 content_blob_id 12 output|2 is_empty 8|3 exceeded_limit 8|4 total_lines 13|5 file_size 13|7 path 9|8 read_range #0?|11 include_line_numbers 8?|12 related_cursor_rule_paths 9*|13 related_cursor_rules #1*", ReadRange, CursorRule];
  }
};
var ReadToolError = class _ReadToolError extends __protoMessage313 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolError, a, b);
  }
  static $() {
    return ["ReadToolError|1 error_message 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/todo_tool_pb.js
var __protoPackage14 = "agent.v1.";
var __protoMessage314 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage14;
  }
};
var TodoStatus = /* @__PURE__ */ enumType(proto3, __protoPackage14, "TodoStatus", [[0, "UNSPECIFIED"], [1, "PENDING"], [2, "IN_PROGRESS"], [3, "COMPLETED"], [4, "CANCELLED"]], 1);
var TodoItem = class _TodoItem extends __protoMessage314 {
  constructor(data) {
    super();
    this.id = "";
    this.content = "";
    this.status = TodoStatus.UNSPECIFIED;
    this.createdAt = protoInt64.zero;
    this.updatedAt = protoInt64.zero;
    this.dependencies = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TodoItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TodoItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TodoItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TodoItem, a, b);
  }
  static $() {
    return ["TodoItem|1 id 9|2 content 9|3 status #0|4 created_at 3|5 updated_at 3|6 dependencies 9*", TodoStatus];
  }
};
var UpdateTodosToolCall = class _UpdateTodosToolCall extends __protoMessage314 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosToolCall, a, b);
  }
  static $() {
    return ["UpdateTodosToolCall|1 args #0|2 result #1", UpdateTodosArgs, UpdateTodosResult];
  }
};
var UpdateTodosArgs = class _UpdateTodosArgs extends __protoMessage314 {
  constructor(data) {
    super();
    this.todos = [];
    this.merge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosArgs, a, b);
  }
  static $() {
    return ["UpdateTodosArgs|1 todos #0*|2 merge 8", TodoItem];
  }
};
var UpdateTodosResult = class _UpdateTodosResult extends __protoMessage314 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosResult, a, b);
  }
  static $() {
    return ["UpdateTodosResult|1 success #0 result|2 error #1 result", UpdateTodosSuccess, UpdateTodosError];
  }
};
var UpdateTodosSuccess = class _UpdateTodosSuccess extends __protoMessage314 {
  constructor(data) {
    super();
    this.todos = [];
    this.totalCount = 0;
    this.wasMerge = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosSuccess, a, b);
  }
  static $() {
    return ["UpdateTodosSuccess|1 todos #0*|2 total_count 5|3 was_merge 8", TodoItem];
  }
};
var UpdateTodosError = class _UpdateTodosError extends __protoMessage314 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateTodosError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateTodosError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateTodosError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateTodosError, a, b);
  }
  static $() {
    return ["UpdateTodosError|1 error 9"];
  }
};
var ReadTodosToolCall = class _ReadTodosToolCall extends __protoMessage314 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosToolCall, a, b);
  }
  static $() {
    return ["ReadTodosToolCall|1 args #0|2 result #1", ReadTodosArgs, ReadTodosResult];
  }
};
var ReadTodosArgs = class _ReadTodosArgs extends __protoMessage314 {
  constructor(data) {
    super();
    this.statusFilter = [];
    this.idFilter = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosArgs, a, b);
  }
  static $() {
    return ["ReadTodosArgs|1 status_filter #0*|2 id_filter 9*", TodoStatus];
  }
};
var ReadTodosResult = class _ReadTodosResult extends __protoMessage314 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosResult, a, b);
  }
  static $() {
    return ["ReadTodosResult|1 success #0 result|2 error #1 result", ReadTodosSuccess, ReadTodosError];
  }
};
var ReadTodosSuccess = class _ReadTodosSuccess extends __protoMessage314 {
  constructor(data) {
    super();
    this.todos = [];
    this.totalCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosSuccess, a, b);
  }
  static $() {
    return ["ReadTodosSuccess|1 todos #0*|2 total_count 5", TodoItem];
  }
};
var ReadTodosError = class _ReadTodosError extends __protoMessage314 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadTodosError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadTodosError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadTodosError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadTodosError, a, b);
  }
  static $() {
    return ["ReadTodosError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/edit_tool_pb.js
var __protoPackage15 = "agent.v1.";
var __protoMessage315 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage15;
  }
};
var EditArgs = class _EditArgs extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditArgs, a, b);
  }
  static $() {
    return ["EditArgs|1 path 9|6 stream_content 9?"];
  }
};
var EditResult = class _EditResult extends __protoMessage315 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditResult, a, b);
  }
  static $() {
    return ["EditResult|1 success #0 result|2 file_not_found #1 result|3 read_permission_denied #2 result|4 write_permission_denied #3 result|6 rejected #4 result|7 error #5 result", EditSuccess, EditFileNotFound, EditReadPermissionDenied, EditWritePermissionDenied, EditRejected, EditError];
  }
};
var EditSuccess = class _EditSuccess extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.afterFullFileContent = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditSuccess, a, b);
  }
  static $() {
    return ["EditSuccess|1 path 9|3 lines_added 5?|4 lines_removed 5?|5 diff_string 9?|6 before_full_file_content 9?|7 after_full_file_content 9|8 message 9?"];
  }
};
var EditFileNotFound = class _EditFileNotFound extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditFileNotFound().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditFileNotFound().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditFileNotFound().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditFileNotFound, a, b);
  }
  static $() {
    return ["EditFileNotFound|1 path 9"];
  }
};
var EditReadPermissionDenied = class _EditReadPermissionDenied extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditReadPermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditReadPermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditReadPermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditReadPermissionDenied, a, b);
  }
  static $() {
    return ["EditReadPermissionDenied|1 path 9"];
  }
};
var EditWritePermissionDenied = class _EditWritePermissionDenied extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditWritePermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditWritePermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditWritePermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditWritePermissionDenied, a, b);
  }
  static $() {
    return ["EditWritePermissionDenied|1 path 9|2 error 9|3 is_readonly 8"];
  }
};
var EditRejected = class _EditRejected extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditRejected, a, b);
  }
  static $() {
    return ["EditRejected|1 path 9|2 reason 9"];
  }
};
var EditError = class _EditError extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditError, a, b);
  }
  static $() {
    return ["EditError|1 path 9|2 error 9|5 model_visible_error 9?"];
  }
};
var EditToolCall = class _EditToolCall extends __protoMessage315 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditToolCall, a, b);
  }
  static $() {
    return ["EditToolCall|1 args #0|2 result #1", EditArgs, EditResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/ls_exec_pb.js
var __protoPackage16 = "agent.v1.";
var __protoMessage316 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage16;
  }
};
var LsArgs = class _LsArgs extends __protoMessage316 {
  constructor(data) {
    super();
    this.path = "";
    this.ignore = [];
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsArgs, a, b);
  }
  static $() {
    return ["LsArgs|1 path 9|2 ignore 9*|3 tool_call_id 9|4 sandbox_policy #0?|5 timeout_ms 13?", SandboxPolicy];
  }
};
var LsResult = class _LsResult extends __protoMessage316 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsResult, a, b);
  }
  static $() {
    return ["LsResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 timeout #3 result", LsSuccess, LsError, LsRejected, LsTimeout];
  }
};
var LsSuccess = class _LsSuccess extends __protoMessage316 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsSuccess, a, b);
  }
  static $() {
    return ["LsSuccess|1 directory_tree_root #0", LsDirectoryTreeNode];
  }
};
var LsDirectoryTreeNode = class _LsDirectoryTreeNode extends __protoMessage316 {
  constructor(data) {
    super();
    this.absPath = "";
    this.childrenDirs = [];
    this.childrenFiles = [];
    this.childrenWereProcessed = false;
    this.fullSubtreeExtensionCounts = {};
    this.numFiles = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsDirectoryTreeNode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsDirectoryTreeNode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsDirectoryTreeNode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsDirectoryTreeNode, a, b);
  }
  static $() {
    return ["LsDirectoryTreeNode|1 abs_path 9|2 children_dirs #0*|3 children_files #1*|4 children_were_processed 8|5 full_subtree_extension_counts 9,5|6 num_files 5", _LsDirectoryTreeNode, LsDirectoryTreeNode_File];
  }
};
var LsDirectoryTreeNode_File = class _LsDirectoryTreeNode_File extends __protoMessage316 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsDirectoryTreeNode_File().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsDirectoryTreeNode_File().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsDirectoryTreeNode_File().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsDirectoryTreeNode_File, a, b);
  }
  static $() {
    return ["LsDirectoryTreeNode.File|1 name 9|2 terminal_metadata #0?", TerminalMetadata];
  }
};
var LsError = class _LsError extends __protoMessage316 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsError, a, b);
  }
  static $() {
    return ["LsError|1 path 9|2 error 9"];
  }
};
var LsRejected = class _LsRejected extends __protoMessage316 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsRejected, a, b);
  }
  static $() {
    return ["LsRejected|1 path 9|2 reason 9"];
  }
};
var LsTimeout = class _LsTimeout extends __protoMessage316 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsTimeout().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsTimeout().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsTimeout().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsTimeout, a, b);
  }
  static $() {
    return ["LsTimeout|1 directory_tree_root #0", LsDirectoryTreeNode];
  }
};
var TerminalMetadata = class _TerminalMetadata extends __protoMessage316 {
  constructor(data) {
    super();
    this.lastCommands = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TerminalMetadata().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TerminalMetadata().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TerminalMetadata().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TerminalMetadata, a, b);
  }
  static $() {
    return ["TerminalMetadata|1 cwd 9?|2 last_commands #0*|3 last_modified_ms 3?|4 current_command #0?", TerminalMetadata_Command];
  }
};
var TerminalMetadata_Command = class _TerminalMetadata_Command extends __protoMessage316 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TerminalMetadata_Command().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TerminalMetadata_Command().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TerminalMetadata_Command().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TerminalMetadata_Command, a, b);
  }
  static $() {
    return ["TerminalMetadata.Command|1 command 9|2 exit_code 5?|3 timestamp_ms 3?|4 duration_ms 3?"];
  }
};

// ../packages/proto/dist/generated/agent/v1/ls_tool_pb.js
var __protoPackage17 = "agent.v1.";
var __protoMessage317 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage17;
  }
};
var LsToolCall = class _LsToolCall extends __protoMessage317 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsToolCall, a, b);
  }
  static $() {
    return ["LsToolCall|1 args #0|2 result #1", LsArgs, LsResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/diagnostics_exec_pb.js
var __protoPackage18 = "agent.v1.";
var DiagnosticSeverity = /* @__PURE__ */ enumType(proto3, __protoPackage18, "DiagnosticSeverity", [[0, "UNSPECIFIED"], [1, "ERROR"], [2, "WARNING"], [3, "INFORMATION"], [4, "HINT"]], 1);

// ../packages/proto/dist/generated/agent/v1/read_lints_tool_pb.js
var __protoPackage19 = "agent.v1.";
var __protoMessage318 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage19;
  }
};
var ReadLintsToolCall = class _ReadLintsToolCall extends __protoMessage318 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolCall, a, b);
  }
  static $() {
    return ["ReadLintsToolCall|1 args #0|2 result #1", ReadLintsToolArgs, ReadLintsToolResult];
  }
};
var ReadLintsToolArgs = class _ReadLintsToolArgs extends __protoMessage318 {
  constructor(data) {
    super();
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolArgs, a, b);
  }
  static $() {
    return ["ReadLintsToolArgs|1 paths 9*"];
  }
};
var ReadLintsToolResult = class _ReadLintsToolResult extends __protoMessage318 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolResult, a, b);
  }
  static $() {
    return ["ReadLintsToolResult|1 success #0 result|2 error #1 result", ReadLintsToolSuccess, ReadLintsToolError];
  }
};
var ReadLintsToolSuccess = class _ReadLintsToolSuccess extends __protoMessage318 {
  constructor(data) {
    super();
    this.fileDiagnostics = [];
    this.totalFiles = 0;
    this.totalDiagnostics = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolSuccess, a, b);
  }
  static $() {
    return ["ReadLintsToolSuccess|1 file_diagnostics #0*|2 total_files 5|3 total_diagnostics 5", FileDiagnostics];
  }
};
var FileDiagnostics = class _FileDiagnostics extends __protoMessage318 {
  constructor(data) {
    super();
    this.path = "";
    this.diagnostics = [];
    this.diagnosticsCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileDiagnostics().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileDiagnostics().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileDiagnostics().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileDiagnostics, a, b);
  }
  static $() {
    return ["FileDiagnostics|1 path 9|2 diagnostics #0*|3 diagnostics_count 5", DiagnosticItem];
  }
};
var DiagnosticItem = class _DiagnosticItem extends __protoMessage318 {
  constructor(data) {
    super();
    this.severity = DiagnosticSeverity.UNSPECIFIED;
    this.message = "";
    this.source = "";
    this.code = "";
    this.isStale = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DiagnosticItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DiagnosticItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DiagnosticItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DiagnosticItem, a, b);
  }
  static $() {
    return ["DiagnosticItem|1 severity #0|2 range #1|3 message 9|4 source 9|5 code 9|6 is_stale 8", DiagnosticSeverity, DiagnosticRange];
  }
};
var DiagnosticRange = class _DiagnosticRange extends __protoMessage318 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DiagnosticRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DiagnosticRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DiagnosticRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DiagnosticRange, a, b);
  }
  static $() {
    return ["DiagnosticRange|1 start #0|2 end #0", Position];
  }
};
var ReadLintsToolError = class _ReadLintsToolError extends __protoMessage318 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolError, a, b);
  }
  static $() {
    return ["ReadLintsToolError|1 error_message 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/mcp_pb.js
var __protoPackage20 = "agent.v1.";
var __protoMessage319 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage20;
  }
};
var McpToolDefinition = class _McpToolDefinition extends __protoMessage319 {
  constructor(data) {
    super();
    this.name = "";
    this.providerIdentifier = "";
    this.toolName = "";
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolDefinition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolDefinition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolDefinition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolDefinition, a, b);
  }
  static $() {
    return ["McpToolDefinition|1 name 9|4 provider_identifier 9|5 tool_name 9|2 description 9|3 input_schema #0|6 input_schema_json 9?|7 output_schema_json 9?|8 annotations_json 9?", Value];
  }
};
var McpInstructions = class _McpInstructions extends __protoMessage319 {
  constructor(data) {
    super();
    this.serverName = "";
    this.instructions = "";
    this.serverIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpInstructions().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpInstructions().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpInstructions().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpInstructions, a, b);
  }
  static $() {
    return ["McpInstructions|1 server_name 9|2 instructions 9|3 server_identifier 9"];
  }
};
var McpDescriptor = class _McpDescriptor extends __protoMessage319 {
  constructor(data) {
    super();
    this.serverName = "";
    this.serverIdentifier = "";
    this.tools = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpDescriptor().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpDescriptor().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpDescriptor().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpDescriptor, a, b);
  }
  static $() {
    return ["McpDescriptor|1 server_name 9|2 server_identifier 9|3 folder_path 9?|4 server_use_instructions 9?|5 tools #0*|7 plugin 9?|8 marketplace 9?|9 plugin_db_id 9?|10 marketplace_id 9?", McpToolDescriptor];
  }
};
var McpToolDescriptor = class _McpToolDescriptor extends __protoMessage319 {
  constructor(data) {
    super();
    this.toolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolDescriptor().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolDescriptor().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolDescriptor().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolDescriptor, a, b);
  }
  static $() {
    return ["McpToolDescriptor|1 tool_name 9|2 definition_path 9?|3 description 9?|4 input_schema #0?|5 input_schema_json 9?|6 annotations_json 9?", Value];
  }
};
var McpFileSystemOptions = class _McpFileSystemOptions extends __protoMessage319 {
  constructor(data) {
    super();
    this.enabled = false;
    this.workspaceProjectDir = "";
    this.mcpDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpFileSystemOptions().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpFileSystemOptions().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpFileSystemOptions().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpFileSystemOptions, a, b);
  }
  static $() {
    return ["McpFileSystemOptions|1 enabled 8|2 workspace_project_dir 9|3 mcp_descriptors #0*", McpDescriptor];
  }
};
var McpMetaToolOptions = class _McpMetaToolOptions extends __protoMessage319 {
  constructor(data) {
    super();
    this.enabled = false;
    this.mcpDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpMetaToolOptions().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpMetaToolOptions().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpMetaToolOptions().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpMetaToolOptions, a, b);
  }
  static $() {
    return ["McpMetaToolOptions|1 enabled 8|2 mcp_descriptors #0*", McpDescriptor];
  }
};

// ../packages/proto/dist/generated/agent/v1/mcp_exec_pb.js
var __protoPackage21 = "agent.v1.";
var __protoMessage320 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage21;
  }
};
var McpArgs = class _McpArgs extends __protoMessage320 {
  constructor(data) {
    super();
    this.name = "";
    this.args = {};
    this.toolCallId = "";
    this.providerIdentifier = "";
    this.toolName = "";
    this.smartModeApprovalOnly = false;
    this.skipApproval = false;
    this.serverIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpArgs, a, b);
  }
  static $() {
    return ["McpArgs|1 name 9|2 args 9,#0|3 tool_call_id 9|4 provider_identifier 9|5 tool_name 9|6 smart_mode_approval #1?|7 smart_mode_approval_only 8|8 skip_approval 8|9 server_identifier 9", Value, SmartModeApproval];
  }
};
var McpTextContent = class _McpTextContent extends __protoMessage320 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpTextContent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpTextContent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpTextContent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpTextContent, a, b);
  }
  static $() {
    return ["McpTextContent|1 text 9|2 output_location #0?", OutputLocation];
  }
};
var McpImageContent = class _McpImageContent extends __protoMessage320 {
  constructor(data) {
    super();
    this.data = new Uint8Array(0);
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpImageContent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpImageContent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpImageContent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpImageContent, a, b);
  }
  static $() {
    return ["McpImageContent|1 data 12|2 mime_type 9"];
  }
};
var McpToolResultContentItem = class _McpToolResultContentItem extends __protoMessage320 {
  constructor(data) {
    super();
    this.content = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolResultContentItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolResultContentItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolResultContentItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolResultContentItem, a, b);
  }
  static $() {
    return ["McpToolResultContentItem|1 text #0 content|2 image #1 content", McpTextContent, McpImageContent];
  }
};
var McpSuccess = class _McpSuccess extends __protoMessage320 {
  constructor(data) {
    super();
    this.content = [];
    this.isError = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpSuccess, a, b);
  }
  static $() {
    return ["McpSuccess|1 content #0*|2 is_error 8|3 structured_content #1", McpToolResultContentItem, Struct];
  }
};
var McpRejected = class _McpRejected extends __protoMessage320 {
  constructor(data) {
    super();
    this.reason = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpRejected, a, b);
  }
  static $() {
    return ["McpRejected|1 reason 9|2 is_readonly 8"];
  }
};
var McpPermissionDenied = class _McpPermissionDenied extends __protoMessage320 {
  constructor(data) {
    super();
    this.error = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpPermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpPermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpPermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpPermissionDenied, a, b);
  }
  static $() {
    return ["McpPermissionDenied|1 error 9|2 is_readonly 8"];
  }
};
var ListMcpResourcesExecArgs = class _ListMcpResourcesExecArgs extends __protoMessage320 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesExecArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesExecArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesExecArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesExecArgs, a, b);
  }
  static $() {
    return ["ListMcpResourcesExecArgs|1 server 9?"];
  }
};
var ListMcpResourcesExecResult = class _ListMcpResourcesExecResult extends __protoMessage320 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesExecResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesExecResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesExecResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesExecResult, a, b);
  }
  static $() {
    return ["ListMcpResourcesExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", ListMcpResourcesSuccess, ListMcpResourcesError, ListMcpResourcesRejected];
  }
};
var ListMcpResourcesExecResult_McpResource = class _ListMcpResourcesExecResult_McpResource extends __protoMessage320 {
  constructor(data) {
    super();
    this.uri = "";
    this.server = "";
    this.annotations = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesExecResult_McpResource().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesExecResult_McpResource().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesExecResult_McpResource().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesExecResult_McpResource, a, b);
  }
  static $() {
    return ["ListMcpResourcesExecResult.McpResource|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 server 9|6 annotations 9,9"];
  }
};
var ListMcpResourcesSuccess = class _ListMcpResourcesSuccess extends __protoMessage320 {
  constructor(data) {
    super();
    this.resources = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesSuccess, a, b);
  }
  static $() {
    return ["ListMcpResourcesSuccess|1 resources #0*", ListMcpResourcesExecResult_McpResource];
  }
};
var ListMcpResourcesError = class _ListMcpResourcesError extends __protoMessage320 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesError, a, b);
  }
  static $() {
    return ["ListMcpResourcesError|1 error 9"];
  }
};
var ListMcpResourcesRejected = class _ListMcpResourcesRejected extends __protoMessage320 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesRejected, a, b);
  }
  static $() {
    return ["ListMcpResourcesRejected|1 reason 9"];
  }
};
var ReadMcpResourceExecArgs = class _ReadMcpResourceExecArgs extends __protoMessage320 {
  constructor(data) {
    super();
    this.server = "";
    this.uri = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceExecArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceExecArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceExecArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceExecArgs, a, b);
  }
  static $() {
    return ["ReadMcpResourceExecArgs|1 server 9|2 uri 9|3 download_path 9?|4 tool_call_id 9|5 smart_mode_approval #0?", SmartModeApproval];
  }
};
var ReadMcpResourceExecResult = class _ReadMcpResourceExecResult extends __protoMessage320 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceExecResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceExecResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceExecResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceExecResult, a, b);
  }
  static $() {
    return ["ReadMcpResourceExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 not_found #3 result", ReadMcpResourceSuccess, ReadMcpResourceError, ReadMcpResourceRejected, ReadMcpResourceNotFound];
  }
};
var ReadMcpResourceSuccess = class _ReadMcpResourceSuccess extends __protoMessage320 {
  constructor(data) {
    super();
    this.uri = "";
    this.content = { case: void 0 };
    this.annotations = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceSuccess, a, b);
  }
  static $() {
    return ["ReadMcpResourceSuccess|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 text 9 content|6 blob 12 content|7 annotations 9,9|8 download_path 9?|9 output_location #0?", OutputLocation];
  }
};
var ReadMcpResourceError = class _ReadMcpResourceError extends __protoMessage320 {
  constructor(data) {
    super();
    this.uri = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceError, a, b);
  }
  static $() {
    return ["ReadMcpResourceError|1 uri 9|2 error 9"];
  }
};
var ReadMcpResourceRejected = class _ReadMcpResourceRejected extends __protoMessage320 {
  constructor(data) {
    super();
    this.uri = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceRejected, a, b);
  }
  static $() {
    return ["ReadMcpResourceRejected|1 uri 9|2 reason 9"];
  }
};
var ReadMcpResourceNotFound = class _ReadMcpResourceNotFound extends __protoMessage320 {
  constructor(data) {
    super();
    this.uri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceNotFound().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceNotFound().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceNotFound().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceNotFound, a, b);
  }
  static $() {
    return ["ReadMcpResourceNotFound|1 uri 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/mcp_tool_pb.js
var __protoPackage22 = "agent.v1.";
var __protoMessage321 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage22;
  }
};
var McpToolError = class _McpToolError extends __protoMessage321 {
  constructor(data) {
    super();
    this.error = "";
    this.readToolDefReminder = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolError, a, b);
  }
  static $() {
    return ["McpToolError|1 error 9|2 read_tool_def_reminder 9"];
  }
};
var McpToolResult = class _McpToolResult extends __protoMessage321 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolResult, a, b);
  }
  static $() {
    return ["McpToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 permission_denied #3 result", McpSuccess, McpToolError, McpRejected, McpPermissionDenied];
  }
};
var McpToolCall = class _McpToolCall extends __protoMessage321 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolCall, a, b);
  }
  static $() {
    return ["McpToolCall|1 args #0|2 result #1|3 description 9?", McpArgs, McpToolResult];
  }
};

// ../packages/proto/dist/generated/aiserver/v1/utils_pb.js
var __protoPackage23 = "aiserver.v1.";
var __protoMessage322 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage23;
  }
};
var CursorPosition = class _CursorPosition extends __protoMessage322 {
  constructor(data) {
    super();
    this.line = 0;
    this.column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorPosition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorPosition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorPosition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorPosition, a, b);
  }
  static $() {
    return ["CursorPosition|1 line 5|2 column 5"];
  }
};
var CursorRange = class _CursorRange extends __protoMessage322 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorRange, a, b);
  }
  static $() {
    return ["CursorRange|1 start_position #0|2 end_position #0", CursorPosition];
  }
};
var DetailedLine = class _DetailedLine extends __protoMessage322 {
  constructor(data) {
    super();
    this.text = "";
    this.lineNumber = 0;
    this.isSignature = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DetailedLine().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DetailedLine().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DetailedLine().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DetailedLine, a, b);
  }
  static $() {
    return ["DetailedLine|1 text 9|2 line_number 2|3 is_signature 8"];
  }
};
var CodeBlock = class _CodeBlock extends __protoMessage322 {
  constructor(data) {
    super();
    this.relativeWorkspacePath = "";
    this.contents = "";
    this.detailedLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CodeBlock().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CodeBlock().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CodeBlock().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CodeBlock, a, b);
  }
  static $() {
    return ["CodeBlock|1 relative_workspace_path 9|2 file_contents 9?|9 file_contents_length 5?|3 range #0|4 contents 9|5 signatures #1|6 override_contents 9?|7 original_contents 9?|8 detailed_lines #2*|10 file_git_context #3", CursorRange, CodeBlock_Signatures, DetailedLine, FileGit];
  }
};
var CodeBlock_Signatures = class _CodeBlock_Signatures extends __protoMessage322 {
  constructor(data) {
    super();
    this.ranges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CodeBlock_Signatures().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CodeBlock_Signatures().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CodeBlock_Signatures().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CodeBlock_Signatures, a, b);
  }
  static $() {
    return ["CodeBlock.Signatures|1 ranges #0*", CursorRange];
  }
};
var GitCommit = class _GitCommit extends __protoMessage322 {
  constructor(data) {
    super();
    this.commit = "";
    this.author = "";
    this.date = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GitCommit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GitCommit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GitCommit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GitCommit, a, b);
  }
  static $() {
    return ["GitCommit|1 commit 9|2 author 9|3 date 9|4 message 9"];
  }
};
var FileGit = class _FileGit extends __protoMessage322 {
  constructor(data) {
    super();
    this.commits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileGit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileGit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileGit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileGit, a, b);
  }
  static $() {
    return ["FileGit|1 commits #0*", GitCommit];
  }
};

// ../packages/proto/dist/generated/aiserver/v1/repository_pb.js
var __protoPackage24 = "aiserver.v1.";
var __protoMessage323 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage24;
  }
};
var CodeResult = class _CodeResult extends __protoMessage323 {
  constructor(data) {
    super();
    this.score = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CodeResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CodeResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CodeResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CodeResult, a, b);
  }
  static $() {
    return ["CodeResult|1 code_block #0|2 score 2", CodeBlock];
  }
};

// ../packages/proto/dist/generated/agent/v1/semsearch_tool_pb.js
var __protoPackage25 = "agent.v1.";
var __protoMessage324 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage25;
  }
};
var SemSearchToolCall = class _SemSearchToolCall extends __protoMessage324 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolCall, a, b);
  }
  static $() {
    return ["SemSearchToolCall|1 args #0|2 result #1", SemSearchToolArgs, SemSearchToolResult];
  }
};
var SemSearchToolArgs = class _SemSearchToolArgs extends __protoMessage324 {
  constructor(data) {
    super();
    this.query = "";
    this.targetDirectories = [];
    this.explanation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolArgs, a, b);
  }
  static $() {
    return ["SemSearchToolArgs|1 query 9|2 target_directories 9*|3 explanation 9"];
  }
};
var SemSearchToolResult = class _SemSearchToolResult extends __protoMessage324 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolResult, a, b);
  }
  static $() {
    return ["SemSearchToolResult|1 success #0 result|2 error #1 result", SemSearchToolSuccess, SemSearchToolError];
  }
};
var SemSearchToolSuccess = class _SemSearchToolSuccess extends __protoMessage324 {
  constructor(data) {
    super();
    this.results = "";
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolSuccess, a, b);
  }
  static $() {
    return ["SemSearchToolSuccess|1 results 9|2 code_results #0*", CodeResult];
  }
};
var SemSearchToolError = class _SemSearchToolError extends __protoMessage324 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolError, a, b);
  }
  static $() {
    return ["SemSearchToolError|1 error_message 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/create_plan_tool_pb.js
var __protoPackage26 = "agent.v1.";
var __protoMessage325 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage26;
  }
};
var CreatePlanToolCall = class _CreatePlanToolCall extends __protoMessage325 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanToolCall, a, b);
  }
  static $() {
    return ["CreatePlanToolCall|1 args #0|2 result #1", CreatePlanArgs, CreatePlanResult];
  }
};
var Phase = class _Phase extends __protoMessage325 {
  constructor(data) {
    super();
    this.name = "";
    this.todos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Phase().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Phase().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Phase().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Phase, a, b);
  }
  static $() {
    return ["Phase|1 name 9|2 todos #0*", TodoItem];
  }
};
var CreatePlanArgs = class _CreatePlanArgs extends __protoMessage325 {
  constructor(data) {
    super();
    this.plan = "";
    this.todos = [];
    this.overview = "";
    this.name = "";
    this.isProject = false;
    this.phases = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanArgs, a, b);
  }
  static $() {
    return ["CreatePlanArgs|1 plan 9|2 todos #0*|3 overview 9|4 name 9|5 is_project 8|6 phases #1*", TodoItem, Phase];
  }
};
var CreatePlanResult = class _CreatePlanResult extends __protoMessage325 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    this.planUri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanResult, a, b);
  }
  static $() {
    return ["CreatePlanResult|1 success #0 result|2 error #1 result|3 plan_uri 9", CreatePlanSuccess, CreatePlanError];
  }
};
var CreatePlanSuccess = class _CreatePlanSuccess extends __protoMessage325 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanSuccess, a, b);
  }
  static $() {
    return ["CreatePlanSuccess"];
  }
};
var CreatePlanError = class _CreatePlanError extends __protoMessage325 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanError, a, b);
  }
  static $() {
    return ["CreatePlanError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/web_search_tool_pb.js
var __protoPackage27 = "agent.v1.";
var __protoMessage326 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage27;
  }
};
var WebSearchArgs = class _WebSearchArgs extends __protoMessage326 {
  constructor(data) {
    super();
    this.searchTerm = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchArgs, a, b);
  }
  static $() {
    return ["WebSearchArgs|1 search_term 9|2 tool_call_id 9"];
  }
};
var WebSearchResult = class _WebSearchResult extends __protoMessage326 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchResult, a, b);
  }
  static $() {
    return ["WebSearchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebSearchSuccess, WebSearchError, WebSearchRejected];
  }
};
var WebSearchSuccess = class _WebSearchSuccess extends __protoMessage326 {
  constructor(data) {
    super();
    this.references = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchSuccess, a, b);
  }
  static $() {
    return ["WebSearchSuccess|1 references #0*", WebSearchReference];
  }
};
var WebSearchError = class _WebSearchError extends __protoMessage326 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchError, a, b);
  }
  static $() {
    return ["WebSearchError|1 error 9"];
  }
};
var WebSearchRejected = class _WebSearchRejected extends __protoMessage326 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchRejected, a, b);
  }
  static $() {
    return ["WebSearchRejected|1 reason 9"];
  }
};
var WebSearchReference = class _WebSearchReference extends __protoMessage326 {
  constructor(data) {
    super();
    this.title = "";
    this.url = "";
    this.chunk = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchReference().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchReference().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchReference().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchReference, a, b);
  }
  static $() {
    return ["WebSearchReference|1 title 9|2 url 9|3 chunk 9"];
  }
};
var WebSearchToolCall = class _WebSearchToolCall extends __protoMessage326 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebSearchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebSearchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebSearchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebSearchToolCall, a, b);
  }
  static $() {
    return ["WebSearchToolCall|1 args #0|2 result #1", WebSearchArgs, WebSearchResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/mcp_resource_tool_pb.js
var __protoPackage28 = "agent.v1.";
var __protoMessage327 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage28;
  }
};
var ListMcpResourcesToolCall = class _ListMcpResourcesToolCall extends __protoMessage327 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesToolCall, a, b);
  }
  static $() {
    return ["ListMcpResourcesToolCall|1 args #0|2 result #1", ListMcpResourcesExecArgs, ListMcpResourcesExecResult];
  }
};
var ReadMcpResourceToolCall = class _ReadMcpResourceToolCall extends __protoMessage327 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceToolCall, a, b);
  }
  static $() {
    return ["ReadMcpResourceToolCall|1 args #0|2 result #1", ReadMcpResourceExecArgs, ReadMcpResourceExecResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/apply_agent_diff_tool_pb.js
var __protoPackage29 = "agent.v1.";
var __protoMessage328 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage29;
  }
};
var ApplyAgentDiffToolCall = class _ApplyAgentDiffToolCall extends __protoMessage328 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffToolCall, a, b);
  }
  static $() {
    return ["ApplyAgentDiffToolCall|1 args #0|2 result #1", ApplyAgentDiffArgs, ApplyAgentDiffResult];
  }
};
var ApplyAgentDiffArgs = class _ApplyAgentDiffArgs extends __protoMessage328 {
  constructor(data) {
    super();
    this.agentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffArgs, a, b);
  }
  static $() {
    return ["ApplyAgentDiffArgs|1 agent_id 9"];
  }
};
var ApplyAgentDiffResult = class _ApplyAgentDiffResult extends __protoMessage328 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffResult, a, b);
  }
  static $() {
    return ["ApplyAgentDiffResult|1 success #0 result|2 error #1 result", ApplyAgentDiffSuccess, ApplyAgentDiffError];
  }
};
var ApplyAgentDiffSuccess = class _ApplyAgentDiffSuccess extends __protoMessage328 {
  constructor(data) {
    super();
    this.appliedChanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffSuccess, a, b);
  }
  static $() {
    return ["ApplyAgentDiffSuccess|1 applied_changes #0*", AppliedAgentChange];
  }
};
var AppliedAgentChange = class _AppliedAgentChange extends __protoMessage328 {
  constructor(data) {
    super();
    this.path = "";
    this.changeType = AppliedAgentChange_ChangeType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AppliedAgentChange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AppliedAgentChange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AppliedAgentChange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AppliedAgentChange, a, b);
  }
  static $() {
    return ["AppliedAgentChange|1 path 9|2 change_type #0|3 before_content 9?|4 after_content 9?|5 error 9?|6 message_for_model 9?", AppliedAgentChange_ChangeType];
  }
};
var AppliedAgentChange_ChangeType = /* @__PURE__ */ enumType(proto3, __protoPackage29, "AppliedAgentChange.ChangeType", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "MODIFIED"], [3, "DELETED"]], 1);
var ApplyAgentDiffError = class _ApplyAgentDiffError extends __protoMessage328 {
  constructor(data) {
    super();
    this.error = "";
    this.appliedChanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffError, a, b);
  }
  static $() {
    return ["ApplyAgentDiffError|1 error 9|2 applied_changes #0*", AppliedAgentChange];
  }
};

// ../packages/proto/dist/generated/agent/v1/ask_question_tool_pb.js
var __protoPackage30 = "agent.v1.";
var __protoMessage329 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage30;
  }
};
var AskQuestionToolCall = class _AskQuestionToolCall extends __protoMessage329 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionToolCall, a, b);
  }
  static $() {
    return ["AskQuestionToolCall|1 args #0|2 result #1", AskQuestionArgs, AskQuestionResult];
  }
};
var AskQuestionArgs = class _AskQuestionArgs extends __protoMessage329 {
  constructor(data) {
    super();
    this.title = "";
    this.questions = [];
    this.runAsync = false;
    this.asyncOriginalToolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionArgs, a, b);
  }
  static $() {
    return ["AskQuestionArgs|1 title 9|2 questions #0*|5 run_async 8|6 async_original_tool_call_id 9", AskQuestionArgs_Question];
  }
};
var AskQuestionArgs_Question = class _AskQuestionArgs_Question extends __protoMessage329 {
  constructor(data) {
    super();
    this.id = "";
    this.prompt = "";
    this.options = [];
    this.allowMultiple = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionArgs_Question().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionArgs_Question().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionArgs_Question().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionArgs_Question, a, b);
  }
  static $() {
    return ["AskQuestionArgs.Question|1 id 9|2 prompt 9|3 options #0*|4 allow_multiple 8", AskQuestionArgs_Option];
  }
};
var AskQuestionArgs_Option = class _AskQuestionArgs_Option extends __protoMessage329 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionArgs_Option().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionArgs_Option().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionArgs_Option().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionArgs_Option, a, b);
  }
  static $() {
    return ["AskQuestionArgs.Option|1 id 9|2 label 9"];
  }
};
var AskQuestionAsync = class _AskQuestionAsync extends __protoMessage329 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionAsync().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionAsync().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionAsync().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionAsync, a, b);
  }
  static $() {
    return ["AskQuestionAsync"];
  }
};
var AskQuestionResult = class _AskQuestionResult extends __protoMessage329 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionResult, a, b);
  }
  static $() {
    return ["AskQuestionResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 async #3 result", AskQuestionSuccess, AskQuestionError, AskQuestionRejected, AskQuestionAsync];
  }
};
var AskQuestionSuccess = class _AskQuestionSuccess extends __protoMessage329 {
  constructor(data) {
    super();
    this.answers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionSuccess, a, b);
  }
  static $() {
    return ["AskQuestionSuccess|1 answers #0*", AskQuestionSuccess_Answer];
  }
};
var AskQuestionSuccess_Answer = class _AskQuestionSuccess_Answer extends __protoMessage329 {
  constructor(data) {
    super();
    this.questionId = "";
    this.selectedOptionIds = [];
    this.freeformText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionSuccess_Answer().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionSuccess_Answer().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionSuccess_Answer().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionSuccess_Answer, a, b);
  }
  static $() {
    return ["AskQuestionSuccess.Answer|1 question_id 9|2 selected_option_ids 9*|3 freeform_text 9"];
  }
};
var AskQuestionError = class _AskQuestionError extends __protoMessage329 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionError, a, b);
  }
  static $() {
    return ["AskQuestionError|1 error_message 9"];
  }
};
var AskQuestionRejected = class _AskQuestionRejected extends __protoMessage329 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AskQuestionRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AskQuestionRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AskQuestionRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AskQuestionRejected, a, b);
  }
  static $() {
    return ["AskQuestionRejected|1 reason 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/fetch_exec_pb.js
var __protoPackage31 = "agent.v1.";
var __protoMessage330 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage31;
  }
};
var FetchArgs = class _FetchArgs extends __protoMessage330 {
  constructor(data) {
    super();
    this.url = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchArgs, a, b);
  }
  static $() {
    return ["FetchArgs|1 url 9|2 tool_call_id 9"];
  }
};
var FetchResult = class _FetchResult extends __protoMessage330 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchResult, a, b);
  }
  static $() {
    return ["FetchResult|1 success #0 result|2 error #1 result", FetchSuccess, FetchError];
  }
};
var FetchSuccess = class _FetchSuccess extends __protoMessage330 {
  constructor(data) {
    super();
    this.url = "";
    this.content = "";
    this.statusCode = 0;
    this.contentType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchSuccess, a, b);
  }
  static $() {
    return ["FetchSuccess|1 url 9|2 content 9|3 status_code 5|4 content_type 9"];
  }
};
var FetchError = class _FetchError extends __protoMessage330 {
  constructor(data) {
    super();
    this.url = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchError, a, b);
  }
  static $() {
    return ["FetchError|1 url 9|2 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/fetch_tool_pb.js
var __protoPackage32 = "agent.v1.";
var __protoMessage331 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage32;
  }
};
var FetchToolCall = class _FetchToolCall extends __protoMessage331 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchToolCall, a, b);
  }
  static $() {
    return ["FetchToolCall|1 args #0|2 result #1", FetchArgs, FetchResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/switch_mode_tool_pb.js
var __protoPackage33 = "agent.v1.";
var __protoMessage332 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage33;
  }
};
var SwitchModeArgs = class _SwitchModeArgs extends __protoMessage332 {
  constructor(data) {
    super();
    this.targetModeId = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeArgs, a, b);
  }
  static $() {
    return ["SwitchModeArgs|1 target_mode_id 9|2 explanation 9?|3 tool_call_id 9"];
  }
};
var SwitchModeResult = class _SwitchModeResult extends __protoMessage332 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeResult, a, b);
  }
  static $() {
    return ["SwitchModeResult|1 success #0 result|2 error #1 result|3 rejected #2 result", SwitchModeSuccess, SwitchModeError, SwitchModeRejected];
  }
};
var SwitchModeSuccess = class _SwitchModeSuccess extends __protoMessage332 {
  constructor(data) {
    super();
    this.fromModeId = "";
    this.toModeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeSuccess, a, b);
  }
  static $() {
    return ["SwitchModeSuccess|1 from_mode_id 9|2 to_mode_id 9"];
  }
};
var SwitchModeError = class _SwitchModeError extends __protoMessage332 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeError, a, b);
  }
  static $() {
    return ["SwitchModeError|1 error 9"];
  }
};
var SwitchModeRejected = class _SwitchModeRejected extends __protoMessage332 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeRejected, a, b);
  }
  static $() {
    return ["SwitchModeRejected|1 reason 9"];
  }
};
var SwitchModeToolCall = class _SwitchModeToolCall extends __protoMessage332 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeToolCall, a, b);
  }
  static $() {
    return ["SwitchModeToolCall|1 args #0|2 result #1", SwitchModeArgs, SwitchModeResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/generate_image_tool_pb.js
var __protoPackage34 = "agent.v1.";
var __protoMessage333 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage34;
  }
};
var GenerateImageArgs = class _GenerateImageArgs extends __protoMessage333 {
  constructor(data) {
    super();
    this.description = "";
    this.referenceImagePaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageArgs, a, b);
  }
  static $() {
    return ["GenerateImageArgs|1 description 9|2 file_path 9?|5 reference_image_paths 9*|6 aspect_ratio 9?"];
  }
};
var GenerateImageResult = class _GenerateImageResult extends __protoMessage333 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageResult, a, b);
  }
  static $() {
    return ["GenerateImageResult|1 success #0 result|2 error #1 result", GenerateImageSuccess, GenerateImageError];
  }
};
var GenerateImageSuccess = class _GenerateImageSuccess extends __protoMessage333 {
  constructor(data) {
    super();
    this.filePath = "";
    this.imageData = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageSuccess, a, b);
  }
  static $() {
    return ["GenerateImageSuccess|1 file_path 9|2 image_data 9"];
  }
};
var GenerateImageError = class _GenerateImageError extends __protoMessage333 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageError, a, b);
  }
  static $() {
    return ["GenerateImageError|1 error 9"];
  }
};
var GenerateImageToolCall = class _GenerateImageToolCall extends __protoMessage333 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageToolCall, a, b);
  }
  static $() {
    return ["GenerateImageToolCall|1 args #0|2 result #1", GenerateImageArgs, GenerateImageResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/record_screen_exec_pb.js
var __protoPackage35 = "agent.v1.";
var __protoMessage334 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage35;
  }
};
var RecordingMode = /* @__PURE__ */ enumType(proto3, __protoPackage35, "RecordingMode", [[0, "UNSPECIFIED"], [1, "START_RECORDING"], [2, "SAVE_RECORDING"], [3, "DISCARD_RECORDING"]], 1);
var RequestedFilePathRejectedReason = /* @__PURE__ */ enumType(proto3, __protoPackage35, "RequestedFilePathRejectedReason", [[0, "UNSPECIFIED"], [1, "SLASHES_NOT_ALLOWED"]], 1);
var RecordScreenArgs = class _RecordScreenArgs extends __protoMessage334 {
  constructor(data) {
    super();
    this.mode = RecordingMode.UNSPECIFIED;
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenArgs, a, b);
  }
  static $() {
    return ["RecordScreenArgs|1 mode #0|2 tool_call_id 9|3 save_as_filename 9?", RecordingMode];
  }
};
var RecordScreenResult = class _RecordScreenResult extends __protoMessage334 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenResult, a, b);
  }
  static $() {
    return ["RecordScreenResult|1 start_success #0 result|2 save_success #1 result|3 discard_success #2 result|4 failure #3 result", RecordScreenStartSuccess, RecordScreenSaveSuccess, RecordScreenDiscardSuccess, RecordScreenFailure];
  }
};
var RecordScreenStartSuccess = class _RecordScreenStartSuccess extends __protoMessage334 {
  constructor(data) {
    super();
    this.wasPriorRecordingCancelled = false;
    this.wasSaveAsFilenameIgnored = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenStartSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenStartSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenStartSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenStartSuccess, a, b);
  }
  static $() {
    return ["RecordScreenStartSuccess|1 was_prior_recording_cancelled 8|2 was_save_as_filename_ignored 8"];
  }
};
var RecordScreenSaveSuccess = class _RecordScreenSaveSuccess extends __protoMessage334 {
  constructor(data) {
    super();
    this.path = "";
    this.recordingDurationMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenSaveSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenSaveSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenSaveSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenSaveSuccess, a, b);
  }
  static $() {
    return ["RecordScreenSaveSuccess|1 path 9|2 recording_duration_ms 3|3 requested_file_path_rejected_reason #0?", RequestedFilePathRejectedReason];
  }
};
var RecordScreenDiscardSuccess = class _RecordScreenDiscardSuccess extends __protoMessage334 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenDiscardSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenDiscardSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenDiscardSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenDiscardSuccess, a, b);
  }
  static $() {
    return ["RecordScreenDiscardSuccess"];
  }
};
var RecordScreenFailure = class _RecordScreenFailure extends __protoMessage334 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenFailure, a, b);
  }
  static $() {
    return ["RecordScreenFailure|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/record_screen_tool_pb.js
var __protoPackage36 = "agent.v1.";
var __protoMessage335 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage36;
  }
};
var RecordScreenToolCall = class _RecordScreenToolCall extends __protoMessage335 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenToolCall, a, b);
  }
  static $() {
    return ["RecordScreenToolCall|1 args #0|2 result #1", RecordScreenArgs, RecordScreenResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/computer_use_tool_pb.js
var __protoPackage37 = "agent.v1.";
var __protoMessage336 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage37;
  }
};
var MouseButton = /* @__PURE__ */ enumType(proto3, __protoPackage37, "MouseButton", [[0, "UNSPECIFIED"], [1, "LEFT"], [2, "RIGHT"], [3, "MIDDLE"], [4, "BACK"], [5, "FORWARD"]], 1);
var ScrollDirection = /* @__PURE__ */ enumType(proto3, __protoPackage37, "ScrollDirection", [[0, "UNSPECIFIED"], [1, "UP"], [2, "DOWN"], [3, "LEFT"], [4, "RIGHT"]], 1);
var Coordinate = class _Coordinate extends __protoMessage336 {
  constructor(data) {
    super();
    this.x = 0;
    this.y = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Coordinate().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Coordinate().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Coordinate().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Coordinate, a, b);
  }
  static $() {
    return ["Coordinate|1 x 5|2 y 5"];
  }
};
var ComputerUseArgs = class _ComputerUseArgs extends __protoMessage336 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.actions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ComputerUseArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ComputerUseArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ComputerUseArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ComputerUseArgs, a, b);
  }
  static $() {
    return ["ComputerUseArgs|1 tool_call_id 9|2 actions #0*|3 description 9?|4 bind_unmapped_characters 8?|5 desktop_lease_actor_id 9?", ComputerUseAction];
  }
};
var ComputerUseAction = class _ComputerUseAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.action = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ComputerUseAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ComputerUseAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ComputerUseAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ComputerUseAction, a, b);
  }
  static $() {
    return ["ComputerUseAction|1 mouse_move #0 action|2 click #1 action|3 mouse_down #2 action|4 mouse_up #3 action|5 drag #4 action|6 scroll #5 action|7 type #6 action|8 key #7 action|9 wait #8 action|10 screenshot #9 action|11 cursor_position #10 action", MouseMoveAction, ClickAction, MouseDownAction, MouseUpAction, DragAction, ScrollAction, TypeAction, KeyAction, WaitAction, ScreenshotAction, CursorPositionAction];
  }
};
var MouseMoveAction = class _MouseMoveAction extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _MouseMoveAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _MouseMoveAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _MouseMoveAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_MouseMoveAction, a, b);
  }
  static $() {
    return ["MouseMoveAction|1 coordinate #0", Coordinate];
  }
};
var ClickAction = class _ClickAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.button = MouseButton.UNSPECIFIED;
    this.count = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ClickAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ClickAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ClickAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ClickAction, a, b);
  }
  static $() {
    return ["ClickAction|1 coordinate #0?|2 button #1|3 count 5|4 modifier_keys 9?", Coordinate, MouseButton];
  }
};
var MouseDownAction = class _MouseDownAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.button = MouseButton.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _MouseDownAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _MouseDownAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _MouseDownAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_MouseDownAction, a, b);
  }
  static $() {
    return ["MouseDownAction|1 button #0", MouseButton];
  }
};
var MouseUpAction = class _MouseUpAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.button = MouseButton.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _MouseUpAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _MouseUpAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _MouseUpAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_MouseUpAction, a, b);
  }
  static $() {
    return ["MouseUpAction|1 button #0", MouseButton];
  }
};
var DragAction = class _DragAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.path = [];
    this.button = MouseButton.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DragAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DragAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DragAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DragAction, a, b);
  }
  static $() {
    return ["DragAction|1 path #0*|2 button #1|3 modifier_keys 9?", Coordinate, MouseButton];
  }
};
var ScrollAction = class _ScrollAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.direction = ScrollDirection.UNSPECIFIED;
    this.amount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ScrollAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ScrollAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ScrollAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ScrollAction, a, b);
  }
  static $() {
    return ["ScrollAction|1 coordinate #0?|2 direction #1|3 amount 5|4 modifier_keys 9?", Coordinate, ScrollDirection];
  }
};
var TypeAction = class _TypeAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TypeAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TypeAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TypeAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TypeAction, a, b);
  }
  static $() {
    return ["TypeAction|1 text 9"];
  }
};
var KeyAction = class _KeyAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.key = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _KeyAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _KeyAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _KeyAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_KeyAction, a, b);
  }
  static $() {
    return ["KeyAction|1 key 9|2 hold_duration_ms 5?"];
  }
};
var WaitAction = class _WaitAction extends __protoMessage336 {
  constructor(data) {
    super();
    this.durationMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WaitAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WaitAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WaitAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WaitAction, a, b);
  }
  static $() {
    return ["WaitAction|1 duration_ms 5"];
  }
};
var ScreenshotAction = class _ScreenshotAction extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ScreenshotAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ScreenshotAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ScreenshotAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ScreenshotAction, a, b);
  }
  static $() {
    return ["ScreenshotAction"];
  }
};
var CursorPositionAction = class _CursorPositionAction extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CursorPositionAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CursorPositionAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CursorPositionAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CursorPositionAction, a, b);
  }
  static $() {
    return ["CursorPositionAction"];
  }
};
var ComputerUseResult = class _ComputerUseResult extends __protoMessage336 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ComputerUseResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ComputerUseResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ComputerUseResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ComputerUseResult, a, b);
  }
  static $() {
    return ["ComputerUseResult|1 success #0 result|2 error #1 result", ComputerUseSuccess, ComputerUseError];
  }
};
var ComputerUseSuccess = class _ComputerUseSuccess extends __protoMessage336 {
  constructor(data) {
    super();
    this.actionCount = 0;
    this.durationMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ComputerUseSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ComputerUseSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ComputerUseSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ComputerUseSuccess, a, b);
  }
  static $() {
    return ["ComputerUseSuccess|1 action_count 5|2 duration_ms 5|3 screenshot 9?|4 log 9?|5 screenshot_path 9?|6 cursor_position #0?", Coordinate];
  }
};
var ComputerUseError = class _ComputerUseError extends __protoMessage336 {
  constructor(data) {
    super();
    this.error = "";
    this.actionCount = 0;
    this.durationMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ComputerUseError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ComputerUseError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ComputerUseError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ComputerUseError, a, b);
  }
  static $() {
    return ["ComputerUseError|1 error 9|2 action_count 5|3 duration_ms 5|4 log 9?|5 screenshot 9?|6 screenshot_path 9?"];
  }
};
var ComputerUseToolCall = class _ComputerUseToolCall extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ComputerUseToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ComputerUseToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ComputerUseToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ComputerUseToolCall, a, b);
  }
  static $() {
    return ["ComputerUseToolCall|1 args #0|2 result #1", ComputerUseArgs, ComputerUseResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/background_shell_exec_pb.js
var __protoPackage38 = "agent.v1.";
var __protoMessage337 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage38;
  }
};
var WriteShellStdinArgs = class _WriteShellStdinArgs extends __protoMessage337 {
  constructor(data) {
    super();
    this.shellId = 0;
    this.chars = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinArgs, a, b);
  }
  static $() {
    return ["WriteShellStdinArgs|1 shell_id 13|2 chars 9"];
  }
};
var WriteShellStdinResult = class _WriteShellStdinResult extends __protoMessage337 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinResult, a, b);
  }
  static $() {
    return ["WriteShellStdinResult|1 success #0 result|2 error #1 result", WriteShellStdinSuccess, WriteShellStdinError];
  }
};
var WriteShellStdinSuccess = class _WriteShellStdinSuccess extends __protoMessage337 {
  constructor(data) {
    super();
    this.shellId = 0;
    this.terminalFileLengthBeforeInputWritten = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinSuccess, a, b);
  }
  static $() {
    return ["WriteShellStdinSuccess|1 shell_id 13|2 terminal_file_length_before_input_written 13"];
  }
};
var WriteShellStdinError = class _WriteShellStdinError extends __protoMessage337 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinError, a, b);
  }
  static $() {
    return ["WriteShellStdinError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/write_shell_stdin_tool_pb.js
var __protoPackage39 = "agent.v1.";
var __protoMessage338 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage39;
  }
};
var WriteShellStdinToolCall = class _WriteShellStdinToolCall extends __protoMessage338 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinToolCall, a, b);
  }
  static $() {
    return ["WriteShellStdinToolCall|1 args #0|2 result #1", WriteShellStdinArgs, WriteShellStdinResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/reflect_tool_pb.js
var __protoPackage40 = "agent.v1.";
var __protoMessage339 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage40;
  }
};
var ReflectArgs = class _ReflectArgs extends __protoMessage339 {
  constructor(data) {
    super();
    this.unexpectedActionOutcomes = "";
    this.relevantInstructions = "";
    this.scenarioAnalysis = "";
    this.criticalSynthesis = "";
    this.nextSteps = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectArgs, a, b);
  }
  static $() {
    return ["ReflectArgs|1 unexpected_action_outcomes 9|2 relevant_instructions 9|3 scenario_analysis 9|4 critical_synthesis 9|5 next_steps 9|6 tool_call_id 9"];
  }
};
var ReflectResult = class _ReflectResult extends __protoMessage339 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectResult, a, b);
  }
  static $() {
    return ["ReflectResult|1 success #0 result|2 error #1 result", ReflectSuccess, ReflectError];
  }
};
var ReflectSuccess = class _ReflectSuccess extends __protoMessage339 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectSuccess, a, b);
  }
  static $() {
    return ["ReflectSuccess"];
  }
};
var ReflectError = class _ReflectError extends __protoMessage339 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectError, a, b);
  }
  static $() {
    return ["ReflectError|1 error 9"];
  }
};
var ReflectToolCall = class _ReflectToolCall extends __protoMessage339 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectToolCall, a, b);
  }
  static $() {
    return ["ReflectToolCall|1 args #0|2 result #1", ReflectArgs, ReflectResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/setup_vm_environment_tool_pb.js
var __protoPackage41 = "agent.v1.";
var __protoMessage340 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage41;
  }
};
var SetupVmEnvironmentArgs = class _SetupVmEnvironmentArgs extends __protoMessage340 {
  constructor(data) {
    super();
    this.installCommand = "";
    this.startCommand = "";
    this.dockerfileContents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetupVmEnvironmentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetupVmEnvironmentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetupVmEnvironmentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetupVmEnvironmentArgs, a, b);
  }
  static $() {
    return ["SetupVmEnvironmentArgs|2 install_command 9|3 start_command 9|4 dockerfile_contents 9"];
  }
};
var SetupVmEnvironmentResult = class _SetupVmEnvironmentResult extends __protoMessage340 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetupVmEnvironmentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetupVmEnvironmentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetupVmEnvironmentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetupVmEnvironmentResult, a, b);
  }
  static $() {
    return ["SetupVmEnvironmentResult|1 success #0 result", SetupVmEnvironmentSuccess];
  }
};
var SetupVmEnvironmentSuccess = class _SetupVmEnvironmentSuccess extends __protoMessage340 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetupVmEnvironmentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetupVmEnvironmentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetupVmEnvironmentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetupVmEnvironmentSuccess, a, b);
  }
  static $() {
    return ["SetupVmEnvironmentSuccess"];
  }
};
var SetupVmEnvironmentToolCall = class _SetupVmEnvironmentToolCall extends __protoMessage340 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetupVmEnvironmentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetupVmEnvironmentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetupVmEnvironmentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetupVmEnvironmentToolCall, a, b);
  }
  static $() {
    return ["SetupVmEnvironmentToolCall|1 args #0|2 result #1", SetupVmEnvironmentArgs, SetupVmEnvironmentResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/start_grind_execution_tool_pb.js
var __protoPackage42 = "agent.v1.";
var __protoMessage341 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage42;
  }
};
var StartGrindExecutionArgs = class _StartGrindExecutionArgs extends __protoMessage341 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionArgs, a, b);
  }
  static $() {
    return ["StartGrindExecutionArgs|1 explanation 9?|2 tool_call_id 9"];
  }
};
var StartGrindExecutionResult = class _StartGrindExecutionResult extends __protoMessage341 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionResult, a, b);
  }
  static $() {
    return ["StartGrindExecutionResult|1 success #0 result|2 error #1 result", StartGrindExecutionSuccess, StartGrindExecutionError];
  }
};
var StartGrindExecutionSuccess = class _StartGrindExecutionSuccess extends __protoMessage341 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionSuccess, a, b);
  }
  static $() {
    return ["StartGrindExecutionSuccess"];
  }
};
var StartGrindExecutionError = class _StartGrindExecutionError extends __protoMessage341 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionError, a, b);
  }
  static $() {
    return ["StartGrindExecutionError|1 error 9"];
  }
};
var StartGrindExecutionToolCall = class _StartGrindExecutionToolCall extends __protoMessage341 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionToolCall, a, b);
  }
  static $() {
    return ["StartGrindExecutionToolCall|1 args #0|2 result #1", StartGrindExecutionArgs, StartGrindExecutionResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/start_grind_planning_tool_pb.js
var __protoPackage43 = "agent.v1.";
var __protoMessage342 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage43;
  }
};
var StartGrindPlanningArgs = class _StartGrindPlanningArgs extends __protoMessage342 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningArgs, a, b);
  }
  static $() {
    return ["StartGrindPlanningArgs|1 explanation 9?|2 tool_call_id 9"];
  }
};
var StartGrindPlanningResult = class _StartGrindPlanningResult extends __protoMessage342 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningResult, a, b);
  }
  static $() {
    return ["StartGrindPlanningResult|1 success #0 result|2 error #1 result", StartGrindPlanningSuccess, StartGrindPlanningError];
  }
};
var StartGrindPlanningSuccess = class _StartGrindPlanningSuccess extends __protoMessage342 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningSuccess, a, b);
  }
  static $() {
    return ["StartGrindPlanningSuccess"];
  }
};
var StartGrindPlanningError = class _StartGrindPlanningError extends __protoMessage342 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningError, a, b);
  }
  static $() {
    return ["StartGrindPlanningError|1 error 9"];
  }
};
var StartGrindPlanningToolCall = class _StartGrindPlanningToolCall extends __protoMessage342 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningToolCall, a, b);
  }
  static $() {
    return ["StartGrindPlanningToolCall|1 args #0|2 result #1", StartGrindPlanningArgs, StartGrindPlanningResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/web_fetch_tool_pb.js
var __protoPackage44 = "agent.v1.";
var __protoMessage343 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage44;
  }
};
var WebFetchArgs = class _WebFetchArgs extends __protoMessage343 {
  constructor(data) {
    super();
    this.url = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchArgs, a, b);
  }
  static $() {
    return ["WebFetchArgs|1 url 9|2 tool_call_id 9"];
  }
};
var WebFetchResult = class _WebFetchResult extends __protoMessage343 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchResult, a, b);
  }
  static $() {
    return ["WebFetchResult|1 success #0 result|2 error #1 result|3 rejected #2 result", WebFetchSuccess, WebFetchError, WebFetchRejected];
  }
};
var WebFetchSuccess = class _WebFetchSuccess extends __protoMessage343 {
  constructor(data) {
    super();
    this.url = "";
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchSuccess, a, b);
  }
  static $() {
    return ["WebFetchSuccess|1 url 9|2 markdown 9|3 output_location #0?", OutputLocation];
  }
};
var WebFetchError = class _WebFetchError extends __protoMessage343 {
  constructor(data) {
    super();
    this.url = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchError, a, b);
  }
  static $() {
    return ["WebFetchError|1 url 9|2 error 9"];
  }
};
var WebFetchRejected = class _WebFetchRejected extends __protoMessage343 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchRejected, a, b);
  }
  static $() {
    return ["WebFetchRejected|1 reason 9"];
  }
};
var WebFetchToolCall = class _WebFetchToolCall extends __protoMessage343 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WebFetchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WebFetchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WebFetchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WebFetchToolCall, a, b);
  }
  static $() {
    return ["WebFetchToolCall|1 args #0|2 result #1", WebFetchArgs, WebFetchResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/report_bugfix_results_tool_pb.js
var __protoPackage45 = "agent.v1.";
var __protoMessage344 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage45;
  }
};
var BugfixVerdict = /* @__PURE__ */ enumType(proto3, __protoPackage45, "BugfixVerdict", [[0, "UNSPECIFIED"], [1, "FIXED"], [2, "FALSE_POSITIVE"], [3, "COULD_NOT_FIX"], [4, "RESOLVED_BY_OTHER_FIX"]], 1);
var BugfixResultItem = class _BugfixResultItem extends __protoMessage344 {
  constructor(data) {
    super();
    this.bugId = "";
    this.bugTitle = "";
    this.verdict = BugfixVerdict.UNSPECIFIED;
    this.explanation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BugfixResultItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BugfixResultItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BugfixResultItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BugfixResultItem, a, b);
  }
  static $() {
    return ["BugfixResultItem|1 bug_id 9|2 bug_title 9|3 verdict #0|4 explanation 9|5 severity 9?", BugfixVerdict];
  }
};
var ReportBugfixResultsArgs = class _ReportBugfixResultsArgs extends __protoMessage344 {
  constructor(data) {
    super();
    this.summary = "";
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsArgs, a, b);
  }
  static $() {
    return ["ReportBugfixResultsArgs|1 summary 9|2 results #0*", BugfixResultItem];
  }
};
var ReportBugfixResultsSuccess = class _ReportBugfixResultsSuccess extends __protoMessage344 {
  constructor(data) {
    super();
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsSuccess, a, b);
  }
  static $() {
    return ["ReportBugfixResultsSuccess|1 results #0*", BugfixResultItem];
  }
};
var ReportBugfixResultsError = class _ReportBugfixResultsError extends __protoMessage344 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsError, a, b);
  }
  static $() {
    return ["ReportBugfixResultsError|1 error 9"];
  }
};
var ReportBugfixResultsResult = class _ReportBugfixResultsResult extends __protoMessage344 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsResult, a, b);
  }
  static $() {
    return ["ReportBugfixResultsResult|1 success #0 result|2 error #1 result", ReportBugfixResultsSuccess, ReportBugfixResultsError];
  }
};
var ReportBugfixResultsToolCall = class _ReportBugfixResultsToolCall extends __protoMessage344 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsToolCall, a, b);
  }
  static $() {
    return ["ReportBugfixResultsToolCall|1 args #0|2 result #1", ReportBugfixResultsArgs, ReportBugfixResultsResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/ai_attribution_tool_pb.js
var __protoPackage46 = "agent.v1.";
var __protoMessage345 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage46;
  }
};
var AiAttributionArgs = class _AiAttributionArgs extends __protoMessage345 {
  constructor(data) {
    super();
    this.filePaths = [];
    this.commitHashes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionArgs, a, b);
  }
  static $() {
    return ["AiAttributionArgs|5 file_paths 9*|2 start_line 5?|3 end_line 5?|6 commit_hashes 9*|7 output_mode 9?|9 max_commits 5?|10 include_line_ranges 8?"];
  }
};
var AiAttributionResult = class _AiAttributionResult extends __protoMessage345 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionResult, a, b);
  }
  static $() {
    return ["AiAttributionResult|1 success #0 result|2 error #1 result", AiAttributionSuccess, AiAttributionError];
  }
};
var AiAttributionSuccess = class _AiAttributionSuccess extends __protoMessage345 {
  constructor(data) {
    super();
    this.attributionText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionSuccess, a, b);
  }
  static $() {
    return ["AiAttributionSuccess|1 attribution_text 9|2 output_location #0?", OutputLocation];
  }
};
var AiAttributionError = class _AiAttributionError extends __protoMessage345 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionError, a, b);
  }
  static $() {
    return ["AiAttributionError|1 error 9"];
  }
};
var AiAttributionToolCall = class _AiAttributionToolCall extends __protoMessage345 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AiAttributionToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AiAttributionToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AiAttributionToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AiAttributionToolCall, a, b);
  }
  static $() {
    return ["AiAttributionToolCall|1 args #0|2 result #1", AiAttributionArgs, AiAttributionResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/pr_management_tool_pb.js
var __protoPackage47 = "agent.v1.";
var __protoMessage346 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage47;
  }
};
var PullRequestStatus = /* @__PURE__ */ enumType(proto3, __protoPackage47, "PullRequestStatus", [[0, "UNSPECIFIED"], [1, "OPEN"], [2, "CLOSED"]], 1);
var PrManagementArgs = class _PrManagementArgs extends __protoMessage346 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.action = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementArgs, a, b);
  }
  static $() {
    return ["PrManagementArgs|1 tool_call_id 9|2 create_pr #0 action|3 update_pr #1 action|4 post_comment #2 action|5 resolve_comment #3 action|6 get_ci_status #4 action|7 set_pr_status #5 action", CreatePrAction, UpdatePrAction, PostCommentAction, ResolveCommentAction, GetCiStatusAction, SetPrStatusAction];
  }
};
var CreatePrAction = class _CreatePrAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.title = "";
    this.body = "";
    this.branchName = "";
    this.addLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePrAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePrAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePrAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePrAction, a, b);
  }
  static $() {
    return ["CreatePrAction|1 title 9|2 body 9|3 base_branch 9?|4 draft 8?|5 branch_name 9|6 add_labels 9*|7 repo_url 9?|8 skip_branch_prefix_check 8?|9 stack_on_pr_number 3?"];
  }
};
var UpdatePrAction = class _UpdatePrAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.addLabels = [];
    this.removeLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrAction, a, b);
  }
  static $() {
    return ["UpdatePrAction|1 pr_url 9?|2 title 9?|3 body 9?|4 base_branch 9?|5 branch_name 9?|6 add_labels 9*|7 remove_labels 9*|8 repo_url 9?|9 stack_on_pr_number 3?|10 clear_stack 8?|11 draft 8?"];
  }
};
var PostCommentAction = class _PostCommentAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.body = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PostCommentAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PostCommentAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PostCommentAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PostCommentAction, a, b);
  }
  static $() {
    return ["PostCommentAction|1 pr_url 9?|2 branch_name 9?|3 body 9|4 repo_url 9?|5 in_reply_to 3?|6 path 9?|7 line 5?|8 start_line 5?|9 side 9?|10 reply_to_reference 9?"];
  }
};
var ResolveCommentAction = class _ResolveCommentAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.commentId = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ResolveCommentAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ResolveCommentAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ResolveCommentAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ResolveCommentAction, a, b);
  }
  static $() {
    return ["ResolveCommentAction|1 pr_url 9?|2 branch_name 9?|3 comment_id 3|4 repo_url 9?|5 comment_reference 9?"];
  }
};
var GetCiStatusAction = class _GetCiStatusAction extends __protoMessage346 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetCiStatusAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetCiStatusAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetCiStatusAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetCiStatusAction, a, b);
  }
  static $() {
    return ["GetCiStatusAction|1 pr_url 9?|2 branch_name 9?|3 repo_url 9?"];
  }
};
var SetPrStatusAction = class _SetPrStatusAction extends __protoMessage346 {
  constructor(data) {
    super();
    this.status = PullRequestStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetPrStatusAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetPrStatusAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetPrStatusAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetPrStatusAction, a, b);
  }
  static $() {
    return ["SetPrStatusAction|1 pr_url 9?|2 branch_name 9?|3 repo_url 9?|4 status #0", PullRequestStatus];
  }
};
var PrManagementResult = class _PrManagementResult extends __protoMessage346 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementResult, a, b);
  }
  static $() {
    return ["PrManagementResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 registered #3 result|5 needs_confirmation #4 result", PrManagementSuccess, PrManagementError, PrManagementRejected, PrManagementRegistered, PrManagementNeedsConfirmation];
  }
};
var PrManagementSuccess = class _PrManagementSuccess extends __protoMessage346 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.prNumber = 0;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementSuccess, a, b);
  }
  static $() {
    return ["PrManagementSuccess|1 pr_url 9|2 pr_number 5|3 message 9"];
  }
};
var PrManagementError = class _PrManagementError extends __protoMessage346 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementError, a, b);
  }
  static $() {
    return ["PrManagementError|1 error 9"];
  }
};
var PrManagementRejected = class _PrManagementRejected extends __protoMessage346 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementRejected, a, b);
  }
  static $() {
    return ["PrManagementRejected|1 reason 9"];
  }
};
var PrManagementRegistered = class _PrManagementRegistered extends __protoMessage346 {
  constructor(data) {
    super();
    this.message = "";
    this.title = "";
    this.body = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementRegistered().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementRegistered().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementRegistered().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementRegistered, a, b);
  }
  static $() {
    return ["PrManagementRegistered|1 message 9|2 title 9|3 body 9|4 base_branch 9?|5 draft 8?|6 branch_name 9"];
  }
};
var PrManagementNeedsConfirmation = class _PrManagementNeedsConfirmation extends __protoMessage346 {
  constructor(data) {
    super();
    this.message = "";
    this.discoveredPrUrl = "";
    this.discoveredPrNumber = 0;
    this.discoveredPrTitle = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementNeedsConfirmation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementNeedsConfirmation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementNeedsConfirmation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementNeedsConfirmation, a, b);
  }
  static $() {
    return ["PrManagementNeedsConfirmation|1 message 9|2 discovered_pr_url 9|3 discovered_pr_number 5|4 discovered_pr_title 9|5 branch_name 9"];
  }
};
var PrManagementToolCall = class _PrManagementToolCall extends __protoMessage346 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrManagementToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrManagementToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrManagementToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrManagementToolCall, a, b);
  }
  static $() {
    return ["PrManagementToolCall|1 args #0|2 result #1", PrManagementArgs, PrManagementResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/mcp_auth_tool_pb.js
var __protoPackage48 = "agent.v1.";
var __protoMessage347 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage48;
  }
};
var McpAuthArgs = class _McpAuthArgs extends __protoMessage347 {
  constructor(data) {
    super();
    this.serverIdentifier = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthArgs, a, b);
  }
  static $() {
    return ["McpAuthArgs|1 server_identifier 9|2 tool_call_id 9"];
  }
};
var McpAuthResult = class _McpAuthResult extends __protoMessage347 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthResult, a, b);
  }
  static $() {
    return ["McpAuthResult|1 success #0 result|2 error #1 result|3 rejected #2 result", McpAuthSuccess, McpAuthError, McpAuthRejected];
  }
};
var McpAuthSuccess = class _McpAuthSuccess extends __protoMessage347 {
  constructor(data) {
    super();
    this.serverIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthSuccess, a, b);
  }
  static $() {
    return ["McpAuthSuccess|1 server_identifier 9"];
  }
};
var McpAuthError = class _McpAuthError extends __protoMessage347 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthError, a, b);
  }
  static $() {
    return ["McpAuthError|1 error 9"];
  }
};
var McpAuthRejected = class _McpAuthRejected extends __protoMessage347 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthRejected, a, b);
  }
  static $() {
    return ["McpAuthRejected|1 reason 9"];
  }
};
var McpAuthToolCall = class _McpAuthToolCall extends __protoMessage347 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthToolCall, a, b);
  }
  static $() {
    return ["McpAuthToolCall|1 args #0|2 result #1", McpAuthArgs, McpAuthResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/await_tool_pb.js
var __protoPackage49 = "agent.v1.";
var __protoMessage348 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage49;
  }
};
var AwaitArgs = class _AwaitArgs extends __protoMessage348 {
  constructor(data) {
    super();
    this.taskId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitArgs, a, b);
  }
  static $() {
    return ["AwaitArgs|1 task_id 9|2 block_until_ms 13?|3 regex 9?"];
  }
};
var AwaitTaskComplete = class _AwaitTaskComplete extends __protoMessage348 {
  constructor(data) {
    super();
    this.taskId = "";
    this.runtimeMs = protoInt64.zero;
    this.outputFilePath = "";
    this.outputLength = protoInt64.zero;
    this.regexRequested = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitTaskComplete().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitTaskComplete().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitTaskComplete().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitTaskComplete, a, b);
  }
  static $() {
    return ["AwaitTaskComplete|1 task_id 9|2 runtime_ms 4|3 output_file_path 9|4 output_length 4|5 regex_requested 8|6 regex_match 9?|7 exit_code 17?|8 wake_reason 9?"];
  }
};
var AwaitTaskStillRunning = class _AwaitTaskStillRunning extends __protoMessage348 {
  constructor(data) {
    super();
    this.taskId = "";
    this.runtimeMs = protoInt64.zero;
    this.outputFilePath = "";
    this.outputLength = protoInt64.zero;
    this.regexRequested = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitTaskStillRunning().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitTaskStillRunning().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitTaskStillRunning().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitTaskStillRunning, a, b);
  }
  static $() {
    return ["AwaitTaskStillRunning|1 task_id 9|2 runtime_ms 4|3 output_file_path 9|4 output_length 4|5 regex_requested 8|6 regex_match 9?|7 wake_reason 9?"];
  }
};
var AwaitError = class _AwaitError extends __protoMessage348 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitError, a, b);
  }
  static $() {
    return ["AwaitError|1 error 9"];
  }
};
var AwaitSuccess = class _AwaitSuccess extends __protoMessage348 {
  constructor(data) {
    super();
    this.awaitResult = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitSuccess, a, b);
  }
  static $() {
    return ["AwaitSuccess|1 complete #0 await_result|2 still_running #1 await_result", AwaitTaskComplete, AwaitTaskStillRunning];
  }
};
var AwaitResult = class _AwaitResult extends __protoMessage348 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitResult, a, b);
  }
  static $() {
    return ["AwaitResult|1 complete #0 result|2 still_running #1 result|3 error #2 result|4 success #3 result", AwaitTaskComplete, AwaitTaskStillRunning, AwaitError, AwaitSuccess];
  }
};
var AwaitToolCall = class _AwaitToolCall extends __protoMessage348 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AwaitToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AwaitToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AwaitToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AwaitToolCall, a, b);
  }
  static $() {
    return ["AwaitToolCall|1 args #0|2 result #1", AwaitArgs, AwaitResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/blame_by_file_path_tool_pb.js
var __protoPackage50 = "agent.v1.";
var __protoMessage349 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage50;
  }
};
var BlameByFilePathArgs = class _BlameByFilePathArgs extends __protoMessage349 {
  constructor(data) {
    super();
    this.filePath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathArgs, a, b);
  }
  static $() {
    return ["BlameByFilePathArgs|1 file_path 9|2 start_line 5?|3 end_line 5?"];
  }
};
var BlameByFilePathSuccess = class _BlameByFilePathSuccess extends __protoMessage349 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathSuccess, a, b);
  }
  static $() {
    return ["BlameByFilePathSuccess|1 content 9"];
  }
};
var BlameByFilePathError = class _BlameByFilePathError extends __protoMessage349 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathError, a, b);
  }
  static $() {
    return ["BlameByFilePathError|1 error_message 9"];
  }
};
var BlameByFilePathResult = class _BlameByFilePathResult extends __protoMessage349 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathResult, a, b);
  }
  static $() {
    return ["BlameByFilePathResult|1 success #0 result|2 error #1 result", BlameByFilePathSuccess, BlameByFilePathError];
  }
};
var BlameByFilePathToolCall = class _BlameByFilePathToolCall extends __protoMessage349 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BlameByFilePathToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BlameByFilePathToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BlameByFilePathToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BlameByFilePathToolCall, a, b);
  }
  static $() {
    return ["BlameByFilePathToolCall|1 args #0|2 result #1", BlameByFilePathArgs, BlameByFilePathResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/get_mcp_tools_tool_pb.js
var __protoPackage51 = "agent.v1.";
var __protoMessage350 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage51;
  }
};
var GetMcpToolsArgs = class _GetMcpToolsArgs extends __protoMessage350 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetMcpToolsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetMcpToolsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetMcpToolsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetMcpToolsArgs, a, b);
  }
  static $() {
    return ["GetMcpToolsArgs|1 server 9?|2 tool_name 9?|3 pattern 9?|4 tool_call_id 9"];
  }
};
var GetMcpToolsAgentResult = class _GetMcpToolsAgentResult extends __protoMessage350 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetMcpToolsAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetMcpToolsAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetMcpToolsAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetMcpToolsAgentResult, a, b);
  }
  static $() {
    return ["GetMcpToolsAgentResult|1 success #0 result|2 error #1 result", GetMcpToolsSuccess, GetMcpToolsError];
  }
};
var GetMcpToolsSuccess = class _GetMcpToolsSuccess extends __protoMessage350 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetMcpToolsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetMcpToolsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetMcpToolsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetMcpToolsSuccess, a, b);
  }
  static $() {
    return ["GetMcpToolsSuccess|1 content 9|2 output_file_path 9?"];
  }
};
var GetMcpToolsError = class _GetMcpToolsError extends __protoMessage350 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetMcpToolsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetMcpToolsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetMcpToolsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetMcpToolsError, a, b);
  }
  static $() {
    return ["GetMcpToolsError|1 error 9"];
  }
};
var GetMcpToolsToolCall = class _GetMcpToolsToolCall extends __protoMessage350 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetMcpToolsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetMcpToolsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetMcpToolsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetMcpToolsToolCall, a, b);
  }
  static $() {
    return ["GetMcpToolsToolCall|1 args #0|2 result #1", GetMcpToolsArgs, GetMcpToolsAgentResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/report_bug_tool_pb.js
var __protoPackage52 = "agent.v1.";
var __protoMessage351 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage52;
  }
};
var ReportBugArgs = class _ReportBugArgs extends __protoMessage351 {
  constructor(data) {
    super();
    this.title = "";
    this.file = "";
    this.startLine = 0;
    this.endLine = 0;
    this.description = "";
    this.severity = "";
    this.category = "";
    this.rationale = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugArgs, a, b);
  }
  static $() {
    return ["ReportBugArgs|1 title 9|2 file 9|3 start_line 5|4 end_line 5|5 description 9|6 severity 9|7 category 9|8 rationale 9"];
  }
};
var ReportBugSuccess = class _ReportBugSuccess extends __protoMessage351 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugSuccess, a, b);
  }
  static $() {
    return ["ReportBugSuccess|1 output 9"];
  }
};
var ReportBugError = class _ReportBugError extends __protoMessage351 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugError, a, b);
  }
  static $() {
    return ["ReportBugError|1 error_message 9"];
  }
};
var ReportBugResult = class _ReportBugResult extends __protoMessage351 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugResult, a, b);
  }
  static $() {
    return ["ReportBugResult|1 success #0 result|2 error #1 result", ReportBugSuccess, ReportBugError];
  }
};
var ReportBugToolCall = class _ReportBugToolCall extends __protoMessage351 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugToolCall, a, b);
  }
  static $() {
    return ["ReportBugToolCall|1 args #0|2 result #1", ReportBugArgs, ReportBugResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/communicate_update_tool_pb.js
var __protoPackage53 = "agent.v1.";
var __protoMessage352 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage53;
  }
};
var CommunicateUpdateArgs = class _CommunicateUpdateArgs extends __protoMessage352 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateArgs, a, b);
  }
  static $() {
    return ["CommunicateUpdateArgs|1 current_step 9?|3 final_summary 9?|4 completed_subtitle 9?"];
  }
};
var CommunicateUpdateSuccess = class _CommunicateUpdateSuccess extends __protoMessage352 {
  constructor(data) {
    super();
    this.currentStep = "";
    this.messageIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateSuccess, a, b);
  }
  static $() {
    return ["CommunicateUpdateSuccess|1 current_step 9|3 message_index 13"];
  }
};
var CommunicateUpdateError = class _CommunicateUpdateError extends __protoMessage352 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateError, a, b);
  }
  static $() {
    return ["CommunicateUpdateError|1 error 9"];
  }
};
var CommunicateUpdateResult = class _CommunicateUpdateResult extends __protoMessage352 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateResult, a, b);
  }
  static $() {
    return ["CommunicateUpdateResult|1 success #0 result|2 error #1 result", CommunicateUpdateSuccess, CommunicateUpdateError];
  }
};
var CommunicateUpdateToolCall = class _CommunicateUpdateToolCall extends __protoMessage352 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateToolCall, a, b);
  }
  static $() {
    return ["CommunicateUpdateToolCall|1 args #0|2 result #1", CommunicateUpdateArgs, CommunicateUpdateResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/send_final_summary_tool_pb.js
var __protoPackage54 = "agent.v1.";
var __protoMessage353 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage54;
  }
};
var SendFinalSummaryArgs = class _SendFinalSummaryArgs extends __protoMessage353 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryArgs, a, b);
  }
  static $() {
    return ["SendFinalSummaryArgs|1 final_summary 9?"];
  }
};
var SendFinalSummarySuccess = class _SendFinalSummarySuccess extends __protoMessage353 {
  constructor(data) {
    super();
    this.finalSummary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummarySuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummarySuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummarySuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummarySuccess, a, b);
  }
  static $() {
    return ["SendFinalSummarySuccess|1 final_summary 9"];
  }
};
var SendFinalSummaryError = class _SendFinalSummaryError extends __protoMessage353 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryError, a, b);
  }
  static $() {
    return ["SendFinalSummaryError|1 error 9"];
  }
};
var SendFinalSummaryResult = class _SendFinalSummaryResult extends __protoMessage353 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryResult, a, b);
  }
  static $() {
    return ["SendFinalSummaryResult|1 success #0 result|2 error #1 result", SendFinalSummarySuccess, SendFinalSummaryError];
  }
};
var SendFinalSummaryToolCall = class _SendFinalSummaryToolCall extends __protoMessage353 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryToolCall, a, b);
  }
  static $() {
    return ["SendFinalSummaryToolCall|1 args #0|2 result #1", SendFinalSummaryArgs, SendFinalSummaryResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/update_pr_code_tour_tool_pb.js
var __protoPackage55 = "agent.v1.";
var __protoMessage354 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage55;
  }
};
var UpdatePrCodeTourExecutionMode = /* @__PURE__ */ enumType(proto3, __protoPackage55, "UpdatePrCodeTourExecutionMode", [[0, "UNSPECIFIED"], [1, "SERVER_SCHEDULED"], [2, "CLIENT_REQUIRED"], [3, "SKIPPED"], [4, "EDITED"]], 1);
var UpdatePrCodeTourArgs = class _UpdatePrCodeTourArgs extends __protoMessage354 {
  constructor(data) {
    super();
    this.feedback = "";
    this.toolCallId = "";
    this.scopeCommitHashes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourArgs, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourArgs|1 feedback 9|2 tool_call_id 9|3 base_sha 9?|4 head_sha 9?|5 source_revision_id 9?|6 revision_id 9?|7 markdown 9?|8 heading 9?|9 artifact_path 9?|10 artifact_alt 9?|11 scope_commit_hashes 9*|12 explicit_user_prompt 9?"];
  }
};
var UpdatePrCodeTourResult = class _UpdatePrCodeTourResult extends __protoMessage354 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourResult, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourResult|1 success #0 result|2 error #1 result", UpdatePrCodeTourSuccess, UpdatePrCodeTourError];
  }
};
var UpdatePrCodeTourSuccess = class _UpdatePrCodeTourSuccess extends __protoMessage354 {
  constructor(data) {
    super();
    this.revisionId = "";
    this.message = "";
    this.executionMode = UpdatePrCodeTourExecutionMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourSuccess, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourSuccess|1 revision_id 9|2 message 9|3 execution_mode #0", UpdatePrCodeTourExecutionMode];
  }
};
var UpdatePrCodeTourError = class _UpdatePrCodeTourError extends __protoMessage354 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourError, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourError|1 error 9"];
  }
};
var UpdatePrCodeTourToolCall = class _UpdatePrCodeTourToolCall extends __protoMessage354 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourToolCall, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourToolCall|1 args #0|2 result #1", UpdatePrCodeTourArgs, UpdatePrCodeTourResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/replace_env_tool_pb.js
var __protoPackage56 = "agent.v1.";
var __protoMessage355 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage56;
  }
};
var ReplaceEnvMode = /* @__PURE__ */ enumType(proto3, __protoPackage56, "ReplaceEnvMode", [[0, "UNSPECIFIED"], [1, "CUSTOM"], [2, "CLEAN_SLATE"], [3, "DEFAULT"]], 1);
var RepoCheckoutRefOverride = class _RepoCheckoutRefOverride extends __protoMessage355 {
  constructor(data) {
    super();
    this.repoUrl = "";
    this.ref = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RepoCheckoutRefOverride().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RepoCheckoutRefOverride().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RepoCheckoutRefOverride().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RepoCheckoutRefOverride, a, b);
  }
  static $() {
    return ["RepoCheckoutRefOverride|1 repo_url 9|2 ref 9"];
  }
};
var ReplaceEnvConfig = class _ReplaceEnvConfig extends __protoMessage355 {
  constructor(data) {
    super();
    this.installScript = "";
    this.dockerfileContents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvConfig().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvConfig().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvConfig().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvConfig, a, b);
  }
  static $() {
    return ["ReplaceEnvConfig|1 install_script 9|2 dockerfile_contents 9"];
  }
};
var ReplaceEnvArgs = class _ReplaceEnvArgs extends __protoMessage355 {
  constructor(data) {
    super();
    this.mode = ReplaceEnvMode.UNSPECIFIED;
    this.checkoutRefOverrides = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvArgs, a, b);
  }
  static $() {
    return ["ReplaceEnvArgs|1 config #0|2 mode #1|3 checkout_ref_overrides #2*", ReplaceEnvConfig, ReplaceEnvMode, RepoCheckoutRefOverride];
  }
};
var ReplaceEnvSuccess = class _ReplaceEnvSuccess extends __protoMessage355 {
  constructor(data) {
    super();
    this.setupLogs = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvSuccess, a, b);
  }
  static $() {
    return ["ReplaceEnvSuccess|1 setup_logs 9"];
  }
};
var ReplaceEnvFailure = class _ReplaceEnvFailure extends __protoMessage355 {
  constructor(data) {
    super();
    this.errorMessage = "";
    this.setupLogs = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvFailure, a, b);
  }
  static $() {
    return ["ReplaceEnvFailure|1 error_message 9|2 setup_logs 9"];
  }
};
var ReplaceEnvResult = class _ReplaceEnvResult extends __protoMessage355 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvResult, a, b);
  }
  static $() {
    return ["ReplaceEnvResult|1 success #0 result|2 failure #1 result", ReplaceEnvSuccess, ReplaceEnvFailure];
  }
};
var ReplaceEnvToolCall = class _ReplaceEnvToolCall extends __protoMessage355 {
  constructor(data) {
    super();
    this.associatedPodKey = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReplaceEnvToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReplaceEnvToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReplaceEnvToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReplaceEnvToolCall, a, b);
  }
  static $() {
    return ["ReplaceEnvToolCall|1 args #0|2 result #1|3 associated_pod_key 9", ReplaceEnvArgs, ReplaceEnvResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/edit_pr_labels_tool_pb.js
var __protoPackage57 = "agent.v1.";
var __protoMessage356 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage57;
  }
};
var EditPrLabelsArgs = class _EditPrLabelsArgs extends __protoMessage356 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.prUrl = "";
    this.addLabels = [];
    this.removeLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsArgs, a, b);
  }
  static $() {
    return ["EditPrLabelsArgs|1 tool_call_id 9|2 pr_url 9|4 add_labels 9*|5 remove_labels 9*"];
  }
};
var EditPrLabelsResult = class _EditPrLabelsResult extends __protoMessage356 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsResult, a, b);
  }
  static $() {
    return ["EditPrLabelsResult|1 success #0 result|2 error #1 result", EditPrLabelsSuccess, EditPrLabelsError];
  }
};
var EditPrLabelsSuccess = class _EditPrLabelsSuccess extends __protoMessage356 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.prNumber = 0;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsSuccess, a, b);
  }
  static $() {
    return ["EditPrLabelsSuccess|1 pr_url 9|2 pr_number 5|3 message 9"];
  }
};
var EditPrLabelsError = class _EditPrLabelsError extends __protoMessage356 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsError, a, b);
  }
  static $() {
    return ["EditPrLabelsError|1 error 9"];
  }
};
var EditPrLabelsToolCall = class _EditPrLabelsToolCall extends __protoMessage356 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsToolCall, a, b);
  }
  static $() {
    return ["EditPrLabelsToolCall|1 args #0|2 result #1", EditPrLabelsArgs, EditPrLabelsResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/record_ci_investigation_findings_tool_pb.js
var __protoPackage58 = "agent.v1.";
var __protoMessage357 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage58;
  }
};
var RecordCiInvestigationFinding = class _RecordCiInvestigationFinding extends __protoMessage357 {
  constructor(data) {
    super();
    this.checkName = "";
    this.tldr = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationFinding().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationFinding().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationFinding().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationFinding, a, b);
  }
  static $() {
    return ["RecordCiInvestigationFinding|1 check_name 9|2 details_url 9?|3 tldr 9|4 root_cause 9?|5 failing_signal 9?|6 suggested_next_step 9?|7 diff_relation 9?|8 diff_relation_evidence 9?|9 flake_assessment 9?|10 flake_evidence 9?|11 rerun_available 8?|12 rerun_evidence 9?|13 recommended_action 9?|14 recommended_action_evidence 9?|15 confidence 9?"];
  }
};
var RecordCiInvestigationOverall = class _RecordCiInvestigationOverall extends __protoMessage357 {
  constructor(data) {
    super();
    this.summary = "";
    this.themes = [];
    this.checkKeys = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationOverall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationOverall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationOverall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationOverall, a, b);
  }
  static $() {
    return ["RecordCiInvestigationOverall|1 summary 9|2 themes 9*|3 recommended_action 9?|4 recommended_action_evidence 9?|5 check_keys 9*"];
  }
};
var RecordCiInvestigationFindingsArgs = class _RecordCiInvestigationFindingsArgs extends __protoMessage357 {
  constructor(data) {
    super();
    this.findings = [];
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationFindingsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationFindingsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationFindingsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationFindingsArgs, a, b);
  }
  static $() {
    return ["RecordCiInvestigationFindingsArgs|1 findings #0*|2 overall #1?|3 tool_call_id 9", RecordCiInvestigationFinding, RecordCiInvestigationOverall];
  }
};
var RecordCiInvestigationFindingsSuccess = class _RecordCiInvestigationFindingsSuccess extends __protoMessage357 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationFindingsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationFindingsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationFindingsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationFindingsSuccess, a, b);
  }
  static $() {
    return ["RecordCiInvestigationFindingsSuccess|1 message 9"];
  }
};
var RecordCiInvestigationFindingsError = class _RecordCiInvestigationFindingsError extends __protoMessage357 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationFindingsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationFindingsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationFindingsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationFindingsError, a, b);
  }
  static $() {
    return ["RecordCiInvestigationFindingsError|1 error 9"];
  }
};
var RecordCiInvestigationFindingsResult = class _RecordCiInvestigationFindingsResult extends __protoMessage357 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationFindingsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationFindingsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationFindingsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationFindingsResult, a, b);
  }
  static $() {
    return ["RecordCiInvestigationFindingsResult|1 success #0 result|2 error #1 result", RecordCiInvestigationFindingsSuccess, RecordCiInvestigationFindingsError];
  }
};
var RecordCiInvestigationFindingsToolCall = class _RecordCiInvestigationFindingsToolCall extends __protoMessage357 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordCiInvestigationFindingsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordCiInvestigationFindingsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordCiInvestigationFindingsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordCiInvestigationFindingsToolCall, a, b);
  }
  static $() {
    return ["RecordCiInvestigationFindingsToolCall|1 args #0|2 result #1", RecordCiInvestigationFindingsArgs, RecordCiInvestigationFindingsResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/send_message_tool_pb.js
var __protoPackage59 = "agent.v1.";
var __protoMessage358 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage59;
  }
};
var SendMessageText = class _SendMessageText extends __protoMessage358 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageText().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageText().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageText().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageText, a, b);
  }
  static $() {
    return ["SendMessageText|1 content 9"];
  }
};
var SendMessageAttachment = class _SendMessageAttachment extends __protoMessage358 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageAttachment().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageAttachment().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageAttachment().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageAttachment, a, b);
  }
  static $() {
    return ["SendMessageAttachment|1 url 9|2 alt 9?"];
  }
};
var SendMessageArgs = class _SendMessageArgs extends __protoMessage358 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageArgs, a, b);
  }
  static $() {
    return ["SendMessageArgs|1 text #0 message|2 attachment #1 message", SendMessageText, SendMessageAttachment];
  }
};
var SendMessageSuccess = class _SendMessageSuccess extends __protoMessage358 {
  constructor(data) {
    super();
    this.timestamp = protoInt64.zero;
    this.messageId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageSuccess, a, b);
  }
  static $() {
    return ["SendMessageSuccess|1 timestamp 4|2 message_id 9"];
  }
};
var SendMessageError = class _SendMessageError extends __protoMessage358 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageError, a, b);
  }
  static $() {
    return ["SendMessageError|1 error 9"];
  }
};
var SendMessageResult = class _SendMessageResult extends __protoMessage358 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageResult, a, b);
  }
  static $() {
    return ["SendMessageResult|1 success #0 result|2 error #1 result", SendMessageSuccess, SendMessageError];
  }
};
var SendMessageToolCall = class _SendMessageToolCall extends __protoMessage358 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageToolCall, a, b);
  }
  static $() {
    return ["SendMessageToolCall|1 args #0|2 result #1", SendMessageArgs, SendMessageResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/fetch_cloud_agent_data_tool_pb.js
var __protoPackage60 = "agent.v1.";
var __protoMessage359 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage60;
  }
};
var FetchCloudAgentDataArgs = class _FetchCloudAgentDataArgs extends __protoMessage359 {
  constructor(data) {
    super();
    this.bcIds = [];
    this.sources = [];
    this.statuses = [];
    this.includeTeamWide = false;
    this.includeArchived = false;
    this.includeTranscript = false;
    this.activeSince = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataArgs, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataArgs|4 bc_ids 9*|6 sources 9*|7 statuses 9*|8 include_team_wide 8|9 include_archived 8|10 limit 5?|12 include_transcript 8|13 active_since 9"];
  }
};
var FetchCloudAgentDataResult = class _FetchCloudAgentDataResult extends __protoMessage359 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataResult, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataResult|1 success #0 result|2 error #1 result", FetchCloudAgentDataSuccess, FetchCloudAgentDataError];
  }
};
var FetchCloudAgentDataSuccess = class _FetchCloudAgentDataSuccess extends __protoMessage359 {
  constructor(data) {
    super();
    this.summary = "";
    this.agentCount = 0;
    this.writtenPaths = [];
    this.unavailableBcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataSuccess, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataSuccess|1 summary 9|2 agent_count 5|3 written_paths 9*|4 unavailable_bc_ids 9*"];
  }
};
var FetchCloudAgentDataError = class _FetchCloudAgentDataError extends __protoMessage359 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataError, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataError|1 error 9"];
  }
};
var FetchCloudAgentDataToolCall = class _FetchCloudAgentDataToolCall extends __protoMessage359 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataToolCall, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataToolCall|1 args #0|2 result #1", FetchCloudAgentDataArgs, FetchCloudAgentDataResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/send_to_user_tool_pb.js
var __protoPackage61 = "agent.v1.";
var __protoMessage360 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage61;
  }
};
var SendToUserArgs = class _SendToUserArgs extends __protoMessage360 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserArgs, a, b);
  }
  static $() {
    return ["SendToUserArgs|1 message 9"];
  }
};
var SendToUserSuccess = class _SendToUserSuccess extends __protoMessage360 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserSuccess, a, b);
  }
  static $() {
    return ["SendToUserSuccess"];
  }
};
var SendToUserError = class _SendToUserError extends __protoMessage360 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserError, a, b);
  }
  static $() {
    return ["SendToUserError|1 error 9"];
  }
};
var SendToUserResult = class _SendToUserResult extends __protoMessage360 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserResult, a, b);
  }
  static $() {
    return ["SendToUserResult|1 success #0 result|2 error #1 result", SendToUserSuccess, SendToUserError];
  }
};
var SendToUserToolCall = class _SendToUserToolCall extends __protoMessage360 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserToolCall, a, b);
  }
  static $() {
    return ["SendToUserToolCall|1 args #0|2 result #1", SendToUserArgs, SendToUserResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_common_pb.js
var __protoPackage62 = "agent.v1.";
var __protoMessage361 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage62;
  }
};
var PiTruncation = class _PiTruncation extends __protoMessage361 {
  constructor(data) {
    super();
    this.truncated = false;
    this.truncatedBy = "";
    this.totalLines = 0;
    this.outputLines = 0;
    this.outputBytes = 0;
    this.firstLineExceedsLimit = false;
    this.lastLinePartial = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiTruncation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiTruncation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiTruncation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiTruncation, a, b);
  }
  static $() {
    return ["PiTruncation|1 truncated 8|2 truncated_by 9|3 total_lines 13|4 output_lines 13|5 output_bytes 13|6 max_lines 13?|7 max_bytes 13?|8 first_line_exceeds_limit 8|9 last_line_partial 8"];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_read_tool_pb.js
var __protoPackage63 = "agent.v1.";
var __protoMessage362 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage63;
  }
};
var PiReadToolCall = class _PiReadToolCall extends __protoMessage362 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolCall, a, b);
  }
  static $() {
    return ["PiReadToolCall|1 args #0|2 result #1", PiReadToolArgs, PiReadToolResult];
  }
};
var PiReadToolArgs = class _PiReadToolArgs extends __protoMessage362 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolArgs, a, b);
  }
  static $() {
    return ["PiReadToolArgs|1 path 9|2 offset 5?|3 limit 5?"];
  }
};
var PiReadToolResult = class _PiReadToolResult extends __protoMessage362 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolResult, a, b);
  }
  static $() {
    return ["PiReadToolResult|1 success #0 result|2 error #1 result", PiReadToolSuccess, PiReadToolError];
  }
};
var PiReadToolSuccess = class _PiReadToolSuccess extends __protoMessage362 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolSuccess, a, b);
  }
  static $() {
    return ["PiReadToolSuccess|1 output 9|2 truncation #0?", PiTruncation];
  }
};
var PiReadToolError = class _PiReadToolError extends __protoMessage362 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolError, a, b);
  }
  static $() {
    return ["PiReadToolError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_bash_tool_pb.js
var __protoPackage64 = "agent.v1.";
var __protoMessage363 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage64;
  }
};
var PiBashToolCall = class _PiBashToolCall extends __protoMessage363 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiBashToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiBashToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiBashToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiBashToolCall, a, b);
  }
  static $() {
    return ["PiBashToolCall|1 args #0|2 result #1", PiBashToolArgs, PiBashToolResult];
  }
};
var PiBashToolArgs = class _PiBashToolArgs extends __protoMessage363 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiBashToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiBashToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiBashToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiBashToolArgs, a, b);
  }
  static $() {
    return ["PiBashToolArgs|1 command 9|2 timeout 1?"];
  }
};
var PiBashToolResult = class _PiBashToolResult extends __protoMessage363 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiBashToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiBashToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiBashToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiBashToolResult, a, b);
  }
  static $() {
    return ["PiBashToolResult|1 success #0 result|2 error #1 result", PiBashToolSuccess, PiBashToolError];
  }
};
var PiBashToolSuccess = class _PiBashToolSuccess extends __protoMessage363 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiBashToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiBashToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiBashToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiBashToolSuccess, a, b);
  }
  static $() {
    return ["PiBashToolSuccess|1 output 9|2 truncation #0?|3 full_output_path 9?", PiTruncation];
  }
};
var PiBashToolError = class _PiBashToolError extends __protoMessage363 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiBashToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiBashToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiBashToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiBashToolError, a, b);
  }
  static $() {
    return ["PiBashToolError|1 error 9|2 truncation #0?|3 full_output_path 9?", PiTruncation];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_edit_tool_pb.js
var __protoPackage65 = "agent.v1.";
var __protoMessage364 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage65;
  }
};
var PiEditReplacement = class _PiEditReplacement extends __protoMessage364 {
  constructor(data) {
    super();
    this.oldText = "";
    this.newText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditReplacement().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditReplacement().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditReplacement().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditReplacement, a, b);
  }
  static $() {
    return ["PiEditReplacement|1 old_text 9|2 new_text 9"];
  }
};
var PiEditToolCall = class _PiEditToolCall extends __protoMessage364 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolCall, a, b);
  }
  static $() {
    return ["PiEditToolCall|1 args #0|2 result #1", PiEditToolArgs, PiEditToolResult];
  }
};
var PiEditToolArgs = class _PiEditToolArgs extends __protoMessage364 {
  constructor(data) {
    super();
    this.path = "";
    this.edits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolArgs, a, b);
  }
  static $() {
    return ["PiEditToolArgs|1 path 9|2 edits #0*", PiEditReplacement];
  }
};
var PiEditToolResult = class _PiEditToolResult extends __protoMessage364 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolResult, a, b);
  }
  static $() {
    return ["PiEditToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiEditToolSuccess, PiEditToolError, PiEditToolRejected];
  }
};
var PiEditToolSuccess = class _PiEditToolSuccess extends __protoMessage364 {
  constructor(data) {
    super();
    this.output = "";
    this.diff = "";
    this.patch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolSuccess, a, b);
  }
  static $() {
    return ["PiEditToolSuccess|1 output 9|2 diff 9|3 patch 9|4 first_changed_line 13?"];
  }
};
var PiEditToolError = class _PiEditToolError extends __protoMessage364 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolError, a, b);
  }
  static $() {
    return ["PiEditToolError|1 error 9"];
  }
};
var PiEditToolRejected = class _PiEditToolRejected extends __protoMessage364 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolRejected, a, b);
  }
  static $() {
    return ["PiEditToolRejected|1 reason 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_write_tool_pb.js
var __protoPackage66 = "agent.v1.";
var __protoMessage365 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage66;
  }
};
var PiWriteToolCall = class _PiWriteToolCall extends __protoMessage365 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolCall, a, b);
  }
  static $() {
    return ["PiWriteToolCall|1 args #0|2 result #1", PiWriteToolArgs, PiWriteToolResult];
  }
};
var PiWriteToolArgs = class _PiWriteToolArgs extends __protoMessage365 {
  constructor(data) {
    super();
    this.path = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolArgs, a, b);
  }
  static $() {
    return ["PiWriteToolArgs|1 path 9|2 content 9"];
  }
};
var PiWriteToolResult = class _PiWriteToolResult extends __protoMessage365 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolResult, a, b);
  }
  static $() {
    return ["PiWriteToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiWriteToolSuccess, PiWriteToolError, PiWriteToolRejected];
  }
};
var PiWriteToolSuccess = class _PiWriteToolSuccess extends __protoMessage365 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolSuccess, a, b);
  }
  static $() {
    return ["PiWriteToolSuccess|1 output 9"];
  }
};
var PiWriteToolError = class _PiWriteToolError extends __protoMessage365 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolError, a, b);
  }
  static $() {
    return ["PiWriteToolError|1 error 9"];
  }
};
var PiWriteToolRejected = class _PiWriteToolRejected extends __protoMessage365 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolRejected, a, b);
  }
  static $() {
    return ["PiWriteToolRejected|1 reason 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_grep_tool_pb.js
var __protoPackage67 = "agent.v1.";
var __protoMessage366 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage67;
  }
};
var PiGrepToolCall = class _PiGrepToolCall extends __protoMessage366 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolCall, a, b);
  }
  static $() {
    return ["PiGrepToolCall|1 args #0|2 result #1", PiGrepToolArgs, PiGrepToolResult];
  }
};
var PiGrepToolArgs = class _PiGrepToolArgs extends __protoMessage366 {
  constructor(data) {
    super();
    this.pattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolArgs, a, b);
  }
  static $() {
    return ["PiGrepToolArgs|1 pattern 9|2 path 9?|3 glob 9?|4 ignore_case 8?|5 literal 8?|6 context 5?|7 limit 5?"];
  }
};
var PiGrepToolResult = class _PiGrepToolResult extends __protoMessage366 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolResult, a, b);
  }
  static $() {
    return ["PiGrepToolResult|1 success #0 result|2 error #1 result", PiGrepToolSuccess, PiGrepToolError];
  }
};
var PiGrepToolSuccess = class _PiGrepToolSuccess extends __protoMessage366 {
  constructor(data) {
    super();
    this.output = "";
    this.linesTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolSuccess, a, b);
  }
  static $() {
    return ["PiGrepToolSuccess|1 output 9|2 truncation #0?|3 match_limit_reached 13?|4 lines_truncated 8", PiTruncation];
  }
};
var PiGrepToolError = class _PiGrepToolError extends __protoMessage366 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolError, a, b);
  }
  static $() {
    return ["PiGrepToolError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_find_tool_pb.js
var __protoPackage68 = "agent.v1.";
var __protoMessage367 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage68;
  }
};
var PiFindToolCall = class _PiFindToolCall extends __protoMessage367 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolCall, a, b);
  }
  static $() {
    return ["PiFindToolCall|1 args #0|2 result #1", PiFindToolArgs, PiFindToolResult];
  }
};
var PiFindToolArgs = class _PiFindToolArgs extends __protoMessage367 {
  constructor(data) {
    super();
    this.pattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolArgs, a, b);
  }
  static $() {
    return ["PiFindToolArgs|1 pattern 9|2 path 9?|3 limit 5?"];
  }
};
var PiFindToolResult = class _PiFindToolResult extends __protoMessage367 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolResult, a, b);
  }
  static $() {
    return ["PiFindToolResult|1 success #0 result|2 error #1 result", PiFindToolSuccess, PiFindToolError];
  }
};
var PiFindToolSuccess = class _PiFindToolSuccess extends __protoMessage367 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolSuccess, a, b);
  }
  static $() {
    return ["PiFindToolSuccess|1 output 9|2 truncation #0?|3 result_limit_reached 13?", PiTruncation];
  }
};
var PiFindToolError = class _PiFindToolError extends __protoMessage367 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolError, a, b);
  }
  static $() {
    return ["PiFindToolError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/pi_ls_tool_pb.js
var __protoPackage69 = "agent.v1.";
var __protoMessage368 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage69;
  }
};
var PiLsToolCall = class _PiLsToolCall extends __protoMessage368 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiLsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiLsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiLsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiLsToolCall, a, b);
  }
  static $() {
    return ["PiLsToolCall|1 args #0|2 result #1", PiLsToolArgs, PiLsToolResult];
  }
};
var PiLsToolArgs = class _PiLsToolArgs extends __protoMessage368 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiLsToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiLsToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiLsToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiLsToolArgs, a, b);
  }
  static $() {
    return ["PiLsToolArgs|1 path 9?|2 limit 5?"];
  }
};
var PiLsToolResult = class _PiLsToolResult extends __protoMessage368 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiLsToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiLsToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiLsToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiLsToolResult, a, b);
  }
  static $() {
    return ["PiLsToolResult|1 success #0 result|2 error #1 result", PiLsToolSuccess, PiLsToolError];
  }
};
var PiLsToolSuccess = class _PiLsToolSuccess extends __protoMessage368 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiLsToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiLsToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiLsToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiLsToolSuccess, a, b);
  }
  static $() {
    return ["PiLsToolSuccess|1 output 9|2 truncation #0?|3 entry_limit_reached 13?", PiTruncation];
  }
};
var PiLsToolError = class _PiLsToolError extends __protoMessage368 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiLsToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiLsToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiLsToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiLsToolError, a, b);
  }
  static $() {
    return ["PiLsToolError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/connect_scm_tool_pb.js
var __protoPackage70 = "agent.v1.";
var __protoMessage369 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage70;
  }
};
var ConnectScmArgs = class _ConnectScmArgs extends __protoMessage369 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.target = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmArgs, a, b);
  }
  static $() {
    return ["ConnectScmArgs|1 tool_call_id 9|2 github #0 target", ConnectScmGithub];
  }
};
var ConnectScmGithub = class _ConnectScmGithub extends __protoMessage369 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmGithub().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmGithub().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmGithub().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmGithub, a, b);
  }
  static $() {
    return ["ConnectScmGithub|1 repository #0|2 ghe_application 9?", ConnectScmGithubRepository];
  }
};
var ConnectScmGithubRepository = class _ConnectScmGithubRepository extends __protoMessage369 {
  constructor(data) {
    super();
    this.owner = "";
    this.repo = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmGithubRepository().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmGithubRepository().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmGithubRepository().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmGithubRepository, a, b);
  }
  static $() {
    return ["ConnectScmGithubRepository|1 owner 9|2 repo 9"];
  }
};
var ConnectScmResult = class _ConnectScmResult extends __protoMessage369 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmResult, a, b);
  }
  static $() {
    return ["ConnectScmResult|1 success #0 result|2 error #1 result|3 rejected #2 result", ConnectScmSuccess, ConnectScmError, ConnectScmRejected];
  }
};
var ConnectScmSuccess = class _ConnectScmSuccess extends __protoMessage369 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmSuccess, a, b);
  }
  static $() {
    return ["ConnectScmSuccess"];
  }
};
var ConnectScmError = class _ConnectScmError extends __protoMessage369 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmError, a, b);
  }
  static $() {
    return ["ConnectScmError|1 error 9"];
  }
};
var ConnectScmRejected = class _ConnectScmRejected extends __protoMessage369 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmRejected, a, b);
  }
  static $() {
    return ["ConnectScmRejected|1 reason 9"];
  }
};
var ConnectScmToolCall = class _ConnectScmToolCall extends __protoMessage369 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConnectScmToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConnectScmToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConnectScmToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConnectScmToolCall, a, b);
  }
  static $() {
    return ["ConnectScmToolCall|1 args #0|2 result #1", ConnectScmArgs, ConnectScmResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/conversation_search_exec_pb.js
var __protoPackage71 = "agent.v1.";
var __protoMessage370 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage71;
  }
};
var ConversationSearchSource = /* @__PURE__ */ enumType(proto3, __protoPackage71, "ConversationSearchSource", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD_CACHE"]], 1);
var ConversationSearchArgs = class _ConversationSearchArgs extends __protoMessage370 {
  constructor(data) {
    super();
    this.query = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchArgs, a, b);
  }
  static $() {
    return ["ConversationSearchArgs|1 query 9|2 tool_call_id 9|3 limit 5?"];
  }
};
var ConversationSearchResult = class _ConversationSearchResult extends __protoMessage370 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchResult, a, b);
  }
  static $() {
    return ["ConversationSearchResult|1 success #0 result|2 error #1 result", ConversationSearchSuccess, ConversationSearchError];
  }
};
var ConversationSearchSuccess = class _ConversationSearchSuccess extends __protoMessage370 {
  constructor(data) {
    super();
    this.hits = [];
    this.truncated = false;
    this.partial = false;
    this.rebuilding = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchSuccess, a, b);
  }
  static $() {
    return ["ConversationSearchSuccess|1 hits #0*|2 truncated 8|3 partial 8|4 rebuilding 8", ConversationSearchHit];
  }
};
var ConversationSearchHit = class _ConversationSearchHit extends __protoMessage370 {
  constructor(data) {
    super();
    this.conversationId = "";
    this.title = "";
    this.source = ConversationSearchSource.UNSPECIFIED;
    this.updatedAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchHit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchHit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchHit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchHit, a, b);
  }
  static $() {
    return ["ConversationSearchHit|1 conversation_id 9|2 title 9|3 source #0|4 updated_at_ms 3|5 snippet 9?", ConversationSearchSource];
  }
};
var ConversationSearchError = class _ConversationSearchError extends __protoMessage370 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSearchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSearchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSearchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSearchError, a, b);
  }
  static $() {
    return ["ConversationSearchError|1 error 9"];
  }
};

// ../packages/proto/dist/generated/agent/v1/search_conversations_tool_pb.js
var __protoPackage72 = "agent.v1.";
var __protoMessage371 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage72;
  }
};
var SearchConversationsToolCall = class _SearchConversationsToolCall extends __protoMessage371 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SearchConversationsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SearchConversationsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SearchConversationsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SearchConversationsToolCall, a, b);
  }
  static $() {
    return ["SearchConversationsToolCall|1 args #0|2 result #1", ConversationSearchArgs, ConversationSearchResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/goal_tool_pb.js
var __protoPackage73 = "agent.v1.";
var __protoMessage372 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage73;
  }
};
var GoalStatus = /* @__PURE__ */ enumType(proto3, __protoPackage73, "GoalStatus", [[0, "UNSPECIFIED"], [1, "ACTIVE"], [2, "PAUSED"], [3, "COMPLETE"], [4, "CLEARED"]], 1);
var CreateGoalArgs = class _CreateGoalArgs extends __protoMessage372 {
  constructor(data) {
    super();
    this.objective = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateGoalArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateGoalArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateGoalArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateGoalArgs, a, b);
  }
  static $() {
    return ["CreateGoalArgs|1 objective 9"];
  }
};
var CreateGoalSuccess = class _CreateGoalSuccess extends __protoMessage372 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateGoalSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateGoalSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateGoalSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateGoalSuccess, a, b);
  }
  static $() {
    return ["CreateGoalSuccess"];
  }
};
var GoalError = class _GoalError extends __protoMessage372 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GoalError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GoalError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GoalError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GoalError, a, b);
  }
  static $() {
    return ["GoalError|1 error 9"];
  }
};
var CreateGoalResult = class _CreateGoalResult extends __protoMessage372 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateGoalResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateGoalResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateGoalResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateGoalResult, a, b);
  }
  static $() {
    return ["CreateGoalResult|1 success #0 result|2 error #1 result", CreateGoalSuccess, GoalError];
  }
};
var CreateGoalToolCall = class _CreateGoalToolCall extends __protoMessage372 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateGoalToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateGoalToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateGoalToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateGoalToolCall, a, b);
  }
  static $() {
    return ["CreateGoalToolCall|1 args #0|2 result #1", CreateGoalArgs, CreateGoalResult];
  }
};
var UpdateGoalArgs = class _UpdateGoalArgs extends __protoMessage372 {
  constructor(data) {
    super();
    this.status = GoalStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateGoalArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateGoalArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateGoalArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateGoalArgs, a, b);
  }
  static $() {
    return ["UpdateGoalArgs|1 status #0", GoalStatus];
  }
};
var UpdateGoalSuccess = class _UpdateGoalSuccess extends __protoMessage372 {
  constructor(data) {
    super();
    this.status = GoalStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateGoalSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateGoalSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateGoalSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateGoalSuccess, a, b);
  }
  static $() {
    return ["UpdateGoalSuccess|1 status #0", GoalStatus];
  }
};
var UpdateGoalResult = class _UpdateGoalResult extends __protoMessage372 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateGoalResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateGoalResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateGoalResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateGoalResult, a, b);
  }
  static $() {
    return ["UpdateGoalResult|1 success #0 result|2 error #1 result", UpdateGoalSuccess, GoalError];
  }
};
var UpdateGoalToolCall = class _UpdateGoalToolCall extends __protoMessage372 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdateGoalToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdateGoalToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdateGoalToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdateGoalToolCall, a, b);
  }
  static $() {
    return ["UpdateGoalToolCall|1 args #0|2 result #1", UpdateGoalArgs, UpdateGoalResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/adopt_tool_pb.js
var __protoPackage74 = "agent.v1.";
var __protoMessage373 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage74;
  }
};
var AdoptOutcome = /* @__PURE__ */ enumType(proto3, __protoPackage74, "AdoptOutcome", [[0, "UNSPECIFIED"], [1, "ALREADY_PARENTED"], [2, "EDGE_ONLY"], [3, "STORE_IMPORT_COMPLETED"]], 1);
var AdoptArgs = class _AdoptArgs extends __protoMessage373 {
  constructor(data) {
    super();
    this.sourceAgentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AdoptArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AdoptArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AdoptArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AdoptArgs, a, b);
  }
  static $() {
    return ["AdoptArgs|1 source_agent_id 9"];
  }
};
var AdoptResult = class _AdoptResult extends __protoMessage373 {
  constructor(data) {
    super();
    this.sourceAgentId = "";
    this.targetAgentId = "";
    this.projectRootId = "";
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AdoptResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AdoptResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AdoptResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AdoptResult, a, b);
  }
  static $() {
    return ["AdoptResult|1 source_agent_id 9|2 target_agent_id 9|3 project_root_id 9|4 success #0 result|5 error 9 result", AdoptOutcome];
  }
};
var AdoptToolCall = class _AdoptToolCall extends __protoMessage373 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AdoptToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AdoptToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AdoptToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AdoptToolCall, a, b);
  }
  static $() {
    return ["AdoptToolCall|1 args #0|2 result #1", AdoptArgs, AdoptResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/coordinator_tools_pb.js
var __protoPackage75 = "agent.v1.";
var __protoMessage374 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage75;
  }
};
var CreateAgentPlacementApprovalState = /* @__PURE__ */ enumType(proto3, __protoPackage75, "CreateAgentPlacementApprovalState", [[0, "UNSPECIFIED"], [1, "REQUIRED"], [2, "DENIED"]], 1);
var GetAgentStatusArgs = class _GetAgentStatusArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusArgs, a, b);
  }
  static $() {
    return ["GetAgentStatusArgs|1 tool_call_id 9|2 agent_ids 9*"];
  }
};
var GetAgentStatusWorker = class _GetAgentStatusWorker extends __protoMessage374 {
  constructor(data) {
    super();
    this.bcId = "";
    this.name = "";
    this.lifecycle = "";
    this.turnInFlight = false;
    this.lastTerminalTurnStatus = "";
    this.prUrl = "";
    this.lastActivityAtMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusWorker().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusWorker().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusWorker().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusWorker, a, b);
  }
  static $() {
    return ["GetAgentStatusWorker|1 bc_id 9|2 name 9|3 lifecycle 9|4 turn_in_flight 8|5 last_terminal_turn_status 9|6 pr_url 9|7 last_activity_at_ms 4"];
  }
};
var GetAgentStatusSuccess = class _GetAgentStatusSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.workers = [];
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusSuccess, a, b);
  }
  static $() {
    return ["GetAgentStatusSuccess|1 workers #0*|2 message 9", GetAgentStatusWorker];
  }
};
var GetAgentStatusError = class _GetAgentStatusError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusError, a, b);
  }
  static $() {
    return ["GetAgentStatusError|1 error 9"];
  }
};
var GetAgentStatusResult = class _GetAgentStatusResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusResult, a, b);
  }
  static $() {
    return ["GetAgentStatusResult|1 success #0 result|2 error #1 result", GetAgentStatusSuccess, GetAgentStatusError];
  }
};
var GetAgentStatusToolCall = class _GetAgentStatusToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetAgentStatusToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetAgentStatusToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetAgentStatusToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetAgentStatusToolCall, a, b);
  }
  static $() {
    return ["GetAgentStatusToolCall|1 args #0|2 result #1", GetAgentStatusArgs, GetAgentStatusResult];
  }
};
var SendToAgentArgs = class _SendToAgentArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentId = "";
    this.message = "";
    this.delivery = "";
    this.title = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentArgs, a, b);
  }
  static $() {
    return ["SendToAgentArgs|1 tool_call_id 9|2 agent_id 9|3 message 9|4 delivery 9|5 title 9"];
  }
};
var SendToAgentSuccess = class _SendToAgentSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.workerBcId = "";
    this.deliveredAs = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentSuccess, a, b);
  }
  static $() {
    return ["SendToAgentSuccess|1 worker_bc_id 9|2 delivered_as 9|3 message 9"];
  }
};
var SendToAgentError = class _SendToAgentError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentError, a, b);
  }
  static $() {
    return ["SendToAgentError|1 error 9"];
  }
};
var SendToAgentResult = class _SendToAgentResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentResult, a, b);
  }
  static $() {
    return ["SendToAgentResult|1 success #0 result|2 error #1 result", SendToAgentSuccess, SendToAgentError];
  }
};
var SendToAgentToolCall = class _SendToAgentToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToAgentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToAgentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToAgentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToAgentToolCall, a, b);
  }
  static $() {
    return ["SendToAgentToolCall|1 args #0|2 result #1", SendToAgentArgs, SendToAgentResult];
  }
};
var ReadAgentTranscriptArgs = class _ReadAgentTranscriptArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentId = "";
    this.mode = "";
    this.maxTurns = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptArgs, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptArgs|1 tool_call_id 9|2 agent_id 9|3 mode 9|4 max_turns 13"];
  }
};
var ReadAgentTranscriptSuccess = class _ReadAgentTranscriptSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.transcript = "";
    this.truncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptSuccess, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptSuccess|1 transcript 9|2 truncated 8"];
  }
};
var ReadAgentTranscriptError = class _ReadAgentTranscriptError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptError, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptError|1 error 9"];
  }
};
var ReadAgentTranscriptResult = class _ReadAgentTranscriptResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptResult, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptResult|1 success #0 result|2 error #1 result", ReadAgentTranscriptSuccess, ReadAgentTranscriptError];
  }
};
var ReadAgentTranscriptToolCall = class _ReadAgentTranscriptToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadAgentTranscriptToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadAgentTranscriptToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadAgentTranscriptToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadAgentTranscriptToolCall, a, b);
  }
  static $() {
    return ["ReadAgentTranscriptToolCall|1 args #0|2 result #1", ReadAgentTranscriptArgs, ReadAgentTranscriptResult];
  }
};
var CreateAgentArgs = class _CreateAgentArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.prompt = "";
    this.labels = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentArgs, a, b);
  }
  static $() {
    return ["CreateAgentArgs|1 tool_call_id 9|2 prompt 9|3 name 9?|4 model 9?|5 base_branch 9?|6 machine_type 9?|7 worker_id 9?|8 pool 9?|9 labels 9,9|10 environment_build_id 9?"];
  }
};
var CreateAgentSuccess = class _CreateAgentSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.agentId = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentSuccess, a, b);
  }
  static $() {
    return ["CreateAgentSuccess|1 agent_id 9|2 message 9"];
  }
};
var CreateAgentError = class _CreateAgentError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentError, a, b);
  }
  static $() {
    return ["CreateAgentError|1 error 9|2 placement_approval_state #0?", CreateAgentPlacementApprovalState];
  }
};
var CreateAgentResult = class _CreateAgentResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentResult, a, b);
  }
  static $() {
    return ["CreateAgentResult|1 success #0 result|2 error #1 result", CreateAgentSuccess, CreateAgentError];
  }
};
var CreateAgentToolCall = class _CreateAgentToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreateAgentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreateAgentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreateAgentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreateAgentToolCall, a, b);
  }
  static $() {
    return ["CreateAgentToolCall|1 args #0|2 result #1", CreateAgentArgs, CreateAgentResult];
  }
};
var StopAgentArgs = class _StopAgentArgs extends __protoMessage374 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.agentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentArgs, a, b);
  }
  static $() {
    return ["StopAgentArgs|1 tool_call_id 9|2 agent_id 9"];
  }
};
var StopAgentSuccess = class _StopAgentSuccess extends __protoMessage374 {
  constructor(data) {
    super();
    this.workerBcId = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentSuccess, a, b);
  }
  static $() {
    return ["StopAgentSuccess|1 worker_bc_id 9|2 message 9"];
  }
};
var StopAgentError = class _StopAgentError extends __protoMessage374 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentError, a, b);
  }
  static $() {
    return ["StopAgentError|1 error 9"];
  }
};
var StopAgentResult = class _StopAgentResult extends __protoMessage374 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentResult, a, b);
  }
  static $() {
    return ["StopAgentResult|1 success #0 result|2 error #1 result", StopAgentSuccess, StopAgentError];
  }
};
var StopAgentToolCall = class _StopAgentToolCall extends __protoMessage374 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StopAgentToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StopAgentToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StopAgentToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StopAgentToolCall, a, b);
  }
  static $() {
    return ["StopAgentToolCall|1 args #0|2 result #1", StopAgentArgs, StopAgentResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/get_pr_code_tour_tool_pb.js
var __protoPackage76 = "agent.v1.";
var __protoMessage375 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage76;
  }
};
var GetPrCodeTourArgs = class _GetPrCodeTourArgs extends __protoMessage375 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetPrCodeTourArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetPrCodeTourArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetPrCodeTourArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetPrCodeTourArgs, a, b);
  }
  static $() {
    return ["GetPrCodeTourArgs|1 tool_call_id 9|2 revision_id 9?"];
  }
};
var PrCodeTourRevisionSnapshot = class _PrCodeTourRevisionSnapshot extends __protoMessage375 {
  constructor(data) {
    super();
    this.revisionId = "";
    this.status = "";
    this.headSha = "";
    this.feedback = "";
    this.updatedAtMs = protoInt64.zero;
    this.isCurrent = false;
    this.markdown = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PrCodeTourRevisionSnapshot().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PrCodeTourRevisionSnapshot().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PrCodeTourRevisionSnapshot().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PrCodeTourRevisionSnapshot, a, b);
  }
  static $() {
    return ["PrCodeTourRevisionSnapshot|1 revision_id 9|2 status 9|3 head_sha 9|4 feedback 9|5 updated_at_ms 3|6 is_current 8|7 markdown 9"];
  }
};
var GetPrCodeTourSuccess = class _GetPrCodeTourSuccess extends __protoMessage375 {
  constructor(data) {
    super();
    this.revisions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetPrCodeTourSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetPrCodeTourSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetPrCodeTourSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetPrCodeTourSuccess, a, b);
  }
  static $() {
    return ["GetPrCodeTourSuccess|1 revisions #0*", PrCodeTourRevisionSnapshot];
  }
};
var GetPrCodeTourError = class _GetPrCodeTourError extends __protoMessage375 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetPrCodeTourError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetPrCodeTourError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetPrCodeTourError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetPrCodeTourError, a, b);
  }
  static $() {
    return ["GetPrCodeTourError|1 error 9"];
  }
};
var GetPrCodeTourResult = class _GetPrCodeTourResult extends __protoMessage375 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetPrCodeTourResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetPrCodeTourResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetPrCodeTourResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetPrCodeTourResult, a, b);
  }
  static $() {
    return ["GetPrCodeTourResult|1 success #0 result|2 error #1 result", GetPrCodeTourSuccess, GetPrCodeTourError];
  }
};
var GetPrCodeTourToolCall = class _GetPrCodeTourToolCall extends __protoMessage375 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GetPrCodeTourToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GetPrCodeTourToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GetPrCodeTourToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GetPrCodeTourToolCall, a, b);
  }
  static $() {
    return ["GetPrCodeTourToolCall|1 args #0|2 result #1", GetPrCodeTourArgs, GetPrCodeTourResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/cloud_canvas_tool_pb.js
var __protoPackage77 = "agent.v1.";
var __protoMessage376 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage77;
  }
};
var WriteCanvasFailReason = /* @__PURE__ */ enumType(proto3, __protoPackage77, "WriteCanvasFailReason", [[0, "UNSPECIFIED"], [1, "TYPECHECK_FAILED"], [2, "COMPILE_FAILED"], [3, "TOO_LARGE"], [4, "UNAVAILABLE"], [5, "NOT_FOUND"], [6, "REFUSED"]], 1);
var ReadCanvasFailReason = /* @__PURE__ */ enumType(proto3, __protoPackage77, "ReadCanvasFailReason", [[0, "UNSPECIFIED"], [1, "NOT_FOUND"], [2, "UNAVAILABLE"], [3, "REFUSED"], [4, "INVALID_REFERENCE"]], 1);
var CloudCanvasToolDiagnosticPosition = class _CloudCanvasToolDiagnosticPosition extends __protoMessage376 {
  constructor(data) {
    super();
    this.line = 0;
    this.character = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudCanvasToolDiagnosticPosition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudCanvasToolDiagnosticPosition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudCanvasToolDiagnosticPosition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudCanvasToolDiagnosticPosition, a, b);
  }
  static $() {
    return ["CloudCanvasToolDiagnosticPosition|1 line 5|2 character 5"];
  }
};
var CloudCanvasToolDiagnosticRange = class _CloudCanvasToolDiagnosticRange extends __protoMessage376 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudCanvasToolDiagnosticRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudCanvasToolDiagnosticRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudCanvasToolDiagnosticRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudCanvasToolDiagnosticRange, a, b);
  }
  static $() {
    return ["CloudCanvasToolDiagnosticRange|1 start #0|2 end #0", CloudCanvasToolDiagnosticPosition];
  }
};
var CloudCanvasToolDiagnostic = class _CloudCanvasToolDiagnostic extends __protoMessage376 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudCanvasToolDiagnostic().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudCanvasToolDiagnostic().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudCanvasToolDiagnostic().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudCanvasToolDiagnostic, a, b);
  }
  static $() {
    return ["CloudCanvasToolDiagnostic|1 message 9|2 code 9?|3 severity 5?|4 range #0?", CloudCanvasToolDiagnosticRange];
  }
};
var WriteCanvasArgs = class _WriteCanvasArgs extends __protoMessage376 {
  constructor(data) {
    super();
    this.contents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasArgs, a, b);
  }
  static $() {
    return ["WriteCanvasArgs|1 contents 9|2 canvas_id 9?|3 title 9?"];
  }
};
var WriteCanvasSuccess = class _WriteCanvasSuccess extends __protoMessage376 {
  constructor(data) {
    super();
    this.canvasId = "";
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasSuccess, a, b);
  }
  static $() {
    return ["WriteCanvasSuccess|1 canvas_id 9|2 title 9?|3 url 9"];
  }
};
var WriteCanvasFailure = class _WriteCanvasFailure extends __protoMessage376 {
  constructor(data) {
    super();
    this.reason = WriteCanvasFailReason.UNSPECIFIED;
    this.diagnostics = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasFailure, a, b);
  }
  static $() {
    return ["WriteCanvasFailure|1 reason #0|2 diagnostics #1*|3 detail 9?", WriteCanvasFailReason, CloudCanvasToolDiagnostic];
  }
};
var WriteCanvasResult = class _WriteCanvasResult extends __protoMessage376 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasResult, a, b);
  }
  static $() {
    return ["WriteCanvasResult|1 success #0 result|2 failure #1 result", WriteCanvasSuccess, WriteCanvasFailure];
  }
};
var WriteCanvasToolCall = class _WriteCanvasToolCall extends __protoMessage376 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasToolCall, a, b);
  }
  static $() {
    return ["WriteCanvasToolCall|1 args #0|2 result #1", WriteCanvasArgs, WriteCanvasResult];
  }
};
var ReadCanvasArgs = class _ReadCanvasArgs extends __protoMessage376 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasArgs, a, b);
  }
  static $() {
    return ["ReadCanvasArgs|1 canvas_id 9?|2 url 9?"];
  }
};
var ReadCanvasSuccess = class _ReadCanvasSuccess extends __protoMessage376 {
  constructor(data) {
    super();
    this.canvasId = "";
    this.url = "";
    this.source = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasSuccess, a, b);
  }
  static $() {
    return ["ReadCanvasSuccess|1 canvas_id 9|2 title 9?|3 url 9|4 source 9"];
  }
};
var ReadCanvasFailure = class _ReadCanvasFailure extends __protoMessage376 {
  constructor(data) {
    super();
    this.reason = ReadCanvasFailReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasFailure, a, b);
  }
  static $() {
    return ["ReadCanvasFailure|1 reason #0|2 detail 9?", ReadCanvasFailReason];
  }
};
var ReadCanvasResult = class _ReadCanvasResult extends __protoMessage376 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasResult, a, b);
  }
  static $() {
    return ["ReadCanvasResult|1 success #0 result|2 failure #1 result", ReadCanvasSuccess, ReadCanvasFailure];
  }
};
var ReadCanvasToolCall = class _ReadCanvasToolCall extends __protoMessage376 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasToolCall, a, b);
  }
  static $() {
    return ["ReadCanvasToolCall|1 args #0|2 result #1", ReadCanvasArgs, ReadCanvasResult];
  }
};

// ../packages/proto/dist/generated/agent/v1/cursor_packages_pb.js
var __protoPackage78 = "agent.v1.";
var PackageType = /* @__PURE__ */ enumType(proto3, __protoPackage78, "PackageType", [[0, "UNSPECIFIED"], [1, "CURSOR_PROJECT"], [2, "CURSOR_PERSONAL"], [3, "CLAUDE_SKILL"], [4, "CLAUDE_PLUGIN"]], 1);

// ../packages/proto/dist/generated/agent/v1/agent_skills_pb.js
var __protoPackage79 = "agent.v1.";
var __protoMessage377 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage79;
  }
};
var AgentSkill = class _AgentSkill extends __protoMessage377 {
  constructor(data) {
    super();
    this.fullPath = "";
    this.content = "";
    this.description = "";
    this.environments = [];
    this.disabledEnvironments = [];
    this.disableModelInvocation = false;
    this.globs = [];
    this.scopedTo = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AgentSkill().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AgentSkill().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AgentSkill().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AgentSkill, a, b);
  }
  static $() {
    return ["AgentSkill|1 full_path 9|2 content 9|3 description 9|4 parse_error 9?|5 environments 9*|6 disabled_environments 9*|7 git_remote_origin 9?|8 disable_model_invocation 8|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 globs 9*|14 scoped_to 9*"];
  }
};

// ../packages/proto/dist/generated/agent/v1/request_context_exec_pb.js
var __protoPackage80 = "agent.v1.";
var __protoMessage378 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage80;
  }
};
var SkillDescriptor = class _SkillDescriptor extends __protoMessage378 {
  constructor(data) {
    super();
    this.name = "";
    this.description = "";
    this.folderPath = "";
    this.enabled = false;
    this.readmeFilePath = "";
    this.packageType = PackageType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SkillDescriptor().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SkillDescriptor().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SkillDescriptor().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SkillDescriptor, a, b);
  }
  static $() {
    return ["SkillDescriptor|1 name 9|2 description 9|3 folder_path 9|4 enabled 8|5 parse_error 9?|6 readme_file_path 9|7 package_type #0", PackageType];
  }
};
var SkillOptions = class _SkillOptions extends __protoMessage378 {
  constructor(data) {
    super();
    this.skillDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SkillOptions().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SkillOptions().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SkillOptions().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SkillOptions, a, b);
  }
  static $() {
    return ["SkillOptions|1 skill_descriptors #0*", SkillDescriptor];
  }
};
var RequestContextRulesPart = class _RequestContextRulesPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.rules = [];
    this.nonFileRules = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextRulesPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextRulesPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextRulesPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextRulesPart, a, b);
  }
  static $() {
    return ["RequestContextRulesPart|1 rules #0*|2 non_file_rules #0*|3 cloud_rule 9?", CursorRule];
  }
};
var RequestContextSkillsPart = class _RequestContextSkillsPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.agentSkills = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextSkillsPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextSkillsPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextSkillsPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextSkillsPart, a, b);
  }
  static $() {
    return ["RequestContextSkillsPart|1 agent_skills #0*|2 skill_options #1?", AgentSkill, SkillOptions];
  }
};
var RequestContextSubagentsPart = class _RequestContextSubagentsPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.customSubagents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextSubagentsPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextSubagentsPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextSubagentsPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextSubagentsPart, a, b);
  }
  static $() {
    return ["RequestContextSubagentsPart|1 custom_subagents #0*", CustomSubagent];
  }
};
var RequestContextMcpsPart = class _RequestContextMcpsPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.tools = [];
    this.mcpInstructions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextMcpsPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextMcpsPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextMcpsPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextMcpsPart, a, b);
  }
  static $() {
    return ["RequestContextMcpsPart|1 tools #0*|2 mcp_instructions #1*|3 mcp_file_system_options #2?|4 mcp_meta_tool_options #3?", McpToolDefinition, McpInstructions, McpFileSystemOptions, McpMetaToolOptions];
  }
};

// ../packages/proto/dist/generated/agent/v1/selected_context_pb.js
var __protoPackage81 = "agent.v1.";
var __protoMessage379 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage81;
  }
};
var SelectedPluginCapabilityType = /* @__PURE__ */ enumType(proto3, __protoPackage81, "SelectedPluginCapabilityType", [[0, "UNSPECIFIED"], [1, "COMMAND"], [2, "SKILL"], [3, "SUBAGENT"]], 1);
var SelectedImage = class _SelectedImage extends __protoMessage379 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    this.uuid = "";
    this.path = "";
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedImage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedImage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedImage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedImage, a, b);
  }
  static $() {
    return ["SelectedImage|1 blob_id 12 data_or_blob_id|8 data 12 data_or_blob_id|9 blob_id_with_data #0 data_or_blob_id|10 prompt_upload_ref #1 data_or_blob_id|2 uuid 9|3 path 9|4 dimension #2|7 mime_type 9", SelectedImage_BlobIdWithData, PromptUploadRef, SelectedImage_Dimension];
  }
};
var SelectedImage_BlobIdWithData = class _SelectedImage_BlobIdWithData extends __protoMessage379 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.data = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedImage_BlobIdWithData().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedImage_BlobIdWithData().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedImage_BlobIdWithData().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedImage_BlobIdWithData, a, b);
  }
  static $() {
    return ["SelectedImage.BlobIdWithData|1 blob_id 12|2 data 12"];
  }
};
var SelectedImage_Dimension = class _SelectedImage_Dimension extends __protoMessage379 {
  constructor(data) {
    super();
    this.width = 0;
    this.height = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedImage_Dimension().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedImage_Dimension().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedImage_Dimension().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedImage_Dimension, a, b);
  }
  static $() {
    return ["SelectedImage.Dimension|1 width 5|2 height 5"];
  }
};
var PromptUploadRef = class _PromptUploadRef extends __protoMessage379 {
  constructor(data) {
    super();
    this.uploadId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptUploadRef().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptUploadRef().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptUploadRef().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptUploadRef, a, b);
  }
  static $() {
    return ["PromptUploadRef|1 upload_id 9"];
  }
};
var SelectedDocument = class _SelectedDocument extends __protoMessage379 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    this.uuid = "";
    this.filename = "";
    this.mimeType = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedDocument().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedDocument().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedDocument().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedDocument, a, b);
  }
  static $() {
    return ["SelectedDocument|1 blob_id 12 data_or_blob_id|8 data 12 data_or_blob_id|9 blob_id_with_data #0 data_or_blob_id|10 prompt_upload_ref #1 data_or_blob_id|2 uuid 9|3 filename 9|4 mime_type 9|7 path 9", SelectedDocument_BlobIdWithData, PromptUploadRef];
  }
};
var SelectedDocument_BlobIdWithData = class _SelectedDocument_BlobIdWithData extends __protoMessage379 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.data = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedDocument_BlobIdWithData().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedDocument_BlobIdWithData().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedDocument_BlobIdWithData().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedDocument_BlobIdWithData, a, b);
  }
  static $() {
    return ["SelectedDocument.BlobIdWithData|1 blob_id 12|2 data 12"];
  }
};
var SelectedVideo = class _SelectedVideo extends __protoMessage379 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    this.uuid = "";
    this.path = "";
    this.mimeType = "";
    this.filename = "";
    this.materializeToFilesystem = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedVideo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedVideo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedVideo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedVideo, a, b);
  }
  static $() {
    return ["SelectedVideo|1 blob_id 12 data_or_blob_id|8 data 12 data_or_blob_id|9 blob_id_with_data #0 data_or_blob_id|11 signed_url #1 data_or_blob_id|2 uuid 9|3 path 9|4 fps 2?|7 mime_type 9|10 filename 9|12 materialize_to_filesystem 8", SelectedVideo_BlobIdWithData, SelectedVideo_SignedUrl];
  }
};
var SelectedVideo_BlobIdWithData = class _SelectedVideo_BlobIdWithData extends __protoMessage379 {
  constructor(data) {
    super();
    this.blobId = new Uint8Array(0);
    this.data = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedVideo_BlobIdWithData().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedVideo_BlobIdWithData().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedVideo_BlobIdWithData().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedVideo_BlobIdWithData, a, b);
  }
  static $() {
    return ["SelectedVideo.BlobIdWithData|1 blob_id 12|2 data 12"];
  }
};
var SelectedVideo_SignedUrl = class _SelectedVideo_SignedUrl extends __protoMessage379 {
  constructor(data) {
    super();
    this.url = "";
    this.key = "";
    this.expiresAtUnixMs = protoInt64.zero;
    this.refreshAfterUnixMs = protoInt64.zero;
    this.conversationId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedVideo_SignedUrl().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedVideo_SignedUrl().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedVideo_SignedUrl().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedVideo_SignedUrl, a, b);
  }
  static $() {
    return ["SelectedVideo.SignedUrl|1 url 9|2 key 9|3 expires_at_unix_ms 3|4 refresh_after_unix_ms 3|5 conversation_id 9"];
  }
};
var ExtraContextEntry = class _ExtraContextEntry extends __protoMessage379 {
  constructor(data) {
    super();
    this.dataOrBlobId = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ExtraContextEntry().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ExtraContextEntry().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ExtraContextEntry().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ExtraContextEntry, a, b);
  }
  static $() {
    return ["ExtraContextEntry|1 data 9 data_or_blob_id|2 blob_id 12 data_or_blob_id"];
  }
};
var SelectedFile = class _SelectedFile extends __protoMessage379 {
  constructor(data) {
    super();
    this.content = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedFile().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedFile().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedFile().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedFile, a, b);
  }
  static $() {
    return ["SelectedFile|1 content 9|2 path 9|3 relative_path 9?"];
  }
};
var SelectedCodeSelection = class _SelectedCodeSelection extends __protoMessage379 {
  constructor(data) {
    super();
    this.content = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedCodeSelection().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedCodeSelection().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedCodeSelection().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedCodeSelection, a, b);
  }
  static $() {
    return ["SelectedCodeSelection|1 content 9|2 path 9|3 relative_path 9?|4 range #0", Range];
  }
};
var SelectedTerminal = class _SelectedTerminal extends __protoMessage379 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedTerminal().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedTerminal().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedTerminal().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedTerminal, a, b);
  }
  static $() {
    return ["SelectedTerminal|1 content 9|2 title 9?|3 path 9?"];
  }
};
var SelectedTerminalSelection = class _SelectedTerminalSelection extends __protoMessage379 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedTerminalSelection().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedTerminalSelection().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedTerminalSelection().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedTerminalSelection, a, b);
  }
  static $() {
    return ["SelectedTerminalSelection|1 content 9|2 title 9?|3 path 9?|4 range #0", Range];
  }
};
var SelectedFolder = class _SelectedFolder extends __protoMessage379 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedFolder().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedFolder().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedFolder().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedFolder, a, b);
  }
  static $() {
    return ["SelectedFolder|1 path 9|2 relative_path 9?|3 directory_tree #0", LsDirectoryTreeNode];
  }
};
var SelectedExternalLink = class _SelectedExternalLink extends __protoMessage379 {
  constructor(data) {
    super();
    this.url = "";
    this.uuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedExternalLink().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedExternalLink().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedExternalLink().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedExternalLink, a, b);
  }
  static $() {
    return ["SelectedExternalLink|1 url 9|2 uuid 9|3 pdf_content 9?|4 is_pdf 8?|5 filename 9?|6 blob_id 12?"];
  }
};
var SelectedCursorRule = class _SelectedCursorRule extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedCursorRule().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedCursorRule().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedCursorRule().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedCursorRule, a, b);
  }
  static $() {
    return ["SelectedCursorRule|1 rule #0", CursorRule];
  }
};
var SelectedGitDiff = class _SelectedGitDiff extends __protoMessage379 {
  constructor(data) {
    super();
    this.content = "";
    this.fullContentLengthCharCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitDiff().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitDiff().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitDiff().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitDiff, a, b);
  }
  static $() {
    return ["SelectedGitDiff|1 content 9|2 full_content_length_char_count 5"];
  }
};
var SelectedGitDiffFromBranchToMain = class _SelectedGitDiffFromBranchToMain extends __protoMessage379 {
  constructor(data) {
    super();
    this.content = "";
    this.fullContentLengthCharCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitDiffFromBranchToMain().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitDiffFromBranchToMain().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitDiffFromBranchToMain().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitDiffFromBranchToMain, a, b);
  }
  static $() {
    return ["SelectedGitDiffFromBranchToMain|1 content 9|2 full_content_length_char_count 5"];
  }
};
var SelectedGitCommit = class _SelectedGitCommit extends __protoMessage379 {
  constructor(data) {
    super();
    this.sha = "";
    this.message = "";
    this.diff = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitCommit().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitCommit().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitCommit().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitCommit, a, b);
  }
  static $() {
    return ["SelectedGitCommit|1 sha 9|2 message 9|3 description 9?|4 diff 9"];
  }
};
var SelectedPullRequest = class _SelectedPullRequest extends __protoMessage379 {
  constructor(data) {
    super();
    this.number = 0;
    this.url = "";
    this.folderPath = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedPullRequest().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedPullRequest().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedPullRequest().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedPullRequest, a, b);
  }
  static $() {
    return ["SelectedPullRequest|1 number 5|2 url 9|3 title 9?|4 folder_path 9|5 summary_json 9?|6 description 9?|7 blob_id 12?"];
  }
};
var SelectedGitPRDiffSelection = class _SelectedGitPRDiffSelection extends __protoMessage379 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.filePath = "";
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitPRDiffSelection().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitPRDiffSelection().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitPRDiffSelection().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitPRDiffSelection, a, b);
  }
  static $() {
    return ["SelectedGitPRDiffSelection|1 pr_url 9|2 file_path 9|3 start_line 5|4 end_line 5|5 diff_content 9?|6 blob_id 12?"];
  }
};
var SelectedPluginCapabilityRef = class _SelectedPluginCapabilityRef extends __protoMessage379 {
  constructor(data) {
    super();
    this.pluginId = "";
    this.capabilityType = SelectedPluginCapabilityType.UNSPECIFIED;
    this.sourcePath = "";
    this.snapshotToken = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedPluginCapabilityRef().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedPluginCapabilityRef().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedPluginCapabilityRef().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedPluginCapabilityRef, a, b);
  }
  static $() {
    return ["SelectedPluginCapabilityRef|1 plugin_id 9|2 capability_type #0|3 source_path 9|4 snapshot_token 9|5 resolved_commit_sha 9?", SelectedPluginCapabilityType];
  }
};
var SelectedCursorCommand = class _SelectedCursorCommand extends __protoMessage379 {
  constructor(data) {
    super();
    this.name = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedCursorCommand().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedCursorCommand().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedCursorCommand().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedCursorCommand, a, b);
  }
  static $() {
    return ["SelectedCursorCommand|1 name 9|2 content 9|3 plugin_capability #0?|4 full_path 9?|5 display_name 9?", SelectedPluginCapabilityRef];
  }
};
var SelectedDocumentation = class _SelectedDocumentation extends __protoMessage379 {
  constructor(data) {
    super();
    this.docId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedDocumentation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedDocumentation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedDocumentation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedDocumentation, a, b);
  }
  static $() {
    return ["SelectedDocumentation|1 doc_id 9|2 name 9"];
  }
};
var SelectedPastChat = class _SelectedPastChat extends __protoMessage379 {
  constructor(data) {
    super();
    this.agentId = "";
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedPastChat().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedPastChat().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedPastChat().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedPastChat, a, b);
  }
  static $() {
    return ["SelectedPastChat|1 agent_id 9|2 name 9"];
  }
};
var RecentAgent = class _RecentAgent extends __protoMessage379 {
  constructor(data) {
    super();
    this.name = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecentAgent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecentAgent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecentAgent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecentAgent, a, b);
  }
  static $() {
    return ["RecentAgent|1 name 9|2 path 9|3 overview 9?"];
  }
};
var RecentAgentsContext = class _RecentAgentsContext extends __protoMessage379 {
  constructor(data) {
    super();
    this.recentAgents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecentAgentsContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecentAgentsContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecentAgentsContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecentAgentsContext, a, b);
  }
  static $() {
    return ["RecentAgentsContext|1 recent_agents #0*", RecentAgent];
  }
};
var CallFrame = class _CallFrame extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CallFrame().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CallFrame().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CallFrame().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CallFrame, a, b);
  }
  static $() {
    return ["CallFrame|1 function_name 9?|2 url 9?|3 line_number 5?|4 column_number 5?"];
  }
};
var StackTrace = class _StackTrace extends __protoMessage379 {
  constructor(data) {
    super();
    this.callFrames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StackTrace().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StackTrace().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StackTrace().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StackTrace, a, b);
  }
  static $() {
    return ["StackTrace|1 call_frames #0*|2 raw_stack_trace 9?", CallFrame];
  }
};
var SelectedConsoleLog = class _SelectedConsoleLog extends __protoMessage379 {
  constructor(data) {
    super();
    this.message = "";
    this.timestamp = 0;
    this.level = "";
    this.clientName = "";
    this.sessionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedConsoleLog().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedConsoleLog().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedConsoleLog().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedConsoleLog, a, b);
  }
  static $() {
    return ["SelectedConsoleLog|1 message 9|2 timestamp 1|3 level 9|4 client_name 9|5 session_id 9|6 stack_trace #0?|7 object_data_json 9?", StackTrace];
  }
};
var SelectedUIElement = class _SelectedUIElement extends __protoMessage379 {
  constructor(data) {
    super();
    this.element = "";
    this.xpath = "";
    this.textContent = "";
    this.extra = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedUIElement().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedUIElement().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedUIElement().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedUIElement, a, b);
  }
  static $() {
    return ["SelectedUIElement|1 element 9|2 xpath 9|3 text_content 9|4 extra 9|5 component 9?|6 component_props_json 9?"];
  }
};
var SelectedSubagent = class _SelectedSubagent extends __protoMessage379 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedSubagent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedSubagent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedSubagent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedSubagent, a, b);
  }
  static $() {
    return ["SelectedSubagent|1 name 9"];
  }
};
var SelectedBrowser = class _SelectedBrowser extends __protoMessage379 {
  constructor(data) {
    super();
    this.browserId = "";
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedBrowser().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedBrowser().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedBrowser().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedBrowser, a, b);
  }
  static $() {
    return ["SelectedBrowser|1 browser_id 9|2 url 9|3 page_title 9?"];
  }
};
var SelectedAgenticGitActionCommitParams = class _SelectedAgenticGitActionCommitParams extends __protoMessage379 {
  constructor(data) {
    super();
    this.filesToCommit = [];
    this.filesToExcludeFromCommit = [];
    this.shouldStageAllChanges = false;
    this.filesToCommitWithStatus = [];
    this.filesToExcludeFromCommitWithStatus = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionCommitParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionCommitParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionCommitParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionCommitParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionCommitParams|1 files_to_commit 9*|2 files_to_exclude_from_commit 9*|3 should_stage_all_changes 8|4 create_pr_draft 8?|5 files_to_commit_with_status #0*|6 files_to_exclude_from_commit_with_status #0*", SelectedAgenticGitFileWithStatus];
  }
};
var SelectedAgenticGitActionCreateBranchParams = class _SelectedAgenticGitActionCreateBranchParams extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionCreateBranchParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionCreateBranchParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionCreateBranchParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionCreateBranchParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionCreateBranchParams"];
  }
};
var SelectedAgenticGitFileWithStatus = class _SelectedAgenticGitFileWithStatus extends __protoMessage379 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitFileWithStatus().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitFileWithStatus().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitFileWithStatus().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitFileWithStatus, a, b);
  }
  static $() {
    return ["SelectedAgenticGitFileWithStatus|1 path 9|2 status 9?"];
  }
};
var SelectedAgenticGitActionPushParams = class _SelectedAgenticGitActionPushParams extends __protoMessage379 {
  constructor(data) {
    super();
    this.filesToPush = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionPushParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionPushParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionPushParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionPushParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionPushParams|1 files_to_push 9*|2 create_pr_draft 8?"];
  }
};
var SelectedAgenticGitActionFixMergeConflictsParams = class _SelectedAgenticGitActionFixMergeConflictsParams extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionFixMergeConflictsParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionFixMergeConflictsParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionFixMergeConflictsParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionFixMergeConflictsParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionFixMergeConflictsParams|1 base_branch 9?|2 pr_url 9?"];
  }
};
var SelectedAgenticGitActionBabysitPrInCloudParams = class _SelectedAgenticGitActionBabysitPrInCloudParams extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionBabysitPrInCloudParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionBabysitPrInCloudParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionBabysitPrInCloudParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionBabysitPrInCloudParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionBabysitPrInCloudParams|1 base_branch 9?"];
  }
};
var SelectedAgenticGitActionUpdateBranchParams = class _SelectedAgenticGitActionUpdateBranchParams extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionUpdateBranchParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionUpdateBranchParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionUpdateBranchParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionUpdateBranchParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionUpdateBranchParams|1 base_branch 9?"];
  }
};
var SelectedAgenticGitActionPullLocallyParams = class _SelectedAgenticGitActionPullLocallyParams extends __protoMessage379 {
  constructor(data) {
    super();
    this.remoteBranch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitActionPullLocallyParams().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitActionPullLocallyParams().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitActionPullLocallyParams().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitActionPullLocallyParams, a, b);
  }
  static $() {
    return ["SelectedAgenticGitActionPullLocallyParams|1 remote_branch 9"];
  }
};
var SelectedAgenticGitAction = class _SelectedAgenticGitAction extends __protoMessage379 {
  constructor(data) {
    super();
    this.params = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedAgenticGitAction().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedAgenticGitAction().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedAgenticGitAction().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedAgenticGitAction, a, b);
  }
  static $() {
    return ["SelectedAgenticGitAction|2 commit_params #0 params|6 commit_and_push_params #0 params|3 push_params #1 params|7 create_pr_params #1 params|8 create_pr_with_changes_params #0 params|4 fix_merge_conflicts_params #2 params|11 babysit_pr_in_cloud_params #3 params|14 apply_locally_params #4 params|15 checkout_branch_params #4 params|12 create_branch_and_commit_params #0 params|13 create_branch_commit_and_push_params #0 params|16 update_branch_params #5 params|17 create_branch_params #6 params|5 branch_context #7?|9 path_to_template_file 9?|10 path_to_template_dir 9?", SelectedAgenticGitActionCommitParams, SelectedAgenticGitActionPushParams, SelectedAgenticGitActionFixMergeConflictsParams, SelectedAgenticGitActionBabysitPrInCloudParams, SelectedAgenticGitActionPullLocallyParams, SelectedAgenticGitActionUpdateBranchParams, SelectedAgenticGitActionCreateBranchParams, SelectedGitBranchContext];
  }
};
var SelectedGitBranchContext = class _SelectedGitBranchContext extends __protoMessage379 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedGitBranchContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedGitBranchContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedGitBranchContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedGitBranchContext, a, b);
  }
  static $() {
    return ["SelectedGitBranchContext|1 current_branch 9?|2 base_branch 9?|3 agent_branch_prefix 9?"];
  }
};
var SelectedContext = class _SelectedContext extends __protoMessage379 {
  constructor(data) {
    super();
    this.selectedImages = [];
    this.extraContext = [];
    this.extraContextEntries = [];
    this.files = [];
    this.codeSelections = [];
    this.terminals = [];
    this.terminalSelections = [];
    this.folders = [];
    this.externalLinks = [];
    this.cursorRules = [];
    this.cursorCommands = [];
    this.documentations = [];
    this.uiElements = [];
    this.consoleLogs = [];
    this.gitCommits = [];
    this.pastChats = [];
    this.gitPrDiffSelections = [];
    this.selectedPullRequests = [];
    this.selectedSubagents = [];
    this.selectedVideos = [];
    this.selectedBrowsers = [];
    this.selectedDocuments = [];
    this.selectedSkills = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelectedContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelectedContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelectedContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelectedContext, a, b);
  }
  static $() {
    return ["SelectedContext|1 selected_images #0*|2 invocation_context #1?|3 extra_context 9*|16 extra_context_entries #2*|4 files #3*|5 code_selections #4*|6 terminals #5*|7 terminal_selections #6*|8 folders #7*|9 external_links #8*|10 cursor_rules #9*|18 git_diff #10?|11 git_diff_from_branch_to_main #11?|12 cursor_commands #12*|13 documentations #13*|14 ui_elements #14*|15 console_logs #15*|17 git_commits #16*|19 past_chats #17*|20 git_pr_diff_selections #18*|21 selected_pull_requests #19*|22 selected_subagents #20*|23 selected_videos #21*|24 selected_browsers #22*|25 selected_documents #23*|26 selected_skills #24*|27 recent_agents_context #25?|34 selected_agentic_git_action #26?", SelectedImage, InvocationContext, ExtraContextEntry, SelectedFile, SelectedCodeSelection, SelectedTerminal, SelectedTerminalSelection, SelectedFolder, SelectedExternalLink, SelectedCursorRule, SelectedGitDiff, SelectedGitDiffFromBranchToMain, SelectedCursorCommand, SelectedDocumentation, SelectedUIElement, SelectedConsoleLog, SelectedGitCommit, SelectedPastChat, SelectedGitPRDiffSelection, SelectedPullRequest, SelectedSubagent, SelectedVideo, SelectedBrowser, SelectedDocument, AgentSkill, RecentAgentsContext, SelectedAgenticGitAction];
  }
};
var InvocationContext = class _InvocationContext extends __protoMessage379 {
  constructor(data) {
    super();
    this.data = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext, a, b);
  }
  static $() {
    return ["InvocationContext|1 slack_thread #0 data|2 github_pr #1 data|3 ide_state #2 data|4 microsoft_teams_thread #3 data|10 blob_id 12 data", InvocationContext_SlackThread, InvocationContext_GithubPR, InvocationContext_IdeState, InvocationContext_MicrosoftTeamsThread];
  }
};
var InvocationContext_SlackThread = class _InvocationContext_SlackThread extends __protoMessage379 {
  constructor(data) {
    super();
    this.thread = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_SlackThread().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_SlackThread().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_SlackThread().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_SlackThread, a, b);
  }
  static $() {
    return ["InvocationContext.SlackThread|1 thread 9|2 channel_name 9?|3 channel_purpose 9?|4 channel_topic 9?|5 sender_name 9?|6 sender_id 9?|7 sender_type 9?|8 is_directly_addressed 8?"];
  }
};
var InvocationContext_MicrosoftTeamsThread = class _InvocationContext_MicrosoftTeamsThread extends __protoMessage379 {
  constructor(data) {
    super();
    this.thread = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_MicrosoftTeamsThread().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_MicrosoftTeamsThread().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_MicrosoftTeamsThread().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_MicrosoftTeamsThread, a, b);
  }
  static $() {
    return ["InvocationContext.MicrosoftTeamsThread|1 thread 9|2 channel_name 9?|3 team_name 9?|4 channel_description 9?|5 team_description 9?"];
  }
};
var InvocationContext_GithubPR = class _InvocationContext_GithubPR extends __protoMessage379 {
  constructor(data) {
    super();
    this.title = "";
    this.description = "";
    this.comments = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_GithubPR().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_GithubPR().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_GithubPR().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_GithubPR, a, b);
  }
  static $() {
    return ["InvocationContext.GithubPR|1 title 9|2 description 9|3 comments 9|4 ci_failures 9?"];
  }
};
var InvocationContext_IdeState = class _InvocationContext_IdeState extends __protoMessage379 {
  constructor(data) {
    super();
    this.visibleFiles = [];
    this.recentlyViewedFiles = [];
    this.currentlyViewedPrs = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState|1 visible_files #0*|2 recently_viewed_files #0*|3 currently_viewed_prs #1*", InvocationContext_IdeState_File, InvocationContext_IdeState_ViewedPullRequest];
  }
};
var InvocationContext_IdeState_File = class _InvocationContext_IdeState_File extends __protoMessage379 {
  constructor(data) {
    super();
    this.path = "";
    this.totalLines = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState_File().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState_File().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState_File().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState_File, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState.File|1 path 9|2 relative_path 9?|3 cursor_position #0?|4 total_lines 5|5 active_command 9?", InvocationContext_IdeState_File_CursorPosition];
  }
};
var InvocationContext_IdeState_File_CursorPosition = class _InvocationContext_IdeState_File_CursorPosition extends __protoMessage379 {
  constructor(data) {
    super();
    this.line = 0;
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState_File_CursorPosition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState_File_CursorPosition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState_File_CursorPosition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState_File_CursorPosition, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState.File.CursorPosition|1 line 5|2 text 9"];
  }
};
var InvocationContext_IdeState_ViewedPullRequest = class _InvocationContext_IdeState_ViewedPullRequest extends __protoMessage379 {
  constructor(data) {
    super();
    this.number = 0;
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _InvocationContext_IdeState_ViewedPullRequest().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _InvocationContext_IdeState_ViewedPullRequest().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _InvocationContext_IdeState_ViewedPullRequest().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_InvocationContext_IdeState_ViewedPullRequest, a, b);
  }
  static $() {
    return ["InvocationContext.IdeState.ViewedPullRequest|1 number 5|2 url 9|3 title 9?|4 folder_path 9?|5 summary_json 9?|6 description 9?"];
  }
};

// ../packages/proto/dist/generated/agent/v1/agent_pb.js
var __protoPackage82 = "agent.v1.";
var __protoMessage380 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage82;
  }
};
var AgentMode = /* @__PURE__ */ enumType(proto3, __protoPackage82, "AgentMode", [[0, "UNSPECIFIED"], [1, "AGENT"], [2, "ASK"], [3, "PLAN"], [4, "DEBUG"], [5, "TRIAGE"], [6, "PROJECT"], [7, "MULTITASK"], [8, "CUSTOM"]], 1);
var SubagentRunStatus = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SubagentRunStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "BACKGROUNDED"], [3, "SUCCESS"], [4, "ERROR"], [5, "ABORTED"]], 1);
var SubagentDispatchTool = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SubagentDispatchTool", [[0, "UNSPECIFIED"], [1, "TASK"], [2, "CREATE_AGENT"], [3, "SEND_TO_AGENT"]], 1);
var CustomModeSource = /* @__PURE__ */ enumType(proto3, __protoPackage82, "CustomModeSource", [[0, "UNSPECIFIED"], [1, "AGENT_SKILL"], [2, "PLUGIN_SKILL"], [3, "REPO_SKILL"], [4, "MANAGED_SKILL"]], 1);
var SimulatedMsgReason = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SimulatedMsgReason", [[0, "UNSPECIFIED"], [1, "PLAN_EXECUTION"], [2, "COMMIT_REMINDER"], [3, "BACKGROUND_TASK_COMPLETION"], [4, "DIFF_TAB_COMMIT"], [5, "DIFF_TAB_COMMIT_AND_PUSH"], [6, "DIFF_TAB_PUSH"], [7, "DIFF_TAB_CREATE_PR"], [8, "DIFF_TAB_FIX_MERGE_CONFLICTS"], [9, "USER_SENT_TO_SUBAGENT"], [10, "USER_INTERRUPTED_SUBAGENT"], [11, "USER_QUEUED_TO_SUBAGENT"], [12, "BABYSIT_PR_IN_CLOUD"], [13, "CI_PANEL_INVESTIGATE_FAILURE"], [14, "MULTITASK"], [15, "BUILD_IN_PARALLEL"], [16, "MULTITASK_SPLIT_PRS"], [17, "APPLY_LOCALLY"], [18, "CHECKOUT_BRANCH"], [19, "DIFF_TAB_UPDATE_BRANCH"], [20, "PR_TAB_BUGBOT_FIX"], [22, "RUN_BUGBOT_REVIEW"], [23, "RUN_SECURITY_REVIEW"], [24, "FSD_APPLY_FINDING"], [25, "FSD_UNDO_FINDING"], [26, "FSD_START"], [27, "FSD_PR_INTERRUPT"], [28, "SUBSCRIPTION"], [29, "DIFF_TAB_CREATE_BRANCH"], [30, "AGENT_STORE_CONFLICT"], [31, "GOAL_CONTINUATION"], [32, "PROJECT_KICKOFF"], [33, "MARKDOWN_PROMPT_BUTTON"], [34, "USER_QUICK_ACTION"]], 1);
var SubscriptionSource = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SubscriptionSource", [[0, "UNSPECIFIED"], [1, "SLACK"], [2, "GITHUB"], [3, "LINEAR"], [4, "ORIGIN"]], 1);
var TaskArgs = class _TaskArgs extends __protoMessage380 {
  constructor(data) {
    super();
    this.description = "";
    this.prompt = "";
    this.attachments = [];
    this.mode = TaskMode.UNSPECIFIED;
    this.respondingToMessageIds = [];
    this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskArgs, a, b);
  }
  static $() {
    return ["TaskArgs|1 description 9|2 prompt 9|3 subagent_type #0|4 model 9?|5 resume 9?|6 agent_id 9?|7 attachments 9*|8 mode #1|9 responding_to_message_ids 9*|10 environment #2|11 machine #3?", SubagentType, TaskMode, SubagentExecutionEnvironment, TargetMachine];
  }
};
var TargetMachine = class _TargetMachine extends __protoMessage380 {
  constructor(data) {
    super();
    this.machine = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TargetMachine().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TargetMachine().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TargetMachine().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TargetMachine, a, b);
  }
  static $() {
    return ["TargetMachine|1 same_machine #0 machine|2 new_cloud_vm #1 machine|3 self_hosted_worker #2 machine|4 self_hosted_pool #3 machine", SameMachineTarget, NewCloudVmTarget, SelfHostedWorkerTarget, SelfHostedPoolTarget];
  }
};
var SameMachineTarget = class _SameMachineTarget extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SameMachineTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SameMachineTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SameMachineTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SameMachineTarget, a, b);
  }
  static $() {
    return ["SameMachineTarget"];
  }
};
var NewCloudVmTarget = class _NewCloudVmTarget extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _NewCloudVmTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _NewCloudVmTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _NewCloudVmTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_NewCloudVmTarget, a, b);
  }
  static $() {
    return ["NewCloudVmTarget|1 environment_build_id 9?|2 base_branch 9?"];
  }
};
var SelfHostedWorkerTarget = class _SelfHostedWorkerTarget extends __protoMessage380 {
  constructor(data) {
    super();
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelfHostedWorkerTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelfHostedWorkerTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelfHostedWorkerTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelfHostedWorkerTarget, a, b);
  }
  static $() {
    return ["SelfHostedWorkerTarget|1 worker_id 9"];
  }
};
var SelfHostedPoolTarget = class _SelfHostedPoolTarget extends __protoMessage380 {
  constructor(data) {
    super();
    this.labels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelfHostedPoolTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelfHostedPoolTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelfHostedPoolTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelfHostedPoolTarget, a, b);
  }
  static $() {
    return ["SelfHostedPoolTarget|1 pool 9?|2 labels #0*", SelfHostedWorkerLabel];
  }
};
var SelfHostedWorkerLabel = class _SelfHostedWorkerLabel extends __protoMessage380 {
  constructor(data) {
    super();
    this.key = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelfHostedWorkerLabel().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelfHostedWorkerLabel().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelfHostedWorkerLabel().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelfHostedWorkerLabel, a, b);
  }
  static $() {
    return ["SelfHostedWorkerLabel|1 key 9|2 value 9"];
  }
};
var TaskSuccess = class _TaskSuccess extends __protoMessage380 {
  constructor(data) {
    super();
    this.conversationSteps = [];
    this.isBackground = false;
    this.backgroundReason = SubagentBackgroundReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskSuccess, a, b);
  }
  static $() {
    return ["TaskSuccess|1 conversation_steps #0*|2 agent_id 9?|3 is_background 8|4 duration_ms 4?|5 result_suffix 9?|6 background_reason #1|7 transcript_path 9?", ConversationStep, SubagentBackgroundReason];
  }
};
var TaskError = class _TaskError extends __protoMessage380 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskError, a, b);
  }
  static $() {
    return ["TaskError|1 error 9"];
  }
};
var TaskResult = class _TaskResult extends __protoMessage380 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskResult, a, b);
  }
  static $() {
    return ["TaskResult|1 success #0 result|2 error #1 result", TaskSuccess, TaskError];
  }
};
var TaskToolCall = class _TaskToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskToolCall, a, b);
  }
  static $() {
    return ["TaskToolCall|1 args #0|2 result #1|3 cloud_agent_bc_id 9?", TaskArgs, TaskResult];
  }
};
var SetActiveBranchArgs = class _SetActiveBranchArgs extends __protoMessage380 {
  constructor(data) {
    super();
    this.path = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchArgs, a, b);
  }
  static $() {
    return ["SetActiveBranchArgs|1 path 9|2 branch_name 9"];
  }
};
var SetActiveBranchSuccess = class _SetActiveBranchSuccess extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchSuccess, a, b);
  }
  static $() {
    return ["SetActiveBranchSuccess"];
  }
};
var SetActiveBranchError = class _SetActiveBranchError extends __protoMessage380 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchError, a, b);
  }
  static $() {
    return ["SetActiveBranchError|1 error 9"];
  }
};
var SetActiveBranchResult = class _SetActiveBranchResult extends __protoMessage380 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchResult, a, b);
  }
  static $() {
    return ["SetActiveBranchResult|1 success #0 result|2 error #1 result", SetActiveBranchSuccess, SetActiveBranchError];
  }
};
var SetActiveBranchToolCall = class _SetActiveBranchToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchToolCall, a, b);
  }
  static $() {
    return ["SetActiveBranchToolCall|1 args #0|2 result #1", SetActiveBranchArgs, SetActiveBranchResult];
  }
};
var ToolCall = class _ToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    this.tool = { case: void 0 };
    this.hookAdditionalContexts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ToolCall, a, b);
  }
  static $() {
    return ["ToolCall|1 shell_tool_call #0 tool|3 delete_tool_call #1 tool|4 glob_tool_call #2 tool|5 grep_tool_call #3 tool|8 read_tool_call #4 tool|9 update_todos_tool_call #5 tool|10 read_todos_tool_call #6 tool|12 edit_tool_call #7 tool|13 ls_tool_call #8 tool|14 read_lints_tool_call #9 tool|15 mcp_tool_call #10 tool|16 sem_search_tool_call #11 tool|17 create_plan_tool_call #12 tool|18 web_search_tool_call #13 tool|19 task_tool_call #14 tool|20 list_mcp_resources_tool_call #15 tool|21 read_mcp_resource_tool_call #16 tool|22 apply_agent_diff_tool_call #17 tool|23 ask_question_tool_call #18 tool|24 fetch_tool_call #19 tool|25 switch_mode_tool_call #20 tool|28 generate_image_tool_call #21 tool|29 record_screen_tool_call #22 tool|30 computer_use_tool_call #23 tool|31 write_shell_stdin_tool_call #24 tool|32 reflect_tool_call #25 tool|33 setup_vm_environment_tool_call #26 tool|34 truncated_tool_call #27 tool|35 start_grind_execution_tool_call #28 tool|36 start_grind_planning_tool_call #29 tool|37 web_fetch_tool_call #30 tool|38 report_bugfix_results_tool_call #31 tool|39 ai_attribution_tool_call #32 tool|40 pr_management_tool_call #33 tool|41 mcp_auth_tool_call #34 tool|42 await_tool_call #35 tool|43 blame_by_file_path_tool_call #36 tool|44 get_mcp_tools_tool_call #37 tool|45 report_bug_tool_call #38 tool|46 set_active_branch_tool_call #39 tool|48 communicate_update_tool_call #40 tool|49 send_final_summary_tool_call #41 tool|50 update_pr_code_tour_tool_call #42 tool|51 replace_env_tool_call #43 tool|52 edit_pr_labels_tool_call #44 tool|53 record_ci_investigation_findings_tool_call #45 tool|55 send_message_tool_call #46 tool|56 fetch_cloud_agent_data_tool_call #47 tool|58 send_to_user_tool_call #48 tool|61 pi_read_tool_call #49 tool|62 pi_bash_tool_call #50 tool|63 pi_edit_tool_call #51 tool|64 pi_write_tool_call #52 tool|65 pi_grep_tool_call #53 tool|66 pi_find_tool_call #54 tool|67 pi_ls_tool_call #55 tool|68 connect_scm_tool_call #56 tool|69 search_conversations_tool_call #57 tool|70 create_goal_tool_call #58 tool|71 update_goal_tool_call #59 tool|72 adopt_tool_call #60 tool|73 get_agent_status_tool_call #61 tool|74 send_to_agent_tool_call #62 tool|75 read_agent_transcript_tool_call #63 tool|76 create_agent_tool_call #64 tool|77 stop_agent_tool_call #65 tool|78 get_pr_code_tour_tool_call #66 tool|79 write_canvas_tool_call #67 tool|80 read_canvas_tool_call #68 tool|54 hook_additional_contexts #69*|57 tool_call_id 9?|59 started_at_ms 4?|60 completed_at_ms 4?", ShellToolCall, DeleteToolCall, GlobToolCall, GrepToolCall, ReadToolCall, UpdateTodosToolCall, ReadTodosToolCall, EditToolCall, LsToolCall, ReadLintsToolCall, McpToolCall, SemSearchToolCall, CreatePlanToolCall, WebSearchToolCall, TaskToolCall, ListMcpResourcesToolCall, ReadMcpResourceToolCall, ApplyAgentDiffToolCall, AskQuestionToolCall, FetchToolCall, SwitchModeToolCall, GenerateImageToolCall, RecordScreenToolCall, ComputerUseToolCall, WriteShellStdinToolCall, ReflectToolCall, SetupVmEnvironmentToolCall, TruncatedToolCall, StartGrindExecutionToolCall, StartGrindPlanningToolCall, WebFetchToolCall, ReportBugfixResultsToolCall, AiAttributionToolCall, PrManagementToolCall, McpAuthToolCall, AwaitToolCall, BlameByFilePathToolCall, GetMcpToolsToolCall, ReportBugToolCall, SetActiveBranchToolCall, CommunicateUpdateToolCall, SendFinalSummaryToolCall, UpdatePrCodeTourToolCall, ReplaceEnvToolCall, EditPrLabelsToolCall, RecordCiInvestigationFindingsToolCall, SendMessageToolCall, FetchCloudAgentDataToolCall, SendToUserToolCall, PiReadToolCall, PiBashToolCall, PiEditToolCall, PiWriteToolCall, PiGrepToolCall, PiFindToolCall, PiLsToolCall, ConnectScmToolCall, SearchConversationsToolCall, CreateGoalToolCall, UpdateGoalToolCall, AdoptToolCall, GetAgentStatusToolCall, SendToAgentToolCall, ReadAgentTranscriptToolCall, CreateAgentToolCall, StopAgentToolCall, GetPrCodeTourToolCall, WriteCanvasToolCall, ReadCanvasToolCall, HookAdditionalContext];
  }
};
var TruncatedToolCallArgs = class _TruncatedToolCallArgs extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallArgs, a, b);
  }
  static $() {
    return ["TruncatedToolCallArgs"];
  }
};
var TruncatedToolCallSuccess = class _TruncatedToolCallSuccess extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallSuccess, a, b);
  }
  static $() {
    return ["TruncatedToolCallSuccess"];
  }
};
var TruncatedToolCallError = class _TruncatedToolCallError extends __protoMessage380 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallError, a, b);
  }
  static $() {
    return ["TruncatedToolCallError|1 error 9"];
  }
};
var TruncatedToolCallResult = class _TruncatedToolCallResult extends __protoMessage380 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallResult, a, b);
  }
  static $() {
    return ["TruncatedToolCallResult|1 success #0 result|2 error #1 result", TruncatedToolCallSuccess, TruncatedToolCallError];
  }
};
var TruncatedToolCall = class _TruncatedToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    this.originalStepBlobId = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCall, a, b);
  }
  static $() {
    return ["TruncatedToolCall|1 original_step_blob_id 12|2 args #0|3 result #1", TruncatedToolCallArgs, TruncatedToolCallResult];
  }
};
var ConversationStep = class _ConversationStep extends __protoMessage380 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationStep().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationStep().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationStep().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationStep, a, b);
  }
  static $() {
    return ["ConversationStep|1 assistant_message #0 message|2 tool_call #1 message|3 thinking_message #2 message", AssistantMessage, ToolCall, ThinkingMessage];
  }
};
var TriggeringUserInfo = class _TriggeringUserInfo extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TriggeringUserInfo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TriggeringUserInfo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TriggeringUserInfo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TriggeringUserInfo, a, b);
  }
  static $() {
    return ["TriggeringUserInfo|1 auth_id 9?|2 user_id 5?"];
  }
};
var SubagentRunState = class _SubagentRunState extends __protoMessage380 {
  constructor(data) {
    super();
    this.parentToolCallId = "";
    this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
    this.status = SubagentRunStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentRunState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentRunState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentRunState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentRunState, a, b);
  }
  static $() {
    return ["SubagentRunState|1 parent_tool_call_id 9|2 subagent_id 9?|3 environment #0|4 status #1|5 title 9?|6 detail 9?|7 transcript_path 9?|8 output_path 9?|9 completed_timestamp_ms 4?|10 completion_reason #2?", SubagentExecutionEnvironment, SubagentRunStatus, BackgroundTaskCompletionReason];
  }
};
var SubagentDispatchStep = class _SubagentDispatchStep extends __protoMessage380 {
  constructor(data) {
    super();
    this.stepIndex = 0;
    this.toolCallId = "";
    this.tool = SubagentDispatchTool.UNSPECIFIED;
    this.backgrounded = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentDispatchStep().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentDispatchStep().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentDispatchStep().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentDispatchStep, a, b);
  }
  static $() {
    return ["SubagentDispatchStep|1 step_index 13|2 tool_call_id 9|3 tool #0|4 backgrounded 8", SubagentDispatchTool];
  }
};
var SubmittedCustomMode = class _SubmittedCustomMode extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    this.source = CustomModeSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubmittedCustomMode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubmittedCustomMode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubmittedCustomMode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubmittedCustomMode, a, b);
  }
  static $() {
    return ["SubmittedCustomMode|1 id 9|2 label 9|5 source #0|6 source_path 9?|7 source_hash 9?|10 managed_skill_id 9?|11 plugin_id 9?|12 plugin_snapshot_token 9?", CustomModeSource];
  }
};
var SubmittedExitedCustomMode = class _SubmittedExitedCustomMode extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubmittedExitedCustomMode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubmittedExitedCustomMode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubmittedExitedCustomMode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubmittedExitedCustomMode, a, b);
  }
  static $() {
    return ["SubmittedExitedCustomMode|1 id 9|2 label 9"];
  }
};
var CustomModeExitIntent = class _CustomModeExitIntent extends __protoMessage380 {
  constructor(data) {
    super();
    this.nextMode = AgentMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CustomModeExitIntent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CustomModeExitIntent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CustomModeExitIntent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CustomModeExitIntent, a, b);
  }
  static $() {
    return ["CustomModeExitIntent|1 next_mode #0|2 exited_mode #1", AgentMode, SubmittedExitedCustomMode];
  }
};
var CustomModeIntent = class _CustomModeIntent extends __protoMessage380 {
  constructor(data) {
    super();
    this.intent = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CustomModeIntent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CustomModeIntent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CustomModeIntent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CustomModeIntent, a, b);
  }
  static $() {
    return ["CustomModeIntent|1 enter #0 intent|2 exit #1 intent", SubmittedCustomMode, CustomModeExitIntent];
  }
};
var SubscriptionEventDisplay = class _SubscriptionEventDisplay extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubscriptionEventDisplay().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubscriptionEventDisplay().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubscriptionEventDisplay().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubscriptionEventDisplay, a, b);
  }
  static $() {
    return ["SubscriptionEventDisplay|1 display_label 9?|2 resource_url 9?|3 subscription_id 9?"];
  }
};
var ExecutePlanInfo = class _ExecutePlanInfo extends __protoMessage380 {
  constructor(data) {
    super();
    this.planId = "";
    this.planTitle = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ExecutePlanInfo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ExecutePlanInfo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ExecutePlanInfo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ExecutePlanInfo, a, b);
  }
  static $() {
    return ["ExecutePlanInfo|1 plan_id 9|2 plan_title 9"];
  }
};
var ProjectDetails = class _ProjectDetails extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ProjectDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ProjectDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ProjectDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ProjectDetails, a, b);
  }
  static $() {
    return ["ProjectDetails|1 name 9?|2 subagent #0?|3 side_chat #1?", ProjectSubagentDetails, ProjectSideChatDetails];
  }
};
var ProjectSubagentDetails = class _ProjectSubagentDetails extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ProjectSubagentDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ProjectSubagentDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ProjectSubagentDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ProjectSubagentDetails, a, b);
  }
  static $() {
    return ["ProjectSubagentDetails|2 store_dir 9?"];
  }
};
var ProjectSideChatDetails = class _ProjectSideChatDetails extends __protoMessage380 {
  constructor(data) {
    super();
    this.storeDir = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ProjectSideChatDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ProjectSideChatDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ProjectSideChatDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ProjectSideChatDetails, a, b);
  }
  static $() {
    return ["ProjectSideChatDetails|1 store_dir 9"];
  }
};
var UserMessage = class _UserMessage extends __protoMessage380 {
  constructor(data) {
    super();
    this.text = "";
    this.messageId = "";
    this.mode = AgentMode.UNSPECIFIED;
    this.conversationStateBlobId = new Uint8Array(0);
    this.hookAdditionalContexts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UserMessage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UserMessage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UserMessage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UserMessage, a, b);
  }
  static $() {
    return ["UserMessage|1 text 9|2 message_id 9|3 selected_context #0?|4 mode #1|5 is_simulated_msg 8?|6 best_of_n_group_id 9?|7 try_use_best_of_n_promotion 8?|8 rich_text 9?|9 simulated_msg_reason #2?|10 conversation_state_blob_id 12|11 subagent_system_reminder 9?|13 triggering_user_info #3?|14 execute_plan_info #4?|15 simulated_message_metadata #5?|16 prompt_reference_id 9?|17 thread_id 9?|18 text_blob_id 12?|19 rich_text_blob_id 12?|21 hook_additional_contexts #6*|22 custom_mode_intent #7?|23 project_details #8?|24 turn_steer 8?|25 started_at_ms 4?|26 completed_at_ms 4?|27 sent_by_agent_id 9?", SelectedContext, AgentMode, SimulatedMsgReason, TriggeringUserInfo, ExecutePlanInfo, UserMessage_SimulatedMessageMetadata, HookAdditionalContext, CustomModeIntent, ProjectDetails];
  }
};
var UserMessage_SimulatedMessageMetadata = class _UserMessage_SimulatedMessageMetadata extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UserMessage_SimulatedMessageMetadata().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UserMessage_SimulatedMessageMetadata().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UserMessage_SimulatedMessageMetadata().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UserMessage_SimulatedMessageMetadata, a, b);
  }
  static $() {
    return ["UserMessage.SimulatedMessageMetadata|1 title 9?|2 task_id 9?|3 fsd_finding_action 9?|4 url 9?|5 subscription_source #0?|6 subscription_event_display #1?", SubscriptionSource, SubscriptionEventDisplay];
  }
};
var AssistantMessage = class _AssistantMessage extends __protoMessage380 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AssistantMessage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AssistantMessage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AssistantMessage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AssistantMessage, a, b);
  }
  static $() {
    return ["AssistantMessage|1 text 9|2 started_at_ms 4?|3 completed_at_ms 4?"];
  }
};
var ThinkingMessage = class _ThinkingMessage extends __protoMessage380 {
  constructor(data) {
    super();
    this.text = "";
    this.durationMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ThinkingMessage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ThinkingMessage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ThinkingMessage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ThinkingMessage, a, b);
  }
  static $() {
    return ["ThinkingMessage|1 text 9|2 duration_ms 13|3 started_at_ms 4?|4 completed_at_ms 4?"];
  }
};
var ShellCommand = class _ShellCommand extends __protoMessage380 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellCommand().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellCommand().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellCommand().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellCommand, a, b);
  }
  static $() {
    return ["ShellCommand|1 command 9"];
  }
};
var ShellOutput = class _ShellOutput extends __protoMessage380 {
  constructor(data) {
    super();
    this.stdout = "";
    this.stderr = "";
    this.exitCode = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellOutput().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellOutput().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellOutput().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellOutput, a, b);
  }
  static $() {
    return ["ShellOutput|1 stdout 9|2 stderr 9|3 exit_code 5"];
  }
};
var ConversationPlan = class _ConversationPlan extends __protoMessage380 {
  constructor(data) {
    super();
    this.plan = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationPlan().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationPlan().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationPlan().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationPlan, a, b);
  }
  static $() {
    return ["ConversationPlan|1 plan 9"];
  }
};
var PlanRegistryEntry = class _PlanRegistryEntry extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PlanRegistryEntry().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PlanRegistryEntry().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PlanRegistryEntry().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PlanRegistryEntry, a, b);
  }
  static $() {
    return ["PlanRegistryEntry|1 id 9|2 path 9"];
  }
};
var GoalState = class _GoalState extends __protoMessage380 {
  constructor(data) {
    super();
    this.conversationId = "";
    this.goalId = "";
    this.objective = "";
    this.status = GoalStatus.UNSPECIFIED;
    this.idleContinuationsWithoutToolCalls = 0;
    this.continuationCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GoalState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GoalState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GoalState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GoalState, a, b);
  }
  static $() {
    return ["GoalState|1 conversation_id 9|2 goal_id 9|3 objective 9|4 status #0|5 idle_continuations_without_tool_calls 13|6 active_duration_ms 4?|7 last_accrued_at_ms 4?|8 continuation_count 13|9 agent_session_id 9?", GoalStatus];
  }
};
var ConversationTurnStructure = class _ConversationTurnStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.turn = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationTurnStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationTurnStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationTurnStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationTurnStructure, a, b);
  }
  static $() {
    return ["ConversationTurnStructure|1 agent_conversation_turn #0 turn|2 shell_conversation_turn #1 turn", AgentConversationTurnStructure, ShellConversationTurnStructure];
  }
};
var AgentConversationTurnStructure = class _AgentConversationTurnStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.userMessage = new Uint8Array(0);
    this.steps = [];
    this.sendMessageStepIndices = [];
    this.subagentDispatchSteps = [];
    this.dynamicToolNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AgentConversationTurnStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AgentConversationTurnStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AgentConversationTurnStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AgentConversationTurnStructure, a, b);
  }
  static $() {
    return ["AgentConversationTurnStructure|1 user_message 12|2 steps 12*|3 request_id 9?|4 encrypted_model 9?|5 dynamic_tool_count 13?|6 send_message_step_indices 13*|7 routed_model_display_name 9?|8 subagent_dispatch_steps #0*|9 dynamic_tool_names 9*|10 user_message_id 9?", SubagentDispatchStep];
  }
};
var ShellConversationTurnStructure = class _ShellConversationTurnStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.shellCommand = new Uint8Array(0);
    this.shellOutput = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellConversationTurnStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellConversationTurnStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellConversationTurnStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellConversationTurnStructure, a, b);
  }
  static $() {
    return ["ShellConversationTurnStructure|1 shell_command 12|2 shell_output 12"];
  }
};
var ConversationSummary = class _ConversationSummary extends __protoMessage380 {
  constructor(data) {
    super();
    this.summary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSummary().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSummary().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSummary().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSummary, a, b);
  }
  static $() {
    return ["ConversationSummary|1 summary 9"];
  }
};
var ConversationSummaryArchive = class _ConversationSummaryArchive extends __protoMessage380 {
  constructor(data) {
    super();
    this.summarizedMessages = [];
    this.summary = "";
    this.windowTail = 0;
    this.summaryMessage = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSummaryArchive().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSummaryArchive().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSummaryArchive().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSummaryArchive, a, b);
  }
  static $() {
    return ["ConversationSummaryArchive|1 summarized_messages 12*|2 summary 9|3 window_tail 13|4 summary_message 12"];
  }
};
var PromptTokenBreakdownCategory = class _PromptTokenBreakdownCategory extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    this.estimatedTokens = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptTokenBreakdownCategory().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptTokenBreakdownCategory().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptTokenBreakdownCategory().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptTokenBreakdownCategory, a, b);
  }
  static $() {
    return ["PromptTokenBreakdownCategory|1 id 9|2 label 9|3 estimated_tokens 13|4 character_count 13?"];
  }
};
var PromptTokenBreakdownSnapshot = class _PromptTokenBreakdownSnapshot extends __protoMessage380 {
  constructor(data) {
    super();
    this.totalUsedTokens = 0;
    this.maxTokens = 0;
    this.categories = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptTokenBreakdownSnapshot().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptTokenBreakdownSnapshot().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptTokenBreakdownSnapshot().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptTokenBreakdownSnapshot, a, b);
  }
  static $() {
    return ["PromptTokenBreakdownSnapshot|1 total_used_tokens 13|2 max_tokens 13|3 categories #0*", PromptTokenBreakdownCategory];
  }
};
var PromptContextSourceRef = class _PromptContextSourceRef extends __protoMessage380 {
  constructor(data) {
    super();
    this.sourceType = "";
    this.messageIndex = 0;
    this.contentPath = "";
    this.startOffset = 0;
    this.endOffset = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptContextSourceRef().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptContextSourceRef().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptContextSourceRef().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptContextSourceRef, a, b);
  }
  static $() {
    return ["PromptContextSourceRef|1 source_type 9|3 message_index 13|4 content_path 9|5 start_offset 13|6 end_offset 13"];
  }
};
var PromptContextNode = class _PromptContextNode extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.kind = "";
    this.label = "";
    this.categoryId = "";
    this.estimatedTokens = 0;
    this.characterCount = 0;
    this.contentAvailable = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptContextNode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptContextNode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptContextNode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptContextNode, a, b);
  }
  static $() {
    return ["PromptContextNode|1 id 9|2 parent_id 9?|3 kind 9|4 label 9|5 category_id 9|6 estimated_tokens 13|7 character_count 13|9 content_available 8|11 source #0?|12 inline_content 9?", PromptContextSourceRef];
  }
};
var PromptContextUsageTree = class _PromptContextUsageTree extends __protoMessage380 {
  constructor(data) {
    super();
    this.schemaVersion = 0;
    this.nodes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptContextUsageTree().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptContextUsageTree().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptContextUsageTree().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptContextUsageTree, a, b);
  }
  static $() {
    return ["PromptContextUsageTree|1 schema_version 13|2 nodes #0*", PromptContextNode];
  }
};
var ConversationTokenDetails = class _ConversationTokenDetails extends __protoMessage380 {
  constructor(data) {
    super();
    this.usedTokens = 0;
    this.maxTokens = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationTokenDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationTokenDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationTokenDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationTokenDetails, a, b);
  }
  static $() {
    return ["ConversationTokenDetails|1 used_tokens 13|2 max_tokens 13|3 breakdown #0?|4 prompt_context_usage_tree #1?|5 prompt_context_usage_snapshot_blob_id 12?", PromptTokenBreakdownSnapshot, PromptContextUsageTree];
  }
};
var FileState = class _FileState extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileState, a, b);
  }
  static $() {
    return ["FileState|1 content 9?|2 initial_content 9?"];
  }
};
var FileStateStructure = class _FileStateStructure extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileStateStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileStateStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileStateStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileStateStructure, a, b);
  }
  static $() {
    return ["FileStateStructure|1 content 12?|2 initial_content 12?"];
  }
};
var StepTiming = class _StepTiming extends __protoMessage380 {
  constructor(data) {
    super();
    this.durationMs = protoInt64.zero;
    this.timestampMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StepTiming().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StepTiming().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StepTiming().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StepTiming, a, b);
  }
  static $() {
    return ["StepTiming|1 duration_ms 4|2 timestamp_ms 4"];
  }
};
var CommunicateUpdateHistoryEntry = class _CommunicateUpdateHistoryEntry extends __protoMessage380 {
  constructor(data) {
    super();
    this.step = "";
    this.messageIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateHistoryEntry().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateHistoryEntry().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateHistoryEntry().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateHistoryEntry, a, b);
  }
  static $() {
    return ["CommunicateUpdateHistoryEntry|1 step 9|3 message_index 13"];
  }
};
var CommunicateUpdateTurnState = class _CommunicateUpdateTurnState extends __protoMessage380 {
  constructor(data) {
    super();
    this.history = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateTurnState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateTurnState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateTurnState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateTurnState, a, b);
  }
  static $() {
    return ["CommunicateUpdateTurnState|1 history #0*|2 final_summary 9?|3 completed_subtitle 9?", CommunicateUpdateHistoryEntry];
  }
};
var SubagentPersistedState = class _SubagentPersistedState extends __protoMessage380 {
  constructor(data) {
    super();
    this.createdTimestampMs = protoInt64.zero;
    this.lastUsedTimestampMs = protoInt64.zero;
    this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentPersistedState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentPersistedState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentPersistedState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentPersistedState, a, b);
  }
  static $() {
    return ["SubagentPersistedState|1 conversation_state #0|2 created_timestamp_ms 4|3 last_used_timestamp_ms 4|4 subagent_type #1|5 model_id 9?|6 environment #2|7 cloud_subagent #3?|8 first_class_bc_id 9?|9 cloud_requested_environment_build_id 9?|10 machine #4?", ConversationStateStructure, SubagentType, SubagentExecutionEnvironment, CloudSubagentReference, TargetMachine];
  }
};
var CloudSubagentReference = class _CloudSubagentReference extends __protoMessage380 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudSubagentReference().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudSubagentReference().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudSubagentReference().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudSubagentReference, a, b);
  }
  static $() {
    return ["CloudSubagentReference|1 bc_id 9|2 transcript_path 9?"];
  }
};
var TrackedGitRepo = class _TrackedGitRepo extends __protoMessage380 {
  constructor(data) {
    super();
    this.repoPath = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TrackedGitRepo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TrackedGitRepo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TrackedGitRepo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TrackedGitRepo, a, b);
  }
  static $() {
    return ["TrackedGitRepo|1 repo_path 9|2 branch_name 9"];
  }
};
var ConversationStateStructure = class _ConversationStateStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.rootPromptMessagesJson = [];
    this.turns = [];
    this.todos = [];
    this.pendingToolCalls = [];
    this.previousWorkspaceUris = [];
    this.fileStates = {};
    this.fileStatesV2 = {};
    this.summaryArchives = [];
    this.turnTimings = [];
    this.subagentStates = {};
    this.selfSummaryCount = 0;
    this.readPaths = [];
    this.plans = {};
    this.trackedGitRepoBranches = [];
    this.communicateUpdateHistory = [];
    this.subagentThreads = {};
    this.communicateUpdateStatesByParentToolCallId = {};
    this.subagentRunsByParentToolCallId = {};
    this.subagentStateRefs = {};
    this.completedAskQuestionToolCallIds = [];
    this.durableSkillBlocks = [];
    this.recentUserMessageIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationStateStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationStateStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationStateStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationStateStructure, a, b);
  }
  static $() {
    return ["ConversationStateStructure|1 root_prompt_messages_json 12*|8 turns 12*|3 todos 12*|4 pending_tool_calls 9*|5 token_details #0|6 summary 12?|7 plan 12?|9 previous_workspace_uris 9*|10 mode #1?|11 summary_archive 12?|12 file_states 9,12|15 file_states_v2 9,#2|13 summary_archives 12*|14 turn_timings #3*|16 subagent_states 9,#4|17 self_summary_count 13|18 read_paths 9*|19 active_branch_name 9?|20 plans 9,#5|21 tracked_git_repo_branches #6*|22 agent_type 9?|23 communicate_update_history #7*|24 subagent_threads 9,9|25 communicate_update_final_summary 9?|28 communicate_update_completed_subtitle 9?|29 communicate_update_states_by_parent_tool_call_id 9,#8|30 subagent_runs_by_parent_tool_call_id 9,#9|26 conversation_started_timestamp_ms 4?|27 conversation_started_time_zone 9?|31 subagent_state_refs 9,12|32 goal_state #10?|33 is_root_project_conversation 8?|34 completed_ask_question_tool_call_ids 9*|35 durable_skill_blocks 9*|36 durable_custom_mode_id 9?|37 message_count_at_last_compaction 13?|38 recent_user_message_ids 9*|39 recent_user_message_ids_older_turn_count 13?", ConversationTokenDetails, AgentMode, FileStateStructure, StepTiming, SubagentPersistedState, PlanRegistryEntry, TrackedGitRepo, CommunicateUpdateHistoryEntry, CommunicateUpdateTurnState, SubagentRunState, GoalState];
  }
};

// ../packages/context/dist/core.js
function createKey(name, defaultValue) {
  return { symbol: name, defaultValue };
}

// ../packages/context/dist/logger.js
var DEFAULT_INDENT = 2;
var DEFAULT_MAX_DEPTH = 6;
var DEFAULT_MAX_ENTRIES = 50;
var DEFAULT_MAX_ARRAY_LENGTH = 40;
var DEFAULT_MAX_STRING_LENGTH = 200;
function shouldUseColors(useColors) {
  var _a;
  var _b;
  if (typeof useColors === "boolean") {
    return useColors;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const env = (_b = process.env) !== null && _b !== void 0 ? _b : {};
  if ("NO_COLOR" in env) {
    return false;
  }
  if (env.TERM === "dumb") {
    return false;
  }
  const forceColor = env.FORCE_COLOR;
  if (forceColor === "1" || forceColor === "true") {
    return true;
  }
  if (forceColor === "0") {
    return false;
  }
  return Boolean((_a = process.stdout) === null || _a === void 0 ? void 0 : _a.isTTY);
}
function createColorPalette(enabled) {
  const reset = "\x1B[0m";
  const withCodes = (codes) => (value) => enabled ? `\x1B[${codes.join(";")}m${value}${reset}` : value;
  const dim = withCodes([2]);
  const gray = withCodes([90]);
  const red = withCodes([31]);
  const green = withCodes([32]);
  const yellow = withCodes([33]);
  const blue = withCodes([34]);
  const magenta = withCodes([35]);
  const cyan = withCodes([36]);
  const bold = withCodes([1]);
  const boldRed = withCodes([1, 31]);
  return {
    dim,
    gray,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    bold,
    level: (level, value) => {
      switch (level) {
        case "debug":
          return magenta(value);
        case "info":
          return blue(value);
        case "warn":
          return yellow(value);
        case "error":
          return boldRed(value);
        default: {
          const _exhaustiveCheck = level;
          return _exhaustiveCheck;
        }
      }
    }
  };
}
function resolveRenderOptions(options) {
  var _a, _b, _c, _d, _e, _f, _g;
  return {
    indent: " ".repeat((_a = options.indent) !== null && _a !== void 0 ? _a : DEFAULT_INDENT),
    maxDepth: (_b = options.maxDepth) !== null && _b !== void 0 ? _b : DEFAULT_MAX_DEPTH,
    maxEntries: (_c = options.maxEntries) !== null && _c !== void 0 ? _c : DEFAULT_MAX_ENTRIES,
    maxArrayLength: (_d = options.maxArrayLength) !== null && _d !== void 0 ? _d : DEFAULT_MAX_ARRAY_LENGTH,
    maxStringLength: (_e = options.maxStringLength) !== null && _e !== void 0 ? _e : DEFAULT_MAX_STRING_LENGTH,
    includeTimestamp: (_f = options.includeTimestamp) !== null && _f !== void 0 ? _f : true,
    includeContextPath: (_g = options.includeContextPath) !== null && _g !== void 0 ? _g : true,
    inlineSerializer: options.inlineSerializer
  };
}
function formatTimestamp(timestamp) {
  return timestamp.toISOString().slice(11, 23);
}
function isContext(value) {
  return typeof value === "object" && value !== null && "getPath" in value && typeof value.getPath === "function";
}
function isErrorLike(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return "message" in value || "stack" in value || "name" in value || "cause" in value;
}
function isInlineSummary(value) {
  return typeof value === "object" && value !== null && value.kind === "summary" && typeof value.summary === "string";
}
function truncateString(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
}
function applyInlineSerializer(value, options, path, depth) {
  if (!options.inlineSerializer) {
    return value;
  }
  try {
    const serialized = options.inlineSerializer(value, { path, depth });
    return serialized === void 0 ? value : serialized;
  } catch (_a) {
    return value;
  }
}
function formatInlineValue(value, options, colors, depth, seen, path) {
  var _a;
  var _b;
  const serialized = applyInlineSerializer(value, options, path, depth);
  if (isInlineSummary(serialized)) {
    return colors.dim(`<${serialized.summary}>`);
  }
  value = serialized;
  if (value === null) {
    return colors.gray("null");
  }
  if (value === void 0) {
    return colors.gray("undefined");
  }
  if (typeof value === "string") {
    const truncated = truncateString(value, options.maxStringLength);
    return colors.green(JSON.stringify(truncated));
  }
  if (typeof value === "number") {
    return colors.yellow(String(value));
  }
  if (typeof value === "boolean") {
    return colors.magenta(String(value));
  }
  if (typeof value === "bigint") {
    return colors.yellow(`${value}n`);
  }
  if (typeof value === "symbol") {
    return colors.cyan(value.toString());
  }
  if (typeof value === "function") {
    const name = value.name ? ` ${value.name}` : "";
    return colors.dim(`[Function${name}]`);
  }
  if (value instanceof Date) {
    const iso = Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
    return colors.green(iso);
  }
  if (value instanceof RegExp) {
    return colors.cyan(value.toString());
  }
  if (isErrorLike(value)) {
    return formatErrorSummary(value, options, colors, depth, seen, path);
  }
  if (Array.isArray(value)) {
    return formatInlineArray(value, options, colors, depth, seen, path);
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return colors.dim(`ArrayBuffer(${value.byteLength})`);
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && ArrayBuffer.isView(value)) {
    const typedArray = value;
    const label = (_b = (_a = typedArray.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "TypedArray";
    return colors.dim(`${label}(${typedArray.byteLength})`);
  }
  if (value instanceof Map) {
    return formatInlineMap(value, options, colors, depth, seen, path);
  }
  if (value instanceof Set) {
    return formatInlineArray(Array.from(value.values()), options, colors, depth, seen, path);
  }
  return formatInlineObject(value, options, colors, depth, seen, path);
}
function formatErrorSummary(error, options, colors, depth, seen, path) {
  const errorObj = error;
  if (seen.has(errorObj)) {
    return colors.dim("[Circular]");
  }
  seen.add(errorObj);
  const name = typeof error.name === "string" ? error.name : "Error";
  const message = typeof error.message === "string" ? error.message : "";
  const summary = message ? `${name}: ${message}` : name;
  let result = colors.red(summary);
  if ("cause" in error && error.cause !== void 0) {
    const causeValue = formatInlineValue(error.cause, options, colors, depth + 1, seen, path.concat("cause"));
    result = `${result} ${colors.dim("cause=")}${causeValue}`;
  }
  seen.delete(errorObj);
  return result;
}
function formatInlineArray(value, options, colors, depth, seen, path) {
  if (depth >= options.maxDepth) {
    return colors.dim(`[Array(${value.length})]`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  if (value.length === 0) {
    const empty = colors.dim("[]");
    seen.delete(value);
    return empty;
  }
  const limit = Math.min(value.length, options.maxArrayLength);
  const items = value.slice(0, limit).map((entry, index) => formatInlineValue(entry, options, colors, depth + 1, seen, path.concat(index)));
  if (value.length > limit) {
    items.push(colors.dim(`... ${value.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("[")}${items.join(separator)}${colors.dim("]")}`;
  seen.delete(value);
  return result;
}
function formatInlineMap(value, options, colors, depth, seen, path) {
  if (depth >= options.maxDepth) {
    return colors.dim(`Map(${value.size})`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  const entries = Array.from(value.entries());
  const limit = Math.min(entries.length, options.maxEntries);
  const items = entries.slice(0, limit).map(([key, entryValue]) => {
    const keyValue = formatInlineValue(key, options, colors, depth + 1, seen, path.concat("<key>"));
    const renderedValue = formatInlineValue(entryValue, options, colors, depth + 1, seen, path.concat(String(key)));
    return `${keyValue} ${colors.dim("=>")} ${renderedValue}`;
  });
  if (entries.length > limit) {
    items.push(colors.dim(`... ${entries.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("Map{")}${items.join(separator)}${colors.dim("}")}`;
  seen.delete(value);
  return result;
}
function formatInlineObject(value, options, colors, depth, seen, path) {
  var _a;
  var _b;
  if (depth >= options.maxDepth) {
    const label = (_b = (_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Object";
    return colors.dim(`[${label}]`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  const entries = Object.entries(value);
  if (entries.length === 0) {
    const empty = colors.dim("{}");
    seen.delete(value);
    return empty;
  }
  const limit = Math.min(entries.length, options.maxEntries);
  const items = entries.slice(0, limit).map(([key, entryValue]) => {
    const renderedValue = formatInlineValue(entryValue, options, colors, depth + 1, seen, path.concat(key));
    return `${colors.cyan(key)}: ${renderedValue}`;
  });
  if (entries.length > limit) {
    items.push(colors.dim(`... ${entries.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("{")}${items.join(separator)}${colors.dim("}")}`;
  seen.delete(value);
  return result;
}
function createPrettyTerminalLoggerBackend(options = {}) {
  var _a;
  const renderOptions = resolveRenderOptions(options);
  const colors = createColorPalette(shouldUseColors(options.useColors));
  const outputConsole = (_a = options.console) !== null && _a !== void 0 ? _a : console;
  return {
    log: (_ctx, entry) => {
      const parts = [];
      if (renderOptions.includeTimestamp) {
        parts.push(colors.dim(formatTimestamp(entry.timestamp)));
      }
      const levelLabel = entry.level.toUpperCase().padEnd(5);
      parts.push(colors.level(entry.level, levelLabel));
      const message = entry.level === "error" ? colors.bold(entry.message) : entry.message;
      parts.push(message);
      if (renderOptions.includeContextPath && isContext(entry.context)) {
        const path = entry.context.getPath();
        if (path.length > 0) {
          parts.push(colors.dim(`ctx=${path.join("/")}`));
        }
      }
      const seen = /* @__PURE__ */ new WeakSet();
      if (!isContext(entry.context) && entry.context && Object.keys(entry.context).length > 0) {
        const contextValue = formatInlineValue(entry.context, renderOptions, colors, 0, seen, [
          "context"
        ]);
        parts.push(`${colors.dim("context=")}${contextValue}`);
      }
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        const metaValue = formatInlineValue(entry.metadata, renderOptions, colors, 0, seen, [
          "metadata"
        ]);
        parts.push(`${colors.dim("meta=")}${metaValue}`);
      }
      const outputLines = [parts.join(" ")];
      if (entry.error !== void 0) {
        const errorValue = isErrorLike(entry.error) ? formatErrorSummary(entry.error, renderOptions, colors, 0, seen, ["error"]) : formatInlineValue(entry.error, renderOptions, colors, 0, seen, ["error"]);
        outputLines[0] = `${outputLines[0]} ${colors.dim("error=")}${errorValue}`;
        if (isErrorLike(entry.error) && typeof entry.error.stack === "string") {
          const stackLines = entry.error.stack.split("\n").slice(1);
          for (const line of stackLines) {
            const trimmed = line.trim();
            if (trimmed) {
              outputLines.push(`${renderOptions.indent}${colors.dim(trimmed)}`);
            }
          }
        }
      }
      const output = outputLines.join("\n");
      switch (entry.level) {
        case "debug":
        case "info":
          outputConsole.log(output);
          break;
        case "warn":
          outputConsole.warn(output);
          break;
        case "error":
          outputConsole.error(output);
          break;
        default: {
          const _exhaustiveCheck = entry.level;
          throw new Error(`Unhandled log level: ${_exhaustiveCheck}`);
        }
      }
    }
  };
}
var defaultLoggerBackendImpl = createPrettyTerminalLoggerBackend();
var defaultLoggerBackend = {
  log: (ctx, entry) => defaultLoggerBackendImpl.log(ctx, entry)
};
var loggerKey = createKey(/* @__PURE__ */ Symbol("loggerBackend"), defaultLoggerBackend);
function getLoggerBackend(ctx) {
  return ctx.get(loggerKey);
}
function createLogger(name) {
  function log(ctx, entry) {
    const timestamp = /* @__PURE__ */ new Date();
    const logger7 = getLoggerBackend(ctx);
    logger7.log(ctx, Object.assign(Object.assign({}, entry), { timestamp, logger: name }));
  }
  return {
    debug: (ctx, message, metadata) => {
      log(ctx, { level: "debug", message, context: ctx, metadata });
    },
    info: (ctx, message, metadata) => {
      log(ctx, { level: "info", message, context: ctx, metadata });
    },
    warn: (ctx, message, metadata) => {
      log(ctx, { level: "warn", message, context: ctx, metadata });
    },
    error: (ctx, message, error, metadata) => {
      log(ctx, { level: "error", message, context: ctx, error, metadata });
    }
  };
}

// ../packages/metrics/dist/index.js
var defaultMetricsBackend = {
  record: () => {
  },
  increment: () => {
  },
  gauge: () => {
  },
  histogram: () => {
  }
};
var metricsKey = createKey(/* @__PURE__ */ Symbol("metricsBackend"), defaultMetricsBackend);
function getMetricsBackend(ctx) {
  return ctx.get(metricsKey);
}
function createCounter(name, options) {
  const handle = {
    name,
    type: "counter",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    increment: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.increment(ctx, handle, value !== null && value !== void 0 ? value : 1, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}
function createHistogram(name, options) {
  const handle = {
    name,
    type: "histogram",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    histogram: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.histogram(ctx, handle, value, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}

// ../packages/agent-kv/dist/serde.js
var decoder = new TextDecoder();
var encoder = new TextEncoder();
var Utf8Serde = class {
  serialize(value) {
    return encoder.encode(value);
  }
  deserialize(blob) {
    return decoder.decode(blob);
  }
  getBlobType() {
    return { kind: "string" };
  }
};
var utf8Serde = new Utf8Serde();
var ProtoSerde = class {
  constructor(proto) {
    this.proto = proto;
  }
  serialize(value) {
    return value.toBinary();
  }
  deserialize(blob) {
    return this.proto.fromBinary(blob);
  }
  getBlobType() {
    return { kind: "proto", typeName: this.proto.typeName };
  }
};
var HEX_LUT = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function fromHex(hex) {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

// ../packages/agent-kv/dist/blob-store.js
function toUint8Array(b) {
  const buffer = b.buffer;
  if (typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer)
    return new Uint8Array(b);
  return new Uint8Array(buffer, b.byteOffset, b.byteLength);
}
var inMemoryGetBlobLatency = createHistogram("agent_kv.in_memory.get_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore getBlob operations in milliseconds"
});
var inMemorySetBlobLatency = createHistogram("agent_kv.in_memory.set_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore setBlob operations in milliseconds"
});

// ../packages/agent-kv/dist/subagent-states.js
var logger = createLogger("@anysphere/agent-kv:subagent-states");

// ../packages/agent-kv/dist/agent-store.js
var AgentModes = ["default", "plan", "debug", "search"];
var ApprovalModeSettings = ["allowlist", "unrestricted", "auto-review"];
var agentModeSet = new Set(AgentModes);
var approvalModeSettingSet = new Set(ApprovalModeSettings);
var todoItemSerde = new ProtoSerde(TodoItem);
var userMessageSerde = new ProtoSerde(UserMessage);
var conversationStepSerde = new ProtoSerde(ConversationStep);
var conversationTurnStructureSerde = new ProtoSerde(ConversationTurnStructure);
var conversationSummarySerde = new ProtoSerde(ConversationSummary);
var shellCommandSerde = new ProtoSerde(ShellCommand);
var shellOutputSerde = new ProtoSerde(ShellOutput);

// ../packages/agent-kv/dist/cached-blob-store.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var logger2 = createLogger("@anysphere/agent-kv");
var cachedGetBlobLatency = createHistogram("agent_kv.cached.get_blob.duration_ms", {
  description: "Duration of CachedBlobStore getBlob operations in milliseconds"
});
var cachedSetBlobLatency = createHistogram("agent_kv.cached.set_blob.duration_ms", {
  description: "Duration of CachedBlobStore setBlob operations in milliseconds"
});
var cachedFlushLatency = createHistogram("agent_kv.cached.flush.duration_ms", {
  description: "Duration of CachedBlobStore flush operations in milliseconds"
});
var cachedCacheBytes = createHistogram("agent_kv.cached.cache_bytes", {
  description: "Resident bytes held in the CachedBlobStore in-memory cache, sampled on flush"
});
var cachedGetBlobResults = createCounter("agent_kv.cached.get_blob.results", {
  description: "Number of CachedBlobStore getBlob operations by cache result type",
  labelNames: ["cache_type"]
});
var cachedNearbyDecryptErrors = createCounter("agent_kv.nearby.decrypt_errors", {
  description: "Number of nearby blob reads that found ciphertext but failed to decrypt it (wrong encryption key)"
});
var cachedNearbyDecryptFallbackSuccess = createCounter("agent_kv.nearby.decrypt_fallback_success", {
  description: "Number of nearby blob reads where the primary encryption key failed but the fallback key decrypted the blob"
});
var encryptedGetBlobLatency = createHistogram("agent_kv.encrypted.get_blob.duration_ms", {
  description: "Duration of EncryptedBlobStore getBlob operations in milliseconds"
});
var encryptedSetBlobLatency = createHistogram("agent_kv.encrypted.set_blob.duration_ms", {
  description: "Duration of EncryptedBlobStore setBlob operations in milliseconds"
});
var NearbyBlobDecryptError = class extends Error {
  constructor(cause) {
    super("Failed to decrypt nearby blob (encryption key mismatch)", {
      cause
    });
    this.name = "NearbyBlobDecryptError";
  }
};
var EncryptedBlobStore = class _EncryptedBlobStore {
  /**
   * @param fallbackDecryptKeyStr Decrypt-only fallback tried when the primary
   * key fails on a read (see CachedBlobStoreOptions.nearbyFallbackDecryptKey).
   * Never used for writes.
   */
  constructor(blobStore, encryptionKeyStr, fallbackDecryptKeyStr = null) {
    this.blobStore = blobStore;
    this.encryptionKeyStr = encryptionKeyStr;
    this.fallbackDecryptKeyStr = fallbackDecryptKeyStr;
  }
  static deriveKey(keyStr) {
    return __awaiter(this, void 0, void 0, function* () {
      const encoder2 = new TextEncoder();
      const keyMaterial = encoder2.encode(keyStr);
      const keyHash = yield crypto.subtle.digest("SHA-256", keyMaterial);
      return crypto.subtle.importKey("raw", keyHash, { name: _EncryptedBlobStore.ALGORITHM, length: 256 }, true, ["encrypt", "decrypt"]);
    });
  }
  getEncryptionKey() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.encryptionKey === void 0) {
        this.encryptionKey = yield _EncryptedBlobStore.deriveKey(this.encryptionKeyStr);
      }
      return this.encryptionKey;
    });
  }
  getFallbackDecryptKey() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.fallbackDecryptKeyStr === null) {
        return null;
      }
      if (this.fallbackDecryptKey === void 0) {
        this.fallbackDecryptKey = yield _EncryptedBlobStore.deriveKey(this.fallbackDecryptKeyStr);
      }
      return this.fallbackDecryptKey;
    });
  }
  getBlob(ctx, blobId) {
    return __awaiter(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedValue = yield this.blobStore.getBlob(ctx, blobId);
        if (encryptedValue === void 0) {
          return void 0;
        }
        const iv = encryptedValue.slice(0, _EncryptedBlobStore.IV_LENGTH);
        const ciphertext = encryptedValue.slice(_EncryptedBlobStore.IV_LENGTH);
        let decryptedValue;
        try {
          decryptedValue = yield crypto.subtle.decrypt({ name: _EncryptedBlobStore.ALGORITHM, iv }, yield this.getEncryptionKey(), ciphertext);
        } catch (primaryError) {
          const fallbackKey = yield this.getFallbackDecryptKey();
          if (fallbackKey === null) {
            throw new NearbyBlobDecryptError(primaryError);
          }
          try {
            decryptedValue = yield crypto.subtle.decrypt({ name: _EncryptedBlobStore.ALGORITHM, iv }, fallbackKey, ciphertext);
            cachedNearbyDecryptFallbackSuccess.increment(ctx, 1);
          } catch (_a) {
            throw new NearbyBlobDecryptError(primaryError);
          }
        }
        return new Uint8Array(decryptedValue);
      } finally {
        const duration = performance.now() - startTime;
        encryptedGetBlobLatency.histogram(ctx, duration);
      }
    });
  }
  encryptBlob(blobData) {
    return __awaiter(this, void 0, void 0, function* () {
      const iv = crypto.getRandomValues(new Uint8Array(_EncryptedBlobStore.IV_LENGTH));
      const encryptedValue = yield crypto.subtle.encrypt({ name: _EncryptedBlobStore.ALGORITHM, iv }, yield this.getEncryptionKey(), toUint8Array(blobData));
      const combined = new Uint8Array(iv.length + encryptedValue.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedValue), iv.length);
      return combined;
    });
  }
  setBlob(ctx, blobId, blobData) {
    return __awaiter(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedBlob = yield this.encryptBlob(blobData);
        yield this.blobStore.setBlob(ctx, blobId, encryptedBlob);
      } finally {
        const duration = performance.now() - startTime;
        encryptedSetBlobLatency.histogram(ctx, duration);
      }
    });
  }
  setBlobLocallyOnly(ctx, blobId, blobData) {
    return __awaiter(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedBlob = yield this.encryptBlob(blobData);
        yield this.blobStore.setBlobLocallyOnly(ctx, blobId, encryptedBlob);
      } finally {
        const duration = performance.now() - startTime;
        encryptedSetBlobLatency.histogram(ctx, duration);
      }
    });
  }
  flush(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.blobStore.flush(ctx);
    });
  }
};
EncryptedBlobStore.ALGORITHM = "AES-GCM";
EncryptedBlobStore.IV_LENGTH = 12;

// ../packages/agent-kv/dist/controlled.js
var logger3 = createLogger("ControlledKvManager");
var controlledGetBlobLatency = createHistogram("agent_kv.controlled.get_blob.duration_ms", {
  description: "Duration of ControlledKvManager getBlob operations in milliseconds"
});
var controlledSetBlobLatency = createHistogram("agent_kv.controlled.set_blob.duration_ms", {
  description: "Duration of ControlledKvManager setBlob operations in milliseconds"
});

// ../packages/agent-kv/dist/writethrough-middleware.js
var logger4 = createLogger("@anysphere/agent-kv");
var writethroughGetBlobLatency = createHistogram("agent_kv.writethrough.get_blob.duration_ms", {
  description: "Duration of WritethroughBlobStore getBlob operations in milliseconds"
});
var writethroughSetBlobLatency = createHistogram("agent_kv.writethrough.set_blob.duration_ms", {
  description: "Duration of WritethroughBlobStore setBlob operations in milliseconds"
});
var writethroughFlushLatency = createHistogram("agent_kv.writethrough.flush.duration_ms", {
  description: "Duration of WritethroughBlobStore flush operations in milliseconds"
});

// ../packages/agent-kv/dist/reference.js
var logger5 = createLogger("@anysphere/agent-kv:reference");
var LARGE_LAZY_REFERENCE_BLOB_BYTES = 512 * 1024;
var lazyReferenceCacheMiss = createCounter("agent_kv.lazy_reference.cache_miss", {
  description: "Number of large or slow LazyReference cache misses that require loading and deserializing a blob",
  labelNames: ["blob_type"]
});
var lazyReferenceDeserializeBytes = createHistogram("agent_kv.lazy_reference.deserialize_bytes", {
  description: "Blob byte size loaded on a large or slow LazyReference deserialize cache miss",
  labelNames: ["blob_type"]
});
var lazyReferenceDeserializeDuration = createHistogram("agent_kv.lazy_reference.deserialize_ms", {
  description: "Time spent deserializing a blob on a large or slow LazyReference cache miss",
  labelNames: ["blob_type"]
});

// ../packages/agent-kv/dist/retry-blob-store.js
var logger6 = createLogger("RetryBlobStore");
var retryAttempts = createCounter("agent_kv.retry.retries", {
  description: "Number of RetryBlobStore retry attempts (one per re-issued operation, not counting the first try)",
  labelNames: ["operation", "outcome"]
});
var retryGetBlobLatency = createHistogram("agent_kv.retry.get_blob.duration_ms", {
  description: "Duration of RetryBlobStore getBlob operations in milliseconds"
});
var retrySetBlobLatency = createHistogram("agent_kv.retry.set_blob.duration_ms", {
  description: "Duration of RetryBlobStore setBlob operations in milliseconds"
});
var retrySetBlobLocallyOnlyLatency = createHistogram("agent_kv.retry.set_blob_locally_only.duration_ms", {
  description: "Duration of RetryBlobStore setBlobLocallyOnly operations in milliseconds"
});
var retryFlushLatency = createHistogram("agent_kv.retry.flush.duration_ms", {
  description: "Duration of RetryBlobStore flush operations in milliseconds"
});

// ../packages/proto/dist/generated/agent/v1/blob_reference_metadata.js
var BLOB_REFERENCE_METADATA_BY_MESSAGE_ID = {
  "agent.v1.AgentConversationTurnStructure": {
    messageType: "agent.v1.AgentConversationTurnStructure",
    fields: [
      { protoFieldName: "user_message", localFieldName: "userMessage", fieldNumber: 1, blobReferenceType: "agent.v1.UserMessage" },
      { protoFieldName: "steps", localFieldName: "steps", fieldNumber: 2, blobReferenceType: "agent.v1.ConversationStep" }
    ]
  },
  "agent.v1.ConversationStateStructure": {
    messageType: "agent.v1.ConversationStateStructure",
    fields: [
      { protoFieldName: "root_prompt_messages_json", localFieldName: "rootPromptMessagesJson", fieldNumber: 1, blobReferenceType: "json" },
      { protoFieldName: "todos", localFieldName: "todos", fieldNumber: 3, blobReferenceType: "agent.v1.TodoItem" },
      { protoFieldName: "summary", localFieldName: "summary", fieldNumber: 6, blobReferenceType: "agent.v1.ConversationSummary" },
      { protoFieldName: "plan", localFieldName: "plan", fieldNumber: 7, blobReferenceType: "agent.v1.ConversationPlan" },
      { protoFieldName: "turns", localFieldName: "turns", fieldNumber: 8, blobReferenceType: "agent.v1.ConversationTurnStructure" },
      { protoFieldName: "summary_archive", localFieldName: "summaryArchive", fieldNumber: 11, blobReferenceType: "agent.v1.ConversationSummaryArchive" },
      { protoFieldName: "file_states", localFieldName: "fileStates", fieldNumber: 12, blobReferenceType: "agent.v1.FileState" },
      { protoFieldName: "summary_archives", localFieldName: "summaryArchives", fieldNumber: 13, blobReferenceType: "agent.v1.ConversationSummaryArchive" },
      { protoFieldName: "subagent_state_refs", localFieldName: "subagentStateRefs", fieldNumber: 31, blobReferenceType: "agent.v1.SubagentPersistedState" }
    ]
  },
  "agent.v1.ConversationSummaryArchive": {
    messageType: "agent.v1.ConversationSummaryArchive",
    fields: [
      { protoFieldName: "summarized_messages", localFieldName: "summarizedMessages", fieldNumber: 1, blobReferenceType: "json" },
      { protoFieldName: "summary_message", localFieldName: "summaryMessage", fieldNumber: 4, blobReferenceType: "json" }
    ]
  },
  "agent.v1.ExtraContextEntry": {
    messageType: "agent.v1.ExtraContextEntry",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 2, blobReferenceType: "string" }
    ]
  },
  "agent.v1.FileStateStructure": {
    messageType: "agent.v1.FileStateStructure",
    fields: [
      { protoFieldName: "content", localFieldName: "content", fieldNumber: 1, blobReferenceType: "string" },
      { protoFieldName: "initial_content", localFieldName: "initialContent", fieldNumber: 2, blobReferenceType: "string" }
    ]
  },
  "agent.v1.GetBlobArgs": {
    messageType: "agent.v1.GetBlobArgs",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.InvocationContext": {
    messageType: "agent.v1.InvocationContext",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 10, blobReferenceType: "agent.v1.InvocationContext" }
    ]
  },
  "agent.v1.PreFetchedBlob": {
    messageType: "agent.v1.PreFetchedBlob",
    fields: [
      { protoFieldName: "id", localFieldName: "id", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.ReadSuccess": {
    messageType: "agent.v1.ReadSuccess",
    fields: [
      { protoFieldName: "output_blob_id", localFieldName: "outputBlobId", fieldNumber: 7, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.ReadToolSuccess": {
    messageType: "agent.v1.ReadToolSuccess",
    fields: [
      { protoFieldName: "data_blob_id", localFieldName: "dataBlobId", fieldNumber: 9, blobReferenceType: "bytes" },
      { protoFieldName: "content_blob_id", localFieldName: "contentBlobId", fieldNumber: 10, blobReferenceType: "string" }
    ]
  },
  "agent.v1.RequestContextPartReferences": {
    messageType: "agent.v1.RequestContextPartReferences",
    fields: [
      { protoFieldName: "rules_blob_id", localFieldName: "rulesBlobId", fieldNumber: 1, blobReferenceType: "agent.v1.RequestContextRulesPart" },
      { protoFieldName: "skills_blob_id", localFieldName: "skillsBlobId", fieldNumber: 3, blobReferenceType: "agent.v1.RequestContextSkillsPart" },
      { protoFieldName: "subagents_blob_id", localFieldName: "subagentsBlobId", fieldNumber: 5, blobReferenceType: "agent.v1.RequestContextSubagentsPart" },
      { protoFieldName: "mcps_blob_id", localFieldName: "mcpsBlobId", fieldNumber: 7, blobReferenceType: "agent.v1.RequestContextMcpsPart" }
    ]
  },
  "agent.v1.SelectedDocument": {
    messageType: "agent.v1.SelectedDocument",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedDocument.BlobIdWithData": {
    messageType: "agent.v1.SelectedDocument.BlobIdWithData",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedExternalLink": {
    messageType: "agent.v1.SelectedExternalLink",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 6, blobReferenceType: "string" }
    ]
  },
  "agent.v1.SelectedGitPRDiffSelection": {
    messageType: "agent.v1.SelectedGitPRDiffSelection",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 6, blobReferenceType: "agent.v1.SelectedGitPRDiffSelection" }
    ]
  },
  "agent.v1.SelectedImage": {
    messageType: "agent.v1.SelectedImage",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedImage.BlobIdWithData": {
    messageType: "agent.v1.SelectedImage.BlobIdWithData",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedPullRequest": {
    messageType: "agent.v1.SelectedPullRequest",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 7, blobReferenceType: "agent.v1.SelectedPullRequest" }
    ]
  },
  "agent.v1.SelectedVideo": {
    messageType: "agent.v1.SelectedVideo",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SelectedVideo.BlobIdWithData": {
    messageType: "agent.v1.SelectedVideo.BlobIdWithData",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.SetBlobArgs": {
    messageType: "agent.v1.SetBlobArgs",
    fields: [
      { protoFieldName: "blob_id", localFieldName: "blobId", fieldNumber: 1, blobReferenceType: "bytes" }
    ]
  },
  "agent.v1.ShellConversationTurnStructure": {
    messageType: "agent.v1.ShellConversationTurnStructure",
    fields: [
      { protoFieldName: "shell_command", localFieldName: "shellCommand", fieldNumber: 1, blobReferenceType: "agent.v1.ShellCommand" },
      { protoFieldName: "shell_output", localFieldName: "shellOutput", fieldNumber: 2, blobReferenceType: "agent.v1.ShellOutput" }
    ]
  },
  "agent.v1.TruncatedToolCall": {
    messageType: "agent.v1.TruncatedToolCall",
    fields: [
      { protoFieldName: "original_step_blob_id", localFieldName: "originalStepBlobId", fieldNumber: 1, blobReferenceType: "agent.v1.ConversationStep" }
    ]
  },
  "agent.v1.UserMessage": {
    messageType: "agent.v1.UserMessage",
    fields: [
      { protoFieldName: "conversation_state_blob_id", localFieldName: "conversationStateBlobId", fieldNumber: 10, blobReferenceType: "agent.v1.ConversationStateStructure" },
      { protoFieldName: "text_blob_id", localFieldName: "textBlobId", fieldNumber: 18, blobReferenceType: "string" },
      { protoFieldName: "rich_text_blob_id", localFieldName: "richTextBlobId", fieldNumber: 19, blobReferenceType: "string" }
    ]
  }
};
function getBlobReferenceMessageMetadata(messageType) {
  if (!Object.prototype.hasOwnProperty.call(BLOB_REFERENCE_METADATA_BY_MESSAGE_ID, messageType)) {
    return void 0;
  }
  return BLOB_REFERENCE_METADATA_BY_MESSAGE_ID[messageType];
}
var BLOB_REFERENCE_MESSAGE_TYPE_BY_NAME = {
  "agent.v1.ConversationPlan": ConversationPlan,
  "agent.v1.ConversationStateStructure": ConversationStateStructure,
  "agent.v1.ConversationStep": ConversationStep,
  "agent.v1.ConversationSummary": ConversationSummary,
  "agent.v1.ConversationSummaryArchive": ConversationSummaryArchive,
  "agent.v1.ConversationTurnStructure": ConversationTurnStructure,
  "agent.v1.FileState": FileState,
  "agent.v1.InvocationContext": InvocationContext,
  "agent.v1.RequestContextMcpsPart": RequestContextMcpsPart,
  "agent.v1.RequestContextRulesPart": RequestContextRulesPart,
  "agent.v1.RequestContextSkillsPart": RequestContextSkillsPart,
  "agent.v1.RequestContextSubagentsPart": RequestContextSubagentsPart,
  "agent.v1.SelectedGitPRDiffSelection": SelectedGitPRDiffSelection,
  "agent.v1.SelectedPullRequest": SelectedPullRequest,
  "agent.v1.ShellCommand": ShellCommand,
  "agent.v1.ShellOutput": ShellOutput,
  "agent.v1.SubagentPersistedState": SubagentPersistedState,
  "agent.v1.TodoItem": TodoItem,
  "agent.v1.UserMessage": UserMessage
};
function isProtoBlobReferenceTypeName(blobReferenceType) {
  return Object.prototype.hasOwnProperty.call(BLOB_REFERENCE_MESSAGE_TYPE_BY_NAME, blobReferenceType);
}

// src/host/agent-isolation/conversation-blob-gc.ts
var LIVE_BLOB_TYPE_NAMES = {
  "agent.v1.ConversationPlan": "ConversationPlan",
  "agent.v1.ConversationStateStructure": "ConversationStateStructure",
  "agent.v1.ConversationStep": "ConversationStep",
  "agent.v1.ConversationSummary": "ConversationSummary",
  "agent.v1.ConversationSummaryArchive": "ConversationSummaryArchive",
  "agent.v1.ConversationTurnStructure": "ConversationTurnStructure",
  "agent.v1.FileState": "FileState",
  "agent.v1.InvocationContext": "InvocationContext",
  "agent.v1.RequestContextMcpsPart": "RequestContextMcpsPart",
  "agent.v1.RequestContextRulesPart": "RequestContextRulesPart",
  "agent.v1.RequestContextSkillsPart": "RequestContextSkillsPart",
  "agent.v1.RequestContextSubagentsPart": "RequestContextSubagentsPart",
  "agent.v1.SelectedGitPRDiffSelection": "SelectedGitPRDiffSelection",
  "agent.v1.SelectedPullRequest": "SelectedPullRequest",
  "agent.v1.ShellCommand": "ShellCommand",
  "agent.v1.ShellOutput": "ShellOutput",
  "agent.v1.SubagentPersistedState": "SubagentPersistedState",
  "agent.v1.TodoItem": "TodoItem",
  "agent.v1.UserMessage": "UserMessage",
  bytes: "bytes",
  json: "json",
  string: "string"
};
function liveBlobTypeNameOf(name) {
  return name == null ? void 0 : LIVE_BLOB_TYPE_NAMES[name];
}
var EDGES_NOT_WALKED_SO_REFERENTS_COLLECT = /* @__PURE__ */ new Set([
  "agent.v1.UserMessage.conversation_state_blob_id",
  "agent.v1.ConversationStateStructure.summary_archive",
  "agent.v1.ConversationStateStructure.summary_archives"
]);
function toHexId(bytes) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex");
}
function fieldValue(message, field) {
  const record = message;
  if (!isUnknownRecord(record)) return void 0;
  if (!field.oneof) return record[field.localName];
  const selection = record[field.oneof.localName];
  if (!isUnknownRecord(selection) || selection.case !== field.localName) {
    return void 0;
  }
  return selection.value;
}
function* blobIdsIn(rawValue) {
  if (rawValue instanceof Uint8Array) {
    yield rawValue;
    return;
  }
  if (Array.isArray(rawValue)) {
    for (const entry of rawValue) {
      if (entry instanceof Uint8Array) yield entry;
    }
    return;
  }
  if (rawValue != null && typeof rawValue === "object") {
    for (const entry of Object.values(rawValue)) {
      if (entry instanceof Uint8Array) yield entry;
    }
  }
}
function collectReachableBlobHexIds({
  rootBytes,
  getBlobByHexId,
  onBlobReference
}) {
  const blobTypeByHexId = /* @__PURE__ */ new Map();
  let unresolvedProtoRefs = 0;
  function visitBlobReference(blobId, blobReferenceType) {
    if (blobId.length === 0) return;
    const hexId = toHexId(blobId);
    if (blobTypeByHexId.has(hexId)) return;
    blobTypeByHexId.set(hexId, blobReferenceType);
    onBlobReference?.(hexId);
    if (!isProtoBlobReferenceTypeName(blobReferenceType)) return;
    const childBytes = getBlobByHexId(hexId);
    if (childBytes == null) {
      unresolvedProtoRefs += 1;
      return;
    }
    let child;
    try {
      child = BLOB_REFERENCE_MESSAGE_TYPE_BY_NAME[blobReferenceType].fromBinary(childBytes);
    } catch {
      unresolvedProtoRefs += 1;
      return;
    }
    visitMessage(child);
  }
  function visitMessage(message) {
    const messageType = message.getType();
    const blobFieldsByLocalName = new Map(
      (getBlobReferenceMessageMetadata(messageType.typeName)?.fields ?? []).map((field) => [
        field.localFieldName,
        field
      ])
    );
    for (const field of messageType.fields.list()) {
      const rawValue = fieldValue(message, field);
      if (rawValue == null) continue;
      const blobField = blobFieldsByLocalName.get(field.localName);
      if (blobField != null) {
        if (EDGES_NOT_WALKED_SO_REFERENTS_COLLECT.has(
          `${messageType.typeName}.${blobField.protoFieldName}`
        )) {
          continue;
        }
        for (const blobId of blobIdsIn(rawValue)) {
          visitBlobReference(blobId, blobField.blobReferenceType);
        }
        continue;
      }
      if (field.kind === "message") {
        if (field.repeated) {
          if (Array.isArray(rawValue)) {
            for (const entry of rawValue) {
              if (isMessage(entry)) visitMessage(entry);
            }
          }
        } else if (isMessage(rawValue)) {
          visitMessage(rawValue);
        }
        continue;
      }
      if (field.kind === "map" && field.V.kind === "message" && typeof rawValue === "object") {
        for (const entry of Object.values(rawValue)) {
          if (isMessage(entry)) visitMessage(entry);
        }
      }
    }
  }
  visitMessage(ConversationStateStructure.fromBinary(rootBytes));
  return { blobTypeByHexId, unresolvedProtoRefs };
}

// src/host/agent-isolation/legacy-blob-retirement.ts
var import_node_fs3 = require("node:fs");
function defer(reason) {
  return { isRetirable: false, reason, legacyRows: 0, legacyBytes: 0 };
}
function verifyLegacyBlobRetirement(options) {
  const { db, legacyBlobDbPath, retainedRootIdHex } = options;
  if (!(0, import_node_fs3.existsSync)(legacyBlobDbPath)) return defer("legacy-unreadable");
  let quickCheck;
  try {
    quickCheck = db.prepare("PRAGMA quick_check").get()?.quick_check;
  } catch {
    return defer("destination-unhealthy");
  }
  if (quickCheck !== "ok") return defer("destination-unhealthy");
  switch (readConversationBlobMigrationState(db)) {
    case "adoption-complete":
      break;
    case "unstarted":
      return defer("adoption-incomplete");
    case "recovery-rebuilt":
      return defer("recovery-rebuilt");
    default:
      return defer("migration-state-unknown");
  }
  const root = db.prepare("SELECT 1 AS present FROM blobs WHERE id = ?").get(retainedRootIdHex);
  if (root == null) return defer("root-missing");
  let isAttached = false;
  try {
    db.prepare("ATTACH DATABASE ? AS legacy").run(legacyBlobDbPath);
    isAttached = true;
    const totals = db.prepare("SELECT count(*) AS rows, coalesce(sum(length(data)), 0) AS bytes FROM legacy.blobs").get();
    return {
      isRetirable: true,
      legacyRows: Number(totals?.rows ?? 0),
      legacyBytes: Number(totals?.bytes ?? 0)
    };
  } catch {
    return defer("legacy-unreadable");
  } finally {
    if (isAttached) {
      try {
        db.exec("DETACH DATABASE legacy");
      } catch {
      }
    }
  }
}

// src/host/agent-isolation/conversation-blob-store.ts
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

// src/host/agent-isolation/agent-store-worker.ts
function post(message, transfer = []) {
  import_node_worker_threads.parentPort?.postMessage(message, transfer);
}
function transferableBuffers(views) {
  const buffers = [];
  for (const view of views) {
    if (view !== void 0 && view.buffer instanceof ArrayBuffer) buffers.push(view.buffer);
  }
  return buffers;
}
function main() {
  const port = import_node_worker_threads.parentPort;
  invariant(port != null, "agent-store-worker must run as a worker_thread");
  const boot = import_node_worker_threads.workerData;
  let store;
  try {
    store = new ConversationBlobStoreDb({
      agentId: boot.agentId,
      blobDbPath: boot.blobDbPath,
      busyTimeoutMs: boot.busyTimeoutMs ?? 5e3,
      ...boot.legacyBlobDbPath != null ? { legacyBlobDbPath: boot.legacyBlobDbPath } : {},
      log: (message) => void process.stderr.write(`${message}
`)
    });
  } catch (error) {
    let code = "error";
    if (error instanceof ConversationBlobRecoveryError) {
      code = error.code;
    } else if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
      code = error.code;
    }
    const detail = error instanceof ConversationBlobRecoveryError ? ` detail=${error.message}` : "";
    console.error(
      `[agent-store-worker] failed to open blob db: agent=${boot.agentId} code=${code}${detail}`
    );
    process.exit(1);
    return;
  }
  port.on("message", (request) => {
    try {
      switch (request.kind) {
        case "init": {
          post({
            kind: "init-ok",
            requestId: request.requestId,
            threadId: import_node_worker_threads.threadId,
            pid: process.pid
          });
          return;
        }
        case "set-blob": {
          store.setBlob(request.blobId, request.blobData);
          post({ kind: "set-blob-ok", requestId: request.requestId });
          return;
        }
        case "get-blob": {
          const blobData = store.getBlob(request.blobId);
          if (blobData == null) {
            post({
              kind: "get-blob-ok",
              requestId: request.requestId,
              blobData: void 0
            });
            return;
          }
          const copy = new Uint8Array(blobData.byteLength);
          copy.set(blobData);
          post(
            {
              kind: "get-blob-ok",
              requestId: request.requestId,
              blobData: copy
            },
            [copy.buffer]
          );
          return;
        }
        case "find-latest-root": {
          post({
            kind: "find-latest-root-ok",
            requestId: request.requestId,
            rootId: store.findLatestRootBlobId()
          });
          return;
        }
        case "clear-blobs": {
          store.clearBlobs();
          post({ kind: "clear-blobs-ok", requestId: request.requestId });
          return;
        }
        case "clear-stale-roots": {
          post({
            kind: "clear-stale-roots-ok",
            requestId: request.requestId,
            deleted: store.clearStaleCheckpointRoots(request.retainedRootIdHex)
          });
          return;
        }
        case "collect-garbage": {
          post({
            kind: "collect-garbage-ok",
            requestId: request.requestId,
            result: store.collectGarbage({
              retainedRootIdHex: request.retainedRootIdHex,
              pendingWriteRetentionMs: request.pendingWriteRetentionMs
            })
          });
          return;
        }
        case "walk-export-closure": {
          const result = store.walkExportClosure(
            request.retainedRootIdHex,
            {
              maxClosureBytes: request.maxClosureBytes,
              maxClosureBlobs: request.maxClosureBlobs
            },
            (progress) => {
              post({
                kind: "walk-export-closure-progress",
                requestId: request.requestId,
                progress
              });
            }
          );
          post(
            { kind: "walk-export-closure-ok", requestId: request.requestId, result },
            transferableBuffers(result.outcome === "walked" ? [result.rootBytes] : [])
          );
          return;
        }
        case "get-blobs": {
          const blobs = store.getBlobsByHexIds(request.blobIdsHex);
          post(
            { kind: "get-blobs-ok", requestId: request.requestId, blobs },
            transferableBuffers(blobs)
          );
          return;
        }
        case "verify-legacy-blob-retirement": {
          post({
            kind: "verify-legacy-blob-retirement-ok",
            requestId: request.requestId,
            verdict: store.verifyLegacyBlobRetirement(
              request.retainedRootIdHex,
              request.legacyBlobDbPath
            )
          });
          return;
        }
        case "flush": {
          post({ kind: "flush-ok", requestId: request.requestId });
          return;
        }
        case "close": {
          store.close();
          post({ kind: "close-ok", requestId: request.requestId });
          port.close();
          return;
        }
      }
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : void 0;
      post({
        kind: "error",
        requestId: request.requestId,
        message: error instanceof Error ? error.message : String(error),
        ...error instanceof Error ? { name: error.name } : {},
        ...code != null ? { code } : {}
      });
    }
  });
}
main();
