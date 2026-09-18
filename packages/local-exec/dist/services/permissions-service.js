var logger18 = createLogger("permissions-service");
var mcpAllowlistCheckResult = createCounter("local_exec.permissions.mcp_allowlist_check.result", {
  description: "Result of MCP allowlist checks at user and team levels per tool call.",
  labelNames: ["allowlist_scope", "outcome"]
});
async function shouldBlockFileRead(permissionsService, filePath, facts) {
  return permissionsService.shouldBlockFileRead?.(filePath, facts) ?? permissionsService.shouldBlockRead(filePath, facts);
}
