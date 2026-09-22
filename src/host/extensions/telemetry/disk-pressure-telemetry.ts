/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/disk-pressure-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
function telemetryLevel(level) {
  if (level === "hard") return "error";
  if (level === "soft") return "warn";
  return "info";
}
function diskPressureTelemetry(report) {
  return {
    level: telemetryLevel(report.level),
    metadata: {
      volume: report.volume,
      pressure_level: report.level,
      trigger: brandLiteralEnum(report.trigger),
      total_bytes: String(report.totalBytes),
      available_bytes: String(report.availableBytes),
      used_percent: report.usedPercent.toFixed(1)
    }
  };
}

