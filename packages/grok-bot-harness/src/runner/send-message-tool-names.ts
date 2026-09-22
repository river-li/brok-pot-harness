/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/send-message-tool-names.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_SEND_TO_USER_TOOL_NAME = "SendToUser";
var SAND_LEGACY_SEND_MESSAGE_TOOL_NAME = "SendMessage";
function isSandUserDeliveryToolName(toolName) {
  return toolName === SAND_SEND_TO_USER_TOOL_NAME || toolName === SAND_LEGACY_SEND_MESSAGE_TOOL_NAME;
}

