/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-account-slot-lifecycle.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SandMcpAccountSlotLifecycle = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  lastAccountDisplayConfig = null;
  lastListedState = null;
  lastAccountDisplayConfigView() {
    return this.lastAccountDisplayConfig;
  }
  noteAccountDisplayConfig(display) {
    this.lastAccountDisplayConfig = display;
  }
  noteListedState(state) {
    this.lastListedState = state;
  }
  clearAccountDisplayState() {
    this.lastAccountDisplayConfig = null;
    this.lastListedState = null;
  }
  dropServerFromDisplay(removedServerId) {
    if (this.lastAccountDisplayConfig == null) return;
    this.lastAccountDisplayConfig = {
      ...this.lastAccountDisplayConfig,
      servers: this.lastAccountDisplayConfig.servers.filter(
        (server) => server.id !== removedServerId
      )
    };
  }
  async resolveHttpDisplayServer(rawServerId) {
    const serverId = validateMcpServerId(rawServerId);
    const server = await this.deps.resolveDisplayServer(serverId);
    if (server == null) {
      throw new SandMcpConfigError("MCP server not found.");
    }
    if (server.config == null || !("url" in server.config)) {
      throw new SandMcpConfigError(
        "This connector runs on Grok Bot's computer and has no OAuth accounts."
      );
    }
    return { serverId, serverUrl: server.config.url };
  }
  async logoutAccount(rawServerId, rawAccountKey) {
    const accountKey = normalizeAccountKey(rawAccountKey);
    const { serverId, serverUrl } = await this.resolveHttpDisplayServer(rawServerId);
    await this.deps.backendMcpExec.logoutAccount({
      serverUrl,
      accountKey
    });
    this.deps.clearPendingAuthWatch(serverId, accountKey);
    return await this.deps.reloadServers();
  }
  async renameAccount(rawServerId, rawAccountKey, rawNewAccountKey) {
    const accountKey = normalizeAccountKey(rawAccountKey);
    const newAccountKey = normalizeAccountKey(rawNewAccountKey);
    const { serverId } = await this.resolveHttpDisplayServer(rawServerId);
    await this.deps.backendMcpExec.renameAccount({
      serverId: parseInt32McpServerId(serverId),
      accountKey,
      newAccountKey
    });
    const clearedWatch = this.deps.clearPendingAuthWatch(serverId, accountKey);
    if (clearedWatch != null) this.deps.notifyWatchCancelled(clearedWatch);
    const patched = this.commitLocalAccountSlotMutation(
      serverId,
      (slots) => slots.map(
        (slot) => slot.accountKey === accountKey ? { accountKey: newAccountKey, hasToken: slot.hasToken } : slot
      ),
      (summaries, rowIdentifier) => summaries.map(
        (summary) => summary.id === serverId && summary.accountKey === accountKey ? {
          ...summary,
          accountKey: newAccountKey,
          serverIdentifier: provisionalMcpAccountServerIdentifier(
            rowIdentifier,
            newAccountKey
          )
        } : summary
      )
    );
    if (patched == null) return await this.deps.reloadServers();
    return patched;
  }
  async removeAccount(rawServerId, rawAccountKey) {
    const accountKey = normalizeAccountKey(rawAccountKey);
    const { serverId } = await this.resolveHttpDisplayServer(rawServerId);
    await this.deps.backendMcpExec.deleteAccount({
      serverId: parseInt32McpServerId(serverId),
      accountKey
    });
    const clearedWatch = this.deps.clearPendingAuthWatch(serverId, accountKey);
    if (clearedWatch != null) this.deps.notifyWatchCancelled(clearedWatch);
    const patched = this.commitLocalAccountSlotMutation(
      serverId,
      (slots) => slots.filter((slot) => slot.accountKey !== accountKey),
      (summaries) => summaries.filter(
        (summary) => !(summary.id === serverId && summary.accountKey === accountKey)
      )
    );
    if (patched == null) return await this.deps.reloadServers();
    return patched;
  }
  commitLocalAccountSlotMutation(serverId, patchSlots, patchSummaries) {
    const display = this.lastAccountDisplayConfig;
    const state = this.lastListedState;
    if (display == null || state == null) return null;
    const row = display.servers.find((server) => server.id === serverId);
    if (row == null) return null;
    const rowIdentifier = row.serverIdentifier ?? `mcp-row-${row.id}`;
    const accounts = patchSlots(row.accounts ?? []);
    if (accounts.length === 0) return null;
    const patchedDisplay = {
      ...display,
      servers: display.servers.map(
        (server) => server.id === serverId ? { ...server, accounts } : server
      )
    };
    this.lastAccountDisplayConfig = patchedDisplay;
    this.deps.definitionSource.adoptAccountConfig(runtimeConfigFromDisplay(patchedDisplay));
    this.deps.invalidateToolsCache();
    this.deps.resetPushState();
    const patchedState = {
      ...state,
      servers: patchSummaries(state.servers, rowIdentifier)
    };
    this.lastListedState = patchedState;
    return patchedState;
  }
};

