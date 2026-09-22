/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/conversation-outline.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function outlineSendMessageText(message) {
  if (message.type !== "text") return null;
  const content = message.content;
  return typeof content === "string" && content.trim().length > 0 ? content.trim() : null;
}

