/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/background-shell.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var backgroundShellExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("backgroundShellSpawnArgs"), createClientDeserializer("backgroundShellSpawnResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("backgroundShellSpawnArgs"), createClientSerializer("backgroundShellSpawnResult")));
});
var writeBackgroundShellInputExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("writeShellStdinArgs"), createClientDeserializer("writeShellStdinResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("writeShellStdinArgs"), createClientSerializer("writeShellStdinResult")));
});

