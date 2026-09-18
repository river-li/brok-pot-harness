var miniSweAgentBashExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("miniSweAgentBashArgs"), createClientDeserializer("miniSweAgentBashResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("miniSweAgentBashArgs"), createClientSerializer("miniSweAgentBashResult")));
});
