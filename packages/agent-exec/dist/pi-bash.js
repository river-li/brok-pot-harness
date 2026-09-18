var piBashExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piBashArgs"), createClientDeserializer("piBashResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piBashArgs"), createClientSerializer("piBashResult")));
});
