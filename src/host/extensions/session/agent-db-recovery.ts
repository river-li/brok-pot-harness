var SandAgentDbIntegrityError = class extends SandDomainError {
  name = "SandAgentDbIntegrityError";
};
function openConfiguredDb(dbPath, agentDirName, options2, hasOtherLiveHandles, initDb = initConfiguredDb) {
  const recover = (options2.recoverOnCorruption ?? true) && !hasOtherLiveHandles;
  const rejectIfCorrupt = options2.rejectIfCorrupt ?? false;
  let db;
  let openError;
  for (let attempt = 0; attempt < 2 && db === void 0; attempt += 1) {
    try {
      db = initDb(dbPath, agentDirName, options2);
    } catch (error41) {
      openError = error41;
      if (!isSqliteIoError(error41) || attempt > 0) break;
      reportSessionDiagnostic({
        family: "store_db",
        kind: "open_io_retry",
        agentId: agentDirName,
        errorClass: errorLogTag(error41)
      });
    }
  }
  if (db === void 0) {
    if (recover && isSqliteCorruptError(openError)) {
      return recoverCorruptStoreDb(dbPath, agentDirName, options2, openError);
    }
    throw openError;
  }
  const verify = (recover || rejectIfCorrupt) && (options2.verifyIntegrityOnOpen ?? true);
  if (verify && !isStoreDbHealthy(db)) {
    try {
      db.close();
    } catch {
    }
    if (recover) {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "quick_check_failed",
        agentId: agentDirName
      });
      return recoverCorruptStoreDb(
        dbPath,
        agentDirName,
        options2,
        new Error("PRAGMA quick_check failed")
      );
    }
    throw new SandAgentDbIntegrityError(`store.db failed integrity check for ${agentDirName}`);
  }
  return db;
}
function isStoreDbHealthy(db) {
  try {
    const row = db.prepare("PRAGMA quick_check").get();
    return row?.quick_check === "ok";
  } catch {
    return false;
  }
}
function initConfiguredDb(dbPath, agentDirName, options2) {
  const db = new import_node_sqlite5.DatabaseSync(dbPath);
  try {
    db.exec(`PRAGMA busy_timeout = ${options2.busyTimeoutMs ?? DB_BUSY_TIMEOUT_MS}`);
    try {
      db.exec("PRAGMA journal_mode = WAL");
      db.exec("PRAGMA synchronous = NORMAL");
    } catch (error41) {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "wal_unavailable",
        agentId: agentDirName,
        errorClass: errorLogTag(error41)
      });
    }
    db.exec(SCHEMA);
    return db;
  } catch (error41) {
    try {
      db.close();
    } catch {
    }
    throw error41;
  }
}
function recoverCorruptStoreDb(dbPath, agentDirName, options2, cause) {
  reportSessionDiagnostic({
    family: "store_db",
    kind: "corrupt_recovering",
    agentId: agentDirName,
    errorClass: errorLogTag(cause)
  });
  const quarantinePath = quarantineCorruptDb(dbPath, agentDirName);
  const freshDb = initConfiguredDb(dbPath, agentDirName, options2);
  const salvaged = quarantinePath != null ? salvageStoreDb(quarantinePath, freshDb) : { kv: 0, blobs: 0, transcript: 0, automationCompletions: 0 };
  const salvagedTotal = salvaged.kv + salvaged.blobs + salvaged.transcript + salvaged.automationCompletions;
  const outcome = salvagedTotal > 0 ? "recovered" : "reset";
  reportSessionDiagnostic({
    family: "store_db",
    kind: "recovery_outcome",
    agentId: agentDirName,
    outcome,
    quarantine: quarantinePath != null ? "preserved" : "none",
    salvagedKv: salvaged.kv,
    salvagedBlobs: salvaged.blobs,
    salvagedTranscript: salvaged.transcript,
    salvagedAutomationCompletions: salvaged.automationCompletions
  });
  try {
    options2.onCorruptionRecovered?.({ outcome, quarantinePath, salvaged });
  } catch {
  }
  publishTranscriptMutation({
    kind: "agent-needs-reindex",
    agentId: agentDirName
  });
  return freshDb;
}
function quarantineCorruptDb(dbPath, agentDirName) {
  const result = quarantineCorruptSqliteDb({ dbPath });
  if (result.renameErrorCode == null) return result.quarantinePath;
  if (result.quarantinePath == null) {
    reportSessionDiagnostic({
      family: "store_db",
      kind: "quarantine_rename_failed",
      agentId: agentDirName,
      errorClass: result.renameErrorCode
    });
    return null;
  }
  reportSessionDiagnostic({
    family: "store_db",
    kind: "quarantine_copied",
    agentId: agentDirName,
    errorClass: result.renameErrorCode
  });
  return result.quarantinePath;
}
function salvageStoreDb(sourcePath, freshDb) {
  const counts = { kv: 0, blobs: 0, transcript: 0, automationCompletions: 0 };
  const source = openSqliteForSalvage({ dbPath: sourcePath });
  if (source == null) return counts;
  try {
    counts.kv = copySalvageableSqliteRows(
      source,
      "SELECT key, value FROM kv",
      freshDb.prepare("INSERT OR IGNORE INTO kv (key, value) VALUES (?, ?)"),
      (row) => [row.key, row.value]
    );
    counts.blobs = copySalvageableSqliteRows(
      source,
      "SELECT id, data FROM blobs",
      freshDb.prepare("INSERT OR IGNORE INTO blobs (id, data) VALUES (?, ?)"),
      (row) => [row.id, row.data]
    );
    counts.transcript = copySalvageableSqliteRows(
      source,
      "SELECT seq, id, entry FROM transcript_entries",
      freshDb.prepare("INSERT OR IGNORE INTO transcript_entries (seq, id, entry) VALUES (?, ?, ?)"),
      (row) => [row.seq, row.id, row.entry]
    );
    counts.automationCompletions = copySalvageableSqliteRows(
      source,
      "SELECT seq, id, text, attribution, acknowledged FROM automation_completion_inbox",
      freshDb.prepare(
        "INSERT OR IGNORE INTO automation_completion_inbox (seq, id, text, attribution, acknowledged) VALUES (?, ?, ?, ?, ?)"
      ),
      (row) => [row.seq, row.id, row.text, row.attribution, row.acknowledged]
    );
  } finally {
    try {
      source.close();
    } catch {
    }
  }
  return counts;
}
