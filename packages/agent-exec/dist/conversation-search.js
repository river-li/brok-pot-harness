/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/conversation-search.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var conversationSearchExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("conversationSearchArgs"), createClientDeserializer("conversationSearchResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("conversationSearchArgs"), createClientSerializer("conversationSearchResult")));
});

