/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/mcp/clamp-advertised-tools.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var logger90 = createLogger("@anysphere/agent:advertised-tools-clamp");
var advertisedToolsClamped = createCounter("agent.tools.total_clamped", {
  description: "Advertised tool lists sliced to maxAdvertisedTools by dropping trailing direct MCP tools"
});

