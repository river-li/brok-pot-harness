var import_node_fs4 = require("node:fs");
var import_node_path5 = __toESM(require("node:path"), 1);
var import_node_url3 = require("node:url");
var BOX_COMPUTER_SERVER_NAME = "cursor-box-computer";
var BUILTIN_MCP_SERVER_NAMES = /* @__PURE__ */ new Set([BOX_COMPUTER_SERVER_NAME]);
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
  const here = import_node_path5.default.dirname((0, import_node_url3.fileURLToPath)(__import_meta_url));
  return import_node_path5.default.resolve(here, "../../../projects/cursor-box-computer/dist/mcp.js");
}
function buildBoxComputerEnv(environment) {
  const env = {};
  for (const [key, value] of Object.entries(environment.childProcessEnvironment)) {
    if (typeof value === "string") {
      env[key] = value;
    }
  }
  env.SAND_BOX_COMPUTER = "1";
  const runtime = environment.boxComputer.runtime;
  if (runtime.shared) {
    env.BOX_COMPUTER_BACKEND = "shared-docker";
    env.BOX_COMPUTER_SHARED_CONTAINER_NAME = runtime.containerName;
    if (runtime.dockerHost != null) {
      env.DOCKER_HOST = runtime.dockerHost;
    } else {
      delete env.DOCKER_HOST;
    }
  }
  return env;
}
function resolveBoxComputerNodeCommand(environment) {
  const nodeBinary = environment.childProcessEnvironment.SAND_NODE_BINARY?.trim();
  if (nodeBinary != null && nodeBinary.length > 0) {
    return { command: nodeBinary, runAsNode: false };
  }
  if (process.versions.electron == null) {
    return { command: process.execPath, runAsNode: false };
  }
  if (environment.childProcessEnvironment.SAND_PACKAGED === "1") {
    return null;
  }
  return { command: process.execPath, runAsNode: true };
}
function getBuiltinMcpServers(environment) {
  const entry = environment.boxComputer.entry;
  if (!(0, import_node_fs4.existsSync)(entry)) {
    return {};
  }
  const node = resolveBoxComputerNodeCommand(environment);
  if (node == null) {
    return {};
  }
  const env = buildBoxComputerEnv(environment);
  if (node.runAsNode) {
    env.ELECTRON_RUN_AS_NODE = "1";
  }
  return {
    [BOX_COMPUTER_SERVER_NAME]: {
      type: "stdio",
      command: node.command,
      args: [entry],
      env
    }
  };
}
