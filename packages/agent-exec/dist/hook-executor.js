/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/hook-executor.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var hookExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("executeHookArgs"), createClientDeserializer("executeHookResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("executeHookArgs"), createClientSerializer("executeHookResult")));
});

