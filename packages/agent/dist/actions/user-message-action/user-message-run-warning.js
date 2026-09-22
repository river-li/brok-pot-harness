init_dist4();
var logger64 = createLogger("@anysphere/agent");
var CONSECUTIVE_USER_MESSAGE_WARNING_THRESHOLD = 3;
var TAIL_INSPECTION_WINDOW = 12;
function extractCursorProviderOptions2(message) {
  const providerOptions = message.providerOptions;
  return providerOptions?.cursor;
}
function warnIfLongTrailingUserMessageRun(ctx, messages2, invocationId) {
  const lastMessage = messages2[messages2.length - 1];
  if (lastMessage?.role !== "user") {
    return;
  }
  let trailingConsecutiveUserMessages = 0;
  for (let idx = messages2.length - 1; idx >= 0; idx -= 1) {
    const message = messages2[idx];
    if (message.role !== "user") {
      break;
    }
    if (isSyntheticUserMessage(message)) {
      continue;
    }
    trailingConsecutiveUserMessages += 1;
  }
  if (trailingConsecutiveUserMessages <= CONSECUTIVE_USER_MESSAGE_WARNING_THRESHOLD) {
    return;
  }
  let distanceToLastAssistant = -1;
  for (let idx = messages2.length - 1; idx >= 0; idx -= 1) {
    if (messages2[idx].role === "assistant") {
      distanceToLastAssistant = messages2.length - 1 - idx;
      break;
    }
  }
  const tailMessages = messages2.slice(-TAIL_INSPECTION_WINDOW);
  const tailRoles = tailMessages.map((message) => message.role);
  const tailCursorMessageIds = [];
  const tailCursorRequestIds = [];
  for (const message of tailMessages) {
    const cursor = extractCursorProviderOptions2(message);
    if (cursor?.messageId !== void 0) {
      tailCursorMessageIds.push(cursor.messageId);
    }
    if (cursor?.requestId !== void 0) {
      tailCursorRequestIds.push(cursor.requestId);
    }
  }
  const tailDistinctCursorMessageIdCount = new Set(tailCursorMessageIds).size;
  const tailDistinctCursorRequestIdCount = new Set(tailCursorRequestIds).size;
  logger64.warn(ctx, "Turn contains unusually long trailing run of consecutive user messages", {
    trailingConsecutiveUserMessages,
    threshold: CONSECUTIVE_USER_MESSAGE_WARNING_THRESHOLD,
    totalMessages: messages2.length,
    invocationId,
    distanceToLastAssistant,
    tailInspectionWindow: TAIL_INSPECTION_WINDOW,
    tailRoles,
    tailCursorMessageIdCount: tailCursorMessageIds.length,
    tailDistinctCursorMessageIdCount,
    hasDuplicateTailCursorMessageIds: tailDistinctCursorMessageIdCount < tailCursorMessageIds.length,
    tailCursorRequestIdCount: tailCursorRequestIds.length,
    tailDistinctCursorRequestIdCount,
    hasDuplicateTailCursorRequestIds: tailDistinctCursorRequestIdCount < tailCursorRequestIds.length
  });
}
