function generateShellExecId(ctx, toolCallId) {
  const requestId2 = getRequestId(ctx);
  return generateSeededUuid(requestId2 === void 0 ? toolCallId : `${requestId2}:${toolCallId}`);
}
