var SAND_SEND_TO_USER_TOOL_NAME = "SendToUser";
var SAND_LEGACY_SEND_MESSAGE_TOOL_NAME = "SendMessage";
function isSandUserDeliveryToolName(toolName) {
  return toolName === SAND_SEND_TO_USER_TOOL_NAME || toolName === SAND_LEGACY_SEND_MESSAGE_TOOL_NAME;
}
