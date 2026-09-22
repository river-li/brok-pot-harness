/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-client/dist/errors.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_utils_pb2();
var AgentError = class extends Error {
  constructor(message, options2 = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.cause = options2.cause;
    this.requestId = options2.requestId;
    this.displayInfo = options2.displayInfo;
    this.isTransport = options2.isTransport;
  }
  /**
   * Mirror the stable `kind` onto `name` so `error.name` is also
   * minification-proof (the prior `this.name = this.constructor.name` was
   * mangled in production bundles). Implemented as a getter so it reads the
   * subclass `kind` without assigning it in the constructor.
   */
  get name() {
    return this.kind;
  }
};
var RetriableError = class extends AgentError {
  get kind() {
    return "RetriableError";
  }
};
var ActionRequiredError = class extends AgentError {
  constructor(message, action, options2 = {}) {
    super(message, options2);
    this.action = action;
  }
  get kind() {
    return "ActionRequiredError";
  }
};
var NonRetriableError = class extends AgentError {
  get kind() {
    return "NonRetriableError";
  }
};
var CancelledError = class extends AgentError {
  get kind() {
    return "CancelledError";
  }
};
var AUTH_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.NOT_LOGGED_IN,
  ErrorDetails_Error.AGENT_REQUIRES_LOGIN,
  ErrorDetails_Error.AUTH_TOKEN_NOT_FOUND,
  ErrorDetails_Error.AUTH_TOKEN_EXPIRED,
  ErrorDetails_Error.INVALID_AUTH_ID,
  ErrorDetails_Error.UNAUTHORIZED,
  ErrorDetails_Error.GITHUB_NO_USER_CREDENTIALS,
  ErrorDetails_Error.GITHUB_USER_NO_ACCESS
]);
var UPGRADE_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.FREE_USER_USAGE_LIMIT,
  ErrorDetails_Error.FREE_USER_RATE_LIMIT_EXCEEDED,
  ErrorDetails_Error.PRO_USER_ONLY,
  ErrorDetails_Error.PRO_USER_USAGE_LIMIT,
  ErrorDetails_Error.PRO_USER_RATE_LIMIT_EXCEEDED,
  ErrorDetails_Error.RATE_LIMITED,
  ErrorDetails_Error.RATE_LIMITED_CHANGEABLE,
  ErrorDetails_Error.GENERIC_RATE_LIMIT_EXCEEDED
]);
var PAYMENT_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.USAGE_PRICING_REQUIRED,
  ErrorDetails_Error.USAGE_PRICING_REQUIRED_CHANGEABLE
]);
var CONFIG_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.BAD_API_KEY,
  ErrorDetails_Error.BAD_USER_API_KEY,
  ErrorDetails_Error.OUTDATED_CLIENT
]);
var CANCELLED_CODES = /* @__PURE__ */ new Set([
  ErrorDetails_Error.USER_ABORTED_REQUEST,
  ErrorDetails_Error.DEBOUNCED
]);
var TERMINAL_MESSAGE_CODES = /* @__PURE__ */ new Set([ErrorDetails_Error.CUSTOM_MESSAGE]);
var TRANSPORT_PATTERNS = [
  "NGHTTP2",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
  "socket hang up",
  "Premature close",
  "ERR_STREAM",
  "protocol error",
  "http/2 stream",
  // Server-initiated RST_STREAM
  "ERR_HTTP2_SESSION_ERROR",
  // HTTP/2 GOAWAY - error code in (error as any).code
  "Session closed with error code",
  // HTTP/2 GOAWAY - message format
  // Default abort reason from connect-node's Http2SessionManager.abort() when the
  // client tears down the underlying H2 session (e.g. transport recycling on auth
  // refresh / network change). Carries Code.Canceled, but it is a transport-level
  // teardown, not a user cancellation — must stay retriable so the run resumes
  // from checkpoint instead of dying mid tool call ("Wait skipped").
  "connection aborted"
];
var NETWORK_ERRNO_CODES = /* @__PURE__ */ new Set([
  "ENOTFOUND",
  "EAI_AGAIN",
  "EAI_FAIL",
  "ENODATA",
  "ESERVFAIL",
  "EHOSTUNREACH",
  "ENETDOWN",
  "ENETUNREACH"
]);
var NETWORK_ERRNO_RE = new RegExp(`\\b(${[...NETWORK_ERRNO_CODES].join("|")})\\b`);
var INFERENCE_REQUEST_ERROR_TYPE_HEADER = "x-cursor-inference-request-error-type";
var AGENT_WEBSOCKET_DELIVERY_AMBIGUOUS_ERROR_NAME = "AgentWebSocketDeliveryAmbiguousError";
function classifyError2(error3, options2 = {}) {
  const { requestId } = options2;
  if (error3 instanceof AgentError) {
    return error3;
  }
  if (isConnectError(error3)) {
    return classifyConnectError(error3, requestId);
  }
  const blobNotFound = findBlobNotFoundError(error3);
  if (blobNotFound !== void 0) {
    return new NonRetriableError(blobNotFound.message, {
      cause: error3 instanceof Error ? error3 : void 0,
      requestId,
      displayInfo: {
        title: "Conversation data missing",
        detail: blobNotFound.message,
        isRetryable: false
      }
    });
  }
  if (error3 instanceof Error) {
    if (error3.name === "AbortError") {
      return new CancelledError(error3.message, { cause: error3, requestId });
    }
    if (error3.name === AGENT_WEBSOCKET_DELIVERY_AMBIGUOUS_ERROR_NAME) {
      return new RetriableError(error3.message, {
        cause: error3,
        requestId,
        isTransport: true
      });
    }
    if (matchesTransportPattern(error3)) {
      return new RetriableError(error3.message, { cause: error3, requestId });
    }
  }
  const message = error3 instanceof Error ? error3.message : String(error3);
  return new RetriableError(message, {
    cause: error3 instanceof Error ? error3 : void 0,
    requestId
  });
}
function isConnectError(error3) {
  return error3 !== null && typeof error3 === "object" && "code" in error3 && "name" in error3 && error3.name === "ConnectError";
}
function classifyConnectError(error3, requestId) {
  var _a20, _b2, _c2, _d, _e2, _f, _g;
  var _h;
  const details = getErrorDetails(error3);
  const displayInfo = {
    title: (_a20 = details === null || details === void 0 ? void 0 : details.details) === null || _a20 === void 0 ? void 0 : _a20.title,
    detail: (_b2 = details === null || details === void 0 ? void 0 : details.details) === null || _b2 === void 0 ? void 0 : _b2.detail,
    isRetryable: (_c2 = details === null || details === void 0 ? void 0 : details.details) === null || _c2 === void 0 ? void 0 : _c2.isRetryable,
    connectCode: error3.code,
    errorCode: details === null || details === void 0 ? void 0 : details.error,
    inferenceRequestErrorType: (_h = error3.metadata.get(INFERENCE_REQUEST_ERROR_TYPE_HEADER)) !== null && _h !== void 0 ? _h : void 0,
    errorDetails: details
  };
  const opts = { cause: error3, requestId, displayInfo };
  if (error3.code === Code.Canceled || error3.code === Code.Aborted) {
    if (matchesTransportPattern(error3)) {
      return new RetriableError(error3.message, opts);
    }
    return new CancelledError(error3.message, opts);
  }
  if ((details === null || details === void 0 ? void 0 : details.error) !== void 0) {
    const code = details.error;
    if (CANCELLED_CODES.has(code)) {
      return new CancelledError(extractMessage(error3, details), opts);
    }
    const backendAction = (_e2 = (_d = details.details) === null || _d === void 0 ? void 0 : _d.analyticsMetadata) === null || _e2 === void 0 ? void 0 : _e2.actionRequired;
    if (backendAction !== void 0 && backendAction !== "") {
      return new ActionRequiredError(extractMessage(error3, details), backendAction, opts);
    }
    if (AUTH_CODES.has(code)) {
      return new ActionRequiredError(extractMessage(error3, details), "login", opts);
    }
    if (UPGRADE_CODES.has(code)) {
      return new ActionRequiredError(extractMessage(error3, details), "upgrade", opts);
    }
    if (PAYMENT_CODES.has(code)) {
      return new ActionRequiredError(extractMessage(error3, details), "payment", opts);
    }
    if (CONFIG_CODES.has(code)) {
      return new ActionRequiredError(extractMessage(error3, details), "config", opts);
    }
    if (TERMINAL_MESSAGE_CODES.has(code) && ((_f = details.details) === null || _f === void 0 ? void 0 : _f.isRetryable) !== true) {
      return new NonRetriableError(extractMessage(error3, details), opts);
    }
    if (((_g = details.details) === null || _g === void 0 ? void 0 : _g.isRetryable) === false) {
      return new NonRetriableError(extractMessage(error3, details), opts);
    }
  }
  if (error3.code === Code.Unauthenticated) {
    return new ActionRequiredError(error3.message, "login", opts);
  }
  return new RetriableError(error3.message, opts);
}
function getErrorDetails(error3) {
  var _a20, _b2;
  const details = error3.findDetails(ErrorDetails);
  if (details.length > 0) {
    return details[0];
  }
  try {
    const causeDetails = (_b2 = (_a20 = error3.cause) === null || _a20 === void 0 ? void 0 : _a20.findDetails) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, ErrorDetails);
    return causeDetails === null || causeDetails === void 0 ? void 0 : causeDetails[0];
  } catch (_c2) {
    return void 0;
  }
}
function extractMessage(error3, details) {
  if (details === null || details === void 0 ? void 0 : details.details) {
    const { title, detail } = details.details;
    if (title && detail)
      return `${title} ${detail}`;
    return title || detail || error3.message;
  }
  return error3.message;
}
function matchesTransportPattern(error3) {
  const seen = /* @__PURE__ */ new Set();
  let current = error3;
  while (current instanceof Error && !seen.has(current)) {
    seen.add(current);
    const errorString = `${current.name}: ${current.message}`;
    if (TRANSPORT_PATTERNS.some((pattern) => errorString.includes(pattern)) || NETWORK_ERRNO_RE.test(errorString)) {
      return true;
    }
    const errorCode = current.code;
    if (typeof errorCode === "string" && (TRANSPORT_PATTERNS.some((pattern) => errorCode.includes(pattern)) || NETWORK_ERRNO_CODES.has(errorCode))) {
      return true;
    }
    current = current.cause;
  }
  return false;
}

