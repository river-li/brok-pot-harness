/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/session-diagnostics.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var pinnedReporter5 = null;
function pinSessionDiagnosticsReporter(reporter) {
  pinnedReporter5 = reporter;
}
function reportSessionDiagnostic(report) {
  pinnedReporter5?.(report);
}

