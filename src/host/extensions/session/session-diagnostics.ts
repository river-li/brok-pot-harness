var pinnedReporter5 = null;
function pinSessionDiagnosticsReporter(reporter) {
  pinnedReporter5 = reporter;
}
function reportSessionDiagnostic(report) {
  pinnedReporter5?.(report);
}
