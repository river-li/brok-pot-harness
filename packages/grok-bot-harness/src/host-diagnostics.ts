init_errors();
var pinnedReporter = null;
function pinHostDiagnosticsReporter(reporter) {
  pinnedReporter = reporter;
}
function reportHostDiagnostic(diagnostic) {
  pinnedReporter?.(diagnostic);
}
function reportHostDiagnosticOrStderr(diagnostic) {
  if (pinnedReporter === null) {
    process.stderr.write(`${hostDiagnosticLine(diagnostic)}
`);
    return;
  }
  try {
    pinnedReporter(diagnostic);
  } catch (reporterError) {
    process.stderr.write(
      `${hostDiagnosticLine(diagnostic)} reporter_error_class=${errorLogTag(reporterError)}
`
    );
  }
}
function hostDiagnosticLine(diagnostic) {
  const fields2 = Object.entries(diagnostic).filter(([name17]) => name17 !== "kind").map(
    ([name17, value]) => `${name17.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)}=${value}`
  );
  return [diagnostic.kind, ...fields2].join(" ");
}
