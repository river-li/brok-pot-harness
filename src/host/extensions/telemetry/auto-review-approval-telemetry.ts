/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/auto-review-approval-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function autoReviewApprovalTelemetry(report) {
  return {
    level: "info",
    event: "sand.auto_review.approval",
    metadata: {
      event_type: report.eventType,
      conversation_id: report.conversationId,
      approval_id: report.approvalId,
      surface: report.surface,
      status: report.status,
      age_ms: String(Math.max(0, Math.round(report.ageMs))),
      ...report.ttlMs !== void 0 ? { ttl_ms: String(Math.max(0, Math.round(report.ttlMs))) } : {},
      ...report.cause !== void 0 ? { cause: report.cause } : {}
    }
  };
}

