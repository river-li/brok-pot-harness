function createSubagentTransport(parentTransport) {
  return {
    onUpdate: (update) => {
      if (update.type === "send-message" || update.type === "react-to-message") {
        parentTransport.onUpdate(update);
      }
    },
    lastSentMessageId: () => parentTransport.lastSentMessageId?.(),
    sendMessageBlockReason: (message, deliverTo) => {
      const address = message.type === "text" || message.type === "attachment" ? message.channel : void 0;
      if (address !== void 0 && VoiceCallChannel.callIdOf(address) !== null) {
        return VoiceCallChannelSends.reason("subagent", {
          address,
          sendTool: SAND_SEND_TO_USER_TOOL_NAME
        });
      }
      return parentTransport.sendMessageBlockReason?.(message, deliverTo);
    }
  };
}
