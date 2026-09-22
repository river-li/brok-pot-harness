/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/error-handling.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NoSummaryResponseError = class _NoSummaryResponseError extends Error {
  constructor() {
    super("No assistant response received");
    this.name = "NoSummaryResponseError";
    Object.setPrototypeOf(this, _NoSummaryResponseError.prototype);
  }
};
var CONNECT_ERROR_CODES = {
  InvalidArgument: 3,
  NotFound: 5,
  ResourceExhausted: 8,
  Aborted: 10,
  Unavailable: 14,
  Unauthenticated: 16
};
function* iterateErrorChain(error3) {
  let current = error3;
  const seen = /* @__PURE__ */ new Set();
  while (current !== void 0 && current !== null && !seen.has(current)) {
    seen.add(current);
    yield current;
    if (current instanceof Error) {
      current = current.cause;
    } else {
      break;
    }
  }
}
function hasErrorName(error3, targetName) {
  for (const current of iterateErrorChain(error3)) {
    if (current instanceof Error && current.name === targetName) {
      return true;
    }
  }
  return false;
}
function errorMessageIncludes(error3, needle) {
  const normalizedNeedle = needle.toLowerCase();
  for (const current of iterateErrorChain(error3)) {
    if (current instanceof Error && current.message.toLowerCase().includes(normalizedNeedle)) {
      return true;
    }
  }
  return false;
}
function hasConnectCode(error3, targetCode) {
  for (const current of iterateErrorChain(error3)) {
    if (typeof current === "object" && current !== null && "code" in current && current.code === targetCode) {
      return true;
    }
  }
  return false;
}
function isTextFieldsTooLargeError(error3) {
  return errorMessageIncludes(error3, "request contains text fields that are too large");
}
function isInvalidJsonError(error3) {
  return errorMessageIncludes(error3, "not valid json") || errorMessageIncludes(error3, "invalid json");
}
function isInvalidArgumentError(error3) {
  return errorMessageIncludes(error3, "invalid argument");
}
function isUserApiKeyRateLimitExceededError(error3) {
  return errorMessageIncludes(error3, "User API Key Rate limit exceeded");
}
var TOO_MANY_IMAGES_OR_DOCUMENTS_MESSAGE_MARKERS = [
  "request contained too many images or documents",
  "too many images or documents error",
  "too many images and documents",
  "too much media"
];
function isTooManyImagesOrDocumentsError(error3) {
  return TOO_MANY_IMAGES_OR_DOCUMENTS_MESSAGE_MARKERS.some((marker17) => errorMessageIncludes(error3, marker17));
}
var CannotTruncatePromptError = class extends Error {
  constructor(message, details) {
    super(message);
    this.name = "CannotTruncatePromptError";
    Object.setPrototypeOf(this, new.target.prototype);
    this.totalMessages = details.totalMessages;
    this.originalChars = details.originalChars;
    this.budgetChars = details.budgetChars;
  }
};
function getRetryDirective(error3, options2) {
  var _a20, _b2, _c2, _d, _e2, _f, _g;
  if (error3 instanceof OutputTokensLimitExceededError || hasErrorName(error3, "OutputTokensLimitExceededError")) {
    const enableRetryOutputTokenLimit = (_a20 = options2.enableRetryOutputTokenLimit) !== null && _a20 !== void 0 ? _a20 : true;
    return {
      errorType: "OutputTokensLimitExceededError",
      shouldRetry: enableRetryOutputTokenLimit,
      retryDelayMs: enableRetryOutputTokenLimit ? options2.transientRetryDelayMs : 0,
      requestShorterOutput: enableRetryOutputTokenLimit,
      // Summary length tracks input length, and the shorter-output
      // instruction alone is appended only once — without also shrinking the
      // inputs, later retries are near-identical to the failed attempt and
      // deterministically overflow the output limit again.
      reduceInputs: enableRetryOutputTokenLimit && ((_b2 = options2.enableReduceInputsRetry) !== null && _b2 !== void 0 ? _b2 : false)
    };
  }
  if (error3 instanceof InputTokenLimitError || hasErrorName(error3, "InputTokenLimitError")) {
    const reduceInputs = (_c2 = options2.enableReduceInputsRetry) !== null && _c2 !== void 0 ? _c2 : false;
    return {
      errorType: "InputTokenLimitError",
      shouldRetry: reduceInputs,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs
    };
  }
  if (hasConnectCode(error3, CONNECT_ERROR_CODES.ResourceExhausted) || hasErrorName(error3, "ResourceExhausted")) {
    if (isTextFieldsTooLargeError(error3)) {
      const reduceInputs = (_d = options2.enableReduceInputsRetry) !== null && _d !== void 0 ? _d : false;
      return {
        errorType: "InputTooLargeError",
        shouldRetry: reduceInputs,
        retryDelayMs: 0,
        requestShorterOutput: false,
        reduceInputs
      };
    }
    if (isInvalidJsonError(error3)) {
      return {
        errorType: "InvalidJson",
        shouldRetry: false,
        retryDelayMs: 0,
        requestShorterOutput: false,
        reduceInputs: false
      };
    }
    if (isInvalidArgumentError(error3)) {
      return {
        errorType: "InvalidArgument",
        shouldRetry: false,
        retryDelayMs: 0,
        requestShorterOutput: false,
        reduceInputs: false
      };
    }
    return {
      errorType: "ResourceExhausted",
      shouldRetry: true,
      retryDelayMs: options2.transientRetryDelayMs,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (hasConnectCode(error3, CONNECT_ERROR_CODES.Unavailable) || hasErrorName(error3, "Unavailable")) {
    return {
      errorType: "Unavailable",
      shouldRetry: true,
      retryDelayMs: options2.transientRetryDelayMs,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (hasConnectCode(error3, CONNECT_ERROR_CODES.Aborted) || hasErrorName(error3, "UserAbortedError") || hasErrorName(error3, "AbortError")) {
    return {
      errorType: "AbortError",
      shouldRetry: false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (hasErrorName(error3, "InteractionListenerStreamClosedError")) {
    return {
      errorType: "InteractionListenerStreamClosedError",
      shouldRetry: false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (hasConnectCode(error3, CONNECT_ERROR_CODES.Unauthenticated) || hasErrorName(error3, "Unauthenticated")) {
    return {
      errorType: "Unauthenticated",
      shouldRetry: false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (hasConnectCode(error3, CONNECT_ERROR_CODES.InvalidArgument) || hasErrorName(error3, "InvalidArgument")) {
    if (isUserApiKeyRateLimitExceededError(error3)) {
      return {
        errorType: "InvalidArgument",
        shouldRetry: true,
        retryDelayMs: options2.transientRetryDelayMs,
        requestShorterOutput: false,
        reduceInputs: false
      };
    }
    return {
      errorType: "InvalidArgument",
      shouldRetry: false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (hasConnectCode(error3, CONNECT_ERROR_CODES.NotFound) || hasErrorName(error3, "NotFound") || hasErrorName(error3, "StringNotFoundError")) {
    return {
      errorType: "NotFound",
      shouldRetry: false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (error3 instanceof NoSummaryResponseError || hasErrorName(error3, "NoSummaryResponseError")) {
    return {
      errorType: "NoSummaryResponseError",
      shouldRetry: (_e2 = options2.enableRetryNoSummaryResponse) !== null && _e2 !== void 0 ? _e2 : false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (error3 instanceof CannotTruncatePromptError || hasErrorName(error3, "CannotTruncatePromptError")) {
    return {
      errorType: "CannotTruncatePromptError",
      shouldRetry: false,
      retryDelayMs: 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  if (error3 instanceof Error) {
    return {
      errorType: error3.name || "UncategorizedError",
      shouldRetry: (_f = options2.enableRetryUncategorizedErrors) !== null && _f !== void 0 ? _f : true,
      retryDelayMs: ((_g = options2.enableRetryUncategorizedErrors) !== null && _g !== void 0 ? _g : true) ? options2.transientRetryDelayMs : 0,
      requestShorterOutput: false,
      reduceInputs: false
    };
  }
  return {
    errorType: "UnknownError",
    shouldRetry: false,
    retryDelayMs: 0,
    requestShorterOutput: false,
    reduceInputs: false
  };
}

