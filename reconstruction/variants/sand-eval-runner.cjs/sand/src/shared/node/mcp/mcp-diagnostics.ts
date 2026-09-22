/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-diagnostics.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();

// @recovered-fragment 2/2
function mcpErrorClassOf(error3) {
  if (error3 instanceof ConnectError) return `ConnectError.${Code[error3.code]}`;
  return errorClassOf(error3);
}
function boxStdioStatusClassOf(statusDetail) {
  const { errorClass } = classifyLocalExecFailure(statusDetail ?? "");
  return errorClass === "other" ? "error_status" : errorClass;
}
var MCP_ERROR_RESULT_CLASS = "mcp_error_result";
var mcpExecAttributionKey = createKey(
  /* @__PURE__ */ Symbol("sandMcpExecAttribution"),
  void 0
);
function recordMcpExecErrorClass(ctx, error3) {
  const attribution = ctx.get(mcpExecAttributionKey);
  if (attribution == null) return;
  attribution.errorClass = mcpErrorClassOf(error3);
}

