/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference/dist/middleware/continuation-injector-middleware.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var logger2 = createLogger("@anysphere/chat-inference/continuation-injector-middleware");
var CONTINUATION_MESSAGE = "Your previous response was interrupted. Continue from where you left off.";
function isEmptyAssistantMessage(message) {
  if (message.role !== "assistant") {
    return false;
  }
  if (typeof message.content === "string") {
    return message.content.length === 0;
  }
  return message.content.length === 0;
}
function needsContinuationMessage(messages2) {
  if (messages2.length === 0) {
    return false;
  }
  const lastMessage = messages2[messages2.length - 1];
  return lastMessage.role === "assistant" && !isEmptyAssistantMessage(lastMessage);
}
var ContinuationInjectorMiddleware = class extends BaseMiddleware {
  stream(ctx, invocationId, tools, options2) {
    const messages2 = this.innerExecutor.getMessages();
    if (needsContinuationMessage(messages2)) {
      logger2.info(ctx, "[continuation-injector] last message is assistant; injecting continuation prompt", { messageCount: messages2.length });
      this.innerExecutor.appendMessages({
        role: "user",
        content: CONTINUATION_MESSAGE
      });
    }
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
var createContinuationInjectorMiddleware = () => {
  return (executor) => new ContinuationInjectorMiddleware(executor);
};
var continuationInjectorMiddleware = createContinuationInjectorMiddleware();

