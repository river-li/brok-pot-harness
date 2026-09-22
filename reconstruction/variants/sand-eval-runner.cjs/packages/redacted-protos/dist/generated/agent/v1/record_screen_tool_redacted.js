/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/record_screen_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedRecordScreenToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedRecordScreenArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedRecordScreenResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedRecordScreenToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenToolCall({
    args: msg.args !== void 0 ? fromRedactedRecordScreenArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedRecordScreenResult(msg.result, purpose, opts) : void 0
  });
}

