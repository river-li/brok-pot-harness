/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/agent-run-error.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_utils_pb();
init_esm2();

// @recovered-fragment 2/2
init_unknown_record();
var SAND_INCLUDED_LIMIT_REASON = "sand_included_limit";
var ENTERPRISE_GROK_BOT_TRIAL_CAP_REASON = "enterprise_grok_bot_trial_cap";
var GROK_CURSOR_USAGE_LIMIT_HINT = "Cloud agents launched from Grok Bot draw on your team's Cursor usage, which is separate from your Grok Bot message allowance.";
var MODEL_NAME_LEAKING_BACKEND_ERRORS = /* @__PURE__ */ new Set([
  ErrorDetails_Error.BAD_MODEL_NAME,
  ErrorDetails_Error.MAX_MODE_REQUIRED,
  ErrorDetails_Error.MODEL_NO_LONGER_SUPPORTED
]);
var MODEL_UNAVAILABLE_TITLE = "Model Unavailable";
var MODEL_UNAVAILABLE_DETAIL = "This agent's model isn't available. Try again, or switch the agent to a different model.";
var BackendConnectErrors = class _BackendConnectErrors {
  static asConnectError(candidate) {
    if (candidate instanceof ConnectError) return candidate;
    return _BackendConnectErrors.hasConnectErrorShape(candidate) ? candidate : null;
  }
  static hasConnectErrorShape(candidate) {
    return typeof candidate === "object" && candidate !== null && "name" in candidate && candidate.name === "ConnectError" && "code" in candidate && typeof candidate.code === "number" && "findDetails" in candidate && typeof candidate.findDetails === "function";
  }
  static usageLimitEntry(connectError) {
    for (const entry of connectError.findDetails(ErrorDetails)) {
      const rateLimitReason = entry.details?.additionalInfo?.rateLimitReason;
      if (rateLimitReason === SAND_INCLUDED_LIMIT_REASON || rateLimitReason === ENTERPRISE_GROK_BOT_TRIAL_CAP_REASON) {
        return entry;
      }
    }
    return void 0;
  }
  static backendEntry(connectError) {
    return _BackendConnectErrors.usageLimitEntry(connectError) ?? connectError.findDetails(ErrorDetails)[0];
  }
  static backendDetails(connectError) {
    return _BackendConnectErrors.backendEntry(connectError)?.details;
  }
  static scan(error42) {
    const matches = { usageLimit: null, detailed: null, first: null };
    _BackendConnectErrors.walk(error42, /* @__PURE__ */ new Set(), matches);
    return matches;
  }
  static walk(error42, seen, matches) {
    if (error42 == null || typeof error42 !== "object" || seen.has(error42)) return;
    seen.add(error42);
    const connectError = _BackendConnectErrors.asConnectError(error42);
    if (connectError != null) {
      matches.first ??= connectError;
      if (connectError.findDetails(ErrorDetails).length > 0) {
        matches.detailed ??= connectError;
        if (_BackendConnectErrors.usageLimitEntry(connectError) !== void 0) {
          matches.usageLimit ??= connectError;
        }
      }
    }
    _BackendConnectErrors.walk(error42.cause, seen, matches);
    const aggregated = error42.errors;
    if (Array.isArray(aggregated)) {
      for (const inner of aggregated) {
        _BackendConnectErrors.walk(inner, seen, matches);
      }
    }
  }
};
function findBackendConnectError(error42, requireDetails = true) {
  const matches = BackendConnectErrors.scan(error42);
  const detailed = matches.usageLimit ?? matches.detailed;
  if (detailed != null) return detailed;
  return requireDetails ? null : matches.first;
}
function getBackendErrorDetailMessage(error42) {
  const connectError = findBackendConnectError(error42);
  if (connectError == null) return null;
  const detail = BackendConnectErrors.backendDetails(connectError);
  const title = detail?.title.trim();
  const message = detail?.detail.trim();
  if (title == null || title.length === 0) return message ?? null;
  if (message == null || message.length === 0 || message === title) {
    return title;
  }
  return `${title}

${message}`;
}
function formatAgentRunError(error42) {
  const backendDetail = getBackendErrorDetailMessage(error42);
  return backendDetail ?? error42.message;
}
function errorChainIncludes(error42, matches, seen = /* @__PURE__ */ new Set()) {
  if (matches(error42)) return true;
  if (error42 == null || typeof error42 !== "object" || seen.has(error42)) return false;
  seen.add(error42);
  const cause = "cause" in error42 ? error42.cause : void 0;
  if (cause != null && errorChainIncludes(cause, matches, seen)) return true;
  const aggregated = "errors" in error42 ? error42.errors : void 0;
  return Array.isArray(aggregated) && aggregated.some((inner) => errorChainIncludes(inner, matches, seen));
}
function chainCarriesMarker(error42, marker17) {
  return errorChainIncludes(
    error42,
    (candidate) => isUnknownRecord(candidate) && candidate[marker17] === true
  );
}
function isCheckpointPublicationFailure(error42) {
  return chainCarriesMarker(
    error42,
    "isSandCheckpointPublicationError"
  );
}
var KNOWN_INTERNAL_ERROR_KINDS = [
  {
    matches: (error42) => chainCarriesMarker(error42, "isTranscriptJournalFailure"),
    kind: "transcript_journal_corruption"
  },
  {
    matches: (error42) => chainCarriesMarker(
      error42,
      "isTranscriptAppendAfterCheckpointError"
    ),
    kind: "transcript_append_failed"
  },
  {
    matches: (error42) => errorChainIncludes(error42, isFirstTokenStallError),
    kind: "first_token_stall"
  },
  {
    matches: (error42) => errorChainIncludes(error42, isStreamIdleError),
    kind: "opaque_wire_failure"
  },
  {
    matches: (error42) => chainCarriesMarker(error42, "isConversationTooLarge"),
    kind: "conversation_too_large"
  },
  {
    matches: (error42) => errorChainIncludes(
      error42,
      (candidate) => candidate instanceof SandBoxNotReadyError && candidate.errorKind === "box_starting"
    ),
    kind: "box_starting"
  },
  {
    matches: (error42) => errorChainIncludes(
      error42,
      (candidate) => candidate instanceof SandBoxNotReadyError && candidate.errorKind === "box_not_responding"
    ),
    kind: "box_not_responding"
  },
  {
    matches: (error42) => errorChainIncludes(
      error42,
      (candidate) => candidate instanceof SandBoxNotReadyError && candidate.errorKind === "box_no_monitor_available"
    ),
    kind: "box_no_monitor_available"
  },
  {
    matches: (error42) => errorChainIncludes(
      error42,
      (candidate) => candidate instanceof SandBoxNotReadyError && candidate.errorKind === "box_hibernated"
    ),
    kind: "box_hibernated"
  },
  {
    matches: (error42) => findBackendConnectError(error42, false) != null || isTransientStreamError(error42),
    kind: "opaque_wire_failure"
  }
];
function describeAgentRunError(error42) {
  const formatted = error42 instanceof Error ? formatAgentRunError(error42) : String(error42);
  if (isCheckpointPublicationFailure(error42)) {
    return {
      errorKind: "checkpoint_publication_failed",
      rawDetail: formatted
    };
  }
  if (isBackendUnreachableError(error42)) {
    return {
      errorKind: "backend_unreachable",
      rawDetail: formatted
    };
  }
  if (isProviderCapacityError(error42)) {
    return {
      errorKind: "provider_overloaded",
      rawDetail: formatted
    };
  }
  const connectError = findBackendConnectError(error42);
  const custom3 = connectError == null ? void 0 : BackendConnectErrors.backendDetails(connectError);
  const title = custom3?.title?.trim() ?? "";
  if (custom3 == null) {
    const known = KNOWN_INTERNAL_ERROR_KINDS.find(({ matches }) => matches(error42));
    if (known != null) {
      return { errorKind: known.kind, rawDetail: formatted };
    }
    return {
      errorKind: "unknown_failure",
      errorParams: { technicalDetail: formatted },
      rawDetail: formatted
    };
  }
  const actions = mapErrorDetailButtons(custom3?.buttons);
  const backendErrorCode = connectError == null ? void 0 : BackendConnectErrors.backendEntry(connectError)?.error;
  if (backendErrorCode !== void 0 && MODEL_NAME_LEAKING_BACKEND_ERRORS.has(backendErrorCode)) {
    return {
      title: MODEL_UNAVAILABLE_TITLE,
      detail: MODEL_UNAVAILABLE_DETAIL,
      errorKind: "backend_message",
      ...actions.length > 0 ? { actions } : {}
    };
  }
  const rawMessage = error42 instanceof Error ? error42.message : String(error42);
  const rateLimitReason = custom3?.additionalInfo?.rateLimitReason;
  const isUsageLimit = rateLimitReason === SAND_INCLUDED_LIMIT_REASON || rateLimitReason === ENTERPRISE_GROK_BOT_TRIAL_CAP_REASON;
  let detail = title.length > 0 ? custom3?.detail?.trim() ?? "" : formatted;
  if (detail.length === 0) {
    detail = formatted;
  }
  const isCursorUsageLimit = !isUsageLimit && custom3?.additionalInfo?.spendLimitHit !== void 0;
  if (isCursorUsageLimit) {
    detail = detail.length > 0 ? `${GROK_CURSOR_USAGE_LIMIT_HINT}

${detail}` : GROK_CURSOR_USAGE_LIMIT_HINT;
  }
  const allActions = isUsageLimit && actions.length > 0 ? actions.map(
    (action, index) => index === 0 && action.kind !== "switch-model" ? { ...action, emphasis: "primary" } : action
  ) : actions;
  return {
    ...title.length > 0 ? { title } : {},
    detail,
    ...formatted !== rawMessage ? { rawDetail: rawMessage } : {},
    errorKind: isUsageLimit ? "usage_limit" : "backend_message",
    ...allActions.length > 0 ? { actions: allActions } : {}
  };
}
var MAX_TRAY_ACTIONS = 3;
var CURSOR_WEBSITE_ORIGIN = "https://cursor.com";
var SUPPORTED_ERROR_DASHBOARD_ACTIONS = new Set(SAND_DASHBOARD_ACTION_VERBS);
function isSupportedDashboardActionVerb(action) {
  return SUPPORTED_ERROR_DASHBOARD_ACTIONS.has(action);
}
function mapErrorDetailButtons(buttons2) {
  if (buttons2 == null || buttons2.length === 0) return [];
  const actions = [];
  let hasSwitchModel = false;
  for (const button of buttons2) {
    if (actions.length >= MAX_TRAY_ACTIONS) break;
    switch (button.action.case) {
      case "url": {
        const url2 = button.action.value.url;
        if (isHttpExternalUrl(url2) && button.label.length > 0) {
          actions.push({ kind: "open-url", label: button.label, url: url2 });
        }
        break;
      }
      case "upgrade": {
        const url2 = checkoutDeepControlUrl(button.action.value);
        actions.push(
          button.label.length > 0 ? { kind: "open-url", label: button.label, url: url2 } : { kind: button.action.case, url: url2 }
        );
        break;
      }
      case "upgradeChoice": {
        const url2 = `${CURSOR_WEBSITE_ORIGIN}/pricing`;
        actions.push(
          button.label.length > 0 ? { kind: "open-url", label: button.label, url: url2 } : { kind: button.action.case, url: url2 }
        );
        break;
      }
      case "switchModel": {
        if (!hasSwitchModel) {
          hasSwitchModel = true;
          actions.push({ kind: "switch-model" });
        }
        break;
      }
      case "dashboardAction": {
        const value = button.action.value;
        if (isSupportedDashboardActionVerb(value.action) && button.label.length > 0) {
          const successMessage = value.successMessage ?? "";
          actions.push({
            kind: "dashboard-action",
            label: button.label,
            action: value.action,
            args: { ...value.args },
            successMessage: successMessage.length > 0 ? successMessage : null
          });
        }
        break;
      }
      default:
        break;
    }
  }
  return actions;
}
function checkoutDeepControlUrl(action) {
  const tier = action.membershipToUpgradeTo === "pro" || action.membershipToUpgradeTo === "pro_plus" || action.membershipToUpgradeTo === "ultra" ? action.membershipToUpgradeTo : "pro";
  let url2 = `${CURSOR_WEBSITE_ORIGIN}/api/auth/checkoutDeepControl?tier=${tier}`;
  if (action.allowTrial === true) {
    url2 += "&allowTrial=true";
  } else if (action.allowTrial === false) {
    url2 += "&allowTrial=false";
  }
  return url2;
}

