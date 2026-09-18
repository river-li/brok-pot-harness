init_search_conversations_tool_pb();
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
