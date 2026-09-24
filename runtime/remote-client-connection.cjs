"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const { isIP } = require("node:net");
const path = require("node:path");

const STORAGE_VERSION = 1;
const REQUIRED_GATEWAY_CAPABILITIES = ["orderedReplicasV1", "sendAcceptanceV1"];
const DEFAULT_VNC_PORT = 6180;
const DEFAULT_VNC_CONTROL_PORT = 6181;

function normalizeDisplayPorts(value = {}) {
  const vncPort = Number(value.vncPort ?? DEFAULT_VNC_PORT);
  const vncControlPort = Number(value.vncControlPort ?? DEFAULT_VNC_CONTROL_PORT);
  if (!Number.isInteger(vncPort) || vncPort < 1024 || vncPort > 65535 ||
      !Number.isInteger(vncControlPort) || vncControlPort < 1024 || vncControlPort > 65535 ||
      vncPort === vncControlPort) {
    throw new Error("Display tunnel ports must be distinct values from 1024 through 65535.");
  }
  return { vncPort, vncControlPort };
}

function normalizeGatewayUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Enter the server Gateway URL.");
  }
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Enter a loopback Gateway URL from your SSH tunnel, such as http://127.0.0.1:1540.");
  }
  if (url.protocol !== "http:") {
    throw new Error("Connect through an authenticated SSH tunnel and enter its local HTTP Gateway URL.");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error("The server URL cannot contain credentials, query parameters, or a fragment.");
  }
  if (url.pathname !== "/") {
    throw new Error("The Gateway must be served at the URL root.");
  }
  if (!isLoopback(url.hostname)) {
    throw new Error("The Remote Client accepts loopback URLs only. Forward the server through an authenticated SSH tunnel first.");
  }
  return url.origin;
}

function isLoopback(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const family = isIP(host);
  return host === "localhost" || host === "::1" || (family === 4 && Number(host.split(".")[0]) === 127);
}

function serverIdentity(gatewayUrl) {
  return crypto.createHash("sha256").update(normalizeGatewayUrl(gatewayUrl)).digest("hex");
}

async function probeGateway(gatewayUrl, token, fetchImpl = fetch) {
  const base = normalizeGatewayUrl(gatewayUrl);
  if (typeof token !== "string" || token.trim().length < 16) {
    throw Object.assign(new Error("Enter the Gateway token from the server administrator."), { code: "TOKEN_REQUIRED" });
  }
  let response;
  try {
    response = await fetchImpl(base + "/api/getHostStatus", {
      method: "POST",
      headers: {
        authorization: "Bearer " + token.trim(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ includeManagedCapabilities: false }),
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw Object.assign(new Error("The server could not be reached. Check that it is running and that the authenticated SSH tunnel is forwarding the Gateway port."), { code: "UNREACHABLE" });
  }
  if (response.status === 401 || response.status === 403) {
    throw Object.assign(new Error("The Gateway token was rejected. Enter the current token; the server token may have rotated."), { code: "UNAUTHORIZED" });
  }
  if (!response.ok) {
    throw Object.assign(new Error("The server returned HTTP " + response.status + " during connection."), { code: "SERVER_ERROR" });
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw Object.assign(new Error("The Gateway returned an invalid status response."), { code: "BAD_RESPONSE" });
  }
  if (!payload || !Array.isArray(payload.capabilities) || !REQUIRED_GATEWAY_CAPABILITIES.every((capability) => payload.capabilities.includes(capability))) {
    throw Object.assign(new Error("This endpoint is not a compatible Grok Bot Host Gateway."), { code: "INCOMPATIBLE" });
  }
  return { gatewayUrl: base, capabilities: payload.capabilities };
}

async function resumeSavedConnection(loadActive, probe, launch) {
  let active = null;
  try {
    active = await loadActive();
    if (!active) return { launching: false, message: "Enter the current server token to connect." };
    await probe(active.gatewayUrl, active.token);
    await launch(active);
    return { launching: true };
  } catch (error) {
    let gatewayUrl = "";
    try { gatewayUrl = active?.gatewayUrl ? normalizeGatewayUrl(active.gatewayUrl) : ""; } catch {}
    return {
      launching: false,
      code: typeof error?.code === "string" ? error.code : "CONNECTION_FAILED",
      message: typeof error?.message === "string" ? error.message : "Could not resume the saved server connection.",
      gatewayUrl,
    };
  }
}

async function storageIsSecure(safeStorage, { timeoutMs = 5000, platform = process.platform } = {}) {
  if (platform === "linux" || !safeStorage || typeof safeStorage.isAsyncEncryptionAvailable !== "function") return false;
  let timer;
  try {
    const available = await Promise.race([
      Promise.resolve().then(() => safeStorage.isAsyncEncryptionAvailable()),
      new Promise((resolve) => { timer = setTimeout(() => resolve(false), timeoutMs); }),
    ]);
    return available === true;
  } catch {
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function withSecureStorageTimeout(operation, timeoutMs = 5000) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("The operating system secure store did not respond in time.")), timeoutMs); }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function atomicPrivateWrite(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.chmodSync(path.dirname(file), 0o700);
  const temporary = file + "." + process.pid + ".tmp";
  fs.writeFileSync(temporary, contents, { mode: 0o600, flag: "w" });
  fs.chmodSync(temporary, 0o600);
  fs.renameSync(temporary, file);
  fs.chmodSync(file, 0o600);
}

class EncryptedConnectionStore {
  constructor(root, safeStorage, options = {}) {
    this.root = root;
    this.safeStorage = safeStorage;
    this.options = { platform: process.platform, ...options };
  }

  async assertSecureStorage() {
    if (this.safeStorage?.isolated === true) {
      if (this.options.platform === "linux") {
        throw Object.assign(new Error("This system has no encrypted OS storage available. Connect for this session or enable a system credential store before saving."), { code: "SECURE_STORAGE_UNAVAILABLE" });
      }
      return;
    }
    if (!await storageIsSecure(this.safeStorage, this.options)) {
      throw Object.assign(new Error("This system has no encrypted OS storage available. Keep this connection for this session, or enable a system Keychain or secure credential store before saving it."), { code: "SECURE_STORAGE_UNAVAILABLE" });
    }
  }

  secureStorageOperation(operation) {
    if (this.safeStorage?.isolated === true) return operation();
    return withSecureStorageTimeout(operation, this.options.timeoutMs);
  }

  connectionPath(identity) {
    if (!/^[a-f0-9]{64}$/.test(identity)) throw new Error("Invalid server identity.");
    return path.join(this.root, "servers", identity, "connection.enc");
  }

  profilePath(identity) {
    if (!/^[a-f0-9]{64}$/.test(identity)) throw new Error("Invalid server identity.");
    return path.join(this.root, "profiles", identity);
  }

  activePath() {
    return path.join(this.root, "active-server");
  }

  async save(gatewayUrl, token, displayPorts) {
    await this.assertSecureStorage();
    const normalized = normalizeGatewayUrl(gatewayUrl);
    const identity = serverIdentity(normalized);
    const serialized = JSON.stringify({ version: STORAGE_VERSION, gatewayUrl: normalized, token: token.trim(), ...normalizeDisplayPorts(displayPorts) });
    let ciphertext;
    try {
      ciphertext = await this.secureStorageOperation(() => this.safeStorage.encryptStringAsync(serialized));
    } catch {
      throw Object.assign(new Error("The secure store could not save this connection. Connect without remembering it or check the operating system credential store."), { code: "SECURE_STORAGE_UNAVAILABLE" });
    }
    if (!Buffer.isBuffer(ciphertext) || ciphertext.length < 16) throw new Error("The system secure store did not encrypt the connection.");
    atomicPrivateWrite(this.connectionPath(identity), ciphertext);
    atomicPrivateWrite(this.activePath(), identity + "\n");
    return identity;
  }

  async load(identity) {
    if (!/^[a-f0-9]{64}$/.test(identity)) return null;
    const file = this.connectionPath(identity);
    if (!fs.existsSync(file)) return null;
    await this.assertSecureStorage();
    fs.chmodSync(file, 0o600);
    let entry;
    try {
      const decrypted = await this.secureStorageOperation(() => this.safeStorage.decryptStringAsync(fs.readFileSync(file)));
      entry = JSON.parse(decrypted.result);
    } catch (error) {
      if (error?.code === "SECURE_STORAGE_UNAVAILABLE" || error?.code === "SECURE_STORAGE_TIMEOUT") {
        throw Object.assign(new Error("The operating system encrypted credential store is unavailable. Enter the token again for this session or try saving after fixing the system credential store."), { code: "SECURE_STORAGE_UNAVAILABLE" });
      }
      throw Object.assign(new Error("The saved connection could not be decrypted on this system. Enter the token again and save a new connection."), { code: "DECRYPT_FAILED" });
    }
    if (entry.version !== STORAGE_VERSION || typeof entry.gatewayUrl !== "string" || typeof entry.token !== "string") {
      throw Object.assign(new Error("The saved connection file is invalid. Re-enter the token to replace it."), { code: "BAD_STORED_DATA" });
    }
    if (serverIdentity(entry.gatewayUrl) !== identity) {
      throw Object.assign(new Error("The saved connection identity does not match its server."), { code: "IDENTITY_MISMATCH" });
    }
    return { ...entry, ...normalizeDisplayPorts(entry) };
  }

  async loadActive() {
    const file = this.activePath();
    if (!fs.existsSync(file)) return null;
    fs.chmodSync(file, 0o600);
    const identity = fs.readFileSync(file, "utf8").trim();
    if (!/^[a-f0-9]{64}$/.test(identity)) return null;
    const connection = await this.load(identity);
    return connection ? { identity, gatewayUrl: connection.gatewayUrl, token: connection.token, vncPort: connection.vncPort, vncControlPort: connection.vncControlPort } : null;
  }

  activate(identity) {
    atomicPrivateWrite(this.activePath(), identity + "\n");
  }

  clearActive() {
    fs.rmSync(this.activePath(), { force: true });
  }
}

module.exports = {
  EncryptedConnectionStore,
  isLoopback,
  normalizeGatewayUrl,
  normalizeDisplayPorts,
  probeGateway,
  REQUIRED_GATEWAY_CAPABILITIES,
  resumeSavedConnection,
  serverIdentity,
  storageIsSecure,
  withSecureStorageTimeout,
};
