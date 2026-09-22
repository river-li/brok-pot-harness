/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/shell-allowlist-precheck.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_shell_allowlist_precheck_exec_pb();
var shellAllowlistPrecheckExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("shellAllowlistPrecheckArgs"), createClientDeserializer("shellAllowlistPrecheckResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("shellAllowlistPrecheckArgs"), createClientSerializer("shellAllowlistPrecheckResult")));
});

