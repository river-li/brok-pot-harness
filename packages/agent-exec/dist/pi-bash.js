/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/pi-bash.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var piBashExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piBashArgs"), createClientDeserializer("piBashResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piBashArgs"), createClientSerializer("piBashResult")));
});

