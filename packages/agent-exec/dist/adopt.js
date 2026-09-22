/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/adopt.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var adoptExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("adoptArgs"), createClientDeserializer("adoptResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("adoptArgs"), createClientSerializer("adoptResult")));
});

