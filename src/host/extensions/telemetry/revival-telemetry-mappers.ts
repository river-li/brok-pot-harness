function subagentRevivalTelemetry(report) {
  return {
    level: report.outcome === "dropped" && report.reason !== "agent_deleted" ? "warn" : "info",
    event: SUBAGENT_REVIVAL_EVENT,
    metadata: {
      conversation_id: report.parentAgentId,
      outcome: report.outcome,
      completion_count: String(report.completionCount),
      subagent_type: report.subagentType,
      subagent_agent_id: report.subagentAgentId,
      reason: report.reason,
      sent_message_count: report.sentMessageCount != null ? String(report.sentMessageCount) : void 0,
      quiet_origin: report.isQuietOrigin != null ? String(report.isQuietOrigin) : void 0
    }
  };
}
function shellRevivalTelemetry(report) {
  return {
    level: report.outcome === "dropped" && report.reason !== "agent_gone" ? "warn" : "info",
    event: SHELL_REVIVAL_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      outcome: report.outcome,
      completion_count: String(report.completionCount),
      sent_message_count: report.sentMessageCount != null ? String(report.sentMessageCount) : void 0,
      quiet_origin: report.isQuietOrigin != null ? String(report.isQuietOrigin) : void 0,
      reason: report.reason
    }
  };
}
