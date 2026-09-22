/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/pi-read.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var piReadExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piReadArgs"), createClientDeserializer("piReadResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piReadArgs"), createClientSerializer("piReadResult")));
});

