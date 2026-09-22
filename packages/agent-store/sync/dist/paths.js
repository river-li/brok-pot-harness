/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/paths.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process = require("node:child_process");
var fs2 = __toESM(require("node:fs"), 1);
var os = __toESM(require("node:os"), 1);
var path2 = __toESM(require("node:path"), 1);
init_dist2();
init_dist2();
var AGENT_STORE_SYNC_DIR_NAME = ".sync";
function isReservedRelPath(relPath) {
  return relPath.split("/").some(isReservedAgentStorePathSegment);
}
var AGENT_STORE_CONFLICT_EVENTS_FILE_NAME = "conflict-events.jsonl";
var AGENT_STORE_CONFLICT_PENDING_FILE_NAME = "conflict-events.pending.jsonl";
var PRIVATE_DIR_MODE = 448;
function classifyAgentStoreSourceId(sourceId) {
  if (parseUserAgentStoreSourceId(sourceId) !== void 0) {
    return "user";
  }
  if (parseTeamAgentStoreSourceId(sourceId) !== void 0) {
    return "team";
  }
  if (isCloudAgentStoreId(sourceId)) {
    return "cloud";
  }
  if (isValidBareUuid(sourceId)) {
    return "local";
  }
  if (isAgentStoreId(sourceId) || isAgentStoreShareMountKey(sourceId)) {
    return "store";
  }
  return "unknown";
}
var AgentStorePathError = class extends Error {
  constructor({ code, message, failedPath }) {
    super(message);
    this.name = "AgentStorePathError";
    this.code = code;
    this.failedPath = failedPath;
  }
};
function assertNoSymlinkInPath(targetPath, options2 = {}) {
  const deps = getDeps(options2);
  const resolved = deps.path.resolve(targetPath);
  if (tryNativeRealpath(resolved, deps.fs) === resolved) {
    return;
  }
  const segments = getPathSegments(resolved, deps.path);
  for (const segment of segments) {
    const stat28 = tryLstat(segment, deps.fs);
    if (!stat28) {
      return;
    }
    if (stat28.isSymbolicLink()) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Refusing to use symlinked agent store path: ${segment}`,
        failedPath: segment
      });
    }
  }
}
function ensureSecureDirectoryChain(targetDir, options2 = {}) {
  const deps = getDeps(options2);
  const resolvedTarget = deps.path.resolve(targetDir);
  const trustedBase = options2.trustedBase !== void 0 ? deps.path.resolve(options2.trustedBase) : findTrustedDirectoryAncestor(resolvedTarget, deps);
  if (resolvedTarget === trustedBase) {
    assertRealDirectorySegment(trustedBase, deps);
    return;
  }
  const relative18 = deps.path.relative(trustedBase, resolvedTarget);
  if (relative18.length === 0 || relative18.startsWith("..") || deps.path.isAbsolute(relative18)) {
    throw new AgentStorePathError({
      code: "invalid_store_base",
      message: `Refusing to create ${resolvedTarget} outside trusted base ${trustedBase}`,
      failedPath: resolvedTarget
    });
  }
  const segments = relative18.split(deps.path.sep).filter((segment) => segment.length > 0);
  let current = trustedBase;
  for (const segment of segments) {
    assertRealDirectorySegment(current, deps);
    current = deps.path.join(current, segment);
    ensureRealDirectorySegment(current, deps);
  }
}
function getDeps(options2) {
  var _a19;
  var _b2, _c2, _d, _e2, _f, _g, _h, _j;
  return {
    env: (_b2 = options2.env) !== null && _b2 !== void 0 ? _b2 : process.env,
    fs: (_c2 = options2.fs) !== null && _c2 !== void 0 ? _c2 : fs2,
    geteuid: (_d = options2.geteuid) !== null && _d !== void 0 ? _d : (_a19 = process.geteuid) === null || _a19 === void 0 ? void 0 : _a19.bind(process),
    osHomedir: (_e2 = options2.osHomedir) !== null && _e2 !== void 0 ? _e2 : os.homedir,
    osTmpdir: (_f = options2.osTmpdir) !== null && _f !== void 0 ? _f : os.tmpdir,
    path: (_g = options2.path) !== null && _g !== void 0 ? _g : path2,
    platform: (_h = options2.platform) !== null && _h !== void 0 ? _h : process.platform,
    windowsAcl: (_j = options2.windowsAcl) !== null && _j !== void 0 ? _j : {}
  };
}
function tryNativeRealpath(targetPath, fsModule) {
  const realpathSync3 = fsModule.realpathSync;
  if (typeof (realpathSync3 === null || realpathSync3 === void 0 ? void 0 : realpathSync3.native) !== "function") {
    return void 0;
  }
  try {
    return realpathSync3.native(targetPath);
  } catch (_a19) {
    return void 0;
  }
}
function assertDirectoryStat(targetPath, stat28) {
  if (stat28.isSymbolicLink()) {
    throw new AgentStorePathError({
      code: "symlink_refused",
      message: `Refusing to use symlinked agent store path: ${targetPath}`,
      failedPath: targetPath
    });
  }
  if (!stat28.isDirectory()) {
    throw new AgentStorePathError({
      code: "not_directory",
      message: `Agent store path is not a directory: ${targetPath}`,
      failedPath: targetPath
    });
  }
}
function findTrustedDirectoryAncestor(targetPath, deps) {
  var _a19;
  const segments = getPathSegments(deps.path.resolve(targetPath), deps.path);
  let trusted = (_a19 = segments[0]) !== null && _a19 !== void 0 ? _a19 : deps.path.resolve(targetPath);
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const stat28 = tryLstat(segment, deps.fs);
    if (!stat28) {
      break;
    }
    if (stat28.isSymbolicLink()) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Refusing to use symlinked agent store path: ${segment}`,
        failedPath: segment
      });
    }
    if (!stat28.isDirectory()) {
      throw new AgentStorePathError({
        code: "not_directory",
        message: `Agent store path is not a directory: ${segment}`,
        failedPath: segment
      });
    }
    trusted = segment;
  }
  return trusted;
}
function assertRealDirectorySegment(targetPath, deps) {
  const stat28 = tryLstat(targetPath, deps.fs);
  if (!stat28) {
    throw new AgentStorePathError({
      code: "not_directory",
      message: `Trusted directory does not exist: ${targetPath}`,
      failedPath: targetPath
    });
  }
  assertDirectoryStat(targetPath, stat28);
}
function ensureRealDirectorySegment(targetPath, deps) {
  let stat28 = tryLstat(targetPath, deps.fs);
  if (!stat28) {
    try {
      deps.fs.mkdirSync(targetPath, { mode: PRIVATE_DIR_MODE });
    } catch (error42) {
      if (!isNodeError2(error42) || error42.code !== "EEXIST") {
        throw error42;
      }
    }
    stat28 = tryLstat(targetPath, deps.fs);
    if (!stat28) {
      throw new AgentStorePathError({
        code: "not_directory",
        message: `Failed to create directory: ${targetPath}`,
        failedPath: targetPath
      });
    }
  }
  assertDirectoryStat(targetPath, stat28);
}
function getPathSegments(targetPath, pathModule) {
  const root = pathModule.parse(targetPath).root;
  const rest = targetPath.slice(root.length);
  const parts = rest.split(/[\\/]+/).filter(Boolean);
  const segments = [];
  let current = root;
  if (root) {
    segments.push(root);
  }
  for (const part of parts) {
    current = current === root ? pathModule.join(root, part) : pathModule.join(current, part);
    segments.push(current);
  }
  return segments;
}
function tryLstat(targetPath, fsModule) {
  try {
    return fsModule.lstatSync(targetPath);
  } catch (err) {
    if (isNodeError2(err) && err.code === "ENOENT") {
      return void 0;
    }
    throw err;
  }
}
function createWindowsUserIdentityReader(run) {
  let cached2;
  return () => {
    cached2 !== null && cached2 !== void 0 ? cached2 : cached2 = readWindowsUserIdentityUncached(run);
    return cached2;
  };
}
var readCurrentWindowsUserIdentity = createWindowsUserIdentityReader(import_node_child_process.execFileSync);
function readWindowsUserIdentityUncached(run) {
  const fields2 = String(run("whoami", ["/user", "/fo", "csv", "/nh"], { encoding: "utf8" })).trim().split(",").map((field) => field.replace(/^"|"$/g, ""));
  const name17 = fields2.at(-2);
  const sid = fields2.at(-1);
  if (!name17 || !sid) {
    return void 0;
  }
  return { name: name17, sid };
}
function isNodeError2(err) {
  return err instanceof Error && typeof err.code === "string";
}

