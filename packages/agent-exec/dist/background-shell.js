var backgroundShellExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("backgroundShellSpawnArgs"), createClientDeserializer("backgroundShellSpawnResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("backgroundShellSpawnArgs"), createClientSerializer("backgroundShellSpawnResult")));
});
var writeBackgroundShellInputExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("writeShellStdinArgs"), createClientDeserializer("writeShellStdinResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("writeShellStdinArgs"), createClientSerializer("writeShellStdinResult")));
});
