/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/user-message-action/pending-messages.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function collectCompletedToolResults(messages) {
  const completed = /* @__PURE__ */ new Map();
  for (const message of messages) {
    if (message.role !== "tool")
      continue;
    for (const part of message.content) {
      if (part.type === "tool-result") {
        completed.set(part.toolCallId, message);
      }
    }
  }
  return completed;
}
function splitPendingMessages(pendingMessages) {
  const lastAssistantIndex = pendingMessages.findLastIndex((message) => message.role === "assistant");
  if (lastAssistantIndex === -1) {
    return void 0;
  }
  const lastMessage = pendingMessages[lastAssistantIndex];
  return {
    messages: pendingMessages.slice(0, lastAssistantIndex + 1),
    lastMessage,
    completedToolResults: collectCompletedToolResults(pendingMessages.slice(lastAssistantIndex + 1))
  };
}

