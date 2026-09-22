/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/shell-control.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var forceBackgroundShellExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("forceBackgroundShellArgs"), createClientDeserializer("forceBackgroundShellResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("forceBackgroundShellArgs"), createClientSerializer("forceBackgroundShellResult")));
});

