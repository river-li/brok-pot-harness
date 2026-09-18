var forceBackgroundShellExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("forceBackgroundShellArgs"), createClientDeserializer("forceBackgroundShellResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("forceBackgroundShellArgs"), createClientSerializer("forceBackgroundShellResult")));
});
