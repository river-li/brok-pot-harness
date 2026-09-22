/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/session-profile-files.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function updateAgentProfile(host, agentId, profile) {
  return await host.withAgentDb(agentId, async (db, dbPath) => {
    host.writeAgentProfileFile(agentId, profile);
    const dbStats = await host.statOpenDb({ dbPath, agentId });
    return await buildSummary({
      extras: loadAgentDbExtras(db, dbPath, agentId, dbStats),
      dbPath,
      dirName: agentId,
      dbStats,
      activeAgentId: void 0,
      includeBlank: true,
      agentHasMemory: (candidate) => host.memory.agentHasContent(candidate)
    });
  });
}
function getAgentProfileText(host, agentId) {
  const profile = readSandProfileFile(getSandProfilePath(host.getAgentDir(agentId)));
  if (profile == null) return null;
  return {
    name: profile.name,
    description: profile.description,
    title: profile.title,
    avatarShape: profile.avatarShape,
    avatarColor: profile.avatarColor
  };
}
async function getAgentAvatar(host, agentId) {
  const agentDir = host.getAgentDir(agentId);
  const derived = resolveDerivedAvatarFilename(
    agentDir,
    readLegacyProfileAvatarField(getSandProfilePath(agentDir))
  );
  const avatar = await readAvatarWithinDir(agentDir, derived) ?? await readLegacyStoredAvatar(host, agentId, readAvatarWithinDir);
  return { version: avatar?.version ?? null, dataUrl: avatar?.dataUrl ?? null };
}
var AVATAR_DATA_URL_PATTERN = /^data:([a-z0-9.+/-]+);base64,(.*)$/i;
function base64ByteCount(payload) {
  let padding = 0;
  if (payload.endsWith("==")) {
    padding = 2;
  } else if (payload.endsWith("=")) {
    padding = 1;
  }
  return Math.floor(payload.length * 3 / 4) - padding;
}
async function getAgentNotificationAvatar(host, agentId) {
  const profile = getAgentProfileText(host, agentId);
  const { version: version3, dataUrl } = await getAgentAvatar(host, agentId);
  const mark = resolveGrokBotMark({
    agentId,
    avatarShape: profile?.avatarShape,
    avatarColor: profile?.avatarColor
  });
  const parsed2 = dataUrl == null ? null : AVATAR_DATA_URL_PATTERN.exec(dataUrl);
  return {
    name: profile?.name ?? null,
    shape: mark.shape,
    color: mark.color,
    avatarVersion: version3,
    avatarContentType: parsed2?.[1]?.toLowerCase() ?? null,
    avatarByteCount: parsed2?.[2] == null ? null : base64ByteCount(parsed2[2])
  };
}
async function readLegacyStoredAvatar(host, agentId, read) {
  if (!host.agentExists(agentId)) return null;
  const agentDir = host.getAgentDir(agentId);
  return await host.withAgentDb(
    agentId,
    async (db) => read(agentDir, db.getSandProfile().avatarPath)
  );
}
async function getAgentAvatarPng(host, agentId) {
  const agentDir = host.getAgentDir(agentId);
  const derived = resolveDerivedAvatarFilename(
    agentDir,
    readLegacyProfileAvatarField(getSandProfilePath(agentDir))
  );
  return await readAvatarBytesWithinDir(agentDir, derived) ?? await readLegacyStoredAvatar(host, agentId, readAvatarBytesWithinDir);
}

