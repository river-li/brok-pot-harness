/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/runner-registry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_invariant();

// @recovered-fragment 2/2
var RunnerRegistry = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  runners = /* @__PURE__ */ new Map();
  activeGroupMemberRunners = /* @__PURE__ */ new Map();
  subagentOwnership = new SubagentOwnershipRegistry(
    (session) => this.tm.disposed || this.tm.sessions.deletedAgentIds.has(session.id),
    (session) => void this.tm.runLifecycle.retireSession(session)
  );
  interruptWedgedRunForWatchdog(agentId) {
    return this.interruptRun(
      agentId,
      "run-queue watchdog: releasing a wedged predecessor",
      "watchdog"
    );
  }
  interruptRunForUpdateEscape(agentId) {
    const reason = "user stop: unblocking the computer update";
    const hadActiveRun = this.interruptRun(agentId, reason, "update_escape");
    void this.subagentOwnership.abortAndDrain(reason, agentId);
    return hadActiveRun;
  }
  interruptRun(agentId, reason, report) {
    const wasInFlight = this.tm.runLifecycle.runningAgentIds().has(agentId);
    const hadActiveGroupMemberRun = this.activeGroupMemberRunners.get(agentId)?.interrupt(reason) ?? false;
    const hadActiveRun = (this.runners.get(agentId)?.interrupt(reason) ?? false) || hadActiveGroupMemberRun;
    this.tm.telemetry.reportTurnInterrupt({
      conversationId: agentId,
      reason: report,
      hadActiveRun,
      wasInFlight
    });
    return hadActiveRun;
  }
  attachRunner(runner) {
    this.tm.attachRunnerFactory((session, hooks) => {
      runner.setAgentStore(session.agentStore, hooks.agentProfileProvider);
      runner.setMemoryStore(session.memory);
      runner.setMemorySnapshotStore(session.db);
      runner.setProfilePromptSnapshotStore(session.db);
      runner.setEpisodeProgress(session.db);
      runner.setAutomationStore(session.automations);
      runner.setSkillStore(session.skills);
      runner.setChannelStore(session.channels);
      runner.setAttachmentIngestor(hooks.ingestAttachment);
      runner.setImagePersister(hooks.persistImage);
      runner.setMediaBytesPersister(hooks.persistMediaBytes);
      runner.setAgentIdProvider(() => session.id);
      return runner;
    });
  }
  attachRunnerFactory(factory) {
    this.tm.setTurnExecution({
      ...this.tm.execution,
      canExecute: true,
      createRunner: (session, hooks) => factory(session, hooks)
    });
  }
  attachGroupMemberRunnerFactory(factory) {
    this.tm.setTurnExecution({
      ...this.tm.execution,
      canExecuteGroupMember: true,
      createGroupMemberRunner: (session, hooks) => factory(session, hooks)
    });
  }
  attachRunReadinessProbe(probe) {
    this.tm.setTurnExecution({ ...this.tm.execution, isRunReady: probe });
  }
  getRunner(session) {
    const cached2 = this.runners.get(session.id);
    if (cached2 != null) {
      if (this.tm.upgradeResume.pausingForUpgrade) cached2.requestPauseForUpgrade();
      return cached2;
    }
    invariant(this.tm.execution.canExecute, RUNNER_UNATTACHED_MESSAGE);
    const runner = this.tm.execution.createRunner(session, this.runnerHooksFor(session));
    this.wireRunnerLifecycle(runner, session, session.id);
    this.runners.set(session.id, runner);
    return runner;
  }
  wireRunnerLifecycle(runner, session, ttftConversationId, originRoom) {
    if (this.tm.upgradeResume.pausingForUpgrade) runner.requestPauseForUpgrade();
    runner.setBackgroundSubagentHandler(
      (completion) => this.tm.backgroundWakes.handleBackgroundSubagentCompletion(
        originRoom == null ? completion : { ...completion, originRoom }
      )
    );
    runner.setBackgroundSubagentDispatchHandler((dispatch) => {
      this.tm.productAnalytics.trackEvent("sand.subagent.dispatched", {
        parent_agent_id: dispatch.parentAgentId,
        subagent_agent_id: dispatch.subagentAgentId,
        subagent_type: dispatch.subagentType,
        tool_call_id: dispatch.toolCallId,
        subagent_request_id: dispatch.subagentRequestId
      });
      if (dispatch.resume !== true && (dispatch.subagentType === "browserUse" || dispatch.subagentType === "computerUse")) {
        this.tm.telemetry.reportComputerUseDispatch({
          ...dispatch,
          subagentType: dispatch.subagentType
        });
      }
    });
    runner.setSubagentStallHandler((report) => this.tm.telemetry.reportSubagentStalled(report));
    runner.setComputerUseUsageHandler((report) => {
      const usage = report.usage;
      const reasoningTokensPart = usage?.reasoningTokens != null ? { reasoning_tokens: usage.reasoningTokens } : {};
      this.tm.productAnalytics.trackEvent("sand.computer_use.usage", {
        parent_agent_id: report.parentAgentId,
        subagent_agent_id: report.subagentAgentId,
        subagent_type: report.subagentType,
        subagent_request_id: report.subagentRequestId,
        outcome: report.outcome,
        duration_ms: report.durationMs,
        tool_call_count: report.toolCallCount,
        turn_ended_count: report.turnEndedCount,
        has_usage: usage != null,
        ...report.modelId != null ? { model_id: report.modelId } : {},
        ...usage != null ? {
          input_tokens: usage.inputTokens,
          output_tokens: usage.outputTokens,
          cache_read_tokens: usage.cacheReadTokens,
          cache_write_tokens: usage.cacheWriteTokens,
          ...reasoningTokensPart
        } : {}
      });
      const telemetryReport = report.outcome === "error" ? { ...report, error: classifyAgentError(report.error) } : report;
      this.tm.telemetry.reportComputerUseUsage(telemetryReport);
    });
    runner.setSubagentEventHandler((event) => this.tm.roster.emitSubagents(runner, event));
    runner.setPersistedCheckpointHandler(() => {
      void this.tm.agentTodos.publishFromSession(session);
    });
    runner.setAsyncTasksEventHandler((event) => this.tm.roster.emitAsyncTasks(runner, event));
    runner.setBackgroundShellHandler(
      (completion) => this.tm.backgroundWakes.handleBackgroundShellCompletion(
        originRoom == null ? completion : { ...completion, originRoom }
      )
    );
    runner.setPendingWakeArmedHandler((event) => this.tm.pendingWakes.persistPendingWake(event));
    runner.setPendingWakeDisarmedHandler((event) => this.tm.pendingWakes.disarmPendingWake(event));
    runner.setTurnAwaitHandler(
      (observation) => this.tm.telemetry.reportTurnAwait({
        conversationId: session.id,
        ...observation
      })
    );
    runner.setFirstTokenHandler(
      (observation) => this.tm.telemetry.reportTtft({
        conversationId: ttftConversationId,
        ...observation
      })
    );
    runner.setSendDispatchHandler(
      (observation) => this.tm.telemetry.reportSendDispatch({
        conversationId: session.id,
        ...observation
      })
    );
    runner.setTurnRetryHandler(({ error: error42, ...rest }) => {
      this.tm.telemetry.reportTurnRetry({
        conversationId: session.id,
        ...rest,
        error: classifyAgentError(error42)
      });
    });
    runner.setToolCallDiagnosticHandler(
      (observation) => this.tm.turnRuntime.reportToolCallDiagnostic(session, observation)
    );
  }
  runnerHooksFor(session, transport) {
    return {
      subagentOwnership: this.subagentOwnership.forSession(session),
      transport: transport === void 0 ? createVoiceCallGatedTransport(
        createSandTransport((update) => this.tm.handleAgentUpdate(update, session)),
        ({ address, message }) => this.tm.voiceCalls.refusalFor({ agentId: session.id, address, message })
      ) : createVoiceCallGatedTransport(transport, NO_LINE_TO_SPEAK_ON),
      onRunLifecycle: (event) => {
        this.tm.emitAgentRunLifecycle(event);
        if (event.type === "started") {
          this.tm.runLifecycle.recordRequestStarted(session, event);
        } else {
          this.tm.runLifecycle.recordRequestCompleted(session, event);
        }
      },
      ingestAttachment: this.tm.createAttachmentIngestor(session),
      persistImage: this.tm.createAssetImagePersister(session),
      persistMediaBytes: this.tm.createMediaBytesPersister(session),
      agentProfileProvider: () => this.tm.roster.resolveAgentProfile(session)
    };
  }
};

