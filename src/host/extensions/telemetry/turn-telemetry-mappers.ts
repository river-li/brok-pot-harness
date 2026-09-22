/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/turn-telemetry-mappers.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
function usageTokenTags(usage) {
  if (usage == null) return {};
  return {
    input_tokens: String(usage.inputTokens),
    output_tokens: String(usage.outputTokens),
    cache_read_tokens: String(usage.cacheReadTokens),
    cache_write_tokens: String(usage.cacheWriteTokens),
    reasoning_tokens: usage.reasoningTokens != null ? String(usage.reasoningTokens) : void 0,
    total_input_tokens: String(totalInputTokens(usage))
  };
}
function turnInterruptTelemetry(report) {
  return {
    level: "info",
    event: TURN_INTERRUPT_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      reason: report.reason,
      had_active_run: String(report.hadActiveRun),
      was_in_flight: String(report.wasInFlight)
    }
  };
}
function wedgedRunReapTelemetry(report) {
  return {
    level: "warn",
    event: TURN_WEDGED_REAP_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      source: report.source,
      in_flight_count: String(report.inFlightCount),
      paused_for_ms: String(Math.round(report.pausedForMs))
    }
  };
}
function turnAwaitTelemetry(report) {
  return {
    level: "info",
    event: TURN_AWAIT_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      block_until_ms: String(report.blockUntilMs),
      outcome: report.outcome,
      await_index: String(report.awaitIndex)
    }
  };
}
function privacyModeRetryErrorProjection(error42) {
  const code = sandErrorWireCode(error42);
  const connectCode = sandErrorTags(error42).connect_code;
  const errorType = connectCode === void 0 ? SAND_ERROR_DEFINITIONS[code].name : "connect_error";
  return {
    error_type: brandLiteralEnum(errorType),
    error_code: brandedConnectCode(connectCode),
    cause: brandLiteralEnum(code)
  };
}
function turnRetryTelemetry(report) {
  return {
    level: report.outcome === "retried" ? "info" : "warn",
    event: TURN_RETRY_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      outcome: report.outcome,
      attempt: String(report.attempt),
      max_attempts: String(report.maxAttempts),
      ...privacyModeRetryErrorProjection(report.error),
      delay_ms: report.delayMs != null ? String(Math.round(report.delayMs)) : void 0,
      server_paced: report.serverPaced != null ? String(report.serverPaced) : void 0
    }
  };
}
function userMessageReceivedTelemetry(report) {
  return {
    level: "info",
    event: USER_MESSAGE_RECEIVED_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      was_in_flight: String(report.wasInFlight)
    }
  };
}
function closingSendNudgeTelemetry(report) {
  return {
    level: !report.delivered && !report.aborted ? "warn" : "info",
    event: CLOSING_SEND_NUDGE_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      delivered: String(report.delivered),
      sent_message_count: String(report.sentMessageCount),
      aborted: String(report.aborted)
    }
  };
}
function ttftTelemetry(report) {
  return {
    level: "info",
    event: TTFT_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      ttft_ms: report.ttftMs !== void 0 ? String(Math.round(report.ttftMs)) : void 0,
      skew: String(report.skew),
      skew_reason: report.skewReason,
      chunk_type: report.chunkType,
      is_fork: String(report.isFork),
      model_id: report.modelId,
      trace_id: report.traceId,
      span_id: report.spanId
    }
  };
}
function turnUsageTelemetry(report) {
  const usage = report.usage;
  return {
    level: "info",
    event: TURN_USAGE_EVENT,
    metadata: {
      schema_version: TURN_USAGE_SCHEMA_VERSION,
      conversation_id: report.conversationId,
      source: report.source,
      request_id: report.requestId,
      has_request_id: String(report.requestId != null),
      request_id_count: String(report.requestIdCount),
      turn_ended_seq: String(report.turnEndedSeq),
      has_usage: String(usage != null),
      ...usageTokenTags(usage)
    }
  };
}
function computerUseUsageTelemetry(report) {
  const usage = report.usage;
  return {
    level: report.outcome === "error" ? "warn" : "info",
    event: COMPUTER_USE_USAGE_EVENT,
    metadata: {
      schema_version: "1",
      parent_agent_id: report.parentAgentId,
      subagent_agent_id: report.subagentAgentId,
      subagent_type: report.subagentType,
      request_id: report.subagentRequestId,
      model_id: report.modelId,
      outcome: report.outcome,
      duration_ms: String(Math.round(report.durationMs)),
      tool_call_count: String(report.toolCallCount),
      turn_ended_count: String(report.turnEndedCount),
      has_usage: String(usage != null),
      ...usageTokenTags(usage),
      ...report.outcome === "error" ? sandErrorTags(report.error) : {}
    }
  };
}
function boundedPrefixChanges(changed) {
  const joined = changed.join("|");
  return joined.length <= 128 ? joined : `${changed.length}_changes`;
}
function turnPrefixDiffTelemetry(report) {
  return {
    level: "info",
    event: TURN_PREFIX_DIFF_EVENT,
    metadata: {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      call_index_in_turn: String(report.callIndexInTurn),
      request_source: report.requestSource,
      previous_request_source: report.previousRequestSource,
      inference_reason: report.inferenceReason,
      compaction_epoch: String(report.compactionEpoch),
      compared_to_previous_turn: String(report.comparedToPreviousTurn),
      compaction_advanced: String(report.compactionAdvanced),
      changed: brandedId(boundedPrefixChanges(report.changed)),
      changed_tools: report.changedTools !== void 0 ? brandedId(boundedPrefixChanges(report.changedTools)) : void 0,
      gap_ms_since_previous: report.gapMsSincePrevious !== void 0 ? String(report.gapMsSincePrevious) : void 0,
      system_sha: brandedId(report.systemSha),
      tools_sha: brandedId(report.toolsSha),
      tool_count: String(report.toolCount),
      cache_read_tokens: report.cacheReadTokens !== void 0 ? String(report.cacheReadTokens) : void 0,
      input_tokens: report.inputTokens !== void 0 ? String(report.inputTokens) : void 0
    }
  };
}

