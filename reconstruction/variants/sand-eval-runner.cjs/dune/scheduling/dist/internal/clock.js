/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/scheduling/dist/internal/clock.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function monotonicMs(reading) {
  return reading;
}
var realClock = {
  now: () => Date.now(),
  monotonicNow: () => monotonicMs(performance.now()),
  schedule(delayMs, fn, options2) {
    assertDelay(delayMs);
    let active = true;
    const timer2 = globalThis.setTimeout(() => {
      if (!active)
        return;
      active = false;
      fn();
    }, delayMs);
    if ((options2 === null || options2 === void 0 ? void 0 : options2.keepEventLoopAlive) !== true && isNodeTimer(timer2)) {
      timer2.unref();
    }
    return {
      dispose() {
        if (!active)
          return;
        active = false;
        globalThis.clearTimeout(timer2);
      }
    };
  }
};
function isNodeTimer(timer2) {
  return typeof timer2 === "object" && timer2 !== null && "unref" in timer2 && typeof timer2.unref === "function";
}
function assertDelay(delayMs) {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite non-negative number");
  }
}

