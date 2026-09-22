/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-server-id.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MCP_SERVER_ID_PATTERN = /^[1-9]\d*$/;
function isMcpServerId(rawId) {
  return MCP_SERVER_ID_PATTERN.test(rawId.trim());
}

