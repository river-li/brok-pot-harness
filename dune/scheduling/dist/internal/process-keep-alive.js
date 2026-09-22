/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/scheduling/dist/internal/process-keep-alive.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createProcessKeepAlive(options2) {
  assertName2(options2.name);
  let active = true;
  const timer = setInterval(() => {
  }, MAX_TIMER_DELAY_MS);
  return {
    name: options2.name,
    dispose() {
      if (!active)
        return;
      active = false;
      clearInterval(timer);
    }
  };
}
function assertName2(name17) {
  if (name17.trim().length === 0) {
    throw new TypeError("name must not be empty");
  }
}
var MAX_TIMER_DELAY_MS;
var init_process_keep_alive = __esm({
  "../dune/scheduling/dist/internal/process-keep-alive.js"() {
    "use strict";
    MAX_TIMER_DELAY_MS = 2147483647;
  }
});

