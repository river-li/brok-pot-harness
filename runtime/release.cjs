#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const stateEntries = ["data", "workspace", "server.env", "gateway-token", "search-secret"];

function releaseHome(env = process.env) {
  return path.resolve(env.GBH_RELEASE_HOME || path.join(os.homedir(), ".local", "opt", "gbh"));
}

function stateHome(env = process.env) {
  return path.resolve(env.GBH_SERVER_STATE_DIR || path.join(os.homedir(), ".local", "share", "gbh"));
}

function versionDir(home, version) {
  if (typeof version !== "string" || !/^[0-9A-Za-z][0-9A-Za-z.+-]{0,63}$/.test(version)) {
    throw new Error("Release manifest has an invalid product version.");
  }
  return path.join(home, "releases", version);
}

function atomicWrite(file, contents, mode = 0o600) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(temporary, contents, { flag: "wx", mode });
  fs.renameSync(temporary, file);
  fs.chmodSync(file, mode);
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function checksumLines(packageRoot) {
  const file = path.join(packageRoot, "SHA256SUMS");
  if (!fs.existsSync(file)) throw new Error("Release package is missing SHA256SUMS.");
  const listed = new Map();
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean)) {
    const match = /^([a-f0-9]{64})  ([^\r\n]+)$/.exec(line);
    if (!match || path.isAbsolute(match[2]) || match[2].includes("\\") || match[2].split("/").some((part) => part === ".." || part === ".")) {
      throw new Error("Release package has an invalid SHA256SUMS entry.");
    }
    if (listed.has(match[2])) throw new Error(`Release package repeats checksum path ${match[2]}.`);
    listed.set(match[2], match[1]);
  }
  return listed;
}

function packageFiles(root, directory = root, result = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile())) {
      throw new Error(`Release package contains a link or special file: ${path.relative(root, file)}.`);
    }
    if (stat.isDirectory()) packageFiles(root, file, result);
    else result.push(path.relative(root, file).split(path.sep).join("/"));
  }
  return result;
}

function verifyPackage(packageRoot) {
  const root = path.resolve(packageRoot);
  const manifestPath = path.join(root, "release-manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error("Release package is missing release-manifest.json.");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.schemaVersion !== 1 || !manifest.releaseVersion || !manifest.stateFormat ||
      !/^[a-f0-9]{40}$/.test(manifest.sourceCommit || "") || manifest.upstreamBaseline !== "bfe1879" ||
      (manifest.sourceTreeClean !== true && manifest.sourceTreeClean !== false) ||
      manifest.nodeVersion !== "24.14.0" || manifest.buildEnvironment?.node !== "v24.14.0" ||
      manifest.buildEnvironment?.system !== "Linux" || !["x86_64", "amd64"].includes(manifest.buildEnvironment?.machine)) {
    throw new Error("Release manifest is missing its schema, version, full source commit, baseline, or state format.");
  }
  if (process.version !== `v${manifest.nodeVersion}`) {
    throw new Error(`This release requires Node.js v${manifest.nodeVersion}; found ${process.version}.`);
  }
  if (manifest.buildProfile !== "local" || manifest.serverPlatform !== "linux/amd64" ||
      manifest.clientPlatform !== "macos/arm64" ||
      manifest.speechImage !== `gbh-server-speech:${manifest.releaseVersion.toLowerCase()}-${manifest.sourceCommit.slice(0, 12)}`) {
    throw new Error("Release package is not a supported local-profile linux/amd64 server build.");
  }
  const checksums = checksumLines(root);
  const actualFiles = packageFiles(root).filter((name) => name !== "SHA256SUMS").sort();
  const listedFiles = [...checksums.keys()].sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(listedFiles)) {
    throw new Error("Release package file inventory does not match SHA256SUMS.");
  }
  for (const [name, expected] of checksums) {
    const file = path.resolve(root, name);
    if (!inside(root, file) || !fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      throw new Error(`Release package checksum path is missing or unsafe: ${name}.`);
    }
    const actual = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    if (actual !== expected) throw new Error(`Release package checksum mismatch: ${name}.`);
  }
  for (const required of [
    "install.sh",
    "release-manifest.json",
    "release/RESOURCE-NOTICES.md",
    "release/RELEASE-NOTES.md",
    "release/retained-desktop-provenance.json",
    "runtime/server.cjs",
    "runtime/release.cjs",
    "runtime/release-extract.py",
    "runtime/compose.yaml",
    "runtime/box-entrypoint.sh",
    ".runtime/build/sand-host/build-profile.json",
  ]) {
    if (!checksums.has(required)) throw new Error(`Release package does not cover required runtime file ${required}.`);
  }
  const profile = JSON.parse(fs.readFileSync(path.join(root, ".runtime/build/sand-host/build-profile.json"), "utf8"));
  if (profile.profile !== "local") throw new Error("Release package Host build is not the local profile.");
  const provenance = JSON.parse(fs.readFileSync(path.join(root, "release/retained-desktop-provenance.json"), "utf8"));
  if (provenance.source !== "retained desktop bundle imported for local recovery" ||
      provenance.version !== "0.44.0" || !/^[a-f0-9]{64}$/.test(provenance.sha256 || "") || !Array.isArray(provenance.files)) {
    throw new Error("Release package retained-desktop provenance is incomplete or contains an unexpected source.");
  }
  if (fs.readFileSync(manifestPath, "utf8").includes("/Applications/Grok Bot.app")) {
    throw new Error("Release manifest contains a source-machine application path.");
  }
  const compose = fs.readFileSync(path.join(root, "runtime/compose.yaml"), "utf8");
  if (!compose.includes(`image: ${manifest.speechImage}`)) {
    throw new Error("Release Compose configuration is not pinned to this release's speech image identity.");
  }
  return { root, manifest, checksums };
}

function copyPackage(sourceDir, home) {
  const { manifest, checksums } = verifyPackage(sourceDir);
  const destination = versionDir(home, manifest.releaseVersion);
  fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
  if (fs.existsSync(destination)) {
    const existing = verifyPackage(destination);
    if (JSON.stringify([...existing.checksums]) !== JSON.stringify([...checksums])) {
      throw new Error(`Release ${manifest.releaseVersion} is already installed with different contents.`);
    }
    return { destination, manifest };
  }
  fs.cpSync(path.resolve(sourceDir), destination, {
    recursive: true,
    dereference: false,
    verbatimSymlinks: true,
    preserveTimestamps: true,
    errorOnExist: true,
  });
  verifyPackage(destination);
  return { destination, manifest };
}

function packageInput(inputPath, extractorRoot) {
  const input = path.resolve(inputPath);
  const stat = fs.lstatSync(input);
  if (stat.isDirectory() && !stat.isSymbolicLink()) return { root: input, cleanup: null };
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Release input must be a directory or regular server archive.");
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "gbh-release-extract-"));
  const extractor = path.join(extractorRoot, "runtime/release-extract.py");
  const python = process.env.PYTHON || "python3";
  const result = spawnSync(python, [extractor, input, temporary], { stdio: "inherit" });
  if (result.error || result.status !== 0) {
    fs.rmSync(temporary, { recursive: true, force: true });
    throw new Error(`Release archive extraction failed${result.error ? `: ${result.error.message}` : ""}.`);
  }
  const directManifest = path.join(temporary, "release-manifest.json");
  if (fs.existsSync(directManifest)) return { root: temporary, cleanup: temporary };
  const nested = fs.readdirSync(temporary, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(temporary, entry.name, "release-manifest.json")));
  if (nested.length !== 1) {
    fs.rmSync(temporary, { recursive: true, force: true });
    throw new Error("Release archive must contain exactly one release package.");
  }
  return { root: path.join(temporary, nested[0].name), cleanup: temporary };
}

function currentRelease(home) {
  const pointer = path.join(home, "current");
  if (!fs.existsSync(pointer)) return null;
  const resolved = fs.realpathSync(pointer);
  const releases = fs.realpathSync(path.join(home, "releases"));
  if (!inside(releases, resolved)) throw new Error("Active release pointer escapes the managed releases directory.");
  verifyPackage(resolved);
  return resolved;
}

function activate(home, targetDir) {
  const releases = fs.realpathSync(path.join(home, "releases"));
  const target = fs.realpathSync(targetDir);
  if (!inside(releases, target)) throw new Error("Cannot activate a release outside the managed releases directory.");
  const pointer = path.join(home, "current");
  if (fs.existsSync(pointer) && !fs.lstatSync(pointer).isSymbolicLink()) {
    throw new Error("The active release path exists and is not a managed symbolic link.");
  }
  const temporary = path.join(home, `.current-${process.pid}-${crypto.randomBytes(4).toString("hex")}`);
  fs.symlinkSync(path.relative(fs.realpathSync(home), target), temporary, "dir");
  fs.renameSync(temporary, pointer);
}

function serverCommand(releaseDir, command, env = process.env) {
  const stateDir = stateHome(env);
  const childEnv = {
    ...env,
    GBH_SERVER_STATE_DIR: stateDir,
    GBH_SERVER_ENV_FILE: path.join(stateDir, "server.env"),
  };
  const result = spawnSync(process.execPath, [path.join(releaseDir, "runtime/server.cjs"), command], {
    cwd: releaseDir,
    env: childEnv,
    stdio: "inherit",
  });
  if (result.error) console.error(`Could not run server command: ${result.error.message}`);
  return result.status ?? 1;
}

function copyEntry(source, destination) {
  let stat;
  try { stat = fs.lstatSync(source); } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
  if (stat.isSymbolicLink()) {
    fs.symlinkSync(fs.readlinkSync(source), destination);
    return true;
  }
  fs.cpSync(source, destination, {
    recursive: true,
    dereference: false,
    verbatimSymlinks: true,
    preserveTimestamps: true,
    errorOnExist: true,
  });
  return true;
}

function hashFile(file) {
  const digest = crypto.createHash("sha256");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  const flags = fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0);
  const fd = fs.openSync(file, flags);
  let size = 0;
  try {
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) {
      digest.update(buffer.subarray(0, count));
      size += count;
    }
  } finally {
    fs.closeSync(fd);
  }
  return { sha256: digest.digest("hex"), size };
}

function stateInventory(root, topLevelNames) {
  const records = [];
  function visit(file, relative) {
    const stat = fs.lstatSync(file);
    const mode = stat.mode & 0o777;
    if (stat.isSymbolicLink()) {
      records.push({ path: relative, type: "symlink", target: fs.readlinkSync(file), mode });
      return;
    }
    if (stat.isDirectory()) {
      records.push({ path: relative, type: "directory", mode });
      for (const child of fs.readdirSync(file).sort()) visit(path.join(file, child), `${relative}/${child}`);
      return;
    }
    if (stat.isFile()) {
      records.push({ path: relative, type: "file", mode, ...hashFile(file) });
      return;
    }
    throw new Error(`Server state contains an unsupported file type: ${relative}.`);
  }
  for (const name of topLevelNames) {
    const file = path.join(root, name);
    let stat;
    try { stat = fs.lstatSync(file); } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error(`Server state entry ${name} cannot be a symlink.`);
    if (stat.isDirectory() || stat.isFile()) visit(file, name);
    else throw new Error(`Server state contains an unsupported file type: ${name}.`);
  }
  return records.sort((left, right) => left.path.localeCompare(right.path));
}

function validateStatePaths(stateDir) {
  for (const name of stateEntries) {
    const file = path.join(stateDir, name);
    let stat;
    try { stat = fs.lstatSync(file); } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile())) {
      throw new Error(`Server state entry ${name} must be a regular file or directory; updates leave it untouched.`);
    }
  }
}

function snapshotState(stateDir, backupDir) {
  validateStatePaths(stateDir);
  fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });
  const entries = [];
  for (const name of stateEntries) {
    if (copyEntry(path.join(stateDir, name), path.join(backupDir, name))) entries.push(name);
  }
  const inventory = stateInventory(backupDir, entries);
  const content = JSON.stringify({ schemaVersion: 2, entries, inventory }, null, 2) + "\n";
  atomicWrite(path.join(backupDir, "snapshot.json"), content);
  return { entries, digest: crypto.createHash("sha256").update(content).digest("hex") };
}

function validateSnapshot(backupDir, expectedDigest = null) {
  const snapshotFile = path.join(backupDir, "snapshot.json");
  const content = fs.readFileSync(snapshotFile, "utf8");
  if (expectedDigest && crypto.createHash("sha256").update(content).digest("hex") !== expectedDigest) {
    throw new Error("Update state snapshot metadata failed its integrity check; current state was left untouched.");
  }
  const snapshot = JSON.parse(content);
  if (snapshot.schemaVersion !== 2 || !Array.isArray(snapshot.entries) ||
      snapshot.entries.some((name) => !stateEntries.includes(name)) || new Set(snapshot.entries).size !== snapshot.entries.length ||
      !Array.isArray(snapshot.inventory)) {
    throw new Error("Update state snapshot is invalid; automatic recovery stopped.");
  }
  const backupEntries = fs.readdirSync(backupDir).filter((name) => name !== "snapshot.json").sort();
  if (JSON.stringify(backupEntries) !== JSON.stringify([...snapshot.entries].sort())) {
    throw new Error("Update state snapshot file inventory is incomplete; current state was left untouched.");
  }
  const actualInventory = stateInventory(backupDir, snapshot.entries);
  if (JSON.stringify(actualInventory) !== JSON.stringify(snapshot.inventory)) {
    throw new Error("Update state snapshot contents failed their integrity check; current state was left untouched.");
  }
  return snapshot;
}

function restoreState(stateDir, backupDir, expectedDigest = null) {
  const snapshot = validateSnapshot(backupDir, expectedDigest);
  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  const stagingDir = path.join(stateDir, `.restore-${crypto.randomBytes(6).toString("hex")}`);
  fs.mkdirSync(stagingDir, { mode: 0o700 });
  try {
    for (const name of snapshot.entries) {
      if (!copyEntry(path.join(backupDir, name), path.join(stagingDir, name))) {
        throw new Error(`Could not stage saved state entry ${name}; current state was left untouched.`);
      }
    }
    const stagedInventory = stateInventory(stagingDir, snapshot.entries);
    if (JSON.stringify(stagedInventory) !== JSON.stringify(snapshot.inventory)) {
      throw new Error("Staged update state failed its integrity check; current state was left untouched.");
    }
  } catch (error) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
    throw error;
  }
  for (const name of stateEntries) {
    const current = path.join(stateDir, name);
    fs.rmSync(current, { recursive: true, force: true });
    if (snapshot.entries.includes(name)) fs.renameSync(path.join(stagingDir, name), current);
  }
  fs.rmSync(stagingDir, { recursive: true, force: true });
}

function writeJournal(file, journal) {
  atomicWrite(file, JSON.stringify(journal, null, 2) + "\n");
}

function readJournal(file, home, stateDir) {
  const journal = JSON.parse(fs.readFileSync(file, "utf8"));
  const oldDir = versionDir(home, journal.previousVersion);
  const newDir = versionDir(home, journal.nextVersion);
  const backupDir = path.resolve(journal.backupDir);
  if (journal.schemaVersion !== 1 || !inside(home, backupDir) || !fs.existsSync(oldDir) || !fs.existsSync(newDir) ||
      !/^[a-f0-9]{64}$/.test(journal.snapshotDigest || "")) {
    throw new Error("Update recovery journal references an invalid release or snapshot.");
  }
  if (path.resolve(journal.stateDir) !== path.resolve(stateDir)) {
    throw new Error("Update recovery journal belongs to a different server state directory.");
  }
  verifyPackage(oldDir);
  verifyPackage(newDir);
  validateSnapshot(backupDir, journal.snapshotDigest);
  return { ...journal, oldDir, newDir, backupDir };
}

function isProcessRunning(pid, hostname) {
  if (!Number.isInteger(pid) || pid < 1 || hostname !== os.hostname()) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

function withLock(home, action) {
  fs.mkdirSync(home, { recursive: true, mode: 0o700 });
  const lockFile = path.join(home, "release-operation.lock");
  let fd;
  try {
    fd = fs.openSync(lockFile, "wx", 0o600);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    let lock;
    try { lock = JSON.parse(fs.readFileSync(lockFile, "utf8")); } catch {
      throw new Error("Release operation lock is incomplete or unreadable; inspect it before removing it.");
    }
    if (!Number.isInteger(lock.pid) || typeof lock.hostname !== "string") {
      throw new Error("Release operation lock has no verifiable owner; inspect it before removing it.");
    }
    if (lock.hostname !== os.hostname()) {
      throw new Error("Release operation lock belongs to another or unverifiable host; inspect it before removing it.");
    }
    if (isProcessRunning(lock.pid, lock.hostname)) throw new Error(`Another release operation is running with PID ${lock.pid}.`);
    throw new Error(`Release operation lock from PID ${lock.pid} is stale; verify that process is stopped, remove ${lockFile}, then retry.`);
  }
  fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, hostname: os.hostname(), startedAt: new Date().toISOString() }) + "\n");
  fs.closeSync(fd);
  try {
    return action();
  } finally {
    fs.rmSync(lockFile, { force: true });
  }
}

function recoverInterruptedUpdate(home, stateDir, runServer) {
  const journalFile = path.join(home, "update-in-progress.json");
  if (!fs.existsSync(journalFile)) return false;
  const journal = readJournal(journalFile, home, stateDir);
  const active = currentRelease(home);
  if (active && runServer(active, "stop") !== 0) {
    throw new Error("Cannot stop the active server for interrupted-update recovery; state was left untouched.");
  }
  restoreState(stateDir, journal.backupDir, journal.snapshotDigest);
  activate(home, journal.oldDir);
  if (runServer(journal.oldDir, "start") !== 0) {
    throw new Error("Previous release was restored, but could not restart; rerun `gbh-server recover` after fixing Docker.");
  }
  fs.rmSync(journalFile, { force: true });
  return true;
}

function stopAndSnapshot(activeDir, stateDir, backupDir, runServer) {
  validateStatePaths(stateDir);
  if (runServer(activeDir, "stop") !== 0) throw new Error("Could not stop the current server; no release or state was changed.");
  try {
    return snapshotState(stateDir, backupDir);
  } catch (error) {
    if (runServer(activeDir, "start") !== 0) {
      throw new Error(`Could not checkpoint state and the current server could not restart: ${error.message}`);
    }
    throw new Error(`Could not checkpoint state; the current server was restarted and state was unchanged: ${error.message}`);
  }
}

function validateLocations(home, stateDir) {
  const installHome = path.resolve(home);
  const dataHome = path.resolve(stateDir);
  if (inside(installHome, dataHome) || inside(dataHome, installHome)) {
    throw new Error("Release files and persistent server state must use separate, non-nested directories.");
  }
}

function updateRelease(sourceDir, home, stateDir, runServer = serverCommand) {
  validateLocations(home, stateDir);
  return withLock(home, () => {
    recoverInterruptedUpdate(home, stateDir, runServer);
    const previousDir = currentRelease(home);
    if (!previousDir) throw new Error("Install a server release before updating it.");
    const previous = verifyPackage(previousDir);
    const input = packageInput(sourceDir, previousDir);
    try {
      const candidate = verifyPackage(input.root);
      if (previous.manifest.stateFormat !== candidate.manifest.stateFormat) {
        throw new Error("Update changes the declared state format; a tested migration is required before promotion.");
      }
      const staged = copyPackage(input.root, home);
      if (staged.destination === previousDir) throw new Error("The requested release is already active.");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupDir = path.join(home, "backups", `${previous.manifest.releaseVersion}-to-${candidate.manifest.releaseVersion}-${stamp}`);
      const snapshot = stopAndSnapshot(previousDir, stateDir, backupDir, runServer);
      const journalFile = path.join(home, "update-in-progress.json");
      writeJournal(journalFile, {
        schemaVersion: 1,
        phase: "candidate-starting",
        previousVersion: previous.manifest.releaseVersion,
        nextVersion: candidate.manifest.releaseVersion,
        stateDir: path.resolve(stateDir),
        backupDir,
        snapshotDigest: snapshot.digest,
      });
      activate(home, staged.destination);
      if (runServer(staged.destination, "start") !== 0) {
        try {
          recoverInterruptedUpdate(home, stateDir, runServer);
        } catch (recoveryError) {
          throw new Error(`Candidate update failed and automatic recovery needs attention: ${recoveryError.message}`);
        }
        throw new Error("Candidate server did not become ready; user state was restored and the previous release restarted.");
      }
      atomicWrite(path.join(home, "last-update.json"), JSON.stringify({
        schemaVersion: 1,
        previousVersion: previous.manifest.releaseVersion,
        currentVersion: candidate.manifest.releaseVersion,
        stateFormat: candidate.manifest.stateFormat,
        backupDir,
        updatedAt: new Date().toISOString(),
      }, null, 2) + "\n");
      fs.rmSync(journalFile, { force: true });
      return candidate.manifest.releaseVersion;
    } finally {
      if (input.cleanup) fs.rmSync(input.cleanup, { recursive: true, force: true });
    }
  });
}

function rollbackRelease(home, stateDir, runServer = serverCommand) {
  validateLocations(home, stateDir);
  return withLock(home, () => {
    recoverInterruptedUpdate(home, stateDir, runServer);
    const currentDir = currentRelease(home);
    const historyPath = path.join(home, "last-update.json");
    if (!currentDir || !fs.existsSync(historyPath)) throw new Error("No successful update is available to roll back.");
    const current = verifyPackage(currentDir);
    const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));
    const targetDir = versionDir(home, history.previousVersion);
    const target = verifyPackage(targetDir);
    if (history.currentVersion !== current.manifest.releaseVersion || current.manifest.stateFormat !== target.manifest.stateFormat) {
      throw new Error("Rollback is not safe for the current state format or release history.");
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(home, "backups", `${current.manifest.releaseVersion}-rollback-to-${target.manifest.releaseVersion}-${stamp}`);
    const snapshot = stopAndSnapshot(currentDir, stateDir, backupDir, runServer);
    const journalFile = path.join(home, "update-in-progress.json");
    writeJournal(journalFile, {
      schemaVersion: 1,
      phase: "rollback-starting",
      previousVersion: current.manifest.releaseVersion,
      nextVersion: target.manifest.releaseVersion,
      stateDir: path.resolve(stateDir),
      backupDir,
      snapshotDigest: snapshot.digest,
    });
    activate(home, targetDir);
    if (runServer(targetDir, "start") !== 0) {
      try {
        recoverInterruptedUpdate(home, stateDir, runServer);
      } catch (recoveryError) {
        throw new Error(`Rollback failed and automatic recovery needs attention: ${recoveryError.message}`);
      }
      throw new Error("Previous release did not become ready; the current release was restored.");
    }
    fs.rmSync(journalFile, { force: true });
    atomicWrite(historyPath, JSON.stringify({ ...history, rolledBackAt: new Date().toISOString() }, null, 2) + "\n");
    return target.manifest.releaseVersion;
  });
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function writeLauncher(home, stateDir) {
  const file = path.join(home, "bin", "gbh-server");
  const content = [
    "#!/bin/sh",
    "set -eu",
    'release_home="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"',
    'export GBH_RELEASE_HOME="$release_home"',
    `default_state_dir=${shellQuote(stateDir)}`,
    'export GBH_SERVER_STATE_DIR="${GBH_SERVER_STATE_DIR:-$default_state_dir}"',
    'export GBH_SERVER_ENV_FILE="${GBH_SERVER_STATE_DIR}/server.env"',
    'exec "${NODE:-node}" "$release_home/current/runtime/release.cjs" "$@"',
    "",
  ].join("\n");
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, content, { mode: 0o755 });
  fs.chmodSync(file, 0o755);
}

function installRelease(sourceDir, home, stateDir, runServer = serverCommand) {
  validateLocations(home, stateDir);
  return withLock(home, () => {
    const active = currentRelease(home);
    const staged = copyPackage(sourceDir, home);
    if (active && path.resolve(active) !== fs.realpathSync(staged.destination)) {
      throw new Error("A different server release is already installed; use `gbh-server update`.");
    }
    fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    fs.chmodSync(stateDir, 0o700);
    writeLauncher(home, stateDir);
    if (!active) activate(home, staged.destination);
    if (runServer(staged.destination, "install") !== 0) {
      throw new Error("Release was installed but server state initialization failed; inspect Docker/runtime and retry install.");
    }
    return staged.manifest.releaseVersion;
  });
}

function usage() {
  console.log("GBH self-hosted preview server\n  install --source <extracted-release-dir>\n  version | start | stop | status | logs\n  update <release-archive-or-directory>\n  rollback\n  recover");
}

function main(argv = process.argv, env = process.env) {
  const command = argv[2] || "help";
  const home = releaseHome(env);
  const stateDir = stateHome(env);
  if (command === "help") return usage();
  if (command === "install") {
    const index = argv.indexOf("--source");
    if (index < 0 || !argv[index + 1]) throw new Error("Pass the extracted release path with --source.");
    return installRelease(argv[index + 1], home, stateDir);
  }
  if (command === "update") {
    if (!argv[3]) throw new Error("Pass the extracted release directory to update.");
    return updateRelease(argv[3], home, stateDir);
  }
  if (command === "rollback") return rollbackRelease(home, stateDir);
  return withLock(home, () => {
    recoverInterruptedUpdate(home, stateDir, serverCommand);
    const current = currentRelease(home);
    if (!current) throw new Error("No GBH server release is installed. Run the archive's install.sh first.");
    if (command === "recover") return "Recovery complete.";
    if (command === "version") {
      console.log(`${verifyPackage(current).manifest.releaseVersion} (${verifyPackage(current).manifest.sourceCommit})`);
      return;
    }
    if (["start", "stop", "status", "logs"].includes(command)) {
      const code = serverCommand(current, command);
      if (code !== 0) process.exitCode = code;
      return;
    }
    throw new Error(`Unknown release command: ${command}`);
  });
}

if (require.main === module) {
  try {
    const result = main();
    if (typeof result === "string") console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  activate,
  currentRelease,
  installRelease,
  packageInput,
  recoverInterruptedUpdate,
  releaseHome,
  rollbackRelease,
  serverCommand,
  snapshotState,
  stateHome,
  stateInventory,
  stopAndSnapshot,
  updateRelease,
  verifyPackage,
  withLock,
  restoreState,
};
