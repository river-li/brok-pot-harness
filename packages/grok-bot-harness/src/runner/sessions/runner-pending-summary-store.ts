/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sessions/runner-pending-summary-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

