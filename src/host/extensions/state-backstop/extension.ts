var stateBackstopExtension = defineHostExtension({
  id: "state-backstop",
  dependencies: [HostExtensions.BoxStoreSync, HostExtensions.SourceMap],
  start: (context2) => {
    if (!context2.host.environment.boxStore.stateBackstopEnabled) {
      return {
        isEnabled: false,
        scheduleSnapshot: () => {
        },
        snapshotNow: async () => ({ status: "skipped", reason: "backstop disabled" }),
        readSnapshot: async () => null
      };
    }
    const backstop = new SandStateBackstop({
      objectStoreProvider: context2.deps["box-store-sync"].objectStoreProvider,
      sourceMap: context2.deps["source-map"],
      debounce: createDebouncePolicy({
        name: "sand-state-backstop-snapshot",
        delayMs: STATE_BACKSTOP_DEBOUNCE_MS
      })
    });
    context2.onStop(() => backstop.dispose());
    context2.host.log("SandState S3 backstop enabled");
    return {
      isEnabled: true,
      scheduleSnapshot: (agentId) => backstop.scheduleSnapshot(agentId),
      snapshotNow: (agentId) => backstop.snapshotNow(agentId),
      readSnapshot: (agentId) => backstop.readSnapshot(agentId)
    };
  }
});
