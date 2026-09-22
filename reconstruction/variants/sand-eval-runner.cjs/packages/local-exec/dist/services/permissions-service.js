/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/permissions-service.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();
init_admin_mcp_tool_allowlist();
init_mcp_tool_annotations();
init_dist4();

// @recovered-fragment 2/2
var logger18 = createLogger("permissions-service");
var mcpAllowlistCheckResult = createCounter("local_exec.permissions.mcp_allowlist_check.result", {
  description: "Result of MCP allowlist checks at user and team levels per tool call.",
  labelNames: ["allowlist_scope", "outcome"]
});
async function shouldBlockFileRead(permissionsService, filePath, facts) {
  return permissionsService.shouldBlockFileRead?.(filePath, facts) ?? permissionsService.shouldBlockRead(filePath, facts);
}

