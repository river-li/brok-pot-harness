/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/write_shell_stdin_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

