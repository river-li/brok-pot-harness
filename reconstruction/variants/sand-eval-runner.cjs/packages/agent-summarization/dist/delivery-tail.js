/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/delivery-tail.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function viewOf(part) {
  return {
    toolName: part.toolName,
    args: () => part.args.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
  };
}
function selectUserDeliveryTail(messages, options2) {
  if (options2.maxCalls <= 0) {
    return [];
  }
  const resultsByCallId = /* @__PURE__ */ new Map();
  for (const message of messages) {
    if (message.role !== "tool")
      continue;
    for (const part of message.content) {
      if (!resultsByCallId.has(part.toolCallId)) {
        resultsByCallId.set(part.toolCallId, { part, message });
      }
    }
  }
  const selected = [];
  let remaining = options2.maxCalls;
  for (let i = messages.length - 1; i >= 0 && remaining > 0; i--) {
    const message = messages[i];
    if (message.role !== "assistant" || !Array.isArray(message.content)) {
      continue;
    }
    const answeredDeliveryCalls = message.content.filter((part) => part.type === "tool-call" && resultsByCallId.has(part.toolCallId) && options2.isDeliveryToolCall(viewOf(part)));
    if (answeredDeliveryCalls.length === 0)
      continue;
    const keptCalls = answeredDeliveryCalls.slice(-remaining);
    remaining -= keptCalls.length;
    const results = keptCalls.map((call) => resultsByCallId.get(call.toolCallId));
    const assistant = Object.assign({ _privacyMode: message._privacyMode, role: "assistant", content: keptCalls }, message.id === void 0 ? {} : { id: message.id });
    const tool = {
      _privacyMode: results[0].message._privacyMode,
      role: "tool",
      content: results.map((result) => result.part)
    };
    selected.unshift(assistant, tool);
  }
  return selected;
}

