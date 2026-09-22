/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/fetch.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var fetchExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("fetchArgs"), createClientDeserializer("fetchResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("fetchArgs"), createClientSerializer("fetchResult")));
});

