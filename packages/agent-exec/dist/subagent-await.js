/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/subagent-await.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var subagentAwaitExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("subagentAwaitArgs"), createClientDeserializer("subagentAwaitResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("subagentAwaitArgs"), createClientSerializer("subagentAwaitResult")));
});

