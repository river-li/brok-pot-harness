var pinnedReporter = null;
function pinHostDiagnosticsReporter(reporter) {
  pinnedReporter = reporter;
}
function reportHostDiagnostic(diagnostic) {
  pinnedReporter?.(diagnostic);
}
