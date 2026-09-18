var forceBackgroundSubagentExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("forceBackgroundSubagentArgs"), createClientDeserializer("forceBackgroundSubagentResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("forceBackgroundSubagentArgs"), createClientSerializer("forceBackgroundSubagentResult")));
});
