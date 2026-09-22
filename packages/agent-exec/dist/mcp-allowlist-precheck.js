/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/mcp-allowlist-precheck.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_mcp_allowlist_precheck_exec_pb();
var mcpAllowlistPrecheckExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("mcpAllowlistPrecheckArgs"), createClientDeserializer("mcpAllowlistPrecheckResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpAllowlistPrecheckArgs"), createClientSerializer("mcpAllowlistPrecheckResult")));
});

