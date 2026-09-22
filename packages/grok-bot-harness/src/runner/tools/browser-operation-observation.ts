var durations = createHistogram("sand.browser.operation.duration_ms", {
  description: "Terminal browser tool execution attempts, including admission failures; count is the attempt denominator",
  labelNames: ["operation", "outcome", "stage", "code", "harness", "cdp_method"]
});
function elapsedSince(startedAt) {
  return Math.max(0, performance.now() - startedAt);
}
var SandBrowserOperationError = class extends Error {
  constructor(message, code = "unexpected_error") {
    super(message);
    this.code = code;
  }
  code;
};
var BrowserOperationObservation = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  stage = "admission";
  result = {
    outcome: "success",
    stage: "none",
    code: "none"
  };
  cdpMethod = "none";
  spans = {};
  finished = false;
  startedAt = performance.now();
  async shellResult(pending) {
    const submittedAt = performance.now();
    const result = await pending;
    this.spans = { ...this.spans, shell_ms: elapsedSince(submittedAt) };
    if (result.result.case === "success") {
      this.stage = "protocol";
    } else {
      this.fail(result.result.case === "timeout" ? "timeout" : "shell_failure");
    }
    return result;
  }
  driverResponded(opDurationMs, stages) {
    this.spans = {
      ...this.spans,
      ...opDurationMs !== void 0 ? { driver_ms: opDurationMs } : {},
      ...stages?.connectMs !== void 0 ? { connect_ms: stages.connectMs } : {},
      ...stages?.screenshotMs !== void 0 ? { driver_screenshot_ms: stages.screenshotMs } : {}
    };
  }
  async download(pending) {
    const startedAt = performance.now();
    const value = await pending;
    this.spans = { ...this.spans, download_ms: elapsedSince(startedAt) };
    return value;
  }
  async screenshot(pending) {
    const startedAt = performance.now();
    const image2 = await pending;
    this.spans = { ...this.spans, screenshot_ms: elapsedSince(startedAt) };
    return image2;
  }
  admittedCdpMethod(method) {
    this.cdpMethod = toSandBrowserCdpMethodBucket(method);
  }
  fail(code) {
    let outcome = "error";
    if (code === "timeout" || code === "cancelled") outcome = code;
    this.result = {
      outcome,
      stage: this.stage,
      code
    };
  }
  caught(error42) {
    if (this.options.signal.aborted || error42 instanceof Error && error42.name === "AbortError") {
      this.fail("cancelled");
    } else if (this.result.outcome !== "success") {
      return;
    } else if (error42 instanceof SandBrowserOperationError) {
      this.fail(this.stage === "protocol" ? "protocol_invalid" : error42.code);
    } else if (error42 instanceof Error && error42.name === "TimeoutError") {
      this.fail("timeout");
    } else {
      this.fail(this.stage === "admission" ? "invalid_arguments" : "unexpected_error");
    }
  }
  finish() {
    if (this.finished) return false;
    this.finished = true;
    const duration_ms = elapsedSince(this.startedAt);
    let metricRecorded = true;
    try {
      durations.histogram(this.options.ctx, duration_ms, {
        ...this.result,
        operation: this.options.operation,
        harness: this.options.harness,
        cdp_method: this.cdpMethod
      });
    } catch {
      metricRecorded = false;
    }
    try {
      this.options.report?.({
        ...this.result,
        operation: this.options.operation,
        duration_ms,
        ...this.spans,
        request_id: getRequestId(this.options.ctx) ?? "unavailable",
        subagent_id: getConversationId(this.options.ctx) ?? "unavailable",
        tool_call_id: this.options.toolCallId,
        invocation_id: this.options.invocationId ?? "unavailable",
        attempt_id: (0, import_node_crypto65.randomUUID)(),
        harness: this.options.harness,
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
      this.fail("cancelled");
      this.finish();
    };
    this.options.signal.addEventListener("abort", onAbort, { once: true });
    if (this.options.signal.aborted) onAbort();
    try {
      const result = await execute();
      if (result.result.case === "error" && this.result.outcome === "success") {
        this.fail(this.stage === "admission" ? "invalid_arguments" : "unexpected_error");
      }
      return result;
    } catch (error42) {
      this.caught(error42);
      throw error42;
    } finally {
      this.options.signal.removeEventListener("abort", onAbort);
      this.finish();
    }
  }
};
