var grepExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("grepArgs"), createClientDeserializer("grepResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("grepArgs"), createClientSerializer("grepResult")));
});
