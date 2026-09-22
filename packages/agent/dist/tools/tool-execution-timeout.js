/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/tool-execution-timeout.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var LONG_RUNNING_TOOL_NAMES = /* @__PURE__ */ new Set(["task", "mcp_task", "subagent"]);
var EXTRA_SHORT_TOOL_TIMEOUT_MS = 5 * 60 * 1e3;
var SHORT_TOOL_TIMEOUT_MS = 15 * 60 * 1e3;
var MEDIUM_TOOL_TIMEOUT_MS = 30 * 60 * 1e3;
var LONG_TOOL_TIMEOUT_MS = 60 * 60 * 1e3;
var EXTRA_LONG_TOOL_TIMEOUT_MS = 2 * 60 * 60 * 1e3;
var BACKGROUND_SHELL_DEFAULT_BLOCK_UNTIL_MS = 10 * 60 * 1e3;
var FusedStepGuardTimeoutError = class extends Error {
  constructor(fuseGuardMs) {
    super(`Fused model/tool step exceeded guard timeout after ${Math.round(fuseGuardMs / 1e3)} seconds`);
    this.name = "FusedStepGuardTimeoutError";
    this.fuseGuardMs = fuseGuardMs;
  }
};
function isFusedStepGuardTimeoutReason(reason) {
  return reason instanceof FusedStepGuardTimeoutError || reason instanceof Error && reason.name === "FusedStepGuardTimeoutError" && typeof reason.fuseGuardMs === "number";
}
var TIMEOUT_BUFFER_MS = 60 * 1e3;
var TOOL_CALL_TIMEOUT_TIERS_MS = [
  EXTRA_SHORT_TOOL_TIMEOUT_MS,
  SHORT_TOOL_TIMEOUT_MS,
  MEDIUM_TOOL_TIMEOUT_MS,
  LONG_TOOL_TIMEOUT_MS,
  EXTRA_LONG_TOOL_TIMEOUT_MS
];
var TOOL_CALL_GUARD_HEADROOM_MS = 60 * 1e3;
var TOOL_CALL_GUARD_BLOCK_GRACE_MS = 30 * 1e3;
var MAX_AWAIT_BLOCK_UNTIL_MS = EXTRA_LONG_TOOL_TIMEOUT_MS - TIMEOUT_BUFFER_MS;
function parseBlockUntilMs(args) {
  if (args === null || args === void 0) {
    return void 0;
  }
  let parsed2;
  if (typeof args === "string") {
    try {
      parsed2 = JSON.parse(args);
    } catch {
      return void 0;
    }
  } else {
    parsed2 = args;
  }
  if (typeof parsed2 !== "object" || parsed2 === null) {
    return void 0;
  }
  const raw = parsed2["block_until_ms"];
  return typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : void 0;
}
function isSubagentToolName(toolName) {
  return LONG_RUNNING_TOOL_NAMES.has(toolName.toLowerCase());
}
function suggestedToolTimeoutMs(toolName, args) {
  if (isSubagentToolName(toolName)) {
    return LONG_TOOL_TIMEOUT_MS;
  }
  const blockMs = parseBlockUntilMs(args);
  return blockMs === void 0 ? SHORT_TOOL_TIMEOUT_MS : Math.max(0, blockMs + TIMEOUT_BUFFER_MS);
}
function pickToolCallTimeoutTierMs(suggestedMs) {
  return TOOL_CALL_TIMEOUT_TIERS_MS.find((tierMs) => tierMs >= suggestedMs) ?? EXTRA_LONG_TOOL_TIMEOUT_MS;
}
function toolCallExecutionGuardMs(toolName, args) {
  const tierMs = pickToolCallTimeoutTierMs(suggestedToolTimeoutMs(toolName, args));
  const tierHeadroomMs = tierMs - TOOL_CALL_GUARD_HEADROOM_MS;
  const blockMs = parseBlockUntilMs(args);
  if (blockMs === void 0) {
    return tierHeadroomMs;
  }
  const requestedMs = Math.max(tierHeadroomMs, blockMs + TOOL_CALL_GUARD_BLOCK_GRACE_MS);
  return requestedMs >= tierMs ? tierHeadroomMs : requestedMs;
}
function buildToolCallExecutionTimedOutMessage({ toolName, executionTimeoutMs }) {
  const shellHint = toolName.toLowerCase() === "shell" ? " For long-running commands, re-run with block_until_ms set to a small value (or 0) so the command runs in the background, then poll its output instead of blocking on it." : "";
  return executionTimeoutMs === 0 ? `The ${toolName} tool call could not start because activity setup exceeded the per-call time limit. The execution environment may be slow or overloaded.${shellHint}` : `The ${toolName} tool call timed out after ${Math.round(executionTimeoutMs / 1e3)} seconds and was terminated. The execution environment may be unresponsive, or the operation needs longer than the per-call time limit.${shellHint}`;
}

