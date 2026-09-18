var piWriteExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piWriteArgs"), createClientDeserializer("piWriteResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piWriteArgs"), createClientSerializer("piWriteResult")));
});
