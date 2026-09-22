/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/computer-operation-observation.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto37 = require("node:crypto");
init_dist();
var attempts = createCounter("sand.computer.operation.attempt", {
  description: "Terminal Computer and Screenshot tool execution attempts, including admission failures",
  labelNames: ["tool", "action", "outcome", "stage", "code", "harness", "combined_mode"]
});
var computerOperationObservationKey = createKey(
  /* @__PURE__ */ Symbol("computerOperationObservation"),
  void 0
);
var ComputerOperationObservation = class {
  constructor(options2) {
    this.options = options2;
    this.clock = options2.clock ?? realClock;
    this.startedAt = this.clock.monotonicNow();
    this.attemptId = (0, import_node_crypto37.randomUUID)();
  }
  options;
  stage = "admission";
  outcome = "success";
  code = "none";
  action = "unknown";
  actionMask = 0;
  batchLength;
  finished = false;
  clock;
  startedAt;
  attemptId;
  admitted(actions) {
    this.batchLength = actions.length;
    this.actionMask = actions.reduce((mask, action) => mask | SAND_COMPUTER_ACTION_BITS[action], 0);
    this.action = actions.length > 1 ? "batch" : actions[0] ?? "unknown";
    this.stage = "result";
  }
  fail(code) {
    this.code = code;
    if (code === "cancelled" || code === "timeout") {
      this.outcome = code;
    } else if (code === "policy_denied" || code === "approval_denied") {
      this.outcome = "denied";
    } else {
      this.outcome = "error";
    }
  }
  executorResult(result) {
    if (result.result.case === "error") {
      this.fail("executor_error");
    } else if (result.result.case !== "success") {
      this.stage = "result";
      this.fail("result_missing");
    } else if (!result.result.value.screenshot) {
      this.stage = "result";
      this.fail("screenshot_missing");
    }
  }
  caught(error3) {
    if (this.options.signal.aborted) {
      this.fail(isTimeout(this.options.signal.reason) ? "timeout" : "cancelled");
    } else if (isTimeout(error3)) {
      this.fail("timeout");
    } else if (error3 instanceof ToolCallAbortedError || error3 instanceof Error && error3.name === "AbortError") {
      this.fail("cancelled");
    } else if (error3 instanceof SandComputerAutoReviewBlockedError) {
      this.fail(error3.telemetryCode);
    } else if (error3 instanceof ToolCallArgParseError || error3 instanceof SandToolInputError) {
      this.fail("invalid_arguments");
    } else if (error3 instanceof ConnectError && error3.code === Code.Canceled) {
      this.fail("cancelled");
    } else if (error3 instanceof ConnectError && this.stage === "executor") {
      this.fail("transport_error");
    } else if (this.outcome === "success") {
      let code = "unexpected_error";
      if (this.stage === "executor") code = "executor_threw";
      if (this.stage === "persistence") code = "persistence_failed";
      this.fail(code);
    }
  }
  finish() {
    if (this.finished) return false;
    this.finished = true;
    const dimensions = {
      tool: this.options.tool,
      action: this.action,
      outcome: this.outcome,
      stage: this.outcome === "success" ? "none" : this.stage,
      code: this.code,
      harness: this.options.harness ?? "unavailable",
      combined_mode: combinedMode(this.options.getCombinedMode)
    };
    let metricRecorded = true;
    try {
      attempts.increment(this.options.ctx, 1, dimensions);
    } catch {
      metricRecorded = false;
    }
    if (this.outcome === "success") return metricRecorded;
    try {
      this.options.reportComputerOperation?.({
        ...dimensions,
        action_mask: this.actionMask,
        batch_length: this.batchLength,
        duration_ms: Math.max(0, this.clock.monotonicNow() - this.startedAt),
        request_id: getRequestId(this.options.ctx) ?? "unavailable",
        subagent_id: getConversationId(this.options.ctx) ?? "unavailable",
        tool_call_id: this.options.toolCallId,
        invocation_id: this.options.invocationId ?? "unavailable",
        attempt_id: this.attemptId,
        served_model: "unavailable",
        model_attribution: "inference_invocation_join",
        count_unit: "tool_execution_attempt"
      });
      return metricRecorded;
    } catch {
      return false;
    }
  }
  async run(execute) {
    const onAbort = () => {
      this.fail(isTimeout(this.options.signal.reason) ? "timeout" : "cancelled");
      this.finish();
    };
    this.options.signal.addEventListener("abort", onAbort, { once: true });
    if (this.options.signal.aborted) onAbort();
    try {
      const result = await execute();
      if (this.outcome === "success" && result.result.case !== "success") {
        this.stage = "result";
        this.fail(result.result.case === "error" ? "executor_error" : "result_missing");
      }
      return result;
    } catch (error3) {
      this.caught(error3);
      throw error3;
    } finally {
      this.options.signal.removeEventListener("abort", onAbort);
      this.finish();
    }
  }
};
function combinedMode(getSelection) {
  try {
    const value = getSelection?.();
    if (value === void 0) return "unavailable";
    return value ? "combined" : "separate";
  } catch {
    return "unavailable";
  }
}
function isTimeout(error3) {
  return error3 instanceof ToolTimeoutError || isFusedStepGuardTimeoutReason(error3) || error3 instanceof Error && error3.name === "TimeoutError" || error3 instanceof ConnectError && error3.code === Code.DeadlineExceeded;
}

