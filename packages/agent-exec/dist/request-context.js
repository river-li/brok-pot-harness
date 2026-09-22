/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/request-context.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var requestContextExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("requestContextArgs"), createClientDeserializer("requestContextResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("requestContextArgs"), createClientSerializer("requestContextResult")));
});

