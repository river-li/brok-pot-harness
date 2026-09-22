/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/ls_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedLsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedLsArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedLsResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedLsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsToolCall({
    args: msg.args !== void 0 ? fromRedactedLsArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedLsResult(msg.result, purpose, opts) : void 0
  });
}

