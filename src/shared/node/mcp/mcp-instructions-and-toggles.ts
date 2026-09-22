/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-instructions-and-toggles.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SandMcpInstructionsAndToggles = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  migrateCustomInstructions(servers) {
    for (const server of servers) {
      if (server.id === "0") continue;
      this.deps.settingsStore().migrateMcpCustomInstructionToServerId({
        serverId: server.id,
        displayName: server.name
      });
    }
  }
  async setServerCustomInstructions(args) {
    const serverId = validateMcpDisplayServerId(args.serverId);
    const server = await this.deps.resolveListedDisplayServer(serverId);
    if (server == null) {
      throw new SandMcpConfigError("MCP server not found.");
    }
    const sameNameRows = (this.deps.lastAccountDisplayConfig()?.servers ?? []).filter(
      (candidate) => candidate.name === server.name
    ).length;
    this.deps.settingsStore().setMcpCustomInstructionByServerId({
      serverId,
      displayName: server.name,
      value: args.instructions,
      mirrorLegacyName: sameNameRows <= 1
    });
    return await this.deps.listServers();
  }
  displayRowForIdentifier(identifier) {
    return this.deps.lastAccountDisplayConfig()?.servers.find(
      (server) => server.serverIdentifier != null && displayRowOwnsIdentifier(identifier, server.serverIdentifier, server.accounts)
    );
  }
  async listServerTools(rawServerId) {
    const serverId = validateMcpDisplayServerId(rawServerId);
    const server = await this.deps.resolveListedDisplayServer(serverId);
    if (server == null) {
      throw new SandMcpConfigError("MCP server not found.");
    }
    const tools = await this.deps.getToolsRaw();
    const disabled = this.deps.settingsStore().getMcpDisabledToolsByServerId()[serverId] ?? [];
    const byName = /* @__PURE__ */ new Map();
    for (const tool of tools) {
      if (this.displayRowForIdentifier(tool.providerIdentifier)?.id !== serverId) {
        continue;
      }
      if (byName.has(tool.toolName)) continue;
      byName.set(tool.toolName, {
        name: tool.toolName,
        ...tool.title != null && tool.title.length > 0 ? { title: tool.title } : {},
        ...tool.description != null && tool.description.length > 0 ? { description: tool.description } : {},
        isDisabled: disabled.includes(tool.toolName)
      });
    }
    return [...byName.values()];
  }
  async toggleMcpToolDisabled(args) {
    const serverId = validateMcpDisplayServerId(args.serverId);
    const toolName = args.toolName;
    if (toolName.length === 0) {
      throw new SandMcpConfigError("MCP tool name is required.");
    }
    if (await this.deps.resolveListedDisplayServer(serverId) == null) {
      throw new SandMcpConfigError("MCP server not found.");
    }
    const disabledByServerId = {
      ...this.deps.settingsStore().getMcpDisabledToolsByServerId()
    };
    const current = disabledByServerId[serverId] ?? [];
    disabledByServerId[serverId] = current.includes(toolName) ? current.filter((name17) => name17 !== toolName) : [...current, toolName];
    this.deps.settingsStore().setMcpDisabledToolsByServerId(disabledByServerId);
    return await this.listServerTools(serverId);
  }
  deleteDisabledToolsForServer(serverId) {
    const disabledByServerId = this.deps.settingsStore().getMcpDisabledToolsByServerId();
    if (disabledByServerId[serverId] == null) return;
    const { [serverId]: _removed, ...rest } = disabledByServerId;
    this.deps.settingsStore().setMcpDisabledToolsByServerId(rest);
  }
  getMcpCustomInstructions() {
    const legacy = this.deps.settingsStore().getMcpCustomInstructions();
    const byServerId = this.deps.settingsStore().getMcpCustomInstructionsByServerId();
    const result = new Map(Object.entries(legacy));
    for (const server of this.deps.lastAccountDisplayConfig()?.servers ?? []) {
      if (server.serverIdentifier == null) continue;
      const instruction = resolveMcpCustomInstruction(
        server.name,
        byServerId[server.id] ?? legacy[server.name]
      );
      result.set(server.serverIdentifier, instruction);
      for (const slot of server.accounts ?? []) {
        if (slot.serverIdentifier == null) continue;
        result.set(slot.serverIdentifier, instruction);
      }
    }
    return result;
  }
};

