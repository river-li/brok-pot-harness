/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/idle-compaction/delivery-tail.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

