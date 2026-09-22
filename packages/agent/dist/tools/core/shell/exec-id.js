/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/exec-id.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function generateShellExecId(ctx, toolCallId) {
  const requestId2 = getRequestId(ctx);
  return generateSeededUuid(requestId2 === void 0 ? toolCallId : `${requestId2}:${toolCallId}`);
}

