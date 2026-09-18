init_mcp_allowlist_precheck_exec_pb();
var mcpAllowlistPrecheckExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("mcpAllowlistPrecheckArgs"), createClientDeserializer("mcpAllowlistPrecheckResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpAllowlistPrecheckArgs"), createClientSerializer("mcpAllowlistPrecheckResult")));
});
