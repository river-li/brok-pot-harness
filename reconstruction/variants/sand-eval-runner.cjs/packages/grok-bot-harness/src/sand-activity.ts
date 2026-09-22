/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/sand-activity.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SURFACE_UNRESOLVED_TOOL_CASES = /* @__PURE__ */ new Set([
  "shellToolCall",
  "readToolCall",
  "awaitToolCall"
]);
function fileBasename(path30) {
  if (path30 == null) return void 0;
  const segments = path30.split(/[\\/]/).filter((segment) => segment.length > 0);
  return segments.at(-1);
}

