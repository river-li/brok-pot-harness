/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/content-search/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path102 = require("node:path");
init_scheduling();

// @recovered-fragment 2/2
var contentSearchExtension = defineHostExtension({
  id: "content-search",
  dependencies: [HostExtensions.Telemetry],
  start: (context2) => {
    const index = new SandSearchIndexService({
      indexDbPath: (0, import_node_path102.join)(getSandRootDir(), SEARCH_INDEX_FILENAME),
      agentsRootDir: getSandAgentsRootDir(),
      disposeDeadline: createDeadlinePolicy({
        name: "sand-content-search-dispose",
        timeoutMs: SEARCH_INDEX_DISPOSE_TIMEOUT_MS
      }),
      report: (report) => context2.deps.telemetry.logs.reportSearchIndexHealth(report)
    });
    context2.onStop(() => index.dispose());
    context2.onStop(subscribeTranscriptMutations((mutation) => index.applyMutation(mutation)));
    index.start();
    return {
      get isSearchReady() {
        return index.isSearchReady;
      },
      maxMatchesPerAgent: AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT,
      maxResults: AGENT_CONTENT_SEARCH_MAX_RESULTS,
      searchMessages: ({ query, limit }) => index.searchMessages(query, limit),
      searchMedia: ({ query, limit }) => index.searchMedia(query, limit),
      findTranscriptMatches: (entries, query, limit) => findAgentContentMatches(entries, query, limit)
    };
  }
});

