/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/write.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var writeExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("writeArgs"), createClientDeserializer("writeResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("writeArgs"), createClientSerializer("writeResult")));
});

