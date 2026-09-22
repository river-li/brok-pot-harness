/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/delete_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_delete_tool_pb();
function toRedactedDeleteToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedDeleteArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedDeleteResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedDeleteToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteToolCall({
    args: msg.args !== void 0 ? fromRedactedDeleteArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedDeleteResult(msg.result, purpose, opts) : void 0
  });
}

