/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/git-core/dist/process-env.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_os12 = require("node:os");
var PINNED_GIT_CONFIG_ENTRIES = [
  ["safe.bareRepository", "explicit"],
  ["core.fsmonitor", "false"],
  ["core.hooksPath", import_node_os12.devNull],
  ["core.attributesFile", import_node_os12.devNull]
];
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
function applyPinnedGitConfig(env) {
  const count = readGitConfigCount(env);
  const result = Object.assign({}, env);
  const foundKeys = /* @__PURE__ */ new Set();
  for (let index = 0; index < count; index++) {
    const existingKey = result[`GIT_CONFIG_KEY_${index}`];
    for (const [pinnedKey, pinnedValue] of PINNED_GIT_CONFIG_ENTRIES) {
      if (existingKey === pinnedKey) {
        result[`GIT_CONFIG_VALUE_${index}`] = pinnedValue;
        foundKeys.add(pinnedKey);
      }
    }
  }
  let nextIndex = count;
  for (const [pinnedKey, pinnedValue] of PINNED_GIT_CONFIG_ENTRIES) {
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
  const merged = Object.assign(Object.assign(Object.assign(Object.assign({}, process.env), options2.spawnerEnv), { LC_ALL: "en_US.UTF-8", LANG: "en_US.UTF-8", GIT_PAGER: "cat" }), options2.optionsEnv);
  if (options2.command !== void 0) {
    merged.VSCODE_GIT_COMMAND = options2.command;
  } else {
    delete merged.VSCODE_GIT_COMMAND;
  }
  return applyPinnedGitConfig(merged);
}

