/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/exec-id.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function generateShellExecId(ctx, toolCallId) {
  const requestId = getRequestId(ctx);
  return generateSeededUuid(requestId === void 0 ? toolCallId : `${requestId}:${toolCallId}`);
}

