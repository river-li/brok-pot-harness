init_proto();
init_cursor_inference();
var MAX_DEFERRED_EVENTS = 256;
var SandProductAnalytics = class {
  state;
  activated = false;
  baseProps;
  options;
  debug;
  lastActiveDayKeys = /* @__PURE__ */ new Map();
  egressIpHash;
  constructor(options2) {
    this.options = options2;
    this.debug = options2.environment.analyticsDebug;
    this.baseProps = {
      client: "sand",
      sand_version: options2.environment.backend.clientVersion,
      flavor: options2.environment.variant,
      os: process.platform,
      arch: process.arch,
      host_in_box: options2.hostInBox
    };
    this.state = options2.environment.analyticsOptedOut ? { kind: "disabled" } : { kind: "deferred", buffer: new DeferredAnalyticsBuffer() };
  }
  activate() {
    if (this.activated) return;
    this.activated = true;
    if (this.state.kind === "disabled") return;
    this.goLive();
  }
  goLive() {
    const deferredBuffer = this.state.kind === "deferred" ? this.state.buffer : void 0;
    try {
      const createClient2 = this.options.createClient ?? (() => createSandCursorBackendClient(AnalyticsService, {
        backend: this.options.environment.backend,
        getAccessToken: this.options.getAccessToken,
        getMachineId: this.options.getMachineId
      }));
      const buffer = new AnalyticsBuffer({
        client: createClient2(),
        tokenProvider: {
          getAccessToken: async () => {
            try {
              const token = await this.options.getAccessToken({
                backendUrl: this.options.environment.backend.backendUrl
              });
              return token.length > 0 ? token : null;
            } catch (error42) {
              this.options.onAccessTokenFailure?.(error42);
              return null;
            }
          }
        },
        onDebug: this.debug ? (tag, payload) => {
          console.info(`[sand-analytics] ${tag}`, payload);
        } : void 0
      });
      if (deferredBuffer != null) {
        for (const event of deferredBuffer.getEvents()) {
          buffer.track(event.eventName, event.props, event.timestamp);
        }
        deferredBuffer.clear();
      }
      this.state = { kind: "active", buffer };
      if (this.debug) {
        console.info("[sand-analytics] enabled");
      }
    } catch (error42) {
      if (this.debug) {
        console.info("[sand-analytics] failed to enable; disabling", error42);
      }
      this.disable();
    }
  }
  disable() {
    if (this.state.kind === "deferred") {
      this.state.buffer.clear();
    }
    this.state = { kind: "disabled" };
    if (this.debug) {
      console.info("[sand-analytics] disabled (error)");
    }
  }
  setEgressIpHash(ipHash) {
    this.egressIpHash = ipHash;
  }
  trackEvent(event, props) {
    if (this.state.kind !== "deferred" && this.state.kind !== "active") return;
    if (this.state.kind === "deferred" && this.state.buffer.getEvents().length >= MAX_DEFERRED_EVENTS) {
      return;
    }
    const enriched = this.enrich(props);
    if (this.debug) {
      console.info(`[sand-analytics] track ${event}`, enriched);
    }
    this.state.buffer.track(event, enriched);
  }
  markActive(reason) {
    if (!this.canRecordEvents()) return;
    const dayKey = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (this.lastActiveDayKeys.get(reason) === dayKey) return;
    this.lastActiveDayKeys.set(reason, dayKey);
    const osLocale = this.options.getOsLocale?.();
    this.trackEvent("sand.app.active", {
      reason,
      ...osLocale !== void 0 && osLocale.length > 0 ? { os_locale: osLocale } : {}
    });
  }
  canRecordEvents() {
    return this.state.kind === "deferred" || this.state.kind === "active";
  }
  async flush(timeoutMs = 2500) {
    if (this.state.kind !== "active") return;
    try {
      await this.state.buffer.flush(timeoutMs);
    } catch {
    }
  }
  async dispose() {
    await this.flush();
  }
  enrich(props) {
    return {
      ...this.baseProps,
      ...props,
      ...this.egressIpHash !== void 0 ? { ip_hash: this.egressIpHash } : {}
    };
  }
};
