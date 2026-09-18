var subagentAwaitExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("subagentAwaitArgs"), createClientDeserializer("subagentAwaitResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("subagentAwaitArgs"), createClientSerializer("subagentAwaitResult")));
});
