/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/async.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
function delay3(ms2, signal) {
  return delayWith(realClock, ms2, signal);
}
function delayWith(clock, ms2, signal) {
  return new Promise((resolve29) => {
    if (signal?.aborted === true) {
      resolve29();
      return;
    }
    const onAbort = () => {
      scheduled.dispose();
      resolve29();
    };
    const scheduled = clock.schedule(Number.isFinite(ms2) && ms2 > 0 ? ms2 : 0, () => {
      signal?.removeEventListener("abort", onAbort);
      resolve29();
    });
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

