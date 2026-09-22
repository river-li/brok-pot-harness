/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/connect-errors.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_utils_pb();
init_esm2();
function getAgentStoreConnectCode(error42) {
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
  const message = errorMessageOf(error42).trim();
  if (message.length > 0 && !isOpaqueConnectWireMessage(message)) {
    return stripAgentStoreMarkerTail(message);
  }
  if (error42 instanceof ConnectError) {
    const raw = error42.rawMessage.trim();
    if (raw.length > 0 && !isOpaqueConnectWireMessage(raw)) {
      return stripAgentStoreMarkerTail(raw);
    }
    for (const detail of error42.findDetails(ErrorDetails)) {
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
  if (!isAgentStoreConnectCode(error42, Code.FailedPrecondition) && !isAgentStoreConnectCode(error42, Code.InvalidArgument)) {
    return void 0;
  }
  const haystack = markerHaystacks(error42).find((h) => h.includes(QUOTA_EXCEEDED_MARKER));
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
function isAgentStoreDirNotEmptyConnectError(error42) {
  if (!isAgentStoreConnectCode(error42, Code.FailedPrecondition)) {
    return false;
  }
  return markerHaystacks(error42).some((haystack) => haystack.includes(DIR_NOT_EMPTY_MARKER));
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

