init_bounded();
var AUTOMATION_LATE_FIRE_THRESHOLD_MS = 5 * 6e4;
var AUTOMATION_RUN_EVENT = "sand.automation.run";
var AUTOMATION_FIRE_DROPPED_EVENT = "sand.automation.fire_dropped";
function automationRunTelemetry(report) {
  const isLate = report.latenessMs != null && report.latenessMs >= AUTOMATION_LATE_FIRE_THRESHOLD_MS;
  return {
    level: report.outcome === "ok" && !isLate ? "info" : "warn",
    event: AUTOMATION_RUN_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      automation_id: report.automationId,
      trigger: report.trigger,
      outcome: report.outcome,
      is_group: String(report.isGroup),
      run_as_subagent: String(report.runAsSubagent),
      parent_wake_requested: report.runAsSubagent ? String(report.parentWakeRequested) : void 0,
      duration_ms: String(report.durationMs),
      lateness_ms: report.latenessMs != null ? String(report.latenessMs) : void 0,
      scheduled_for_ms: report.scheduledForMs != null ? String(report.scheduledForMs) : void 0,
      late: report.latenessMs != null ? String(isLate) : void 0,
      sent_message_count: report.sentMessageCount != null ? String(report.sentMessageCount) : void 0,
      event_batch_size: report.eventBatchSize != null ? String(report.eventBatchSize) : void 0
    }
  };
}
function automationFireDroppedTelemetry(report) {
  return {
    level: "warn",
    event: AUTOMATION_FIRE_DROPPED_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      trigger: report.trigger,
      reason: report.reason,
      scheduled_for_ms: report.scheduledForMs != null ? String(report.scheduledForMs) : void 0,
      lateness_ms: report.latenessMs != null ? String(report.latenessMs) : void 0,
      error_type: brandedErrorClass(report.errorType),
      error_code: brandedErrorClass(report.errorCode),
      run_uuid: brandedId(report.runUuid),
      fire_age_ms: report.fireAgeMs != null ? String(report.fireAgeMs) : void 0,
      has_definition_revision: report.hasDefinitionRevision != null ? String(report.hasDefinitionRevision) : void 0,
      box_uptime_ms: report.boxUptimeMs != null ? String(report.boxUptimeMs) : void 0
    }
  };
}
function automationAgentGoneRecoveredTelemetry(report) {
  return {
    level: "warn",
    event: AUTOMATION_AGENT_GONE_RECOVERED_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      trigger: report.trigger,
      run_uuid: brandedId(report.runUuid),
      ms_since_first_agent_gone: String(report.msSinceFirstAgentGone),
      agent_gone_fire_count: String(report.agentGoneFireCount),
      enforced: String(report.enforced)
    }
  };
}
