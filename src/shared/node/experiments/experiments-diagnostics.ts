var PRE_PIN_BUFFER_CAP2 = 64;
var pinnedReporter4 = null;
var buffered2 = [];
var droppedWhileCapped = 0;
function pinExperimentsDiagnosticsReporter(reporter) {
  pinnedReporter4 = reporter;
  const backlog = buffered2;
  buffered2 = [];
  const dropped = droppedWhileCapped;
  droppedWhileCapped = 0;
  if (reporter == null) return;
  for (const diagnostic of backlog) reporter(diagnostic);
  if (dropped > 0) reporter({ kind: "pre_pin_dropped", count: dropped });
}
function reportExperimentsDiagnostic(diagnostic) {
  if (pinnedReporter4 != null) {
    pinnedReporter4(diagnostic);
    return;
  }
  if (buffered2.length >= PRE_PIN_BUFFER_CAP2) {
    droppedWhileCapped += 1;
    return;
  }
  buffered2.push(diagnostic);
}
