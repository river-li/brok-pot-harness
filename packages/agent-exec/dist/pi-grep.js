/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/pi-grep.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var piGrepExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("piGrepArgs"), createClientDeserializer("piGrepResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("piGrepArgs"), createClientSerializer("piGrepResult")));
});

