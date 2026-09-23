var NOOP_RESILIENCE_LISTENER = Object.freeze({
  onDiskFull() {
  },
  onSymlinkRefused() {
  },
  onNetworkError() {
  },
  onThrottled() {
  },
  onMintGateStateChanged() {
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
