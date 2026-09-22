/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/pi-edit.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var piEditExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piEditArgs"), createClientDeserializer("piEditResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piEditArgs"), createClientSerializer("piEditResult")));
});

