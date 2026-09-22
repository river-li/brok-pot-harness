/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/idle-compaction/idle-compaction.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SandSummaryLifecycleWatch = class {
  listener;
  unsettled = /* @__PURE__ */ new Set();
  note(event) {
    if (event.phase === "started") this.unsettled.add(event.summaryLifecycleId);
    else if (event.phase === "persisted" || event.phase === "abandoned") {
      this.unsettled.delete(event.summaryLifecycleId);
    }
    this.listener?.(event);
  }
  hasUnsettledOrPersistedSince(lastParentCall, state) {
    return this.unsettled.size > 0 || state.summaryArchives.length !== lastParentCall?.lastCallCompactionEpoch;
  }
  listen(listener) {
    this.listener = listener;
    return () => {
      if (this.listener === listener) this.listener = void 0;
    };
  }
};
async function startIdleCompaction(runner, options2 = {}) {
  const startedAt = performance.now();
  const durationMs = () => Math.round(performance.now() - startedAt);
  const settled = Promise.withResolvers();
  let launched;
  let launchedAfterMs = 0;
  let summary;
  let terminal;
  const settle = () => {
    if (summary === void 0 || terminal === void 0) return;
    stop();
    settled.resolve({ ...summary(), ...terminal });
  };
  const stop = runner.onSummaryLifecycle((event) => {
    if (event.phase === "started") {
      if (launched === void 0) {
        launched = event;
        launchedAfterMs = durationMs();
      }
      return;
    }
    if (event.summaryLifecycleId !== launched?.summaryLifecycleId) return;
    if (event.phase === "completed") terminal ??= { landing: "stashed" };
    else if (event.phase === "persisted") terminal = { landing: "persisted_in_activity" };
    else if (event.phase === "abandoned") {
      terminal ??= { landing: "abandoned", errorClass: event.reason };
    }
    settle();
  });
  try {
    const result = await runner.run("", {
      ...options2,
      idleCompaction: true,
      requestSource: "idle-compaction",
      isSilenceAllowed: true,
      autoReviewEpoch: "continue"
    });
    summary = result.idleCompactionSummary;
    if (launched === void 0 || summary === void 0) {
      stop();
      return result.aborted || result.pausedForUpgrade === true ? { kind: "aborted", durationMs: durationMs() } : { kind: "error", errorClass: "not_launched", durationMs: durationMs() };
    }
    const launch = {
      kind: "fired",
      summaryLifecycleId: launched.summaryLifecycleId,
      summarizationModelId: launched.summarizationModelId,
      selfSummary: launched.summarizerType === "self",
      durationMs: launchedAfterMs,
      launched: summary(),
      settled: settled.promise
    };
    settle();
    return launch;
  } catch (error3) {
    stop();
    return {
      kind: "error",
      errorClass: errorLogTag(error3),
      durationMs: durationMs(),
      ...launched === void 0 ? {} : {
        launchBeforeFailure: {
          summaryLifecycleId: launched.summaryLifecycleId,
          summarizationModelId: launched.summarizationModelId,
          selfSummary: launched.summarizerType === "self"
        }
      }
    };
  }
}

