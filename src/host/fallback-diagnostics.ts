init_errors();
init_system_errno();
var reported = /* @__PURE__ */ new Set();
function reportFallback(stage, error41) {
  const errorClass = errorLogTag(error41);
  const key = `${stage} ${errorClass}`;
  if (reported.has(key)) return;
  reported.add(key);
  reportHostDiagnostic({ kind: "fallback_taken", stage, errorClass });
}
function reportFallbackUnlessAbsent(stage, error41) {
  if (!isMissingPathError(error41)) reportFallback(stage, error41);
}
