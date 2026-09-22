/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/shell-stream.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var shellStreamExecutorResource = createResource((execManager) => new StreamExecutorResource(execManager, createServerSerializer("shellStreamArgs"), createClientDeserializer("shellStream")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledStreamExecHandler(implementation, createServerDeserializer("shellStreamArgs"), createClientSerializer("shellStream")));
});

