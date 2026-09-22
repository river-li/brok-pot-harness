/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/storage/sqlite-recovery.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs78 = require("node:fs");
var import_node_sqlite4 = require("node:sqlite");
init_unknown_record();
function removeSqliteSidecars(dbPath) {
  for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
    try {
      (0, import_node_fs78.rmSync)(`${dbPath}${suffix}`, { force: true, recursive: true });
    } catch {
    }
  }
}
function removePathWithRetries(options2) {
  const attempts2 = Math.max(1, options2.attempts ?? 1);
  let removeError;
  for (let attempt = 0; attempt < attempts2; attempt += 1) {
    try {
      (0, import_node_fs78.rmSync)(options2.path, {
        force: true,
        recursive: options2.recursive === true
      });
      removeError = void 0;
      break;
    } catch (error42) {
      removeError = error42;
      if (attempt < attempts2 - 1) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, options2.retryDelayMs ?? 50);
      }
    }
  }
  if (removeError != null) throw removeError;
}
function removeSqliteDb(options2) {
  removePathWithRetries({
    path: options2.dbPath,
    attempts: options2.attempts,
    retryDelayMs: options2.retryDelayMs
  });
  for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
    removePathWithRetries({
      path: `${options2.dbPath}${suffix}`,
      attempts: options2.attempts,
      retryDelayMs: options2.retryDelayMs,
      recursive: true
    });
  }
}
function quarantineCorruptSqliteDb(options2) {
  const { dbPath } = options2;
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const quarantinePath = options2.quarantinePath ?? `${dbPath}.corrupt-${stamp}`;
  try {
    (0, import_node_fs78.rmSync)(quarantinePath, { force: true });
    removeSqliteSidecars(quarantinePath);
  } catch {
  }
  try {
    (0, import_node_fs78.renameSync)(dbPath, quarantinePath);
  } catch (error42) {
    const renameErrorCode = error42.code ?? "error";
    let copied = false;
    try {
      (0, import_node_fs78.copyFileSync)(dbPath, quarantinePath);
      copied = true;
      for (const suffix of SQLITE_DB_SIDECAR_SUFFIXES) {
        const sidecar = `${dbPath}${suffix}`;
        if ((0, import_node_fs78.existsSync)(sidecar)) {
          try {
            (0, import_node_fs78.copyFileSync)(sidecar, `${quarantinePath}${suffix}`);
          } catch {
          }
        }
      }
    } catch {
      if (options2.preserveSourceOnCopyFailure === true) {
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
      attempts: options2.removeAttempts,
      retryDelayMs: options2.removeRetryDelayMs
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
      if ((0, import_node_fs78.existsSync)(sidecar)) {
        (0, import_node_fs78.renameSync)(sidecar, `${quarantinePath}${suffix}`);
      }
    } catch {
      (0, import_node_fs78.rmSync)(`${dbPath}${suffix}`, { force: true });
    }
  }
  return { quarantinePath, copied: false, renameErrorCode: null };
}
function openSqliteForSalvage(options2) {
  const { dbPath } = options2;
  if (!(0, import_node_fs78.existsSync)(dbPath)) return void 0;
  const open9 = () => {
    const db = new import_node_sqlite4.DatabaseSync(dbPath);
    try {
      if (options2.busyTimeoutMs != null) {
        db.exec(`PRAGMA busy_timeout = ${options2.busyTimeoutMs}`);
      }
      db.prepare("PRAGMA schema_version").get();
      return db;
    } catch (error42) {
      try {
        db.close();
      } catch {
      }
      throw error42;
    }
  };
  try {
    return open9();
  } catch (error42) {
    if (!isSqliteIoError(error42) && !isSqliteCantOpenError(error42) && !isSqliteCorruptError(error42)) {
      return void 0;
    }
    removeSqliteSidecars(dbPath);
    try {
      return open9();
    } catch (retryError) {
      if (isSqliteCorruptError(retryError)) {
        try {
          return new import_node_sqlite4.DatabaseSync(dbPath);
        } catch (error43) {
          reportFallback("sqlite_recovery", error43);
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

