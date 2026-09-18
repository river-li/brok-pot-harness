init_system_errno();
var NETWORK_ERRNOS = /* @__PURE__ */ new Set([
  "ECONNRESET",
  "EPIPE",
  "ECONNABORTED",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENETDOWN",
  "ENETRESET"
]);
function hasTimeoutName(error41) {
  const seen = /* @__PURE__ */ new Set();
  let current = error41;
  while (current != null && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const name17 = current.name;
    if (typeof name17 === "string" && (name17 === "AbortError" || /TimeoutError$/.test(name17))) {
      return true;
    }
    current = current.cause;
  }
  return false;
}
function classifyGatewayCommandError(error41) {
  const errorClass = error41 instanceof Error ? error41.name || "Error" : "unknown";
  const errno = findSystemErrno(error41);
  if (error41 instanceof SandBoxDaemonUnreachableError) {
    const reason = (() => {
      if (error41.outcome === "refused") return "daemon_refused";
      if (error41.outcome === "timeout") return "daemon_timeout";
      return "daemon_crash";
    })();
    return { reason, errorClass, errno };
  }
  if (error41 instanceof SandBoxNoMonitorAvailableError) {
    return { reason: "no_monitor", errorClass, errno };
  }
  if (errno === "ECONNREFUSED") return { reason: "refused", errorClass, errno };
  if (errno === "ENOTFOUND" || errno === "EAI_AGAIN") {
    return { reason: "dns", errorClass, errno };
  }
  if (errno === "ETIMEDOUT" || hasTimeoutName(error41)) {
    return { reason: "timeout", errorClass, errno };
  }
  if (errno != null && NETWORK_ERRNOS.has(errno)) {
    return { reason: "network", errorClass, errno };
  }
  return { reason: "application", errorClass, errno };
}
function commandErrorReportToTelemetry(report) {
  return {
    level: "error",
    metadata: {
      method: report.method,
      reason: report.reason,
      error_class: report.errorClass,
      errno: report.errno,
      duration_ms: String(Math.round(report.durationMs)),
      request_id: report.requestId,
      trace_id: report.traceId,
      span_id: report.spanId
    }
  };
}
function commandSuccessReportToTelemetry(report) {
  return {
    level: "info",
    metadata: {
      method: report.method,
      duration_ms: String(Math.round(report.durationMs)),
      request_id: report.requestId,
      trace_id: report.traceId,
      span_id: report.spanId
    }
  };
}
