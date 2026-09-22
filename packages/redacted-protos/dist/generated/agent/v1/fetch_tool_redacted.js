/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/fetch_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_fetch_tool_pb();
function toRedactedFetchToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedFetchArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedFetchResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedFetchToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchToolCall({
    args: msg.args !== void 0 ? fromRedactedFetchArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedFetchResult(msg.result, purpose, opts) : void 0
  });
}

