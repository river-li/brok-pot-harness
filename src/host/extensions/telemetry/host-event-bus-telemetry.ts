function hostEventBusTelemetry(report) {
  return {
    level: "error",
    event: HOST_EVENT_BUS_EVENT,
    metadata: {
      kind: report.kind,
      topic: report.topic,
      error_class: report.errorClass
    }
  };
}
