function withinLocalExecFileCap(bytesBase64) {
  return Math.floor(bytesBase64.length * 3 / 4) <= DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES;
}
var messagesResultSchema2 = messagesResultSchema.refine(
  (result) => result.kind !== "fetch-attachment" || withinLocalExecFileCap(result.bytesBase64),
  { message: "attachment exceeds the file limit", path: ["bytesBase64"] }
);
function parseMessagesResult(u2) {
  const result = messagesResultSchema2.safeParse(u2);
  if (!result.success) {
    throw new SandWireParseError(`messages result: ${describeZodIssues(result.error)}`);
  }
  return result.data;
}
var SAND_MESSAGES_SEND_TIMEOUT_MS = 3 * 60 * 1e3;
function isUntimedMessagesOp(op) {
  return op.kind === "send";
}
var SAND_MESSAGES_READ_TIMEOUT_MS = 3e4;
function messagesOpIdleBudgetMs(op) {
  return isUntimedMessagesOp(op) ? SAND_MESSAGES_SEND_TIMEOUT_MS : SAND_MESSAGES_READ_TIMEOUT_MS;
}
