/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/read.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var readExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("readArgs"), createClientDeserializer("readResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readArgs"), createClientSerializer("readResult")));
});
var redactedReadExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("redactedReadArgs"), createClientDeserializer("redactedReadResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("redactedReadArgs"), createClientSerializer("redactedReadResult")));
});

