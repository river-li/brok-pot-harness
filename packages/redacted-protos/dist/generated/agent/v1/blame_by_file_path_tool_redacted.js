/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/blame_by_file_path_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_blame_by_file_path_tool_pb();
function toRedactedBlameByFilePathArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    filePath: createRedactedString(msg.filePath, DataClassification.PATH, "file_path", privacyMode),
    startLine: msg.startLine,
    endLine: msg.endLine
  };
}
function fromRedactedBlameByFilePathArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BlameByFilePathArgs({
    filePath: msg.filePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    startLine: msg.startLine,
    endLine: msg.endLine
  });
}
function toRedactedBlameByFilePathSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode)
  };
}
function fromRedactedBlameByFilePathSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BlameByFilePathSuccess({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedBlameByFilePathError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    errorMessage: createRedactedString(msg.errorMessage, DataClassification.CODE, "error_message", privacyMode)
  };
}
function fromRedactedBlameByFilePathError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BlameByFilePathError({
    errorMessage: msg.errorMessage.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedBlameByFilePathResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedBlameByFilePathResult_result(msg.result, privacyMode)
  };
}
function toRedactedBlameByFilePathResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedBlameByFilePathSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedBlameByFilePathError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedBlameByFilePathResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BlameByFilePathResult({
    result: fromRedactedBlameByFilePathResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedBlameByFilePathResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedBlameByFilePathSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedBlameByFilePathError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedBlameByFilePathToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedBlameByFilePathArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedBlameByFilePathResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedBlameByFilePathToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BlameByFilePathToolCall({
    args: msg.args !== void 0 ? fromRedactedBlameByFilePathArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedBlameByFilePathResult(msg.result, purpose, opts) : void 0
  });
}

