/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/subagent-control.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var forceBackgroundSubagentExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("forceBackgroundSubagentArgs"), createClientDeserializer("forceBackgroundSubagentResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("forceBackgroundSubagentArgs"), createClientSerializer("forceBackgroundSubagentResult")));
});

