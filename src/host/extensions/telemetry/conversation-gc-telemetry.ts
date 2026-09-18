init_bounded();
function cappedCount(value) {
  return String(Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.round(value))));
}
function liveBytesByTypeJson(liveBytesByType) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(liveBytesByType).sort(([, a], [, b2]) => b2 - a).map(([blobType, bytes]) => [blobType, Number(cappedCount(bytes))])
    )
  );
}
function conversationGcLevel(report) {
  if (report.outcome === "failed") return "warn";
  if (report.outcome === "skipped") {
    return report.skipReason === "unresolved-refs" ? "warn" : "info";
  }
  return report.stillOverCap ? "warn" : "info";
}
function conversationGcTelemetry(report) {
  return {
    level: conversationGcLevel(report),
    event: CONVERSATION_GC_EVENT,
    metadata: {
      trigger: brandLiteralEnum(report.trigger),
      outcome: report.outcome,
      agent_id: report.agentId,
      skip_reason: report.outcome === "skipped" ? report.skipReason : void 0,
      unresolved_proto_refs: report.outcome === "skipped" && report.unresolvedProtoRefs !== void 0 ? cappedCount(report.unresolvedProtoRefs) : void 0,
      deleted_rows: report.outcome === "collected" ? cappedCount(report.deletedRows) : void 0,
      deleted_bytes: report.outcome === "collected" ? cappedCount(report.deletedBytes) : void 0,
      live_rows: report.outcome === "collected" ? cappedCount(report.liveRows) : void 0,
      live_bytes: report.outcome === "collected" ? cappedCount(report.liveBytes) : void 0,
      live_bytes_by_type: report.outcome === "collected" ? liveBytesByTypeJson(report.liveBytesByType) : void 0,
      vacuumed: report.outcome === "collected" ? String(report.vacuumed) : void 0
    }
  };
}
