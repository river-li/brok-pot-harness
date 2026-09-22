var SAND_IDLE_DELIVERY_TAIL_MAX_CALLS = 5;
function isSandUserDeliveryToolCallView(call) {
  const needsInnerToolName = call.toolName === SAND_DYNAMIC_MCP_META_TOOL_NAMES.invocation;
  return isSandUserDeliveryToolCall({
    toolName: call.toolName,
    args: needsInnerToolName ? call.args() : void 0
  });
}
var SAND_IDLE_DELIVERY_TAIL = {
  isDeliveryToolCall: isSandUserDeliveryToolCallView,
  maxCalls: SAND_IDLE_DELIVERY_TAIL_MAX_CALLS,
  triggerReasons: ["idle_timer"]
};
