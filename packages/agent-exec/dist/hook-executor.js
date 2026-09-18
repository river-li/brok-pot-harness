var hookExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("executeHookArgs"), createClientDeserializer("executeHookResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("executeHookArgs"), createClientSerializer("executeHookResult")));
});
