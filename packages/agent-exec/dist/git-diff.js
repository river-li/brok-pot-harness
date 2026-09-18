var gitDiffExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("gitDiffRequest"), createClientDeserializer("gitDiffResponse")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("gitDiffRequest"), createClientSerializer("gitDiffResponse")));
});
