/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/pi-ls.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var piLsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piLsArgs"), createClientDeserializer("piLsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piLsArgs"), createClientSerializer("piLsResult")));
});

