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
  "../dune/src/internal/scheduling/clock.ts"() {
    "use strict";
    realClock = {
      now: () => Date.now(),
      monotonicNow: () => monotonicMs(performance.now()),
      schedule(delayMs, fn, options2) {
        assertDelay(delayMs);
        let active = true;
        const timer = globalThis.setTimeout(() => {
          if (!active) return;
          active = false;
          fn();
        }, delayMs);
        if (options2?.keepEventLoopAlive !== true && isNodeTimer(timer)) {
          timer.unref();
        }
        return {
          dispose() {
            if (!active) return;
            active = false;
            globalThis.clearTimeout(timer);
          }
        };
      }
    };
  }
});
