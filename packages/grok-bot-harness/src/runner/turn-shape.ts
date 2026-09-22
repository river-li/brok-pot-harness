/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/turn-shape.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isDeliveryToolCall(part) {
  return invokesFirstPartyTool(
    part,
    (name17) => isSandUserDeliveryToolName(name17) || name17 === SAND_REACT_TO_MESSAGE_TOOL_NAME
  );
}
function asCoreMessage(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const message = value;
  if (typeof message.role !== "string") return void 0;
  if (typeof message.content !== "string" && !Array.isArray(message.content)) {
    return void 0;
  }
  return message;
}
function toolCalls2(message) {
  if (message.role !== "assistant" || typeof message.content === "string") {
    return [];
  }
  return message.content.filter((part) => part.type === "tool-call");
}
function hasDeliveryToolCall(calls) {
  return calls.some(isDeliveryToolCall);
}
function deliveryToolCallIds(message) {
  return toolCalls2(message).flatMap((part) => isDeliveryToolCall(part) ? [part.toolCallId] : []);
}
function erroredToolResultIds(messages2) {
  const ids = /* @__PURE__ */ new Set();
  for (const message of messages2) {
    if (message === void 0 || message.role !== "tool" || typeof message.content === "string") {
      continue;
    }
    const highLevel = message.providerOptions?.cursor?.highLevelToolCallResult;
    if (typeof highLevel !== "object" || highLevel === null || Array.isArray(highLevel)) {
      continue;
    }
    if (highLevel.isError !== true) continue;
    for (const part of message.content) {
      if (part.type === "tool-result") ids.add(part.toolCallId);
    }
  }
  return ids;
}
function isBlankAssistantMessage(message) {
  if (message.role !== "assistant") return false;
  if (typeof message.content === "string") return message.content.trim().length === 0;
  return message.content.every((part) => part.type === "text" && part.text.trim().length === 0);
}
function lastAssistantText(rawMessages) {
  const message = asCoreMessage(rawMessages.at(-1));
  if (message?.role !== "assistant") return "";
  if (typeof message.content === "string") return message.content;
  return message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("");
}
function turnEndedOnSilentToolCalls(rawMessages) {
  const messages2 = rawMessages.map(asCoreMessage);
  let tailIndex = messages2.length - 1;
  while (tailIndex >= 0) {
    const message = messages2[tailIndex];
    if (message === void 0 || message.role === "tool" || isBlankAssistantMessage(message) || isInjectedReminderMessage2(message)) {
      tailIndex--;
      continue;
    }
    break;
  }
  const tail = tailIndex >= 0 ? messages2[tailIndex] : void 0;
  if (tail === void 0 || tail.role !== "assistant") return false;
  const tailCalls = toolCalls2(tail);
  if (tailCalls.length === 0 || hasDeliveryToolCall(tailCalls)) return false;
  let boundary = -1;
  for (let index = tailIndex - 1; index >= 0; index--) {
    const message = messages2[index];
    if (message === void 0 || isInjectedReminderMessage2(message)) continue;
    if (message.role === "user" || message.role === "system") {
      boundary = index;
      break;
    }
  }
  const erroredIds = erroredToolResultIds(messages2);
  let ackedFirst = false;
  for (let index = boundary + 1; index <= tailIndex; index++) {
    const message = messages2[index];
    if (message === void 0 || message.role !== "assistant") continue;
    const calls = toolCalls2(message);
    if (calls.length === 0) continue;
    if (!ackedFirst) {
      if (!hasDeliveryToolCall(calls)) return false;
      ackedFirst = true;
    } else if (deliveryToolCallIds(message).some((id) => !erroredIds.has(id))) {
      return false;
    }
  }
  return ackedFirst;
}

