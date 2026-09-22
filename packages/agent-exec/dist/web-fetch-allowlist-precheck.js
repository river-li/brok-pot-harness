/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/web-fetch-allowlist-precheck.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_web_fetch_allowlist_precheck_exec_pb();
var webFetchAllowlistPrecheckExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("webFetchAllowlistPrecheckArgs"), createClientDeserializer("webFetchAllowlistPrecheckResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("webFetchAllowlistPrecheckArgs"), createClientSerializer("webFetchAllowlistPrecheckResult")));
});

