/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/pi_find_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_pi_find_tool_pb();
function toRedactedPiFindToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedPiFindToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedPiFindToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedPiFindToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiFindToolCall({
    args: msg.args !== void 0 ? fromRedactedPiFindToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedPiFindToolResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedPiFindToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pattern: createRedactedString(msg.pattern, DataClassification.PATH, "pattern", privacyMode),
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0,
    limit: msg.limit
  };
}
function fromRedactedPiFindToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiFindToolArgs({
    pattern: msg.pattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    limit: msg.limit
  });
}
function toRedactedPiFindToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedPiFindToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedPiFindToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedPiFindToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedPiFindToolError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedPiFindToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiFindToolResult({
    result: fromRedactedPiFindToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedPiFindToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedPiFindToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedPiFindToolError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedPiFindToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    output: createRedactedString(msg.output, DataClassification.PATH, "output", privacyMode),
    truncation: msg.truncation !== void 0 ? toRedactedPiTruncation(msg.truncation, privacyMode) : void 0,
    resultLimitReached: msg.resultLimitReached
  };
}
function fromRedactedPiFindToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiFindToolSuccess({
    output: msg.output.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    truncation: msg.truncation !== void 0 ? fromRedactedPiTruncation(msg.truncation, purpose, opts) : void 0,
    resultLimitReached: msg.resultLimitReached
  });
}
function toRedactedPiFindToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedPiFindToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiFindToolError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

