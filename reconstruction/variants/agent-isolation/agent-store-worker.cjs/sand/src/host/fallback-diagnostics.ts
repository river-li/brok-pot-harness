/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/fallback-diagnostics.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var reported = /* @__PURE__ */ new Set();
function reportFallback(stage, error) {
  const errorClass = errorLogTag(error);
  const key = `${stage} ${errorClass}`;
  if (reported.has(key)) return;
  reported.add(key);
  reportHostDiagnostic({ kind: "fallback_taken", stage, errorClass });
}

