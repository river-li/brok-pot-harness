/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/delete.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var deleteExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("deleteArgs"), createClientDeserializer("deleteResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("deleteArgs"), createClientSerializer("deleteResult")));
});

