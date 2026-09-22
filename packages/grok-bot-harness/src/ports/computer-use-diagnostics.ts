/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/computer-use-diagnostics.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
init_zod();
var COMPUTER_USE_SESSION_EVENT = "sand.computer_use.session";
var computerUseDispatchSchema = external_exports.object({
  parentAgentId: external_exports.string(),
  parentRequestId: external_exports.string().optional(),
  subagentAgentId: external_exports.string(),
  subagentRequestId: external_exports.string(),
  toolCallId: external_exports.string(),
  subagentType: external_exports.enum(["browserUse", "computerUse"]),
  resume: external_exports.boolean().optional(),
  combinedComputerUseDecision: external_exports.object({
    selected: external_exports.boolean(),
    gateEnabled: external_exports.boolean(),
    desktopAvailable: external_exports.union([external_exports.boolean(), external_exports.literal("not_evaluated")]),
    boxAvailable: external_exports.union([external_exports.boolean(), external_exports.literal("not_evaluated")]),
    toolsAvailable: external_exports.boolean(),
    reason: external_exports.enum([
      "selected",
      "gate_disabled",
      "no_desktop",
      "box_unavailable",
      "tools_disabled"
    ]),
    selectedAtMs: external_exports.number().finite().nonnegative(),
    runStartedAtMs: external_exports.number().finite().nonnegative().optional()
  }).optional()
});
function computerUseDispatchMetadata(report, harness, selectionScope = "parent") {
  const decision = report.combinedComputerUseDecision;
  return {
    harness,
    selection_scope: selectionScope,
    conversation_id: brandedId(report.parentAgentId),
    parent_request_id: brandedId(report.parentRequestId),
    subagent_agent_id: brandedId(report.subagentAgentId),
    request_id: brandedId(report.subagentRequestId),
    tool_call_id: brandedId(report.toolCallId),
    subagent_type: report.subagentType,
    selection_state: decision === void 0 ? "unavailable" : "cached",
    combined_selected: String(decision?.selected ?? "unavailable"),
    gate_enabled: String(decision?.gateEnabled ?? "unavailable"),
    desktop_available: String(decision?.desktopAvailable ?? "unavailable"),
    box_available: String(decision?.boxAvailable ?? "unavailable"),
    tools_available: String(decision?.toolsAvailable ?? "unavailable"),
    selection_reason: decision?.reason ?? "unavailable",
    selection_at_ms: String(decision?.selectedAtMs ?? "unavailable"),
    parent_run_started_at_ms: String(decision?.runStartedAtMs ?? "unavailable"),
    gate_evaluation_source: "unknown",
    bootstrap_readiness_at_selection: "unavailable",
    bootstrap_age_at_selection_ms: "unavailable"
  };
}
function computerUseSessionMetadata(report, harness, outcome, abortReason3, durationMs) {
  return {
    ...computerUseDispatchMetadata(report, harness),
    launch_kind: report.resume === true ? "resume" : "initial",
    outcome,
    abort_reason: outcome === "aborted" ? abortReason3 : "not_applicable",
    duration_ms: String(Math.min(7 * 24 * 60 * 60 * 1e3, Math.max(0, Math.round(durationMs)))),
    served_model: "unavailable",
    serving_attribution: "join_inference_request"
  };
}

