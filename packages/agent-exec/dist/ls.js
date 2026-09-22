/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/ls.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var lsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("lsArgs"), createClientDeserializer("lsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("lsArgs"), createClientSerializer("lsResult")));
});

