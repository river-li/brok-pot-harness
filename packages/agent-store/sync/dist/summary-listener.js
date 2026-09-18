var import_node_crypto3 = require("node:crypto");
function notifySummaryResult({ agentId, summary, listener, pathHashSalt }) {
  if (listener === void 0) {
    return;
  }
  let firstError;
  for (const error41 of summary.errors) {
    try {
      dispatchError({ agentId, error: error41, listener, pathHashSalt });
    } catch (err) {
      if (firstError === void 0) {
        firstError = err;
      }
    }
  }
  if (firstError !== void 0) {
    throw firstError;
  }
}
function dispatchError({ agentId, error: error41, listener, pathHashSalt }) {
  if (error41.code === "symlink_refused" || error41.code === "toctou_swap_refused") {
    safeNotifyListener(listener, "onSymlinkRefused", {
      agentId,
      op: "fs_read",
      relPathHash: hashRelPath({
        relPath: error41.relPath,
        salt: requirePathHashSalt(pathHashSalt)
      })
    });
    return;
  }
  if (looksLikeDiskFull(error41)) {
    safeNotifyListener(listener, "onDiskFull", {
      agentId,
      op: error41.code === "fs_read_failed" ? "fs_read" : "fs_write"
    });
    return;
  }
}
function hashRelPath({ relPath, salt }) {
  return (0, import_node_crypto3.createHash)("sha256").update(salt).update("\0").update(relPath !== null && relPath !== void 0 ? relPath : "<unknown>").digest("hex").slice(0, 32);
}
function requirePathHashSalt(pathHashSalt) {
  if (pathHashSalt === void 0 || pathHashSalt.length === 0) {
    throw new Error("notifySummaryResult: pathHashSalt is required when emitting symlink-refused events");
  }
  return pathHashSalt;
}
function looksLikeDiskFull(error41) {
  return error41.code === "fs_write_failed" || error41.code === "fs_read_failed";
}
function notifySummaryMetrics({ agentId, summary, listener, metricsEmitter, pathHashSalt }) {
  let firstError;
  if (metricsEmitter !== void 0) {
    try {
      emitMetrics({ agentId, summary, metricsEmitter, pathHashSalt });
    } catch (err) {
      firstError = err;
    }
  }
  try {
    notifySummaryResult({ agentId, summary, listener, pathHashSalt });
  } catch (err) {
    if (firstError === void 0) {
      firstError = err;
    }
  }
  if (firstError !== void 0) {
    throw firstError;
  }
}
function emitMetrics({ agentId, summary, metricsEmitter, pathHashSalt }) {
  var _a19;
  let firstError;
  const recordError = (err) => {
    if (firstError === void 0) {
      firstError = err;
    }
  };
  try {
    (_a19 = metricsEmitter.onRoundCompleted) === null || _a19 === void 0 ? void 0 : _a19.call(metricsEmitter, buildRoundCompletedEvent({ agentId, summary }));
  } catch (err) {
    recordError(err);
  }
  const metricsSalt = pathHashSalt !== void 0 && pathHashSalt.length > 0 ? pathHashSalt : void 0;
  if (metricsEmitter.onError !== void 0) {
    for (const error41 of summary.errors) {
      const event = Object.assign({ agentId, op: opForCode(error41.code), errorClass: error41.code, relPathHash: error41.relPath === void 0 || metricsSalt === void 0 ? void 0 : hashRelPath({ relPath: error41.relPath, salt: metricsSalt }) }, error41.timeoutClass === void 0 ? {} : { timeoutClass: error41.timeoutClass });
      try {
        metricsEmitter.onError(event);
      } catch (err) {
        recordError(err);
      }
    }
  }
  if (metricsEmitter.onConflict !== void 0 && summary.conflicts.length > 0) {
    const storeKind = classifyAgentStoreSourceId(agentId);
    for (const conflict of summary.conflicts) {
      const event = {
        agentId,
        storeKind,
        relPathHash: metricsSalt === void 0 ? void 0 : hashRelPath({ relPath: conflict.relPath, salt: metricsSalt }),
        conflictRelPathHash: metricsSalt === void 0 ? void 0 : hashRelPath({
          relPath: conflict.conflictRelPath,
          salt: metricsSalt
        })
      };
      try {
        metricsEmitter.onConflict(event);
      } catch (err) {
        recordError(err);
      }
    }
  }
  if (firstError !== void 0) {
    throw firstError;
  }
}
function opForCode(code) {
  switch (code) {
    case "symlink_refused":
    case "toctou_swap_refused":
    case "fs_read_failed":
      return "fs_read";
    case "fs_write_failed":
      return "fs_write";
    case "upload_failed":
    case "write_conflict":
      return "blob_put";
    case "delete_failed":
      return "delete_files";
    case "download_failed":
      return "blob_get";
    // The remaining codes (`case_collision`, `file_too_large`,
    // `presign_response_mismatch`, `presigned_url_rejected`,
    // `not_regular_file`, `sha_mismatch`) are raised from both push and pull paths,
    // so we cannot honestly attribute them to a single op without
    // additional engine context.
    default:
      return "unknown";
  }
}
