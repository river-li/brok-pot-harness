var fetchExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("fetchArgs"), createClientDeserializer("fetchResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("fetchArgs"), createClientSerializer("fetchResult")));
});
