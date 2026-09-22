/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/smart-mode-classifier.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var smartModeClassifierExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("smartModeClassifierArgs"), createClientDeserializer("smartModeClassifierResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("smartModeClassifierArgs"), createClientSerializer("smartModeClassifierResult")));
});

