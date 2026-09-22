/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference/dist/middleware/trailing-empty-assistant-removal-middleware.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
var logger4 = createLogger("@anysphere/chat-inference/trailing-empty-assistant-removal-middleware");
function isEmptyAssistantMessage2(message) {
  if (message.role !== "assistant") {
    return false;
  }
  if (typeof message.content === "string") {
    return message.content.length === 0;
  }
  return message.content.length === 0;
}
function removeTrailingEmptyAssistantMessages(messages) {
  const cleanedMessages = [...messages];
  let removedMessageCount = 0;
  while (cleanedMessages.length > 0 && isEmptyAssistantMessage2(cleanedMessages[cleanedMessages.length - 1])) {
    cleanedMessages.pop();
    removedMessageCount++;
  }
  return { cleanedMessages, removedMessageCount };
}
var TrailingEmptyAssistantRemovalMiddleware = class extends BaseMiddleware {
  stream(ctx, invocationId, tools, options2) {
    const messages = this.innerExecutor.getMessages();
    const { cleanedMessages, removedMessageCount } = removeTrailingEmptyAssistantMessages(messages);
    if (removedMessageCount > 0) {
      logger4.info(ctx, "[trailing-empty-assistant-removal] removing empty assistant message(s) before stream", {
        messageCount: messages.length,
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

