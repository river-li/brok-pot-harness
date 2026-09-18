var SAND_PROFILE_FILENAME = "profile.json";
var SAND_SETTINGS_FILENAME = "settings.json";
function parseProfileJson(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed2 == null || typeof parsed2 !== "object") return null;
  return parsed2;
}
function profileConfigFromJson(parsed2) {
  return {
    name: typeof parsed2.name === "string" ? parsed2.name : "",
    description: typeof parsed2.description === "string" ? parsed2.description : "",
    title: typeof parsed2.title === "string" ? parsed2.title.trim() : "",
    avatarShape: typeof parsed2.avatarShape === "string" ? parsed2.avatarShape.trim() : "",
    avatarColor: typeof parsed2.avatarColor === "string" ? parsed2.avatarColor.trim() : "",
    ...isSandProfileNamedBy(parsed2.namedBy) ? { namedBy: parsed2.namedBy } : {}
  };
}
function profileServerIdFromJson(parsed2) {
  if (typeof parsed2.serverId !== "string") return null;
  const trimmed = parsed2.serverId.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function profileHarnessFromJson(parsed2) {
  return parsed2.harness === "temporal" || parsed2.harness === "box" ? parsed2.harness : null;
}
function profileRoleFromJson(parsed2) {
  if (typeof parsed2.role !== "string") return null;
  const trimmed = parsed2.role.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function profileServerBindingFromJson(parsed2) {
  const serverId = profileServerIdFromJson(parsed2);
  const harness = profileHarnessFromJson(parsed2);
  const role = profileRoleFromJson(parsed2);
  return {
    ...serverId === null ? {} : { serverId },
    ...harness === null ? {} : { harness },
    ...isSandAgentOrigin(parsed2.origin) ? { origin: parsed2.origin } : {},
    ...isSandAgentPurpose(parsed2.purpose) ? { purpose: parsed2.purpose } : {},
    ...role === null ? {} : { role }
  };
}
function serializeSandProfileFile(profile, binding = {}) {
  return `${JSON.stringify(
    {
      name: profile.name,
      description: profile.description,
      title: profile.title.trim(),
      avatarShape: (profile.avatarShape ?? "").trim(),
      avatarColor: (profile.avatarColor ?? "").trim(),
      ...profile.namedBy == null ? {} : { namedBy: profile.namedBy },
      ...binding.serverId === void 0 ? {} : { serverId: binding.serverId },
      ...binding.harness === void 0 ? {} : { harness: binding.harness },
      ...binding.origin === void 0 ? {} : { origin: binding.origin },
      ...binding.purpose === void 0 ? {} : { purpose: binding.purpose },
      ...binding.role === void 0 ? {} : { role: binding.role }
    },
    null,
    2
  )}
`;
}
var DEFAULT_NOTIFY_ON_AGENT_UPDATES = true;
var DEFAULT_HIDDEN_FROM_SIDEBAR = false;
var DEFAULT_VOICE_ID = null;
function parseRawSandSettings(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return {};
  }
  if (parsed2 == null || typeof parsed2 !== "object") return {};
  return parsed2;
}
function settingsConfigFromRaw(raw) {
  return {
    notifyOnAgentUpdates: typeof raw.notifyOnAgentUpdates === "boolean" ? raw.notifyOnAgentUpdates : DEFAULT_NOTIFY_ON_AGENT_UPDATES,
    hiddenFromSidebar: typeof raw.hiddenFromSidebar === "boolean" ? raw.hiddenFromSidebar : DEFAULT_HIDDEN_FROM_SIDEBAR,
    voiceId: typeof raw.voiceId === "string" && raw.voiceId.trim().length > 0 ? raw.voiceId.trim() : DEFAULT_VOICE_ID,
    voiceSpeed: normalizeSandVoiceSpeed(raw.voiceSpeed),
    voiceLanguage: normalizeSandVoiceLanguage(raw.voiceLanguage)
  };
}
function serializeSandSettingsFile(existing, update) {
  return `${JSON.stringify({ ...existing, ...update }, null, 2)}
`;
}
