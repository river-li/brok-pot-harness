function sqliteVacuumInto(srcPath, destPath, busyTimeoutMs = DB_BUSY_TIMEOUT_MS) {
  const db = new import_node_sqlite2.DatabaseSync(srcPath, { readOnly: true });
  try {
    db.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}`);
    db.exec(`VACUUM INTO '${destPath.replace(/'/g, "''")}'`);
  } finally {
    db.close();
  }
}
var LOCKED_DB_COPY_ATTEMPTS = 3;
function classifySqliteSnapshotFailure(error41, operation, pathStage) {
  const candidate = error41?.errcode;
  const sqliteCode = typeof candidate === "number" && Number.isSafeInteger(candidate) && candidate >= 0 ? candidate : void 0;
  const systemErrno = sqliteCode === void 0 ? findSystemErrno(error41) : void 0;
  const errno = brandedErrno(systemErrno);
  const primarySqliteCode = sqliteCode === void 0 ? void 0 : sqliteCode & 255;
  const isCapacityFailure = systemErrno === "ENOSPC" || systemErrno === "EDQUOT" || primarySqliteCode === 13;
  let resolvedPathStage = pathStage;
  if (operation === "vacuum_into" && isCapacityFailure) {
    resolvedPathStage = "staged_main";
  } else if (operation === "copy_source_sidecars" && isCapacityFailure) {
    resolvedPathStage = "staged_sidecars";
  } else if (operation === "vacuum_into" && (isSqliteBusyError(error41) || isSqliteCorruptError(error41))) {
    resolvedPathStage = "source_main";
  }
  let errorClass = "unknown";
  if (error41 instanceof TypeError) errorClass = "TypeError";
  else if (error41 instanceof RangeError) errorClass = "RangeError";
  else if (error41 instanceof Error) errorClass = "Error";
  let cause = "unknown";
  if (isSqliteBusyError(error41)) cause = "busy";
  else if (isSqliteIoError(error41)) cause = "io";
  else if (isSqliteCorruptError(error41)) cause = "corrupt";
  else if (isSqliteCantOpenError(error41)) cause = "cant_open";
  else if (sqliteCode !== void 0) cause = "sqlite";
  else if (errno !== void 0) cause = "system";
  else if (error41 instanceof Error) cause = "error";
  return {
    operation,
    pathStage: resolvedPathStage,
    cause,
    errorClass,
    ...errno === void 0 ? {} : { errno },
    ...sqliteCode === void 0 ? {} : { sqliteCode }
  };
}
function copyLockedSqliteDb(args) {
  const { srcPath, destPath } = args;
  const readFile38 = args.readFile ?? import_node_fs15.readFileSync;
  let lastFailure = {
    operation: "prepare_staged",
    pathStage: "staged_main",
    cause: "unknown",
    errorClass: "unknown"
  };
  for (let attempt = 1; attempt <= LOCKED_DB_COPY_ATTEMPTS; attempt += 1) {
    let verified = false;
    let attemptFailure;
    let db;
    let operation = "prepare_staged";
    let pathStage = "staged_main";
    try {
      (0, import_node_fs15.rmSync)(destPath, { force: true });
      pathStage = "staged_sidecars";
      for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
        (0, import_node_fs15.rmSync)(`${destPath}${suffix}`, { force: true });
      }
      operation = "read_source_main";
      pathStage = "source_main";
      const mainBytes = readFile38(srcPath);
      operation = "write_staged_main";
      pathStage = "staged_main";
      (0, import_node_fs15.writeFileSync)(destPath, mainBytes);
      operation = "copy_source_sidecars";
      pathStage = "source_and_staged_sidecars";
      for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
        const sidecar = `${srcPath}${suffix}`;
        if ((0, import_node_fs15.existsSync)(sidecar)) (0, import_node_fs15.copyFileSync)(sidecar, `${destPath}${suffix}`);
      }
      operation = "verify_source_stability";
      pathStage = "source_main";
      if (!readFile38(srcPath).equals(mainBytes)) {
        attemptFailure = {
          operation,
          pathStage,
          cause: "source_changed",
          errorClass: "none"
        };
      } else {
        operation = "open_staged";
        pathStage = "staged_main";
        db = new import_node_sqlite2.DatabaseSync(destPath);
        operation = "checkpoint_staged";
        db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
        operation = "set_staged_journal_mode";
        db.exec("PRAGMA journal_mode=DELETE");
        operation = "quick_check_staged";
        const row = db.prepare("PRAGMA quick_check").get();
        verified = row?.quick_check === "ok";
        if (!verified) {
          attemptFailure = {
            operation,
            pathStage,
            cause: "quick_check_failed",
            errorClass: "none"
          };
        }
      }
    } catch (error41) {
      attemptFailure = classifySqliteSnapshotFailure(error41, operation, pathStage);
      verified = false;
    } finally {
      try {
        db?.close();
      } catch (error41) {
        verified = false;
        attemptFailure ??= classifySqliteSnapshotFailure(error41, "close_staged", "staged_main");
      }
      for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
        try {
          (0, import_node_fs15.rmSync)(`${destPath}${suffix}`, { force: true });
        } catch (error41) {
          verified = false;
          attemptFailure ??= classifySqliteSnapshotFailure(
            error41,
            "cleanup_staged",
            "staged_sidecars"
          );
        }
      }
      if (!verified) {
        try {
          (0, import_node_fs15.rmSync)(destPath, { force: true });
        } catch (error41) {
          attemptFailure ??= classifySqliteSnapshotFailure(error41, "cleanup_staged", "staged_main");
        }
      }
    }
    if (verified && attemptFailure === void 0) return true;
    if (attemptFailure !== void 0) lastFailure = attemptFailure;
  }
  args.onFailure?.(lastFailure);
  return false;
}
