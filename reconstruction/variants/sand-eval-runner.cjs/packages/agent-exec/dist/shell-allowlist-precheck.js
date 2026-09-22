/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/shell-allowlist-precheck.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var shellAllowlistPrecheckExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("shellAllowlistPrecheckArgs"), createClientDeserializer("shellAllowlistPrecheckResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("shellAllowlistPrecheckArgs"), createClientSerializer("shellAllowlistPrecheckResult")));
});

