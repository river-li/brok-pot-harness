/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/interrupted-shell-output.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAX_SHELL_SNAPSHOT_CHARS = 2e4;
var MAX_SHELL_SNAPSHOT_COUNT = 100;
var shellOutputSnapshots = /* @__PURE__ */ new Map();
function ensureSnapshotCapacity(toolCallId) {
  if (shellOutputSnapshots.has(toolCallId) || shellOutputSnapshots.size < MAX_SHELL_SNAPSHOT_COUNT) {
    return;
  }
  const oldestKey = shellOutputSnapshots.keys().next().value;
  if (oldestKey !== void 0) {
    shellOutputSnapshots.delete(oldestKey);
  }
}
function startInterruptedShellOutputSnapshot(toolCallId) {
  ensureSnapshotCapacity(toolCallId);
  shellOutputSnapshots.set(toolCallId, "");
}
function appendInterruptedShellOutputSnapshot(toolCallId, output) {
  if (output.length === 0) {
    return;
  }
  const existing = shellOutputSnapshots.get(toolCallId);
  if (existing === void 0) {
    ensureSnapshotCapacity(toolCallId);
    shellOutputSnapshots.set(toolCallId, output.slice(-MAX_SHELL_SNAPSHOT_CHARS));
    return;
  }
  shellOutputSnapshots.set(toolCallId, `${existing}${output}`.slice(-MAX_SHELL_SNAPSHOT_CHARS));
}
function getInterruptedShellOutputSnapshot(toolCallId) {
  return shellOutputSnapshots.get(toolCallId);
}
function clearInterruptedShellOutputSnapshot(toolCallId) {
  shellOutputSnapshots.delete(toolCallId);
}

