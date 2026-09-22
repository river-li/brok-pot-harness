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
