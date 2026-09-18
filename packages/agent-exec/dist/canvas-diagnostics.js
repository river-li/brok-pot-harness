var canvasDiagnosticsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("canvasDiagnosticsArgs"), createClientDeserializer("canvasDiagnosticsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("canvasDiagnosticsArgs"), createClientSerializer("canvasDiagnosticsResult")));
});
