/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/marketplace-cache.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto23 = require("node:crypto");
var import_promises32 = require("node:fs/promises");
var import_node_path61 = require("node:path");
init_dist3();

// @recovered-fragment 2/2
var __awaiter57 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var WINDOWS_RESERVED_PATH_NAMES = /* @__PURE__ */ new Set([
  "con",
  "prn",
  "aux",
  "nul",
  "com1",
  "com2",
  "com3",
  "com4",
  "com5",
  "com6",
  "com7",
  "com8",
  "com9",
  "lpt1",
  "lpt2",
  "lpt3",
  "lpt4",
  "lpt5",
  "lpt6",
  "lpt7",
  "lpt8",
  "lpt9"
]);
function sanitize(value) {
  const sanitized = sanitizeFilename(value).replace(/[. ]+$/g, "");
  if (sanitized === "" || sanitized === "." || sanitized === "..") {
    return "_";
  }
  if (WINDOWS_RESERVED_PATH_NAMES.has(sanitized.toLowerCase())) {
    return `_${sanitized}`;
  }
  return sanitized;
}
var LS_REMOTE_TIMEOUT_MS = 3e4;
var REMOTE_GIT_TIMEOUT_MS = 30 * 6e4;
var LOCAL_GIT_TIMEOUT_MS = 10 * 6e4;
var RECURSIVE_RM_OPTIONS = {
  recursive: true,
  force: true,
  maxRetries: 3
};
var USER_GIT_ACCESS_PATTERNS = [
  "terminal prompts disabled",
  "could not read username",
  "host key verification failed",
  "could not read from remote repository",
  "permission denied",
  "repository not found",
  "user cancelled dialog",
  "spawn git enoent",
  "authentication failed",
  "unable to get password from user"
];
var LOCAL_CACHE_PATTERNS = ["enotempty: directory not empty, rename", "/_staging/"];
var STALE_PINNED_REF_PATTERNS = [
  "upload-pack: not our ref",
  "server does not allow request for unadvertised object"
];
function classifyCloneError(error42) {
  const msg = String(error42).toLowerCase().replaceAll("\\", "/");
  if (USER_GIT_ACCESS_PATTERNS.some((p2) => msg.includes(p2))) {
    return "user_git_access";
  }
  if (LOCAL_CACHE_PATTERNS.every((p2) => msg.includes(p2))) {
    return "local_cache_race";
  }
  if (STALE_PINNED_REF_PATTERNS.some((p2) => msg.includes(p2))) {
    return "stale_pinned_ref";
  }
  return "infrastructure";
}
function isKilledSubprocessError(error42) {
  if (typeof error42 !== "object" || error42 === null) {
    return false;
  }
  if (error42.killed === true) {
    return true;
  }
  return isKilledSubprocessError(error42.cause);
}
function cloneErrorTag(error42) {
  return isKilledSubprocessError(error42) ? "killed_by_budget" : classifyCloneError(error42);
}
function getCanonicalMarketplacePathSegments(gitUrl) {
  const scm = parseAndValidateScmUrl(gitUrl);
  if (!("error" in scm) && scm.provider === "gitlab") {
    let pathname;
    try {
      pathname = new URL(scm.url).pathname.replace(/^\//, "");
    } catch (_a19) {
      throw new Error(`Invalid git URL: ${gitUrl}`);
    }
    const pathSegments = pathname.split("/").filter(Boolean).map((segment) => segment.toLowerCase());
    if (pathSegments.length < 2) {
      throw new Error(`Invalid git URL: ${gitUrl}`);
    }
    return {
      host: scm.host.toLowerCase(),
      pathSegments
    };
  }
  const parsed2 = parseGitUrl(gitUrl);
  if (parsed2 === null) {
    throw new Error(`Invalid git URL: ${gitUrl}`);
  }
  return {
    host: canonicalRepoHost(parsed2.host.replace(/^www\./i, "")).toLowerCase(),
    pathSegments: [parsed2.owner.toLowerCase(), parsed2.repo.toLowerCase()]
  };
}
function manifestCacheKey(clonePath, options2) {
  var _a19, _b2;
  return JSON.stringify({
    clonePath,
    repoName: (_a19 = options2.repoName) !== null && _a19 !== void 0 ? _a19 : null,
    fallbackId: (_b2 = options2.fallbackId) !== null && _b2 !== void 0 ? _b2 : null
  });
}
var _globalInFlight = /* @__PURE__ */ new Map();
var MarketplaceCacheManager = class _MarketplaceCacheManager {
  constructor(cacheRoot, options2) {
    this.cacheRoot = cacheRoot;
    this.options = options2;
    this.manifestCache = /* @__PURE__ */ new Map();
  }
  get sparsePluginClones() {
    var _a19;
    var _b2;
    return (_b2 = (_a19 = this.options) === null || _a19 === void 0 ? void 0 : _a19.sparsePluginClones) !== null && _b2 !== void 0 ? _b2 : false;
  }
  /** Remote-op kill budget, active only behind the rollout flag. */
  remoteTimeoutMs() {
    return this.sparsePluginClones ? REMOTE_GIT_TIMEOUT_MS : void 0;
  }
  /** Local-op kill budget, active only behind the rollout flag. */
  localTimeoutMs() {
    return this.sparsePluginClones ? LOCAL_GIT_TIMEOUT_MS : void 0;
  }
  /** ls-remote kill budget, active only behind the rollout flag. */
  lsRemoteTimeoutMs() {
    return this.sparsePluginClones ? LS_REMOTE_TIMEOUT_MS : void 0;
  }
  cloneResolvedRef(cloneDir, gitUrl, resolvedRef, options2) {
    return __awaiter57(this, void 0, void 0, function* () {
      var _a19, _b2;
      var _c2;
      const execOpts = {
        cwd: cloneDir,
        sshBatchMode: options2 === null || options2 === void 0 ? void 0 : options2.sshBatchMode,
        // Trust this throwaway clone dir so git's dubious-ownership check
        // (CVE-2022-24765) doesn't abort Windows plugin clones — see shallowClone
        // in backend-marketplace-client.ts. Set it last so a caller's config can't
        // drop the staging-dir trust.
        extraGitConfig: Object.assign(Object.assign({}, resolveExtraGitConfig((_a19 = this.options) === null || _a19 === void 0 ? void 0 : _a19.extraGitConfig)), { "safe.directory": cloneDir })
      };
      const { sparse, sparseDirs } = yield resolveSparseClonePlan((_c2 = options2 === null || options2 === void 0 ? void 0 : options2.materialize) !== null && _c2 !== void 0 ? _c2 : "all", this.sparsePluginClones);
      yield execGitNonInteractive(["init"], Object.assign(Object.assign({}, execOpts), { timeoutMs: this.localTimeoutMs() }));
      if (sparse) {
        yield setSparseCheckoutDirs(cloneDir, sparseDirs, {
          sshBatchMode: options2 === null || options2 === void 0 ? void 0 : options2.sshBatchMode,
          extraGitConfig: resolveExtraGitConfig((_b2 = this.options) === null || _b2 === void 0 ? void 0 : _b2.extraGitConfig),
          timeoutMs: this.localTimeoutMs()
        });
      }
      const { stderr: fetchStderr } = yield execGitNonInteractive(["fetch", "--depth", "1", ...sparse ? ["--filter=blob:none"] : [], gitUrl, resolvedRef], Object.assign(Object.assign({}, execOpts), { timeoutMs: this.remoteTimeoutMs() }));
      yield execGitNonInteractive(["checkout", "FETCH_HEAD"], Object.assign(Object.assign({}, execOpts), { timeoutMs: this.remoteTimeoutMs() }));
      return {
        strategy: sparse ? "sparse" : "full",
        filterIgnoredByServer: sparse && serverIgnoredFilter(fetchStderr !== null && fetchStderr !== void 0 ? fetchStderr : "")
      };
    });
  }
  createStagingDir() {
    return __awaiter57(this, void 0, void 0, function* () {
      const stagingDir = (0, import_node_path61.join)(this.cacheRoot, "_staging", (0, import_node_crypto23.randomUUID)());
      yield (0, import_promises32.mkdir)(stagingDir, { recursive: true });
      return stagingDir;
    });
  }
  /**
   * Move a completed staging clone into the canonical cache location.
   * Last-writer-wins: any existing content at `cloneDir` is removed first.
   */
  moveToCanonicalDir(stagingDir, cloneDir) {
    return __awaiter57(this, void 0, void 0, function* () {
      yield (0, import_promises32.mkdir)((0, import_node_path61.dirname)(cloneDir), { recursive: true });
      yield (0, import_promises32.rm)(cloneDir, RECURSIVE_RM_OPTIONS);
      yield (0, import_promises32.rename)(stagingDir, cloneDir);
      return cloneDir;
    });
  }
  cleanStaleStagingDirs() {
    return __awaiter57(this, void 0, void 0, function* () {
      const stagingRoot = (0, import_node_path61.join)(this.cacheRoot, "_staging");
      try {
        const entries = yield (0, import_promises32.readdir)(stagingRoot, { withFileTypes: true });
        const now = Date.now();
        yield Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => __awaiter57(this, void 0, void 0, function* () {
          try {
            const entryPath = (0, import_node_path61.join)(stagingRoot, entry.name);
            const stats = yield (0, import_promises32.stat)(entryPath);
            if (now - stats.mtimeMs > _MarketplaceCacheManager.STALE_STAGING_THRESHOLD_MS) {
              yield (0, import_promises32.rm)(entryPath, RECURSIVE_RM_OPTIONS);
            }
          } catch (_a19) {
          }
        })));
      } catch (_a19) {
      }
    });
  }
  getLegacyCloneDir(marketplaceId, ref) {
    return (0, import_node_path61.join)(this.cacheRoot, sanitize(marketplaceId), sanitize(ref));
  }
  getCanonicalCloneDir(gitUrl, ref) {
    const { host, pathSegments } = getCanonicalMarketplacePathSegments(gitUrl);
    return (0, import_node_path61.join)(this.cacheRoot, sanitize(host), ...pathSegments.map(sanitize), sanitize(ref));
  }
  getCanonicalRepoRootDir(gitUrl) {
    const { host, pathSegments } = getCanonicalMarketplacePathSegments(gitUrl);
    return (0, import_node_path61.join)(this.cacheRoot, sanitize(host), ...pathSegments.map(sanitize));
  }
  pruneSiblingCloneDirs(gitUrl, keepRef, legacyCloneDir) {
    return __awaiter57(this, void 0, void 0, function* () {
      const repoRootDir = this.getCanonicalRepoRootDir(gitUrl);
      const keepDirName = sanitize(keepRef);
      try {
        const entries = yield (0, import_promises32.readdir)(repoRootDir, { withFileTypes: true });
        yield Promise.all(entries.filter((entry) => entry.isDirectory() && entry.name !== keepDirName).map((entry) => (0, import_promises32.rm)((0, import_node_path61.join)(repoRootDir, entry.name), RECURSIVE_RM_OPTIONS)));
      } catch (_a19) {
      }
      if (legacyCloneDir !== void 0) {
        try {
          yield (0, import_promises32.rm)(legacyCloneDir, RECURSIVE_RM_OPTIONS);
        } catch (_b2) {
        }
      }
    });
  }
  /**
   * Ensure a marketplace repository is cloned at the given ref.
   * Branch/tag/HEAD names are resolved to the remote's current full commit SHA
   * before choosing the cache directory, so the cache key does not follow a
   * moving branch name (e.g. `main`). Direct commit SHAs are used as-is because
   * remotes do not resolve arbitrary SHA prefixes.
   *
   * If the clone already exists, returns the path immediately.
   * Otherwise, performs a shallow fetch of that commit (depth 1).
   *
   * When `options.materialize` lists directories (instead of the default
   * `"all"`), the clone is created as a partial (blobless) cone-mode sparse
   * checkout containing only the manifest directories, top-level files, and
   * the listed directories — so cloning a plugin out of a large monorepo does
   * not download the whole repository. Use {@link ensureMaterialized} to
   * expand a cached sparse clone later (e.g. after reading the manifest).
   *
   * Concurrent calls for the same repo (even across different
   * `MarketplaceCacheManager` instances sharing the same `cacheRoot`) are
   * coalesced within a single process. Cross-process safety is ensured by
   * cloning into a staging directory and atomically renaming into place.
   *
   * @param marketplaceId - Logical marketplace identifier used only for legacy cache migration
   * @param gitUrl - Git URL of the marketplace repository
   * @param ref - Git ref (branch, tag, HEAD, or commit SHA)
   * @returns Absolute path to the cloned repository root
   */
  ensureCloned(marketplaceId_1, gitUrl_1, ref_1) {
    return __awaiter57(this, arguments, void 0, function* (marketplaceId, gitUrl, ref, pluginLogger = noopPluginMetricsLogger, options2) {
      const inner = this.serializedOnRepo(this.getCanonicalRepoRootDir(gitUrl), () => {
        var _a19;
        return this.ensureClonedImpl(marketplaceId, gitUrl, ref, pluginLogger, (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.materialize) !== null && _a19 !== void 0 ? _a19 : "all");
      });
      if (this.sparsePluginClones) {
        return inner;
      }
      const CLONE_TIMEOUT_MS = 3e4;
      return withTimeout(inner, CLONE_TIMEOUT_MS, `ensureCloned timed out after ${CLONE_TIMEOUT_MS}ms for ${gitUrl} @ ${ref}`);
    });
  }
  /**
   * Ensure the given directories (or the entire tree, for `"all"`) exist in a
   * clone previously returned by {@link ensureCloned}. Materialization is
   * deferred NARROW fetching, not widening: a sparse clone lazily downloads
   * exactly the requested directories' blobs from the promisor remote (e.g. a
   * second plugin from an already-cached marketplace monorepo, or a plugin
   * path that was only known after reading the manifest). Full clones are a
   * no-op. Serialized with clone operations on the same repo to avoid git
   * index-lock contention.
   */
  ensureMaterialized(clonePath_1, spec_1) {
    return __awaiter57(this, arguments, void 0, function* (clonePath, spec, pluginLogger = noopPluginMetricsLogger) {
      const inner = this.serializedOnRepo((0, import_node_path61.dirname)(clonePath), () => __awaiter57(this, void 0, void 0, function* () {
        var _a19;
        const start = performance.now();
        try {
          yield materializeSparseDirs(clonePath, spec, {
            extraGitConfig: resolveExtraGitConfig((_a19 = this.options) === null || _a19 === void 0 ? void 0 : _a19.extraGitConfig),
            timeoutMs: this.remoteTimeoutMs()
          });
          pluginLogger.increment("marketplace_cache_manager.ensure_materialized.success", 1);
          pluginLogger.distribution("marketplace_cache_manager.ensure_materialized.duration", performance.now() - start);
        } catch (err) {
          pluginLogger.log("error", "Failed to materialize plugin directories in sparse marketplace clone", {
            clonePath,
            spec: spec === "all" ? "all" : spec.join(","),
            error: String(err),
            errorCategory: cloneErrorTag(err)
          });
          pluginLogger.increment("marketplace_cache_manager.ensure_materialized.error", 1, {
            error_category: cloneErrorTag(err)
          });
          pluginLogger.distribution("marketplace_cache_manager.ensure_materialized.duration", performance.now() - start, { outcome: "error" });
          throw err;
        }
      }));
      if (this.sparsePluginClones) {
        return inner;
      }
      const MATERIALIZE_TIMEOUT_MS = 3e4;
      return withTimeout(inner, MATERIALIZE_TIMEOUT_MS, `ensureMaterialized timed out after ${MATERIALIZE_TIMEOUT_MS}ms for ${clonePath}`);
    });
  }
  /**
   * Serializes concurrent clone / materialize calls for the same repo by
   * chaining each new caller after the previous one. At most one git
   * operation runs at a time per repo root within a single process.
   */
  serializedOnRepo(repoRootDir, work) {
    return __awaiter57(this, void 0, void 0, function* () {
      const serializationKey = `${this.cacheRoot}:${repoRootDir}`;
      const predecessor = _globalInFlight.get(serializationKey);
      const myWork = (predecessor !== null && predecessor !== void 0 ? predecessor : Promise.resolve()).catch(() => {
      }).then(work);
      _globalInFlight.set(serializationKey, myWork);
      try {
        return yield myWork;
      } finally {
        if (_globalInFlight.get(serializationKey) === myWork) {
          _globalInFlight.delete(serializationKey);
        }
      }
    });
  }
  ensureClonedImpl(marketplaceId, gitUrl, ref, pluginLogger, materialize3) {
    return __awaiter57(this, void 0, void 0, function* () {
      var _a19, _b2, _c2, _d;
      pluginLogger.log("info", `MarketplaceCacheManager: Ensuring cloned ${marketplaceId} at ${gitUrl}@${ref}`, {
        marketplaceId,
        gitUrl,
        ref
      });
      const originalRef = ref.trim();
      let sshCloneUrl = !gitUrl.startsWith("git@") && !gitUrl.startsWith("ssh://") ? toScmSshUrl(gitUrl) : null;
      let resolvedRef;
      if (sshCloneUrl !== null) {
        try {
          resolvedRef = (yield resolveGitRemoteRef(sshCloneUrl, originalRef, {
            sshBatchMode: true,
            extraGitConfig: resolveExtraGitConfig((_a19 = this.options) === null || _a19 === void 0 ? void 0 : _a19.extraGitConfig),
            timeoutMs: this.lsRemoteTimeoutMs()
          })).fullSha;
        } catch (error42) {
          if (this.sparsePluginClones && isKilledSubprocessError(error42)) {
            throw error42;
          }
          pluginLogger.log("error", "Failed to resolve remote ref using SSH URL, falling back to HTTPS", {
            gitUrl,
            ref,
            error: String(error42),
            errorCategory: classifyCloneError(error42)
          });
          sshCloneUrl = null;
          resolvedRef = (yield resolveGitRemoteRef(gitUrl, originalRef, {
            extraGitConfig: resolveExtraGitConfig((_b2 = this.options) === null || _b2 === void 0 ? void 0 : _b2.extraGitConfig),
            timeoutMs: this.lsRemoteTimeoutMs()
          })).fullSha;
        }
      } else {
        resolvedRef = (yield resolveGitRemoteRef(gitUrl, originalRef, {
          extraGitConfig: resolveExtraGitConfig((_c2 = this.options) === null || _c2 === void 0 ? void 0 : _c2.extraGitConfig),
          timeoutMs: this.lsRemoteTimeoutMs()
        })).fullSha;
      }
      const cloneDir = this.getCanonicalCloneDir(gitUrl, resolvedRef);
      const legacyCloneDir = this.getLegacyCloneDir(marketplaceId, originalRef);
      pluginLogger.log("info", `MarketplaceCacheManager: Resolved clone directory for ${marketplaceId} at ${gitUrl}@${ref} to ${cloneDir}`, {
        marketplaceId,
        resolvedRef,
        originalRef
      });
      const start = performance.now();
      const emitMetric = (suffix, tags) => {
        pluginLogger.increment(`marketplace_cache_manager.ensure_cloned.${suffix}`, 1, tags);
        pluginLogger.distribution(`marketplace_cache_manager.ensure_cloned.${suffix}.duration`, performance.now() - start, tags);
      };
      if (yield this.isCloneComplete(cloneDir)) {
        yield this.pruneSiblingCloneDirs(gitUrl, resolvedRef, legacyCloneDir);
        const cachedCloneIsSparse = yield isSparseCheckoutRepo(cloneDir);
        if (cachedCloneIsSparse) {
          yield materializeSparseDirs(cloneDir, materialize3, {
            extraGitConfig: resolveExtraGitConfig((_d = this.options) === null || _d === void 0 ? void 0 : _d.extraGitConfig),
            timeoutMs: this.remoteTimeoutMs()
          });
        }
        emitMetric("cache_hit", {
          strategy: cachedCloneIsSparse ? "sparse" : "full"
        });
        return cloneDir;
      }
      pluginLogger.increment("marketplace_cache_manager.ensure_cloned.cache_miss", 1);
      return this.cloneViaStaging(cloneDir, gitUrl, sshCloneUrl, resolvedRef, legacyCloneDir, ref, pluginLogger, emitMetric, materialize3);
    });
  }
  /**
   * Clone into a staging dir, then atomically rename into place.
   * Cross-process safe.
   */
  cloneViaStaging(cloneDir, gitUrl, sshCloneUrl, resolvedRef, legacyCloneDir, ref, pluginLogger, emitMetric, materialize3) {
    return __awaiter57(this, void 0, void 0, function* () {
      var _a19;
      yield this.cleanStaleStagingDirs();
      const stagingDir = yield this.createStagingDir();
      pluginLogger.log("info", `MarketplaceCacheManager: Cloning ${gitUrl}@${ref} into staging directory: ${stagingDir}`, {
        gitUrl,
        ref,
        cloneDir
      });
      const heartbeat = this.sparsePluginClones ? setInterval(() => {
        const now = /* @__PURE__ */ new Date();
        void (0, import_promises32.utimes)(stagingDir, now, now).catch(() => {
        });
      }, _MarketplaceCacheManager.STAGING_HEARTBEAT_INTERVAL_MS) : void 0;
      (_a19 = heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.unref) === null || _a19 === void 0 ? void 0 : _a19.call(heartbeat);
      try {
        let outcome;
        if (sshCloneUrl !== null) {
          try {
            outcome = yield this.cloneResolvedRef(stagingDir, sshCloneUrl, resolvedRef, {
              sshBatchMode: true,
              materialize: materialize3
            });
          } catch (error42) {
            if (this.sparsePluginClones && isKilledSubprocessError(error42)) {
              throw error42;
            }
            pluginLogger.log("error", "Falling back to HTTPS clone due to SSH clone failure", {
              gitUrl,
              ref,
              error: String(error42),
              errorCategory: cloneErrorTag(error42)
            });
            yield (0, import_promises32.rm)(stagingDir, RECURSIVE_RM_OPTIONS);
            yield (0, import_promises32.mkdir)(stagingDir, { recursive: true });
            outcome = yield this.cloneResolvedRef(stagingDir, gitUrl, resolvedRef, {
              materialize: materialize3
            });
          }
        } else {
          outcome = yield this.cloneResolvedRef(stagingDir, gitUrl, resolvedRef, {
            materialize: materialize3
          });
        }
        if (outcome.filterIgnoredByServer) {
          pluginLogger.log("warn", "Server ignored --filter=blob:none; sparse clone downloaded a full pack", { gitUrl, ref });
          pluginLogger.increment("marketplace_cache_manager.ensure_cloned.filter_ignored_by_server", 1);
        }
        const resultDir = yield this.moveToCanonicalDir(stagingDir, cloneDir);
        yield this.pruneSiblingCloneDirs(gitUrl, resolvedRef, legacyCloneDir);
        emitMetric("cache_write_success", { strategy: outcome.strategy });
        return resultDir;
      } catch (err) {
        const errorCategory = cloneErrorTag(err);
        emitMetric("error", { error_category: errorCategory });
        pluginLogger.log("error", "Failed to clone marketplace repository via staging clone", {
          gitUrl,
          ref,
          error: String(err),
          errorCategory
        });
        pluginLogger.captureException(err, {
          error_type: "clone_marketplace_repository",
          error_category: errorCategory
        });
        throw err;
      } finally {
        if (heartbeat !== void 0) {
          clearInterval(heartbeat);
        }
        try {
          yield (0, import_promises32.rm)(stagingDir, RECURSIVE_RM_OPTIONS);
        } catch (_b2) {
        }
      }
    });
  }
  /**
   * Returns true if cloneDir contains a complete git clone (has .git and working tree).
   * Distinguishes from an empty/incomplete dir left by mkdir or a failed clone.
   */
  isCloneComplete(cloneDir) {
    return __awaiter57(this, void 0, void 0, function* () {
      try {
        const stats = yield (0, import_promises32.stat)(cloneDir);
        if (!stats.isDirectory())
          return false;
        const entries = yield (0, import_promises32.readdir)(cloneDir);
        if (!entries.includes(".git"))
          return false;
        if (entries.length > 1)
          return true;
        try {
          const sparseMarker = yield (0, import_promises32.stat)((0, import_node_path61.join)(cloneDir, ".git", "info", "sparse-checkout"));
          return sparseMarker.isFile();
        } catch (_a19) {
          return false;
        }
      } catch (_b2) {
        return false;
      }
    });
  }
  /**
   * Resolve and validate a plugin subdirectory within a clone.
   * Prevents path traversal outside the clone root.
   *
   * @param clonePath - Absolute path to the cloned repository
   * @param gitPath - Relative subdirectory within the repository
   * @returns Absolute path to the plugin directory within the clone
   * @throws Error if gitPath escapes the clone directory
   */
  getPluginDir(clonePath, gitPath) {
    return validateAndResolveSubpath(clonePath, gitPath);
  }
  /**
   * Copy a plugin subdirectory from a marketplace clone to a target directory.
   * Uses recursive copy (equivalent to `cp -r`).
   *
   * @param sourcePath - Absolute path to the plugin directory in the clone
   * @param targetDir - Absolute path to the target plugin cache directory
   */
  copyPluginToDir(sourcePath, targetDir) {
    return __awaiter57(this, void 0, void 0, function* () {
      yield (0, import_promises32.mkdir)(targetDir, { recursive: true });
      yield (0, import_promises32.cp)(sourcePath, targetDir, {
        recursive: true,
        verbatimSymlinks: true
      });
    });
  }
  // ==========================================================================
  // Manifest Discovery
  // ==========================================================================
  /**
   * Read and parse the marketplace manifest from a cloned repo.
   * Tries paths in order: `.cursor/marketplace.json` first, then `.claude-plugin/marketplace.json`.
   * Returns the first valid manifest found. Results are cached in memory per clone path.
   *
   * @param clonePath - Absolute path to the cloned marketplace repo
   * @returns Parsed manifest, or null if not found / invalid
   */
  readManifest(clonePath_1) {
    return __awaiter57(this, arguments, void 0, function* (clonePath, options2 = {}) {
      var _a19;
      const cacheKey3 = manifestCacheKey(clonePath, options2);
      if (this.manifestCache.has(cacheKey3)) {
        return (_a19 = this.manifestCache.get(cacheKey3)) !== null && _a19 !== void 0 ? _a19 : null;
      }
      const manifest = yield readMarketplaceManifestFromDir(clonePath, options2);
      this.manifestCache.set(cacheKey3, manifest);
      return manifest;
    });
  }
  /**
   * Resolve a plugin name to its gitPath within a marketplace clone.
   * Reads the manifest, finds the matching plugin entry, and resolves
   * `source` + `pluginRoot` into a validated path.
   *
   * @param clonePath - Absolute path to the cloned marketplace repo
   * @param pluginName - Plugin name to look up
   * @returns Resolved gitPath, or null if not found / external source
   */
  resolvePluginPath(clonePath, pluginName) {
    return __awaiter57(this, void 0, void 0, function* () {
      var _a19;
      const manifest = yield this.readManifest(clonePath);
      if (!manifest)
        return null;
      const entry = manifest.plugins.find((p2) => p2.name === pluginName.toLowerCase());
      if (!entry)
        return null;
      const resolved = resolvePluginSourcePath(entry.source, (_a19 = manifest.metadata) === null || _a19 === void 0 ? void 0 : _a19.pluginRoot);
      if (!resolved)
        return null;
      if (!isPathSafe(resolved))
        return null;
      return resolved;
    });
  }
  /**
   * Discover all plugins in a marketplace clone.
   * Reads the manifest and resolves source info for each plugin,
   * supporting both local paths and external sources.
   *
   * @param clonePath - Absolute path to the cloned marketplace repo
   * @returns Array of discovered plugins with resolved source info
   */
  discoverPlugins(clonePath) {
    return __awaiter57(this, void 0, void 0, function* () {
      const manifest = yield this.readManifest(clonePath);
      if (!manifest)
        return [];
      return discoverPluginsFromManifest(manifest);
    });
  }
};
MarketplaceCacheManager.STALE_STAGING_THRESHOLD_MS = 5 * 60 * 1e3;
MarketplaceCacheManager.STAGING_HEARTBEAT_INTERVAL_MS = 60 * 1e3;
function readMarketplaceManifestFromDir(dir_1) {
  return __awaiter57(this, arguments, void 0, function* (dir, options2 = {}) {
    for (const manifestRelPath of MARKETPLACE_MANIFEST_PATHS) {
      const manifestPath2 = (0, import_node_path61.join)(dir, manifestRelPath);
      let content;
      try {
        content = yield (0, import_promises32.readFile)(manifestPath2, "utf-8");
      } catch (_a19) {
        continue;
      }
      const result = parseMarketplaceManifest(content, options2);
      if (result.success) {
        return result.data;
      }
    }
    return null;
  });
}
function discoverPluginsFromManifest(manifest) {
  var _a19;
  const plugins = [];
  const classified = parseAndClassifyManifestEntries(manifest.plugins, (_a19 = manifest.metadata) === null || _a19 === void 0 ? void 0 : _a19.pluginRoot);
  for (const c of classified) {
    const { name: name17, displayName: displayName2, description: description9, version: version3 } = c.entry;
    const common2 = { name: name17, displayName: displayName2, description: description9, version: version3 };
    switch (c.kind) {
      case "local":
        if (isPathSafe(c.localPath)) {
          plugins.push(Object.assign(Object.assign({}, common2), { sourceType: "local", gitPath: c.localPath }));
        }
        break;
      case "external-github":
        plugins.push(Object.assign(Object.assign({}, common2), { sourceType: "github", gitUrl: c.externalUrl, gitRef: c.externalRef, sha: c.externalSha }));
        break;
      case "external-url":
        plugins.push(Object.assign(Object.assign({}, common2), { sourceType: "url", gitUrl: c.externalUrl, gitRef: c.externalRef, sha: c.externalSha }));
        break;
      case "external-git-subdir":
        plugins.push(Object.assign(Object.assign({}, common2), { sourceType: "git-subdir", gitUrl: c.externalUrl, gitRef: c.externalRef, sha: c.externalSha, subdirPath: c.subdirPath }));
        break;
      case "unresolvable":
        break;
      default: {
        const _exhaustive = c;
        void _exhaustive;
      }
    }
  }
  return plugins;
}

