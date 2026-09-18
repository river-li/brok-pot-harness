function buildReminderContext(messages2, todos, responseMessages = []) {
  let toolCallCount2 = 0;
  const toolTypeCounters = /* @__PURE__ */ new Map();
  const consecutiveFailures = /* @__PURE__ */ new Map();
  let currentToolName;
  let currentToolError;
  let currentToolSuccess;
  for (const message of messages2) {
    if (message.role === "tool" && Array.isArray(message.content)) {
      for (const toolResult of message.content) {
        const toolName = toolResult.toolName ?? "unknown";
        const success2 = !toolResult.isError;
        toolCallCount2++;
        const count = toolTypeCounters.get(toolName) ?? 0;
        toolTypeCounters.set(toolName, count + 1);
        if (success2) {
          consecutiveFailures.set(toolName, 0);
        } else {
          const failures = consecutiveFailures.get(toolName) ?? 0;
          consecutiveFailures.set(toolName, failures + 1);
        }
        currentToolName = toolName;
        currentToolSuccess = success2;
        currentToolError = toolResult.isError ? new Error(String(toolResult.result)) : void 0;
      }
    }
  }
  return {
    toolCallCount: toolCallCount2,
    toolTypeCounters,
    consecutiveFailures,
    currentToolName,
    currentToolError,
    currentToolSuccess,
    todos,
    conversationMessages: messages2,
    responseMessages
  };
}
