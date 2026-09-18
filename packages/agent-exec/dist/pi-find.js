var piFindExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piFindArgs"), createClientDeserializer("piFindResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piFindArgs"), createClientSerializer("piFindResult")));
});
