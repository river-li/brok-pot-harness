"use strict";

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const HELPER_ENV = "GBH_REMOTE_SECURE_STORAGE_HELPER";
const HELPER_USER_DATA_ENV = "GBH_REMOTE_SECURE_STORAGE_USER_DATA";
const RESULT_MARKER = "GBH_REMOTE_SECURE_STORAGE_RESULT=";
const MAX_RESPONSE_BYTES = 128 * 1024;

function storageError(code, message) {
  return Object.assign(new Error(message), { code });
}

function terminateProcessGroup(child, platform, killProcess = process.kill.bind(process)) {
  if (!child || child.killed) return;
  if (platform !== "win32" && Number.isInteger(child.pid)) {
    try {
      killProcess(-child.pid, "SIGKILL");
      return;
    } catch {}
  }
  try { child.kill("SIGKILL"); } catch {}
}

function createIsolatedElectronSafeStorage({
  executablePath,
  entryPath,
  environment = process.env,
  timeoutMs = 5000,
  platform = process.platform,
  spawnProcess = spawn,
  killProcess,
} = {}) {
  const invoke = (request) => new Promise((resolve, reject) => {
    if (platform === "linux") {
      reject(storageError("SECURE_STORAGE_UNAVAILABLE", "Encrypted OS credential storage is unavailable on this client."));
      return;
    }
    if (typeof executablePath !== "string" || typeof entryPath !== "string") {
      reject(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper is not configured."));
      return;
    }

    let child;
    let timer;
    let output = "";
    let settled = false;
    let helperUserData = "";
    const cleanupUserData = () => {
      if (!helperUserData) return;
      try { fs.rmSync(helperUserData, { recursive: true, force: true }); } catch {}
      helperUserData = "";
    };
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      terminateProcessGroup(child, platform, killProcess);
      try { child?.stdin?.destroy(); } catch {}
      if (error) reject(error);
      else resolve(result);
    };

    try {
      helperUserData = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-remote-secure-"));
      fs.chmodSync(helperUserData, 0o700);
      const helperEnvironment = {
        ...environment,
        [HELPER_ENV]: "1",
        [HELPER_USER_DATA_ENV]: helperUserData,
      };
      child = spawnProcess(executablePath, [entryPath], {
        env: helperEnvironment,
        detached: platform !== "win32",
        stdio: ["pipe", "pipe", "ignore"],
        windowsHide: true,
      });
    } catch {
      cleanupUserData();
      finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper could not start."));
      return;
    }

    timer = setTimeout(() => {
      finish(storageError("SECURE_STORAGE_TIMEOUT", "The operating system credential store did not respond in time."));
    }, timeoutMs);

    child.stdout?.on("data", (chunk) => {
      output += chunk.toString("utf8");
      if (Buffer.byteLength(output, "utf8") > MAX_RESPONSE_BYTES) {
        finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper returned an invalid response."));
        return;
      }
      const completeLines = output.split(/\r?\n/);
      const resultLine = completeLines.slice(0, -1).find((line) => line.startsWith(RESULT_MARKER));
      if (!resultLine) return;
      let result;
      try {
        result = JSON.parse(resultLine.slice(RESULT_MARKER.length));
      } catch {
        finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper returned an invalid response."));
        return;
      }
      if (!result || result.ok !== true) {
        const code = typeof result?.code === "string" ? result.code : "SECURE_STORAGE_UNAVAILABLE";
        const message = typeof result?.message === "string" ? result.message : "The encrypted OS credential store is unavailable.";
        finish(storageError(code, message));
        return;
      }
      finish(null, result);
    });
    child.once?.("error", () => {
      finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper could not start."));
    });
    child.once?.("close", () => {
      if (!settled) finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper exited without a result."));
      cleanupUserData();
    });

    child.stdin?.once?.("error", () => {
      finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper could not receive the request."));
    });
    try {
      child.stdin.end(JSON.stringify(request) + "\n");
    } catch {
      finish(storageError("SECURE_STORAGE_UNAVAILABLE", "The encrypted credential helper could not receive the request."));
    }
  });

  return Object.freeze({
    isolated: true,
    async isAsyncEncryptionAvailable() {
      const result = await invoke({ action: "availability" });
      return result.available === true;
    },
    async encryptStringAsync(value) {
      if (typeof value !== "string") throw new TypeError("Encrypted storage accepts string values only.");
      const result = await invoke({ action: "encrypt", value });
      if (typeof result.ciphertext !== "string") throw storageError("SECURE_STORAGE_UNAVAILABLE", "The system secure store did not encrypt the connection.");
      return Buffer.from(result.ciphertext, "base64");
    },
    async decryptStringAsync(ciphertext) {
      if (!Buffer.isBuffer(ciphertext)) throw new TypeError("Encrypted storage accepts Buffer values only.");
      const result = await invoke({ action: "decrypt", ciphertext: ciphertext.toString("base64") });
      if (typeof result.value !== "string") throw storageError("DECRYPT_FAILED", "The saved connection could not be decrypted.");
      return { result: result.value, shouldReEncrypt: result.shouldReEncrypt === true };
    },
  });
}

module.exports = { createIsolatedElectronSafeStorage, HELPER_ENV, RESULT_MARKER };
