function outlineSendMessageText(message) {
  if (message.type !== "text") return null;
  const content = message.content;
  return typeof content === "string" && content.trim().length > 0 ? content.trim() : null;
}
