/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/pi-write.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var piWriteExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piWriteArgs"), createClientDeserializer("piWriteResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piWriteArgs"), createClientSerializer("piWriteResult")));
});

