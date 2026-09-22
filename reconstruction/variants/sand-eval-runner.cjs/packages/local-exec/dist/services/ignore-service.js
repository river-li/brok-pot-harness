/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/ignore-service.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_promises8 = __toESM(require("node:fs/promises"), 1);
var import_node_os6 = __toESM(require("node:os"), 1);
var import_node_path9 = require("node:path");
init_dist();
init_dist3();
var import_ignore2 = __toESM(require_ignore(), 1);
var import_picomatch = __toESM(require_picomatch2(), 1);

// @recovered-fragment 2/2
var IGNORE_FILE_NAMES = [".gitignore", ".cursorignore"];
function makeResolvedIgnorePath(path30) {
  return path30;
}
async function resolvePathForIgnoreService(absolutePath) {
  if (!(0, import_node_path9.isAbsolute)(absolutePath)) {
    return null;
  }
  const resolved = await resolveRealPathStrict(absolutePath);
  if (resolved === null)
    return null;
  return makeResolvedIgnorePath(resolved);
}
async function resolveShellSandboxIgnoreMapping(ignoreService) {
  return ignoreService.getShellSandboxIgnoreMapping ? ignoreService.getShellSandboxIgnoreMapping() : ignoreService.getCursorIgnoreMapping();
}
var maxConcurrentSearches = Math.min(8, Math.max(1, Math.floor(import_node_os6.default.availableParallelism() / 2)));
var LocalIgnoreService = class _LocalIgnoreService {
  constructor(gitExecutor, gitIgnoreMapping, cursorIgnoreMapping, teamSettingsService, rootDirectories) {
    this.gitExecutor = gitExecutor;
    this.gitIgnoreMapping = gitIgnoreMapping;
    this.cursorIgnoreMapping = cursorIgnoreMapping;
    this.teamSettingsService = teamSettingsService;
    this.rootDirectories = rootDirectories;
    this.gitIgnoreCache = new LRUCache({
      max: 2e3
    });
    this.cursorIgnoreCache = new LRUCache({
      max: 2e3
    });
    this.gitRootCache = new LRUCache({
      max: 1e3
    });
    this.gitRemoteUrlCache = new LRUCache({
      max: 200
    });
    this.hasGitDirCache = new LRUCache({
      max: 1e3
    });
    this.gitParsedIgnoreCache = /* @__PURE__ */ new Map();
    this.cursorParsedIgnoreCache = /* @__PURE__ */ new Map();
  }
  static getRipwalkCache() {
    _LocalIgnoreService.ripwalkCache ??= new RipwalkTtlCache();
    return _LocalIgnoreService.ripwalkCache;
  }
  getIgnoreInstance(path30, patterns, cache3) {
    let instance = cache3.get(path30);
    if (!instance) {
      instance = (0, import_ignore2.default)().add(patterns);
      cache3.set(path30, instance);
    }
    return instance;
  }
  /**
   * Check if there are no workspace folders (indicated by empty ignore mappings).
   * When no workspace folders exist, the ignore mappings remain empty after initialization.
   */
  hasNoWorkspaceFolders() {
    return Object.keys(this.gitIgnoreMapping).length === 0 && Object.keys(this.cursorIgnoreMapping).length === 0;
  }
  /**
   * Resolve a caller-supplied root directory for helper lookups.
   *
   * We intentionally do not cache this result: unlike init-time workspace roots,
   * a symlinked lookup root can retarget between calls. These helper methods are
   * low-frequency (e.g. once per grep/ls invocation), so a fresh realpath is
   * preferable to a potentially stale cached answer.
   */
  async resolveLookupRoot(rootDirectory) {
    const resolved = await resolveRealPathStrict(rootDirectory);
    return resolved ?? resolvePath(rootDirectory);
  }
  static async init(ctx, gitExecutor, rootDirectories, teamSettingsService) {
    const resolvedRoots = await asyncMapValues(rootDirectories, async (root) => {
      const resolved = await resolveRealPathStrict(root);
      if (resolved === null) {
        console.warn(`[IgnoreService] Cannot resolve workspace root, using as-is: ${root}`);
        return makeResolvedIgnorePath(root);
      }
      return makeResolvedIgnorePath(resolved);
    });
    const gitIgnoreMapping = {};
    const cursorIgnoreMapping = {};
    const reposInGitRoots = (await asyncMapValues(resolvedRoots, (root) => findGitRoot(ctx, gitExecutor, root))).filter((root) => root !== null);
    if (reposInGitRoots.length > 0) {
      await Promise.all([
        _LocalIgnoreService.initializeIgnoreMapping(reposInGitRoots, ".gitignore", gitIgnoreMapping),
        _LocalIgnoreService.initializeIgnoreMapping(resolvedRoots, ".cursorignore", cursorIgnoreMapping)
      ]);
    }
    return new _LocalIgnoreService(gitExecutor, gitIgnoreMapping, cursorIgnoreMapping, teamSettingsService, resolvedRoots);
  }
  static async preloadHierarchy(startPath, ignoreFileName, mapping, processedDirs) {
    let currentPath = resolvePath(startPath);
    const rootPath = (0, import_node_path9.parse)(currentPath).root;
    while (currentPath !== rootPath) {
      if (processedDirs?.has(currentPath)) {
        const parentPath2 = (0, import_node_path9.dirname)(currentPath);
        if (parentPath2 === currentPath)
          break;
        currentPath = parentPath2;
        continue;
      }
      if (mapping[currentPath] === void 0) {
        await _LocalIgnoreService.handleHierarchyIgnore(currentPath, ignoreFileName, mapping);
      }
      processedDirs?.add(currentPath);
      const parentPath = (0, import_node_path9.dirname)(currentPath);
      if (parentPath === currentPath)
        break;
      currentPath = parentPath;
    }
  }
  static async handleHierarchyIgnore(dir, ignoreFileName, mapping) {
    const ignoreFilePath = (0, import_node_path9.join)(dir, ignoreFileName);
    try {
      await (0, import_promises8.access)(ignoreFilePath, import_promises8.default.constants.F_OK);
      const content = await readText(ignoreFilePath);
      const ignoreRules = _LocalIgnoreService.parseIgnoreRules(content);
      mapping[dir] = ignoreRules;
    } catch (error3) {
      if (error3.code === "ENOENT") {
        mapping[dir] = [];
      } else {
        console.error(`Error reading ${ignoreFileName} file at ${ignoreFilePath}:`, error3);
        mapping[dir] = [];
      }
    }
  }
  static async initializeIgnoreMapping(rootDirectories, ignoreFileName, mapping) {
    try {
      const deduplicatedRoots = _LocalIgnoreService.deduplicateRootDirectories(rootDirectories);
      const ignoreFiles = await _LocalIgnoreService.promiseQueue.enqueueList(deduplicatedRoots, (root) => _LocalIgnoreService.findFilesWithRipgrep(root, ignoreFileName));
      const allIgnoreFiles = Array.from(ignoreFiles.values()).flat();
      await Promise.all(allIgnoreFiles.map(async (filePath) => {
        try {
          const content = await readText(filePath);
          const ignoreRules = _LocalIgnoreService.parseIgnoreRules(content);
          const ignorePath = (0, import_node_path9.dirname)(filePath);
          mapping[ignorePath] = ignoreRules;
        } catch (error3) {
          console.error(`Error processing ${ignoreFileName} file at ${filePath}:`, error3);
        }
      }));
      const processedDirs = /* @__PURE__ */ new Set();
      for (const root of deduplicatedRoots) {
        await _LocalIgnoreService.preloadHierarchy(root, ignoreFileName, mapping, processedDirs);
      }
    } catch (error3) {
      console.error(`Error initializing ignore mapping for ${ignoreFileName}:`, error3);
    }
  }
  /**
   * Locate every ignore file under `rootDirectory`, bucketed by file name.
   *
   * `.gitignore` and `.cursorignore` are collected by one walk with one set of
   * options, so the two `init` mappings share a single ripgrep process through
   * the walk cache instead of racing two full traversals of the workspace.
   */
  static async findFilesWithRipgrep(rootDirectory, fileName) {
    const ctx = createContext();
    const files = [];
    const ripwalkOptions = {
      root: rootDirectory,
      includeGlobs: IGNORE_FILE_NAMES.map((name17) => `**/${name17}`),
      excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS,
      source: "ignore_scan"
    };
    const ripwalkResult = _LocalIgnoreService.getRipwalkCache().walk(ctx, ripwalkOptions);
    for await (const path30 of ripwalkResult.lines) {
      if ((0, import_node_path9.basename)(path30) === fileName) {
        files.push((0, import_node_path9.join)(rootDirectory, path30));
      }
    }
    return files;
  }
  async handleManualLookupWhenNoWorkspaceDirs(absolutePath, ignoreFileName) {
    const mapping = {};
    let cur = (0, import_node_path9.dirname)(absolutePath);
    const rootPath = (0, import_node_path9.parse)(cur).root;
    while (true) {
      const ignoreFilePath = (0, import_node_path9.join)(cur, ignoreFileName);
      try {
        const content = await readText(ignoreFilePath);
        const patterns = _LocalIgnoreService.parseIgnoreRules(content);
        if (patterns.length > 0) {
          mapping[cur] = patterns;
        }
      } catch {
      }
      if (cur === rootPath)
        break;
      cur = (0, import_node_path9.dirname)(cur);
    }
    return this.testIgnored(absolutePath, mapping, (_path, patterns) => (0, import_ignore2.default)().add(patterns));
  }
  // ---------------------------------------------------------------------------
  // Path resolution -- the single gate into the ignore-checking internals
  //
  // All paths are canonicalized via resolveRealPathStrict (realpath) so that
  // symlinks are followed and comparisons against mapping keys are consistent.
  //
  // Failure modes when realpath fails (EACCES, ELOOP):
  //  - Target file path (resolvePathForIgnoreService): returns null -> callers
  //    treat as ignored (fail-closed, conservative for security).
  //  - Watcher event: the caller (cursorIgnoreWatcher) resolves via
  //    resolvePathForIgnoreService and skips unresolvable paths; the init-time
  //    mapping stays intact so rules continue to apply.
  //  - Workspace root at init: kept as-is with a warning rather than dropped,
  //    to avoid silently disabling all ignore rules for that workspace.
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Public API -- accepts ResolvedIgnorePath (caller resolves via
  // resolvePathForIgnoreService), delegates to private check methods.
  // ---------------------------------------------------------------------------
  async isIgnoredByAny(filePath) {
    const [gitIgnored, cursorIgnored, repoBlocked] = await Promise.all([
      this.checkGitIgnored(filePath),
      this.checkCursorIgnored(filePath),
      this.checkRepoBlocked(filePath)
    ]);
    return gitIgnored || cursorIgnored || repoBlocked;
  }
  async isGitIgnored(filePath) {
    return this.checkGitIgnored(filePath);
  }
  async isCursorIgnored(filePath) {
    return this.checkCursorIgnored(filePath);
  }
  // ---------------------------------------------------------------------------
  // Private check methods -- accept only ResolvedIgnorePath
  // ---------------------------------------------------------------------------
  async checkGitIgnored(absolutePath) {
    if (this.hasNoWorkspaceFolders()) {
      return this.handleManualLookupWhenNoWorkspaceDirs(absolutePath, ".gitignore");
    }
    const cached2 = this.gitIgnoreCache.get(absolutePath);
    if (cached2 !== void 0) {
      return cached2;
    }
    await this.populateHierarchyIfNeeded(absolutePath, ".gitignore", this.gitIgnoreMapping);
    const result = this.checkIgnored(absolutePath, this.gitIgnoreMapping, this.gitParsedIgnoreCache);
    this.gitIgnoreCache.set(absolutePath, result);
    return result;
  }
  async checkCursorIgnored(absolutePath) {
    if (this.hasNoWorkspaceFolders()) {
      return this.handleManualLookupWhenNoWorkspaceDirs(absolutePath, ".cursorignore");
    }
    const cached2 = this.cursorIgnoreCache.get(absolutePath);
    if (cached2 !== void 0) {
      return cached2;
    }
    await this.populateHierarchyIfNeeded(absolutePath, ".cursorignore", this.cursorIgnoreMapping);
    const result = this.checkIgnored(absolutePath, this.cursorIgnoreMapping, this.cursorParsedIgnoreCache);
    this.cursorIgnoreCache.set(absolutePath, result);
    return result;
  }
  async populateHierarchyIfNeeded(filePath, ignoreFileName, mapping) {
    let currentPath = (0, import_node_path9.dirname)(resolvePath(filePath));
    const toAdd = [];
    const rootPath = (0, import_node_path9.parse)(currentPath).root;
    while (currentPath !== rootPath) {
      if (this.rootDirectories.some((root) => isPathWithin({ basePath: root, targetPath: currentPath }))) {
        currentPath = (0, import_node_path9.dirname)(currentPath);
        continue;
      }
      if (mapping[currentPath] !== void 0) {
        break;
      }
      toAdd.push(currentPath);
      const parentPath = (0, import_node_path9.dirname)(currentPath);
      if (parentPath === currentPath)
        break;
      currentPath = parentPath;
    }
    if (toAdd.length > 0) {
      await _LocalIgnoreService.promiseQueue.enqueueList(toAdd, (dir) => _LocalIgnoreService.handleHierarchyIgnore(dir, ignoreFileName, mapping));
      if (ignoreFileName === ".gitignore") {
        this.gitIgnoreCache.clear();
      } else {
        this.cursorIgnoreCache.clear();
      }
    }
  }
  /**
   * Test whether a path is ignored by a mapping. The getInstance callback either
   * returns a cached Ignore instance (workspace path) or a fresh one (no-workspace).
   */
  testIgnored(absolutePath, mapping, getInstance) {
    for (const [ignorePath, patterns] of Object.entries(mapping)) {
      if (patterns.length === 0) {
        continue;
      }
      if (!isPathWithin({ basePath: ignorePath, targetPath: absolutePath })) {
        continue;
      }
      const relativePath = (0, import_node_path9.relative)(ignorePath, absolutePath);
      if (relativePath === "") {
        continue;
      }
      const ignoreInstance = getInstance(ignorePath, patterns);
      const normalizedPath = normalizeToUnixPath(relativePath);
      const testResult = ignoreInstance.test(normalizedPath);
      if (testResult.ignored && !testResult.unignored) {
        return true;
      }
      const testResultWithSlash = ignoreInstance.test(`${normalizedPath}/`);
      if (testResultWithSlash.ignored && !testResultWithSlash.unignored) {
        return true;
      }
    }
    return false;
  }
  checkIgnored(absolutePath, mapping, cache3) {
    return this.testIgnored(absolutePath, mapping, (path30, patterns) => this.getIgnoreInstance(path30, patterns, cache3));
  }
  async listCursorIgnoreFilesByRoot(root) {
    const lookupRoot = await this.resolveLookupRoot(root);
    const ignoreFiles = [];
    for (const [base, patterns] of Object.entries(this.cursorIgnoreMapping)) {
      if (patterns.length === 0) {
        continue;
      }
      if (!isPathWithin({ basePath: lookupRoot, targetPath: base })) {
        continue;
      }
      const filePath = (0, import_node_path9.join)(base, ".cursorignore");
      try {
        await (0, import_promises8.access)(filePath);
        ignoreFiles.push(filePath);
      } catch {
      }
    }
    return ignoreFiles;
  }
  async getCursorIgnoreMapping() {
    return { ...this.cursorIgnoreMapping };
  }
  async getShellSandboxIgnoreMapping() {
    const mapping = { ...this.cursorIgnoreMapping };
    for (const root of this.rootDirectories) {
      const blockGlobs = await this.getRepoBlockExcludeGlobs(root);
      if (blockGlobs.length === 0) {
        continue;
      }
      const existing = mapping[root];
      mapping[root] = existing ? [...existing, ...blockGlobs] : blockGlobs;
    }
    return mapping;
  }
  async getGitIgnoreMapping() {
    return { ...this.gitIgnoreMapping };
  }
  static deduplicateRootDirectories(roots) {
    const resolvedRoots = roots.map((root) => resolvePath(root));
    const sortedRoots = [...resolvedRoots].sort((a, b2) => a.length - b2.length);
    const deduplicated = [];
    for (const root of sortedRoots) {
      const isContained = deduplicated.some((existing) => root.startsWith(`${existing}/`) || root.startsWith(`${existing}\\`));
      if (!isContained) {
        deduplicated.push(root);
      }
    }
    return deduplicated;
  }
  static parseIgnoreRules(raw) {
    return raw.split("\n").map((line) => line.replace(/\r$/, "").trimStart()).filter((line) => line !== "" && !line.startsWith("#"));
  }
  // Method to clear caches when files change
  clearCaches() {
    this.gitIgnoreCache.clear();
    this.cursorIgnoreCache.clear();
    this.gitRootCache.clear();
    this.gitRemoteUrlCache.clear();
    this.hasGitDirCache.clear();
    this.gitParsedIgnoreCache.clear();
    this.cursorParsedIgnoreCache.clear();
  }
  async handleCursorIgnoreCreated(filePath) {
    const ignorePath = (0, import_node_path9.dirname)(filePath);
    const content = await readText(filePath);
    const ignoreRules = _LocalIgnoreService.parseIgnoreRules(content);
    this.cursorIgnoreMapping[ignorePath] = ignoreRules;
    this.cursorParsedIgnoreCache.delete(ignorePath);
    this.cursorIgnoreCache.clear();
  }
  async handleCursorIgnoreChanged(filePath) {
    const ignorePath = (0, import_node_path9.dirname)(filePath);
    const content = await readText(filePath);
    const ignoreRules = _LocalIgnoreService.parseIgnoreRules(content);
    this.cursorIgnoreMapping[ignorePath] = ignoreRules;
    this.cursorParsedIgnoreCache.delete(ignorePath);
    this.cursorIgnoreCache.clear();
  }
  handleCursorIgnoreDeleted(filePath) {
    const ignorePath = (0, import_node_path9.dirname)(filePath);
    this.cursorIgnoreMapping[ignorePath] = [];
    this.cursorParsedIgnoreCache.delete(ignorePath);
    this.cursorIgnoreCache.clear();
  }
  async findGitRootsForFile(filePath) {
    const absolutePath = resolvePath(filePath);
    const directoryPath = absolutePath;
    const cached2 = this.gitRootCache.get(directoryPath);
    if (cached2 !== void 0) {
      return cached2;
    }
    const gitRoots = [];
    const pathsToCheck = [];
    const uncachedPaths = [];
    let currentPath = directoryPath;
    const rootPath = (0, import_node_path9.parse)(currentPath).root;
    while (currentPath !== rootPath) {
      pathsToCheck.push(currentPath);
      if (this.hasGitDirCache.get(currentPath) === void 0) {
        uncachedPaths.push(currentPath);
      }
      const parentPath = (0, import_node_path9.dirname)(currentPath);
      if (parentPath === currentPath)
        break;
      currentPath = parentPath;
    }
    if (uncachedPaths.length > 0) {
      const checkPromises = uncachedPaths.map((path30) => (0, import_promises8.access)((0, import_node_path9.join)(path30, ".git"), import_promises8.default.constants.F_OK).then(() => [path30, true]).catch(() => [path30, false]));
      const results = await Promise.all(checkPromises);
      for (const [path30, hasGit] of results) {
        this.hasGitDirCache.set(path30, hasGit);
      }
    }
    for (const path30 of pathsToCheck) {
      const hasGit = this.hasGitDirCache.get(path30);
      if (hasGit === true) {
        gitRoots.push(path30);
      }
    }
    this.gitRootCache.set(directoryPath, gitRoots);
    return gitRoots;
  }
  async isRepoBlocked(filePath) {
    return this.checkRepoBlocked(filePath);
  }
  async checkRepoBlocked(absolutePath) {
    const gitRoots = await this.findGitRootsForFile(absolutePath);
    const teamReposResponse = await this.teamSettingsService?.getTeamRepos();
    if (!teamReposResponse) {
      return false;
    }
    const blockedRepos = teamReposResponse.repos ?? [];
    const allowedRepos = teamReposResponse.disableLocalExecAllowlistEnforcement ? [] : teamReposResponse.allowedRepos ?? [];
    if (blockedRepos.length === 0 && allowedRepos.length === 0) {
      return false;
    }
    if (gitRoots.length === 0) {
      return this.checkNonRepoPathBlockedByAllowlist(absolutePath, allowedRepos);
    }
    let matchesAllowlist = allowedRepos.length === 0;
    let allowlistEvaluated = false;
    for (const gitRoot of gitRoots) {
      let repoUrl;
      if (this.gitRemoteUrlCache.has(gitRoot)) {
        repoUrl = this.gitRemoteUrlCache.get(gitRoot);
      } else {
        repoUrl = await getGitRemoteUrl(createContext(), this.gitExecutor, gitRoot);
        if (repoUrl !== void 0) {
          this.gitRemoteUrlCache.set(gitRoot, repoUrl);
        }
      }
      if (repoUrl === void 0) {
        continue;
      }
      const resolvedRepoUrl = repoUrl;
      const relativePath = (0, import_node_path9.relative)(gitRoot, absolutePath) || ".";
      for (const repo of blockedRepos) {
        if (!this.doesRepoUrlMatch(repo.url, resolvedRepoUrl)) {
          continue;
        }
        for (const pattern of repo.patterns || []) {
          if (this.matchGlob(pattern.pattern, relativePath)) {
            return true;
          }
        }
      }
      if (allowedRepos.length > 0 && !allowlistEvaluated) {
        allowlistEvaluated = true;
        matchesAllowlist = allowedRepos.some((repo) => this.doesRepoUrlMatch(repo.url, resolvedRepoUrl) && (repo.patterns || []).some((pattern) => this.matchGlob(pattern.pattern, relativePath)));
      }
    }
    return !matchesAllowlist;
  }
  /**
   * Allowlist enforcement for paths outside any git repo, mirroring
   * CursorIgnoreService.isAdminBlocked's no-repo branch: when the team
   * configured a repo allowlist, non-git content is blocked (so stripping
   * `.git` from an unapproved clone does not bypass the allowlist), except:
   *  - paths under the user's Cursor data directory (~/.cursor/), which hold
   *    internal agent data (terminal transcripts, plans, ...) that must stay
   *    accessible regardless of the repo allowlist, and
   *  - paths matched by allow entries whose URL is the wildcard "*" or a
   *    path pattern (e.g. "data/**") rather than a git URL.
   */
  async checkNonRepoPathBlockedByAllowlist(absolutePath, allowedRepos) {
    if (allowedRepos.length === 0) {
      return false;
    }
    const cursorDataDir = await this.getCursorDataDir();
    if (isPathWithin({ basePath: cursorDataDir, targetPath: absolutePath })) {
      return false;
    }
    const relativePath = this.getWorkspaceRelativePath(absolutePath);
    for (const repo of allowedRepos) {
      if (this.isWildcardUrl(repo.url)) {
        if ((repo.patterns || []).some((pattern) => this.matchGlob(pattern.pattern, relativePath))) {
          return false;
        }
      } else if (this.isPathPatternUrl(repo.url)) {
        if (this.matchGlob(repo.url, relativePath)) {
          return false;
        }
      }
    }
    return true;
  }
  /** A repo URL entry of "*" applies to all repos/workspaces. */
  isWildcardUrl(url2) {
    return url2.trim() === "*";
  }
  /**
   * Whether a repo URL entry looks like a path pattern (e.g. "data/**")
   * rather than a git URL. Path patterns don't contain protocols, common git
   * hosts, or @ symbols. Mirrors CursorIgnoreService.isPathPatternUrl.
   */
  isPathPatternUrl(url2) {
    return !url2.includes("://") && !url2.includes("github.com") && !url2.includes("gitlab.com") && !url2.includes("bitbucket.org") && !url2.includes("@");
  }
  /**
   * Relative path from the containing workspace root, or the full path when
   * outside every root. Used to evaluate wildcard/path-pattern entries for
   * paths that are not inside a git repo. Picks the longest matching root so
   * nested workspace roots resolve to the most specific one, mirroring
   * CursorIgnoreService.getRelativePathFromWorkspaceRoot.
   */
  getWorkspaceRelativePath(absolutePath) {
    let bestRoot;
    for (const root of this.rootDirectories) {
      if (isPathWithin({ basePath: root, targetPath: absolutePath }) && (bestRoot === void 0 || root.length > bestRoot.length)) {
        bestRoot = root;
      }
    }
    if (bestRoot !== void 0) {
      return normalizeToUnixPath((0, import_node_path9.relative)(bestRoot, absolutePath));
    }
    return normalizeToUnixPath(absolutePath);
  }
  /**
   * Canonical path of the user's Cursor data directory (~/.cursor).
   * Resolved through realpath once so comparisons against realpath'd input
   * paths hold when the home directory involves symlinks.
   */
  getCursorDataDir() {
    this.cursorDataDirPromise ??= (async () => {
      const raw = (0, import_node_path9.join)(import_node_os6.default.homedir(), ".cursor");
      const resolved = await resolveRealPathStrict(raw);
      return resolved ?? raw;
    })();
    return this.cursorDataDirPromise;
  }
  doesRepoUrlMatch(repoUrl1, repoUrl2) {
    const rawPattern = repoUrl1.trim().toLowerCase().replace(/\.git$/i, "");
    const isGlobPattern = repoUrl1.includes("*");
    if (isGlobPattern) {
      if (repoUrl1.trim() === "*") {
        return true;
      }
      const normalizedPattern = toHostPath(repoUrl1).toLowerCase();
      const normalizedUrl = toHostPath(repoUrl2).toLowerCase();
      return this.matchRepoUrlGlob(normalizedPattern, normalizedUrl);
    } else {
      return toHostPath(repoUrl1).toLowerCase() === toHostPath(repoUrl2).toLowerCase();
    }
  }
  matchGlob(pattern, value) {
    const trimmedPattern = pattern.trim();
    if ((value === "." || value === "") && (trimmedPattern === "**" || trimmedPattern === "**/*")) {
      return true;
    }
    try {
      const isMatch = (0, import_picomatch.default)(trimmedPattern);
      return isMatch(value);
    } catch {
      return trimmedPattern === value;
    }
  }
  matchRepoUrlGlob(pattern, value) {
    const trimmedPattern = pattern.trim();
    if (this.matchGlob(trimmedPattern, value)) {
      return true;
    }
    if (trimmedPattern.startsWith("*/")) {
      return this.matchGlob(`**/${trimmedPattern.slice(2)}`, value);
    }
    return false;
  }
  /**
   * Get glob patterns that should be excluded for repo blocking.
   * These patterns are relative to the rootDirectory and can be passed
   * directly to ripgrep for native filtering.
   */
  async getRepoBlockExcludeGlobs(rootDirectory) {
    const teamReposResponse = await this.teamSettingsService?.getTeamRepos();
    if (!teamReposResponse?.repos?.length) {
      return [];
    }
    const absoluteRoot = await this.resolveLookupRoot(rootDirectory);
    const gitRepoMapping = await this.getGitRepoMapping();
    if (gitRepoMapping.size === 0) {
      return [];
    }
    const excludeGlobs = [];
    for (const [gitRoot, repoUrl] of gitRepoMapping) {
      if (repoUrl === void 0)
        continue;
      const normalizedGitRoot = this.normalizePathForComparison(gitRoot);
      const normalizedRoot = this.normalizePathForComparison(absoluteRoot);
      let isRelevant = false;
      let relativeGitRoot = "";
      if (normalizedRoot.startsWith(normalizedGitRoot)) {
        isRelevant = true;
        relativeGitRoot = "";
      } else if (normalizedGitRoot.startsWith(normalizedRoot)) {
        isRelevant = true;
        relativeGitRoot = (0, import_node_path9.relative)(absoluteRoot, gitRoot);
      }
      if (!isRelevant)
        continue;
      const matchingRepos = teamReposResponse.repos.filter((repo) => this.doesRepoUrlMatch(repo.url, repoUrl));
      if (matchingRepos.length === 0)
        continue;
      for (const repo of matchingRepos) {
        for (const pattern of repo.patterns || []) {
          const trimmedPattern = pattern.pattern.trim();
          if (!trimmedPattern)
            continue;
          let glob;
          if (relativeGitRoot) {
            glob = (0, import_node_path9.join)(relativeGitRoot, trimmedPattern).replace(/\\/g, "/");
          } else {
            glob = trimmedPattern;
          }
          excludeGlobs.push(glob);
          if (!glob.endsWith("/**")) {
            excludeGlobs.push(`${glob}/**`);
          }
        }
      }
    }
    return excludeGlobs;
  }
  /**
   * Normalize a path for cross-platform comparison.
   * Converts backslashes to forward slashes and lowercases on Windows.
   */
  normalizePathForComparison(path30) {
    let normalized = path30.replace(/\\/g, "/");
    if (normalized.startsWith("/") && normalized.length > 2 && normalized[2] === ":") {
      normalized = normalized.substring(1);
    }
    if (process.platform === "win32") {
      normalized = normalized.toLowerCase();
    }
    return normalized;
  }
  /**
   * Get the git repo mapping, initializing it lazily if needed.
   * Returns a Map of git root path → upstream URL.
   */
  getGitRepoMapping() {
    if (!this.gitRepoMappingPromise) {
      this.gitRepoMappingPromise = this.initializeGitRepoMapping();
    }
    return this.gitRepoMappingPromise;
  }
  /**
   * Discover all git repositories in root directories (including submodules)
   * and map them to their upstream URLs.
   */
  async initializeGitRepoMapping() {
    const result = /* @__PURE__ */ new Map();
    const gitRepoLocations = [];
    const DIRS_TO_SKIP = [
      "**/node_modules/**",
      "**/.turbo/**",
      "**/.next/**",
      "**/.cache/**",
      "**/.pnpm/**",
      "**/.yarn/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/target/**",
      "**/.vscode/**",
      "**/.idea/**",
      "**/venv/**",
      "**/__pycache__/**",
      "**/logs/**",
      "**/tmp/**",
      "**/temp/**"
    ];
    const ctx = createContext();
    for (const rootDir of this.rootDirectories) {
      const resolvedRoot = resolvePath(rootDir);
      try {
        await (0, import_promises8.access)((0, import_node_path9.join)(resolvedRoot, ".git"), import_promises8.default.constants.F_OK);
        if (!gitRepoLocations.includes(resolvedRoot)) {
          gitRepoLocations.push(resolvedRoot);
        }
      } catch {
      }
      let currentPath = (0, import_node_path9.dirname)(resolvedRoot);
      const fsRoot = (0, import_node_path9.parse)(currentPath).root;
      while (currentPath !== fsRoot && currentPath !== "") {
        try {
          await (0, import_promises8.access)((0, import_node_path9.join)(currentPath, ".git"), import_promises8.default.constants.F_OK);
          if (!gitRepoLocations.includes(currentPath)) {
            gitRepoLocations.push(currentPath);
          }
        } catch {
        }
        const parentPath = (0, import_node_path9.dirname)(currentPath);
        if (parentPath === currentPath)
          break;
        currentPath = parentPath;
      }
      try {
        const ripwalkOptions = {
          root: resolvedRoot,
          includeGlobs: ["**/.git/config"],
          excludeGlobs: DIRS_TO_SKIP,
          noIgnoreVcs: true,
          source: "ignore_scan"
        };
        const ripwalkResult = _LocalIgnoreService.getRipwalkCache().walk(ctx, ripwalkOptions);
        for await (const path30 of ripwalkResult.lines) {
          const fullPath = (0, import_node_path9.join)(resolvedRoot, path30);
          const gitDir = (0, import_node_path9.dirname)(fullPath);
          const gitRoot = (0, import_node_path9.dirname)(gitDir);
          if (!gitRepoLocations.includes(gitRoot)) {
            gitRepoLocations.push(gitRoot);
          }
        }
      } catch {
      }
    }
    await Promise.all(gitRepoLocations.map(async (repoPath) => {
      try {
        const upstreamUrl = await getGitRemoteUrl(ctx, this.gitExecutor, repoPath);
        result.set(repoPath, upstreamUrl);
      } catch {
        result.set(repoPath, void 0);
      }
    }));
    return result;
  }
};
LocalIgnoreService.promiseQueue = new PromiseQueue({
  max: maxConcurrentSearches
});

