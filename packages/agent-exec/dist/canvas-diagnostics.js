/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/canvas-diagnostics.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var canvasDiagnosticsExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("canvasDiagnosticsArgs"), createClientDeserializer("canvasDiagnosticsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("canvasDiagnosticsArgs"), createClientSerializer("canvasDiagnosticsResult")));
});

