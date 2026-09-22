/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/grep_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_grep_tool_pb();
function toRedactedGrepToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedGrepArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedGrepResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedGrepToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepToolCall({
    args: msg.args !== void 0 ? fromRedactedGrepArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedGrepResult(msg.result, purpose, opts) : void 0
  });
}

