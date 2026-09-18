var piLsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piLsArgs"), createClientDeserializer("piLsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piLsArgs"), createClientSerializer("piLsResult")));
});
