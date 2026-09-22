/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/conversation_search_exec_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedConversationSearchArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    query: createRedactedString(msg.query, DataClassification.CODE, "query", privacyMode),
    toolCallId: msg.toolCallId,
    limit: msg.limit
  };
}
function fromRedactedConversationSearchArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSearchArgs({
    query: msg.query.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    toolCallId: msg.toolCallId,
    limit: msg.limit
  });
}
function toRedactedConversationSearchResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedConversationSearchResult_result(msg.result, privacyMode)
  };
}
function toRedactedConversationSearchResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedConversationSearchSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedConversationSearchError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedConversationSearchResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSearchResult({
    result: fromRedactedConversationSearchResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedConversationSearchResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedConversationSearchSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedConversationSearchError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedConversationSearchSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    hits: msg.hits.map((v2) => toRedactedConversationSearchHit(v2, privacyMode)),
    truncated: msg.truncated,
    partial: msg.partial,
    rebuilding: msg.rebuilding
  };
}
function fromRedactedConversationSearchSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSearchSuccess({
    hits: msg.hits.map((v2) => fromRedactedConversationSearchHit(v2, purpose, opts)),
    truncated: msg.truncated,
    partial: msg.partial,
    rebuilding: msg.rebuilding
  });
}
function toRedactedConversationSearchHit(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    conversationId: msg.conversationId,
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode),
    source: msg.source,
    updatedAtMs: msg.updatedAtMs,
    snippet: msg.snippet !== void 0 ? createRedactedString(msg.snippet, DataClassification.CODE, "snippet", privacyMode) : void 0
  };
}
function fromRedactedConversationSearchHit(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSearchHit({
    conversationId: msg.conversationId,
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    source: msg.source,
    updatedAtMs: msg.updatedAtMs,
    snippet: msg.snippet?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedConversationSearchError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedConversationSearchError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSearchError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

