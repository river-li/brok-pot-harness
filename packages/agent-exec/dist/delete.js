var deleteExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("deleteArgs"), createClientDeserializer("deleteResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("deleteArgs"), createClientSerializer("deleteResult")));
});
