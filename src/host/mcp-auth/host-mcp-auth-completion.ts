var HostMcpAuthCompletion = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  waits = new McpAuthWaitRegistry();
  registerConnectCard(event) {
    this.waits.register(event);
  }
  resolve(completion) {
    const waitingAgentId = this.waits.take(completion);
    const watchAgentId = this.deps.getMcp().noteAuthCompletedElsewhere(completion.serverId, completion.accountKey);
    if (completion.outcome === "cancelled") return;
    const agentId = completion.requestingAgentId ?? watchAgentId ?? waitingAgentId;
    if (agentId == null) return;
    void this.deps.getTranscript().resumeAfterMcpAuth(agentId, completion.serverName, completion.accountKey);
  }
  async resolveDesktop(completion) {
    try {
      await this.deps.getMcp().management.restart();
    } catch {
    }
    this.resolve(completion);
  }
};
