/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/smart-mode-classifier.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_smart_mode_classifier_exec_pb();
var smartModeClassifierExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("smartModeClassifierArgs"), createClientDeserializer("smartModeClassifierResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("smartModeClassifierArgs"), createClientSerializer("smartModeClassifierResult")));
});

