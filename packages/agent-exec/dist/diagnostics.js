/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/diagnostics.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var diagnosticsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("diagnosticsArgs"), createClientDeserializer("diagnosticsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("diagnosticsArgs"), createClientSerializer("diagnosticsResult")));
});

