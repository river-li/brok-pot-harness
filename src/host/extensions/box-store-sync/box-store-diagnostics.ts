/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/box-store-diagnostics.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var pinnedReporter2 = null;
function pinBoxStoreDiagnosticsReporter(reporter) {
  pinnedReporter2 = reporter;
}
function reportBoxStoreDiagnostic(diagnostic) {
  pinnedReporter2?.(diagnostic);
}

