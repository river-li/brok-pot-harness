var agentStoreConflictExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("agentStoreConflictArgs"), createClientDeserializer("agentStoreConflictResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("agentStoreConflictArgs"), createClientSerializer("agentStoreConflictResult")));
});
