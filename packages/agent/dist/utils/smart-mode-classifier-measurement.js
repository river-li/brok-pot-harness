/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/smart-mode-classifier-measurement.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
init_dist3();

// @recovered-fragment 2/2
var logger52 = createLogger("@anysphere/agent:smart-mode-classifier");
var SMART_MODE_CLASSIFIER_TIMEOUT_MS = 1e4;
var SMART_MODE_CLASSIFIER_LOCAL_DEV_TIMEOUT_MULTIPLIER = 3;
var SMART_MODE_CLASSIFIER_MAX_TOTAL_ATTEMPTS = 2;
var SMART_MODE_CLASSIFIER_MAX_FAILURE_RETRIES = SMART_MODE_CLASSIFIER_MAX_TOTAL_ATTEMPTS - 1;
var smartModeClassifierAttemptIndexKey = createKey(/* @__PURE__ */ Symbol("smartModeClassifierAttemptIndex"), void 0);
var smartModeClassifierModeKey = createKey(/* @__PURE__ */ Symbol("smartModeClassifierMode"), void 0);
var smartModeClassifierWorkspacePathsKey = createKey(/* @__PURE__ */ Symbol("smartModeClassifierWorkspacePaths"), void 0);
function getSmartModeClassifierTimeoutMs(timeoutMs = SMART_MODE_CLASSIFIER_TIMEOUT_MS) {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    return timeoutMs * SMART_MODE_CLASSIFIER_LOCAL_DEV_TIMEOUT_MULTIPLIER;
  }
  return timeoutMs;
}
async function executeSmartModeClassifierWithMeasurement(ctx, executor, args, mode = "enforce", workspacePaths, options2) {
  const overallStartTime = performance.now();
  const actionKind = normalizeSmartModeClassifierActionKind(args.target?.action);
  const surfaceLabel = getSmartModeClassifierSurfaceLabel(args);
  const maxAttempts = Math.max(1, options2?.maxAttempts ?? SMART_MODE_CLASSIFIER_MAX_TOTAL_ATTEMPTS);
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const timeoutMs = getSmartModeClassifierTimeoutMs(options2?.timeoutMs);
    const timeoutMessage = `Smart Mode classifier timed out after ${timeoutMs}ms`;
    const attemptIndex = attempt - 1;
    const [cancelableAttemptCtx, cancelAttempt] = ctx.withCancel();
    const attemptCtx = cancelableAttemptCtx.with(smartModeClassifierAttemptIndexKey, attemptIndex).with(smartModeClassifierModeKey, mode).with(smartModeClassifierWorkspacePathsKey, workspacePaths);
    recordSmartModeClassifierStart(ctx, {
      mode,
      actionKind,
      surfaceLabel,
      timeoutMs,
      hasTarget: args.target !== void 0,
      hasTargetArguments: args.target?.arguments !== void 0
    }, options2?.suppressToolCallIdLogging === true ? void 0 : args.toolCallId);
    try {
      const result = await withTimeout(Promise.resolve().then(() => executor.execute(attemptCtx, args)), timeoutMs, timeoutMessage);
      const classifiedResult = classifySmartModeClassifierResult(result);
      const retryable = isRetryableClassifierFailure(classifiedResult);
      if (retryable && attempt < maxAttempts) {
        continue;
      }
      recordSmartModeClassifierCall(ctx, {
        mode,
        actionKind,
        surfaceLabel,
        ...classifiedResult,
        latencyMs: elapsedMs2(overallStartTime),
        retryCount: attempt - 1
      }, options2?.suppressToolCallIdLogging === true ? void 0 : args.toolCallId);
      return result;
    } catch (error42) {
      if (error42 instanceof Error && error42.name === "AbortError") {
        recordSmartModeClassifierException(ctx, {
          mode,
          actionKind,
          surfaceLabel,
          latencyMs: elapsedMs2(overallStartTime),
          retryCount: attempt - 1
        }, options2?.suppressToolCallIdLogging === true ? void 0 : args.toolCallId);
        throw error42;
      }
      const failureReason = classifySmartModeClassifierException(error42);
      if (failureReason === "timeout_exception") {
        cancelAttempt(new Error(timeoutMessage));
      }
      if (attempt < maxAttempts) {
        continue;
      }
      recordSmartModeClassifierException(ctx, {
        mode,
        actionKind,
        surfaceLabel,
        latencyMs: elapsedMs2(overallStartTime),
        retryCount: attempt - 1,
        failureReason
      }, options2?.suppressToolCallIdLogging === true ? void 0 : args.toolCallId);
      throw error42;
    }
  }
  throw new Error("Smart Mode classifier retry loop exited unexpectedly");
}
function normalizeSmartModeClassifierActionKind(action) {
  const normalizedAction = action?.trim().toLowerCase();
  if (normalizedAction === void 0 || normalizedAction.length === 0) {
    return "unknown";
  }
  if (normalizedAction === "shell" || normalizedAction === "mcp" || normalizedAction === "sand_computer" || normalizedAction === "web_fetch" || normalizedAction === "fetch_mcp_resource") {
    return normalizedAction;
  }
  return "other";
}
function getSmartModeClassifierSurfaceLabel(args) {
  const json3 = args.target?.arguments?.toJson();
  if (json3 === null || Array.isArray(json3) || typeof json3 !== "object") {
    return void 0;
  }
  const surface = json3.execution_surface;
  return surface === "host_machine" || surface === "isolated_box" ? surface : void 0;
}
function classifySmartModeClassifierResult(result) {
  switch (result.result.case) {
    case "success": {
      const decision = smartModeDecisionToLabel(result.result.value.decision);
      const failureMetadata = getSmartModeClassifierDecisionFailureMetadata(decision);
      return {
        outcome: smartModeDecisionToOutcome(result.result.value.decision),
        decision,
        hasReason: result.result.value.blockReason !== void 0,
        ...failureMetadata
      };
    }
    case "error": {
      const metadata = parseSmartModeClassifierFailureMetadata(result.result.value.error);
      return {
        outcome: "error",
        decision: "unknown",
        hasReason: false,
        failureReason: metadata?.failureReason ?? "classifier_result_error",
        retryable: metadata?.retryable ?? true
      };
    }
    default:
      return {
        outcome: "missing",
        decision: "unknown",
        hasReason: false,
        failureReason: "missing_result",
        retryable: true
      };
  }
}
function smartModeDecisionToOutcome(decision) {
  switch (decision) {
    case SmartModeClassifierDecision.ALLOW:
      return "allow";
    case SmartModeClassifierDecision.BLOCK:
      return "block";
    case SmartModeClassifierDecision.UNSPECIFIED:
      return "missing";
    default:
      return "missing";
  }
}
function smartModeDecisionToLabel(decision) {
  switch (decision) {
    case SmartModeClassifierDecision.ALLOW:
      return "allow";
    case SmartModeClassifierDecision.BLOCK:
      return "block";
    case SmartModeClassifierDecision.UNSPECIFIED:
      return "unspecified";
    default:
      return "unknown";
  }
}
function getSmartModeClassifierDecisionFailureMetadata(decision) {
  switch (decision) {
    case "allow":
    case "block":
      return { retryable: false };
    case "unspecified":
      return {
        failureReason: "unspecified_decision",
        retryable: true
      };
    case "unknown":
      return {
        failureReason: "unknown_decision",
        retryable: true
      };
  }
}
function isRetryableClassifierFailure(result) {
  if (result.outcome === "allow" || result.outcome === "block") {
    return false;
  }
  return result.retryable ?? true;
}
function classifySmartModeClassifierException(error42) {
  if (error42 instanceof Error && (error42.name === "TimeoutError" || error42.message.includes("Smart Mode classifier timed out"))) {
    return "timeout_exception";
  }
  return "unknown_exception";
}
function elapsedMs2(startTime) {
  return Math.max(0, Math.round(performance.now() - startTime));
}
function recordSmartModeClassifierCall(ctx, options2, toolCallId) {
  try {
    logger52.info(ctx, "smart_mode.classifier_call", {
      mode: options2.mode,
      actionKind: options2.actionKind,
      surfaceLabel: options2.surfaceLabel,
      outcome: options2.outcome,
      decision: options2.decision,
      hasReason: options2.hasReason,
      latencyMs: options2.latencyMs,
      retryCount: options2.retryCount,
      failureReason: options2.failureReason,
      ...toolCallId !== void 0 ? { toolCallId } : {}
    });
  } catch {
  }
  try {
    getAgentEventTracker(ctx).trackSmartModeClassifierCall(ctx, options2);
  } catch {
  }
}
function recordSmartModeClassifierStart(ctx, options2, toolCallId) {
  try {
    logger52.info(ctx, "smart_mode.classifier_call.started", {
      mode: options2.mode,
      actionKind: options2.actionKind,
      surfaceLabel: options2.surfaceLabel,
      timeoutMs: options2.timeoutMs,
      hasTarget: options2.hasTarget,
      hasTargetArguments: options2.hasTargetArguments,
      ...toolCallId !== void 0 ? { toolCallId } : {}
    });
  } catch {
  }
}
function recordSmartModeClassifierException(ctx, options2, toolCallId) {
  recordSmartModeClassifierCall(ctx, {
    ...options2,
    outcome: "exception",
    decision: "unknown",
    hasReason: false
  }, toolCallId);
}

