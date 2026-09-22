/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/fetch_exec_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedFetchArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedFetchArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchArgs({
    url: msg.url,
    toolCallId: msg.toolCallId
  });
}
function toRedactedFetchResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedFetchResult_result(msg.result, privacyMode)
  };
}
function toRedactedFetchResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedFetchSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedFetchError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedFetchResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchResult({
    result: fromRedactedFetchResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedFetchResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedFetchSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedFetchError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedFetchSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    statusCode: msg.statusCode,
    contentType: msg.contentType
  };
}
function fromRedactedFetchSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchSuccess({
    url: msg.url,
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    statusCode: msg.statusCode,
    contentType: msg.contentType
  });
}
function toRedactedFetchError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: msg.url,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedFetchError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchError({
    url: msg.url,
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

