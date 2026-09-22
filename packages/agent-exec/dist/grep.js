/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/grep.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var grepExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("grepArgs"), createClientDeserializer("grepResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("grepArgs"), createClientSerializer("grepResult")));
});

