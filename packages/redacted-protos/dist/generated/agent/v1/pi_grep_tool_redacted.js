/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/pi_grep_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_pi_grep_tool_pb();
function toRedactedPiGrepToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedPiGrepToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedPiGrepToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedPiGrepToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiGrepToolCall({
    args: msg.args !== void 0 ? fromRedactedPiGrepToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedPiGrepToolResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedPiGrepToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pattern: createRedactedString(msg.pattern, DataClassification.CODE, "pattern", privacyMode),
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0,
    glob: msg.glob !== void 0 ? createRedactedString(msg.glob, DataClassification.PATH, "glob", privacyMode) : void 0,
    ignoreCase: msg.ignoreCase,
    literal: msg.literal,
    context: msg.context,
    limit: msg.limit
  };
}
function fromRedactedPiGrepToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiGrepToolArgs({
    pattern: msg.pattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    glob: msg.glob?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    ignoreCase: msg.ignoreCase,
    literal: msg.literal,
    context: msg.context,
    limit: msg.limit
  });
}
function toRedactedPiGrepToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedPiGrepToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedPiGrepToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedPiGrepToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedPiGrepToolError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedPiGrepToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiGrepToolResult({
    result: fromRedactedPiGrepToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedPiGrepToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedPiGrepToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedPiGrepToolError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedPiGrepToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    output: createRedactedString(msg.output, DataClassification.CODE, "output", privacyMode),
    truncation: msg.truncation !== void 0 ? toRedactedPiTruncation(msg.truncation, privacyMode) : void 0,
    matchLimitReached: msg.matchLimitReached,
    linesTruncated: msg.linesTruncated
  };
}
function fromRedactedPiGrepToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiGrepToolSuccess({
    output: msg.output.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    truncation: msg.truncation !== void 0 ? fromRedactedPiTruncation(msg.truncation, purpose, opts) : void 0,
    matchLimitReached: msg.matchLimitReached,
    linesTruncated: msg.linesTruncated
  });
}
function toRedactedPiGrepToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedPiGrepToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiGrepToolError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

