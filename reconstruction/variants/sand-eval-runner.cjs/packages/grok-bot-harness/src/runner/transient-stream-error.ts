/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/transient-stream-error.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
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
function isTransientStreamError(error3) {
  return classify3(error3, /* @__PURE__ */ new Set());
}
function classify3(error3, seen) {
  if (typeof error3 === "string") return messageLooksTransient(error3);
  if (error3 == null || typeof error3 !== "object") return false;
  if (seen.has(error3)) return false;
  seen.add(error3);
  const fields2 = error3;
  if (typeof fields2.code === "string" && TRANSIENT_ERRNO_CODES.has(fields2.code.toUpperCase())) {
    return true;
  }
  if (typeof fields2.message === "string" && messageLooksTransient(fields2.message)) return true;
  if (fields2.cause != null && classify3(fields2.cause, seen)) return true;
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => classify3(inner, seen));
  }
  return false;
}
function isRetryableProviderError(error3) {
  if (error3 == null) return false;
  if (!(classifyError2(error3) instanceof RetriableError)) return false;
  if (isContextOverflowDeadEnd(error3)) return false;
  if (isConversationTooLargeRefusal(error3)) return false;
  return !hasWrappedHardTerminal(error3, /* @__PURE__ */ new Set());
}
function isConversationTooLargeRefusal(error3) {
  return hasConversationTooLargeSignal(error3, /* @__PURE__ */ new Set());
}
function hasConversationTooLargeSignal(error3, seen) {
  if (error3 == null || typeof error3 !== "object") return false;
  if (seen.has(error3)) return false;
  seen.add(error3);
  const fields2 = error3;
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
function isContextOverflowDeadEnd(error3) {
  return hasContextOverflowDeadEndSignal(error3, /* @__PURE__ */ new Set());
}
function isInputTokenLimitOverflowError(error3) {
  if (error3 instanceof InputTokenLimitError) return true;
  return error3 instanceof Error && error3.name === "InputTokenLimitError";
}
function isSummarizationRetriesExhaustedError(error3) {
  if (error3 instanceof Error && error3.name === "StepRetriesExhaustedError") {
    const fields3 = error3;
    return fields3.reason === "summarization-retries";
  }
  if (error3 == null || typeof error3 !== "object") return false;
  const fields2 = error3;
  return fields2.isStepRetriesExhausted === true && fields2.reason === "summarization-retries";
}
function hasContextOverflowDeadEndSignal(error3, seen) {
  if (error3 == null || typeof error3 !== "object") return false;
  if (seen.has(error3)) return false;
  seen.add(error3);
  if (isInputTokenLimitOverflowError(error3) || isSummarizationRetriesExhaustedError(error3)) {
    return true;
  }
  const fields2 = error3;
  if (fields2.cause != null && hasContextOverflowDeadEndSignal(fields2.cause, seen)) {
    return true;
  }
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasContextOverflowDeadEndSignal(inner, seen));
  }
  return false;
}
function hasWrappedHardTerminal(error3, seen) {
  if (error3 == null || typeof error3 !== "object") return false;
  if (seen.has(error3)) return false;
  seen.add(error3);
  const classified = classifyError2(error3);
  if (classified instanceof NonRetriableError || classified instanceof ActionRequiredError) {
    return true;
  }
  const fields2 = error3;
  if (fields2.cause != null && hasWrappedHardTerminal(fields2.cause, seen)) return true;
  if (Array.isArray(fields2.errors)) {
    return fields2.errors.some((inner) => hasWrappedHardTerminal(inner, seen));
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
function isFirstTokenStallError(error3) {
  if (error3 instanceof FirstTokenStallError) return true;
  if (error3 == null || typeof error3 !== "object") return false;
  const fields2 = error3;
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
function isStreamIdleError(error3) {
  if (error3 instanceof StreamIdleError) return true;
  if (error3 == null || typeof error3 !== "object") return false;
  const fields2 = error3;
  return fields2.isStreamIdleStall === true;
}
function shouldRetryTurnAttempt(input) {
  if (input.canceled) return false;
  if (typeof input.error === "object" && input.error != null) {
    const fields2 = input.error;
    if (fields2.isTranscriptAppendAfterCheckpointError === true || fields2.isSandAutoReviewPause === true || fields2.isSandLocalToolPermissionPause === true) {
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
  const random2 = params.random ?? Math.random;
  const base = Math.max(0, params.baseDelayMs);
  const cap = Math.max(base, params.maxDelayMs);
  const exponential = Math.min(cap, base * 2 ** Math.max(0, params.attempt - 1));
  const jittered = exponential / 2 + random2() * (exponential / 2);
  return Math.min(cap, Math.round(jittered));
}
var RETRY_AFTER_METADATA_KEY = "retry-after";
var MAX_SERVER_RETRY_AFTER_MS = 3e4;
function serverRetryAfterMsFromError(error3) {
  return findServerRetryAfterMs(error3, /* @__PURE__ */ new Set());
}
function computeServerPacedDelayMs(params) {
  const random2 = params.random ?? Math.random;
  const jittered = params.retryAfterMs + random2() * (params.retryAfterMs / 2);
  return Math.min(Math.round(jittered), MAX_SERVER_RETRY_AFTER_MS);
}
function findServerRetryAfterMs(error3, seen) {
  if (error3 == null || typeof error3 !== "object" || seen.has(error3)) {
    return void 0;
  }
  seen.add(error3);
  if (error3 instanceof ConnectError) {
    const raw = error3.metadata.get(RETRY_AFTER_METADATA_KEY);
    if (raw !== null && raw !== "") {
      const seconds = Number(raw);
      if (Number.isFinite(seconds) && seconds >= 0) {
        return Math.min(Math.round(seconds * 1e3), MAX_SERVER_RETRY_AFTER_MS);
      }
    }
  }
  const fields2 = error3;
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
  const sleep2 = policy.sleep ?? delay;
  const random2 = policy.random ?? Math.random;
  for (let attempt = 1; ; attempt++) {
    try {
      return await run();
    } catch (error3) {
      if (attempt >= maxAttempts || !isRetryable(error3)) throw error3;
      const serverRetryAfterMs = serverRetryAfterMsFromError(error3);
      const delayMs = serverRetryAfterMs !== void 0 ? computeServerPacedDelayMs({
        retryAfterMs: serverRetryAfterMs,
        random: random2
      }) : computeBackoffDelayMs({
        attempt,
        baseDelayMs: policy.baseDelayMs,
        maxDelayMs: policy.maxDelayMs,
        random: random2
      });
      policy.onRetry?.({
        attempt,
        delayMs,
        serverPaced: serverRetryAfterMs !== void 0,
        error: error3
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

