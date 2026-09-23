var HARNESS_MIGRATION_WINDOW_MS = 10 * 6e4;
var HARNESS_MIGRATION_CUTOVER_DRAIN_MS = 9e4;
var TERMINAL_MIGRATION_RPC_CODES = /* @__PURE__ */ new Set([
  Code.Unimplemented,
  Code.InvalidArgument,
  Code.PermissionDenied,
  Code.Unauthenticated,
  Code.FailedPrecondition
]);
function isTerminalHarnessMigrationRpcError(error42) {
  return TERMINAL_MIGRATION_RPC_CODES.has(ConnectError.from(error42).code);
}
var resumeOwnershipExtension = defineHostExtension({
  id: "resume-ownership",
  dependencies: [
    "agent-identity",
    "auth",
    "automations",
    "experiments",
    "host-upgrade",
    "session",
    "telemetry",
    "transcript",
    "turn-execution"
  ],
  start: (context2) => {
    const identity = context2.deps["agent-identity"];
    const auth2 = context2.deps.auth;
    const automations = context2.deps.automations;
    const experiments = context2.deps.experiments;
    const hostUpgrade = context2.deps["host-upgrade"];
    const sessionStore = context2.deps.session.store;
    const transcript = context2.deps.transcript;
    const turnExecution = context2.deps["turn-execution"];
    const migrationClient = createSandCursorBackendClient(GrokBotService, {
      backend: context2.host.environment.backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId
    });
    const migrationRetry = createRetryPolicy({
      name: "sand-harness-migration-notify",
      mode: "until-signal",
      initialDelayMs: 5e3,
      maxDelayMs: 3e4,
      jitter: "full"
    });
    const cutoverDrain = createRetryPolicy({
      name: "sand-harness-migration-cutover-drain",
      maxAttempts: 1,
      initialDelayMs: HARNESS_MIGRATION_CUTOVER_DRAIN_MS,
      maxDelayMs: HARNESS_MIGRATION_CUTOVER_DRAIN_MS
    });
    const migrationBarrier = new AppliedMigrationBarrier({
      readOperation: () => hostUpgrade.readAppliedUpgradeOperation(),
      retainOperation: (operation) => hostUpgrade.retainAppliedUpgradeOperation(operation),
      releaseOperation: (operationId) => hostUpgrade.releaseAppliedUpgradeOperation(operationId),
      runWindow: (operation, signal) => createDeadlinePolicy({
        name: "sand-harness-migration-window",
        timeoutMs: experiments.getDynamicConfig("sand_working_state_warming_config", {
          disableExposureLog: true
        }).migrationHostWindowMs ?? HARNESS_MIGRATION_WINDOW_MS
      }).run(async (deadlineSignal) => {
        let attempt = 1;
        let cutoverMayHaveStarted = false;
        const inventory = await summarizeBoxRooms({
          listAgents: () => transcript.listAgents(),
          isServerBound: (agentId) => isSandAgentServerBound(sessionStore.getAgentDir(agentId))
        });
        if (inventory.unavailable !== null) {
          context2.host.log(
            `[sand:resume-ownership] box room inventory unavailable (${inventory.unavailable}); reporting none`
          );
        }
        while (true) {
          try {
            const response = await migrationClient.ensureGrokBotBoxHarnessMigrationPass(
              {
                operationId: operation.operationId,
                boxRooms: [...inventory.rooms]
              },
              { signal: deadlineSignal }
            );
            if (response.state === GrokBotBoxHarnessMigrationPassState.DISABLED) {
              return cutoverMayHaveStarted ? "abandoned_after_drain" : "disabled";
            }
            if (response.state === GrokBotBoxHarnessMigrationPassState.DONE) return "done";
            cutoverMayHaveStarted = true;
          } catch (error42) {
            deadlineSignal.throwIfAborted();
            if (isTerminalHarnessMigrationRpcError(error42)) {
              return cutoverMayHaveStarted ? "abandoned_after_drain" : "abandoned";
            }
            cutoverMayHaveStarted = true;
            context2.host.log(
              `[sand:resume-ownership] harness migration notify failed (${errorLogTag(error42)})`
            );
          }
          await migrationRetry.schedule(attempt, deadlineSignal).elapsed;
          attempt += 1;
        }
      }, signal),
      waitForCutoverDrain: (signal) => cutoverDrain.schedule(1, signal).elapsed,
      isLocalWorkAllowed: () => turnExecution.isLocalWorkAllowed,
      isQuiescent: () => transcript.getPauseState().quiescent,
      log: (message) => context2.host.log(message)
    });
    turnExecution.setLocalWorkAllowed(false);
    transcript.invalidateResumeOwnership();
    const service = new ResumeOwnershipService({
      reconcileAtStartup: (signal) => identity.reconcileBeforeStartupResume(signal),
      reconcile: (signal) => identity.reconcileBeforeResume(signal),
      park: (agentIds, pendingWakes) => transcript.parkResumeAfterIdentityReconcileFailure(agentIds, pendingWakes),
      resumeInterrupted: () => transcript.resumeInterruptedUpgradeTurns(),
      resumeAfterRecreate: (agentIds, pendingWakes) => transcript.resumeAfterRecreate(agentIds, pendingWakes),
      pauseForRecreate: () => transcript.pauseTurnsForRecreate(),
      suspendAutomationWakes: () => automations.suspendWakes(),
      listPendingResumeAgentIds: () => transcript.listResumePendingAgentIds(),
      rearmPendingWakes: () => transcript.rearmPendingWakes(),
      resumeAutomationWakes: () => automations.resumeWakes(),
      setLocalWorkAllowed: (allowed) => turnExecution.setLocalWorkAllowed(allowed),
      migrationBarrier,
      resumeDeferredLocalWork: () => {
        void automations.reconcileNow();
        void transcript.redriveUnfulfilledAckObligations();
        const activeAgentId = transcript.getActiveAgentId();
        if (activeAgentId != null) {
          const kickstart = async () => {
            const ready3 = await turnExecution.isRunReady();
            await transcript.kickstartAgent(activeAgentId, ready3);
          };
          void kickstart();
        }
      },
      getPauseOwner: () => transcript.getPauseState().owner,
      report: (report) => context2.deps.telemetry.logs.reportUpgradeResume(report),
      retry: createRetryPolicy({
        name: "sand-resume-ownership-recovery",
        mode: "until-signal",
        initialDelayMs: 2e3,
        maxDelayMs: 3e4,
        jitter: "full"
      }),
      now: () => performance.now(),
      log: (message) => context2.host.log(message)
    });
    transcript.setResumeOwnershipRecoveryRequester(() => service.requestRecovery());
    context2.onStop(() => service.dispose());
    context2.onStop(() => transcript.setResumeOwnershipRecoveryRequester(() => {
    }));
    return {
      resumeAtStartup: () => service.resumeAtStartup(),
      prepareForRecreate: () => service.prepareForRecreate(),
      resumeAfterRecreate: (args) => service.resumeAfterRecreate(args),
      getSettledHostWindow: () => service.getSettledHostWindow(),
      stop: () => service.dispose()
    };
  }
});
