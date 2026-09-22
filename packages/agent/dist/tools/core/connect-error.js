init_utils_pb();
init_esm2();
var AGENT_STREAM_START_TIMEOUT_TITLE = "Workspace Disconnected";
var AGENT_STREAM_START_TIMEOUT_DETAIL = "Cursor lost connection to the workspace while starting tool execution. Reload the window and try again.";
var AGENT_STREAM_START_TIMEOUT_ERROR_NAME = "AgentExecStreamStartTimeoutError";
function maybeNormalizeExecBoundaryError(error42) {
  if (error42 instanceof Error && error42.message.includes("signal is aborted without reason")) {
    const normalized2 = new ToolCallAbortedError();
    setErrorCause(normalized2, error42);
    return normalized2;
  }
  if (isExecBackendUnavailableError(error42)) {
    const normalized2 = new CustomToolCallError(ToolErrorClassification.EXEC_BACKEND_UNAVAILABLE, {
      clientVisibleErrorMessage: "The execution backend is unavailable. The extension host may have disconnected or stopped responding.",
      modelVisibleErrorMessage: "Execution backend unavailable. Do not retry tool calls \u2014 the execution environment is down. Inform the user and stop.",
      error: "Execution backend unavailable"
    });
    setErrorCause(normalized2, error42);
    return normalized2;
  }
  if (isPodMigratingExecBoundaryError(error42)) {
    return new RetryableToolEnvironmentOrchestrationError("The execution environment is moving to another machine (reason=pod_migrating); it will be back in a few minutes.", { cause: error42, code: "ENVIRONMENT_MIGRATING" });
  }
  if (isPodNotFoundExecBoundaryError(error42) || isExecDaemonUnreachableExecBoundaryError(error42) || isBridgeTransportClosedExecBoundaryError(error42) || isEnvironmentUnreachableMessageError(error42)) {
    const normalized2 = new RetryableToolEnvironmentOrchestrationError("The execution environment has become unreachable.", { cause: error42 });
    return normalized2;
  }
  const connectErrorCode = getConnectErrorCode(error42);
  if (connectErrorCode === void 0) {
    return error42;
  }
  let message;
  let classification;
  switch (connectErrorCode) {
    case Code.DeadlineExceeded:
      message = "Tool failed; this may be temporary. Try again.";
      classification = ToolErrorClassification.OTHER_ERROR;
      break;
    case Code.ResourceExhausted:
      if (shouldUseRateLimitMessage(error42)) {
        message = "Service is currently rate limited. This may be temporary; try again.";
        classification = ToolErrorClassification.PROVIDER_ERROR;
      } else {
        message = "Tool failed; this may be temporary. Try again.";
        classification = ToolErrorClassification.OTHER_ERROR;
      }
      break;
    case Code.Unavailable:
      message = "Service temporarily unavailable. This may be temporary; try again.";
      classification = ToolErrorClassification.OTHER_ERROR;
      break;
    case Code.NotFound:
      message = "Requested resource was not found. Check model selection and access.";
      classification = ToolErrorClassification.OTHER_ERROR;
      break;
    case Code.Canceled:
    case Code.Aborted:
      message = "Aborted";
      classification = ToolErrorClassification.ABORTED;
      break;
    default:
      message = "Tool failed; this may be temporary. Try again.";
      classification = ToolErrorClassification.OTHER_ERROR;
      break;
  }
  const normalized = new CustomToolCallError(classification, {
    clientVisibleErrorMessage: message,
    modelVisibleErrorMessage: message,
    error: message
  });
  setErrorCause(normalized, error42);
  return normalized;
}
function maybeCreateAgentStreamStartTimeoutTurnError(error42) {
  if (!isAgentStreamStartTimeoutError(error42)) {
    return void 0;
  }
  const cause = error42 instanceof Error ? error42 : void 0;
  return new ConnectError(AGENT_STREAM_START_TIMEOUT_TITLE, Code.DeadlineExceeded, void 0, [
    new ErrorDetails({
      error: ErrorDetails_Error.EXTENSION_HOST_TIMEOUT,
      details: {
        title: AGENT_STREAM_START_TIMEOUT_TITLE,
        detail: AGENT_STREAM_START_TIMEOUT_DETAIL,
        isRetryable: false,
        shouldShowImmediateError: true
      }
    })
  ], cause);
}
function isPodNotFoundExecBoundaryError(error42) {
  return collectErrorText(error42).some((text2) => text2.toLowerCase().includes("object not found: pod"));
}
function isPodMigratingExecBoundaryError(error42) {
  return collectErrorText(error42).some((text2) => {
    const lower = text2.toLowerCase();
    return lower.includes("reason=pod_migrating") || lower.includes("pod_migrating:");
  });
}
function isExecDaemonUnreachableExecBoundaryError(error42) {
  return collectErrorText(error42).some((text2) => text2.toLowerCase().includes("exec-daemon is unreachable"));
}
function isBridgeTransportClosedExecBoundaryError(error42) {
  return collectErrorText(error42).some((text2) => text2.toLowerCase().includes("bridge transport is closed"));
}
function isEnvironmentUnreachableMessageError(error42) {
  return collectErrorText(error42).some((text2) => text2.toLowerCase().includes("execution environment has become unreachable"));
}
function isExecBackendUnavailableError(error42) {
  if (error42 instanceof Error && (error42.name === "ExecBackendUnavailableError" || error42.name === "ControlledExecDisposedError" || error42.name === AGENT_STREAM_START_TIMEOUT_ERROR_NAME)) {
    return true;
  }
  if (isAgentStreamStartTimeoutError(error42)) {
    return true;
  }
  if (isExtensionHostTimeoutConnectError(error42)) {
    return true;
  }
  if (isLegacyAgentStreamStartTimeoutError(error42)) {
    return true;
  }
  const texts = collectErrorText(error42).map((t) => t.toLowerCase());
  return texts.some((text2) => text2.includes("mainthreadcursor disposed") || text2.includes("agent execution timed out") || text2.includes("extension host is not running or is unresponsive") || text2.includes("controlledexecdisposederror"));
}
function isAgentStreamStartTimeoutError(error42) {
  if (error42 instanceof Error && error42.name === AGENT_STREAM_START_TIMEOUT_ERROR_NAME) {
    return true;
  }
  return false;
}
function isAgentStreamStartTimeoutRecoveryTurnError(error42) {
  if (isAgentStreamStartTimeoutError(error42)) {
    return true;
  }
  if (!(error42 instanceof ConnectError) || error42.code !== Code.DeadlineExceeded) {
    return false;
  }
  return error42.findDetails(ErrorDetails).some((detail) => {
    return detail.error === ErrorDetails_Error.EXTENSION_HOST_TIMEOUT && detail.details?.title === AGENT_STREAM_START_TIMEOUT_TITLE;
  });
}
function isExtensionHostTimeoutConnectError(error42) {
  if (!(error42 instanceof ConnectError)) {
    return false;
  }
  for (const detail of error42.findDetails(ErrorDetails)) {
    if (detail.error === ErrorDetails_Error.EXTENSION_HOST_TIMEOUT) {
      return true;
    }
  }
  return false;
}
function isLegacyAgentStreamStartTimeoutError(error42) {
  return collectErrorText(error42).some((text2) => text2.toLowerCase().includes("agent stream start timeout"));
}
function setErrorCause(target, cause) {
  target.cause = cause;
}
function shouldUseRateLimitMessage(error42) {
  if (error42 instanceof ConnectError && error42.findDetails(ErrorDetails).some((detail) => detail.error === ErrorDetails_Error.RESOURCE_EXHAUSTED)) {
    return true;
  }
  const texts = collectErrorText(error42).map((s3) => s3.toLowerCase());
  if (texts.length === 0) {
    return false;
  }
  return texts.some((text2) => text2.includes("resource exhausted") || text2.includes("high load") || text2.includes("rate limit") || text2.includes("rate-limited") || text2.includes("too many requests") || text2.includes("overloaded") || text2.includes("overload") || text2.includes("econnreset"));
}
function collectErrorText(error42) {
  const texts = [];
  const queue = [error42];
  const seen = /* @__PURE__ */ new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === void 0 || seen.has(current)) {
      continue;
    }
    seen.add(current);
    if (current instanceof Error) {
      texts.push(current.message);
      const cause = current.cause;
      if (cause !== void 0) {
        queue.push(cause);
      }
    }
    if (current instanceof ConnectError) {
      const rawMessage = current.rawMessage;
      if (typeof rawMessage === "string") {
        texts.push(rawMessage);
      }
      for (const detail of current.findDetails(ErrorDetails)) {
        if (typeof detail.details?.title === "string") {
          texts.push(detail.details.title);
        }
        if (typeof detail.details?.detail === "string") {
          texts.push(detail.details.detail);
        }
      }
    }
  }
  return texts.filter((text2) => text2.length > 0);
}
var CONNECT_CODE_BY_NAME = new Map(Array.from(Object.values(Code).filter((value) => typeof value === "number")).map((code) => {
  const name17 = Code[code];
  const snake = typeof name17 === "string" ? name17[0].toLowerCase() + name17.substring(1).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`) : String(code);
  return [snake, code];
}));
function getConnectErrorCode(error42) {
  if (error42 instanceof Error) {
    const messageMatch = /^\[([a-z_]+)\](?:\s|$)/.exec(error42.message);
    if (messageMatch) {
      return CONNECT_CODE_BY_NAME.get(messageMatch[1]);
    }
    const stackMatch = typeof error42.stack === "string" ? /(?:^|\n)\s*ConnectError:\s*\[([a-z_]+)\](?:\s|$)/.exec(error42.stack) : null;
    if (stackMatch) {
      return CONNECT_CODE_BY_NAME.get(stackMatch[1]);
    }
    const loweredTexts = collectErrorText(error42).map((text2) => text2.toLowerCase());
    if (loweredTexts.some((text2) => text2.includes("user aborted request"))) {
      return Code.Aborted;
    }
    if (loweredTexts.some((text2) => text2 === "canceled" || text2.includes("request canceled") || text2.includes("request cancelled"))) {
      return Code.Canceled;
    }
  }
  return void 0;
}
