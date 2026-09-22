/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/shell_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedShellToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedShellArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedShellResult(msg.result, privacyMode) : void 0,
    description: msg.description
  };
}
function fromRedactedShellToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellToolCall({
    args: msg.args !== void 0 ? fromRedactedShellArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedShellResult(msg.result, purpose, opts) : void 0,
    description: msg.description
  });
}
function toRedactedShellToolCallStdoutDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode)
  };
}
function fromRedactedShellToolCallStdoutDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellToolCallStdoutDelta({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedShellToolCallStderrDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode)
  };
}
function fromRedactedShellToolCallStderrDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellToolCallStderrDelta({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedShellToolCallDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    delta: toRedactedShellToolCallDelta_delta(msg.delta, privacyMode)
  };
}
function toRedactedShellToolCallDelta_delta(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "stdout":
      return { case: "stdout", value: toRedactedShellToolCallStdoutDelta(oneof.value, privacyMode) };
    case "stderr":
      return { case: "stderr", value: toRedactedShellToolCallStderrDelta(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedShellToolCallDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellToolCallDelta({
    delta: fromRedactedShellToolCallDelta_delta(msg.delta, purpose, opts)
  });
}
function fromRedactedShellToolCallDelta_delta(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "stdout":
      return { case: "stdout", value: fromRedactedShellToolCallStdoutDelta(oneof.value, purpose, opts) };
    case "stderr":
      return { case: "stderr", value: fromRedactedShellToolCallStderrDelta(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}

