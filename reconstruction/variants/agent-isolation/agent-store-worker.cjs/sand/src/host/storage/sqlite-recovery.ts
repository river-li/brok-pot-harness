/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/storage/sqlite-recovery.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs = require("node:fs");
var import_node_sqlite2 = require("node:sqlite");

// @recovered-fragment 2/2
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

