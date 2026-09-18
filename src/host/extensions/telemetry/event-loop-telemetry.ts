var import_node_perf_hooks = require("node:perf_hooks");
init_bounded();
var EVENT_LOOP_RESOLUTION_MS = 20;
var WINDOW_MS = 6e4;
var PRESSURE_P95_MS = 50;
var HEARTBEAT_EVERY_N_WINDOWS = 5;
function resolveWindowEmit(args) {
  const pressureP95Ms = args.pressureP95Ms ?? PRESSURE_P95_MS;
  const heartbeatEveryN = args.heartbeatEveryNWindows ?? HEARTBEAT_EVERY_N_WINDOWS;
  if (args.p95Ms >= pressureP95Ms) return "pressure";
  if (args.windowIndex % heartbeatEveryN === 0) return "heartbeat";
  return void 0;
}
function eventLoopWindowTelemetry(report) {
  return {
    level: report.trigger === "pressure" ? "warn" : "info",
    event: HOST_EVENT_LOOP_EVENT,
    metadata: {
      trigger: brandLiteralEnum(report.trigger),
      p50_ms: String(Math.round(report.p50Ms)),
      p95_ms: String(Math.round(report.p95Ms)),
      max_ms: String(Math.round(report.maxMs)),
      utilization: report.utilization.toFixed(3),
      window_ms: String(report.windowMs)
    }
  };
}
function createEventLoopTelemetry(options2) {
  const windowMs = options2.windowMs ?? WINDOW_MS;
  const now = options2.now ?? Date.now;
  const monitor = (0, import_node_perf_hooks.monitorEventLoopDelay)({
    resolution: EVENT_LOOP_RESOLUTION_MS
  });
  monitor.enable();
  let lastUtilization = import_node_perf_hooks.performance.eventLoopUtilization();
  let windowStartedAtMs = now();
  let windowIndex = 0;
  let disposed = false;
  return {
    onTick: () => {
      if (disposed) return;
      const nowMs2 = now();
      const elapsedMs3 = nowMs2 - windowStartedAtMs;
      if (elapsedMs3 < windowMs) return;
      windowIndex++;
      windowStartedAtMs = nowMs2;
      const toMs = (ns2) => Math.max(0, ns2 / 1e6 - EVENT_LOOP_RESOLUTION_MS);
      const p50Ms = toMs(monitor.percentile(50));
      const p95Ms = toMs(monitor.percentile(95));
      const maxMs = toMs(monitor.max);
      monitor.reset();
      const currentUtilization = import_node_perf_hooks.performance.eventLoopUtilization();
      const active = currentUtilization.active - lastUtilization.active;
      const idle = currentUtilization.idle - lastUtilization.idle;
      lastUtilization = currentUtilization;
      const total = active + idle;
      const utilization = total > 0 && Number.isFinite(total) ? active / total : 0;
      const trigger2 = resolveWindowEmit({ windowIndex, p95Ms });
      if (trigger2 === void 0) return;
      options2.report({ p50Ms, p95Ms, maxMs, utilization, windowMs: elapsedMs3 }, trigger2);
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      monitor.disable();
    }
  };
}
