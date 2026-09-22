var __awaiter73 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var DEFAULT_BUFFER_LIMIT = 200;
var DEFAULT_FLUSH_INTERVAL_MS = 3e3;
var DEFAULT_NORMAL_FLUSH_TIMEOUT_MS = 2500;
var TOKEN_CHECK_TIMEOUT = /* @__PURE__ */ Symbol("token_check_timeout");
var AnalyticsBuffer = class {
  constructor(options2) {
    var _a19, _b2, _c2, _d;
    this.buffer = [];
    this.flushTimer = null;
    this.activeFlush = null;
    this.client = options2.client;
    this.tokenProvider = options2.tokenProvider;
    this.bufferLimit = (_a19 = options2.bufferLimit) !== null && _a19 !== void 0 ? _a19 : DEFAULT_BUFFER_LIMIT;
    this.flushIntervalMs = (_b2 = options2.flushIntervalMs) !== null && _b2 !== void 0 ? _b2 : DEFAULT_FLUSH_INTERVAL_MS;
    this.normalFlushTimeoutMs = (_c2 = options2.normalFlushTimeoutMs) !== null && _c2 !== void 0 ? _c2 : DEFAULT_NORMAL_FLUSH_TIMEOUT_MS;
    this.onDebug = (_d = options2.onDebug) !== null && _d !== void 0 ? _d : (() => {
    });
  }
  track(eventName, props, timestamp3) {
    const ts2 = typeof timestamp3 === "number" ? BigInt(timestamp3) : BigInt(Date.now());
    const event = new AnalyticsEvent({
      eventName,
      eventData: toEventData(props),
      timestamp: ts2
    });
    this.buffer.push(event);
    if (this.buffer.length >= this.bufferLimit)
      this.flushInBackground();
    else
      this.scheduleFlush();
  }
  flush(timeoutMs) {
    return __awaiter73(this, void 0, void 0, function* () {
      while (true) {
        if (this.activeFlush) {
          yield this.activeFlush;
          if (this.buffer.length === 0)
            return;
          continue;
        }
        if (this.buffer.length === 0)
          return;
        const flushPromise = this.flushOnce(timeoutMs);
        this.activeFlush = flushPromise;
        let sentCount = 0;
        try {
          sentCount = yield flushPromise;
        } finally {
          if (this.activeFlush === flushPromise)
            this.activeFlush = null;
        }
        if (this.buffer.length === 0 || sentCount === 0)
          return;
      }
    });
  }
  flushOnce(timeoutMs) {
    return __awaiter73(this, void 0, void 0, function* () {
      var _a19;
      if (this.buffer.length === 0)
        return 0;
      const controller = new AbortController();
      const timeout2 = setTimeout(() => controller.abort(), timeoutMs);
      (_a19 = timeout2.unref) === null || _a19 === void 0 ? void 0 : _a19.call(timeout2);
      try {
        try {
          const token = yield Promise.race([
            this.tokenProvider.getAccessToken(),
            new Promise((resolve29) => {
              controller.signal.addEventListener("abort", () => resolve29(TOKEN_CHECK_TIMEOUT), {
                once: true
              });
            })
          ]);
          if (token === TOKEN_CHECK_TIMEOUT) {
            this.onDebug("analytics.flush.deferred", {
              reason: "token_check_timed_out",
              count: this.buffer.length
            });
            return 0;
          }
          if (!token) {
            this.onDebug("analytics.flush.deferred", {
              reason: "no_token",
              count: this.buffer.length
            });
            return 0;
          }
        } catch (err) {
          this.onDebug("analytics.flush.deferred", {
            reason: "token_check_failed",
            error: err,
            count: this.buffer.length
          });
          return 0;
        }
        const toSend = this.buffer.slice();
        if (toSend.length === 0)
          return 0;
        try {
          yield this.client.trackEvents(new TrackEventsRequest({ events: toSend }), {
            signal: controller.signal
          });
          this.buffer.splice(0, toSend.length);
          return toSend.length;
        } catch (err) {
          this.onDebug("analytics.flush.error", { error: err });
          if (this.buffer.length > this.bufferLimit) {
            this.buffer.splice(0, this.buffer.length - this.bufferLimit);
          }
          return 0;
        }
      } finally {
        clearTimeout(timeout2);
      }
    });
  }
  flushInBackground() {
    void this.flush(this.normalFlushTimeoutMs);
  }
  scheduleFlush() {
    var _a19, _b2;
    if (this.flushTimer)
      return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flushInBackground();
    }, this.flushIntervalMs);
    (_b2 = (_a19 = this.flushTimer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
  }
};
