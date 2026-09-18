init_smart_mode_classifier_exec_pb();
var smartModeClassifierExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("smartModeClassifierArgs"), createClientDeserializer("smartModeClassifierResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("smartModeClassifierArgs"), createClientSerializer("smartModeClassifierResult")));
});
