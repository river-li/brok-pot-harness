function isLiveReferencePointerBody(body) {
  return body.includes("is a live reference to the skill at");
}
function normalizePluginSkillSourceUrl(raw) {
  let parsed2;
  try {
    parsed2 = new URL(raw);
  } catch {
    return raw;
  }
  const segments = parsed2.pathname.split("/").filter((part) => part.length > 0);
  const [owner, repo, marker17, ref, ...path31] = segments;
  if (owner == null || repo == null || marker17 !== "blob" || ref == null || path31.length === 0) {
    return raw;
  }
  return `${parsed2.hostname.toLowerCase()}/${owner}/${repo}/${path31.join("/")}`;
}
function removeSkillLiveReferences(sandRootDir, sourceUrls) {
  if (sourceUrls.length === 0) return 0;
  const refs = new Set(sourceUrls.map(normalizePluginSkillSourceUrl));
  const library = new GlobalSkillLibrary(getGlobalSkillsDir(sandRootDir));
  let removed = 0;
  for (const record2 of library.list()) {
    if (record2.sourceRef != null && refs.has(normalizePluginSkillSourceUrl(record2.sourceRef)) && isLiveReferencePointerBody(record2.body) && library.remove(record2.id)) {
      removed += 1;
    }
  }
  return removed;
}
function skillPathTail(path31) {
  const normalized = path31.replaceAll("\\", "/");
  const index = normalized.lastIndexOf("/skills/");
  return index === -1 ? null : normalized.slice(index + 1);
}
function collectMaterializedSkillSourceUrls(catalog, records2) {
  const materialized2 = new Set(
    records2.flatMap((record2) => {
      const tail = skillPathTail(record2.filePath);
      return tail != null ? [`${record2.pluginId}\0${tail}`] : [];
    })
  );
  return catalog.flatMap(
    (plugin) => plugin.skills.flatMap((skill) => {
      if (skill.sourceUrl == null) return [];
      const tail = skillPathTail(skill.sourceUrl);
      return tail != null && materialized2.has(`${plugin.pluginId}\0${tail}`) ? [skill.sourceUrl] : [];
    })
  );
}
async function sweepLegacyPluginSkillReferences(deps) {
  const records2 = readPluginSkillsCache(getPluginSkillsDir(deps.sandRootDir))?.skills ?? [];
  if (records2.length === 0) return 0;
  try {
    const { plugins } = await fetchMarketplaceMcpPlugins(
      async () => {
        const token = await deps.auth.getAccessToken({
          backendUrl: deps.backend.backendUrl
        });
        return token.length > 0 ? token : null;
      },
      deps.auth.getMachineId,
      marketplaceDashboardClientFor(deps.backend)
    );
    const removed = removeSkillLiveReferences(
      deps.sandRootDir,
      collectMaterializedSkillSourceUrls(plugins, records2)
    );
    if (removed > 0) {
      deps.log(`[sand:plugin-skills] retired ${removed} legacy live-reference record(s)`);
    }
    return removed;
  } catch (error42) {
    deps.log(`[sand:plugin-skills] legacy live-reference sweep failed: ${errorLogTag(error42)}`);
    return 0;
  }
}
