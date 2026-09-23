init_utils_pb();
init_dist3();
init_esm2();
var TRANSIENT_ERRNO_CODES = /* @__PURE__ */ new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "EPIPE",
  "ECONNABORTED",
  "ECONNREFUSED",
  "ENETRESET",
  "ENETDOWN",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "EAI_AGAIN"
]);
var TRANSPORT_ERRNO_CODES = /* @__PURE__ */ new Set([...TRANSIENT_ERRNO_CODES, "ENOTFOUND"]);
var TRANSIENT_MESSAGE_TOKENS = [
  "econnreset",
  "etimedout",
  "epipe",
  "econnaborted",
  "econnrefused",
  "enetreset",
  "enetunreach",
  "ehostunreach",
  "socket hang up",
  "premature close",
  "stream closed",
  "closed stream",
  "connection reset",
  "connection closed",
  "connection terminated",
  "network error",
  "the operation was aborted",
  "[aborted]",
  "[unavailable]",
  "[deadline_exceeded]"
];
function messageLooksTransient(message) {
  const lower = message.toLowerCase();
  return TRANSIENT_MESSAGE_TOKENS.some((token) => lower.includes(token));
}
function isTransientStreamError(error42) {
  return classify(error42, /* @__PURE__ */ new Set());
}
function classify(error42, seen) {
  if (typeof error42 === "string") return messageLooksTransient(error42);
  if (error42 == null || typeof error42 !== "object") return false;
  if (seen.has(error42)) return false;
  seen.add(error42);
  const fields2 = error42;
  if (typeof fields2.code === "string" && TRANSIENT_ERRNO_CODES.has(fields2.code.toUpperCase())) {
    return true;
  }
  if (typeof fields2.message === "string" && messageLooksTransient(fields2.message)) return true;
  if (fields2.cause != null && classify(fields2.cause, seen)) return true;
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => classify(inner, seen));
  }
  return false;
}
function isRetryableProviderError(error42) {
  if (error42 == null) return false;
  if (!(classifyError2(error42) instanceof RetriableError)) return false;
  if (isContextOverflowDeadEnd(error42)) return false;
  if (isConversationTooLargeRefusal(error42)) return false;
  return !hasWrappedHardTerminal(error42, /* @__PURE__ */ new Set());
}
function isConversationTooLargeRefusal(error42) {
  return hasConversationTooLargeSignal(error42, /* @__PURE__ */ new Set());
}
function hasConversationTooLargeSignal(error42, seen) {
  if (error42 == null || typeof error42 !== "object") return false;
  if (seen.has(error42)) return false;
  seen.add(error42);
  const fields2 = error42;
  if (fields2.isConversationTooLarge === true) {
    return true;
  }
  if (fields2.cause != null && hasConversationTooLargeSignal(fields2.cause, seen)) {
    return true;
  }
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasConversationTooLargeSignal(inner, seen));
  }
  return false;
}
function isContextOverflowDeadEnd(error42) {
  return hasContextOverflowDeadEndSignal(error42, /* @__PURE__ */ new Set());
}
function isInputTokenLimitOverflowError(error42) {
  if (error42 instanceof InputTokenLimitError) return true;
  return error42 instanceof Error && error42.name === "InputTokenLimitError";
}
function isSummarizationRetriesExhaustedError(error42) {
  if (error42 instanceof Error && error42.name === "StepRetriesExhaustedError") {
    const fields3 = error42;
    return fields3.reason === "summarization-retries";
  }
  if (error42 == null || typeof error42 !== "object") return false;
  const fields2 = error42;
  return fields2.isStepRetriesExhausted === true && fields2.reason === "summarization-retries";
}
function hasContextOverflowDeadEndSignal(error42, seen) {
  if (error42 == null || typeof error42 !== "object") return false;
  if (seen.has(error42)) return false;
  seen.add(error42);
  if (isInputTokenLimitOverflowError(error42) || isSummarizationRetriesExhaustedError(error42)) {
    return true;
  }
  const fields2 = error42;
  if (fields2.cause != null && hasContextOverflowDeadEndSignal(fields2.cause, seen)) {
    return true;
  }
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasContextOverflowDeadEndSignal(inner, seen));
  }
  return false;
}
function hasWrappedHardTerminal(error42, seen) {
  if (error42 == null || typeof error42 !== "object") return false;
  if (seen.has(error42)) return false;
  seen.add(error42);
  const classified = classifyError2(error42);
  if (classified instanceof NonRetriableError || classified instanceof ActionRequiredError) {
    return true;
  }
  const fields2 = error42;
  if (fields2.cause != null && hasWrappedHardTerminal(fields2.cause, seen)) return true;
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasWrappedHardTerminal(inner, seen));
  }
  return false;
}
function isProviderCapacityError(error42) {
  if (!isRetryableProviderError(error42)) return false;
  return hasProviderCapacitySignal(error42, /* @__PURE__ */ new Set());
}
function isBackendUnreachableError(error42) {
  if (!isRetryableProviderError(error42)) return false;
  return hasTransportUnavailableSignal(error42, /* @__PURE__ */ new Set());
}
function hasTransportErrno(error42) {
  const seen = /* @__PURE__ */ new Set();
  let current = error42;
  while (current != null && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const fields2 = current;
    if (typeof fields2.code === "string" && TRANSPORT_ERRNO_CODES.has(fields2.code.toUpperCase())) {
      return true;
    }
    current = fields2.cause;
  }
  return false;
}
function hasTransportUnavailableSignal(error42, seen) {
  if (error42 == null || typeof error42 !== "object") return false;
  if (seen.has(error42)) return false;
  seen.add(error42);
  const classified = classifyError2(error42);
  if (classified instanceof RetriableError && classified.displayInfo?.connectCode === Code.Unavailable && hasTransportErrno(error42)) {
    return true;
  }
  const fields2 = error42;
  if (fields2.cause != null && hasTransportUnavailableSignal(fields2.cause, seen)) return true;
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasTransportUnavailableSignal(inner, seen));
  }
  return false;
}
function hasProviderCapacitySignal(error42, seen) {
  if (error42 == null || typeof error42 !== "object") return false;
  if (seen.has(error42)) return false;
  seen.add(error42);
  const classified = classifyError2(error42);
  if (classified instanceof RetriableError) {
    const { connectCode, errorCode } = classified.displayInfo ?? {};
    if (connectCode === Code.Unavailable && !hasTransportErrno(error42) || connectCode === Code.ResourceExhausted && errorCode === ErrorDetails_Error.RESOURCE_EXHAUSTED) {
      return true;
    }
  }
  const fields2 = error42;
  if (fields2.cause != null && hasProviderCapacitySignal(fields2.cause, seen)) return true;
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasProviderCapacitySignal(inner, seen));
  }
  return false;
}
var FirstTokenStallError = class extends Error {
  isFirstTokenStall = true;
  constructor(deadlineMs) {
    super(`The model provider did not start responding within ${Math.round(deadlineMs / 1e3)}s.`);
    this.name = "FirstTokenStallError";
  }
};
function isFirstTokenStallError(error42) {
  if (error42 instanceof FirstTokenStallError) return true;
  if (error42 == null || typeof error42 !== "object") return false;
  const fields2 = error42;
  return fields2.isFirstTokenStall === true;
}
var StreamIdleError = class extends Error {
  isStreamIdleStall = true;
  idleDeadlineMs;
  constructor(deadlineMs) {
    super("The model stopped responding mid-reply.");
    this.name = "StreamIdleError";
    this.idleDeadlineMs = deadlineMs;
  }
};
function isStreamIdleError(error42) {
  if (error42 instanceof StreamIdleError) return true;
  if (error42 == null || typeof error42 !== "object") return false;
  const fields2 = error42;
  return fields2.isStreamIdleStall === true;
}
function shouldRetryTurnAttempt(input) {
  if (input.canceled) return false;
  if (typeof input.error === "object" && input.error != null) {
    const fields2 = input.error;
    if (fields2.isTranscriptAppendAfterCheckpointError === true || fields2.isSandAutoReviewPause === true || fields2.isSandLocalToolPermissionPause === true || fields2.isSandConnectorGrantPause === true) {
      return false;
    }
  }
  const canReenterSafely = !input.streamOutputProduced || input.resumeCheckpointAvailable;
  if (canReenterSafely && (isRetryableProviderError(input.error) || isFirstTokenStallError(input.error) || isStreamIdleError(input.error))) {
    return true;
  }
  if (input.automationIsRetryable != null) {
    return input.automationIsRetryable(input.error);
  }
  return false;
}
function computeBackoffDelayMs(params) {
  const random = params.random ?? Math.random;
  const base = Math.max(0, params.baseDelayMs);
  const cap = Math.max(base, params.maxDelayMs);
  const exponential = Math.min(cap, base * 2 ** Math.max(0, params.attempt - 1));
  const jittered = exponential / 2 + random() * (exponential / 2);
  return Math.min(cap, Math.round(jittered));
}
var RETRY_AFTER_METADATA_KEY = "retry-after";
var MAX_SERVER_RETRY_AFTER_MS = 3e4;
function serverRetryAfterMsFromError(error42) {
  return findServerRetryAfterMs(error42, /* @__PURE__ */ new Set());
}
function computeServerPacedDelayMs(params) {
  const random = params.random ?? Math.random;
  const jittered = params.retryAfterMs + random() * (params.retryAfterMs / 2);
  return Math.min(Math.round(jittered), MAX_SERVER_RETRY_AFTER_MS);
}
function findServerRetryAfterMs(error42, seen) {
  if (error42 == null || typeof error42 !== "object" || seen.has(error42)) {
    return void 0;
  }
  seen.add(error42);
  if (error42 instanceof ConnectError) {
    const raw = error42.metadata.get(RETRY_AFTER_METADATA_KEY);
    if (raw !== null && raw !== "") {
      const seconds = Number(raw);
      if (Number.isFinite(seconds) && seconds >= 0) {
        return Math.min(Math.round(seconds * 1e3), MAX_SERVER_RETRY_AFTER_MS);
      }
    }
  }
  const fields2 = error42;
  const fromCause = findServerRetryAfterMs(fields2.cause, seen);
  if (fromCause !== void 0) return fromCause;
  if (Array.isArray(fields2.errors)) {
    for (const inner of fields2.errors) {
      const fromInner = findServerRetryAfterMs(inner, seen);
      if (fromInner !== void 0) return fromInner;
    }
  }
  return void 0;
}
async function runWithTransientRetry(run, policy) {
  const maxAttempts = Math.max(1, Math.floor(policy.maxAttempts));
  const isRetryable = policy.isRetryable ?? isTransientStreamError;
  const sleep2 = policy.sleep ?? delay2;
  const random = policy.random ?? Math.random;
  for (let attempt = 1; ; attempt++) {
    try {
      return await run();
    } catch (error42) {
      if (attempt >= maxAttempts || !isRetryable(error42)) throw error42;
      const serverRetryAfterMs = serverRetryAfterMsFromError(error42);
      const delayMs = serverRetryAfterMs !== void 0 ? computeServerPacedDelayMs({
        retryAfterMs: serverRetryAfterMs,
        random
      }) : computeBackoffDelayMs({
        attempt,
        baseDelayMs: policy.baseDelayMs,
        maxDelayMs: policy.maxDelayMs,
        random
      });
      policy.onRetry?.({
        attempt,
        delayMs,
        serverPaced: serverRetryAfterMs !== void 0,
        error: error42
      });
      await sleep2(delayMs);
    }
  }
}
var DEFAULT_FIRST_TOKEN_STALL_DEADLINE_MS = 15e4;
function resolveStreamDeadlinePolicy(overrides, config2) {
  const gatedIdleDeadlineMs = config2?.rollingIdleEnabled === true ? config2.idleDeadlineMs : 0;
  return {
    firstTokenDeadlineMs: overrides.firstTokenDeadlineMs ?? config2?.firstTokenDeadlineMs ?? DEFAULT_FIRST_TOKEN_STALL_DEADLINE_MS,
    idleDeadlineMs: overrides.idleDeadlineMs ?? gatedIdleDeadlineMs
  };
}
