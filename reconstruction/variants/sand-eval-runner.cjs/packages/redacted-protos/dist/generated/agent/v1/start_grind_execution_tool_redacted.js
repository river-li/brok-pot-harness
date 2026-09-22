/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/start_grind_execution_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedStartGrindExecutionArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    explanation: msg.explanation !== void 0 ? createRedactedString(msg.explanation, DataClassification.CODE, "explanation", privacyMode) : void 0,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedStartGrindExecutionArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StartGrindExecutionArgs({
    explanation: msg.explanation?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    toolCallId: msg.toolCallId
  });
}
function toRedactedStartGrindExecutionResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedStartGrindExecutionResult_result(msg.result, privacyMode)
  };
}
function toRedactedStartGrindExecutionResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedStartGrindExecutionSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedStartGrindExecutionError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedStartGrindExecutionResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StartGrindExecutionResult({
    result: fromRedactedStartGrindExecutionResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedStartGrindExecutionResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedStartGrindExecutionSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedStartGrindExecutionError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedStartGrindExecutionSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedStartGrindExecutionSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StartGrindExecutionSuccess({});
}
function toRedactedStartGrindExecutionError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedStartGrindExecutionError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StartGrindExecutionError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedStartGrindExecutionToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedStartGrindExecutionArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedStartGrindExecutionResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedStartGrindExecutionToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StartGrindExecutionToolCall({
    args: msg.args !== void 0 ? fromRedactedStartGrindExecutionArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedStartGrindExecutionResult(msg.result, purpose, opts) : void 0
  });
}

