/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/structured-log-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_analytics_connect();
init_bounded();
init_cursor_inference();

// @recovered-fragment 2/2
function getHostBuiltAtMs() {
  return true ? "1790001078000" : void 0;
}
var TELEMETRY_FLUSH_TICK_MS = 3e3;
var HOST_IDENTITY_HOLD_BACKSTOP_MS = 9e4;
var MAX_HOST_LOG_LENGTH = 2048;
var MAX_ERROR_DETAIL_MESSAGE_LENGTH = 1024;
var MAX_ERROR_DETAIL_STACK_LENGTH = 4096;
var TOOL_CALL_MS_CAP = 24 * 60 * 60 * 1e3;
var SAND_AGENT_ID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function boundedAgentId(id) {
  return SAND_AGENT_ID_SHAPE.test(id) ? id : "invalid_id";
}
function cappedToolCallMs(ms2) {
  return String(Math.min(Math.max(0, Math.round(ms2)), TOOL_CALL_MS_CAP));
}
function booleanTag(value) {
  return brandLiteralEnum(value ? "true" : "false");
}
function errorDetailTags(error42, detail) {
  return {
    error_code: sandErrorWireCode(error42),
    error_message: truncateStructuredLogValue(detail.message, MAX_ERROR_DETAIL_MESSAGE_LENGTH),
    error_stack: detail.stack !== void 0 ? truncateStructuredLogValue(detail.stack, MAX_ERROR_DETAIL_STACK_LENGTH) : void 0
  };
}
var BOT_BLOCK_FAMILY_SET = new Set(SAND_BOT_BLOCK_FAMILIES);
function isBotBlockFamily(value) {
  return BOT_BLOCK_FAMILY_SET.has(value);
}
function botBlockHitFromReport(report) {
  if (!isBotBlockFamily(report.family)) return void 0;
  return {
    family: report.family,
    confidence: report.confidence,
    blockedHost: report.blockedHost,
    blockedUrl: report.blockedUrl,
    webBotAuthSigned: report.webBotAuthSigned,
    webBotAuthSignatureSource: report.webBotAuthSignatureSource
  };
}
var SandStructuredLogTelemetry = class {
  transport;
  activeTurnsByConversation = /* @__PURE__ */ new Map();
  hostBundleIdentity;
  egressIpHash;
  httpProxyName;
  constructor(options2) {
    this.httpProxyName = options2.httpProxyName ?? resolveSandHttpProxyName();
    const transportOptions = {
      key: SAND_LOG_KEY,
      platformTags: {
        client: SAND_CLIENT_TYPE,
        "client.type": SAND_CLIENT_TYPE,
        client_version: options2.backend.clientVersion,
        app_version: options2.appVersion ?? (true ? "0.58.0-pre.19" : "unknown"),
        arch: process.arch,
        platform: process.platform,
        ...options2.identityTags ?? resolveSandBoxIdentityTags()
      },
      createClient: options2.createClient ?? (() => createSandCursorBackendClient(AnalyticsService, {
        backend: options2.backend,
        getAccessToken: async (request5) => {
          try {
            return await options2.getAccessToken(request5);
          } catch (error42) {
            reportFallback("structured_log_telemetry", error42);
            return "";
          }
        },
        getTeamId: options2.getTeamId,
        getMachineId: options2.getMachineId
      })),
      polling: options2.flushPolling,
      submitDeadline: options2.submitDeadline,
      disabled: options2.disabled
    };
    this.transport = options2.holdFlushForHostBundleIdentity === true ? new StructuredLogTransport({
      ...transportOptions,
      holdForIdentity: true,
      identityHoldExpiry: options2.identityHoldExpiry
    }) : new StructuredLogTransport({
      ...transportOptions,
      holdForIdentity: false
    });
  }
  setHostBundleIdentity(identity) {
    this.hostBundleIdentity = identity;
    this.applyIdentityTags();
  }
  setEgressIpHash(ipHash) {
    this.egressIpHash = ipHash;
    const identityHoldStillArmed = this.hostBundleIdentity === void 0;
    if (!identityHoldStillArmed) this.applyIdentityTags();
  }
  setHttpProxyName(name17) {
    this.httpProxyName = name17;
  }
  getHttpProxyName() {
    return this.httpProxyName;
  }
  applyIdentityTags() {
    this.transport.setIdentityTags({
      host_bundle_version: this.hostBundleIdentity?.hostBundleVersion,
      host_built_at_ms: getHostBuiltAtMs(),
      box_store_id: this.hostBundleIdentity?.boxStoreId,
      ip_hash: this.egressIpHash
    });
  }
  startTurn(start) {
    beginTurnBotBlock({ conversationId: start.conversationId });
    const turn = new SandTurnTelemetryImpl(this, start, () => {
      if (this.activeTurnsByConversation.get(start.conversationId) === turn) {
        this.activeTurnsByConversation.delete(start.conversationId);
      }
    });
    this.activeTurnsByConversation.set(start.conversationId, turn);
    return turn;
  }
  reportToolCallError(report) {
    this.enqueue("error", TOOL_CALL_ERROR_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      tool_name: report.toolName,
      tool_call_id: report.toolCallId,
      error_class: report.errorClass,
      duration_ms: report.durationMs !== void 0 ? cappedToolCallMs(report.durationMs) : void 0,
      connector: report.connector
    });
  }
  reportToolCallStalled(report) {
    this.enqueue("warn", TOOL_CALL_STALLED_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      tool_name: report.toolName,
      tool_call_id: report.toolCallId,
      connector: report.connector,
      elapsed_ms: cappedToolCallMs(report.elapsedMs)
    });
  }
  reportToolCallStarted(report) {
    this.enqueue("info", TOOL_CALL_STARTED_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      tool_name: report.toolName,
      tool_call_id: report.toolCallId,
      surface: report.surface
    });
  }
  reportToolCallCompleted(report) {
    this.enqueue(
      report.outcome === "error" ? "error" : "info",
      TOOL_CALL_COMPLETED_EVENT,
      toolCallCompletedRow(report, "BOX")
    );
  }
  reportDynamicToolCall(report) {
    this.enqueue(report.outcome === "error" ? "error" : "info", DYNAMIC_TOOL_CALL_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      tool_name: report.toolName,
      tool_call_id: report.toolCallId,
      outcome: report.outcome,
      error_class: report.errorClass,
      duration_ms: cappedToolCallMs(report.durationMs)
    });
  }
  reportToolCallArgsRejected(report) {
    for (const row of toolCallArgsRejectedRows(report, "BOX")) {
      this.enqueue("warn", TOOL_CALL_ARGS_REJECTED_EVENT, row);
    }
  }
  reportBrowserOperation(report) {
    this.enqueue("info", BROWSER_OPERATION_EVENT, {
      operation: brandLiteralEnum(report.operation),
      outcome: brandLiteralEnum(report.outcome),
      stage: brandLiteralEnum(report.stage),
      code: brandLiteralEnum(report.code),
      duration_ms: cappedToolCallMs(report.duration_ms),
      shell_ms: report.shell_ms === void 0 ? void 0 : cappedToolCallMs(report.shell_ms),
      driver_ms: report.driver_ms === void 0 ? void 0 : cappedToolCallMs(report.driver_ms),
      connect_ms: report.connect_ms === void 0 ? void 0 : cappedToolCallMs(report.connect_ms),
      driver_screenshot_ms: report.driver_screenshot_ms === void 0 ? void 0 : cappedToolCallMs(report.driver_screenshot_ms),
      download_ms: report.download_ms === void 0 ? void 0 : cappedToolCallMs(report.download_ms),
      screenshot_ms: report.screenshot_ms === void 0 ? void 0 : cappedToolCallMs(report.screenshot_ms),
      request_id: brandedId(report.request_id),
      subagent_id: brandedId(report.subagent_id),
      tool_call_id: brandedId(report.tool_call_id),
      invocation_id: brandedId(report.invocation_id),
      attempt_id: brandedId(report.attempt_id),
      harness: report.harness,
      served_model: report.served_model,
      model_attribution: report.model_attribution,
      count_unit: report.count_unit
    });
  }
  reportComputerOperation(report) {
    this.enqueue("info", COMPUTER_OPERATION_EVENT, {
      tool: report.tool,
      action: brandLiteralEnum(report.action),
      action_mask: String(report.action_mask),
      batch_length: report.batch_length === void 0 ? void 0 : String(report.batch_length),
      outcome: report.outcome,
      stage: brandLiteralEnum(report.stage),
      code: brandLiteralEnum(report.code),
      duration_ms: cappedToolCallMs(report.duration_ms),
      request_id: brandedId(report.request_id),
      subagent_id: brandedId(report.subagent_id),
      tool_call_id: brandedId(report.tool_call_id),
      invocation_id: brandedId(report.invocation_id),
      attempt_id: brandedId(report.attempt_id),
      harness: brandLiteralEnum(report.harness),
      combined_mode: report.combined_mode,
      served_model: report.served_model,
      model_attribution: report.model_attribution,
      count_unit: report.count_unit
    });
  }
  reportMessagesTool(report) {
    const level = report.outcome === "error" ? "error" : "info";
    this.enqueue(level, APPLE_MESSAGES_TOOL_CALL_EVENT, messagesToolCallRow(report, "BOX"));
  }
  reportAgentError(report) {
    this.enqueue("error", AGENT_ERROR_EVENT, {
      source: report.source,
      conversation_id: report.conversationId,
      request_id: report.requestId,
      ...sandErrorTags(report.error)
    });
    if (report.detail !== void 0) {
      this.enqueue("error", AGENT_ERROR_DETAIL_EVENT, {
        source: report.source,
        conversation_id: report.conversationId,
        request_id: report.requestId,
        ...errorDetailTags(report.error, report.detail)
      });
    }
  }
  reportSummaryLifecycle(report) {
    this.enqueue("info", SUMMARY_LIFECYCLE_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      summary_lifecycle_id: report.summaryLifecycleId,
      phase: brandLiteralEnum(report.phase),
      summarization_model_id: report.summarizationModelId,
      main_model_id: report.mainModelId,
      summarizer_type: brandLiteralEnum(report.summarizerType),
      outcome: report.phase === "completed" ? brandLiteralEnum(report.outcome) : void 0,
      reason: report.phase === "deferred" || report.phase === "abandoned" ? brandLiteralEnum(report.reason) : void 0
    });
  }
  reportSummaryPersisted(report) {
    this.enqueue("info", SUMMARY_PERSISTED_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      summary_lifecycle_id: report.summaryLifecycleId,
      summarization_model_id: report.summarizationModelId,
      main_model_id: report.mainModelId,
      summarizer_type: report.summarizerType,
      trigger_tokens_used: report.triggerTokensUsed === void 0 ? void 0 : String(report.triggerTokensUsed),
      trigger_tokens_max: report.triggerTokensMax === void 0 ? void 0 : String(report.triggerTokensMax)
    });
  }
  reportAutoReviewApproval(report) {
    const { level, event, metadata } = autoReviewApprovalTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportAutoReviewDisplayRecheckFailed(report) {
    this.enqueue("info", AUTO_REVIEW_DISPLAY_RECHECK_FAILED_EVENT, {
      conversation_id: report.conversationId,
      surface: "computer"
    });
  }
  reportAutoReviewExpireSweepFailed(report) {
    this.enqueue("warn", AUTO_REVIEW_EXPIRE_SWEEP_FAILED_EVENT, {
      stage: report.stage,
      error_class: report.errorClass
    });
  }
  reportAgentIdentitySync(level, metadata) {
    this.enqueue(level, AGENT_IDENTITY_SYNC_EVENT, metadata);
  }
  reportBoxStoreSyncCycle(level, metadata) {
    this.enqueue(level, BOX_STORE_SYNC_EVENT, metadata);
  }
  reportBoxStoreDbCapture(level, metadata) {
    this.enqueue(level, BOX_STORE_DB_CAPTURE_EVENT, metadata);
  }
  reportBoxStoreManifestConflict(level, metadata) {
    this.enqueue(level, BOX_STORE_MANIFEST_CONFLICT_EVENT, metadata);
  }
  reportWorkingStateExport(report) {
    const telemetry = workingStateExportTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportWorkingStateWarm(report) {
    const telemetry = workingStateWarmTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportChromeSessionStage(level, metadata) {
    this.enqueue(level, CHROME_SESSION_STAGE_EVENT, metadata);
  }
  reportCookieOriginApproval(report) {
    const { level, event, metadata } = cookieOriginApprovalTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportCredentialFillOutcome(report) {
    const reason = report.fillRefusalReason ?? report.reason;
    this.enqueue(report.outcome === "success" ? "info" : "warn", CREDENTIAL_FILL_OUTCOME_EVENT, {
      operation: brandLiteralEnum(report.operation),
      outcome: brandLiteralEnum(report.outcome),
      reason: brandLiteralEnum(reason),
      event: brandLiteralEnum(report.event),
      approval_mode: report.approvalMode === void 0 ? void 0 : brandLiteralEnum(report.approvalMode),
      submit_requested: report.submitRequested === void 0 ? void 0 : booleanTag(report.submitRequested),
      in_form: report.inForm === void 0 ? void 0 : booleanTag(report.inForm),
      harness: "box",
      ...reason === "submit-failed" ? sandErrorTags(SandError.credentialSubmitFailed()) : {}
    });
  }
  reportTranscriptPublish(level, metadata) {
    this.enqueue(level, TRANSCRIPT_PUBLISH_EVENT, metadata);
  }
  reportSessionDiagnostic(report) {
    const telemetry = sessionDiagnosticTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportConversationGc(report) {
    const telemetry = conversationGcTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportSearchIndexHealth(report) {
    const telemetry = searchIndexHealthTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportHostEventBusFailure(report) {
    const telemetry = hostEventBusTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportHostExtensionDiagnostic(diagnostic) {
    const telemetry = hostExtensionDiagnosticTelemetry(diagnostic);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportExperimentsDiagnostic(diagnostic) {
    const telemetry = experimentsDiagnosticTelemetry(diagnostic);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportHostDiagnostic(diagnostic) {
    const telemetry = hostDiagnosticTelemetry(diagnostic);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportHostStartup(metadata) {
    const entry = hostStartupTelemetry(metadata, getHostBuiltAtMs());
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportHostLifecycle(report) {
    const entry = hostLifecycleTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportHostEventLoop(report) {
    const entry = eventLoopWindowTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportBoxDiskPressure(report) {
    const event = diskPressureTelemetry(report);
    this.enqueue(event.level, "sand.box.disk_pressure", event.metadata);
  }
  reportMcpAuthCleanup(outcome, removedCount) {
    this.enqueue(outcome === "error" ? "warn" : "info", MCP_AUTH_CLEANUP_EVENT, {
      outcome,
      removed_count: String(removedCount)
    });
  }
  reportMcpDiscoveryFailed(failure2) {
    this.enqueue("warn", MCP_DISCOVERY_FAILED_EVENT, {
      error_class: failure2.errorClass,
      elapsed_ms: String(Math.round(failure2.elapsedMs)),
      served_stale: String(failure2.servedStale)
    });
  }
  reportLocalExecRefused(report) {
    const entry = localExecRefusedTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportLocalExecProvider(report) {
    const entry = localExecProviderTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportLocalExecFailed(report) {
    const entry = localExecFailedTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportWebAuthnProxy(report) {
    const entry = webauthnProxyTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportWebAuthnProvider(report) {
    const entry = webauthnProviderTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportConnectorAuth(report) {
    const { level, metadata } = connectorAuthTelemetry(report, "host");
    this.enqueue(level, CONNECTOR_AUTH_EVENT, metadata);
  }
  reportLocalToolPermissionStrandedRetirement() {
    this.enqueue("warn", CLIENT_RESOURCE_EVENT, {
      domain: "permissions",
      operation: "resolveLocalToolPermission",
      state: "failed",
      failure_code: "permissions/stranded-ask-retired",
      boundary: "host",
      retry_owner: "none"
    });
  }
  reportMemorySynthesis(report) {
    const entry = memorySynthesisTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportSkillPublishEdgeFailed(report) {
    this.enqueue("warn", SKILL_PUBLISH_EDGE_FAILED_EVENT, {
      stage: report.stage,
      error_class: report.errorClass
    });
  }
  reportPluginSkillsSync(report) {
    this.enqueue(report.outcome === "failed" ? "warn" : "info", PLUGIN_SKILLS_SYNC_EVENT, {
      trigger: brandLiteralEnum(report.trigger),
      outcome: report.outcome,
      changed: report.changed === void 0 ? void 0 : String(report.changed),
      skill_count: report.skillCount === void 0 ? void 0 : String(report.skillCount),
      error_class: report.errorClass,
      duration_ms: String(Math.round(report.durationMs))
    });
  }
  reportTeachRecordingCapStopFailed(failure2) {
    this.enqueue("warn", TEACH_RECORDING_CAP_STOP_FAILED_EVENT, {
      error_class: failure2.errorClass
    });
  }
  reportTeachRecordingStartFailed(failure2) {
    this.enqueue("warn", TEACH_RECORDING_START_FAILED_EVENT, {
      kind: failure2.kind,
      error_class: failure2.errorClass,
      window_index: failure2.windowIndex === void 0 ? void 0 : String(failure2.windowIndex),
      entry_point: failure2.entryPoint
    });
  }
  reportBoxCopyIn(level, metadata) {
    this.enqueue(level, BOX_COPY_IN_EVENT, metadata);
  }
  reportBoxRecreateDecided(metadata) {
    this.enqueue("info", BOX_RECREATE_DECIDED_EVENT, metadata);
  }
  reportInferenceCredentialRenewal(level, metadata) {
    this.enqueue(level, INFERENCE_CREDENTIAL_RENEWAL_EVENT, metadata);
  }
  reportDaemonPing(report) {
    const entry = daemonPingTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  reportBoxBootStage(report) {
    this.enqueueBoxInfrastructureEvent({
      kind: "boot_stage",
      ...report
    });
  }
  reportBoxBootFailure(report) {
    this.enqueueBoxInfrastructureEvent({
      kind: "boot_failure",
      ...report
    });
  }
  reportEgressTunnel(report) {
    this.enqueueBoxInfrastructureEvent({
      kind: "egress_tunnel",
      ...report
    });
  }
  reportHostBootFetch(report) {
    this.enqueueBoxInfrastructureEvent({
      kind: "host_boot_fetch",
      ...report
    });
  }
  reportBoxImageCheck(report) {
    const entry = boxImageCheckTelemetry(report);
    this.enqueue(entry.level, entry.event, entry.metadata);
  }
  async reportBoxBootStageConfirmed(report) {
    const entry = boxInfrastructureTelemetry({ kind: "boot_stage", ...report });
    return await this.transport.shipConfirmed(entry.level, entry.event, entry.metadata);
  }
  reportExecDaemonRestart(report) {
    this.enqueueBoxInfrastructureEvent({
      kind: "exec_daemon_restart",
      ...report
    });
  }
  reportSupervisorRestart(report) {
    this.enqueueBoxInfrastructureEvent({
      kind: "supervisor_restart",
      ...report
    });
  }
  reportGatewayCommandError(level, metadata) {
    this.enqueue(level, GATEWAY_COMMAND_ERROR_EVENT, metadata);
  }
  reportGatewayCommandTiming(level, metadata) {
    this.enqueue(level, GATEWAY_COMMAND_TIMING_EVENT, metadata);
  }
  reportAutomationRun(report) {
    const { level, event, metadata } = automationRunTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportAutomationFireDropped(report) {
    const { level, event, metadata } = automationFireDroppedTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportAutomationAgentGoneRecovered(report) {
    const { level, event, metadata } = automationAgentGoneRecoveredTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportAutomationShadowPrune(report) {
    const { level, event, metadata } = automationShadowPruneTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportAutomationLifecycle(report) {
    this.enqueue("info", AUTOMATION_LIFECYCLE_EVENT, {
      conversation_id: report.conversationId,
      automation_id: report.automationId,
      action: report.action,
      source: report.source,
      provenance: report.provenance,
      is_enabled: String(report.isEnabled),
      template_setup_turn: String(report.templateSetupTurn),
      trigger_type: report.triggerType,
      scheduled_fires_next_7_days: report.scheduledFiresNext7Days != null ? String(report.scheduledFiresNext7Days) : void 0,
      fires_on_weekend: report.firesOnWeekend != null ? String(report.firesOnWeekend) : void 0,
      fires_overnight: report.firesOvernight != null ? String(report.firesOvernight) : void 0,
      age_ms: String(report.ageMs),
      recorded_run_count: String(report.recordedRunCount)
    });
  }
  reportTurnInterrupt(report) {
    const telemetry = turnInterruptTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportAgentDelete(report) {
    this.enqueue("info", AGENT_DELETE_EVENT, {
      agent_count: String(report.agentCount),
      deleted_active: String(report.deletedActive),
      total_ms: String(Math.round(report.totalMs)),
      drain_ms: String(Math.round(report.drainMs)),
      disk_delete_ms: String(Math.round(report.diskDeleteMs)),
      successor_ms: String(Math.round(report.successorMs)),
      box_release_ms: String(Math.round(report.boxReleaseMs))
    });
  }
  reportTurnAwait(report) {
    const telemetry = turnAwaitTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportWedgedRunReap(report) {
    const telemetry = wedgedRunReapTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportTurnRetry(report) {
    if (report.outcome === "retried") {
      this.activeTurnsByConversation.get(report.conversationId)?.noteRetry(report);
    }
    const telemetry = turnRetryTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportUserMessageReceived(report) {
    const telemetry = userMessageReceivedTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportClosingSendNudge(report) {
    const telemetry = closingSendNudgeTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportSubagentRevival(report) {
    const telemetry = subagentRevivalTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportSubagentStalled(report) {
    this.enqueue("warn", SUBAGENT_STALLED_EVENT, {
      conversation_id: report.parentAgentId,
      subagent_agent_id: report.subagentAgentId,
      subagent_type: report.subagentType,
      elapsed_ms: cappedToolCallMs(report.elapsedMs)
    });
  }
  reportGroupMemberTurnOutcome(report) {
    this.enqueue(report.outcome === "error" ? "warn" : "info", TURN_MEMBER_OUTCOME_EVENT, {
      conversation_id: report.conversationId,
      member_conversation_id: boundedAgentId(report.memberConversationId),
      member_kind: report.memberKind,
      outcome: report.outcome,
      ...report.error !== void 0 ? sandErrorTags(report.error) : {}
    });
  }
  reportShellRevival(report) {
    const telemetry = shellRevivalTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportTtft(report) {
    const telemetry = ttftTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportSendDispatch(report) {
    const telemetry = sendDispatchTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportQueueAccepted(report) {
    const telemetry = queueAcceptedTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportQueueDequeued(report) {
    const telemetry = queueDequeuedTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportQueueWatchdog(report) {
    const telemetry = queueWatchdogTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportAckObligation(report) {
    const telemetry = ackObligationTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportPendingWake(report) {
    const telemetry = pendingWakeTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportTurnUsage(report) {
    const telemetry = turnUsageTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
  }
  reportTurnEmptyDelivery(report) {
    const { level, event, metadata } = turnEmptyDeliveryTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportPromptPrefixDiff(report) {
    const { level, event, metadata } = turnPrefixDiffTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportJournalOutcome(report) {
    const { level, event, metadata } = journalOutcomeTelemetry(report);
    this.enqueue(level, event, metadata);
  }
  reportComputerUseUsage(report) {
    const telemetry = computerUseUsageTelemetry(report);
    this.enqueue(telemetry.level, telemetry.event, telemetry.metadata);
    if (report.subagentType === "browserUse" || report.subagentType === "computerUse") {
      this.enqueue(
        telemetry.level,
        COMPUTER_USE_SESSION_EVENT,
        computerUseSessionMetadata(
          {
            ...report,
            subagentType: report.subagentType,
            toolCallId: report.toolCallId ?? ""
          },
          "box",
          report.outcome,
          report.abortReason ?? "unknown",
          report.durationMs
        )
      );
    }
  }
  reportComputerUseDispatch(report) {
    if (report.resume === true) return;
    this.enqueue("info", COMPUTER_USE_DISPATCH_EVENT, computerUseDispatchMetadata(report, "box"));
  }
  reportAgentOpen(report) {
    this.enqueue("info", AGENT_OPEN_EVENT, {
      conversation_id: report.conversationId,
      duration_ms: String(report.durationMs),
      entry_count: String(report.entryCount),
      was_active: String(report.wasActive)
    });
  }
  reportHostCrash(kind) {
    this.enqueue("error", HOST_CRASH_EVENT, { kind });
  }
  async reportHostProcessExitConfirmed(marker17) {
    return await this.transport.shipConfirmed("error", HOST_CRASH_EVENT, {
      ...hostCrashMarkerMetadata(marker17),
      ...sandErrorTags(SandError.unregistered())
    });
  }
  reportInvariantViolation({ name: name17 }) {
    this.enqueue("error", HOST_INVARIANT_VIOLATION_EVENT, { name: name17 });
  }
  reportPolicyStopped(stop) {
    const { level, metadata } = policyStoppedTelemetry(stop, "host");
    this.enqueue(level, POLICY_STOPPED_EVENT, metadata);
  }
  reportHostUpgrade(metadata) {
    this.enqueue(metadata.outcome === "failed" ? "warn" : "info", HOST_UPGRADE_EVENT, metadata);
  }
  reportHttpProxyNameChanged(report) {
    this.enqueue(
      report.rejected || !report.persisted ? "warn" : "info",
      HTTP_PROXY_NAME_CHANGED_EVENT,
      {
        previous_http_proxy_name: brandedId(report.previous),
        http_proxy_name: brandedId(report.applied),
        persisted: String(report.persisted),
        rejected: String(report.rejected)
      }
    );
  }
  reportUpgradeResume(report) {
    this.enqueue(
      report.outcome === "identity_refresh_failed" || report.outcome === "migration_abandoned" ? "warn" : "info",
      UPGRADE_RESUME_EVENT,
      {
        trigger: report.trigger,
        outcome: report.outcome,
        operation_id: report.operationId,
        count: report.count === void 0 ? void 0 : String(report.count),
        duration_ms: String(report.durationMs)
      }
    );
  }
  async reportHostUpgradeConfirmed(metadata) {
    return await this.transport.shipConfirmed(
      metadata.outcome === "failed" ? "warn" : "info",
      HOST_UPGRADE_EVENT,
      metadata
    );
  }
  reportBoxHelp(report) {
    this.enqueue("info", BOX_HELP_EVENT, {
      conversation_id: report.conversationId,
      turn_id: brandedId(report.turnId),
      subagent_id: brandedId(report.subagentId),
      snapshot_captured: String(report.snapshotCaptured),
      "meta.reason": report.reason
    });
  }
  reportAgentLoopDetected(report) {
    this.enqueue("info", AGENT_LOOP_DETECTED_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      mode: report.mode,
      loop_kind: report.loopKind,
      repetitions: String(report.repetitions),
      period: report.period === void 0 ? void 0 : String(report.period),
      is_reoccurrence: String(report.isReoccurrence),
      evidence_fingerprint: brandedId(report.evidenceFingerprint),
      mitigation: report.mitigation
    });
  }
  reportAgentLoopMitigation(report) {
    this.enqueue("info", AGENT_LOOP_MITIGATION_EVENT, {
      conversation_id: report.conversationId,
      request_id: report.requestId,
      mode: report.mode,
      loop_kind: report.loopKind,
      evidence_fingerprint: brandedId(report.evidenceFingerprint),
      mitigation: report.mitigation,
      stage: report.stage
    });
  }
  reportBotBlock(report) {
    const hit = botBlockHitFromReport(report);
    if (hit !== void 0) {
      noteTurnBotBlock({
        conversationId: report.conversationId,
        hit,
        turnId: report.turnId
      });
    }
    this.enqueue("warn", BOT_BLOCK_EVENT, {
      conversation_id: report.conversationId,
      subagent_id: brandedId(report.subagentId),
      family: report.family,
      confidence: report.confidence
    });
    this.enqueue("warn", BOT_BLOCK_DETAIL_EVENT, {
      conversation_id: report.conversationId,
      subagent_id: brandedId(report.subagentId),
      family: report.family,
      blocked_host: report.blockedHost,
      blocked_url: report.blockedUrl,
      web_bot_auth_signed: report.webBotAuthSigned === void 0 ? void 0 : String(report.webBotAuthSigned),
      web_bot_auth_signature_source: report.webBotAuthSignatureSource,
      wall_episode_id: brandedId(report.wallEpisodeId),
      http_proxy_name: brandedId(this.httpProxyName)
    });
  }
  reportBotBlockResolved(report) {
    this.enqueue("info", BOT_BLOCK_RESOLVED_EVENT, {
      conversation_id: report.conversationId,
      subagent_id: brandedId(report.subagentId),
      family: isBotBlockFamily(report.family) ? brandLiteralEnum(report.family) : void 0,
      blocked_host: brandedId(report.blockedHost),
      duration_ms: String(Math.min(report.durationMs, 216e5)),
      wall_episode_id: brandedId(report.wallEpisodeId),
      resolution_kind: brandLiteralEnum(report.resolutionKind),
      resolved_same_turn: report.resolvedSameTurn === void 0 ? void 0 : String(report.resolvedSameTurn),
      http_proxy_name: brandedId(this.httpProxyName)
    });
  }
  reportSiteVisited(report) {
    this.enqueue("info", SITE_VISITED_EVENT, {
      conversation_id: report.conversationId,
      subagent_id: brandedId(report.subagentId),
      request_id: report.requestId,
      root_parent_request_id: report.rootParentRequestId,
      web_bot_auth_signed: report.webBotAuthSigned === void 0 ? void 0 : String(report.webBotAuthSigned)
    });
    this.enqueue("info", SITE_VISITED_DETAIL_EVENT, {
      conversation_id: report.conversationId,
      subagent_id: brandedId(report.subagentId),
      request_id: report.requestId,
      root_parent_request_id: report.rootParentRequestId,
      visited_host: report.siteBucket,
      web_bot_auth_signed: report.webBotAuthSigned === void 0 ? void 0 : String(report.webBotAuthSigned),
      wall_episode_id: brandedId(report.wallEpisodeId),
      http_proxy_name: brandedId(this.httpProxyName)
    });
  }
  reportHostLog(level, line, metadata) {
    if (level === "warn" || level === "error") {
      process.stderr.write(`${line}
`);
    } else {
      process.stdout.write(`${line}
`);
    }
    this.enqueue(level, HOST_LOG_EVENT, {
      text: truncateStructuredLogValue(line, MAX_HOST_LOG_LENGTH),
      ...metadata
    });
  }
  reportBoxLogBatch(records2, onEntrySettled) {
    for (const record2 of records2) {
      switch (record2.kind) {
        case "log":
          this.enqueue(
            "info",
            BOX_LOG_EVENT,
            {
              source: record2.source,
              text: truncateStructuredLogValue(record2.line, MAX_HOST_LOG_LENGTH)
            },
            onEntrySettled
          );
          break;
        case "infrastructure":
          this.enqueueBoxInfrastructureEvent(record2.event, onEntrySettled);
          break;
        default: {
          const _exhaustive = record2;
          return _exhaustive;
        }
      }
    }
  }
  reportBoxLogShip(report, onSettled) {
    const telemetry = boxLogShipTelemetry(report);
    this.enqueue(telemetry.level, telemetry.message, telemetry.metadata, onSettled);
  }
  reportDesktopHealth(level, metadata) {
    this.enqueue(level, DESKTOP_HEALTH_EVENT, metadata);
  }
  emitTurnEvent(event, metadata) {
    this.enqueue("info", event, metadata);
  }
  setFlushTickListener(listener) {
    this.transport.setFlushTickListener(listener);
  }
  async dispose() {
    await this.transport.dispose();
  }
  enqueueBoxInfrastructureEvent(event, onSettled) {
    const entry = boxInfrastructureTelemetry(event);
    this.enqueue(entry.level, entry.event, entry.metadata, onSettled);
  }
  enqueue(level, message, metadata, onSettled) {
    this.transport.enqueue(level, message, metadata, onSettled);
  }
};
var SandTurnTelemetryImpl = class {
  telemetry;
  start;
  onFinalized;
  startedAt = Date.now();
  model;
  requestId;
  startEmitted = false;
  finalized = false;
  retryCount = 0;
  backoffTotalMs = 0;
  retryCause;
  constructor(telemetry, start, onFinalized) {
    this.telemetry = telemetry;
    this.start = start;
    this.onFinalized = onFinalized;
    this.model = start.model;
    if (this.model !== void 0) this.emitStart();
  }
  noteRetry(report) {
    if (this.finalized) return;
    this.retryCount += 1;
    this.backoffTotalMs += report.delayMs ?? 0;
    this.retryCause = sandErrorWireCode(report.error);
  }
  setModel(modelId) {
    if (modelId.length === 0) return;
    this.model = modelId;
    this.emitStart();
  }
  setRequestId(requestId2) {
    if (this.requestId === void 0 && requestId2.length > 0) {
      this.requestId = requestId2;
    }
  }
  finalize(outcome, error42, detail) {
    if (this.finalized) return;
    this.finalized = true;
    this.onFinalized();
    this.emitStart();
    const finalOutcome = error42 !== void 0 ? "error" : outcome;
    const adjusted = adjustTurnOutcomeForBotBlock({
      conversationId: this.start.conversationId,
      outcome: finalOutcome
    });
    const metadata = {
      ...this.baseTags(),
      outcome: finalOutcome,
      duration_ms: String(Date.now() - this.startedAt)
    };
    if (this.retryCount > 0) {
      metadata.retry_count = String(this.retryCount);
      metadata.backoff_total_ms = String(Math.round(this.backoffTotalMs));
      metadata.retry_cause = this.retryCause;
    }
    if (adjusted.errorType === BOT_BLOCK_ERROR_TYPE) {
      metadata.error_type = brandLiteralEnum(BOT_BLOCK_ERROR_TYPE);
    }
    if (error42 !== void 0) {
      Object.assign(metadata, sandErrorTags(error42));
    }
    this.telemetry.emitTurnEvent(TURN_OUTCOME_EVENT, metadata);
    if (error42 !== void 0 && detail !== void 0) {
      this.telemetry.emitTurnEvent(TURN_OUTCOME_DETAIL_EVENT, {
        ...this.baseTags(),
        ...errorDetailTags(error42, detail)
      });
    }
    consumeTurnBotBlock(this.start.conversationId);
  }
  baseTags() {
    return {
      turn_type: this.start.turnType,
      conversation_id: this.start.conversationId,
      request_id: this.requestId,
      model_intent: this.model
    };
  }
  emitStart() {
    if (this.startEmitted) return;
    this.startEmitted = true;
    this.telemetry.emitTurnEvent(TURN_START_EVENT, this.baseTags());
  }
};

