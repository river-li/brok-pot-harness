/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/resilience-events.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NOOP_RESILIENCE_LISTENER = Object.freeze({
  onDiskFull() {
  },
  onSymlinkRefused() {
  },
  onNetworkError() {
  },
  onThrottled() {
  }
});
function safeNotifyListener(listener, method, event) {
  if (listener === void 0) {
    return;
  }
  const handler = listener[method];
  if (typeof handler !== "function") {
    return;
  }
  let result;
  try {
    result = handler.call(listener, event);
  } catch (_a19) {
    return;
  }
  if (result !== void 0 && result !== null && typeof result.then === "function") {
    result.then(noop, noop);
  }
}
function noop() {
}

