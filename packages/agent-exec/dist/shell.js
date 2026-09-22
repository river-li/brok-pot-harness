/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/shell.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var shellExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("shellArgs"), createClientDeserializer("shellResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("shellArgs"), createClientSerializer("shellResult")));
});

