function hasTagAtEnd(text2, tag) {
  return text2.trimEnd().endsWith(tag);
}
function appendTag(text2, tag) {
  if (hasTagAtEnd(text2, tag)) {
    return text2;
  }
  return `${text2}
${tag}`;
}
function appendToolCallIdTagsToToolResults(messages2) {
  for (const message of messages2) {
    if (message.role !== "tool" || !Array.isArray(message.content)) {
      continue;
    }
    for (const part of message.content) {
      if (part.type !== "tool-result") {
        continue;
      }
      const refId = createToolCallReferenceId(part.toolCallId);
      if (!isValidPromptReferenceId(refId)) {
        continue;
      }
      const tag = renderToolCallIdTag(refId);
      if (typeof part.result === "string") {
        part.result = appendTag(part.result, tag);
      } else if (part.result === void 0 || part.result === null) {
        part.result = tag;
      }
      if (!Array.isArray(part.experimental_content)) {
        continue;
      }
      let updatedTextPart = false;
      for (let i = part.experimental_content.length - 1; i >= 0; i--) {
        const contentPart = part.experimental_content[i];
        if (contentPart?.type === "text") {
          contentPart.text = appendTag(contentPart.text, tag);
          updatedTextPart = true;
          break;
        }
      }
      if (!updatedTextPart) {
        part.experimental_content.push({
          type: "text",
          text: tag
        });
      }
    }
  }
}
function shouldTagToolCallIdsForCurrentContext(ctx) {
  return getIsDirectMetaParentChildSubagentFromContext(ctx);
}
