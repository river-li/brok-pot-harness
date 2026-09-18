var SEND_MESSAGE_BUBBLE_SUFFIX = ":send-message";
function toCloudAgentMessages(conversation) {
  const messages2 = [];
  let turn = -1;
  for (const message of conversation) {
    const kind = messageKind(message);
    if (kind === null) {
      continue;
    }
    if (kind === "human" || kind === "wake") {
      turn += 1;
    }
    if (kind === "wake") {
      const wake = toCloudAgentWake(message);
      messages2.push({
        id: message.bubbleId,
        kind,
        text: wake.label ?? "",
        turn: Math.max(turn, 0),
        wake
      });
      continue;
    }
    if (message.text.trim().length > 0) {
      messages2.push({ id: message.bubbleId, kind, text: message.text, turn: Math.max(turn, 0) });
    }
  }
  return messages2;
}
function messageKind(message) {
  switch (message.type) {
    case ConversationMessage_MessageType.HUMAN:
      if (message.turnSteer === true) return null;
      if (message.isSimulatedMsg === true) {
        return message.simulatedMsgReason === SimulatedMsgReason.SUBSCRIPTION ? "wake" : null;
      }
      return "human";
    case ConversationMessage_MessageType.AI:
      if (message.bubbleId.endsWith(SEND_MESSAGE_BUBBLE_SUFFIX)) {
        return "sent";
      }
      return message.thinking === void 0 && message.toolResults.length === 0 ? "assistant" : null;
    default:
      return null;
  }
}
function createdAtMs(createdAt) {
  if (createdAt.trim().length === 0) return null;
  const parsed2 = Date.parse(createdAt);
  return Number.isFinite(parsed2) ? parsed2 : null;
}
function toCloudAgentWake(message) {
  return cloudAgentWakeFromSubscriptionMetadata(
    message.simulatedMessageMetadata,
    createdAtMs(message.createdAt)
  );
}
