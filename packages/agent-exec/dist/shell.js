var shellExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("shellArgs"), createClientDeserializer("shellResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("shellArgs"), createClientSerializer("shellResult")));
});
