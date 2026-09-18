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
  appendMessages(messages2) {
    this.innerExecutor.appendMessages(
      Array.isArray(messages2) ? messages2.map(toModelVisibleMessage) : toModelVisibleMessage(messages2)
    );
    return this;
  }
};
function createModelVisiblePathMiddleware(executor) {
  return new ModelVisiblePathMiddleware(executor);
}
