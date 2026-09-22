/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/codebase-telemetry/dist/feature-gates.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CodebaseTelemetryFeatureGate = {
  /**
   * Main gate: enables Codebase Telemetry V2, subject to authentication
   * and privacy mode.
   */
  MAIN: "codebase_telemetry_v2",
  /**
   * Sub-gate: enables Git history capture.
   */
  GIT_HISTORY: "codebase_telemetry_v2_git_history",
  /**
   * Sub-gate: enables capture of agent-specific dot directories.
   */
  AGENT_DOT_DIRS: "codebase_telemetry_v2_agent_dot_dirs",
  /**
   * Sub-gate: enforces codebase-protection admission decisions.
   */
  CODEBASE_PROTECTION_ENFORCEMENT: "codebase_protection_client_enforcement"
};
var CODEBASE_TELEMETRY_FEATURE_GATES = new Set(Object.values(CodebaseTelemetryFeatureGate));
var INITIAL_FEATURE_GATE_STATE = {
  gitHistory: false,
  agentDotDirs: false,
  codebaseProtectionEnforcement: false
};
function mergeFeatureGateValues(current, update) {
  var _a19, _b2, _c2;
  return {
    gitHistory: (_a19 = update.gitHistory) !== null && _a19 !== void 0 ? _a19 : current.gitHistory,
    agentDotDirs: (_b2 = update.agentDotDirs) !== null && _b2 !== void 0 ? _b2 : current.agentDotDirs,
    codebaseProtectionEnforcement: (_c2 = update.codebaseProtectionEnforcement) !== null && _c2 !== void 0 ? _c2 : current.codebaseProtectionEnforcement
  };
}
function resolveFeatureGateChange(change) {
  switch (change.kind) {
    case "some":
      return change.gates.filter((gate) => CODEBASE_TELEMETRY_FEATURE_GATES.has(gate));
    case "all":
      return Object.values(CodebaseTelemetryFeatureGate);
    default: {
      const _exhaustive = change;
      return _exhaustive;
    }
  }
}

