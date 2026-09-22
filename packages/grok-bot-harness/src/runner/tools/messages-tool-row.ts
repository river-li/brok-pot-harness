/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/messages-tool-row.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
var DURATION_MS_CAP2 = 24 * 60 * 60 * 1e3;
function messagesToolCallRow(report, harness) {
  const isSend = report.outcome === "ok" && report.op === "send";
  const isPermissions = report.outcome === "ok" && report.op === "check-permissions";
  return {
    conversation_id: report.conversationId,
    harness,
    op: brandLiteralEnum(report.op),
    outcome: report.outcome,
    error_class: report.outcome === "error" ? brandLiteralEnum(report.errorClass) : void 0,
    error_code: report.outcome === "error" ? brandLiteralEnum(report.errorCode) : void 0,
    duration_ms: String(Math.min(Math.max(0, Math.round(report.durationMs)), DURATION_MS_CAP2)),
    send_verified: isSend ? String(report.sendVerified) : void 0,
    send_service: isSend ? report.sendService : void 0,
    send_via: isSend ? report.sendVia : void 0,
    full_disk_access: isPermissions ? String(report.fullDiskAccess) : void 0,
    automation: isPermissions ? report.automation : void 0
  };
}

