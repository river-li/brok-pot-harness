function createRunnerPendingSummaryStore() {
  let pendingGeneration;
  let pendingSummary;
  let pendingWrite;
  return {
    store: async (_ctx, record2) => {
      if (pendingSummary === void 0 || record2.createdAtMs >= pendingSummary.createdAtMs) {
        pendingSummary = record2;
      }
      if (pendingGeneration?.conversationId === record2.conversationId) {
        pendingGeneration = void 0;
      }
      return "stored";
    },
    trackPendingGeneration: (generation) => {
      pendingGeneration = generation;
      void generation.promiseInfo.promise.then(
        (result) => {
          if (result.hadError === true && pendingGeneration === generation) {
            pendingGeneration = void 0;
          }
        },
        () => {
          if (pendingGeneration === generation) {
            pendingGeneration = void 0;
          }
        }
      );
    },
    claimPendingGeneration: (conversationId) => {
      if (pendingGeneration?.conversationId !== conversationId) return void 0;
      const generation = pendingGeneration;
      pendingGeneration = void 0;
      return generation;
    },
    reparkPendingGeneration: (generation) => {
      if (pendingGeneration === void 0 && pendingSummary === void 0) {
        pendingGeneration = generation;
      }
    },
    trackPendingWrite: (write) => {
      pendingWrite = write;
    },
    take: async (_ctx, conversationId) => {
      const write = pendingWrite;
      await write;
      if (pendingWrite === write) pendingWrite = void 0;
      if (pendingSummary?.conversationId !== conversationId) return void 0;
      const record2 = pendingSummary;
      pendingSummary = void 0;
      return record2;
    }
  };
}
