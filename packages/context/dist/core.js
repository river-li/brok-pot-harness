function createKey(name17, defaultValue) {
  return { symbol: name17, defaultValue };
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
function createContext() {
  return new ContextImpl();
}
var ContextImpl;
var init_core = __esm({
  "../packages/context/dist/core.js"() {
    "use strict";
    ContextImpl = class _ContextImpl {
      constructor(parent, signal, values, name17) {
        this.parent = parent;
        this.values = values || /* @__PURE__ */ new Map();
        this.name = name17;
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
      withTimeout(ms2) {
        const controller = createChildController(this.signal);
        const ctx = new _ContextImpl(this, controller.signal);
        const timeoutId = setTimeout(() => {
          controller.abort(new Error("context deadline exceeded"));
        }, ms2);
        controller.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
        }, { once: true });
        return ctx;
      }
      withDeadline(deadline) {
        const ms2 = deadline.getTime() - Date.now();
        if (ms2 <= 0) {
          const controller = createChildController(this.signal);
          controller.abort(new Error("context deadline exceeded"));
          return new _ContextImpl(this, controller.signal);
        }
        return this.withTimeout(ms2);
      }
      /**
       * Create a child context with both a timeout and manual cancellation
       * Properly cleans up the timeout when cancel() is called early
       */
      withTimeoutAndCancel(ms2) {
        const [cancelCtx, cancel] = this.withCancel();
        const timeoutCtx = cancelCtx.withTimeout(ms2);
        return [timeoutCtx, cancel];
      }
      withName(name17) {
        return new _ContextImpl(this, void 0, void 0, name17);
      }
      withDetached() {
        return new _ContextImpl(this, new AbortController().signal);
      }
      getParent() {
        return this.parent;
      }
      getPath() {
        const path31 = [];
        let current = this;
        while (current) {
          if (current.name) {
            path31.unshift(current.name);
          }
          current = current.getParent();
        }
        return path31;
      }
    };
  }
});
