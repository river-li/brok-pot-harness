/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/builtin-mcp.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path = __toESM(require("node:path"), 1);
var import_node_url = require("node:url");
var DEFAULT_BOX_CONTAINER_NAME = "cursor-box-shared";
var LOCAL_DOCKER_HOST_SENTINEL = "local";
function isTruthyFlag(value) {
  const flag = value?.trim().toLowerCase();
  return flag === "1" || flag === "true";
}
function resolveBoxComputerRuntime(opts, env) {
  const explicitShared = isTruthyFlag(env.SAND_BOX_COMPUTER_SHARED_DOCKER);
  const hostOverrideRaw = env.SAND_BOX_COMPUTER_DOCKER_HOST?.trim();
  const hostOverride = hostOverrideRaw != null && hostOverrideRaw.length > 0 && hostOverrideRaw.toLowerCase() !== LOCAL_DOCKER_HOST_SENTINEL ? hostOverrideRaw : void 0;
  const containerNameOverride = env.SAND_BOX_COMPUTER_SHARED_CONTAINER?.trim();
  const containerName = containerNameOverride != null && containerNameOverride.length > 0 ? containerNameOverride : DEFAULT_BOX_CONTAINER_NAME;
  return {
    shared: explicitShared || opts.boxMcpActive,
    containerName,
    dockerHost: hostOverride,
    dockerPath: "docker"
  };
}
function resolveBoxComputerEntry(env) {
  const override = env.SAND_BOX_COMPUTER_ENTRY?.trim();
  if (override != null && override.length > 0) {
    return override;
  }
  const here = import_node_path.default.dirname((0, import_node_url.fileURLToPath)(__import_meta_url));
  return import_node_path.default.resolve(here, "../../../projects/cursor-box-computer/dist/mcp.js");
}

