/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agent-isolation/conversation-blob-db.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs2 = require("node:fs");
var import_node_path = require("node:path");
var import_node_sqlite3 = require("node:sqlite");

// @recovered-fragment 2/2
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

