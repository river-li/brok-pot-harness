/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/core.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createKey(name, defaultValue) {
  return { symbol: name, defaultValue };
}
function createChildController(parentSignal) {
  const controller = new AbortController();
  if (parentSignal.aborted) {
    controller.abort(parentSignal.reason);
    return controller;
  }
  const propagate = () => controller.abort(parentSignal.reason);
  parentSignal.addEventListener("abort", propagate, { once: true });
  return {
    signal: controller.signal,
    abort(reason) {
      parentSignal.removeEventListener("abort", propagate);
      controller.abort(reason);
    }
  };
}
var ContextImpl = class _ContextImpl {
  constructor(parent, signal, values, name) {
    this.parent = parent;
    this.values = values || /* @__PURE__ */ new Map();
    this.name = name;
    if (signal) {
      this.signal = signal;
    } else if (parent) {
      this.signal = parent.signal;
    } else {
      this.signal = new AbortController().signal;
    }
  }
  get canceled() {
    return this.signal.aborted;
  }
  get reason() {
    return this.signal.reason;
  }
  get(key) {
    if (this.values.has(key.symbol)) {
      return this.values.get(key.symbol);
    }
    if (this.parent) {
      return this.parent.get(key);
    }
    return key.defaultValue;
  }
  with(key, value) {
    const newValues = new Map(this.values);
    newValues.set(key.symbol, value);
    return new _ContextImpl(this, void 0, newValues);
  }
  withCancel() {
    const controller = createChildController(this.signal);
    const ctx = new _ContextImpl(this, controller.signal);
    return [ctx, (reason) => controller.abort(reason)];
  }
  withTimeout(ms) {
    const controller = createChildController(this.signal);
    const ctx = new _ContextImpl(this, controller.signal);
    const timeoutId = setTimeout(() => {
      controller.abort(new Error("context deadline exceeded"));
    }, ms);
    controller.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
    }, { once: true });
    return ctx;
  }
  withDeadline(deadline) {
    const ms = deadline.getTime() - Date.now();
    if (ms <= 0) {
      const controller = createChildController(this.signal);
      controller.abort(new Error("context deadline exceeded"));
      return new _ContextImpl(this, controller.signal);
    }
    return this.withTimeout(ms);
  }
  /**
   * Create a child context with both a timeout and manual cancellation
   * Properly cleans up the timeout when cancel() is called early
   */
  withTimeoutAndCancel(ms) {
    const [cancelCtx, cancel] = this.withCancel();
    const timeoutCtx = cancelCtx.withTimeout(ms);
    return [timeoutCtx, cancel];
  }
  withName(name) {
    return new _ContextImpl(this, void 0, void 0, name);
  }
  withDetached() {
    return new _ContextImpl(this, new AbortController().signal);
  }
  getParent() {
    return this.parent;
  }
  getPath() {
    const path = [];
    let current = this;
    while (current) {
      if (current.name) {
        path.unshift(current.name);
      }
      current = current.getParent();
    }
    return path;
  }
};
function createContext() {
  return new ContextImpl();
}

