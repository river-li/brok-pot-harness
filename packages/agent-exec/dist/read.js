var readExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("readArgs"), createClientDeserializer("readResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readArgs"), createClientSerializer("readResult")));
});
var redactedReadExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("redactedReadArgs"), createClientDeserializer("redactedReadResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("redactedReadArgs"), createClientSerializer("redactedReadResult")));
});
