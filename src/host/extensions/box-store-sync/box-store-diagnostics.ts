var pinnedReporter2 = null;
function pinBoxStoreDiagnosticsReporter(reporter) {
  pinnedReporter2 = reporter;
}
function reportBoxStoreDiagnostic(diagnostic) {
  pinnedReporter2?.(diagnostic);
}
