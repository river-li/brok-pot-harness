var NO_AGENT_STORE_SKILLS = {
  agentStoreSkillsDirs: [],
  userHomeDirectory: ""
};
function normalizeSkillDir(dirPath) {
  const normalized = dirPath.replace(/\\/g, "/");
  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}
function classifySkillPath(fullPath, context2) {
  const home = normalizeSkillDir(context2.userHomeDirectory);
  const normalized = fullPath.replace(/\\/g, "/");
  if (home.length > 0) {
    for (const storeSkillsDir of context2.agentStoreSkillsDirs) {
      const dir = normalizeSkillDir(storeSkillsDir);
      if (dir.length > 0 && normalized.startsWith(`${dir}/`)) {
        return {
          key: `${home}::skills/${normalized.slice(dir.length + 1)}`,
          inAgentStore: true
        };
      }
    }
  }
  return { key: dedupeKey(fullPath), inAgentStore: false };
}
function dedupeKey(fullPath) {
  const n = fullPath.replace(/\\/g, "/");
  const lower = n.toLowerCase();
  const cursorIdx = lower.indexOf("/.cursor/");
  const claudeIdx = lower.indexOf("/.claude/");
  const codexIdx = lower.indexOf("/.codex/");
  const grokIdx = lower.indexOf("/.grok/");
  const agentsIdx = lower.indexOf("/.agents/");
  if (cursorIdx !== -1) {
    const configRoot = n.slice(0, cursorIdx);
    const under = n.slice(cursorIdx + "/.cursor/".length);
    return `${configRoot}::${under}`;
  }
  if (claudeIdx !== -1) {
    const configRoot = n.slice(0, claudeIdx);
    const under = n.slice(claudeIdx + "/.claude/".length);
    return `${configRoot}::${under}`;
  }
  if (codexIdx !== -1) {
    const configRoot = n.slice(0, codexIdx);
    const under = n.slice(codexIdx + "/.codex/".length);
    return `${configRoot}::${under}`;
  }
  if (grokIdx !== -1) {
    const configRoot = n.slice(0, grokIdx);
    const under = n.slice(grokIdx + "/.grok/".length);
    return `${configRoot}::${under}`;
  }
  if (agentsIdx !== -1) {
    const configRoot = n.slice(0, agentsIdx);
    const under = n.slice(agentsIdx + "/.agents/".length);
    return `${configRoot}::${under}`;
  }
  return fullPath;
}
function dedupePreferringAgentStore(items, context2) {
  const positionByKey = /* @__PURE__ */ new Map();
  const kept = [];
  for (const item of items) {
    const { key, inAgentStore } = classifySkillPath(item.fullPath, context2);
    const position = positionByKey.get(key);
    if (position === void 0) {
      positionByKey.set(key, kept.length);
      kept.push({ item, inAgentStore });
      continue;
    }
    if (inAgentStore && !kept[position].inAgentStore) {
      kept[position] = { item, inAgentStore };
    }
  }
  return kept.map((entry) => entry.item);
}
