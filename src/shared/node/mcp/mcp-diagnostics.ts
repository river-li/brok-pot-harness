function pinMcpDiagnosticsReporter(reporter) {
  pinnedReporter3 = reporter;
  reportedBoxStdioStatuses.clear();
  const backlog = buffered;
  buffered = [];
  if (reporter == null) return;
  for (const failure2 of backlog) reporter(failure2);
}
function mcpErrorClassOf(error42) {
  if (error42 instanceof ConnectError) return `ConnectError.${Code[error42.code]}`;
  return errorClassOf(error42);
}
function reportMcpHostEdgeFailure(leg, error42) {
  const failure2 = { leg, errorClass: mcpErrorClassOf(error42) };
  if (pinnedReporter3 != null) {
    pinnedReporter3(failure2);
    return;
  }
  if (buffered.length >= PRE_PIN_BUFFER_CAP) return;
  buffered.push(failure2);
}
function reportMcpHostEdgeDegraded(leg, errorClass) {
  const failure2 = { leg, errorClass };
  if (pinnedReporter3 != null) {
    pinnedReporter3(failure2);
    return;
  }
  if (buffered.length >= PRE_PIN_BUFFER_CAP) return;
  buffered.push(failure2);
}
function boxStdioStatusClassOf(statusDetail) {
  const { errorClass } = classifyLocalExecFailure(statusDetail ?? "");
  return errorClass === "other" ? "error_status" : errorClass;
}
function reportBoxStdioErrorStatus(serverIdentifier, statusDetail) {
  const errorClass = boxStdioStatusClassOf(statusDetail);
  const key = `${serverIdentifier}\0${errorClass}`;
  if (reportedBoxStdioStatuses.has(key)) return;
  if (reportedBoxStdioStatuses.size >= BOX_STDIO_STATUS_REPORT_CAP) return;
  reportedBoxStdioStatuses.add(key);
  reportMcpHostEdgeDegraded("box-stdio-status", errorClass);
}
function recordMcpExecErrorClass(ctx, error42) {
  const attribution = ctx.get(mcpExecAttributionKey);
  if (attribution == null) return;
  attribution.errorClass = mcpErrorClassOf(error42);
}
var PRE_PIN_BUFFER_CAP, pinnedReporter3, buffered, BOX_STDIO_STATUS_REPORT_CAP, reportedBoxStdioStatuses, MCP_ERROR_RESULT_CLASS, mcpExecAttributionKey;
var init_mcp_diagnostics = __esm({
  "src/shared/node/mcp/mcp-diagnostics.ts"() {
    "use strict";
    init_dist4();
    init_esm2();
    init_errors();
    init_system_errno();
    init_local_exec_failure_classifier();
    PRE_PIN_BUFFER_CAP = 32;
    pinnedReporter3 = null;
    buffered = [];
    BOX_STDIO_STATUS_REPORT_CAP = 128;
    reportedBoxStdioStatuses = /* @__PURE__ */ new Set();
    MCP_ERROR_RESULT_CLASS = "mcp_error_result";
    mcpExecAttributionKey = createKey(
      /* @__PURE__ */ Symbol("sandMcpExecAttribution"),
      void 0
    );
  }
});
