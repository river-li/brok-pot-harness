/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-listing-summaries.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function displayTransport(server) {
  return server.config == null ? "http" : getTransport(server.config);
}
function displayCommand(server) {
  return server.config == null ? void 0 : getCommand(server.config);
}
function displayUrl(server) {
  return server.config != null && "url" in server.config ? server.config.url : void 0;
}
function statusForBackendSlot(server, backend, slot) {
  const dialed = statusFromBackendListStatus(backend?.status);
  if (server?.servedBy === "grok" && (slot?.hasToken ?? server.hasDefaultSlotToken) === false) {
    return { status: "needsAuth", statusDetail: { kind: "authentication_required" } };
  }
  const slotIsTokenless = slot != null && !slot.hasToken;
  return slotIsTokenless && dialed.status !== "connected" ? { status: "needsAuth", statusDetail: { kind: "authentication_required" } } : dialed;
}
function credentialPresenceStatus(hasToken, carriesStaticCredentialHeaders) {
  if (hasToken === true || carriesStaticCredentialHeaders) return { status: "connected" };
  if (hasToken == null) return { status: "disconnected" };
  return { status: "needsAuth", statusDetail: { kind: "authentication_required" } };
}
var SandMcpListingSummaries = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  countEnabledTools(serverId, tools) {
    const disabled = this.deps.settingsStore().getMcpDisabledToolsByServerId()[serverId];
    if (disabled == null || disabled.length === 0) {
      return tools.length;
    }
    return tools.filter((tool) => !disabled.includes(tool.toolName)).length;
  }
  createBackendServerSummaries(server, backendEntries) {
    const slots = server.accounts ?? [];
    if (slots.length === 0) {
      const entry = backendEntries.find((candidate) => candidate.accountLabel === DEFAULT_MCP_ACCOUNT_KEY) ?? backendEntries[0];
      return [this.createBackendServerSummary(server, entry, DEFAULT_MCP_ACCOUNT_KEY)];
    }
    return slots.map(
      (slot) => this.createBackendServerSummary(
        server,
        backendEntries.find((candidate) => candidate.accountLabel === slot.accountKey),
        slot.accountKey,
        slot
      )
    );
  }
  createBackendServerSummary(server, backend, accountKey, slot) {
    const { id, name: name17, isTeamServer } = server;
    const rowIdentifier = server.serverIdentifier ?? `mcp-row-${id}`;
    const enabledToolCount = this.countEnabledTools(id, backend?.tools ?? []);
    const disabledToolCount = (backend?.tools.length ?? 0) - enabledToolCount;
    const status = statusForBackendSlot(server, backend, slot);
    return {
      id,
      name: name17,
      serverIdentifier: slot?.serverIdentifier ?? backend?.serverIdentifier ?? provisionalMcpAccountServerIdentifier(rowIdentifier, accountKey),
      accountKey,
      rowServerIdentifier: rowIdentifier,
      transport: displayTransport(server),
      command: displayCommand(server),
      url: displayUrl(server),
      toolCount: enabledToolCount,
      ...disabledToolCount > 0 ? { disabledToolCount } : {},
      customInstructions: this.resolveServerCustomInstruction(server),
      isTeamServer,
      ...pluginAttributionFromDisplayServer(server),
      ...status
    };
  }
  createCredentialPresenceSummaries(server) {
    const slots = server.accounts ?? [];
    if (slots.length === 0) {
      return [
        this.createCredentialPresenceSummary(
          server,
          DEFAULT_MCP_ACCOUNT_KEY,
          void 0,
          server.hasDefaultSlotToken
        )
      ];
    }
    return slots.map(
      (slot) => this.createCredentialPresenceSummary(server, slot.accountKey, slot, slot.hasToken)
    );
  }
  createCredentialPresenceSummary(server, accountKey, slot, hasToken) {
    const { id, name: name17, isTeamServer } = server;
    const rowIdentifier = server.serverIdentifier ?? `mcp-row-${id}`;
    const status = credentialPresenceStatus(hasToken, server.hasStaticCredentialHeaders === true);
    return {
      id,
      name: name17,
      serverIdentifier: slot?.serverIdentifier ?? provisionalMcpAccountServerIdentifier(rowIdentifier, accountKey),
      accountKey,
      rowServerIdentifier: rowIdentifier,
      transport: displayTransport(server),
      command: displayCommand(server),
      url: displayUrl(server),
      toolCount: 0,
      customInstructions: this.resolveServerCustomInstruction(server),
      isTeamServer,
      ...pluginAttributionFromDisplayServer(server),
      ...status
    };
  }
  createBoxServerSummary(server, box, boxDiscoveryUnavailable) {
    const { id, name: name17, isTeamServer } = server;
    const serverIdentifier = server.serverIdentifier ?? `mcp-row-${id}`;
    let enabledToolCount;
    if (box == null) {
      enabledToolCount = 0;
    } else if (box.tools.length > 0) {
      enabledToolCount = this.countEnabledTools(id, box.tools);
    } else {
      enabledToolCount = box.toolCount;
    }
    const disabledToolCount = box == null || box.tools.length === 0 ? 0 : box.tools.length - enabledToolCount;
    const status = !this.deps.isBoxExecWired() ? {
      status: "disconnected",
      statusDetail: { kind: "runs_on_bot_computer" }
    } : statusFromBoxListStatus(box?.status, boxDiscoveryUnavailable, box?.statusDetail);
    return {
      id,
      name: name17,
      serverIdentifier,
      accountKey: DEFAULT_MCP_ACCOUNT_KEY,
      rowServerIdentifier: serverIdentifier,
      transport: displayTransport(server),
      command: displayCommand(server),
      url: void 0,
      toolCount: enabledToolCount,
      ...disabledToolCount > 0 ? { disabledToolCount } : {},
      customInstructions: this.resolveServerCustomInstruction(server),
      isTeamServer,
      ...pluginAttributionFromDisplayServer(server),
      ...status
    };
  }
  createAdminDisabledServerSummary(server) {
    const { id, name: name17, isTeamServer } = server;
    const serverIdentifier = server.serverIdentifier ?? `mcp-row-${id}`;
    return {
      id,
      name: name17,
      serverIdentifier,
      accountKey: DEFAULT_MCP_ACCOUNT_KEY,
      rowServerIdentifier: serverIdentifier,
      transport: displayTransport(server),
      command: displayCommand(server),
      url: displayUrl(server),
      toolCount: 0,
      customInstructions: this.resolveServerCustomInstruction(server),
      isTeamServer,
      ...pluginAttributionFromDisplayServer(server),
      status: "disabledByTeamAdminPolicy",
      statusDetail: { kind: "disabled_by_team_admin" }
    };
  }
  resolveServerCustomInstruction(server) {
    return resolveMcpCustomInstruction(
      server.name,
      this.deps.settingsStore().getRawMcpCustomInstructionByServerId(server.id) ?? this.deps.settingsStore().getRawMcpCustomInstruction(server.name)
    );
  }
};

