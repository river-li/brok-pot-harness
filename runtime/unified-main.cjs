"use strict";

// A packaged Electron executable enters package.json's main for every UI
// child. Route the remote connection and its encrypted-storage helper here.
if (process.env.GBH_UNIFIED_REMOTE_ENTRY === "1" || process.env.GBH_REMOTE_LAUNCH === "1" ||
    process.env.GBH_REMOTE_SECURE_STORAGE_HELPER === "1") {
  require("./remote-client-main.cjs");
} else if (process.env.GBH_UNIFIED_LOCAL_ENTRY === "1") {
  require("./unified-desktop-main.cjs");
} else {

const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { app, BrowserWindow, ipcMain } = require("electron");
const { configured, deployPayload, privateDirectory, runServer, writeSettings } = require("./unified-local.cjs");

const home = process.env.GBH_UNIFIED_HOME || path.join(app.getPath("appData"), "Brokpot");
const stateHome = path.join(home, "Local Server");
const preferencePath = path.join(home, "run-location.json");
const welcomeFile = path.join(__dirname, "unified-welcome.html");
privateDirectory(home);
privateDirectory(path.join(home, "Launcher"));
app.setPath("userData", path.join(home, "Launcher"));
let window;
let busy = false;

function selectedMode() {
  try {
    const mode = JSON.parse(fs.readFileSync(preferencePath, "utf8")).mode;
    return mode === "local" || mode === "remote" ? mode : null;
  } catch { return null; }
}

function saveMode(mode) {
  privateDirectory(home);
  const temporary = `${preferencePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify({ mode }) + "\n", { mode: 0o600, flag: "wx" });
  fs.renameSync(temporary, preferencePath);
}

function trusted(event) {
  if (event.senderFrame?.url !== require("node:url").pathToFileURL(welcomeFile).href) {
    throw new Error("Untrusted launcher window.");
  }
}

function openWelcome() {
  window = new BrowserWindow({
    width: 760, height: 660, minWidth: 620, minHeight: 580,
    title: "Brokpot", backgroundColor: "#f7f5f1", show: false,
    webPreferences: {
      preload: path.join(__dirname, "unified-preload.cjs"),
      contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true,
    },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, destination) => {
    if (destination !== require("node:url").pathToFileURL(welcomeFile).href) event.preventDefault();
  });
  window.once("ready-to-show", () => window.show());
  window.loadFile(welcomeFile);
}

function cleanDesktopEnvironment() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (/(?:API_KEY|TOKEN|SECRET|PASSWORD)$/i.test(key) || key.startsWith("GBH_SERVER_") ||
        key.startsWith("GROKBOT_") || key.startsWith("SAND_") || key === "ELECTRON_RUN_AS_NODE") delete env[key];
  }
  return env;
}

function launchRemote() {
  const env = cleanDesktopEnvironment();
  env.GBH_REMOTE_CLIENT_HOME = path.join(home, "Remote Client");
  env.GBH_UNIFIED_REMOTE_ENTRY = "1";
  const child = spawn(process.execPath, [path.join(__dirname, "remote-client-main.cjs")], {
    env, stdio: "ignore", detached: true,
  });
  child.once("error", (error) => { busy = false; window.webContents.send("unified:failure", `Could not open the connection window: ${error.message}`); });
  child.once("spawn", () => { child.unref(); app.quit(); });
}

async function launchLocal(options) {
  const runtimeRoot = deployPayload(path.join(__dirname, "local-server"), path.join(home, "Runtime"));
  await runServer(process.execPath, runtimeRoot, stateHome, "install");
  if (options) writeSettings(stateHome, options);
  if (!configured(stateHome)) throw new Error("Set the model API URL and model ID before running locally.");
  window.webContents.send("unified:progress", "Starting your local Docker services. This may take several minutes on first run…");
  await runServer(process.execPath, runtimeRoot, stateHome, "start");
  const env = cleanDesktopEnvironment();
  env.GBH_UNIFIED_LOCAL_ENTRY = "1";
  env.GBH_UNIFIED_HOME = home;
  const child = spawn(process.execPath, [], {
    env, stdio: "ignore", detached: true,
  });
  await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("spawn", resolve);
  });
  child.unref();
  app.quit();
}

app.whenReady().then(() => {
  privateDirectory(home);
  privateDirectory(app.getPath("userData"));
  ipcMain.handle("unified:initial", (event) => {
    trusted(event);
    return { selectedMode: selectedMode(), configured: configured(stateHome) };
  });
  ipcMain.handle("unified:choose", async (event, input) => {
    trusted(event);
    if (busy) return { error: "A run location is already starting." };
    if (!input || !["local", "remote"].includes(input.mode)) return { error: "Choose a run location." };
    busy = true;
    try {
      saveMode(input.mode);
      if (input.mode === "remote") launchRemote();
      else await launchLocal(input.settings || null);
      return { ok: true };
    } catch (error) {
      busy = false;
      return { error: error.message };
    }
  });
  openWelcome();
});

app.on("window-all-closed", () => app.quit());
}
