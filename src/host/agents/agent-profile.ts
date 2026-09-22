/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agents/agent-profile.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs26 = require("node:fs");
var import_node_path26 = require("node:path");

// @recovered-fragment 2/2
function hasPlaceholderProfileName(profile) {
  if (profile == null) return true;
  const name17 = profile.name.trim();
  if (name17.length === 0) return true;
  if (profile.namedBy === "user") return false;
  return isSandDefaultAgentName(name17);
}
function getSandProfilePath(agentDir) {
  return (0, import_node_path26.join)(agentDir, SAND_PROFILE_FILENAME);
}
function parseProfileJson2(path31) {
  let raw;
  try {
    raw = (0, import_node_fs26.readFileSync)(path31, "utf8");
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_profile", error42);
    return null;
  }
  return parseProfileJson(raw);
}
function readSandProfileFile(path31) {
  const parsed2 = parseProfileJson2(path31);
  if (parsed2 == null) return null;
  return profileConfigFromJson(parsed2);
}
function readLegacyProfileAvatarField(path31) {
  const avatar = parseProfileJson2(path31)?.avatar;
  if (typeof avatar !== "string") return null;
  const trimmed = avatar.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function readSandProfileServerId(path31) {
  const parsed2 = parseProfileJson2(path31);
  return parsed2 == null ? null : profileServerIdFromJson(parsed2);
}
function isSandAgentServerBound(agentDir) {
  return readSandProfileServerId(getSandProfilePath(agentDir)) !== null;
}
function readSandProfileHarness(path31) {
  const parsed2 = parseProfileJson2(path31);
  return parsed2 == null ? null : profileHarnessFromJson(parsed2);
}
function readSandProfileCreationMetadata(path31) {
  const parsed2 = parseProfileJson2(path31);
  const { origin, purpose } = parsed2 == null ? {} : profileServerBindingFromJson(parsed2);
  return { origin, purpose };
}
function writeProfileJson(path31, serialized) {
  try {
    if ((0, import_node_fs26.readFileSync)(path31, "utf8") === serialized) return;
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_profile", error42);
  }
  writeFileAtomicSync(path31, serialized);
}
function writeSandProfileFile(path31, profile) {
  const parsed2 = parseProfileJson2(path31);
  writeProfileJson(
    path31,
    serializeSandProfileFile(profile, parsed2 == null ? {} : profileServerBindingFromJson(parsed2))
  );
}
function seedRoomProfileName(seed) {
  const { agentDir, prompt } = seed;
  const path31 = getSandProfilePath(agentDir);
  const profile = readSandProfileFile(path31);
  const group = readSandGroupConfig(agentDir);
  const namedBy = profile?.namedBy;
  const room = {
    isGroup: group !== null,
    memberIds: group?.memberIds ?? [],
    ...namedBy === void 0 ? {} : { namedBy }
  };
  if (!isUnnamedSingleBotRoom(room)) return "kept";
  writeSandProfileFile(path31, {
    name: conversationNameFromPrompt(prompt),
    description: profile?.description ?? "",
    title: profile?.title ?? "",
    avatarShape: profile?.avatarShape ?? "",
    avatarColor: profile?.avatarColor ?? "",
    namedBy: "app"
  });
  return "seeded";
}
function writeServerBackedProfileFile(path31, profile, binding) {
  const previous = readSandProfileCreationMetadata(path31);
  writeProfileJson(
    path31,
    serializeSandProfileFile(profile, {
      ...binding,
      origin: binding.origin ?? previous.origin,
      purpose: binding.purpose ?? previous.purpose
    })
  );
}

