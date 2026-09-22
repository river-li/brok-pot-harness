/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/model-visible-path-middleware.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toModelVisibleUserContent(content) {
  if (typeof content === "string") return toModelVisibleText(content);
  return content.map(
    (part) => part.type === "text" ? { ...part, text: toModelVisibleText(part.text) } : part
  );
}
function toModelVisibleAssistantContent(content) {
  if (typeof content === "string") return toModelVisibleText(content);
  return content.map((part) => {
    if (part.type === "text") {
      return { ...part, text: toModelVisibleText(part.text) };
    }
    if (part.type === "tool-call" && typeof part.args === "string") {
      return { ...part, args: toModelVisibleText(part.args) };
    }
    return part;
  });
}
function toModelVisibleToolContent(content) {
  return content.map(
    (part) => typeof part.result === "string" ? { ...part, result: toModelVisibleText(part.result) } : part
  );
}
function toModelVisibleMessage(message) {
  switch (message.role) {
    case "system":
      return { ...message, content: toModelVisibleText(message.content) };
    case "user":
      return { ...message, content: toModelVisibleUserContent(message.content) };
    case "assistant":
      return { ...message, content: toModelVisibleAssistantContent(message.content) };
    case "tool":
      return { ...message, content: toModelVisibleToolContent(message.content) };
  }
}
var ModelVisiblePathMiddleware = class extends BaseMiddleware {
  appendMessages(messages) {
    this.innerExecutor.appendMessages(
      Array.isArray(messages) ? messages.map(toModelVisibleMessage) : toModelVisibleMessage(messages)
    );
    return this;
  }
};
function createModelVisiblePathMiddleware(executor) {
  return new ModelVisiblePathMiddleware(executor);
}

