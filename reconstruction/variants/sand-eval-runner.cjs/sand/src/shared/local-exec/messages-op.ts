/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/local-exec/messages-op.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function withinLocalExecFileCap(bytesBase64) {
  return Math.floor(bytesBase64.length * 3 / 4) <= DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES;
}
var messagesResultSchema2 = messagesResultSchema.refine(
  (result) => result.kind !== "fetch-attachment" || withinLocalExecFileCap(result.bytesBase64),
  { message: "attachment exceeds the file limit", path: ["bytesBase64"] }
);
var SAND_MESSAGES_SEND_TIMEOUT_MS = 3 * 60 * 1e3;

