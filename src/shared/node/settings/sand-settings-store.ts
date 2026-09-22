/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/settings/sand-settings-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
var import_node_fs69 = require("node:fs");
init_zod();
init_sand_agent_model();

// @recovered-fragment 2/3
init_locale();

// @recovered-fragment 3/3
var SETTINGS_VERSION = 1;
var autoReviewInstructionsSchema = external_exports.object({
  isEnabled: external_exports.boolean().default(true),
  allowInstructions: external_exports.array(external_exports.string()).default([]),
  blockInstructions: external_exports.array(external_exports.string()).default([])
});
var SAND_DOWNGRADE_MAX_FAST_MIGRATION_ID = "downgrade-persisted-max-fast";
var SAND_SETTINGS_MIGRATION_IDS = [SAND_DOWNGRADE_MAX_FAST_MIGRATION_ID];
var notificationConfigSchema = external_exports.object({
  isEnabled: external_exports.boolean(),
  allowedApps: external_exports.array(external_exports.string()),
  minIntervalMs: external_exports.number(),
  maxPerWindow: external_exports.number(),
  windowMs: external_exports.number()
}).partial();
var desktopNotificationPreferencesSchema = external_exports.object({
  playSound: external_exports.boolean(),
  sound: external_exports.enum(SAND_NOTIFICATION_SOUND_IDS)
});
var ACCOUNT_SCOPED_SETTING_KEYS = [
  "mcpCustomInstructions",
  "mcpCustomInstructionsByServerId",
  "mcpDisabledToolsByServerId",
  "autoReviewInstructions",
  "agentDefaultModel",
  "computerUseModel",
  "localToolPermission",
  "localToolPermissionCeiling",
  "localEgressAllowed"
];
var accountScopedSettingsShape = {
  mcpCustomInstructions: external_exports.record(external_exports.string(), external_exports.string()).default({}),
  mcpCustomInstructionsByServerId: external_exports.record(external_exports.string(), external_exports.string()).default({}),
  mcpDisabledToolsByServerId: external_exports.record(external_exports.string(), external_exports.array(external_exports.string())).default({}),
  autoReviewInstructions: autoReviewInstructionsSchema.optional(),
  agentDefaultModel: sandAgentDefaultModelSchema.optional(),
  computerUseModel: sandComputerUseModelSchema.optional().catch(void 0),
  localToolPermission: external_exports.enum(SAND_LOCAL_TOOL_PERMISSIONS).optional(),
  localToolPermissionCeiling: external_exports.enum(SAND_LOCAL_TOOL_PERMISSIONS).optional(),
  localEgressAllowed: external_exports.boolean().optional()
};
var accountScopedSettingsSchema = external_exports.object(accountScopedSettingsShape);
var settingsSchema = external_exports.object({
  version: external_exports.literal(SETTINGS_VERSION),
  mcpBoxServers: external_exports.array(external_exports.string().min(1)).default([]),
  hasSeenOnboarding: external_exports.boolean().optional(),
  hasSeenOnboardingAccountScope: external_exports.string().min(1).optional(),
  selectedTeam: external_exports.object({
    teamId: external_exports.number().int().positive().safe(),
    accountScope: external_exports.string().min(1)
  }).optional().catch(void 0),
  autoUpdateWhenIdleOptIn: external_exports.boolean().default(false),
  updateTrackOverride: external_exports.enum(SAND_UPDATE_TRACKS).optional(),
  ...accountScopedSettingsShape,
  activeAccountScope: external_exports.string().min(1).optional(),
  themePreference: external_exports.enum(SAND_THEME_PREFERENCES).optional(),
  languagePreference: external_exports.enum(SAND_LANGUAGE_PREFERENCES).optional(),
  egressTunnelEnabled: external_exports.boolean().default(false),
  webauthnProxyEnabled: external_exports.boolean().default(true),
  botColorInChatEnabled: external_exports.boolean().default(false),
  messagesEnabled: external_exports.boolean().default(false),
  hardwareAccelerationEnabled: external_exports.boolean().optional(),
  notifications: notificationConfigSchema.optional(),
  desktopNotificationPreferences: desktopNotificationPreferencesSchema.optional(),
  userTimeZone: external_exports.string().min(1).optional(),
  userTimeZoneOverride: external_exports.string().min(1).optional(),
  settingsMigrations: external_exports.array(external_exports.string()).default([]),
  pinnedAgentIds: external_exports.array(external_exports.string().min(1)).optional(),
  localToolPermissionByMachineId: external_exports.record(external_exports.string(), external_exports.enum(SAND_LOCAL_TOOL_PERMISSIONS)).optional(),
  sidebarSections: external_exports.array(
    external_exports.object({
      id: external_exports.string().min(1),
      name: external_exports.string(),
      agentIds: external_exports.array(external_exports.string().min(1)),
      isCollapsed: external_exports.boolean()
    })
  ).optional(),
  accountScopes: external_exports.record(external_exports.string(), accountScopedSettingsSchema).default({})
});
var persistedSettingsSchema = settingsSchema.extend({ mcpCustomInstructionsAccountScope: external_exports.string().min(1).optional() }).transform(
  ({ mcpCustomInstructionsAccountScope: legacyScope, ...settings }) => settings.activeAccountScope === void 0 && legacyScope !== void 0 ? { ...settings, activeAccountScope: legacyScope } : settings
);
function emptySettings() {
  return {
    version: SETTINGS_VERSION,
    mcpBoxServers: [],
    autoUpdateWhenIdleOptIn: false,
    egressTunnelEnabled: false,
    webauthnProxyEnabled: true,
    botColorInChatEnabled: false,
    messagesEnabled: false,
    mcpCustomInstructions: {},
    mcpCustomInstructionsByServerId: {},
    mcpDisabledToolsByServerId: {},
    settingsMigrations: [...SAND_SETTINGS_MIGRATION_IDS],
    accountScopes: {}
  };
}
function downgradePersistedFast(model) {
  return {
    modelId: model.modelId,
    maxMode: model.maxMode,
    parameters: model.parameters.map((parameter) => ({
      id: parameter.id,
      value: parameter.id === "fast" ? "false" : parameter.value
    }))
  };
}
function normalizeCustomInstructions(raw) {
  const normalized = {};
  for (const [name17, value] of Object.entries(raw)) {
    const clamped = clampMcpCustomInstruction(value);
    if (clamped.trim().length > 0) {
      normalized[name17] = clamped;
    } else if (getDefaultMcpCustomInstruction(name17).length > 0) {
      normalized[name17] = "";
    }
  }
  return normalized;
}
var MCP_DISPLAY_SERVER_ID_KEY = /^-?[1-9]\d*$/;
function normalizeCustomInstructionsByServerId(raw) {
  const normalized = {};
  for (const [serverId, value] of Object.entries(raw)) {
    if (!MCP_DISPLAY_SERVER_ID_KEY.test(serverId)) continue;
    normalized[serverId] = clampMcpCustomInstruction(value);
  }
  return normalized;
}
function normalizeDisabledToolsByServerId(raw) {
  const normalized = {};
  for (const [serverId, toolNames] of Object.entries(raw)) {
    if (!MCP_DISPLAY_SERVER_ID_KEY.test(serverId)) continue;
    const deduped = [...new Set(toolNames.filter((name17) => name17.length > 0))];
    if (deduped.length === 0) continue;
    normalized[serverId] = deduped;
  }
  return normalized;
}
function scopeSeenRecord(settings, accountScope) {
  if (settings.hasSeenOnboarding === void 0) return {};
  const owner = settings.hasSeenOnboardingAccountScope;
  if (owner !== void 0 && owner !== accountScope) return {};
  return {
    hasSeenOnboarding: settings.hasSeenOnboarding,
    hasSeenOnboardingAccountScope: accountScope
  };
}
function withoutSeenRecord(settings) {
  const { hasSeenOnboarding: _seen, hasSeenOnboardingAccountScope: _owner, ...rest } = settings;
  return rest;
}
function copyAccountScopedSetting(target, source, key) {
  const value = source[key];
  if (value !== void 0) {
    target[key] = value;
  }
}
function accountScopedSettingsOf(settings) {
  const defined = {};
  for (const key of ACCOUNT_SCOPED_SETTING_KEYS) {
    copyAccountScopedSetting(defined, settings, key);
  }
  return { ...accountScopedSettingsSchema.parse({}), ...defined };
}
function withoutAccountScopedSettings(settings) {
  const rest = { ...settings };
  for (const key of ACCOUNT_SCOPED_SETTING_KEYS) {
    delete rest[key];
  }
  return rest;
}
function withSortedKeys(value) {
  if (Array.isArray(value)) return value.map(withSortedKeys);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).sort(([left], [right]) => {
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    }).map(([key, entry]) => [key, withSortedKeys(entry)])
  );
}
function createNodeSettingsFileIo(settingsPath) {
  return {
    readText: () => (0, import_node_fs69.existsSync)(settingsPath) ? (0, import_node_fs69.readFileSync)(settingsPath, "utf-8") : void 0,
    writeText: (contents) => {
      writeFileAtomicSync(settingsPath, contents);
    }
  };
}
var SandSettingsStore = class _SandSettingsStore {
  io;
  constructor(settingsPath, io2 = createNodeSettingsFileIo(settingsPath)) {
    this.io = io2;
  }
  load() {
    const raw = this.io.readText();
    if (raw === void 0) {
      return emptySettings();
    }
    try {
      const parsed2 = persistedSettingsSchema.safeParse(JSON.parse(raw));
      if (parsed2.success) {
        const loaded = {
          version: SETTINGS_VERSION,
          mcpBoxServers: [...new Set(parsed2.data.mcpBoxServers)],
          ...parsed2.data.hasSeenOnboarding !== void 0 ? { hasSeenOnboarding: parsed2.data.hasSeenOnboarding } : {},
          ...parsed2.data.hasSeenOnboardingAccountScope !== void 0 ? { hasSeenOnboardingAccountScope: parsed2.data.hasSeenOnboardingAccountScope } : {},
          ...parsed2.data.selectedTeam !== void 0 ? { selectedTeam: parsed2.data.selectedTeam } : {},
          autoUpdateWhenIdleOptIn: parsed2.data.autoUpdateWhenIdleOptIn,
          egressTunnelEnabled: parsed2.data.egressTunnelEnabled,
          webauthnProxyEnabled: parsed2.data.webauthnProxyEnabled,
          botColorInChatEnabled: parsed2.data.botColorInChatEnabled,
          messagesEnabled: parsed2.data.messagesEnabled,
          ...parsed2.data.hardwareAccelerationEnabled !== void 0 ? { hardwareAccelerationEnabled: parsed2.data.hardwareAccelerationEnabled } : {},
          ...accountScopedSettingsOf(parsed2.data),
          mcpCustomInstructions: normalizeCustomInstructions(parsed2.data.mcpCustomInstructions),
          mcpCustomInstructionsByServerId: normalizeCustomInstructionsByServerId(
            parsed2.data.mcpCustomInstructionsByServerId
          ),
          mcpDisabledToolsByServerId: normalizeDisabledToolsByServerId(
            parsed2.data.mcpDisabledToolsByServerId
          ),
          ...parsed2.data.activeAccountScope !== void 0 ? { activeAccountScope: parsed2.data.activeAccountScope } : {},
          settingsMigrations: parsed2.data.settingsMigrations,
          ...parsed2.data.updateTrackOverride !== void 0 ? { updateTrackOverride: parsed2.data.updateTrackOverride } : {},
          ...parsed2.data.themePreference !== void 0 ? { themePreference: parsed2.data.themePreference } : {},
          ...parsed2.data.languagePreference !== void 0 ? { languagePreference: parsed2.data.languagePreference } : {},
          ...parsed2.data.notifications !== void 0 ? { notifications: parsed2.data.notifications } : {},
          ...parsed2.data.desktopNotificationPreferences !== void 0 ? { desktopNotificationPreferences: parsed2.data.desktopNotificationPreferences } : {},
          ...parsed2.data.userTimeZone !== void 0 ? { userTimeZone: parsed2.data.userTimeZone } : {},
          ...parsed2.data.userTimeZoneOverride !== void 0 ? { userTimeZoneOverride: parsed2.data.userTimeZoneOverride } : {},
          ...parsed2.data.autoReviewInstructions !== void 0 ? {
            autoReviewInstructions: (() => {
              const normalized = normalizeSandAutoReviewInstructions(
                parsed2.data.autoReviewInstructions
              );
              return {
                isEnabled: normalized.isEnabled,
                allowInstructions: [...normalized.allowInstructions],
                blockInstructions: [...normalized.blockInstructions]
              };
            })()
          } : {},
          ...parsed2.data.pinnedAgentIds !== void 0 ? { pinnedAgentIds: [...new Set(parsed2.data.pinnedAgentIds)] } : {},
          ...parsed2.data.localToolPermissionByMachineId !== void 0 ? { localToolPermissionByMachineId: parsed2.data.localToolPermissionByMachineId } : {},
          ...parsed2.data.sidebarSections !== void 0 ? {
            sidebarSections: _SandSettingsStore.storable({
              sections: parsed2.data.sidebarSections
            })
          } : {},
          accountScopes: parsed2.data.accountScopes
        };
        return this.applyPendingMigrations(loaded);
      }
    } catch {
    }
    return emptySettings();
  }
  applyPendingMigrations(settings) {
    if (settings.settingsMigrations.includes(SAND_DOWNGRADE_MAX_FAST_MIGRATION_ID)) {
      return settings;
    }
    const migrated = {
      ...settings,
      settingsMigrations: [...settings.settingsMigrations, SAND_DOWNGRADE_MAX_FAST_MIGRATION_ID],
      ...settings.agentDefaultModel !== void 0 ? {
        agentDefaultModel: downgradePersistedFast(settings.agentDefaultModel)
      } : {}
    };
    try {
      this.persist(migrated);
    } catch {
    }
    return migrated;
  }
  persist(settings) {
    const contents = JSON.stringify(withSortedKeys(settings), null, 2);
    if (contents === this.io.readText()) return;
    this.io.writeText(contents);
  }
  getHasSeenOnboarding() {
    return this.load().hasSeenOnboarding;
  }
  setHasSeenOnboarding(value) {
    const { hasSeenOnboardingAccountScope: _previous, ...rest } = this.load();
    this.persist({
      ...rest,
      hasSeenOnboarding: value,
      ...rest.activeAccountScope !== void 0 ? { hasSeenOnboardingAccountScope: rest.activeAccountScope } : {}
    });
  }
  clearHasSeenOnboarding() {
    const settings = this.load();
    if (settings.hasSeenOnboarding === void 0 && settings.hasSeenOnboardingAccountScope === void 0) {
      return;
    }
    const {
      hasSeenOnboarding: _seen,
      hasSeenOnboardingAccountScope: _owner,
      ...cleared
    } = settings;
    this.persist(cleared);
  }
  getSelectedTeam() {
    return this.load().selectedTeam;
  }
  setSelectedTeam(value) {
    const { selectedTeam: _previous, ...settings } = this.load();
    this.persist({
      ...settings,
      ...value !== void 0 ? { selectedTeam: value } : {}
    });
  }
  getAutoUpdateWhenIdleOptIn() {
    return this.load().autoUpdateWhenIdleOptIn;
  }
  setAutoUpdateWhenIdleOptIn(value) {
    this.persist({ ...this.load(), autoUpdateWhenIdleOptIn: value });
  }
  getThemePreference() {
    return this.load().themePreference ?? DEFAULT_SAND_THEME_PREFERENCE;
  }
  setThemePreference(preference) {
    this.persist({ ...this.load(), themePreference: preference });
  }
  getLanguagePreference() {
    return this.load().languagePreference ?? DEFAULT_SAND_LANGUAGE_PREFERENCE;
  }
  setLanguagePreference(preference) {
    this.persist({ ...this.load(), languagePreference: preference });
  }
  getEgressTunnelEnabled() {
    return this.load().egressTunnelEnabled;
  }
  setEgressTunnelEnabled(value) {
    this.persist({ ...this.load(), egressTunnelEnabled: value });
  }
  getWebauthnProxyEnabled() {
    return this.load().webauthnProxyEnabled;
  }
  setWebauthnProxyEnabled(value) {
    this.persist({ ...this.load(), webauthnProxyEnabled: value });
  }
  getBotColorInChatEnabled() {
    return this.load().botColorInChatEnabled;
  }
  setBotColorInChatEnabled(value) {
    this.persist({ ...this.load(), botColorInChatEnabled: value });
  }
  getMessagesEnabled() {
    return this.load().messagesEnabled;
  }
  setMessagesEnabled(value) {
    this.persist({ ...this.load(), messagesEnabled: value });
  }
  getHardwareAccelerationEnabled() {
    return this.load().hardwareAccelerationEnabled;
  }
  setHardwareAccelerationEnabled(value) {
    this.persist({ ...this.load(), hardwareAccelerationEnabled: value });
  }
  getDesktopNotificationPreferences() {
    return this.load().desktopNotificationPreferences ?? DEFAULT_SAND_NOTIFICATION_PREFERENCES;
  }
  setDesktopNotificationPreferences(preferences) {
    this.persist({ ...this.load(), desktopNotificationPreferences: preferences });
  }
  getAgentDefaultModel() {
    return this.load().agentDefaultModel;
  }
  setAgentDefaultModel(model) {
    const { agentDefaultModel: _previous, ...rest } = this.load();
    this.persist(
      model === void 0 ? rest : {
        ...rest,
        agentDefaultModel: {
          modelId: model.modelId,
          maxMode: model.maxMode,
          parameters: model.parameters.map((p2) => ({ id: p2.id, value: p2.value }))
        }
      }
    );
  }
  getComputerUseModel() {
    return this.load().computerUseModel;
  }
  setComputerUseModel(model) {
    const { computerUseModel: _previous, ...rest } = this.load();
    this.persist(
      model === void 0 ? rest : {
        ...rest,
        computerUseModel: {
          modelId: model.modelId,
          maxMode: model.maxMode,
          parameters: model.parameters.map((p2) => ({
            id: p2.id,
            value: p2.value
          }))
        }
      }
    );
  }
  getUpdateTrackOverride() {
    const stored = this.load().updateTrackOverride ?? null;
    if (stored == null) {
      return null;
    }
    const coerced = coerceToEnabledTrack(stored);
    if (coerced !== stored) {
      try {
        this.setUpdateTrackOverride(coerced);
      } catch {
      }
    }
    return coerced;
  }
  setUpdateTrackOverride(track) {
    const { updateTrackOverride: _previous, ...rest } = this.load();
    this.persist(track == null ? rest : { ...rest, updateTrackOverride: track });
  }
  getMcpCustomInstructions() {
    return this.load().mcpCustomInstructions;
  }
  setMcpCustomInstructions(map4) {
    this.persist({
      ...this.load(),
      mcpCustomInstructions: normalizeCustomInstructions(map4)
    });
  }
  getMcpCustomInstructionsByServerId() {
    return this.load().mcpCustomInstructionsByServerId;
  }
  getActiveAccountScope() {
    return this.load().activeAccountScope;
  }
  getHeldAccountScopes() {
    const current = this.load();
    const parked2 = Object.keys(current.accountScopes);
    return current.activeAccountScope === void 0 || parked2.includes(current.activeAccountScope) ? parked2 : [...parked2, current.activeAccountScope];
  }
  scopeToAccount(accountScope) {
    const current = this.load();
    const seenRecord = scopeSeenRecord(current, accountScope);
    if (current.activeAccountScope === accountScope) {
      if (current.hasSeenOnboardingAccountScope !== seenRecord.hasSeenOnboardingAccountScope) {
        this.persist({ ...withoutSeenRecord(current), ...seenRecord });
      }
      return;
    }
    const { [accountScope]: parked2, ...otherScopes } = current.accountScopes;
    const departingScope = current.activeAccountScope;
    const accountScopes = departingScope === void 0 ? otherScopes : { ...otherScopes, [departingScope]: accountScopedSettingsOf(current) };
    if (departingScope === void 0 && parked2 === void 0) {
      this.persist({
        ...withoutSeenRecord(current),
        ...seenRecord,
        activeAccountScope: accountScope,
        accountScopes
      });
      return;
    }
    const settings = withoutAccountScopedSettings(withoutSeenRecord(current));
    this.persist({
      ...settings,
      ...seenRecord,
      activeAccountScope: accountScope,
      accountScopes,
      ...parked2 ?? accountScopedSettingsSchema.parse({})
    });
  }
  clearAccountScope() {
    const { activeAccountScope: _accountScope, ...settings } = withoutAccountScopedSettings(
      this.load()
    );
    this.persist({
      ...settings,
      ...accountScopedSettingsSchema.parse({})
    });
  }
  parkAccountScope() {
    const current = this.load();
    const departingScope = current.activeAccountScope;
    if (departingScope !== void 0) {
      this.persist({
        ...current,
        accountScopes: {
          ...current.accountScopes,
          [departingScope]: accountScopedSettingsOf(current)
        }
      });
    }
    this.clearAccountScope();
  }
  forgetAccountScope(accountScope) {
    const current = this.load();
    if (current.accountScopes[accountScope] === void 0) return;
    const { [accountScope]: _dropped, ...accountScopes } = current.accountScopes;
    this.persist({ ...current, accountScopes });
  }
  setMcpCustomInstructionsByServerId(map4) {
    this.persist({
      ...this.load(),
      mcpCustomInstructionsByServerId: normalizeCustomInstructionsByServerId(map4)
    });
  }
  getMcpDisabledToolsByServerId() {
    return this.load().mcpDisabledToolsByServerId;
  }
  setMcpDisabledToolsByServerId(map4) {
    this.persist({
      ...this.load(),
      mcpDisabledToolsByServerId: normalizeDisabledToolsByServerId(map4)
    });
  }
  getUserTimeZone() {
    const settings = this.load();
    return settings.userTimeZoneOverride ?? settings.userTimeZone;
  }
  getDetectedUserTimeZone() {
    return this.load().userTimeZone;
  }
  getUserTimeZoneOverride() {
    return this.load().userTimeZoneOverride;
  }
  setUserTimeZone(timeZone) {
    const { userTimeZone: _previous, ...rest } = this.load();
    const trimmed = timeZone?.trim();
    this.persist(trimmed != null && trimmed.length > 0 ? { ...rest, userTimeZone: trimmed } : rest);
  }
  setUserTimeZoneOverride(timeZone) {
    const { userTimeZoneOverride: _previous, ...rest } = this.load();
    const trimmed = timeZone?.trim();
    this.persist(
      trimmed != null && trimmed.length > 0 ? { ...rest, userTimeZoneOverride: trimmed } : rest
    );
  }
  getMcpBoxServers() {
    return this.load().mcpBoxServers;
  }
  setMcpBoxServers(names3) {
    this.persist({
      ...this.load(),
      mcpBoxServers: [...new Set(names3)]
    });
  }
  getRawMcpCustomInstruction(name17) {
    return this.load().mcpCustomInstructions[name17];
  }
  getRawMcpCustomInstructionByServerId(serverId) {
    return this.load().mcpCustomInstructionsByServerId[serverId];
  }
  setMcpCustomInstructionByServerId(args) {
    const { serverId, displayName: displayName2, value, mirrorLegacyName } = args;
    const current = this.load();
    const byServerId = { ...current.mcpCustomInstructionsByServerId };
    byServerId[serverId] = clampMcpCustomInstruction(value);
    const legacy = { ...current.mcpCustomInstructions };
    if (mirrorLegacyName) {
      const clamped = clampMcpCustomInstruction(value);
      if (clamped.trim().length > 0 || getDefaultMcpCustomInstruction(displayName2).length > 0) {
        legacy[displayName2] = clamped;
      } else {
        delete legacy[displayName2];
      }
    } else {
      delete legacy[displayName2];
    }
    this.persist({
      ...current,
      mcpCustomInstructionsByServerId: byServerId,
      mcpCustomInstructions: legacy
    });
  }
  migrateMcpCustomInstructionToServerId(args) {
    const { serverId, displayName: displayName2 } = args;
    const current = this.load();
    if (current.mcpCustomInstructionsByServerId[serverId] !== void 0) return;
    const legacy = current.mcpCustomInstructions[displayName2];
    if (legacy === void 0) return;
    this.persist({
      ...current,
      mcpCustomInstructionsByServerId: {
        ...current.mcpCustomInstructionsByServerId,
        [serverId]: legacy
      }
    });
  }
  deleteMcpCustomInstructionByServerId(args) {
    const { serverId, displayName: displayName2, deleteLegacyName } = args;
    const current = this.load();
    const byServerId = { ...current.mcpCustomInstructionsByServerId };
    delete byServerId[serverId];
    const legacy = { ...current.mcpCustomInstructions };
    if (deleteLegacyName) {
      delete legacy[displayName2];
    }
    this.persist({
      ...current,
      mcpCustomInstructionsByServerId: byServerId,
      mcpCustomInstructions: legacy
    });
  }
  setMcpCustomInstruction(name17, value) {
    const current = this.load();
    const next = { ...current.mcpCustomInstructions };
    const clamped = clampMcpCustomInstruction(value);
    if (clamped.trim().length === 0) {
      if (getDefaultMcpCustomInstruction(name17).length > 0) {
        next[name17] = "";
      } else {
        delete next[name17];
      }
    } else {
      next[name17] = clamped;
    }
    this.persist({ ...current, mcpCustomInstructions: next });
  }
  getNotificationConfig() {
    const current = this.load();
    if (current.notifications?.isEnabled !== false || Object.keys(current.notifications).length !== 1) {
      this.persist({ ...current, notifications: { isEnabled: false } });
    }
    return SAND_DISABLED_NOTIFICATION_CONFIG;
  }
  setNotificationConfig(_input) {
    this.persist({
      ...this.load(),
      notifications: { isEnabled: false }
    });
  }
  deleteMcpCustomInstruction(name17) {
    const current = this.load();
    if (!(name17 in current.mcpCustomInstructions)) return;
    const next = { ...current.mcpCustomInstructions };
    delete next[name17];
    this.persist({ ...current, mcpCustomInstructions: next });
  }
  getAutoReviewInstructions() {
    return this.load().autoReviewInstructions ?? DEFAULT_SAND_AUTO_REVIEW_INSTRUCTIONS;
  }
  setAutoReviewInstructions(instructions) {
    const normalized = normalizeSandAutoReviewInstructions(instructions);
    const { autoReviewInstructions: _previous, ...rest } = this.load();
    if (normalized.isEnabled && normalized.allowInstructions.length === 0 && normalized.blockInstructions.length === 0) {
      this.persist(rest);
      return;
    }
    this.persist({
      ...rest,
      autoReviewInstructions: {
        isEnabled: normalized.isEnabled,
        allowInstructions: [...normalized.allowInstructions],
        blockInstructions: [...normalized.blockInstructions]
      }
    });
  }
  getLocalToolPermission() {
    const settings = this.load();
    return resolveSandLocalToolPermission(
      settings.localToolPermission ?? SAND_DEFAULT_LOCAL_TOOL_PERMISSION,
      settings.localToolPermissionCeiling
    );
  }
  getLocalToolPermissionChoice() {
    return this.load().localToolPermission ?? SAND_DEFAULT_LOCAL_TOOL_PERMISSION;
  }
  getLocalToolPermissionCeiling() {
    return this.load().localToolPermissionCeiling;
  }
  setLocalToolPermission(permission) {
    this.persist({ ...this.load(), localToolPermission: permission });
  }
  setLocalToolPermissionCeiling(ceiling) {
    const { localToolPermissionCeiling: _dropped, ...rest } = this.load();
    this.persist(ceiling === void 0 ? rest : { ...rest, localToolPermissionCeiling: ceiling });
  }
  getLocalEgressAllowed() {
    return this.load().localEgressAllowed;
  }
  setLocalEgressAllowed(allowed) {
    const { localEgressAllowed: _dropped, ...rest } = this.load();
    this.persist(allowed === void 0 ? rest : { ...rest, localEgressAllowed: allowed });
  }
  getLocalToolPermissionForMachine(machineId) {
    const settings = this.load();
    const standing = settings.localToolPermissionByMachineId?.[machineId];
    return standing === void 0 ? void 0 : resolveSandLocalToolPermission(standing, settings.localToolPermissionCeiling);
  }
  setLocalToolPermissionForMachine(machineId, permission) {
    if (machineId.length === 0) return;
    const current = this.load();
    this.persist({
      ...current,
      localToolPermissionByMachineId: {
        ...current.localToolPermissionByMachineId,
        [machineId]: permission
      }
    });
  }
  getPinnedAgentIds() {
    return this.load().pinnedAgentIds;
  }
  setPinnedAgentIds(ids) {
    this.persist({ ...this.load(), pinnedAgentIds: [...new Set(ids)] });
  }
  static storable({ sections, stored }) {
    return SidebarSections.carryFolds({ sections, stored }).map((section) => ({
      id: section.id,
      name: section.name,
      agentIds: [...section.agentIds],
      isCollapsed: section.isCollapsed
    }));
  }
  getSidebarSections() {
    const stored = this.load().sidebarSections;
    return stored === void 0 ? void 0 : SidebarSections.carryFolds({ sections: stored });
  }
  setSidebarSections(sections) {
    const current = this.load();
    this.persist({
      ...current,
      sidebarSections: _SandSettingsStore.storable({
        sections,
        stored: current.sidebarSections
      })
    });
  }
};

