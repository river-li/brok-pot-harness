/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/conversation-name.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CONVERSATION_NAME_MAX_LENGTH = 72;
function conversationNameFromPrompt(prompt) {
  const collapsed = prompt.trim().replace(/\s+/g, " ");
  return (collapsed.length === 0 ? "New conversation" : collapsed).slice(
    0,
    CONVERSATION_NAME_MAX_LENGTH
  );
}
function isUnnamedSingleBotRoom(agent) {
  return agent.isGroup && agent.memberIds.length === 1 && agent.namedBy === void 0;
}

