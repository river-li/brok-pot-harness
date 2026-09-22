/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/git-diff.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var gitDiffExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("gitDiffRequest"), createClientDeserializer("gitDiffResponse")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("gitDiffRequest"), createClientSerializer("gitDiffResponse")));
});

