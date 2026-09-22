/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/semsearch_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedSemSearchToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSemSearchToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSemSearchToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSemSearchToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SemSearchToolCall({
    args: msg.args !== void 0 ? fromRedactedSemSearchToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSemSearchToolResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedSemSearchToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    query: createRedactedString(msg.query, DataClassification.CODE, "query", privacyMode),
    targetDirectories: msg.targetDirectories.map((v2) => createRedactedString(v2, DataClassification.PATH, "target_directories", privacyMode)),
    explanation: createRedactedString(msg.explanation, DataClassification.CODE, "explanation", privacyMode)
  };
}
function fromRedactedSemSearchToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SemSearchToolArgs({
    query: msg.query.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    targetDirectories: msg.targetDirectories.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    explanation: msg.explanation.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSemSearchToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSemSearchToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedSemSearchToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSemSearchToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSemSearchToolError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSemSearchToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SemSearchToolResult({
    result: fromRedactedSemSearchToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSemSearchToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSemSearchToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSemSearchToolError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSemSearchToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    results: createRedactedString(msg.results, DataClassification.CODE, "results", privacyMode),
    codeResults: msg.codeResults.map((v2) => toRedactedCodeResult(v2, privacyMode))
  };
}
function fromRedactedSemSearchToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SemSearchToolSuccess({
    results: msg.results.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    codeResults: msg.codeResults.map((v2) => fromRedactedCodeResult(v2, purpose, opts))
  });
}
function toRedactedSemSearchToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    errorMessage: createRedactedString(msg.errorMessage, DataClassification.CODE, "error_message", privacyMode)
  };
}
function fromRedactedSemSearchToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SemSearchToolError({
    errorMessage: msg.errorMessage.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

