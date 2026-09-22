init_dist3();
function settledUnlessAborted(promise2, signal) {
  if (signal.aborted)
    return Promise.resolve(void 0);
  return new Promise((resolve29) => {
    const onAbort = () => resolve29(void 0);
    signal.addEventListener("abort", onAbort, { once: true });
    promise2.then(resolve29, () => resolve29(void 0)).finally(() => {
      signal.removeEventListener("abort", onAbort);
    });
  });
}
async function settledAbortedOrTimedOut(promise2, signal, timeoutMs) {
  if (signal.aborted)
    return "aborted";
  try {
    await withTimeout(settledUnlessAborted(promise2, signal), timeoutMs);
  } catch (error42) {
    if (error42 instanceof TimeoutError)
      return "timed_out";
    throw error42;
  }
  return signal.aborted ? "aborted" : "settled";
}
