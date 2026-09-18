init_dist3();
init_dist2();
var logger8 = createLogger("@anysphere/agent");
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
  } catch (error41) {
    const outcome = error41 instanceof TimeoutError ? "timed_out" : "failed";
    abortDrainOutcomeCounter.increment(ctx, 1, { outcome });
    logger8.warn(ctx, "Abort drain of pending blob writes did not complete", {
      error: error41,
      outcome,
      timeoutMs
    });
  }
}
