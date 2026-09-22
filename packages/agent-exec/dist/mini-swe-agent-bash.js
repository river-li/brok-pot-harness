/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/mini-swe-agent-bash.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var miniSweAgentBashExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("miniSweAgentBashArgs"), createClientDeserializer("miniSweAgentBashResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("miniSweAgentBashArgs"), createClientSerializer("miniSweAgentBashResult")));
});

