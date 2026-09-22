/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/abort-drain.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_dist3();
var logger30 = createLogger("@anysphere/agent");
var ABORT_DRAIN_TIMEOUT_MS = 5e3;
var abortDrainOutcomeCounter = createCounter("agent.run_stream.abort_drain", {
  description: "Outcome of the bounded drain of pending blob/checkpoint work when runStream exits via an error (including user aborts).",
  labelNames: ["outcome"]
});
async function drainPendingWritesOnRunStreamError(ctx, args) {
  const timeoutMs = args.timeoutMs ?? ABORT_DRAIN_TIMEOUT_MS;
  try {
    await withTimeout(Promise.all([args.pendingCheckpoints, args.flush()]), timeoutMs, `Abort drain of pending blob writes timed out after ${timeoutMs}ms`);
    abortDrainOutcomeCounter.increment(ctx, 1, { outcome: "succeeded" });
  } catch (error3) {
    const outcome = error3 instanceof TimeoutError ? "timed_out" : "failed";
    abortDrainOutcomeCounter.increment(ctx, 1, { outcome });
    logger30.warn(ctx, "Abort drain of pending blob writes did not complete", {
      error: error3,
      outcome,
      timeoutMs
    });
  }
}

