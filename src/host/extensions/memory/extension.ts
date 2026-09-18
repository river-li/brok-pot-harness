var memoryExtension = defineHostExtension({
  id: "memory",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Inference,
    HostExtensions.Telemetry
  ],
  start: (context2) => {
    const sandRoot = getSandRootDir();
    const agentsRootDir = getSandAgentsRootDir();
    const service = new MemoryService({ sandRoot, agentsRootDir });
    let serverShards = null;
    context2.deps.experiments.pinGateOnAuthenticatedBootstrap(
      "grok_bot_server_memories",
      (isEnabled) => {
        if (!isEnabled || serverShards !== null) return;
        const sync = new ServerShardSync({
          sandRoot,
          client: createSandCursorBackendClient(GrokBotService, {
            backend: context2.host.environment.backend,
            getAccessToken: context2.deps.auth.getAccessToken,
            getTeamId: context2.deps.auth.getTeamId,
            getMachineId: context2.deps.auth.getMachineId
          }),
          report: (_event, error41) => {
            context2.deps.telemetry.logs.reportHostDiagnostic({
              kind: "fallback_taken",
              stage: "memory_service",
              errorClass: errorLogTag(error41)
            });
          }
        });
        serverShards = sync;
        const polling = createPollingPolicy2({
          name: "sand-memory-server-shard-pull",
          intervalMs: SERVER_SHARD_SYNC_POLL_INTERVAL_MS
        });
        const pull = polling.start(() => sync.pullAll());
        context2.onStop(async () => {
          pull.dispose();
          await sync.flush();
        });
      }
    );
    context2.deps.experiments.pinGateOnAuthenticatedBootstrap(
      "sand_memory_dreaming",
      (isEnabled) => {
        if (!isEnabled) {
          context2.deps.telemetry.logs.reportMemorySynthesis({
            outcome: "skipped_gate"
          });
          return;
        }
        service.enableMemorySynthesis({
          debounce: createDebouncePolicy({
            name: "sand-memory-synthesis",
            delayMs: MEMORY_SYNTHESIS_DEBOUNCE_MS
          }),
          deadline: createDeadlinePolicy({
            name: "sand-memory-synthesis-inference",
            timeoutMs: MEMORY_SYNTHESIS_DEADLINE_MS
          }),
          polling: createPollingPolicy2({
            name: "sand-memory-temporal-refresh",
            intervalMs: MEMORY_SYNTHESIS_POLL_INTERVAL_MS
          }),
          retry: createRetryPolicy({
            name: "sand-memory-synthesis-retry",
            maxAttempts: MEMORY_SYNTHESIS_RETRY_ATTEMPTS,
            initialDelayMs: MEMORY_SYNTHESIS_RETRY_INITIAL_MS,
            maxDelayMs: MEMORY_SYNTHESIS_RETRY_MAX_MS
          }),
          createExecutor: () => context2.deps.inference.port.createSession(() => {
          }, {
            modelId: SAND_SUMMARIZATION_MODEL_ID,
            isSummarizationSession: true,
            skipLabeling: true
          }).getExecutor(),
          report: (report) => context2.deps.telemetry.logs.reportMemorySynthesis(
            memorySynthesisTelemetryReport(report)
          )
        });
      }
    );
    context2.onStop(() => service.dispose());
    return Object.assign(service, {
      createAgentState: (options2) => createSandAgentState({
        ...options2,
        sandRoot,
        membership: new AgentProjectMembership(options2.agentDir),
        onUserMemoryWritten: () => serverShards?.pushUserShard(options2.agentId)
      })
    });
  }
});
