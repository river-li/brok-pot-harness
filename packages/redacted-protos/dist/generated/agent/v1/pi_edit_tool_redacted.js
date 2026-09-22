/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/pi_edit_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_pi_edit_tool_pb();
function toRedactedPiEditReplacement(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    oldText: createRedactedString(msg.oldText, DataClassification.CODE, "old_text", privacyMode),
    newText: createRedactedString(msg.newText, DataClassification.CODE, "new_text", privacyMode)
  };
}
function fromRedactedPiEditReplacement(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditReplacement({
    oldText: msg.oldText.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    newText: msg.newText.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPiEditToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedPiEditToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedPiEditToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedPiEditToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditToolCall({
    args: msg.args !== void 0 ? fromRedactedPiEditToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedPiEditToolResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedPiEditToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    edits: msg.edits.map((v2) => toRedactedPiEditReplacement(v2, privacyMode))
  };
}
function fromRedactedPiEditToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditToolArgs({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    edits: msg.edits.map((v2) => fromRedactedPiEditReplacement(v2, purpose, opts))
  });
}
function toRedactedPiEditToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedPiEditToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedPiEditToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedPiEditToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedPiEditToolError(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedPiEditToolRejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedPiEditToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditToolResult({
    result: fromRedactedPiEditToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedPiEditToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedPiEditToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedPiEditToolError(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedPiEditToolRejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedPiEditToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    output: createRedactedString(msg.output, DataClassification.CODE, "output", privacyMode),
    diff: createRedactedString(msg.diff, DataClassification.CODE, "diff", privacyMode),
    patch: createRedactedString(msg.patch, DataClassification.CODE, "patch", privacyMode),
    firstChangedLine: msg.firstChangedLine
  };
}
function fromRedactedPiEditToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditToolSuccess({
    output: msg.output.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    diff: msg.diff.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    patch: msg.patch.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    firstChangedLine: msg.firstChangedLine
  });
}
function toRedactedPiEditToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedPiEditToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditToolError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPiEditToolRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedPiEditToolRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiEditToolRejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

