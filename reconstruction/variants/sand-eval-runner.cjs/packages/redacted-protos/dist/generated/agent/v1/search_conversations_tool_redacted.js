/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/search_conversations_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedSearchConversationsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedConversationSearchArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedConversationSearchResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSearchConversationsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SearchConversationsToolCall({
    args: msg.args !== void 0 ? fromRedactedConversationSearchArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedConversationSearchResult(msg.result, purpose, opts) : void 0
  });
}

