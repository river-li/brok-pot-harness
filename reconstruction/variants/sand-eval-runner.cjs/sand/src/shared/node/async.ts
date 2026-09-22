/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/async.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function delay2(ms2, signal) {
  return delayWith(realClock, ms2, signal);
}
function delayWith(clock, ms2, signal) {
  return new Promise((resolve14) => {
    if (signal?.aborted === true) {
      resolve14();
      return;
    }
    const onAbort = () => {
      scheduled.dispose();
      resolve14();
    };
    const scheduled = clock.schedule(Number.isFinite(ms2) && ms2 > 0 ? ms2 : 0, () => {
      signal?.removeEventListener("abort", onAbort);
      resolve14();
    });
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

