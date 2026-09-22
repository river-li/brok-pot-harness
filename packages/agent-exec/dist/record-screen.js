/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/record-screen.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var recordScreenExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("recordScreenArgs"), createClientDeserializer("recordScreenResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("recordScreenArgs"), createClientSerializer("recordScreenResult")));
});

