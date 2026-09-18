var piGrepExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piGrepArgs"), createClientDeserializer("piGrepResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piGrepArgs"), createClientSerializer("piGrepResult")));
});
