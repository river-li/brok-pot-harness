/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/ai_attribution_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_ai_attribution_tool_pb();
function toRedactedAiAttributionArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    filePaths: msg.filePaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "file_paths", privacyMode)),
    startLine: msg.startLine,
    endLine: msg.endLine,
    commitHashes: msg.commitHashes,
    outputMode: msg.outputMode,
    maxCommits: msg.maxCommits,
    includeLineRanges: msg.includeLineRanges
  };
}
function fromRedactedAiAttributionArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AiAttributionArgs({
    filePaths: msg.filePaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    startLine: msg.startLine,
    endLine: msg.endLine,
    commitHashes: msg.commitHashes,
    outputMode: msg.outputMode,
    maxCommits: msg.maxCommits,
    includeLineRanges: msg.includeLineRanges
  });
}
function toRedactedAiAttributionResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedAiAttributionResult_result(msg.result, privacyMode)
  };
}
function toRedactedAiAttributionResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedAiAttributionSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedAiAttributionError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedAiAttributionResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AiAttributionResult({
    result: fromRedactedAiAttributionResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedAiAttributionResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedAiAttributionSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedAiAttributionError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedAiAttributionSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    attributionText: createRedactedString(msg.attributionText, DataClassification.CODE, "attribution_text", privacyMode),
    outputLocation: msg.outputLocation !== void 0 ? toRedactedOutputLocation(msg.outputLocation, privacyMode) : void 0
  };
}
function fromRedactedAiAttributionSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AiAttributionSuccess({
    attributionText: msg.attributionText.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputLocation: msg.outputLocation !== void 0 ? fromRedactedOutputLocation(msg.outputLocation, purpose, opts) : void 0
  });
}
function toRedactedAiAttributionError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedAiAttributionError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AiAttributionError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedAiAttributionToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedAiAttributionArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedAiAttributionResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedAiAttributionToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AiAttributionToolCall({
    args: msg.args !== void 0 ? fromRedactedAiAttributionArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedAiAttributionResult(msg.result, purpose, opts) : void 0
  });
}

