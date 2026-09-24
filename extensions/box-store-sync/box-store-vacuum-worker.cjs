const __mod=require('node:module');const __p=require('node:path');const __depsDir=__p.join(__dirname,'..','deps');process.env.NODE_PATH=__depsDir+(process.env.NODE_PATH?__p.delimiter+process.env.NODE_PATH:'');__mod.Module._initPaths();const __import_meta_url=require('node:url').pathToFileURL(__filename).href;
"use strict";

// src/host/extensions/box-store-sync/box-store-vacuum-worker.ts
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

// src/host/extensions/box-store-sync/sqlite-snapshot.ts
var import_node_sqlite2 = require("node:sqlite");

// src/shared/errors/bounded.ts
function brandedEnumOf(values, fallback) {
  const admitted = new Set(values);
  return (value) => {
    if (value === void 0) return void 0;
    return admitted.has(value) ? value : fallback;
  };
}
var CONNECT_CODE_TAGS = [
  "Canceled",
  "Unknown",
  "InvalidArgument",
  "DeadlineExceeded",
  "NotFound",
  "AlreadyExists",
  "PermissionDenied",
  "ResourceExhausted",
  "FailedPrecondition",
  "Aborted",
  "OutOfRange",
  "Unimplemented",
  "Internal",
  "Unavailable",
  "DataLoss",
  "Unauthenticated"
];
var CONNECT_CODE_FALLBACK = "Other";
var brandedConnectCode = brandedEnumOf(CONNECT_CODE_TAGS, CONNECT_CODE_FALLBACK);
var SAND_ERRNO_TAGS = [
  "ECONNREFUSED",
  "ECONNRESET",
  "ECONNABORTED",
  "ETIMEDOUT",
  "EPIPE",
  "ENETRESET",
  "ENETDOWN",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "EHOSTDOWN",
  "EAI_AGAIN",
  "ENOTFOUND",
  "EADDRINUSE",
  "EACCES",
  "EPERM",
  "ENOENT",
  "ENOSPC",
  "EDQUOT",
  "EROFS",
  "EBUSY",
  "EMFILE",
  "EIO"
];
var SAND_ERRNO_FALLBACK = "E_OTHER";
var brandedErrno = brandedEnumOf(SAND_ERRNO_TAGS, SAND_ERRNO_FALLBACK);
var BOUNDED_TELEMETRY_ERROR_NAMES = [
  "Error",
  "TypeError",
  "AbortError",
  "DeadlineExceededError",
  "ConnectError"
];
var BOUNDED_TELEMETRY_TOKENS = [
  "client-paused",
  "away-park",
  "dev-induced-offline",
  "network-return",
  "unknown",
  "cold_create",
  "first_connect",
  "manual_update",
  "manual_reset",
  "auto_update",
  "remote_reset",
  "reconnect",
  ...BOUNDED_TELEMETRY_ERROR_NAMES,
  ...BOUNDED_TELEMETRY_ERROR_NAMES.flatMap(
    (name) => SAND_ERRNO_TAGS.map((errno) => `${name}/${errno}`)
  )
];
var brandedTelemetryToken = brandedEnumOf(BOUNDED_TELEMETRY_TOKENS, "unknown");

// ../dune/scheduling/dist/internal/policies.js
var JITTER_SPREAD = { none: 0, equal: 1 / 2, full: 1 };

// src/host/storage/store-db.ts
var import_node_sqlite = require("node:sqlite");
var DB_BUSY_TIMEOUT_MS = 5e3;

// src/host/extensions/box-store-sync/sqlite-snapshot.ts
function sqliteVacuumInto(srcPath, destPath, busyTimeoutMs = DB_BUSY_TIMEOUT_MS) {
  const db = new import_node_sqlite2.DatabaseSync(srcPath, { readOnly: true });
  try {
    db.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}`);
    db.exec(`VACUUM INTO '${destPath.replace(/'/g, "''")}'`);
  } finally {
    db.close();
  }
}

// src/host/extensions/box-store-sync/box-store-vacuum-worker.ts
var port = import_node_worker_threads.parentPort;
invariant(port != null, "box-store-vacuum-worker must run as a worker_thread");
port.on("message", (job) => {
  try {
    sqliteVacuumInto(job.srcPath, job.destPath, job.busyTimeoutMs);
    port.postMessage({ ok: true });
  } catch (error) {
    port.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
});
