var recordScreenExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("recordScreenArgs"), createClientDeserializer("recordScreenResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("recordScreenArgs"), createClientSerializer("recordScreenResult")));
});
