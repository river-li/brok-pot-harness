function cloudCanvasToolsGateEligible(host) {
  return !host.isBoxScopedSubagent && host.gates.cloudCanvasTools();
}
