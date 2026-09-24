"use strict";

const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const { PassThrough, Writable } = require("node:stream");
const test = require("node:test");
const { createIsolatedElectronSafeStorage, RESULT_MARKER } = require("../remote-client-secure-storage.cjs");

function fakeChild() {
  const child = new EventEmitter();
  child.pid = 48291;
  child.killed = false;
  child.stdout = new PassThrough();
  const stdinChunks = [];
  child.stdin = new Writable({
    write(chunk, _encoding, callback) {
      stdinChunks.push(Buffer.from(chunk));
      callback();
    },
  });
  child.stdinChunks = stdinChunks;
  child.kill = () => {
    child.killed = true;
    setImmediate(() => child.emit("close", null, "SIGKILL"));
    return true;
  };
  return child;
}

function secureStorage(spawnProcess, overrides = {}) {
  return createIsolatedElectronSafeStorage({
    executablePath: "/private/app/Electron",
    entryPath: "/private/app/remote-client-main.cjs",
    environment: { PATH: "/usr/bin" },
    platform: "darwin",
    timeoutMs: 100,
    spawnProcess,
    killProcess() { throw new Error("Synthetic helper PIDs must not reach the operating system."); },
    ...overrides,
  });
}

test("isolated helper waits for a complete result line and keeps credentials off argv and environment", async () => {
  const child = fakeChild();
  let spawnDetails;
  const close = new Promise((resolve) => child.once("close", resolve));
  const storage = secureStorage((command, args, options) => {
    spawnDetails = { command, args, options };
    const profile = options.env.GBH_REMOTE_SECURE_STORAGE_USER_DATA;
    assert.ok(profile);
    assert.equal(fs.statSync(profile).mode & 0o777, 0o700);
    setImmediate(() => child.stdout.write(RESULT_MARKER + '{"ok":true,'));
    setTimeout(() => {
      child.stdout.write('"available":true}\n');
    }, 10);
    return child;
  });

  assert.equal(await storage.isAsyncEncryptionAvailable(), true);
  await close;
  assert.equal(spawnDetails.command, "/private/app/Electron");
  assert.deepEqual(spawnDetails.args, ["/private/app/remote-client-main.cjs"]);
  assert.equal(child.killed, true, "a completed helper must be terminated after returning its result");
  assert.equal(JSON.stringify(spawnDetails.args).includes("fixture-private-credential"), false);
  assert.equal(JSON.stringify(spawnDetails.options.env).includes("fixture-private-credential"), false);
  assert.equal(Buffer.concat(child.stdinChunks).toString("utf8"), '{"action":"availability"}\n');
  assert.equal(fs.existsSync(spawnDetails.options.env.GBH_REMOTE_SECURE_STORAGE_USER_DATA), false);

  const encryptChild = fakeChild();
  const encryptClose = new Promise((resolve) => encryptChild.once("close", resolve));
  const encryptStore = secureStorage((_command, _args, options) => {
    setImmediate(() => {
      encryptChild.stdout.write(RESULT_MARKER + '{"ok":true,"ciphertext":"Y2lwaGVydGV4dA=="}\n');
      encryptChild.emit("close", 0, null);
    });
    return encryptChild;
  });
  await encryptStore.encryptStringAsync("fixture-private-credential");
  await encryptClose;
  assert.equal(Buffer.concat(encryptChild.stdinChunks).toString("utf8"), '{"action":"encrypt","value":"fixture-private-credential"}\n');
});

test("a stalled helper is killed at its deadline and its private profile is removed", async () => {
  const child = fakeChild();
  let profile;
  let killedPid = null;
  const storage = secureStorage((_, __, options) => {
    profile = options.env.GBH_REMOTE_SECURE_STORAGE_USER_DATA;
    return child;
  }, {
    timeoutMs: 20,
    killProcess(pid, signal) {
      killedPid = pid;
      assert.equal(signal, "SIGKILL");
      throw new Error("Use fake child's kill method.");
    },
  });

  await assert.rejects(storage.isAsyncEncryptionAvailable(), (error) => error.code === "SECURE_STORAGE_TIMEOUT");
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(killedPid, -child.pid);
  assert.equal(child.killed, true);
  assert.equal(fs.existsSync(profile), false);
});

test("early helper exit and asynchronous stdin EPIPE return a safe storage error", async () => {
  const child = fakeChild();
  child.stdin = new Writable({
    write(_chunk, _encoding, callback) {
      callback(new Error("EPIPE"));
    },
  });
  const storage = secureStorage(() => {
    setImmediate(() => child.emit("close", 1, null));
    return child;
  });
  await assert.rejects(storage.isAsyncEncryptionAvailable(), (error) => {
    assert.equal(error.code, "SECURE_STORAGE_UNAVAILABLE");
    assert.doesNotMatch(error.message, /EPIPE/);
    return true;
  });
});

test("Linux never starts an OS credential helper", async () => {
  let spawnCount = 0;
  const storage = secureStorage(() => { spawnCount++; }, { platform: "linux" });
  await assert.rejects(storage.isAsyncEncryptionAvailable(), (error) => error.code === "SECURE_STORAGE_UNAVAILABLE");
  assert.equal(spawnCount, 0);
});
