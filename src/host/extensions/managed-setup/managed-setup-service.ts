/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/managed-setup/managed-setup-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process14 = require("node:child_process");
var import_node_fs65 = require("node:fs");
var import_promises57 = require("node:fs/promises");
var import_node_path113 = require("node:path");
init_dist2();
init_dist3();
init_errors();
init_system_errno();
var SandManagedSetupError = class extends SandDomainError {
  name = "SandManagedSetupError";
};
var SAFE_PATH_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
var IMAGE_CONVERGE_ENTRYPOINT = "/usr/local/bin/sand-team-converge.mjs";
var defaultPaths = {
  managedRoot: SAND_MANAGED_ROOT,
  assignmentPath: SAND_MANIFEST_ASSIGNMENT_PATH,
  manifestsRoot: SAND_MANIFESTS_ROOT
};
var MANAGED_SETUP_POLL_INTERVAL_MS = 24 * 60 * 6e4;
var MANAGED_SETUP_RETRY_INITIAL_DELAY_MS = 15e3;
var MANAGED_SETUP_RETRY_MAX_DELAY_MS = 6e4;
var ManagedSetupService = class {
  constructor(options2) {
    this.options = options2;
    this.publish = options2.publish ?? publishSandSetupManifests;
    this.launchConverge = options2.launchConverge ?? launchSandSetupConverge;
    this.log = options2.log ?? (() => {
    });
  }
  options;
  abort = new AbortController();
  publish;
  launchConverge;
  log;
  pollingHandle;
  refreshInFlight = null;
  refreshQueued = false;
  refreshForceQueued = false;
  firstPoll = true;
  stopped = false;
  start() {
    if (this.pollingHandle !== void 0 || this.stopped || !this.options.isInBox) {
      return;
    }
    this.pollingHandle = this.options.polling.start(async () => {
      if (this.firstPoll) {
        this.firstPoll = false;
        await this.seed();
        return;
      }
      await this.refresh();
    }, this.abort.signal);
  }
  dispose() {
    if (this.stopped) return;
    this.stopped = true;
    this.abort.abort();
    this.pollingHandle?.dispose();
    this.pollingHandle = void 0;
    this.refreshQueued = false;
    this.refreshForceQueued = false;
  }
  async refreshManagedSetup(args) {
    const outcome = await this.refresh(args.force === true);
    if (outcome.failure !== null) throw outcome.failure.error;
  }
  async seed() {
    try {
      await this.options.retry.runWithRetry(async () => {
        if ((await this.refresh()).refreshed) return;
        throw new SandManagedSetupError("managed setup is not ready");
      }, this.abort.signal);
    } catch (error42) {
      this.log(`managed setup seed failed; keeping the prior assignment: ${errorLogTag(error42)}`);
    }
  }
  refresh(force = false) {
    if (!this.options.isInBox || this.stopped) {
      return Promise.resolve({ refreshed: false, failure: null });
    }
    this.refreshQueued = true;
    this.refreshForceQueued ||= force;
    if (this.refreshInFlight !== null) return this.refreshInFlight;
    const run = async () => {
      let refreshed = false;
      let failure2 = null;
      while (this.refreshQueued && !this.stopped) {
        this.refreshQueued = false;
        const forceSetup = this.refreshForceQueued;
        this.refreshForceQueued = false;
        try {
          const manifests = await this.options.client.fetchSetupManifests();
          if (this.stopped) return { refreshed: false, failure: null };
          if (this.refreshQueued) {
            this.refreshForceQueued ||= forceSetup;
            continue;
          }
          await this.publish(manifests);
          if (this.stopped) return { refreshed: false, failure: null };
          await this.launchConverge({ force: forceSetup });
          refreshed = true;
          failure2 = null;
        } catch (error42) {
          refreshed = false;
          failure2 = { error: error42 };
          this.log(
            `managed setup refresh failed; keeping the prior assignment: ${errorLogTag(error42)}`
          );
        }
      }
      if (this.stopped) {
        this.refreshQueued = false;
        this.refreshForceQueued = false;
      }
      return { refreshed, failure: failure2 };
    };
    const inFlight = run().finally(() => {
      if (this.refreshInFlight === inFlight) {
        this.refreshInFlight = null;
      }
    });
    this.refreshInFlight = inFlight;
    return inFlight;
  }
};
async function publishSandSetupManifests(manifests, paths = defaultPaths) {
  validateManifests(manifests);
  for (const manifest of manifests) {
    await writeJsonAtomic(manifestPath(paths.manifestsRoot, manifest), manifest);
  }
  const assignment = {
    schemaVersion: SAND_SETUP_SCHEMA_VERSION,
    manifests: manifests.map(manifestRef)
  };
  await (0, import_promises57.mkdir)(paths.managedRoot, { recursive: true, mode: 448 });
  await writeJsonAtomic(paths.assignmentPath, assignment);
  await pruneUnreferencedManifests(paths.manifestsRoot, manifests);
}
async function readdirOrEmpty(dir) {
  try {
    return await (0, import_promises57.readdir)(dir);
  } catch (error42) {
    if (findSystemErrno(error42) === "ENOENT") return [];
    throw error42;
  }
}
async function pruneUnreferencedManifests(manifestsRoot, manifests) {
  const keptRevisionByIdentity = /* @__PURE__ */ new Map();
  for (const manifest of manifests) {
    keptRevisionByIdentity.set(
      [manifest.scope.kind, manifest.scope.id, manifest.manifestId].join("/"),
      manifest.revision
    );
  }
  for (const scopeKind of await readdirOrEmpty(manifestsRoot)) {
    const kindDir = (0, import_node_path113.join)(manifestsRoot, scopeKind);
    for (const scopeId of await readdirOrEmpty(kindDir)) {
      const scopeDir = (0, import_node_path113.join)(kindDir, scopeId);
      for (const manifestId of await readdirOrEmpty(scopeDir)) {
        const manifestDir = (0, import_node_path113.join)(scopeDir, manifestId);
        const keptRevision = keptRevisionByIdentity.get([scopeKind, scopeId, manifestId].join("/"));
        if (keptRevision == null) {
          await (0, import_promises57.rm)(manifestDir, { recursive: true, force: true });
          continue;
        }
        for (const revision of await readdirOrEmpty(manifestDir)) {
          if (revision === keptRevision) continue;
          await (0, import_promises57.rm)((0, import_node_path113.join)(manifestDir, revision), { recursive: true, force: true });
        }
      }
    }
  }
}
async function launchSandSetupConverge(options2 = {}) {
  const logFd = (0, import_node_fs65.openSync)(SAND_SETUP_CONVERGE_LOG_PATH, "a", 384);
  try {
    const child = (0, import_node_child_process14.spawn)(process.execPath, [resolveConvergeEntrypoint()], {
      detached: true,
      env: options2.force === true ? { ...process.env, SAND_MANAGED_SETUP_FORCE: "1" } : process.env,
      stdio: ["ignore", logFd, logFd]
    });
    resetChildOomScoreAdj(child.pid);
    child.unref();
    await new Promise((resolve29, reject2) => {
      child.once("error", reject2);
      child.once("exit", (code, signal) => {
        if (code === 0) {
          resolve29();
          return;
        }
        reject2(
          new Error(
            `managed setup converge exited with ${code ?? `signal ${signal ?? "unknown"}`}`
          )
        );
      });
    });
  } finally {
    (0, import_node_fs65.closeSync)(logFd);
  }
}
function resolveConvergeEntrypoint() {
  const bundled = (0, import_node_path113.join)((0, import_node_path113.dirname)(process.argv[1] ?? ""), "box-scripts", "sand-team-converge.mjs");
  return (0, import_node_fs65.existsSync)(bundled) ? bundled : IMAGE_CONVERGE_ENTRYPOINT;
}
function validateManifests(manifests) {
  const identities = /* @__PURE__ */ new Set();
  for (const manifest of manifests) {
    if (manifest.schemaVersion !== SAND_SETUP_SCHEMA_VERSION) {
      throw new SandManagedSetupError(
        `Unsupported managed setup schema version ${manifest.schemaVersion}.`
      );
    }
    if (manifest.scope.kind !== "team" || !isSafePathSegment(manifest.scope.id) || !isSafePathSegment(manifest.manifestId) || !isSafePathSegment(manifest.revision)) {
      throw new SandManagedSetupError("Managed setup manifest identity is invalid.");
    }
    const identity = [manifest.scope.kind, manifest.scope.id, manifest.manifestId].join("\0");
    if (identities.has(identity)) {
      throw new SandManagedSetupError("Managed setup manifest identities must be unique.");
    }
    identities.add(identity);
    const entryIds = /* @__PURE__ */ new Set();
    for (const entry of manifest.entries) {
      if (!isSafePathSegment(entry.id) || typeof entry.setup !== "string" || entry.check !== void 0 && typeof entry.check !== "string") {
        throw new SandManagedSetupError("Managed setup manifest entry is invalid.");
      }
      if (entryIds.has(entry.id)) {
        throw new SandManagedSetupError("Managed setup manifest entry ids must be unique.");
      }
      entryIds.add(entry.id);
    }
  }
}
function manifestRef(manifest) {
  return {
    scope: manifest.scope,
    manifestId: manifest.manifestId,
    revision: manifest.revision
  };
}
function manifestPath(manifestsRoot, manifest) {
  return (0, import_node_path113.join)(
    manifestsRoot,
    manifest.scope.kind,
    manifest.scope.id,
    manifest.manifestId,
    manifest.revision,
    "manifest.json"
  );
}
function isSafePathSegment(value) {
  return SAFE_PATH_SEGMENT.test(value);
}
async function writeJsonAtomic(path31, value) {
  await (0, import_promises57.mkdir)((0, import_node_path113.dirname)(path31), { recursive: true, mode: 448 });
  await writeFileAtomic(path31, `${JSON.stringify(value, null, 2)}
`, { mode: 384 });
}

