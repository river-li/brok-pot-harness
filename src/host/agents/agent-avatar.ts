var import_node_crypto57 = require("node:crypto");
var import_node_fs74 = require("node:fs");
var import_promises60 = require("node:fs/promises");
var import_node_path121 = require("node:path");
function listConventionalAvatarFilenames(agentDir) {
  let entries;
  try {
    entries = (0, import_node_fs74.readdirSync)(agentDir);
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_avatar", error42);
    return [];
  }
  return sortConventionalAvatarFilenames(entries);
}
function resolveDerivedAvatarFilename(agentDir, legacyFieldValue) {
  const conventional = listConventionalAvatarFilenames(agentDir);
  if (conventional.length > 0) return conventional[0];
  if (legacyFieldValue == null) return null;
  const resolved = resolveAvatarPathWithinDir(agentDir, legacyFieldValue);
  if (resolved == null) return null;
  try {
    if (!(0, import_node_fs74.statSync)(resolved).isFile()) return null;
    const sourceExt = (0, import_node_path121.extname)(resolved).slice(1).toLowerCase();
    const ext2 = CONVENTIONAL_AVATAR_EXTENSIONS.includes(sourceExt) ? sourceExt : extensionForMime(sniffAvatarMimeType((0, import_node_fs74.readFileSync)(resolved)) ?? "");
    if (ext2 == null) return legacyFieldValue;
    const migratedName = `avatar.${ext2}`;
    (0, import_node_fs74.copyFileSync)(resolved, (0, import_node_path121.join)(agentDir, migratedName), import_node_fs74.constants.COPYFILE_EXCL);
    return migratedName;
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_avatar", error42);
    return legacyFieldValue;
  }
}
function resolveAvatarPathWithinDir(agentDir, candidate) {
  if (candidate == null) return null;
  const trimmed = candidate.trim();
  if (trimmed.length === 0) return null;
  const reanchored = (0, import_node_path121.isAbsolute)(trimmed) ? reanchorSandPath(trimmed, { acceptBoxModelVisibleAlias: true }) : trimmed;
  const absolute = (0, import_node_path121.isAbsolute)(reanchored) ? reanchored : (0, import_node_path121.resolve)(agentDir, reanchored);
  if (!isPathWithin4(agentDir, absolute)) return null;
  let realFile;
  let realDir;
  try {
    realFile = (0, import_node_fs74.realpathSync)(absolute);
    realDir = (0, import_node_fs74.realpathSync)(agentDir);
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_avatar", error42);
    return null;
  }
  if (!isPathWithin4(realDir, realFile)) return null;
  return realFile;
}
function isPathWithin4(dir, target) {
  const rel = (0, import_node_path121.relative)(dir, target);
  return rel.length > 0 && rel !== ".." && !rel.startsWith(`..${import_node_path121.sep}`) && !(0, import_node_path121.isAbsolute)(rel);
}
async function resolveAndStatAvatar(agentDir, candidate) {
  const path31 = resolveAvatarPathWithinDir(agentDir, candidate);
  if (path31 == null) return null;
  try {
    const stats = await (0, import_promises60.stat)(path31);
    if (!stats.isFile() || stats.size === 0 || stats.size > AVATAR_MAX_BYTES) {
      return null;
    }
    return { path: path31, mtimeMs: stats.mtimeMs, size: stats.size };
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_avatar", error42);
    return null;
  }
}
async function readValidatedAvatar(agentDir, candidate) {
  const meta = await resolveAndStatAvatar(agentDir, candidate);
  if (meta == null) return null;
  try {
    const bytes = await (0, import_promises60.readFile)(meta.path);
    const mime2 = sniffAvatarMimeType(bytes);
    if (mime2 == null) return null;
    return { bytes, mime: mime2 };
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_avatar", error42);
    return null;
  }
}
async function readAvatarBytesWithinDir(agentDir, candidate) {
  return (await readValidatedAvatar(agentDir, candidate))?.bytes ?? null;
}
function avatarVersionForBytes(bytes) {
  return (0, import_node_crypto57.createHash)("sha256").update(bytes).digest("hex").slice(0, 16);
}
var avatarDataUrlCache = /* @__PURE__ */ new Map();
var AVATAR_DATA_URL_CACHE_MAX = 128;
var AVATAR_CACHE_KEY_SEP = "\0";
async function readAvatarWithinDir(agentDir, candidate) {
  const meta = await resolveAndStatAvatar(agentDir, candidate);
  if (meta == null) return null;
  const cacheKey3 = `${agentDir}${AVATAR_CACHE_KEY_SEP}${meta.path}`;
  const fingerprint2 = `${meta.mtimeMs}:${meta.size}`;
  const cached2 = avatarDataUrlCache.get(cacheKey3);
  if (cached2 != null && cached2.fingerprint === fingerprint2) {
    avatarDataUrlCache.delete(cacheKey3);
    avatarDataUrlCache.set(cacheKey3, cached2);
    return { dataUrl: cached2.dataUrl, version: cached2.version };
  }
  let bytes;
  try {
    bytes = await (0, import_promises60.readFile)(meta.path);
  } catch (error42) {
    reportFallbackUnlessAbsent("agent_avatar", error42);
    return null;
  }
  const mime2 = sniffAvatarMimeType(bytes);
  if (mime2 == null) {
    avatarDataUrlCache.delete(cacheKey3);
    return null;
  }
  const dataUrl = `data:${mime2};base64,${bytes.toString("base64")}`;
  const version3 = avatarVersionForBytes(bytes);
  avatarDataUrlCache.set(cacheKey3, { fingerprint: fingerprint2, dataUrl, version: version3 });
  if (avatarDataUrlCache.size > AVATAR_DATA_URL_CACHE_MAX) {
    const oldest = avatarDataUrlCache.keys().next().value;
    if (oldest != null && oldest !== cacheKey3) avatarDataUrlCache.delete(oldest);
  }
  return { dataUrl, version: version3 };
}
function invalidateAvatarDataUrlCache(agentDir) {
  const prefix = `${agentDir}${AVATAR_CACHE_KEY_SEP}`;
  for (const key of [...avatarDataUrlCache.keys()]) {
    if (key.startsWith(prefix)) avatarDataUrlCache.delete(key);
  }
}
