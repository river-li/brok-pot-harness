var import_node_os11 = require("node:os");
var BARE_REPO_GUARD_ENTRIES = [
  ["safe.bareRepository", "explicit"]
];
var REPO_CONFIG_EXECUTION_GUARD_ENTRIES = [
  ["core.fsmonitor", "false"],
  ["core.hooksPath", import_node_os11.devNull],
  ["core.attributesFile", import_node_os11.devNull]
];
function pinnedEntriesFor(policy) {
  const repoConfigEntries = policy === "allow-hooks" ? REPO_CONFIG_EXECUTION_GUARD_ENTRIES.filter(([key]) => key !== "core.hooksPath") : REPO_CONFIG_EXECUTION_GUARD_ENTRIES;
  return [...BARE_REPO_GUARD_ENTRIES, ...repoConfigEntries];
}
function readGitConfigCount(env) {
  const raw = env.GIT_CONFIG_COUNT;
  if (raw === void 0 || raw === "") {
    return 0;
  }
  const parsed2 = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed2) || parsed2 < 0) {
    return 0;
  }
  return parsed2;
}
function applyPinnedGitConfig(env, pinnedEntries) {
  const count = readGitConfigCount(env);
  const result = Object.assign({}, env);
  const foundKeys = /* @__PURE__ */ new Set();
  for (let index = 0; index < count; index++) {
    const existingKey = result[`GIT_CONFIG_KEY_${index}`];
    for (const [pinnedKey, pinnedValue] of pinnedEntries) {
      if (existingKey === pinnedKey) {
        result[`GIT_CONFIG_VALUE_${index}`] = pinnedValue;
        foundKeys.add(pinnedKey);
      }
    }
  }
  let nextIndex = count;
  for (const [pinnedKey, pinnedValue] of pinnedEntries) {
    if (foundKeys.has(pinnedKey)) {
      continue;
    }
    result[`GIT_CONFIG_KEY_${nextIndex}`] = pinnedKey;
    result[`GIT_CONFIG_VALUE_${nextIndex}`] = pinnedValue;
    nextIndex++;
  }
  if (nextIndex !== count) {
    result.GIT_CONFIG_COUNT = String(nextIndex);
  }
  return result;
}
function createGitProcessEnv(options2) {
  var _a19;
  const merged = Object.assign(Object.assign(Object.assign(Object.assign({}, process.env), options2.spawnerEnv), { LC_ALL: "en_US.UTF-8", LANG: "en_US.UTF-8", GIT_PAGER: "cat" }), options2.optionsEnv);
  if (options2.command !== void 0) {
    merged.VSCODE_GIT_COMMAND = options2.command;
  } else {
    delete merged.VSCODE_GIT_COMMAND;
  }
  return applyPinnedGitConfig(merged, pinnedEntriesFor((_a19 = options2.repoConfigExecution) !== null && _a19 !== void 0 ? _a19 : "block"));
}
