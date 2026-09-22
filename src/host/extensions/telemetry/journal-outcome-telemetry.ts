/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/journal-outcome-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function corruptTailKind(cause) {
  return cause !== void 0 && "tail" in cause ? cause.tail : void 0;
}
function journalOutcomeLevel(report) {
  if (report.outcome === "failed") return "error";
  const tail = corruptTailKind(report.cause);
  if (tail !== void 0 && tail !== "missing") return "warn";
  return "info";
}
function journalOutcomeTelemetry(report) {
  return {
    level: journalOutcomeLevel(report),
    event: JOURNAL_OUTCOME_EVENT,
    metadata: {
      op: report.op,
      outcome: report.outcome,
      conversation_id: report.conversationId,
      entry_count: report.entryCount !== void 0 ? String(report.entryCount) : void 0,
      bytes: report.bytes !== void 0 ? String(report.bytes) : void 0,
      duration_ms: String(Math.round(report.durationMs)),
      ...report.cause !== void 0 ? sandErrorTags(report.cause) : {}
    }
  };
}

