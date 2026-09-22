/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/mcp/playwright-telemetry.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var AGENT_CLASSIFICATION_CLASS = {
  [ToolErrorClassification.NOOP]: "noop",
  [ToolErrorClassification.INVALID_ARGS]: "invalid_args",
  [ToolErrorClassification.UNEXPECTED_ENVIRONMENT]: "unexpected_environment",
  [ToolErrorClassification.USER_REJECTED]: "user_rejected",
  [ToolErrorClassification.TIMEOUT]: "timeout",
  [ToolErrorClassification.PROVIDER_ERROR]: "provider_error",
  [ToolErrorClassification.BAD_USER_DEVICE_STATE]: "bad_user_device_state",
  [ToolErrorClassification.ABORTED]: "cancelled",
  [ToolErrorClassification.EXEC_BACKEND_UNAVAILABLE]: "exec_backend_unavailable",
  [ToolErrorClassification.HOOK_DENIED]: "hook_denied",
  [ToolErrorClassification.MCP_AUTH_ERROR]: "mcp_auth_error",
  [ToolErrorClassification.INVALID_OUTPUT_NOTIFICATION]: "invalid_output_notification",
  [ToolErrorClassification.OTHER_ERROR]: "unexpected_error"
};
var TOOL_ERROR_REASON_PATTERNS = [
  ["stale_ref", /\bRef \S+ not found in the current page snapshot/],
  ["ref_syntax", /Unknown engine "ref"/],
  ["target_ambiguous", /strict mode violation/],
  ["target_missing", /does not match any elements/],
  ["dialog_open", /does not handle the modal state/],
  ["not_a_select", /Element is not a <select> element/],
  ["navigation_failed", /\bnet::ERR_/],
  ["pointer_intercepted", /intercepts pointer events/],
  ["action_timeout", /\bTimeout \d+ms exceeded/]
];
function playwrightToolErrorReason(text2) {
  return TOOL_ERROR_REASON_PATTERNS.find(([, pattern]) => pattern.test(text2))?.[0] ?? "other";
}
var PLAYWRIGHT_WINDOW_UNAVAILABLE_MESSAGE = "The box has not assigned this agent a browser window yet; try again in a moment.";
var PlaywrightWindowUnavailableError = class extends CustomToolCallError {
  constructor() {
    super(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
      clientVisibleErrorMessage: PLAYWRIGHT_WINDOW_UNAVAILABLE_MESSAGE,
      modelVisibleErrorMessage: "",
      error: PLAYWRIGHT_WINDOW_UNAVAILABLE_MESSAGE
    });
  }
};
function playwrightToolCallErrorClass(error3) {
  if (error3 instanceof PlaywrightWindowUnavailableError) return "window_unavailable";
  if (error3 instanceof SandBrowserAutoReviewBlockedError) return "auto_review_blocked";
  if (error3 instanceof McpServerDoesNotExistError) return "server_missing";
  if (error3 instanceof CustomToolCallError) return AGENT_CLASSIFICATION_CLASS[error3.classification];
  if (error3 instanceof ConnectError) {
    if (error3.code === Code.Canceled) return "cancelled";
    if (error3.code === Code.DeadlineExceeded) return "timeout";
    return "connect_error";
  }
  if (error3 instanceof ToolCallAbortedError) return "cancelled";
  if (error3 instanceof ToolTimeoutError) return "timeout";
  if (error3 instanceof Error && error3.name === "AbortError") return "cancelled";
  if (error3 instanceof Error && error3.name === "TimeoutError") return "timeout";
  return "unexpected_error";
}
var attaches = createCounter("sand.playwright.attach", {
  description: "Playwright MCP attach checks on a box, by what the check found or did",
  labelNames: ["outcome", "source", "box_image_sha"]
});
var serverReadiness = createHistogram("sand.playwright.server_ready_ms", {
  description: "Playwright server readiness checks per computerUse prewarm, timed by listTools",
  labelNames: ["outcome", "harness"]
});
var toolCalls = createHistogram("sand.playwright.tool_call_ms", {
  description: "Terminal Playwright browser tool attempts, admission failures included",
  labelNames: ["tool", "outcome", "stage", "error_class", "harness"]
});
var snapshotRecoveries = createCounter("sand.playwright.snapshot_recovered", {
  description: "Scoped snapshots answered with the whole page after the target failed to resolve",
  labelNames: ["reason", "harness"]
});
function recordPlaywrightSnapshotRecovery(ctx, args) {
  snapshotRecoveries.increment(ctx, 1, args);
}
function recordPlaywrightServerReady(ctx, args) {
  const { outcome, harness, durationMs } = args;
  serverReadiness.histogram(ctx, durationMs, { outcome, harness });
}
function recordPlaywrightToolCall(ctx, args) {
  const { tool, harness, durationMs, result } = args;
  toolCalls.histogram(ctx, durationMs, {
    tool,
    harness,
    outcome: result.kind,
    stage: result.kind === "error" ? result.stage : "exec",
    error_class: toolCallErrorClassLabel(result)
  });
}
function toolCallErrorClassLabel(result) {
  switch (result.kind) {
    case "ok":
      return "none";
    case "tool_error":
      return result.reason;
    case "error":
      return result.errorClass;
  }
}

