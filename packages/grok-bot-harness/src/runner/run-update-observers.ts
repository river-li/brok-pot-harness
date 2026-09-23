function createRunUpdateObservers(run) {
  return {
    noteUpdate: (update) => {
      switch (update.type) {
        case "text-delta":
          run.observeFirstToken("text");
          run.collectors.collectText(update.text);
          return;
        case "thinking-delta":
          run.observeFirstToken("thinking");
          return;
        case "tool-call":
          run.observeFirstToken("tool_call");
          return;
        case "send-message":
          run.collectors.collectSendMessage();
          if (update.message.type === "widget" || update.message.type === "secret-request" || update.message.type === "auto-review-approval" || update.message.type === "connector-grant" || update.message.type === "credential-request") {
            run.pause();
          }
          if (update.message.type === "text") {
            run.collectors.collectAgentMessage(update.message.content);
          }
          return;
        default:
          return;
      }
    },
    noteDelivered: run.onDelivered,
    noteReactionApplied: run.collectors.collectReaction
  };
}
