var requestContextExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("requestContextArgs"), createClientDeserializer("requestContextResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("requestContextArgs"), createClientSerializer("requestContextResult")));
});
