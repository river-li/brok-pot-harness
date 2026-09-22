var EXEC_METADATA_HEADER_VALUE_PATTERN = /^[\x21-\x7e]+$/;
function isExecMetadataHeaderValue(value) {
  return value !== void 0 && EXEC_METADATA_HEADER_VALUE_PATTERN.test(value);
}
function extractSandExecMetadataHeaders(ctx) {
  const headers = {};
  const conversationId = getConversationId(ctx);
  if (isExecMetadataHeaderValue(conversationId)) {
    headers[EXEC_CONVERSATION_ID_HEADER] = conversationId;
  }
  const requestId2 = getRequestId(ctx);
  if (isExecMetadataHeaderValue(requestId2)) {
    headers[EXEC_REQUEST_ID_HEADER] = requestId2;
  }
  return headers;
}
