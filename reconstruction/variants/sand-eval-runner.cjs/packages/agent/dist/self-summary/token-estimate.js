/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/self-summary/token-estimate.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function extractTextContent(message) {
  const content = message.content;
  if (isRedactedString(content)) {
    return content.safeTransform((value) => stripThinkingTags(value));
  }
  if (typeof content === "string") {
    return createRedactedString(stripThinkingTags(content), DataClassification.CODE, "extractedTextContent", message._privacyMode);
  }
  if (Array.isArray(content)) {
    const text2 = content.map((c) => {
      if (c.type === "text") {
        return c.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      }
      return "";
    }).filter(Boolean).join("\n");
    return createRedactedString(stripThinkingTags(text2), DataClassification.CODE, "extractedTextContent", message._privacyMode);
  }
  return safeString("");
}
function estimateTokenCount2(messages, options2) {
  return estimateTokenCount(messages, {
    ...options2,
    textContentLengthFn: (message) => extractTextContent(message).length
  });
}

