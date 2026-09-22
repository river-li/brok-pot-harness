/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/summarization-settle.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
function settledUnlessAborted(promise, signal) {
  if (signal.aborted)
    return Promise.resolve(void 0);
  return new Promise((resolve14) => {
    const onAbort = () => resolve14(void 0);
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(resolve14, () => resolve14(void 0)).finally(() => {
      signal.removeEventListener("abort", onAbort);
    });
  });
}
async function settledAbortedOrTimedOut(promise, signal, timeoutMs) {
  if (signal.aborted)
    return "aborted";
  try {
    await withTimeout(settledUnlessAborted(promise, signal), timeoutMs);
  } catch (error3) {
    if (error3 instanceof TimeoutError)
      return "timed_out";
    throw error3;
  }
  return signal.aborted ? "aborted" : "settled";
}

