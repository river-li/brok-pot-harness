function sendDispatchTelemetry(report) {
  return {
    level: "info",
    event: SEND_DISPATCH_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      send_dispatch_ms: report.dispatchMs !== void 0 ? String(Math.round(report.dispatchMs)) : void 0,
      send_dispatch_host_ms: String(Math.round(report.hostDispatchMs)),
      skew: String(report.skew),
      skew_reason: report.skewReason,
      skew_bucket: report.skewBucket,
      is_fork: String(report.isFork),
      model_id: report.modelId,
      trace_id: report.traceId,
      span_id: report.spanId
    }
  };
}
function queueAcceptedTelemetry(report) {
  return {
    level: "info",
    event: QUEUE_ACCEPTED_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      lane: report.lane,
      source: report.source,
      position: String(report.position),
      depth_user: String(report.depthUser),
      depth_agent: String(report.depthAgent),
      depth_background: String(report.depthBackground),
      has_active: String(report.hasActive)
    }
  };
}
function queueDequeuedTelemetry(report) {
  return {
    level: "info",
    event: QUEUE_DEQUEUED_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      lane: report.lane,
      source: report.source,
      queue_wait_ms: String(Math.round(report.queueWaitMs)),
      accepted_to_run_ms: report.acceptedToRunMs !== void 0 ? String(Math.round(report.acceptedToRunMs)) : void 0,
      jumped_background: String(report.jumpedBackground),
      depth_user: String(report.depthUser),
      depth_agent: String(report.depthAgent),
      depth_background: String(report.depthBackground)
    }
  };
}
function queueWatchdogTelemetry(report) {
  return {
    level: report.stage === "late_settle" ? "info" : "warn",
    event: QUEUE_WATCHDOG_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      stage: report.stage,
      active_lane: report.activeLane,
      active_source: report.activeSource,
      active_runtime_ms: String(Math.round(report.activeRuntimeMs)),
      waiting_user_age_ms: report.waitingUserAgeMs !== void 0 ? String(Math.round(report.waitingUserAgeMs)) : void 0,
      interrupted: report.interrupted !== void 0 ? String(report.interrupted) : void 0
    }
  };
}
function ackObligationTelemetry(report) {
  return {
    level: report.outcome === "lost" ? "warn" : "info",
    event: ACK_OBLIGATION_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      outcome: report.outcome,
      age_ms: report.ageMs !== void 0 ? String(Math.round(report.ageMs)) : void 0,
      coalesced_count: report.coalescedCount !== void 0 ? String(report.coalescedCount) : void 0,
      redrive_attempts: report.redriveAttempts !== void 0 ? String(report.redriveAttempts) : void 0,
      time_to_first_visible_ack_ms: report.timeToFirstVisibleAckMs !== void 0 ? String(Math.round(report.timeToFirstVisibleAckMs)) : void 0,
      interrupt_to_replacement_ack_ms: report.interruptToReplacementAckMs !== void 0 ? String(Math.round(report.interruptToReplacementAckMs)) : void 0,
      reason: report.reason
    }
  };
}
function pendingWakeTelemetry(report) {
  return {
    level: report.outcome === "persist_failed" || report.outcome === "rearm_failed" || report.outcome === "pruned" || report.outcome === "dropped" ? "warn" : "info",
    event: PENDING_WAKE_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      outcome: report.outcome,
      kind: report.kind,
      work_id: report.workId,
      age_ms: report.ageMs !== void 0 ? String(Math.round(report.ageMs)) : void 0,
      reason: report.reason,
      quiet_origin: report.isQuietOrigin != null ? String(report.isQuietOrigin) : void 0
    }
  };
}
