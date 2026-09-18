function createProcessKeepAlive(options2) {
  assertName2(options2.name);
  let active = true;
  const timer = globalThis.setInterval(() => {
  }, MAX_TIMER_DELAY_MS);
  return {
    name: options2.name,
    dispose() {
      if (!active) return;
      active = false;
      globalThis.clearInterval(timer);
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
  "../dune/src/internal/scheduling/process-keep-alive.ts"() {
    "use strict";
    MAX_TIMER_DELAY_MS = 2147483647;
  }
});
