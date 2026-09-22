var serverAgentProxyExtension = defineHostExtension({
  id: "server-agent-proxy",
  dependencies: [
    HostExtensions.AgentIdentity,
    HostExtensions.Auth,
    HostExtensions.Telemetry,
    HostExtensions.Transcript
  ],
  start: (context2) => {
    const { auth: auth2, transcript } = context2.deps;
    const proxy = createServerAgentProxy({
      backend: context2.host.environment.backend,
      bootId: (0, import_node_crypto63.randomUUID)(),
      auth: {
        getAccessToken: auth2.getAccessToken,
        getTeamId: auth2.getTeamId,
        getMachineId: auth2.getMachineId,
        peekAccessToken: auth2.peekAccessToken
      },
      listAgentsSync: () => transcript.listAgentsSync(),
      reconcileNow: () => context2.deps["agent-identity"].reconcileNow(),
      adoptServerAgent: (wire) => context2.deps["agent-identity"].adoptServerAgent(wire),
      ensureServerRoomMembers: (agentIds) => context2.deps["agent-identity"].ensureServerRoomMembers(agentIds),
      log: (line) => context2.host.log(line)
    });
    proxy.bindRunStateChanged((agentId) => {
      transcript.overhearServerActivity(agentId, proxy.activityOverlayFor(agentId)?.live ?? null);
      transcript.emitAgentUpdate(agentId).catch((error42) => {
        context2.host.log(`server-agent-proxy roster emit failed: ${errorLogTag(error42)}`);
      });
    });
    transcript.setServerActivityOverlayProvider((agentId) => proxy.activityOverlayFor(agentId));
    context2.onStop(() => transcript.setServerActivityOverlayProvider(null));
    context2.onStop(transcript.subscribeAgents(() => proxy.refreshRoster()));
    context2.onStop(transcript.subscribeAgentUpserted(() => proxy.refreshRoster()));
    context2.onStop(() => proxy.dispose());
    return proxy;
  }
});
