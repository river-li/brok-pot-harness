init_errors();
var write = createCounter("grok_bot.memory.write", {
  description: "An update_state memory action settled ok on a harness that wires memory telemetry (Temporal today): one increment per accepted write, forget, promote, or teach, by the scope it landed in (agent, user, conversation)",
  labelNames: ["harness", "scope", "action"]
});
var writeBytes = createHistogram("grok_bot.memory.write_bytes", {
  description: "UTF-8 bytes of the fact text an accepted update_state memory action carried, by harness, scope, and action; a size distribution per write, never the text",
  labelNames: ["harness", "scope", "action"]
});
function memoryFactBytes(fact) {
  return new TextEncoder().encode(fact).byteLength;
}
function recordMemoryWrite(metrics2, telemetry, report) {
  try {
    if (metrics2 !== void 0) {
      const labels = { harness: metrics2.harness, scope: report.scope, action: report.action };
      write.increment(metrics2.ctx, 1, labels);
      writeBytes.histogram(metrics2.ctx, report.bytes, labels);
    }
    telemetry?.reportMemoryWrite(report);
  } catch (error42) {
    process.stderr.write(`sand.memory.metrics_failed error_class=${errorLogTag(error42)}
`);
  }
}
