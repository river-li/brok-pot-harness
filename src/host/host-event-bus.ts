/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/host-event-bus.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandHostEventBus = class {
  constructor(reportFailure = () => {
  }) {
    this.reportFailure = reportFailure;
  }
  reportFailure;
  listeners = /* @__PURE__ */ new Set();
  capabilityEvents = createHostEvents({
    onHandlerFailure: (topic, error42) => this.reportFailure({
      kind: "subscriber_failed",
      topic,
      errorClass: errorLogTag(error42)
    })
  });
  emit(...args) {
    if (args.length !== 1) {
      return this.capabilityEvents.emit(args[0], args[1], args[2]);
    }
    const [event] = args;
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error42) {
        this.reportFailure({ kind: "listener_failed", errorClass: errorLogTag(error42) });
      }
    }
  }
  on(topic, handler) {
    return this.capabilityEvents.on(topic, handler);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
};

