init_conversation_search_exec_pb();
init_zod();
var parametersSchema24 = external_exports.object({
  query: external_exports.string().min(1).describe("One or two keywords, or a short exact phrase in quotes, to search for in conversation titles and visible user/assistant message text. Every unquoted keyword must match the same conversation; use separate searches for additional keywords."),
  limit: external_exports.number().int().min(1).max(100).optional().describe("Maximum number of conversation results to return (1-100). Defaults to 20.")
});
var CONVERSATION_SEARCH_SOURCE_LABELS = {
  [ConversationSearchSource.UNSPECIFIED]: "unknown",
  [ConversationSearchSource.LOCAL]: "local",
  [ConversationSearchSource.CLOUD_CACHE]: "cloud-cache"
};
