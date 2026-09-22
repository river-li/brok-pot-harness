/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/turn-empty-delivery-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function turnEmptyDeliveryTelemetry(report) {
  return {
    level: "warn",
    event: TURN_EMPTY_DELIVERY_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      source: report.source,
      request_source: report.requestSource,
      reply_nudge_attempts: report.replyNudgeAttempts !== void 0 ? String(report.replyNudgeAttempts) : void 0,
      redrive_attempts: report.redriveAttempts !== void 0 ? String(report.redriveAttempts) : void 0,
      tool_call_count: String(report.toolCallCount),
      stream_output_produced: String(report.streamOutputProduced),
      duration_ms: String(Math.round(report.durationMs)),
      ack_outstanding: String(report.ackOutstanding)
    }
  };
}

