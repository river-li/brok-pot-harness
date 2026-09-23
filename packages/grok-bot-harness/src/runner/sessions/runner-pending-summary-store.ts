function createRunnerPendingSummaryStore() {
  let pendingGeneration;
  let pendingSummary;
  let pendingWrite;
  const settledGenerations = /* @__PURE__ */ new WeakSet();
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
      const settle = () => {
        settledGenerations.add(generation.promiseInfo);
        if (pendingGeneration?.promiseInfo === generation.promiseInfo) {
          pendingGeneration = void 0;
        }
      };
      void generation.promiseInfo.promise.then(settle, settle);
    },
    claimPendingGeneration: (conversationId) => {
      if (pendingGeneration?.conversationId !== conversationId) return void 0;
      const generation = pendingGeneration;
      pendingGeneration = void 0;
      return generation;
    },
    reparkPendingGeneration: (generation) => {
      if (pendingGeneration === void 0 && pendingSummary === void 0 && !settledGenerations.has(generation.promiseInfo)) {
        pendingGeneration = generation;
      }
    },
    trackPendingWrite: (write2) => {
      pendingWrite = write2;
    },
    take: async (_ctx, conversationId) => {
      const write2 = pendingWrite;
      await write2;
      if (pendingWrite === write2) pendingWrite = void 0;
      if (pendingSummary?.conversationId !== conversationId) return void 0;
      const record2 = pendingSummary;
      pendingSummary = void 0;
      return record2;
    }
  };
}
