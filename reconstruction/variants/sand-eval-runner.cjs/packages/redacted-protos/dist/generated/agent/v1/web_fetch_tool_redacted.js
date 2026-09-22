/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/web_fetch_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedWebFetchArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedWebFetchArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchArgs({
    url: msg.url,
    toolCallId: msg.toolCallId
  });
}
function toRedactedWebFetchResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedWebFetchResult_result(msg.result, privacyMode)
  };
}
function toRedactedWebFetchResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedWebFetchSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedWebFetchError(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedWebFetchRejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedWebFetchResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchResult({
    result: fromRedactedWebFetchResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedWebFetchResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedWebFetchSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedWebFetchError(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedWebFetchRejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedWebFetchSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    markdown: createRedactedString(msg.markdown, DataClassification.CODE, "markdown", privacyMode),
    outputLocation: msg.outputLocation !== void 0 ? toRedactedOutputLocation(msg.outputLocation, privacyMode) : void 0
  };
}
function fromRedactedWebFetchSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchSuccess({
    url: msg.url,
    markdown: msg.markdown.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputLocation: msg.outputLocation !== void 0 ? fromRedactedOutputLocation(msg.outputLocation, purpose, opts) : void 0
  });
}
function toRedactedWebFetchError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedWebFetchError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchError({
    url: msg.url,
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedWebFetchRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedWebFetchRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchRejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedWebFetchToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedWebFetchArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedWebFetchResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedWebFetchToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchToolCall({
    args: msg.args !== void 0 ? fromRedactedWebFetchArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedWebFetchResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedWebFetchRequestQuery(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedWebFetchArgs(msg.args, privacyMode) : void 0,
    skipApproval: msg.skipApproval,
    smartModeApproval: msg.smartModeApproval !== void 0 ? toRedactedSmartModeApproval(msg.smartModeApproval, privacyMode) : void 0
  };
}
function fromRedactedWebFetchRequestQuery(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchRequestQuery({
    args: msg.args !== void 0 ? fromRedactedWebFetchArgs(msg.args, purpose, opts) : void 0,
    skipApproval: msg.skipApproval,
    smartModeApproval: msg.smartModeApproval !== void 0 ? fromRedactedSmartModeApproval(msg.smartModeApproval, purpose, opts) : void 0
  });
}
function toRedactedWebFetchRequestResponse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedWebFetchRequestResponse_result(msg.result, privacyMode)
  };
}
function toRedactedWebFetchRequestResponse_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "approved":
      return { case: "approved", value: toRedactedWebFetchRequestResponse_Approved(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedWebFetchRequestResponse_Rejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedWebFetchRequestResponse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchRequestResponse({
    result: fromRedactedWebFetchRequestResponse_result(msg.result, purpose, opts)
  });
}
function fromRedactedWebFetchRequestResponse_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "approved":
      return { case: "approved", value: fromRedactedWebFetchRequestResponse_Approved(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedWebFetchRequestResponse_Rejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedWebFetchRequestResponse_Approved(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedWebFetchRequestResponse_Approved(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchRequestResponse_Approved({});
}
function toRedactedWebFetchRequestResponse_Rejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedWebFetchRequestResponse_Rejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WebFetchRequestResponse_Rejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

