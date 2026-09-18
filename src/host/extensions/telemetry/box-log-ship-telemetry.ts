function boxLogShipTelemetry(report) {
  switch (report.kind) {
    case "progress":
      return {
        level: "info",
        message: BOX_LOG_SHIP_EVENT,
        metadata: {
          kind: report.kind,
          bytes_written: String(report.bytesWritten),
          bytes_delivered: String(report.bytesDelivered),
          pending_window_count: String(report.pendingWindowCount),
          oldest_pending_window_age_ms: String(report.oldestPendingWindowAgeMs)
        }
      };
    case "pump_failed":
    case "pump_recovered":
    case "save_failed":
    case "save_recovered":
      return {
        level: report.kind.endsWith("_failed") ? "warn" : "info",
        message: BOX_LOG_SHIP_EVENT,
        metadata: {
          kind: report.kind,
          error_class: report.errorClass,
          failure_count: String(report.failureCount)
        }
      };
    default: {
      const _exhaustive = report;
      return _exhaustive;
    }
  }
}
