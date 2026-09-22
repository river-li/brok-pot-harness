var SERVER_AGENT_PROXY_TAIL_LINGER_MS = 6e4;
var SERVER_AGENT_PROXY_RECONCILE_MIN_INTERVAL_MS = 3e4;
var SERVER_AGENT_PROXY_ROOMS_CAPABILITY_TTL_MS = 6e4;
var SERVER_AGENT_PROXY_ROOM_CREATE_TIMEOUT_MS = 45e3;
var SERVER_AGENT_PROXY_ROOM_RESEAT_TIMEOUT_MS = 2e4;
var SAND_ROOM_CREATED_NOT_YET_VISIBLE = "room_created_not_yet_visible";
var SEND_TASK_LINE = {
  theyJustTalked: false,
  newsOwed: false,
  receiptOwed: false,
  alreadySpokeThisTurn: false
};
var ServerVoiceHarnessRefusedError = class extends SandDomainError {
  name = "ServerVoiceHarnessRefusedError";
};
function isTransientRoomCreateFailure(error42) {
  if (!(error42 instanceof ConnectError)) return true;
  return error42.code === Code.Unavailable || error42.code === Code.DeadlineExceeded;
}
function createSameIdRoomCreateRetryPolicy(clock) {
  return createRetryPolicy({
    name: "server-agent-proxy-room-create",
    maxAttempts: 3,
    initialDelayMs: 1e3,
    maxDelayMs: 5e3,
    shouldRetry: isTransientRoomCreateFailure,
    ...clock === void 0 ? {} : { clock }
  });
}
function createServerAgentProxy(deps) {
  const clock = deps.clock ?? realClock;
  const lingerMs = deps.lingerMs ?? SERVER_AGENT_PROXY_TAIL_LINGER_MS;
  const reconcileMinIntervalMs = deps.reconcileMinIntervalMs ?? SERVER_AGENT_PROXY_RECONCILE_MIN_INTERVAL_MS;
  const requiredAgents = /* @__PURE__ */ new Set();
  const knownAgents = /* @__PURE__ */ new Set();
  const reconciledUnknownAgents = /* @__PURE__ */ new Set();
  const refreshRoster = () => {
    requiredAgents.clear();
    knownAgents.clear();
    for (const agent of deps.listAgentsSync()) {
      knownAgents.add(agent.id);
      if (agent.harness === "temporal") requiredAgents.add(agent.id);
    }
  };
  const resolveAccess = deps.resolveAccess ?? (async () => {
    if (deps.auth.peekAccessToken() == null) return { enabled: false };
    const { backendUrl, headers } = await resolveSandBackendRequestHeaderRecord({
      backend: deps.backend,
      getAccessToken: deps.auth.getAccessToken,
      getTeamId: deps.auth.getTeamId,
      getMachineId: deps.auth.getMachineId
    });
    return { enabled: true, legacyEnabled: false, baseUrl: backendUrl, headers };
  });
  let boundEmit = null;
  let boundRunStateChanged = null;
  const activityOverlays = /* @__PURE__ */ new Map();
  const patchClientOverlay = (agentId, patch) => {
    const current = activityOverlays.get(agentId);
    if (current?.client == null) return;
    activityOverlays.set(agentId, { ...current, client: patch(current.client) });
    boundRunStateChanged?.(agentId);
  };
  const serverAgentActivity = createServerAgentActivity({
    isEnabled: async () => true,
    requiresServer: ({ agentId }) => requiredAgents.has(agentId),
    emit: (event) => {
      if (event.live == null && event.client == null) {
        if (!activityOverlays.delete(event.agentId)) return;
      } else {
        activityOverlays.set(event.agentId, event);
      }
      boundRunStateChanged?.(event.agentId);
    },
    log: (line) => deps.log(`server-agent-proxy: ${line}`),
    clock
  });
  let reconcileWait = null;
  let lastReconcileFinishedAtMs = null;
  const scheduleReconcile = () => {
    if (reconcileWait != null) return;
    const sinceLast = lastReconcileFinishedAtMs == null ? reconcileMinIntervalMs : clock.monotonicNow() - lastReconcileFinishedAtMs;
    const delayMs = Math.max(0, reconcileMinIntervalMs - sinceLast);
    reconcileWait = clock.schedule(delayMs, () => {
      void deps.reconcileNow().catch((error42) => {
        deps.log(`server-agent-proxy roster reconcile failed: ${errorLogTag(error42)}`);
      }).finally(() => {
        lastReconcileFinishedAtMs = clock.monotonicNow();
        reconcileWait = null;
        refreshRoster();
      });
    });
  };
  const noteObservedAgent = (agentId) => {
    if (agentId.length === 0 || knownAgents.has(agentId) || reconciledUnknownAgents.has(agentId)) {
      return;
    }
    refreshRoster();
    if (knownAgents.has(agentId)) return;
    reconciledUnknownAgents.add(agentId);
    scheduleReconcile();
  };
  const transcriptClient = deps.transcriptClient ?? createServerTranscriptClient({
    resolveAccess,
    requiredAgents,
    createTransport: ({ baseUrl, interceptors }) => createConnectTransport({
      baseUrl,
      httpVersion: "1.1",
      interceptors,
      nodeOptions: {
        agent: createIdleDestroyingAgent({
          baseUrl,
          idleMs: SERVER_TRANSCRIPT_SOCKET_IDLE_MS
        })
      }
    })
  });
  const tail = createServerTranscriptTail({
    client: transcriptClient,
    bootId: deps.bootId,
    requiredAgents,
    acceptsAgent: ({ agentId }) => {
      noteObservedAgent(agentId);
      return requiredAgents.has(agentId);
    },
    emit: (event) => boundEmit?.(event),
    onAgentState: (frame) => serverAgentActivity.ingest(frame),
    log: (line) => deps.log(`server-agent-proxy: ${line}`),
    clock
  });
  const actionClient = deps.actionClient ?? createSandCursorBackendClient(GrokBotService, {
    backend: deps.backend,
    getAccessToken: deps.auth.getAccessToken,
    getTeamId: deps.auth.getTeamId,
    getMachineId: deps.auth.getMachineId
  });
  const actionCore = createServerAgentActionCore(actionClient);
  const roomCreateRetry = deps.roomCreateRetry ?? createSameIdRoomCreateRetryPolicy(deps.clock);
  const roomClient = deps.roomClient ?? createSandCursorBackendClient(GrokBotService, {
    backend: deps.backend,
    getAccessToken: deps.auth.getAccessToken,
    getTeamId: deps.auth.getTeamId,
    getMachineId: deps.auth.getMachineId
  });
  const voiceHarness = deps.voiceHarness ?? new RPCVoiceCallHarness(
    (request5) => requestVoiceCallHarness({
      backend: deps.backend,
      getAccessToken: deps.auth.getAccessToken,
      getTeamId: deps.auth.getTeamId,
      getMachineId: deps.auth.getMachineId,
      request: request5
    })
  );
  const transcriptWriteClient = deps.transcriptWriteClient ?? createSandCursorBackendClient(GrokBotService, {
    backend: deps.backend,
    getAccessToken: deps.auth.getAccessToken,
    getTeamId: deps.auth.getTeamId,
    getMachineId: deps.auth.getMachineId
  });
  let roomsCapability = null;
  const serverRoomsEnabled = async () => {
    const now = clock.monotonicNow();
    if (roomsCapability !== null && now - roomsCapability.checkedAtMs < SERVER_AGENT_PROXY_ROOMS_CAPABILITY_TTL_MS) {
      return roomsCapability.enabled;
    }
    let enabled = false;
    try {
      const response = await roomClient.getGrokBotRuntimeCapabilities(
        {},
        { timeoutMs: SERVER_AGENT_ACTION_TIMEOUT_MS }
      );
      enabled = response.capabilities?.serverRoomsEnabled === true;
    } catch (error42) {
      deps.log(`server-agent-proxy: rooms capability check failed: ${errorLogTag(error42)}`);
    }
    roomsCapability = { enabled, checkedAtMs: now };
    return enabled;
  };
  const roomSummaryAfterAdopt = async (confirmed) => {
    if (!await deps.adoptServerAgent(confirmed)) {
      deps.log(
        `server-agent-proxy: room ${confirmed.agentId} confirmed by the server but not mirrored yet`
      );
      return null;
    }
    refreshRoster();
    return deps.listAgentsSync().find((agent) => agent.id === confirmed.agentId) ?? null;
  };
  const roomRowFromFallback = (confirmed, previous) => previous === void 0 ? null : {
    ...previous,
    name: confirmed.name,
    description: confirmed.description,
    isGroup: true,
    memberIds: [...confirmed.memberAgentIds],
    harness: "temporal"
  };
  let disposed = false;
  let listenerCount = 0;
  let tailStarted = false;
  let lingerWait = null;
  const cancelLinger = () => {
    lingerWait?.dispose();
    lingerWait = null;
  };
  const stopTailAfterLinger = () => {
    cancelLinger();
    lingerWait = clock.schedule(lingerMs, () => {
      lingerWait = null;
      if (listenerCount > 0 || !tailStarted) return;
      tail.stop();
      tailStarted = false;
    });
  };
  const ensureTailStarted = () => {
    if (disposed) return;
    if (!tailStarted) {
      refreshRoster();
      tail.start();
      tailStarted = true;
    }
    if (listenerCount === 0) stopTailAfterLinger();
    else cancelLinger();
  };
  return {
    isProxiedAgent: (agentId) => {
      refreshRoster();
      return requiredAgents.has(agentId);
    },
    performAction: async (request5) => {
      ensureTailStarted();
      const reply2 = await actionCore(request5);
      if (reply2.status === "ok" && request5.method === "setAgentUnread") {
        const { id, isUnread } = request5.args;
        patchClientOverlay(
          id,
          (client) => isUnread ? { ...client, hasUnread: true, unreadCount: Math.max(1, client.unreadCount) } : { ...client, hasUnread: false, unreadCount: 0 }
        );
      }
      return reply2;
    },
    serverRoomsEnabled,
    createRoom: async (args) => {
      ensureTailStarted();
      const memberAgentIds = [...new Set(args.memberAgentIds)].slice(0, GROUP_MAX_MEMBERS);
      try {
        const roster = new Map(deps.listAgentsSync().map((agent2) => [agent2.id, agent2]));
        await deps.ensureServerRoomMembers(
          memberAgentIds.filter((id) => roster.get(id)?.harness !== "temporal")
        );
      } catch (error42) {
        return classifyServerAgentActionError(error42);
      }
      const agentId = (0, import_node_crypto62.randomUUID)();
      let confirmed;
      let attempts2 = 0;
      try {
        const response = await roomCreateRetry.runWithRetry(() => {
          attempts2 += 1;
          return roomClient.createGrokBotRoom(
            {
              agentId,
              name: args.name,
              description: args.description,
              memberAgentIds
            },
            { timeoutMs: SERVER_AGENT_PROXY_ROOM_CREATE_TIMEOUT_MS }
          );
        });
        if (response.agent?.agentId !== agentId) {
          return {
            status: "refused",
            message: "The server did not confirm the room it created.",
            failureCode: null
          };
        }
        confirmed = response.agent;
      } catch (error42) {
        if (error42 instanceof ConnectError && error42.code === Code.FailedPrecondition) {
          roomsCapability = { enabled: false, checkedAtMs: clock.monotonicNow() };
          return attempts2 > 1 ? {
            status: "refused",
            message: "Server rooms were turned off while the room was being created; check the roster before creating it again.",
            failureCode: SAND_ROOM_CREATED_NOT_YET_VISIBLE
          } : { status: "unimplemented" };
        }
        return classifyServerAgentActionError(error42);
      }
      const agent = await roomSummaryAfterAdopt(confirmed);
      if (agent === null) {
        return {
          status: "refused",
          message: "The room was created and will appear on this computer shortly; do not create it again.",
          failureCode: SAND_ROOM_CREATED_NOT_YET_VISIBLE
        };
      }
      return { status: "ok", value: { agent, transcript: [] } };
    },
    setRoomMembers: async (args) => {
      ensureTailStarted();
      const previous = deps.listAgentsSync().find((agent2) => agent2.id === args.id);
      let confirmed;
      try {
        const response = await roomClient.setGrokBotRoomMembers(
          { agentId: args.id, memberAgentIds: [...args.memberAgentIds] },
          { timeoutMs: SERVER_AGENT_PROXY_ROOM_RESEAT_TIMEOUT_MS }
        );
        if (response.agent?.agentId !== args.id) {
          return {
            status: "refused",
            message: "The server did not confirm the room it reseated.",
            failureCode: null
          };
        }
        confirmed = response.agent;
      } catch (error42) {
        return classifyServerAgentActionError(error42);
      }
      const agent = await roomSummaryAfterAdopt(confirmed) ?? roomRowFromFallback(confirmed, previous);
      return { status: "ok", value: agent };
    },
    setAgentHidden: async (agentId, isHidden) => {
      ensureTailStarted();
      try {
        await actionClient.setGrokBotAgentClientState(
          { agentId, hiddenFromSidebar: isHidden },
          { timeoutMs: SERVER_AGENT_ACTION_TIMEOUT_MS }
        );
      } catch (error42) {
        return classifyServerAgentActionError(error42);
      }
      patchClientOverlay(agentId, (client) => ({ ...client, isHiddenFromSidebar: isHidden }));
      return { status: "ok", value: null };
    },
    openAgentTail: (args, signal) => {
      ensureTailStarted();
      return tail.openAgentTail(args, signal);
    },
    getAgentTranscriptTail: (args, signal) => {
      ensureTailStarted();
      return tail.getAgentTranscriptTail(args, signal);
    },
    bindGatewayEvents: (emit) => {
      boundEmit = emit;
    },
    publishVoiceCallReceipt: async (record2, authored) => {
      await publishVoiceCallReceiptToServer(
        record2,
        async ({ agentId, generation, entries }) => {
          const response = await transcriptWriteClient.commitGrokBotTranscriptEntries(
            {
              agentId,
              generation,
              entries: entries.map((entry) => ({
                seq: entry.seq,
                entryKind: entry.entryKind,
                entryId: entry.entryId,
                body: entry.body,
                updatedSeq: entry.updatedSeq
              }))
            },
            { timeoutMs: SERVER_AGENT_ACTION_TIMEOUT_MS }
          );
          return { committedCount: response.committedCount };
        },
        authored
      );
    },
    relayVoiceCallNudge: async ({ agentId, callId, request: request5 }) => {
      const outcome = await voiceHarness.callTool({
        agentId,
        callId,
        name: VOICE_CALL_NUDGE_MAIN_TOOL,
        input: { request: request5 },
        line: SEND_TASK_LINE
      });
      if (outcome.kind !== "served") {
        throw new ServerVoiceHarnessRefusedError(
          `server voice harness ${outcome.kind}: ${outcome.output.error}`
        );
      }
      return SendTaskTool.definition.output.parse(outcome.output);
    },
    bindRunStateChanged: (notify) => {
      boundRunStateChanged = notify;
    },
    activityOverlayFor: (agentId) => activityOverlays.get(agentId) ?? null,
    noteEventStreamListeners: (count) => {
      listenerCount = count;
      if (count > 0) ensureTailStarted();
      else if (tailStarted) stopTailAfterLinger();
    },
    log: (line) => deps.log(`server-agent-proxy: ${line}`),
    refreshRoster,
    dispose: () => {
      disposed = true;
      cancelLinger();
      reconcileWait?.dispose();
      reconcileWait = null;
      serverAgentActivity.stop();
      tail.stop();
      tailStarted = false;
    }
  };
}
