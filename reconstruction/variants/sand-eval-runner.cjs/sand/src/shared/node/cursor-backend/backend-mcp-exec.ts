/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/cursor-backend/backend-mcp-exec.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_mcp_tool_annotations();
var DEFINITIVE_OAUTH_REJECTION_CODES = /* @__PURE__ */ new Set([
  Code.InvalidArgument,
  Code.NotFound,
  Code.PermissionDenied,
  Code.Unauthenticated,
  Code.FailedPrecondition
]);
var sandAuditEventSequenceKey = createKey(/* @__PURE__ */ Symbol("sand.action-audit.event-sequence"), void 0);
var MCP_SDK_REQUEST_TIMEOUT_MS = 6e4;
var EXECUTE_TOOL_DIAL_DISCOVER_CALL_TIMEOUT_MS = 3 * MCP_SDK_REQUEST_TIMEOUT_MS;

