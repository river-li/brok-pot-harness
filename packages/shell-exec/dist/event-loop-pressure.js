function acquireEventLoopPressureTracker() {
  acquireCount++;
  if (sharedEventLoopPressureTracker === void 0) {
    sharedEventLoopPressureTracker = new EventLoopPressureTracker();
  }
  const tracker = sharedEventLoopPressureTracker;
  let disposed = false;
  return {
    isUnderPressure: () => tracker.isUnderPressure(),
    formatSuppressionSection: () => tracker.formatSuppressionSection(),
    dispose: () => {
      if (disposed) {
        return;
      }
      disposed = true;
      acquireCount--;
      if (acquireCount === 0 && sharedEventLoopPressureTracker !== void 0) {
        sharedEventLoopPressureTracker.dispose();
        sharedEventLoopPressureTracker = void 0;
      }
    }
  };
}
var import_node_perf_hooks, EventLoopPressureThresholdDefault, EventLoopPressureTrackerDefault, EMPTY_SNAPSHOT, sharedEventLoopPressureTracker, acquireCount, EventLoopPressureTracker;
var init_event_loop_pressure = __esm({
  "../packages/shell-exec/dist/event-loop-pressure.js"() {
    "use strict";
    import_node_perf_hooks = require("node:perf_hooks");
    (function(EventLoopPressureThresholdDefault2) {
      EventLoopPressureThresholdDefault2[EventLoopPressureThresholdDefault2["EventLoopDelayP95Ms"] = 50] = "EventLoopDelayP95Ms";
      EventLoopPressureThresholdDefault2[EventLoopPressureThresholdDefault2["EventLoopUtilization"] = 0.7] = "EventLoopUtilization";
    })(EventLoopPressureThresholdDefault || (EventLoopPressureThresholdDefault = {}));
    (function(EventLoopPressureTrackerDefault2) {
      EventLoopPressureTrackerDefault2[EventLoopPressureTrackerDefault2["SampleIntervalMs"] = 250] = "SampleIntervalMs";
      EventLoopPressureTrackerDefault2[EventLoopPressureTrackerDefault2["EventLoopResolutionMs"] = 20] = "EventLoopResolutionMs";
    })(EventLoopPressureTrackerDefault || (EventLoopPressureTrackerDefault = {}));
    EMPTY_SNAPSHOT = {
      eventLoopDelayP95Ms: 0,
      eventLoopUtilization: 0
    };
    acquireCount = 0;
    EventLoopPressureTracker = class {
      eventLoopMonitor;
      sampleTimer;
      lastEventLoopUtilization = import_node_perf_hooks.performance.eventLoopUtilization();
      latestSnapshot = EMPTY_SNAPSHOT;
      constructor() {
        this.eventLoopMonitor = (0, import_node_perf_hooks.monitorEventLoopDelay)({
          resolution: EventLoopPressureTrackerDefault.EventLoopResolutionMs
        });
        this.lastEventLoopUtilization = import_node_perf_hooks.performance.eventLoopUtilization();
        this.eventLoopMonitor.enable();
        this.sample();
        this.sampleTimer = setInterval(() => {
          this.sample();
        }, EventLoopPressureTrackerDefault.SampleIntervalMs);
        this.sampleTimer.unref?.();
      }
      dispose() {
        if (this.sampleTimer === void 0) {
          return;
        }
        clearInterval(this.sampleTimer);
        this.sampleTimer = void 0;
        this.eventLoopMonitor.disable();
        this.latestSnapshot = EMPTY_SNAPSHOT;
        this.lastEventLoopUtilization = import_node_perf_hooks.performance.eventLoopUtilization();
      }
      isUnderPressure() {
        return this.latestSnapshot.eventLoopDelayP95Ms >= EventLoopPressureThresholdDefault.EventLoopDelayP95Ms || this.latestSnapshot.eventLoopUtilization >= EventLoopPressureThresholdDefault.EventLoopUtilization;
      }
      formatSuppressionSection() {
        const snapshot = this.latestSnapshot;
        const metrics2 = [
          `event loop delay p95 ${snapshot.eventLoopDelayP95Ms.toFixed(1)}ms (threshold ${EventLoopPressureThresholdDefault.EventLoopDelayP95Ms}ms)`,
          `event loop utilization ${(snapshot.eventLoopUtilization * 100).toFixed(1)}% (threshold ${(EventLoopPressureThresholdDefault.EventLoopUtilization * 100).toFixed(1)}%)`
        ].join(", ");
        const pressureReasons = this.getPressureTriggerReasons(snapshot);
        const pressureState = pressureReasons.length > 0 ? `event loop under pressure (${pressureReasons.join(", ")})` : "event loop not under pressure";
        return `event loop pressure gate enabled; ${pressureState}; event loop metrics: ${metrics2}`;
      }
      getPressureTriggerReasons(snapshot) {
        const reasons = [];
        if (snapshot.eventLoopDelayP95Ms >= EventLoopPressureThresholdDefault.EventLoopDelayP95Ms) {
          reasons.push(`event loop delay p95 ${snapshot.eventLoopDelayP95Ms.toFixed(1)}ms >= ${EventLoopPressureThresholdDefault.EventLoopDelayP95Ms}ms`);
        }
        if (snapshot.eventLoopUtilization >= EventLoopPressureThresholdDefault.EventLoopUtilization) {
          reasons.push(`event loop utilization ${(snapshot.eventLoopUtilization * 100).toFixed(1)}% >= ${(EventLoopPressureThresholdDefault.EventLoopUtilization * 100).toFixed(1)}%`);
        }
        return reasons;
      }
      sample() {
        this.latestSnapshot = {
          eventLoopDelayP95Ms: this.computeEventLoopDelayP95Ms(),
          eventLoopUtilization: this.computeEventLoopUtilization()
        };
      }
      computeEventLoopDelayP95Ms() {
        const rawP95Ns = this.eventLoopMonitor.percentile(95);
        this.eventLoopMonitor.reset();
        if (!Number.isFinite(rawP95Ns)) {
          return 0;
        }
        const p95Ms = rawP95Ns / 1e6;
        return Math.max(0, p95Ms - EventLoopPressureTrackerDefault.EventLoopResolutionMs);
      }
      computeEventLoopUtilization() {
        const currentEventLoopUtilization = import_node_perf_hooks.performance.eventLoopUtilization();
        const active = currentEventLoopUtilization.active - this.lastEventLoopUtilization.active;
        const idle = currentEventLoopUtilization.idle - this.lastEventLoopUtilization.idle;
        const total = active + idle;
        this.lastEventLoopUtilization = currentEventLoopUtilization;
        if (total <= 0 || !Number.isFinite(total)) {
          return 0;
        }
        return active / total;
      }
    };
  }
});
