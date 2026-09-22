init_bounded();
var COOKIE_ORIGIN_APPROVAL_COUNT_CAP = 9999;
var COOKIE_ORIGIN_APPROVAL_DURATION_MS_CAP = 60 * 60 * 1e3;
function cappedInteger(value, cap) {
  if (!Number.isFinite(value)) return "0";
  return String(Math.max(0, Math.min(Math.round(value), cap)));
}
function cappedCount2(value) {
  return value === void 0 ? void 0 : cappedInteger(value, COOKIE_ORIGIN_APPROVAL_COUNT_CAP);
}
var OFF_VOCABULARY = "unknown";
var boundedHarness = brandedEnumOf(["BOX", "TEMPORAL"], OFF_VOCABULARY);
var boundedOutcome = brandedEnumOf(["listed", "resolved", "refused", "failed"], OFF_VOCABULARY);
var boundedDecision = brandedEnumOf(["approve-once", "always-allow", "deny"], OFF_VOCABULARY);
var boundedStage = brandedEnumOf(["enumerate", "collect", "inject"], OFF_VOCABULARY);
var boundedRefusalReason = brandedEnumOf(
  [
    "no-machine",
    "machine-stale",
    "no-window",
    "no-match",
    "aborted",
    "expired",
    "unavailable",
    "denied",
    OFF_VOCABULARY
  ],
  OFF_VOCABULARY
);
var INFO_REFUSAL_REASONS = /* @__PURE__ */ new Set(["aborted", "no-match", "denied"]);
function cookieOriginApprovalLevel(outcome, refusalReason) {
  switch (outcome) {
    case "listed":
    case "resolved":
      return "info";
    case "refused":
      return INFO_REFUSAL_REASONS.has(refusalReason ?? OFF_VOCABULARY) ? "info" : "warn";
    case "failed":
      return "error";
    default:
      return "warn";
  }
}
function cookieOriginApprovalTelemetry(report) {
  const outcome = boundedOutcome(report.outcome) ?? OFF_VOCABULARY;
  const refusalReason = boundedRefusalReason(report.refusalReason);
  const error42 = cookieOriginApprovalSandErrorOf(report);
  return {
    level: cookieOriginApprovalLevel(outcome, refusalReason),
    event: COOKIE_ORIGIN_APPROVAL_EVENT,
    metadata: {
      harness: boundedHarness(report.harness) ?? OFF_VOCABULARY,
      outcome,
      requested: cappedInteger(report.requestedOrigins, COOKIE_ORIGIN_APPROVAL_COUNT_CAP),
      listed: cappedCount2(report.listedItems),
      decision: boundedDecision(report.decision),
      auto: typeof report.auto === "boolean" ? String(report.auto) : void 0,
      grants: cappedCount2(report.grants),
      injected: cappedCount2(report.injected),
      stage: boundedStage(report.stage),
      refusal_reason: refusalReason,
      duration_ms: cappedInteger(report.durationMs, COOKIE_ORIGIN_APPROVAL_DURATION_MS_CAP),
      agent_id: brandedId(report.agentId),
      request_id: brandedId(report.requestId),
      ...error42 === void 0 ? {} : sandErrorTags(error42)
    }
  };
}
