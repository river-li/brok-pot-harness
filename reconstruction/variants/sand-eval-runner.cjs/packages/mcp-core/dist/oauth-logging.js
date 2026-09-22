/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/oauth-logging.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function hashMcpOAuthValueForLog(value) {
  if (!value) {
    return void 0;
  }
  return (0, import_crypto.createHash)("sha256").update(value).digest("hex").slice(0, 12);
}
function hashMcpOAuthStringArrayForLog(values) {
  if (!values || values.length === 0) {
    return void 0;
  }
  return hashMcpOAuthValueForLog(JSON.stringify([...values].sort()));
}
function buildOAuthClientInformationSnapshotForLog(clientInformation) {
  var _a20;
  var _b2;
  return {
    clientIdHash: hashMcpOAuthValueForLog(clientInformation === null || clientInformation === void 0 ? void 0 : clientInformation.client_id),
    clientSecretHash: hashMcpOAuthValueForLog(clientInformation === null || clientInformation === void 0 ? void 0 : clientInformation.client_secret),
    redirectUrisHash: hashMcpOAuthStringArrayForLog(clientInformation === null || clientInformation === void 0 ? void 0 : clientInformation.redirect_uris),
    redirectUriCount: (_b2 = (_a20 = clientInformation === null || clientInformation === void 0 ? void 0 : clientInformation.redirect_uris) === null || _a20 === void 0 ? void 0 : _a20.length) !== null && _b2 !== void 0 ? _b2 : 0
  };
}
function classifyNetworkError(args) {
  var _a20, _b2;
  const normalized = (_a20 = args.message) === null || _a20 === void 0 ? void 0 : _a20.toLowerCase();
  const normalizedCode = (_b2 = args.code) === null || _b2 === void 0 ? void 0 : _b2.toLowerCase();
  if ((normalized === null || normalized === void 0 ? void 0 : normalized.includes("timed out")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("timeout")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("etimedout")) || normalizedCode === "etimedout") {
    return "timeout";
  }
  if ((normalized === null || normalized === void 0 ? void 0 : normalized.includes("enotfound")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("eai_again")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("dns")) || normalizedCode === "enotfound" || normalizedCode === "eai_again") {
    return "dns";
  }
  if ((normalized === null || normalized === void 0 ? void 0 : normalized.includes("certificate")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("tls")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("ssl"))) {
    return "tls";
  }
  if ((normalized === null || normalized === void 0 ? void 0 : normalized.includes("econnreset")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("connection reset")) || normalizedCode === "econnreset") {
    return "connection_reset";
  }
  if ((normalized === null || normalized === void 0 ? void 0 : normalized.includes("econnrefused")) || (normalized === null || normalized === void 0 ? void 0 : normalized.includes("connection refused")) || normalizedCode === "econnrefused") {
    return "connection_refused";
  }
  return void 0;
}
function readNestedRecordValue(value, path30) {
  let current = value;
  for (const key of path30) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return void 0;
    }
    current = current[key];
  }
  return current;
}
function firstString(value, keys) {
  for (const key of keys) {
    if (typeof readNestedRecordValue(value, key.split(".")) === "string") {
      return readNestedRecordValue(value, key.split("."));
    }
  }
  return void 0;
}
function readSdkOAuthErrorCode(error3) {
  if (!error3 || typeof error3 !== "object") {
    return void 0;
  }
  const errorCode = error3.errorCode;
  return typeof errorCode === "string" ? errorCode : void 0;
}
function firstNumber(value, keys) {
  for (const key of keys) {
    const candidate = readNestedRecordValue(value, key.split("."));
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }
  return void 0;
}
function parseHttpStatusFromErrorMessage(message) {
  var _a20, _b2;
  if (!message) {
    return void 0;
  }
  const match2 = message.match(/\(HTTP (\d+)\)|Non-200 status code \((\d+)\)|\bHTTP\s+(\d{3})\b/i);
  const matchedStatus = (_b2 = (_a20 = match2 === null || match2 === void 0 ? void 0 : match2[1]) !== null && _a20 !== void 0 ? _a20 : match2 === null || match2 === void 0 ? void 0 : match2[2]) !== null && _b2 !== void 0 ? _b2 : match2 === null || match2 === void 0 ? void 0 : match2[3];
  if (!matchedStatus) {
    return void 0;
  }
  const parsed = Number.parseInt(matchedStatus, 10);
  return Number.isNaN(parsed) ? void 0 : parsed;
}
function usefulErrorMessage(error3) {
  if (error3 instanceof Error) {
    const raw = error3.message;
    if (raw && raw !== error3.name) {
      return sanitizeErrorMessageForLog(raw);
    }
    return void 0;
  }
  if (error3 != null) {
    const raw = String(error3);
    return raw ? sanitizeErrorMessageForLog(raw) : void 0;
  }
  return void 0;
}
function readCause(error3) {
  if (!error3 || typeof error3 !== "object") {
    return void 0;
  }
  return error3.cause;
}
function buildCauseChainForLog(error3, maxDepth = 4) {
  const parts = [];
  let current = error3;
  for (let depth = 0; depth < maxDepth && current != null; depth++) {
    if (current instanceof Error) {
      const message = usefulErrorMessage(current);
      parts.push(message ? `${current.name}: ${message}` : current.name);
      current = readCause(current);
      continue;
    }
    parts.push(sanitizeErrorMessageForLog(String(current)));
    break;
  }
  return parts.length > 1 ? parts.join(" > ") : void 0;
}
function isSensitiveErrorSummaryKey(key) {
  const normalized = key.toLowerCase();
  return normalized === "code" || normalized === "authorization" || normalized.includes("token") || normalized.includes("secret") || normalized.includes("password") || normalized.includes("assertion") || normalized.includes("verifier") || normalized.includes("challenge") || SENSITIVE_ERROR_SUMMARY_KEY_PATTERN.test(normalized);
}
function redactSensitiveText(value) {
  return value.replace(/((?:access_token|refresh_token|id_token|client_secret|authorization|code|password|assertion|token|secret)[^:=\r\n]{0,32}[:=]\s*["']?)([^"',\s&}]+)/gi, `$1${REDACTED_LOG_VALUE}`).replace(/(\bBearer\s+)([A-Za-z0-9\-._~+/]+=*)/gi, `$1${REDACTED_LOG_VALUE}`);
}
function truncateLogValue(value, maxLength = 256) {
  return value.length > maxLength ? `${value.slice(0, Math.max(0, maxLength - 3))}...` : value;
}
function sanitizeErrorMessageForLog(value, options2) {
  return truncateLogValue(redactSensitiveText(value), options2 === null || options2 === void 0 ? void 0 : options2.maxLength);
}
function sanitizeStructuredValueForLog(value) {
  return sanitizeStructuredValue(value);
}
function sanitizeStructuredValue(value) {
  if (typeof value === "string") {
    return truncateLogValue(redactSensitiveText(value));
  }
  if (value === void 0) {
    return void 0;
  }
  try {
    const serialized = JSON.stringify(value, (key, nestedValue) => {
      if (key && isSensitiveErrorSummaryKey(key)) {
        return REDACTED_LOG_VALUE;
      }
      if (typeof nestedValue === "string") {
        return redactSensitiveText(nestedValue);
      }
      return nestedValue;
    });
    if (!serialized) {
      return void 0;
    }
    return truncateLogValue(serialized);
  } catch (_a20) {
    return void 0;
  }
}
function extractResponseFromFetchError(error3) {
  var _a20, _b2;
  if (!error3 || typeof error3 !== "object") {
    return void 0;
  }
  const candidates = [
    error3.response,
    (_a20 = error3.cause) === null || _a20 === void 0 ? void 0 : _a20.response
  ];
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && "status" in candidate && typeof candidate.status === "number" && "headers" in candidate && typeof ((_b2 = candidate.headers) === null || _b2 === void 0 ? void 0 : _b2.get) === "function") {
      return candidate;
    }
  }
  return void 0;
}
function getMcpOAuthErrorLogMetadata(error3) {
  var _a20, _b2, _c2, _d, _e2, _f, _g, _h, _j;
  const cause = readCause(error3);
  const errorName = error3 instanceof Error ? error3.name : error3 != null ? typeof error3 : void 0;
  const causeName = cause instanceof Error ? cause.name : void 0;
  const causeMessage = usefulErrorMessage(cause);
  const errorMessage4 = (_a20 = usefulErrorMessage(error3)) !== null && _a20 !== void 0 ? _a20 : causeMessage;
  const systemErrorCode = firstString(error3, ["code", "cause.code"]);
  const oauthErrorCode = (_c2 = (_b2 = readSdkOAuthErrorCode(error3)) !== null && _b2 !== void 0 ? _b2 : readSdkOAuthErrorCode(cause)) !== null && _c2 !== void 0 ? _c2 : firstString(error3, [
    "errorCode",
    "error",
    "cause.errorCode",
    "cause.error",
    "body.error",
    "response.body.error"
  ]);
  const httpStatus = (_e2 = (_d = firstNumber(error3, [
    "status",
    "statusCode",
    "response.status",
    "response.statusCode",
    "cause.status",
    "cause.statusCode",
    "cause.response.status",
    "cause.response.statusCode"
  ])) !== null && _d !== void 0 ? _d : parseHttpStatusFromErrorMessage(errorMessage4)) !== null && _e2 !== void 0 ? _e2 : parseHttpStatusFromErrorMessage(causeMessage);
  const errorResponseSummary = sanitizeStructuredValue((_j = (_h = (_g = (_f = readNestedRecordValue(error3, ["response", "body"])) !== null && _f !== void 0 ? _f : readNestedRecordValue(error3, ["body"])) !== null && _g !== void 0 ? _g : readNestedRecordValue(error3, ["data"])) !== null && _h !== void 0 ? _h : readNestedRecordValue(error3, ["cause", "body"])) !== null && _j !== void 0 ? _j : readNestedRecordValue(error3, ["cause", "response", "body"]));
  const networkClassification = classifyNetworkError({
    message: errorMessage4,
    code: systemErrorCode
  });
  const sdkErrorKind = oauthErrorCode ? "oauth_error" : networkClassification ? "auth_transport_error" : errorMessage4 ? "generic_error" : void 0;
  return compactLogMetadata({
    errorName,
    errorMessage: errorMessage4,
    errorType: error3 != null ? typeof error3 : void 0,
    httpStatus,
    oauthErrorCode,
    errorResponseSummary,
    networkClassification,
    causeName,
    causeMessage,
    causeChain: buildCauseChainForLog(error3),
    sdkErrorKind
  });
}
function emitMcpOAuthLifecycleLog(args) {
  var _a20, _b2, _c2, _d, _e2, _f, _g, _h;
  var _j, _k;
  const message = (_j = args.message) !== null && _j !== void 0 ? _j : EVENT_MESSAGES[args.event];
  const metadata = {
    event: args.event,
    cursorMcp: {
      oauth: compactLogMetadata(Object.assign({}, args.metadata))
    }
  };
  const level = (_k = args.level) !== null && _k !== void 0 ? _k : "info";
  if (level === "error") {
    (_b2 = (_a20 = args.logger).error) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, message, args.error, metadata);
    return;
  }
  if (level === "warn") {
    (_d = (_c2 = args.logger).warn) === null || _d === void 0 ? void 0 : _d.call(_c2, message, metadata);
    return;
  }
  if (level === "debug") {
    (_f = (_e2 = args.logger).debug) === null || _f === void 0 ? void 0 : _f.call(_e2, message, metadata);
    return;
  }
  (_h = (_g = args.logger).info) === null || _h === void 0 ? void 0 : _h.call(_g, message, metadata);
}
var import_crypto, REDACTED_LOG_VALUE, SENSITIVE_ERROR_SUMMARY_KEY_PATTERN, EVENT_MESSAGES;
var init_oauth_logging = __esm({
  "../packages/mcp-core/dist/oauth-logging.js"() {
    "use strict";
    import_crypto = require("crypto");
    init_log_metadata();
    init_log_metadata();
    init_oauth_log_events();
    REDACTED_LOG_VALUE = "[REDACTED]";
    SENSITIVE_ERROR_SUMMARY_KEY_PATTERN = /(^|_|-)(token|secret|password|assertion|authorization|verifier|challenge|code)(_|-|$)/i;
    EVENT_MESSAGES = {
      mcp_oauth_provider_initialized: "MCP OAuth provider initialized",
      mcp_oauth_tokens_loaded: "MCP OAuth tokens loaded",
      mcp_oauth_tokens_saved: "MCP OAuth tokens saved",
      mcp_oauth_callback_completion: "MCP OAuth callback exchange completed",
      mcp_oauth_client_info_loaded: "MCP OAuth client information loaded",
      mcp_oauth_client_info_saved: "MCP OAuth client information saved",
      mcp_oauth_refresh_prepare: "MCP OAuth refresh prepared",
      mcp_oauth_refresh_error_release: "MCP OAuth refresh error released",
      mcp_oauth_state_transition: "MCP OAuth state transition",
      mcp_oauth_credentials_invalidated: "MCP OAuth credentials invalidated"
    };
  }
});

