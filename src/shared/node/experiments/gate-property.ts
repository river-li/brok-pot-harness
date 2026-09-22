/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/experiments/gate-property.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var MutableGateProperty = class {
  constructor(value) {
    this.value = value;
  }
  value;
  listeners = /* @__PURE__ */ new Set();
  get() {
    return this.value;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  set(value) {
    if (this.value === value) return;
    this.value = value;
    for (const listener of this.listeners) {
      try {
        listener(value);
      } catch (error42) {
        reportExperimentsDiagnostic({
          kind: "gate_listener_failed",
          errorClass: errorLogTag(error42)
        });
      }
    }
  }
  clearListeners() {
    this.listeners.clear();
  }
};

