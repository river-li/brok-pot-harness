/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/fallback-diagnostics.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
init_system_errno();
var reported = /* @__PURE__ */ new Set();
function reportFallback(stage, error42) {
  const errorClass = errorLogTag(error42);
  const key = `${stage} ${errorClass}`;
  if (reported.has(key)) return;
  reported.add(key);
  reportHostDiagnostic({ kind: "fallback_taken", stage, errorClass });
}
function reportFallbackUnlessAbsent(stage, error42) {
  if (!isMissingPathError(error42)) reportFallback(stage, error42);
}

