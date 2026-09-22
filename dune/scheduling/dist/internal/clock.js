/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/scheduling/dist/internal/clock.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function elapsedMs(since, now) {
  return now - since;
}
function monotonicMs(reading) {
  return reading;
}
function isNodeTimer(timer) {
  return typeof timer === "object" && timer !== null && "unref" in timer && typeof timer.unref === "function";
}
function assertDelay(delayMs) {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("delayMs must be a finite non-negative number");
  }
}
var realClock;
var init_clock = __esm({
  "../dune/scheduling/dist/internal/clock.js"() {
    "use strict";
    realClock = {
      now: () => Date.now(),
      monotonicNow: () => monotonicMs(performance.now()),
      schedule(delayMs, fn, options2) {
        assertDelay(delayMs);
        let active = true;
        const timer = globalThis.setTimeout(() => {
          if (!active)
            return;
          active = false;
          fn();
        }, delayMs);
        if ((options2 === null || options2 === void 0 ? void 0 : options2.keepEventLoopAlive) !== true && isNodeTimer(timer)) {
          timer.unref();
        }
        return {
          dispose() {
            if (!active)
              return;
            active = false;
            globalThis.clearTimeout(timer);
          }
        };
      }
    };
  }
});

