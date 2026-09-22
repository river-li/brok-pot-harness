/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/background_shell_exec_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_background_shell_exec_pb();
function toRedactedWriteShellStdinArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    shellId: msg.shellId,
    chars: createRedactedString(msg.chars, DataClassification.CODE, "chars", privacyMode)
  };
}
function fromRedactedWriteShellStdinArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteShellStdinArgs({
    shellId: msg.shellId,
    chars: msg.chars.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedWriteShellStdinResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedWriteShellStdinResult_result(msg.result, privacyMode)
  };
}
function toRedactedWriteShellStdinResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedWriteShellStdinSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedWriteShellStdinError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedWriteShellStdinResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteShellStdinResult({
    result: fromRedactedWriteShellStdinResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedWriteShellStdinResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedWriteShellStdinSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedWriteShellStdinError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedWriteShellStdinSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    shellId: msg.shellId,
    terminalFileLengthBeforeInputWritten: msg.terminalFileLengthBeforeInputWritten
  };
}
function fromRedactedWriteShellStdinSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteShellStdinSuccess({
    shellId: msg.shellId,
    terminalFileLengthBeforeInputWritten: msg.terminalFileLengthBeforeInputWritten
  });
}
function toRedactedWriteShellStdinError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedWriteShellStdinError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteShellStdinError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

