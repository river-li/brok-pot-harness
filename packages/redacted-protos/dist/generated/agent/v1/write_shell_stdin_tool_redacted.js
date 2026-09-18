init_write_shell_stdin_tool_pb();
function toRedactedWriteShellStdinToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedWriteShellStdinArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedWriteShellStdinResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedWriteShellStdinToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteShellStdinToolCall({
    args: msg.args !== void 0 ? fromRedactedWriteShellStdinArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedWriteShellStdinResult(msg.result, purpose, opts) : void 0
  });
}
