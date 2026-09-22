/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/event-loop-pressure.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var EventLoopPressureThresholdDefault, EventLoopPressureTrackerDefault;
var init_event_loop_pressure = __esm({
  "../packages/shell-exec/dist/event-loop-pressure.js"() {
    "use strict";
    (function(EventLoopPressureThresholdDefault2) {
      EventLoopPressureThresholdDefault2[EventLoopPressureThresholdDefault2["EventLoopDelayP95Ms"] = 50] = "EventLoopDelayP95Ms";
      EventLoopPressureThresholdDefault2[EventLoopPressureThresholdDefault2["EventLoopUtilization"] = 0.7] = "EventLoopUtilization";
    })(EventLoopPressureThresholdDefault || (EventLoopPressureThresholdDefault = {}));
    (function(EventLoopPressureTrackerDefault2) {
      EventLoopPressureTrackerDefault2[EventLoopPressureTrackerDefault2["SampleIntervalMs"] = 250] = "SampleIntervalMs";
      EventLoopPressureTrackerDefault2[EventLoopPressureTrackerDefault2["EventLoopResolutionMs"] = 20] = "EventLoopResolutionMs";
    })(EventLoopPressureTrackerDefault || (EventLoopPressureTrackerDefault = {}));
  }
});

