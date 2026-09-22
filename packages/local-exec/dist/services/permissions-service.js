/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/permissions-service.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
init_admin_mcp_tool_allowlist();
init_mcp_tool_annotations();
init_dist6();

// @recovered-fragment 2/2
var logger41 = createLogger("permissions-service");
var mcpAllowlistCheckResult = createCounter("local_exec.permissions.mcp_allowlist_check.result", {
  description: "Result of MCP allowlist checks at user and team levels per tool call.",
  labelNames: ["allowlist_scope", "outcome"]
});

