var piReadExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piReadArgs"), createClientDeserializer("piReadResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piReadArgs"), createClientSerializer("piReadResult")));
});
