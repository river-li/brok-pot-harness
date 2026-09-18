var adoptExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("adoptArgs"), createClientDeserializer("adoptResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("adoptArgs"), createClientSerializer("adoptResult")));
});
