/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/agent-store-conflict.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var agentStoreConflictExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("agentStoreConflictArgs"), createClientDeserializer("agentStoreConflictResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("agentStoreConflictArgs"), createClientSerializer("agentStoreConflictResult")));
});

