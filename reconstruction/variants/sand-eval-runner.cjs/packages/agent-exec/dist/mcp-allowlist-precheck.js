/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/mcp-allowlist-precheck.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var mcpAllowlistPrecheckExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("mcpAllowlistPrecheckArgs"), createClientDeserializer("mcpAllowlistPrecheckResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpAllowlistPrecheckArgs"), createClientSerializer("mcpAllowlistPrecheckResult")));
});

