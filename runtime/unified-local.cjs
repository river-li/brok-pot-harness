"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

function sha256(file) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(file));
  return hash.digest("hex");
}

function privateDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (fs.lstatSync(directory).isSymbolicLink()) throw new Error("Application data directory cannot be a symlink.");
  fs.chmodSync(directory, 0o700);
}

function readManifest(payload) {
  const manifest = JSON.parse(fs.readFileSync(path.join(payload, "manifest.json"), "utf8"));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.files) || !/^[a-f0-9]{64}$/.test(manifest.digest)) {
    throw new Error("The bundled local runtime manifest is invalid.");
  }
  const seen = new Set();
  for (const entry of manifest.files) {
    if (typeof entry.path !== "string" || !/^[a-f0-9]{64}$/.test(entry.sha256) ||
        path.isAbsolute(entry.path) || entry.path.split("/").some((part) => !part || part === "." || part === "..") ||
        seen.has(entry.path)) throw new Error("The bundled local runtime inventory is invalid.");
    seen.add(entry.path);
  }
  const inventory = manifest.files.map((entry) => `${entry.path}:${entry.sha256}:${entry.mode}\n`).join("");
  if (crypto.createHash("sha256").update(inventory).digest("hex") !== manifest.digest) {
    throw new Error("The bundled local runtime inventory digest is invalid.");
  }
  return manifest;
}

function verifyPayload(payload, manifest) {
  for (const entry of manifest.files) {
    const source = path.join(payload, entry.path);
    if (!fs.existsSync(source) || fs.lstatSync(source).isSymbolicLink() || !fs.statSync(source).isFile() || sha256(source) !== entry.sha256) {
      throw new Error(`Bundled local runtime file failed verification: ${entry.path}`);
    }
  }
}

function deployPayload(payload, runtimeHome) {
  const manifest = readManifest(payload);
  verifyPayload(payload, manifest);
  privateDirectory(runtimeHome);
  const destination = path.join(runtimeHome, manifest.digest);
  if (fs.existsSync(destination)) {
    try {
      verifyPayload(destination, manifest);
      return destination;
    } catch {
      throw new Error("Installed runtime was modified. Remove that version from the Runtime directory and retry.");
    }
  }
  const temporary = path.join(runtimeHome, `.install-${process.pid}-${crypto.randomBytes(6).toString("hex")}`);
  privateDirectory(temporary);
  try {
    for (const entry of manifest.files) {
      const source = path.join(payload, entry.path);
      const target = path.join(temporary, entry.path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(target, entry.mode === 493 ? 0o755 : 0o644);
    }
    verifyPayload(temporary, manifest);
    fs.renameSync(temporary, destination);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
  return destination;
}

function settingsPath(stateHome) { return path.join(stateHome, "server.env"); }

function configured(stateHome) {
  try {
    const content = fs.readFileSync(settingsPath(stateHome), "utf8");
    const url = content.match(/^GROKBOT_CONTAINER_API_URL=(.+)$/m)?.[1] || "";
    const model = content.match(/^GROKBOT_MODEL=(.+)$/m)?.[1] || "";
    return Boolean(url && !url.includes("api.example.com") && model && model !== "your-model-id");
  } catch { return false; }
}

function writeSettings(stateHome, { url, model, key }) {
  if (typeof url !== "string" || typeof model !== "string" || typeof key !== "string") throw new Error("Invalid model settings.");
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error("Enter an absolute model API URL."); }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.hash || parsed.search) {
    throw new Error("The model API URL must be HTTP or HTTPS without credentials or query parameters.");
  }
  if (!model.trim() || /[\r\n=]/.test(model) || /[\r\n]/.test(key)) throw new Error("Enter a valid model ID and API key.");
  privateDirectory(stateHome);
  const file = settingsPath(stateHome);
  const old = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const previousKey = old.match(/^LITELLM_API_KEY=(.*)$/m)?.[1] || "";
  const lines = [
    "# Private settings for this app's local Docker server.",
    `GROKBOT_CONTAINER_API_URL=${parsed.toString().replace(/\/$/, "")}`,
    `GROKBOT_MODEL=${model.trim()}`,
    "GROKBOT_CONTEXT_TOKENS=128000",
    "GROKBOT_REASONING_EFFORT=low",
    "GROKBOT_INFERENCE_TIMEOUT_MS=180000",
    `LITELLM_API_KEY=${key || previousKey}`,
    "",
  ];
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, lines.join("\n"), { mode: 0o600, flag: "wx" });
  fs.renameSync(temporary, file);
  fs.chmodSync(file, 0o600);
}

function serverEnvironment(stateHome) {
  const env = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  for (const name of Object.keys(env)) {
    if (/(?:API_KEY|TOKEN|SECRET|PASSWORD)$/i.test(name) || name.startsWith("GBH_SERVER_") ||
        name.startsWith("SAND_") || name.startsWith("GROKBOT_")) delete env[name];
  }
  env.GBH_SERVER_STATE_DIR = stateHome;
  env.GBH_SERVER_PROJECT = "brokpot-local";
  return env;
}

function runServer(executable, runtimeRoot, stateHome, action, onOutput = () => {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, [path.join(runtimeRoot, "runtime/server.cjs"), action], {
      cwd: runtimeRoot, env: serverEnvironment(stateHome), stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    for (const stream of [child.stdout, child.stderr]) stream.on("data", (chunk) => {
      output = (output + chunk.toString()).slice(-4000);
      onOutput(chunk.toString());
    });
    child.once("error", reject);
    child.once("close", (status) => status === 0 ? resolve() : reject(new Error(`Local server ${action} failed (exit ${status}). Check Docker Desktop and the model settings.`)));
  });
}

module.exports = { configured, deployPayload, privateDirectory, readManifest, runServer, serverEnvironment, writeSettings };
