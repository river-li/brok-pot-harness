"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { spawn } = require("node:child_process");
const { app, BrowserWindow, ipcMain } = require("electron");
const {
  EncryptedConnectionStore,
  normalizeDisplayPorts,
  normalizeGatewayUrl,
  probeGateway,
  resumeSavedConnection,
  serverIdentity,
} = require("./remote-client-connection.cjs");
const { createIsolatedElectronSafeStorage, RESULT_MARKER } = require("./remote-client-secure-storage.cjs");

const bootstrapPath = path.join(__dirname, "remote-client-main.cjs");
const remoteLaunchRequested = process.env.GBH_REMOTE_LAUNCH === "1";
const secureStorageHelperRequested = process.env.GBH_REMOTE_SECURE_STORAGE_HELPER === "1";
let storageRoot;
if (secureStorageHelperRequested) {
  const helperUserData = process.env.GBH_REMOTE_SECURE_STORAGE_USER_DATA || "";
  const normalizedUserData = path.resolve(helperUserData);
  const relativeToTemp = path.relative(os.tmpdir(), normalizedUserData);
  if (!path.isAbsolute(helperUserData) || relativeToTemp.startsWith("..") || path.basename(normalizedUserData).startsWith("gbh-remote-secure-") === false) {
    throw new Error("The encrypted credential helper requires an isolated temporary profile.");
  }
  app.setPath("userData", normalizedUserData);
  storageRoot = normalizedUserData;
} else {
  storageRoot = process.env.GBH_REMOTE_CLIENT_HOME || path.join(app.getPath("appData"), "Grokbot Harness", "Remote Client");
}
let connectionWindow = null;
let savedStore = null;
let startupMessage = "";
let startupCode = "";
let startupUrl = "";
let remoteDesktopLoaded = false;

function ensurePrivateDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  fs.chmodSync(directory, 0o700);
}

function initializeRemoteEnvironment(gatewayUrl, token, identity, displayPorts) {
  const normalized = normalizeGatewayUrl(gatewayUrl);
  const ports = normalizeDisplayPorts(displayPorts);
  if (typeof token !== "string" || token.trim().length < 16) {
    throw Object.assign(new Error("The Gateway token is missing. Enter the current server token to connect."), { code: "TOKEN_REQUIRED" });
  }
  const expectedIdentity = serverIdentity(normalized);
  if (identity && identity !== expectedIdentity) throw new Error("Remote server profile did not match the Gateway URL.");
  const profile = path.join(storageRoot, "profiles", expectedIdentity);
  ensurePrivateDirectory(profile);
  process.env.GROKBOT_LOCAL_MODE = "1";
  process.env.GROKBOT_LOCAL_VOICE = "0";
  process.env.GROKBOT_REMOTE_CLIENT = "1";
  process.env.SAND_HOST_GATEWAY_URL = normalized;
  process.env.SAND_HOST_GATEWAY_TOKEN = token;
  process.env.SAND_HOST_GATEWAY_NETWORK_TOKEN = token;
  process.env.SAND_HOST_GATEWAY_VNC_PRIMARY_URL = `http://127.0.0.1:${ports.vncPort}/vnc.html`;
  process.env.SAND_HOST_GATEWAY_VNC_FORK_URL = `http://127.0.0.1:${ports.vncControlPort}/vnc.html`;
  process.env.SAND_USER_DATA_DIR = profile;
  process.env.SAND_BACKEND_URL = "http://127.0.0.1:9";
  process.env.SAND_DEV_BOX_CONTROL_PLANE = "0";
  process.env.SAND_ATTACH_PROD_BOX = "0";
  process.env.SAND_DEV_CONTROL_PORT = "0";
  process.env.SAND_DISABLE_TELEMETRY = "1";
  process.env.SAND_DISABLE_ANALYTICS = "1";
  delete process.env.SAND_DEV_BOX_CONTAINER;
  delete process.env.SAND_DEV_BOX_ROOT;
  delete process.env.SAND_DEV_BOX_DOCKER_SOCKET;
  delete process.env.SAND_BOX_IMAGE;
  delete process.env.GROKBOT_PROJECT_ROOT;
  delete process.env.GROKBOT_CONTAINER_API_URL;
  delete process.env.GROKBOT_RESPONSES_BASE_URL;
  delete process.env.GROKBOT_MODEL;
  delete process.env.GROKBOT_CONTEXT_TOKENS;
  delete process.env.GROKBOT_REASONING_EFFORT;
  delete process.env.GROKBOT_INFERENCE_TIMEOUT_MS;
  delete process.env.LITELLM_API_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  app.setPath("userData", profile);
  return expectedIdentity;
}

if (!secureStorageHelperRequested && remoteLaunchRequested) {
  try {
    initializeRemoteEnvironment(
      process.env.SAND_HOST_GATEWAY_URL || "",
      process.env.SAND_HOST_GATEWAY_TOKEN || "",
      process.env.GBH_REMOTE_SERVER_ID || "",
      { vncPort: process.env.GBH_REMOTE_VNC_PORT, vncControlPort: process.env.GBH_REMOTE_VNC_CONTROL_PORT },
    );
  } catch (error) {
    startupMessage = error.message;
    startupCode = error.code || "REMOTE_START_FAILED";
    console.error("Remote desktop could not start: " + error.message);
    try { startupUrl = normalizeGatewayUrl(process.env.SAND_HOST_GATEWAY_URL || ""); } catch {}
    delete process.env.SAND_HOST_GATEWAY_TOKEN;
  }
}

function makeStore() {
  if (!savedStore) {
    savedStore = new EncryptedConnectionStore(storageRoot, createIsolatedElectronSafeStorage({
      executablePath: process.execPath,
      entryPath: bootstrapPath,
      environment: cleanClientEnvironment(),
      timeoutMs: 5000,
      platform: process.platform,
    }));
  }
  return savedStore;
}

function openConnectionWindow(message = "") {
  if (message) startupMessage = message;
  if (connectionWindow && !connectionWindow.isDestroyed()) {
    connectionWindow.focus();
    return connectionWindow;
  }
  connectionWindow = new BrowserWindow({
    width: 560,
    height: 680,
    minWidth: 480,
    minHeight: 610,
    resizable: true,
    title: "Connect to a Grok Bot server",
    backgroundColor: "#10151d",
    webPreferences: {
      preload: path.join(__dirname, "remote-client-preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      partition: "remote-client-bootstrap",
    },
  });
  connectionWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  const pageUrl = pathToFileURL(path.join(__dirname, "remote-client.html")).href;
  connectionWindow.webContents.on("will-navigate", (event, target) => {
    if (target !== pageUrl) event.preventDefault();
  });
  connectionWindow.on("closed", () => { connectionWindow = null; });
  connectionWindow.loadFile(path.join(__dirname, "remote-client.html"));
  return connectionWindow;
}

function cleanClientEnvironment() {
  const env = { ...process.env };
  for (const name of [
    "ELECTRON_RUN_AS_NODE", "SAND_HOST_GATEWAY_URL", "SAND_HOST_GATEWAY_TOKEN",
    "SAND_HOST_GATEWAY_NETWORK_TOKEN", "SAND_USER_DATA_DIR", "SAND_BACKEND_URL",
    "SAND_HOST_GATEWAY_VNC_PRIMARY_URL", "SAND_HOST_GATEWAY_VNC_FORK_URL",
    "SAND_DEV_BOX_CONTAINER", "SAND_DEV_BOX_ROOT", "SAND_DEV_BOX_DOCKER_SOCKET",
    "SAND_BOX_IMAGE", "GROKBOT_PROJECT_ROOT", "GROKBOT_CONTAINER_API_URL",
    "GROKBOT_RESPONSES_BASE_URL", "GROKBOT_MODEL", "GROKBOT_CONTEXT_TOKENS",
    "GROKBOT_REASONING_EFFORT", "GROKBOT_INFERENCE_TIMEOUT_MS", "LITELLM_API_KEY",
    "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GBH_REMOTE_SERVER_ID", "GBH_REMOTE_LAUNCH",
    "GBH_REMOTE_RECONFIGURE",
    "GBH_REMOTE_VNC_PORT", "GBH_REMOTE_VNC_CONTROL_PORT",
  ]) delete env[name];
  for (const name of Object.keys(env)) {
    if (/(?:API_KEY|TOKEN|SECRET|PASSWORD)$/i.test(name)) delete env[name];
  }
  return env;
}

function launchConnectedClient(gatewayUrl, token, identity, displayPorts) {
  const ports = normalizeDisplayPorts(displayPorts);
  const normalizedUrl = normalizeGatewayUrl(gatewayUrl);
  const normalizedIdentity = identity || serverIdentity(normalizedUrl);
  if (normalizedIdentity !== serverIdentity(normalizedUrl)) throw new Error("Remote server profile did not match the Gateway URL.");
  ensurePrivateDirectory(path.join(storageRoot, "profiles", normalizedIdentity));
  const childEnv = cleanClientEnvironment();
  childEnv.GBH_REMOTE_LAUNCH = "1";
  childEnv.GBH_REMOTE_SERVER_ID = normalizedIdentity;
  childEnv.SAND_HOST_GATEWAY_URL = normalizedUrl;
  childEnv.SAND_HOST_GATEWAY_TOKEN = token;
  childEnv.GBH_REMOTE_VNC_PORT = String(ports.vncPort);
  childEnv.GBH_REMOTE_VNC_CONTROL_PORT = String(ports.vncControlPort);
  app.releaseSingleInstanceLock();
  const child = spawn(process.execPath, [bootstrapPath], {
    env: childEnv,
    detached: process.platform !== "win32",
    stdio: "ignore",
    windowsHide: true,
  });
  child.once("error", (error) => {
    console.error("Could not start the remote desktop: " + error.message);
    app.requestSingleInstanceLock();
    openConnectionWindow("The connection was verified, but the desktop could not be started.");
  });
  child.once("spawn", () => {
    child.unref();
    app.quit();
  });
}

function safeError(error) {
  return {
    code: typeof error.code === "string" ? error.code : "CONNECTION_FAILED",
    message: typeof error.message === "string" ? error.message : "Could not connect to the server.",
  };
}

function registerConnectionIpc() {
  const trustedPage = pathToFileURL(path.join(__dirname, "remote-client.html")).href;
  const assertTrusted = (event) => {
    if (!event.senderFrame || event.senderFrame.url !== trustedPage) throw new Error("Connection window is not trusted.");
  };
  ipcMain.handle("remote-client:initial-state", async (event) => {
    assertTrusted(event);
    let active = null;
    let storageMessage = "";
    try {
      if (fs.existsSync(makeStore().activePath())) active = await makeStore().loadActive();
    } catch (error) {
      storageMessage = error.message;
    }
    return {
      hasSavedConnection: Boolean(active) && !startupMessage && process.env.GBH_REMOTE_RECONFIGURE !== "1",
      savedUrl: active ? active.gatewayUrl : (startupUrl || ""),
      vncPort: active?.vncPort ?? 6180,
      vncControlPort: active?.vncControlPort ?? 6181,
      storageMessage,
      startupMessage,
      startupCode,
    };
  });
  ipcMain.handle("remote-client:resume-saved", async (event) => {
    assertTrusted(event);
    return resumeSavedConnection(
      () => makeStore().loadActive(),
      (gatewayUrl, token) => probeGateway(gatewayUrl, token),
      (active) => launchConnectedClient(active.gatewayUrl, active.token, active.identity, active),
    );
  });
  ipcMain.handle("remote-client:connect", async (event, request) => {
    assertTrusted(event);
    try {
      const gatewayUrl = normalizeGatewayUrl(request && request.gatewayUrl);
      const token = typeof request?.token === "string" ? request.token.trim() : "";
      const remember = Boolean(request && request.remember);
      const displayPorts = normalizeDisplayPorts(request);
      const result = await probeGateway(gatewayUrl, token);
      let identity;
      if (remember) identity = await makeStore().save(gatewayUrl, token, displayPorts);
      else {
        makeStore().clearActive();
        identity = serverIdentity(gatewayUrl);
      }
      launchConnectedClient(gatewayUrl, token, identity, displayPorts);
      return { launching: true, capabilities: Object.keys(result.capabilities) };
    } catch (error) {
      return { launching: false, ...safeError(error) };
    }
  });
}

async function readSecureStorageHelperRequest() {
  const chunks = [];
  let size = 0;
  for await (const chunk of process.stdin) {
    size += chunk.length;
    if (size > 128 * 1024) throw new Error("request too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function runSecureStorageHelper() {
  let response;
  try {
    const request = await readSecureStorageHelperRequest();
    if (!request || !["availability", "encrypt", "decrypt"].includes(request.action)) {
      throw Object.assign(new Error("invalid helper request"), { code: "BAD_REQUEST" });
    }
    await app.whenReady();
    if (process.platform === "linux") {
      throw Object.assign(new Error("encrypted storage is disabled on Linux"), { code: "SECURE_STORAGE_UNAVAILABLE" });
    }
    const { safeStorage } = require("electron");
    const available = await safeStorage.isAsyncEncryptionAvailable();
    if (request.action === "availability") {
      response = { ok: true, available: available === true };
    } else if (available !== true) {
      throw Object.assign(new Error("encrypted OS storage is unavailable"), { code: "SECURE_STORAGE_UNAVAILABLE" });
    } else if (request.action === "encrypt") {
      if (typeof request.value !== "string") throw Object.assign(new Error("invalid encrypt request"), { code: "BAD_REQUEST" });
      const ciphertext = await safeStorage.encryptStringAsync(request.value);
      if (!Buffer.isBuffer(ciphertext) || ciphertext.length < 16) {
        throw Object.assign(new Error("encryption did not produce ciphertext"), { code: "SECURE_STORAGE_UNAVAILABLE" });
      }
      response = { ok: true, ciphertext: ciphertext.toString("base64") };
    } else {
      if (typeof request.ciphertext !== "string" || request.ciphertext.length > 64 * 1024 || !/^(?:[A-Za-z0-9+/]*={0,2})$/.test(request.ciphertext)) {
        throw Object.assign(new Error("invalid decrypt request"), { code: "BAD_REQUEST" });
      }
      const decrypted = await safeStorage.decryptStringAsync(Buffer.from(request.ciphertext, "base64"));
      response = { ok: true, value: decrypted.result, shouldReEncrypt: decrypted.shouldReEncrypt === true };
    }
  } catch (error) {
    response = {
      ok: false,
      code: typeof error?.code === "string" ? error.code : "SECURE_STORAGE_UNAVAILABLE",
      message: "The operating system encrypted credential store is unavailable.",
    };
  }
  process.stdout.write(RESULT_MARKER + JSON.stringify(response) + "\n", () => process.exit(response.ok ? 0 : 1));
}

if (secureStorageHelperRequested) {
  void runSecureStorageHelper();
} else {
  const ownsSingleInstance = app.requestSingleInstanceLock();
  if (!ownsSingleInstance) app.quit();
  else if (remoteLaunchRequested && !startupMessage) {
    try {
      // The retained entry registers privileged schemes and hardware policy at
      // module load, so it must run before Electron emits `ready`.
      require(path.join(__dirname, "dist/electron-main/main.cjs"));
      remoteDesktopLoaded = true;
    } catch (error) {
      startupMessage = error.message;
      startupCode = error.code || "REMOTE_START_FAILED";
      console.error("Remote desktop could not start: " + error.message);
      delete process.env.SAND_HOST_GATEWAY_TOKEN;
    }
  }

  if (ownsSingleInstance) {
    app.on("second-instance", () => {
      if (connectionWindow && !connectionWindow.isDestroyed()) connectionWindow.focus();
    });
    app.whenReady().then(() => {
      if (remoteDesktopLoaded) return;
      registerConnectionIpc();
      openConnectionWindow();
    }).catch((error) => {
      console.error("Remote connection window failed: " + error.message);
      app.quit();
    });
    app.on("activate", () => {
      if (!remoteDesktopLoaded && BrowserWindow.getAllWindows().length === 0) openConnectionWindow();
    });
    app.on("window-all-closed", () => { if (!remoteDesktopLoaded) app.quit(); });
  }
}
