/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/pi_ls_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_pi_ls_tool_pb();
function toRedactedPiLsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedPiLsToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedPiLsToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedPiLsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiLsToolCall({
    args: msg.args !== void 0 ? fromRedactedPiLsToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedPiLsToolResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedPiLsToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0,
    limit: msg.limit
  };
}
function fromRedactedPiLsToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiLsToolArgs({
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    limit: msg.limit
  });
}
function toRedactedPiLsToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedPiLsToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedPiLsToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedPiLsToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedPiLsToolError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedPiLsToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiLsToolResult({
    result: fromRedactedPiLsToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedPiLsToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedPiLsToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedPiLsToolError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedPiLsToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    output: createRedactedString(msg.output, DataClassification.PATH, "output", privacyMode),
    truncation: msg.truncation !== void 0 ? toRedactedPiTruncation(msg.truncation, privacyMode) : void 0,
    entryLimitReached: msg.entryLimitReached
  };
}
function fromRedactedPiLsToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiLsToolSuccess({
    output: msg.output.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    truncation: msg.truncation !== void 0 ? fromRedactedPiTruncation(msg.truncation, purpose, opts) : void 0,
    entryLimitReached: msg.entryLimitReached
  });
}
function toRedactedPiLsToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedPiLsToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiLsToolError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

