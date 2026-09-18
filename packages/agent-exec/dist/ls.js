var lsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("lsArgs"), createClientDeserializer("lsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("lsArgs"), createClientSerializer("lsResult")));
});
