async function setAgentAvatarBytes(host, db, dbPath, agentId, pngBytes, activeAgentId) {
  const agentDir = (0, import_node_path141.dirname)(dbPath);
  for (const name17 of listConventionalAvatarFilenames(agentDir)) {
    await (0, import_promises67.rm)((0, import_node_path141.join)(agentDir, name17), { force: true });
  }
  if (pngBytes == null) {
    const existing = db.getSandProfile();
    if (existing.avatarPath != null) {
      db.setSandProfile({ description: existing.description, avatarPath: null });
    }
    const profilePath = getSandProfilePath(agentDir);
    if (readLegacyProfileAvatarField(profilePath) != null) {
      const current = readSandProfileFile(profilePath);
      if (current != null) writeSandProfileFile(profilePath, current);
    }
  } else {
    const { writeFile: writeFile19, mkdir: mkdir25 } = await import("node:fs/promises");
    await mkdir25(agentDir, { recursive: true });
    await writeFile19((0, import_node_path141.join)(agentDir, CANONICAL_AVATAR_FILENAME), Buffer.from(pngBytes));
  }
  invalidateAvatarDataUrlCache(agentDir);
  const dbStats = await statIfExists(dbPath);
  return await buildSummary({
    extras: loadAgentDbExtras(db, dbPath, agentId, dbStats),
    dbPath,
    dirName: agentId,
    dbStats,
    activeAgentId,
    includeBlank: true,
    agentHasMemory: (candidate) => host.memory.agentHasContent(candidate)
  });
}
async function recoverAgentWithMissingDb(host, args) {
  const { dbPath, dirName, activeAgentId } = args;
  if (host.isAgentBeingDeleted(dirName)) return null;
  const agentDir = (0, import_node_path141.dirname)(dbPath);
  const dirIntact = (0, import_node_fs87.existsSync)(getSandProfilePath(agentDir)) || await agentHasDurableFootprint(
    agentDir,
    (candidate) => host.memory.agentHasContent(candidate)
  );
  if (!dirIntact) return null;
  if (host.isAgentBeingDeleted(dirName)) return null;
  let dbStats;
  if (!hasLiveSandAgentDbHandle(dbPath)) {
    host.reseedMinimalStoreDbIfMissing(dbPath);
    dbStats = await statIfExists(dbPath);
  }
  return await buildSummary({
    extras: null,
    dbPath,
    dirName,
    dbStats,
    activeAgentId,
    includeBlank: true,
    agentHasMemory: (candidate) => host.memory.agentHasContent(candidate)
  });
}
