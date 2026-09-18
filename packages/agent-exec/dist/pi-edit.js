var piEditExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piEditArgs"), createClientDeserializer("piEditResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piEditArgs"), createClientSerializer("piEditResult")));
});
