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
  }
  options;
  stage = "admission";
  outcome = "success";
  code = "none";
  action = "unknown";
  actionMask = 0;
  batchLength;
  finished = false;
  startedAt = performance.now();
  attemptId = (0, import_node_crypto79.randomUUID)();
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
  caught(error41) {
    if (this.options.signal.aborted) {
      this.fail(isTimeout(this.options.signal.reason) ? "timeout" : "cancelled");
    } else if (isTimeout(error41)) {
      this.fail("timeout");
    } else if (error41 instanceof ToolCallAbortedError || error41 instanceof Error && error41.name === "AbortError") {
      this.fail("cancelled");
    } else if (error41 instanceof SandComputerAutoReviewBlockedError) {
      this.fail(error41.telemetryCode);
    } else if (error41 instanceof ToolCallArgParseError || error41 instanceof SandToolInputError) {
      this.fail("invalid_arguments");
    } else if (error41 instanceof ConnectError && error41.code === Code.Canceled) {
      this.fail("cancelled");
    } else if (error41 instanceof ConnectError && this.stage === "executor") {
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
        duration_ms: Math.max(0, performance.now() - this.startedAt),
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
    } catch (error41) {
      this.caught(error41);
      throw error41;
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
function isTimeout(error41) {
  return error41 instanceof ToolTimeoutError || isFusedStepGuardTimeoutReason(error41) || error41 instanceof Error && error41.name === "TimeoutError" || error41 instanceof ConnectError && error41.code === Code.DeadlineExceeded;
}
