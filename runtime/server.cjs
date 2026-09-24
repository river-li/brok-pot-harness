#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { randomBytes } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { parseEnv } = require("node:util");

const root = path.resolve(__dirname, "..");
const defaultStateDir = path.join(root, ".runtime", "server");
const serverEnvName = "server.env";

function configuredPath(value, fallback) {
  return path.resolve(root, value || fallback);
}

function serverConfig(env = process.env) {
  const stateDir = configuredPath(env.GBH_SERVER_STATE_DIR, defaultStateDir);
  const projectName = env.GBH_SERVER_PROJECT || "gbh-server";
  const gatewayPort = Number(env.GBH_SERVER_GATEWAY_PORT || 1540);
  const vncPort = Number(env.GBH_SERVER_VNC_PORT || 6180);
  const vncControlPort = Number(env.GBH_SERVER_VNC_CONTROL_PORT || 6181);
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(projectName)) {
    throw new Error("GBH_SERVER_PROJECT must use lowercase letters, digits, _ or -.");
  }
  for (const [name, port] of [
    ["GBH_SERVER_GATEWAY_PORT", gatewayPort],
    ["GBH_SERVER_VNC_PORT", vncPort],
    ["GBH_SERVER_VNC_CONTROL_PORT", vncControlPort],
  ]) {
    if (!Number.isInteger(port) || port < 1024 || port > 65535) {
      throw new Error(`${name} must be between 1024 and 65535.`);
    }
  }
  return {
    stateDir,
    dataDir: path.join(stateDir, "data"),
    workspaceDir: path.join(stateDir, "workspace"),
    modelsDir: path.join(stateDir, "models"),
    envFile: configuredPath(env.GBH_SERVER_ENV_FILE, path.join(stateDir, serverEnvName)),
    projectName,
    gatewayPort,
    vncPort,
    vncControlPort,
  };
}

function ensureDir(directory, mode, { preserveForeignOwner = false } = {}) {
  fs.mkdirSync(directory, { recursive: true, mode });
  const stat = fs.lstatSync(directory);
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`Server state directory must be a real directory: ${directory}.`);
  }
  const uid = typeof process.getuid === "function" ? process.getuid() : null;
  if (preserveForeignOwner && uid !== null && stat.uid !== uid) return;
  fs.chmodSync(directory, mode);
}

function writeFileAtomic(file, content, mode = 0o600) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(temporary, content, { flag: "wx", mode });
  fs.renameSync(temporary, file);
  fs.chmodSync(file, mode);
}

function writeSecret(file) {
  const value = randomBytes(32).toString("base64url");
  writeFileAtomic(file, `${value}\n`);
  return value;
}

function readOrCreateSecret(file) {
  try {
    fs.chmodSync(file, 0o600);
    const value = fs.readFileSync(file, "utf8").trim();
    if (value.length < 32) {
      throw new Error(`${path.basename(file)} is invalid; inspect it before replacing it.`);
    }
    return value;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return writeSecret(file);
  }
}

function serverEnvTemplate() {
  return [
    "# Server-side Responses API settings. Keep this file private.",
    "GROKBOT_CONTAINER_API_URL=https://api.example.com/v1",
    "GROKBOT_MODEL=your-model-id",
    "GROKBOT_CONTEXT_TOKENS=128000",
    "GROKBOT_REASONING_EFFORT=low",
    "GROKBOT_INFERENCE_TIMEOUT_MS=180000",
    "LITELLM_API_KEY=",
    "",
  ].join("\n");
}

function initialize(config) {
  ensureDir(config.stateDir, 0o700);
  // The Box startup script owns the mounted data tree as its `box` user on
  // native Linux. Preserve that ownership while composing the server; the
  // release manager reclaims it through the stopped app container before a
  // host-side checkpoint.
  ensureDir(config.dataDir, 0o700, { preserveForeignOwner: true });
  // Box tools run as a different UID inside the container. The parent state
  // directory remains private, so the workspace can be writable in the Box.
  ensureDir(config.workspaceDir, 0o777, { preserveForeignOwner: true });
  ensureDir(path.join(config.modelsDir, "whisper"), 0o700, { preserveForeignOwner: true });
  ensureDir(path.join(config.modelsDir, "kokoro"), 0o700, { preserveForeignOwner: true });
  readOrCreateSecret(path.join(config.stateDir, "gateway-token"));
  readOrCreateSecret(path.join(config.stateDir, "search-secret"));
  if (!fs.existsSync(config.envFile)) {
    writeFileAtomic(config.envFile, serverEnvTemplate());
  }
}

function readSettings(config, { required = false } = {}) {
  if (!fs.existsSync(config.envFile)) {
    if (required) {
      throw new Error(`Run npm run server:install, then configure ${config.envFile}.`);
    }
    return {};
  }
  fs.chmodSync(config.envFile, 0o600);
  return parseEnv(fs.readFileSync(config.envFile, "utf8"));
}

function containerApiUrl(settings, { required = false } = {}) {
  const value = settings.GROKBOT_CONTAINER_API_URL || settings.GROKBOT_RESPONSES_BASE_URL;
  if (!value || value.includes("api.example.com")) {
    if (!required) return "http://litellm.home/v1";
    throw new Error("Set GROKBOT_CONTAINER_API_URL in the server's server.env file before starting.");
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("GROKBOT_CONTAINER_API_URL must be an absolute HTTP or HTTPS URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("GROKBOT_CONTAINER_API_URL must use HTTP or HTTPS.");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1") {
    url.hostname = "host.docker.internal";
  }
  return url.toString().replace(/\/$/, "");
}

function runtimeEnv(config, sourceEnv = process.env, settings = readSettings(config), {
  requireProvider = false,
  initializeState = true,
} = {}) {
  if (initializeState) initialize(config);
  else ensureDir(config.stateDir, 0o700);
  const nonemptyEnvironment = Object.fromEntries(
    Object.entries(sourceEnv).filter(([, value]) => value !== "" && value != null),
  );
  const effectiveSettings = { ...sourceEnv, ...settings, ...nonemptyEnvironment };
  const secrets = {
    GROKBOT_GATEWAY_TOKEN: readOrCreateSecret(path.join(config.stateDir, "gateway-token")),
    GROKBOT_SEARCH_SECRET: readOrCreateSecret(path.join(config.stateDir, "search-secret")),
  };
  return {
    ...effectiveSettings,
    ...secrets,
    GROKBOT_GATEWAY_HOST_BIND: "127.0.0.1",
    GROKBOT_GATEWAY_HOST_PORT: String(config.gatewayPort),
    GROKBOT_VNC_HOST_BIND: "127.0.0.1",
    GROKBOT_VNC_HOST_PORT: String(config.vncPort),
    GROKBOT_VNC_CONTROL_HOST_BIND: "127.0.0.1",
    GROKBOT_VNC_CONTROL_HOST_PORT: String(config.vncControlPort),
    SAND_REMOTE_VNC_PRIMARY_URL: `http://127.0.0.1:${config.vncPort}`,
    SAND_REMOTE_VNC_FORK_URL: `http://127.0.0.1:${config.vncControlPort}`,
    GROKBOT_DATA_DIR: config.dataDir,
    GROKBOT_WORKSPACE_DIR: config.workspaceDir,
    GROKBOT_MODELS_DIR: config.modelsDir,
    GROKBOT_REMOTE_SERVER_MODE: "1",
    GROKBOT_CONTAINER_API_URL: containerApiUrl(effectiveSettings, { required: requireProvider }),
    SAND_GATEWAY_REQUIRE_AUTH: "1",
  };
}

function runProviderSmoke(config, sourceEnv = process.env, settings = readSettings(config, { required: true })) {
  const composeEnv = runtimeEnv(config, sourceEnv, settings, { requireProvider: true });
  if (!composeEnv.LITELLM_API_KEY) {
    throw new Error("Set LITELLM_API_KEY in the server environment or server.env before running the provider smoke test.");
  }
  if (!composeEnv.GROKBOT_MODEL || /^your-model-id$/i.test(composeEnv.GROKBOT_MODEL)) {
    throw new Error("Set GROKBOT_MODEL to the model ID configured for your Responses service before running the provider smoke test.");
  }
  const action = [
    "run", "--rm", "--no-deps", "--entrypoint", "/exec-daemon/node", "app",
    "/opt/grokbot/tests/provider-smoke.cjs",
  ];
  return runCompose(config, action, composeEnv);
}

function composeArgs(config, action) {
  return [
    "compose",
    "--env-file",
    config.envFile,
    "--project-name",
    config.projectName,
    "-f",
    path.join(__dirname, "compose.yaml"),
    ...action,
  ];
}

function runCompose(config, action, env) {
  const result = spawnSync("docker", composeArgs(config, action), {
    cwd: root,
    env,
    stdio: "inherit",
  });
  if (result.error) console.error(`Docker Compose could not start: ${result.error.message}`);
  return result.status ?? 1;
}

function assertComposeProjectStopped(config, env = process.env, execute = spawnSync) {
  const options = { cwd: root, env, encoding: "utf8" };
  const listed = execute("docker", composeArgs(config, ["ps", "--all", "--quiet"]), options);
  if (listed.error || listed.status !== 0) {
    throw new Error("Could not verify that every server service is stopped; release state ownership was left unchanged.");
  }
  const ids = (listed.stdout || "").trim().split(/\s+/).filter(Boolean);
  if (ids.some((id) => !/^[a-f0-9]{12,64}$/i.test(id))) {
    throw new Error("Compose returned an unverifiable server container ID; release state ownership was left unchanged.");
  }
  if (ids.length === 0) return;

  const inspected = execute("docker", ["inspect", "--format", "{{.State.Running}}", ...ids], options);
  if (inspected.error || inspected.status !== 0) {
    throw new Error("Could not verify server container state; release state ownership was left unchanged.");
  }
  const states = (inspected.stdout || "").trim().split(/\s+/).filter(Boolean);
  if (states.length !== ids.length || states.some((state) => state !== "true" && state !== "false")) {
    throw new Error("Docker returned incomplete server container state; release state ownership was left unchanged.");
  }
  if (states.includes("true")) {
    throw new Error("Stop every server service before preparing release state ownership.");
  }
}

function reclaimReleaseState(config, sourceEnv, settings) {
  if (process.platform !== "linux") return 0;
  if (typeof process.getuid !== "function" || typeof process.getgid !== "function") {
    console.error("The release state owner cannot be determined on this platform.");
    return 1;
  }
  const composeEnv = runtimeEnv(config, sourceEnv, settings, { initializeState: false });
  try {
    assertComposeProjectStopped(config, composeEnv);
  } catch (error) {
    console.error(error.message);
    return 1;
  }
  const owner = `${process.getuid()}:${process.getgid()}`;
  return runCompose(config, [
    "run", "--rm", "--no-deps", "--user", "0:0", "--entrypoint", "/bin/chown", "app",
    "-hR", owner, "/home/box/sand-data", "/workspace",
  ], composeEnv);
}

function buildLocalHost(env) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, ["run", "build", "--", "--profile", "local"], {
    cwd: root,
    env,
    stdio: "inherit",
  });
  if (result.error) console.error(`Local Host build could not start: ${result.error.message}`);
  return result.status ?? 1;
}

function assertLocalBuild() {
  const profilePath = path.join(root, ".runtime/build/sand-host/build-profile.json");
  if (!fs.existsSync(profilePath)) {
    throw new Error("Run npm run build -- --profile local before starting the server.");
  }
  const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));
  if (profile.profile !== "local") {
    throw new Error("The server requires the local build profile. Run npm run build -- --profile local.");
  }
}

async function waitForGateway(config, token, timeoutMs = 180_000) {
  const endpoint = `http://127.0.0.1:${config.gatewayPort}`;
  const deadline = Date.now() + timeoutMs;
  let lastError = "Gateway has not become ready";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${endpoint}/api/getHostStatus`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ includeManagedCapabilities: false }),
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const payload = await response.json();
        if (payload?.capabilities && typeof payload.capabilities === "object") return;
        throw new Error("Gateway responded without the required client capabilities");
      }
      lastError = `Gateway readiness returned HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not become ready at ${endpoint}: ${lastError}`);
}

function restoreSecret(file, previous) {
  writeFileAtomic(file, previous, 0o600);
}

async function rotateGatewayToken(config, env) {
  const file = path.join(config.stateDir, "gateway-token");
  const previous = fs.readFileSync(file, "utf8");
  const next = writeSecret(file);
  const nextEnv = { ...env, GROKBOT_GATEWAY_TOKEN: next };
  let status = runCompose(config, ["up", "-d", "--no-deps", "--force-recreate", "app"], nextEnv);
  if (status === 0) {
    try {
      await waitForGateway(config, next);
      console.log("Gateway token rotated. Reconnect clients with the new token in server.env management.");
      console.log(`Read the token from ${file} in a private terminal, then replace the saved client connection.`);
      return 0;
    } catch (error) {
      console.error(error.message);
      status = 1;
    }
  }
  restoreSecret(file, previous);
  runCompose(config, ["up", "-d", "--no-deps", "--force-recreate", "app"], {
    ...env,
    GROKBOT_GATEWAY_TOKEN: previous.trim(),
  });
  return status;
}

function usage(config) {
  console.log(`Server profile commands (project ${config.projectName}):
  npm run server:install      Create private state and a server.env template
  npm run server:start        Start this server project
  npm run server:status       Show this project's service status
  npm run server:logs         Show this project's recent service logs
  npm run server:stop         Stop it without deleting persistent state
  npm run server:update       Stop, rebuild the Host, then restart this project
  npm run server:rotate-token Replace this server's Gateway token
  npm run server:provider-smoke Send one fixed, opt-in request to the configured model`);
}

async function main(argv = process.argv, env = process.env) {
  const command = argv[2] || "help";
  const config = serverConfig(env);
  if (command === "help") {
    usage(config);
    return 0;
  }
  if (command === "install") {
    initialize(config);
    console.log(`Server state is initialized at ${config.stateDir}.`);
    console.log(`Edit ${config.envFile} to set the model endpoint, model, and server-side API key.`);
    console.log(`Gateway token is stored with mode 0600 at ${path.join(config.stateDir, "gateway-token")}.`);
    console.log("Keep the server state directory private and back it up before updates.");
    return 0;
  }

  const settings = readSettings(config, { required: ["start", "update", "rotate-token", "provider-smoke", "prepare-release-state"].includes(command) });
  if (command === "start" || command === "update") {
    const composeEnv = runtimeEnv(config, env, settings, { requireProvider: true });
    if (command === "start") assertLocalBuild();
    if (command === "update") {
      const stopStatus = runCompose(config, ["stop", "-t", "180"], composeEnv);
      if (stopStatus !== 0) return stopStatus;
      if (buildLocalHost(composeEnv) !== 0) {
        console.error("Host build failed while the server is stopped. Persistent server state is unchanged; run npm run server:start after resolving the build error.");
        return 1;
      }
      assertLocalBuild();
    }
    const status = runCompose(config, ["up", "-d", "--build"], composeEnv);
    if (status !== 0) return status;
    const token = composeEnv.GROKBOT_GATEWAY_TOKEN;
    await waitForGateway(config, token);
    console.log(`Server Gateway is ready at http://127.0.0.1:${config.gatewayPort}.`);
    console.log("The Gateway and display ports are bound to server loopback; connect through SSH forwarding or a trusted TLS proxy.");
    return 0;
  }
  if (command === "status") {
    return runCompose(config, ["ps"], runtimeEnv(config, env, settings, { initializeState: false }));
  }
  if (command === "logs") {
    return runCompose(config, ["logs", "--tail", "80"], runtimeEnv(config, env, settings, { initializeState: false }));
  }
  if (command === "stop") {
    return runCompose(config, ["stop", "-t", "180"], runtimeEnv(config, env, settings, { initializeState: false }));
  }
  if (command === "prepare-release-state") {
    return reclaimReleaseState(config, env, settings);
  }
  if (command === "rotate-token") {
    assertLocalBuild();
    return await rotateGatewayToken(config, runtimeEnv(config, env, settings));
  }
  if (command === "provider-smoke") {
    return runProviderSmoke(config, env, settings);
  }
  throw new Error(`Unknown server command: ${command}`);
}

if (require.main === module) {
  main().then((status) => {
    process.exitCode = status;
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  containerApiUrl,
  assertComposeProjectStopped,
  initialize,
  reclaimReleaseState,
  readOrCreateSecret,
  runProviderSmoke,
  runtimeEnv,
  serverConfig,
  serverEnvTemplate,
  writeSecret,
};
