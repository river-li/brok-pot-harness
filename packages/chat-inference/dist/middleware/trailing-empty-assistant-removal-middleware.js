init_dist4();
var logger5 = createLogger("@anysphere/chat-inference/trailing-empty-assistant-removal-middleware");
function isEmptyAssistantMessage2(message) {
  if (message.role !== "assistant") {
    return false;
  }
  if (typeof message.content === "string") {
    return message.content.length === 0;
  }
  return message.content.length === 0;
}
function removeTrailingEmptyAssistantMessages(messages2) {
  const cleanedMessages = [...messages2];
  let removedMessageCount = 0;
  while (cleanedMessages.length > 0 && isEmptyAssistantMessage2(cleanedMessages[cleanedMessages.length - 1])) {
    cleanedMessages.pop();
    removedMessageCount++;
  }
  return { cleanedMessages, removedMessageCount };
}
var TrailingEmptyAssistantRemovalMiddleware = class extends BaseMiddleware {
  stream(ctx, invocationId, tools, options2) {
    const messages2 = this.innerExecutor.getMessages();
    const { cleanedMessages, removedMessageCount } = removeTrailingEmptyAssistantMessages(messages2);
    if (removedMessageCount > 0) {
      logger5.info(ctx, "[trailing-empty-assistant-removal] removing empty assistant message(s) before stream", {
        messageCount: messages2.length,
        removedMessageCount
      });
      this.innerExecutor.clearMessages();
      if (cleanedMessages.length > 0) {
        this.innerExecutor.appendMessages(cleanedMessages);
      }
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
var createTrailingEmptyAssistantRemovalMiddleware = () => {
  return (executor) => new TrailingEmptyAssistantRemovalMiddleware(executor);
};
var trailingEmptyAssistantRemovalMiddleware = createTrailingEmptyAssistantRemovalMiddleware();
