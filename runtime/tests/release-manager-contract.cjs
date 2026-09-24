"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const test = require("node:test");
const { once } = require("node:events");
const {
  currentRelease,
  installRelease,
  rollbackRelease,
  restoreState,
  snapshotState,
  stopAndSnapshot,
  updateRelease,
  verifyPackage,
  withLock,
} = require("../release.cjs");

function makePackage(root, version, stateFormat = "gbh-state-v1") {
  const sourceCommit = "a".repeat(40);
  const speechImage = `gbh-server-speech:${version.toLowerCase()}-${sourceCommit.slice(0, 12)}`;
  const files = {
    "install.sh": "#!/bin/sh\n",
    "release/RESOURCE-NOTICES.md": "Known resource inventory fixture.\n",
    "release/RELEASE-NOTES.md": "Candidate release notes fixture.\n",
    "release/retained-desktop-provenance.json": JSON.stringify({
      source: "retained desktop bundle imported for local recovery",
      version: "0.44.0",
      sha256: "b".repeat(64),
      files: [],
    }) + "\n",
    "runtime/server.cjs": [
      '"use strict";',
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      'const release = path.basename(path.resolve(__dirname, ".."));',
      'const events = path.join(process.env.GBH_SERVER_STATE_DIR, "server-commands.log");',
      'fs.appendFileSync(events, `${release}:${process.argv[2]}\\n`);',
    ].join("\n") + "\n",
    "runtime/release.cjs": fs.readFileSync(path.join(__dirname, "../release.cjs"), "utf8"),
    "runtime/release-extract.py": "extractor fixture\n",
    "runtime/compose.yaml": `services:\n  speech:\n    image: ${speechImage}\n`,
    "runtime/box-entrypoint.sh": "#!/bin/sh\n",
    ".runtime/build/sand-host/build-profile.json": JSON.stringify({ profile: "local" }) + "\n",
  };
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  files["release-manifest.json"] = JSON.stringify({
    schemaVersion: 1,
    releaseVersion: version,
    stateFormat,
    buildProfile: "local",
    serverPlatform: "linux/amd64",
    clientPlatform: "macos/arm64",
    nodeVersion: "24.14.0",
    buildEnvironment: { system: "Linux", machine: "x86_64", node: "v24.14.0", python: "3.13.0" },
    sourceTreeClean: true,
    sourceCommit,
    upstreamBaseline: "bfe1879",
    speechImage,
  }, null, 2) + "\n";
  fs.writeFileSync(path.join(root, "release-manifest.json"), files["release-manifest.json"]);
  const checksums = Object.entries(files).map(([name, content]) => {
    const digest = crypto.createHash("sha256").update(content).digest("hex");
    return `${digest}  ${name}`;
  });
  fs.writeFileSync(path.join(root, "SHA256SUMS"), checksums.join("\n") + "\n");
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-release-manager-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const first = path.join(root, "source-v0.1.0-preview.1");
  const second = path.join(root, "source-v0.1.0-preview.2");
  const incompatible = path.join(root, "source-v0.1.0-preview.3");
  makePackage(first, "0.1.0-preview.1");
  makePackage(second, "0.1.0-preview.2");
  makePackage(incompatible, "0.1.0-preview.3", "gbh-state-v2");
  const home = path.join(root, "install");
  const state = path.join(root, "private-state");
  fs.mkdirSync(path.join(state, "data"), { recursive: true, mode: 0o700 });
  fs.mkdirSync(path.join(state, "workspace"), { recursive: true, mode: 0o700 });
  fs.writeFileSync(path.join(state, "data", "before-update.txt"), "keep me\n");
  fs.symlinkSync("../data/before-update.txt", path.join(state, "workspace", "shared.txt"));
  fs.writeFileSync(path.join(state, "server.env"), "LITELLM_API_KEY=fixture-only\n", { mode: 0o600 });
  return { first, second, incompatible, home, state };
}

test("failed candidate startup restores saved state and restarts the prior release", (t) => {
  const { first, second, home, state } = fixture(t);
  const calls = [];
  installRelease(first, home, state, (release, command) => { calls.push([path.basename(release), command]); return 0; });
  assert.throws(() => updateRelease(second, home, state, (release, command) => {
    const version = path.basename(release);
    calls.push([version, command]);
    if (command === "start" && version === "0.1.0-preview.2") {
      fs.writeFileSync(path.join(state, "data", "before-update.txt"), "partially migrated\n");
      fs.writeFileSync(path.join(state, "data", "candidate-write.txt"), "candidate\n");
      return 1;
    }
    return 0;
  }), /user state was restored/);

  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "keep me\n");
  assert.equal(fs.existsSync(path.join(state, "data", "candidate-write.txt")), false);
  assert.equal(fs.readFileSync(path.join(state, "server.env"), "utf8"), "LITELLM_API_KEY=fixture-only\n");
  assert.equal(fs.readlinkSync(path.join(state, "workspace", "shared.txt")), "../data/before-update.txt");
  assert.ok(calls.some(([version, command]) => version === "0.1.0-preview.1" && command === "start"));
});

test("retrying install after state initialization failure reuses the active package", (t) => {
  const { first, home, state } = fixture(t);
  let attempts = 0;
  assert.throws(() => installRelease(first, home, state, (_release, command) => {
    if (command === "install" && attempts++ === 0) return 1;
    return 0;
  }), /initialization failed/);
  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
  assert.equal(installRelease(first, home, state, (_release, command) => command === "install" ? 0 : 1), "0.1.0-preview.1");
  const launcherEnv = { ...process.env };
  delete launcherEnv.GBH_SERVER_STATE_DIR;
  const launcher = spawnSync(path.join(home, "bin", "gbh-server"), ["status"], { encoding: "utf8", env: launcherEnv });
  assert.equal(launcher.status, 0, launcher.stderr);
  assert.match(fs.readFileSync(path.join(state, "server-commands.log"), "utf8"), /0\.1\.0-preview\.1:status/);
});

test("failed state ownership preparation restarts the current release before aborting an update", (t) => {
  const { first, second, home, state } = fixture(t);
  installRelease(first, home, state, () => 0);
  const calls = [];
  assert.throws(() => updateRelease(second, home, state, (release, command) => {
    calls.push([path.basename(release), command]);
    return command === "prepare-release-state" ? 1 : 0;
  }), /current server was restarted and state was unchanged/);

  assert.deepEqual(calls, [
    ["0.1.0-preview.1", "stop"],
    ["0.1.0-preview.1", "prepare-release-state"],
    ["0.1.0-preview.1", "start"],
  ]);
  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "keep me\n");
  assert.equal(fs.existsSync(path.join(home, "backups")), false);
  assert.equal(fs.existsSync(path.join(home, "update-in-progress.json")), false);
});

test("partial Compose stop failure restarts the current release without preparing a checkpoint", (t) => {
  const { first, second, home, state } = fixture(t);
  installRelease(first, home, state, () => 0);
  const calls = [];
  assert.throws(() => updateRelease(second, home, state, (release, command) => {
    calls.push([path.basename(release), command]);
    return command === "stop" ? 1 : 0;
  }), /current server was restarted and state was unchanged: Could not stop the current server cleanly/);
  assert.deepEqual(calls, [
    ["0.1.0-preview.1", "stop"],
    ["0.1.0-preview.1", "start"],
  ]);
  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "keep me\n");
  assert.equal(fs.existsSync(path.join(home, "backups")), false);
});

test("partial checkpoint cleanup cannot prevent restarting the stopped release", (t) => {
  const { first, state } = fixture(t);
  const calls = [];
  assert.throws(() => stopAndSnapshot(first, state, path.join(state, "partial-backup"), (_release, command) => {
    calls.push(command);
    return 0;
  }, {
    snapshot() { throw new Error("injected checkpoint failure"); },
    removeBackup() {
      calls.push("cleanup");
      throw new Error("injected cleanup failure");
    },
  }), /current server was restarted and state was unchanged: injected checkpoint failure.*cleanup also failed: injected cleanup failure/);
  assert.deepEqual(calls, ["stop", "prepare-release-state", "start", "cleanup"]);
});

test("same-format rollback keeps user writes made after the successful update", (t) => {
  const { first, second, home, state } = fixture(t);
  installRelease(first, home, state, () => 0);
  updateRelease(second, home, state, () => 0);
  fs.writeFileSync(path.join(state, "workspace", "after-update.txt"), "new user work\n");

  assert.equal(rollbackRelease(home, state, () => 0), "0.1.0-preview.1");
  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
  assert.equal(fs.readFileSync(path.join(state, "workspace", "after-update.txt"), "utf8"), "new user work\n");
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "keep me\n");
});

test("state-format mismatch blocks update before stopping the current release", (t) => {
  const { first, incompatible, home, state } = fixture(t);
  installRelease(first, home, state, () => 0);
  const commands = [];
  assert.throws(() => updateRelease(incompatible, home, state, (_release, command) => {
    commands.push(command);
    return 0;
  }), /tested migration is required/);
  assert.deepEqual(commands, []);
  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
});

test("a failed rollback restores the exact state snapshot before restarting the current release", (t) => {
  const { first, second, home, state } = fixture(t);
  installRelease(first, home, state, () => 0);
  updateRelease(second, home, state, () => 0);
  fs.writeFileSync(path.join(state, "data", "before-update.txt"), "latest user state\n");
  const calls = [];

  assert.throws(() => rollbackRelease(home, state, (release, command) => {
    const version = path.basename(release);
    calls.push([version, command]);
    if (command === "start" && version === "0.1.0-preview.1") {
      fs.writeFileSync(path.join(state, "data", "before-update.txt"), "failed rollback mutation\n");
      return 1;
    }
    return 0;
  }), /current release was restored/);

  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.2");
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "latest user state\n");
  assert.ok(calls.some(([version, command]) => version === "0.1.0-preview.1" && command === "stop"));
  assert.ok(calls.some(([version, command]) => version === "0.1.0-preview.2" && command === "start"));
});

test("manifest edits and extra files fail the package inventory check", (t) => {
  const { first } = fixture(t);
  const manifestPath = path.join(first, "release-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.stateFormat = "gbh-state-v2";
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  assert.throws(() => verifyPackage(first), /checksum mismatch: release-manifest\.json/);

  const { second } = fixture(t);
  fs.writeFileSync(path.join(second, "unlisted-runtime.cjs"), "unexpected\n");
  assert.throws(() => verifyPackage(second), /file inventory does not match/);
});

test("missing recovery snapshot entries leave all current state untouched", (t) => {
  const { state } = fixture(t);
  const backup = path.join(path.dirname(state), "backup");
  snapshotState(state, backup);
  fs.writeFileSync(path.join(state, "data", "before-update.txt"), "current data\n");
  fs.rmSync(path.join(backup, "data", "before-update.txt"), { force: true });

  assert.throws(() => restoreState(state, backup), /contents failed their integrity check/);
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "current data\n");
  assert.equal(fs.readFileSync(path.join(state, "server.env"), "utf8"), "LITELLM_API_KEY=fixture-only\n");
});

test("an active operation lock prevents concurrent release changes", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-release-lock-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "release-operation.lock"), JSON.stringify({ pid: process.pid, hostname: os.hostname() }) + "\n");
  assert.throws(() => withLock(root, () => "should not run"), /Another release operation is running/);
  assert.equal(fs.existsSync(path.join(root, "release-operation.lock")), true);
});

test("an incomplete lock is retained and blocks a second operation", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-release-empty-lock-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lockFile = path.join(root, "release-operation.lock");
  fs.writeFileSync(lockFile, "");
  assert.throws(() => withLock(root, () => "should not run"), /incomplete or unreadable/);
  assert.equal(fs.existsSync(lockFile), true);
});

test("a stale lock is never reclaimed by racing callers", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-release-stale-lock-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lockFile = path.join(root, "release-operation.lock");
  fs.writeFileSync(lockFile, JSON.stringify({ pid: 99999999, hostname: os.hostname() }) + "\n");
  assert.throws(() => withLock(root, () => "should not run"), /is stale; verify that process is stopped/);
  assert.equal(fs.existsSync(lockFile), true);
  assert.throws(() => withLock(root, () => "should not run"), /is stale; verify that process is stopped/);
  assert.equal(fs.existsSync(lockFile), true);
});

test("a killed updater is manually unlocked and the recovery command restores state", async (t) => {
  const { first, second, home, state } = fixture(t);
  installRelease(first, home, state, () => 0);
  const marker = path.join(path.dirname(home), "candidate-started");
  const manager = path.resolve(__dirname, "../release.cjs");
  const updater = spawn(process.execPath, ["-e", `
    const fs = require("node:fs");
    const { updateRelease } = require(${JSON.stringify(manager)});
    const [candidate, home, state, marker] = process.argv.slice(1);
    updateRelease(candidate, home, state, (release, command) => {
      if (command === "start" && release.endsWith("0.1.0-preview.2")) {
        fs.writeFileSync(require("node:path").join(state, "data", "before-update.txt"), "interrupted startup mutation\\n");
        fs.writeFileSync(marker, "ready\\n");
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0);
      }
      return 0;
    });
  `, second, home, state, marker], { stdio: "ignore" });
  t.after(() => {
    if (updater.exitCode === null && updater.signalCode === null) updater.kill("SIGKILL");
  });

  const deadline = Date.now() + 10_000;
  while (!fs.existsSync(marker) && Date.now() < deadline && updater.exitCode === null) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(fs.existsSync(marker), true, "candidate startup reached the controlled interruption boundary");
  updater.kill("SIGKILL");
  const [exitCode, signal] = await once(updater, "exit");
  assert.equal(exitCode, null);
  assert.equal(signal, "SIGKILL");
  assert.equal(fs.existsSync(path.join(home, "update-in-progress.json")), true);
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "interrupted startup mutation\n");

  const lockFile = path.join(home, "release-operation.lock");
  const lock = JSON.parse(fs.readFileSync(lockFile, "utf8"));
  assert.equal(lock.pid, updater.pid);
  assert.equal(lock.hostname, os.hostname());
  assert.throws(() => process.kill(updater.pid, 0), { code: "ESRCH" });
  // Documented operator step: check the recorded same-host PID is gone, then remove the stale lock.
  fs.unlinkSync(lockFile);

  const recovery = spawnSync(process.execPath, [manager, "recover"], {
    encoding: "utf8",
    env: { ...process.env, GBH_RELEASE_HOME: home, GBH_SERVER_STATE_DIR: state },
  });
  assert.equal(recovery.status, 0, recovery.stderr);
  assert.match(recovery.stdout, /Recovery complete/);
  assert.equal(path.basename(currentRelease(home)), "0.1.0-preview.1");
  assert.equal(fs.readFileSync(path.join(state, "data", "before-update.txt"), "utf8"), "keep me\n");
  assert.equal(fs.existsSync(path.join(state, "data", "candidate-write.txt")), false);
  assert.equal(fs.existsSync(path.join(home, "update-in-progress.json")), false);
  assert.equal(fs.existsSync(lockFile), false);
  assert.deepEqual(
    fs.readFileSync(path.join(state, "server-commands.log"), "utf8").trim().split("\n"),
    ["0.1.0-preview.2:stop", "0.1.0-preview.2:prepare-release-state", "0.1.0-preview.1:start"],
  );
});
