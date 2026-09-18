var shellStreamExecutorResource = createResource((execManager) => new StreamExecutorResource(execManager, createServerSerializer("shellStreamArgs"), createClientDeserializer("shellStream")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledStreamExecHandler(implementation, createServerDeserializer("shellStreamArgs"), createClientSerializer("shellStream")));
});
