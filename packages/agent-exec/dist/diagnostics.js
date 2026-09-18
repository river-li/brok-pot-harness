var diagnosticsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("diagnosticsArgs"), createClientDeserializer("diagnosticsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("diagnosticsArgs"), createClientSerializer("diagnosticsResult")));
});
