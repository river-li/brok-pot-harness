var writeExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("writeArgs"), createClientDeserializer("writeResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("writeArgs"), createClientSerializer("writeResult")));
});
