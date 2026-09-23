init_utils_pb();
init_esm2();
function getAgentStoreConnectCode(error42) {
  if (error42 instanceof AgentStoreMintFailedError) {
    return error42.connectCode;
  }
  if (error42 instanceof ConnectError) {
    return error42.code;
  }
  if (typeof error42 !== "object" || error42 === null || !("code" in error42)) {
    return void 0;
  }
  return normalizeConnectCode(error42.code);
}
function isAgentStoreConnectCode(error42, code) {
  return getAgentStoreConnectCode(error42) === code;
}
var AgentStoreMintFailedError = class extends Error {
  constructor(args) {
    const message = errorMessageOf(args.cause);
    super(message.length > 0 ? message : "Agent store mint failed", {
      cause: args.cause
    });
    this.name = "AgentStoreMintFailedError";
    this.cause = args.cause;
    this.connectCode = connectCodeOfRoot(args.cause);
    this.retryAfterMs = args.retryAfterMs;
    this.attempts = args.attempts;
  }
};
function connectCodeOfRoot(error42) {
  if (error42 instanceof ConnectError) {
    return error42.code;
  }
  if (typeof error42 !== "object" || error42 === null || !("code" in error42)) {
    return void 0;
  }
  return normalizeConnectCode(error42.code);
}
function rootAgentStoreError(error42) {
  return error42 instanceof AgentStoreMintFailedError ? error42.cause : error42;
}
function isAgentStoreMintNegativeCacheable(error42) {
  const code = getAgentStoreConnectCode(error42);
  return code === Code.InvalidArgument || code === Code.NotFound || code === Code.FailedPrecondition;
}
function isAgentStoreSyncDisabledError(error42) {
  if (!messageLooksLikeSyncDisabled(errorMessageOf(error42))) {
    return false;
  }
  const code = getAgentStoreConnectCode(error42);
  return code === void 0 || code === Code.InvalidArgument || code === Code.PermissionDenied;
}
function messageLooksLikeSyncDisabled(message) {
  const lower = message.toLowerCase();
  return lower.includes("agent store sync is not enabled") || lower.includes("agent store sync is not available in legacy privacy mode") || lower.includes("private worker agent-store sync is not enabled");
}
function errorMessageOf(error42) {
  if (error42 instanceof Error) {
    return error42.message;
  }
  if (typeof error42 === "string") {
    return error42;
  }
  return "";
}
var QUOTA_EXCEEDED_MARKER = "agent_store_quota_exceeded";
var BACKEND_THROTTLED_MARKER = "agent_store_backend_throttled";
var DEFAULT_THROTTLE_RETRY_AFTER_MS = 1e3;
var DIR_NOT_EMPTY_MARKER = "agent_store_dir_not_empty";
function parseMarkerField(args) {
  const needle = `${args.key}=`;
  const start = args.haystack.indexOf(needle);
  if (start < 0) {
    return void 0;
  }
  const rest = args.haystack.slice(start + needle.length);
  const end = rest.search(/\s/);
  const value = (end < 0 ? rest : rest.slice(0, end)).trim();
  return value.length > 0 ? value : void 0;
}
function markerHaystacks(error42) {
  var _a19, _b2;
  const haystacks = [];
  const message = errorMessageOf(error42);
  if (message.length > 0) {
    haystacks.push(message);
  }
  if (error42 instanceof ConnectError) {
    for (const detail of error42.findDetails(ErrorDetails)) {
      const detailMessage = (_a19 = detail.details) === null || _a19 === void 0 ? void 0 : _a19.detail;
      if (typeof detailMessage === "string" && detailMessage.length > 0) {
        haystacks.push(detailMessage);
      }
      const title = (_b2 = detail.details) === null || _b2 === void 0 ? void 0 : _b2.title;
      if (typeof title === "string" && title.length > 0) {
        haystacks.push(title);
      }
    }
  }
  return haystacks;
}
function isOpaqueConnectWireMessage(message) {
  const trimmed = message.trim();
  return trimmed === "Error" || trimmed === "[failed_precondition] Error" || /^\[[^\]]+\] Error$/.test(trimmed);
}
function stripAgentStoreMarkerTail(text2) {
  const markerSplit = text2.indexOf(". marker=");
  if (markerSplit > 0) {
    return text2.slice(0, markerSplit + 1).trim();
  }
  const bare = text2.indexOf(" marker=");
  if (bare > 0) {
    return text2.slice(0, bare).trim();
  }
  return text2;
}
function agentStoreErrorSummaryMessage(error42, fallback2) {
  var _a19, _b2, _c2, _d;
  const root = rootAgentStoreError(error42);
  const message = errorMessageOf(root).trim();
  if (message.length > 0 && !isOpaqueConnectWireMessage(message)) {
    return stripAgentStoreMarkerTail(message);
  }
  if (root instanceof ConnectError) {
    const raw = root.rawMessage.trim();
    if (raw.length > 0 && !isOpaqueConnectWireMessage(raw)) {
      return stripAgentStoreMarkerTail(raw);
    }
    for (const detail of root.findDetails(ErrorDetails)) {
      const title = (_b2 = (_a19 = detail.details) === null || _a19 === void 0 ? void 0 : _a19.title) === null || _b2 === void 0 ? void 0 : _b2.trim();
      if (title !== void 0 && title.length > 0 && !isOpaqueConnectWireMessage(title)) {
        return stripAgentStoreMarkerTail(title);
      }
      const detailText = (_d = (_c2 = detail.details) === null || _c2 === void 0 ? void 0 : _c2.detail) === null || _d === void 0 ? void 0 : _d.trim();
      if (detailText !== void 0 && detailText.length > 0 && !isOpaqueConnectWireMessage(detailText)) {
        return stripAgentStoreMarkerTail(detailText);
      }
    }
  }
  return fallback2;
}
function parseAgentStoreQuotaExceeded(error42) {
  var _a19, _b2, _c2;
  const root = rootAgentStoreError(error42);
  if (!isAgentStoreConnectCode(root, Code.FailedPrecondition) && !isAgentStoreConnectCode(root, Code.InvalidArgument)) {
    return void 0;
  }
  const haystack = markerHaystacks(root).find((h) => h.includes(QUOTA_EXCEEDED_MARKER));
  if (haystack === void 0) {
    return void 0;
  }
  const limitRaw = parseMarkerField({ haystack, key: "limit_bytes" });
  const usageRaw = parseMarkerField({ haystack, key: "usage_bytes" });
  return {
    scopeKind: (_a19 = parseMarkerField({ haystack, key: "scope" })) !== null && _a19 !== void 0 ? _a19 : "store",
    resource: (_b2 = parseMarkerField({ haystack, key: "resource" })) !== null && _b2 !== void 0 ? _b2 : "storage_bytes",
    limitBytes: limitRaw !== void 0 ? Number(limitRaw) : 0,
    usageBytes: usageRaw !== void 0 ? Number(usageRaw) : 0,
    storeId: (_c2 = parseMarkerField({ haystack, key: "store_id" })) !== null && _c2 !== void 0 ? _c2 : ""
  };
}
function parseRetryAfterMs(error42) {
  const raw = retryAfterHeaderValue(error42);
  if (raw === void 0) {
    return void 0;
  }
  const secs = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(secs) || secs < 0) {
    return void 0;
  }
  return secs * 1e3;
}
function retryAfterHeaderValue(error42) {
  if (error42 instanceof ConnectError) {
    const fromMetadata = error42.metadata.get("Retry-After");
    if (fromMetadata !== null && fromMetadata.length > 0) {
      return fromMetadata;
    }
  }
  if (typeof error42 !== "object" || error42 === null) {
    return void 0;
  }
  if ("metadata" in error42) {
    const metadata = error42.metadata;
    if (metadata instanceof Headers) {
      const value = metadata.get("Retry-After");
      if (value !== null && value.length > 0) {
        return value;
      }
    }
  }
  return void 0;
}
function httpStatusOf(error42) {
  if (typeof error42 !== "object" || error42 === null) {
    return void 0;
  }
  for (const key of ["status", "statusCode"]) {
    if (key in error42) {
      const candidate = error42[key];
      if (typeof candidate === "number" && Number.isFinite(candidate)) {
        return candidate;
      }
    }
  }
  return void 0;
}
function parseAgentStoreBackendThrottled(error42) {
  var _a19, _b2, _c2;
  const root = rootAgentStoreError(error42);
  const code = getAgentStoreConnectCode(root);
  const status = httpStatusOf(root);
  const isThrottleCode = code === Code.ResourceExhausted || code === Code.Unavailable || status === 429 || status === 503;
  if (!isThrottleCode) {
    return void 0;
  }
  const haystack = markerHaystacks(root).find((h) => h.includes(BACKEND_THROTTLED_MARKER));
  return {
    retryAfterMs: (_a19 = parseRetryAfterMs(root)) !== null && _a19 !== void 0 ? _a19 : DEFAULT_THROTTLE_RETRY_AFTER_MS,
    scope: haystack !== void 0 ? (_b2 = parseMarkerField({ haystack, key: "scope" })) !== null && _b2 !== void 0 ? _b2 : "" : "",
    storeId: haystack !== void 0 ? (_c2 = parseMarkerField({ haystack, key: "store_id" })) !== null && _c2 !== void 0 ? _c2 : "" : ""
  };
}
function isAgentStoreDirNotEmptyConnectError(error42) {
  if (!isAgentStoreConnectCode(error42, Code.FailedPrecondition)) {
    return false;
  }
  return markerHaystacks(error42).some((haystack) => haystack.includes(DIR_NOT_EMPTY_MARKER));
}
var MINT_TRANSIENT_CONNECT_CODES = /* @__PURE__ */ new Set([
  Code.Unavailable,
  Code.ResourceExhausted,
  Code.Internal,
  Code.DeadlineExceeded
]);
var TRANSIENT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETDOWN",
  "ENETUNREACH",
  "ENOTFOUND",
  "EPIPE",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_SOCKET"
]);
var TRANSIENT_NETWORK_ERROR_MESSAGES = [
  "connection reset",
  "fetch failed",
  "network error",
  "other side closed",
  "socket hang up"
];
function isAgentStoreMintTransient(error42) {
  const root = rootAgentStoreError(error42);
  if (isAgentStoreAbortError(root) || isAgentStoreSyncDisabledError(root)) {
    return false;
  }
  if (isAgentStoreMintNegativeCacheable(root)) {
    return false;
  }
  if (isMintAuthError(root)) {
    return false;
  }
  const code = getAgentStoreConnectCode(root);
  if (code !== void 0) {
    if (MINT_TRANSIENT_CONNECT_CODES.has(code)) {
      return true;
    }
    if (code === Code.Unknown) {
      return isAgentStoreRetryableHttpStatus(root) || isAgentStoreTransientNetworkError(root);
    }
    return false;
  }
  return isAgentStoreRetryableHttpStatus(root) || isAgentStoreTransientNetworkError(root);
}
function isAgentStoreAbortError(error42) {
  const root = rootAgentStoreError(error42);
  if (root instanceof Error && root.name === "AbortError") {
    return true;
  }
  return getAgentStoreConnectCode(error42) === Code.Canceled;
}
function isMintAuthError(error42) {
  const code = getAgentStoreConnectCode(error42);
  if (code === Code.Unauthenticated || code === Code.PermissionDenied) {
    return true;
  }
  if (typeof error42 !== "object" || error42 === null) {
    return false;
  }
  if ("status" in error42) {
    const status = error42.status;
    if (status === 401 || status === 403) {
      return true;
    }
  }
  return false;
}
function isAgentStoreRetryableHttpStatus(error42) {
  var _a19;
  for (const candidate of walkErrorChain(error42)) {
    const status = (_a19 = getNumericProperty(candidate, "status")) !== null && _a19 !== void 0 ? _a19 : getNumericProperty(candidate, "statusCode");
    if (status === 429 || status !== void 0 && status >= 500 && status < 600) {
      return true;
    }
  }
  return false;
}
function isAgentStoreTransientNetworkError(error42) {
  for (const candidate of walkErrorChain(error42)) {
    if (!(candidate instanceof Error) || candidate.name === "AbortError") {
      continue;
    }
    const code = networkErrorCode(candidate);
    if (code !== void 0 && TRANSIENT_NETWORK_ERROR_CODES.has(code)) {
      return true;
    }
    const message = candidate.message.toLowerCase();
    if (TRANSIENT_NETWORK_ERROR_MESSAGES.some((fragment) => message.includes(fragment))) {
      return true;
    }
  }
  return false;
}
function* walkErrorChain(error42) {
  const seen = /* @__PURE__ */ new Set();
  const stack = [error42];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === void 0 || seen.has(current)) {
      continue;
    }
    seen.add(current);
    yield current;
    if (typeof current !== "object" || current === null) {
      continue;
    }
    if ("cause" in current && current.cause !== void 0) {
      stack.push(current.cause);
    }
    if (current instanceof AggregateError) {
      for (const nested of current.errors) {
        stack.push(nested);
      }
    }
  }
}
function getNumericProperty(value, property) {
  if (typeof value !== "object" || value === null) {
    return void 0;
  }
  let candidate;
  if (property === "status" && "status" in value) {
    candidate = value.status;
  } else if (property === "statusCode" && "statusCode" in value) {
    candidate = value.statusCode;
  } else {
    return void 0;
  }
  return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : void 0;
}
function networkErrorCode(error42) {
  if (!("code" in error42)) {
    return void 0;
  }
  const candidate = error42.code;
  return typeof candidate === "string" ? candidate : void 0;
}
function normalizeConnectCode(code) {
  if (typeof code === "number" && typeof Code[code] === "string") {
    return code;
  }
  if (typeof code !== "string" || code.length === 0) {
    return void 0;
  }
  for (const value of Object.values(Code)) {
    if (typeof value === "number" && Code[value] === code) {
      return value;
    }
  }
  return void 0;
}
