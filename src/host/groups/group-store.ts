var SAND_GROUP_FILENAME = "group.json";
function getSandGroupPath(agentDir) {
  return (0, import_node_path25.join)(agentDir, SAND_GROUP_FILENAME);
}
function normalizeMemberIds(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of raw) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed.length === 0 || seen.has(trimmed)) continue;
    seen.add(trimmed);
    if (seen.size >= GROUP_MAX_MEMBERS) break;
  }
  return [...seen];
}
function readSandGroupConfig(agentDir) {
  let raw;
  try {
    raw = (0, import_node_fs26.readFileSync)(getSandGroupPath(agentDir), "utf8");
  } catch (error42) {
    reportFallbackUnlessAbsent("group_store", error42);
    return null;
  }
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed2 == null || typeof parsed2 !== "object") return null;
  const memberIds = normalizeMemberIds(parsed2.memberIds);
  if (memberIds.length === 0) return null;
  return {
    version: typeof parsed2.version === "number" ? parsed2.version : GROUP_CONFIG_VERSION,
    memberIds
  };
}
function writeSandGroupConfig(agentDir, config2) {
  const path31 = getSandGroupPath(agentDir);
  (0, import_node_fs26.mkdirSync)((0, import_node_path25.dirname)(path31), { recursive: true });
  const serialized = `${JSON.stringify(
    {
      version: config2.version,
      memberIds: normalizeMemberIds(config2.memberIds)
    },
    null,
    2
  )}
`;
  (0, import_node_fs26.writeFileSync)(path31, serialized, "utf8");
}
function isSandGroupDir(agentDir) {
  return readSandGroupConfig(agentDir) != null;
}
