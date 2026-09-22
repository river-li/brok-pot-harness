/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/slack-read-tools-gate.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SLACK_MCP_READ_TOOL_NAMES = /* @__PURE__ */ new Set([
  "slack_read_channel",
  "slack_read_thread"
]);
function hasSlackReadMcpTools(mcpTools) {
  return mcpTools.some((tool) => SLACK_MCP_READ_TOOL_NAMES.has(tool.toolName));
}

