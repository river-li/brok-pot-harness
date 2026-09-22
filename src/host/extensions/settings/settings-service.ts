/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/settings/settings-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path143 = require("node:path");
init_sand_agent_model();

// @recovered-fragment 2/2
var SettingsService = class {
  store;
  settingsPath;
  osLocale;
  selectedTeamScopeSource;
  lastAnnouncedSelectedTeamId;
  featureFlagOverrideListeners = /* @__PURE__ */ new Set();
  userTimeZoneListeners = /* @__PURE__ */ new Set();
  changeListeners = /* @__PURE__ */ new Set();
  constructor(settingsPath = (0, import_node_path143.join)(getSandRootDir(), "settings.json")) {
    this.store = new SandSettingsStore(settingsPath);
    this.settingsPath = settingsPath;
  }
  getSettingsPath() {
    return this.settingsPath;
  }
  getHostSettings() {
    const selectedTeamId = this.getSelectedTeamId();
    const userTimeZone = this.store.getDetectedUserTimeZone();
    const userTimeZoneOverride = this.store.getUserTimeZoneOverride();
    const agentDefaultModel = this.store.getAgentDefaultModel();
    const computerUseModel = this.store.getComputerUseModel();
    const mcpCustomInstructionsAccountScope = this.store.getActiveAccountScope();
    const pinnedAgentIds = this.store.getPinnedAgentIds();
    const sidebarSections = this.store.getSidebarSections();
    const hasSeenOnboarding = this.store.getHasSeenOnboarding();
    return {
      notifications: this.store.getNotificationConfig(),
      ...selectedTeamId !== void 0 ? { selectedTeamId } : {},
      mcpCustomInstructions: this.store.getMcpCustomInstructions(),
      mcpCustomInstructionsByServerId: this.store.getMcpCustomInstructionsByServerId(),
      mcpDisabledToolsByServerId: this.store.getMcpDisabledToolsByServerId(),
      ...mcpCustomInstructionsAccountScope !== void 0 ? { mcpCustomInstructionsAccountScope } : {},
      mcpHeldAccountScopes: this.store.getHeldAccountScopes(),
      mcpBoxServers: this.store.getMcpBoxServers(),
      autoReviewInstructions: this.store.getAutoReviewInstructions(),
      localToolPermission: this.store.getLocalToolPermission(),
      webauthnProxyEnabled: this.store.getWebauthnProxyEnabled(),
      messagesEnabled: this.store.getMessagesEnabled(),
      ...userTimeZone !== void 0 ? { userTimeZone } : {},
      ...userTimeZoneOverride !== void 0 ? { userTimeZoneOverride } : {},
      ...agentDefaultModel !== void 0 ? { agentDefaultModel } : {},
      ...computerUseModel !== void 0 ? { computerUseModel } : {},
      ...pinnedAgentIds !== void 0 ? { pinnedAgentIds } : {},
      sidebarSections: sidebarSections ?? [],
      ...hasSeenOnboarding !== void 0 ? { hasSeenOnboarding } : {}
    };
  }
  setHostSettings(update) {
    const previousUserTimeZone = this.store.getUserTimeZone();
    this.store.setNotificationConfig(update.notifications ?? {});
    if (update.mcpCustomInstructionsAccountScope === null) {
      this.store.clearAccountScope();
    } else if (update.mcpCustomInstructionsAccountScope !== void 0) {
      this.store.scopeToAccount(update.mcpCustomInstructionsAccountScope);
    }
    if (update.selectedTeam === null) {
      this.store.setSelectedTeam(void 0);
    } else if (update.selectedTeam !== void 0 && Number.isSafeInteger(update.selectedTeam.teamId) && update.selectedTeam.teamId > 0 && update.selectedTeam.accountScope.length > 0) {
      this.store.setSelectedTeam({
        teamId: update.selectedTeam.teamId,
        accountScope: update.selectedTeam.accountScope
      });
    }
    if (update.mcpCustomInstructions !== void 0) {
      this.store.setMcpCustomInstructions(update.mcpCustomInstructions);
    }
    if (update.mcpCustomInstructionsByServerId !== void 0) {
      this.store.setMcpCustomInstructionsByServerId(update.mcpCustomInstructionsByServerId);
    }
    if (update.mcpDisabledToolsByServerId !== void 0) {
      this.store.setMcpDisabledToolsByServerId(update.mcpDisabledToolsByServerId);
    }
    if (update.mcpBoxServers !== void 0) {
      this.store.setMcpBoxServers(update.mcpBoxServers);
    }
    if (update.userTimeZone !== void 0 && (update.userTimeZone === "" || isValidIanaTimeZone(update.userTimeZone))) {
      this.store.setUserTimeZone(update.userTimeZone);
    }
    if (update.osLocale !== void 0) {
      const osLocale = update.osLocale.trim();
      this.osLocale = osLocale === "" ? void 0 : osLocale;
    }
    if (update.userTimeZoneOverride !== void 0 && (update.userTimeZoneOverride === "" || isValidIanaTimeZone(update.userTimeZoneOverride))) {
      this.store.setUserTimeZoneOverride(update.userTimeZoneOverride);
    }
    if (update.agentDefaultModel === null) {
      this.store.setAgentDefaultModel(void 0);
    } else if (update.agentDefaultModel !== void 0) {
      const parsed2 = sandAgentDefaultModelSchema.safeParse(update.agentDefaultModel);
      if (parsed2.success) {
        this.store.setAgentDefaultModel(parsed2.data);
      }
    }
    if (update.autoReviewInstructions !== void 0) {
      this.store.setAutoReviewInstructions(update.autoReviewInstructions);
    }
    if (update.localToolPermission !== void 0) {
      this.setLocalToolPermission(
        normalizeSandLocalToolPermission(update.localToolPermission),
        update.localToolPermissionMachineId
      );
    }
    if (update.webauthnProxyEnabled !== void 0) {
      this.store.setWebauthnProxyEnabled(update.webauthnProxyEnabled);
    }
    if (update.messagesEnabled !== void 0) {
      this.store.setMessagesEnabled(update.messagesEnabled);
    }
    if (update.pinnedAgentIds !== void 0) {
      this.store.setPinnedAgentIds(update.pinnedAgentIds);
    }
    if (update.sidebarSections !== void 0) {
      this.store.setSidebarSections(update.sidebarSections);
    }
    if (update.hasSeenOnboarding !== void 0) {
      this.store.setHasSeenOnboarding(update.hasSeenOnboarding);
    }
    if (update.featureFlagOverrides !== void 0) {
      for (const listener of [...this.featureFlagOverrideListeners]) {
        listener(update.featureFlagOverrides);
      }
    }
    if (update.computerUseModel === null) {
      this.store.setComputerUseModel(void 0);
    } else if (update.computerUseModel !== void 0) {
      const parsed2 = sandComputerUseModelSchema.safeParse(update.computerUseModel);
      if (parsed2.success) {
        this.store.setComputerUseModel(parsed2.data);
      }
    }
    const userTimeZone = this.store.getUserTimeZone();
    if (userTimeZone !== previousUserTimeZone) {
      for (const listener of [...this.userTimeZoneListeners]) {
        listener(userTimeZone);
      }
    }
    const effectiveSelectedTeamId = this.getSelectedTeamId();
    const selectedTeamChanged = effectiveSelectedTeamId !== this.lastAnnouncedSelectedTeamId;
    this.lastAnnouncedSelectedTeamId = effectiveSelectedTeamId;
    const { selectedTeam: _pair, ...announcedBase } = update;
    this.announceChange(
      selectedTeamChanged ? { ...announcedBase, selectedTeamId: effectiveSelectedTeamId ?? null } : announcedBase
    );
    return this.getHostSettings();
  }
  noteSelectedTeamScopeSourceChanged() {
    const effectiveSelectedTeamId = this.getSelectedTeamId();
    if (effectiveSelectedTeamId === this.lastAnnouncedSelectedTeamId) return;
    this.lastAnnouncedSelectedTeamId = effectiveSelectedTeamId;
    this.announceChange({ selectedTeamId: effectiveSelectedTeamId ?? null });
  }
  announceChange(update) {
    const fields2 = Object.keys(update);
    if (fields2.length === 0) return;
    for (const listener of [...this.changeListeners]) {
      listener({ fields: fields2 });
    }
  }
  subscribeToChanges(listener) {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }
  getAgentDefaultModel() {
    return this.store.getAgentDefaultModel();
  }
  getComputerUseModel() {
    return this.store.getComputerUseModel();
  }
  getUserTimeZone() {
    return this.store.getUserTimeZone();
  }
  getOsLocale() {
    return this.osLocale;
  }
  getAutoReviewInstructions() {
    return this.store.getAutoReviewInstructions();
  }
  getLocalToolPermission(machineId) {
    return machineId === void 0 || machineId.length === 0 ? SAND_DEFAULT_LOCAL_TOOL_PERMISSION : this.store.getLocalToolPermissionForMachine(machineId) ?? SAND_DEFAULT_LOCAL_TOOL_PERMISSION;
  }
  setSelectedTeamScopeSource(source) {
    this.selectedTeamScopeSource = source;
  }
  getSelectedTeamId() {
    const accountScope = this.selectedTeamScopeSource?.();
    return accountScope === void 0 ? void 0 : this.getSelectedTeamIdForAccountScope(accountScope);
  }
  getSelectedTeamIdForAccountScope(accountScope) {
    const pair = this.store.getSelectedTeam();
    return pair !== void 0 && pair.accountScope === accountScope ? pair.teamId : void 0;
  }
  setLocalToolPermission(permission, machineId) {
    if (machineId === void 0) {
      this.store.setLocalToolPermission(permission);
    } else {
      this.store.setLocalToolPermissionForMachine(machineId, permission);
    }
  }
  getWebauthnProxyEnabled() {
    return this.store.getWebauthnProxyEnabled();
  }
  getMessagesEnabled() {
    return this.store.getMessagesEnabled();
  }
  listSidebarSections() {
    return this.store.getSidebarSections() ?? [];
  }
  assignAgentToSidebarSection(agentId, sectionId) {
    const next = SidebarSections.assignAgents(this.listSidebarSections(), [agentId], sectionId);
    if (next === null) return null;
    this.store.setSidebarSections(next);
    this.announceChange({ sidebarSections: next });
    return this.listSidebarSections();
  }
  subscribeToFeatureFlagOverrides(listener) {
    this.featureFlagOverrideListeners.add(listener);
    return () => {
      this.featureFlagOverrideListeners.delete(listener);
    };
  }
  subscribeToUserTimeZone(listener) {
    this.userTimeZoneListeners.add(listener);
    return () => {
      this.userTimeZoneListeners.delete(listener);
    };
  }
  getActiveAccountScope() {
    return this.store.getActiveAccountScope();
  }
  migrateMcpCustomInstructionToServerId(args) {
    this.store.migrateMcpCustomInstructionToServerId(args);
  }
  getMcpCustomInstructions() {
    return this.store.getMcpCustomInstructions();
  }
  getMcpCustomInstructionsByServerId() {
    return this.store.getMcpCustomInstructionsByServerId();
  }
  getMcpDisabledToolsByServerId() {
    return this.store.getMcpDisabledToolsByServerId();
  }
  setMcpDisabledToolsByServerId(map4) {
    this.store.setMcpDisabledToolsByServerId(map4);
  }
  getRawMcpCustomInstruction(name17) {
    return this.store.getRawMcpCustomInstruction(name17);
  }
  getRawMcpCustomInstructionByServerId(serverId) {
    return this.store.getRawMcpCustomInstructionByServerId(serverId);
  }
  setMcpCustomInstructionByServerId(args) {
    this.store.setMcpCustomInstructionByServerId(args);
  }
  deleteMcpCustomInstructionByServerId(args) {
    this.store.deleteMcpCustomInstructionByServerId(args);
  }
};

