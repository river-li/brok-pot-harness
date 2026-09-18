async function createLocalSandMcp(options2) {
  const loader2 = new FileConfigMcpLoader(options2.configPath, new InMemoryTokenStorage());
  const manager = await loader2.load(createContext().withName("sandEvalMcp"));
  const lease = new ManagerMcpLease(manager);
  const executor = new LocalMcpToolExecutor(
    lease,
    new MockPermissionsService(),
    new MockPendingDecisionProvider(),
    options2.workspacePath
  );
  const mcp = {
    getTools: (ctx) => lease.getTools(ctx),
    createExecutor: () => executor,
    refreshAccountConfig: () => {
    },
    createStateExecutor: () => createSandMcpStateExecutor(mcp),
    resolveToolTransport: async () => "unknown",
    getCustomInstructions: async (ctx) => {
      const instructions = await lease.getInstructions(ctx);
      return new Map(
        instructions.map((instruction) => [instruction.serverName, instruction.instructions])
      );
    }
  };
  return {
    mcp,
    close: async () => {
      await manager.closeAllClients();
    }
  };
}
