/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/glob_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedGlobToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    targetDirectory: msg.targetDirectory !== void 0 ? createRedactedString(msg.targetDirectory, DataClassification.PATH, "target_directory", privacyMode) : void 0,
    globPattern: createRedactedString(msg.globPattern, DataClassification.PATH, "glob_pattern", privacyMode)
  };
}
function fromRedactedGlobToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GlobToolArgs({
    targetDirectory: msg.targetDirectory?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    globPattern: msg.globPattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGlobToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGlobToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedGlobToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedGlobToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGlobToolError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGlobToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GlobToolResult({
    result: fromRedactedGlobToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedGlobToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedGlobToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGlobToolError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGlobToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedGlobToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GlobToolError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGlobToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pattern: createRedactedString(msg.pattern, DataClassification.PATH, "pattern", privacyMode),
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    files: msg.files.map((v2) => createRedactedString(v2, DataClassification.PATH, "files", privacyMode)),
    totalFiles: msg.totalFiles,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated
  };
}
function fromRedactedGlobToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GlobToolSuccess({
    pattern: msg.pattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    files: msg.files.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    totalFiles: msg.totalFiles,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated
  });
}
function toRedactedGlobToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedGlobToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedGlobToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedGlobToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GlobToolCall({
    args: msg.args !== void 0 ? fromRedactedGlobToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedGlobToolResult(msg.result, purpose, opts) : void 0
  });
}

