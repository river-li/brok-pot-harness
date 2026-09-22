/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/request-lineage.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function sanitizeHeaderValue(value) {
  return value.replace(/[\r\n]/g, "");
}
function buildSandRequestLineageHeaders(lineage) {
  if (lineage == null) {
    return {};
  }
  return {
    "x-parent-request-id": sanitizeHeaderValue(lineage.parentRequestId),
    "x-root-parent-request-id": sanitizeHeaderValue(lineage.rootParentRequestId),
    ...lineage.parentAgentToolCallId != null ? {
      "x-parent-agent-tool-call-id": sanitizeHeaderValue(lineage.parentAgentToolCallId)
    } : {},
    ...lineage.directMetaParentChildSubagent === true ? {
      "x-direct-meta-parent-child-subagent": "true"
    } : {}
  };
}

