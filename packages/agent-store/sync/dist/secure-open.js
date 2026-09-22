var fs4 = __toESM(require("node:fs"), 1);
var path4 = __toESM(require("node:path"), 1);
var __awaiter3 = function(thisArg, _arguments, P2, generator) {
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
function openSecureSqlitePath(resolvedPath, mode) {
  const parentDir = path4.dirname(resolvedPath);
  const parentDirFd = openParentDirectoryNoFollow(parentDir);
  let cleanupParentFd = true;
  try {
    const parentStat = fs4.fstatSync(parentDirFd);
    if (!parentStat.isDirectory()) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Refusing to open sqlite under non-directory parent: ${parentDir}`,
        failedPath: parentDir
      });
    }
    const parentIdentity = {
      dev: parentStat.dev,
      ino: parentStat.ino
    };
    assertParentDirInodeMatchesPath(parentIdentity, parentDir);
    const leafFd = openRegularFileNoFollowCreate(resolvedPath, mode);
    let leafIdentity;
    try {
      const leafStat = fs4.fstatSync(leafFd);
      if (!leafStat.isFile()) {
        throw new AgentStorePathError({
          code: "symlink_refused",
          message: `Refusing to open non-regular sqlite path: ${resolvedPath}`,
          failedPath: resolvedPath
        });
      }
      assertResolvedPathStillCanonical(resolvedPath);
      leafIdentity = { dev: leafStat.dev, ino: leafStat.ino };
    } finally {
      fs4.closeSync(leafFd);
    }
    let verified = false;
    let closed3 = false;
    const closeParent = () => {
      if (closed3) {
        return;
      }
      closed3 = true;
      fs4.closeSync(parentDirFd);
    };
    const verifyOpenedInode = () => {
      if (verified) {
        return;
      }
      assertParentDirInodeMatchesPath(parentIdentity, parentDir);
      assertLeafInodeUnchanged(resolvedPath, leafIdentity);
      verified = true;
    };
    cleanupParentFd = false;
    return {
      sqlitePath: resolvedPath,
      verifyOpenedInode,
      close: closeParent
    };
  } finally {
    if (cleanupParentFd) {
      fs4.closeSync(parentDirFd);
    }
  }
}
function writeLockFileExclusive(lockPath, contents, mode) {
  return __awaiter3(this, void 0, void 0, function* () {
    const flags = symlinkSafeExclusiveWriteFlags();
    let fd;
    try {
      fd = yield fs4.promises.open(lockPath, flags, mode);
      assertResolvedPathStillCanonical(lockPath);
      yield fd.writeFile(contents, { encoding: "utf8" });
    } catch (error42) {
      if (isNofollowSymlinkRefusal(error42)) {
        throw new AgentStorePathError({
          code: "symlink_refused",
          message: `Refusing to create lockfile at symlinked path: ${lockPath}`,
          failedPath: lockPath
        });
      }
      throw error42;
    } finally {
      yield fd === null || fd === void 0 ? void 0 : fd.close();
    }
  });
}
function openRegularFileNoFollowCreate(filePath, mode) {
  const flags = symlinkSafeOpenCreateFlags();
  try {
    return fs4.openSync(filePath, flags, mode);
  } catch (error42) {
    if (isNofollowSymlinkRefusal(error42)) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Refusing to open symlinked path: ${filePath}`,
        failedPath: filePath
      });
    }
    throw error42;
  }
}
function openParentDirectoryNoFollow(parentDir) {
  const flags = symlinkSafeDirectoryOpenFlags();
  try {
    return fs4.openSync(parentDir, flags);
  } catch (error42) {
    if (isNofollowSymlinkRefusal(error42) || isNodeError3(error42) && error42.code === "ENOTDIR" && isSymlink(parentDir)) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Refusing to open sqlite under symlinked parent: ${parentDir}`,
        failedPath: parentDir
      });
    }
    throw error42;
  }
}
function isSymlink(targetPath) {
  try {
    return fs4.lstatSync(targetPath).isSymbolicLink();
  } catch (_a19) {
    return false;
  }
}
function assertResolvedPathStillCanonical(resolvedPath) {
  assertNoSymlinkInPath(resolvedPath);
}
function assertLeafInodeUnchanged(resolvedPath, expected) {
  const flags = symlinkSafeReopenFlags();
  let fd;
  try {
    fd = fs4.openSync(resolvedPath, flags);
  } catch (error42) {
    if (isNofollowSymlinkRefusal(error42)) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Sqlite path became symlinked between open and verification: ${resolvedPath}`,
        failedPath: resolvedPath
      });
    }
    throw error42;
  }
  try {
    const stat28 = fs4.fstatSync(fd);
    assertResolvedPathStillCanonical(resolvedPath);
    if (stat28.dev !== expected.dev || stat28.ino !== expected.ino) {
      throw new AgentStorePathError({
        code: "symlink_refused",
        message: `Sqlite path inode drifted between open and verification (expected dev=${expected.dev} ino=${expected.ino}, got dev=${stat28.dev} ino=${stat28.ino}): ${resolvedPath}`,
        failedPath: resolvedPath
      });
    }
  } finally {
    fs4.closeSync(fd);
  }
}
function assertParentDirInodeMatchesPath(expected, parentDir) {
  let pathStat;
  try {
    pathStat = fs4.lstatSync(parentDir);
  } catch (error42) {
    throw new AgentStorePathError({
      code: "symlink_refused",
      message: `Unable to lstat parent directory ${parentDir}: ${error42 instanceof Error ? error42.message : String(error42)}`,
      failedPath: parentDir
    });
  }
  if (pathStat.isSymbolicLink()) {
    throw new AgentStorePathError({
      code: "symlink_refused",
      message: `Parent directory became symlinked between open and verification: ${parentDir}`,
      failedPath: parentDir
    });
  }
  if (pathStat.dev !== expected.dev || pathStat.ino !== expected.ino) {
    throw new AgentStorePathError({
      code: "symlink_refused",
      message: `Parent directory inode drifted between open and verification (expected dev=${expected.dev} ino=${expected.ino}, got dev=${pathStat.dev} ino=${pathStat.ino}): ${parentDir}`,
      failedPath: parentDir
    });
  }
}
function symlinkSafeOpenCreateFlags() {
  var _a19;
  const constants12 = fs4.constants;
  let flags = (_a19 = constants12.O_RDWR) !== null && _a19 !== void 0 ? _a19 : 0;
  if (typeof constants12.O_CREAT === "number") {
    flags |= constants12.O_CREAT;
  }
  if (typeof constants12.O_NOFOLLOW === "number") {
    flags |= constants12.O_NOFOLLOW;
  }
  if (typeof constants12.O_CLOEXEC === "number") {
    flags |= constants12.O_CLOEXEC;
  }
  return flags;
}
function symlinkSafeReopenFlags() {
  var _a19;
  const constants12 = fs4.constants;
  let flags = (_a19 = constants12.O_RDONLY) !== null && _a19 !== void 0 ? _a19 : 0;
  if (typeof constants12.O_NOFOLLOW === "number") {
    flags |= constants12.O_NOFOLLOW;
  }
  if (typeof constants12.O_CLOEXEC === "number") {
    flags |= constants12.O_CLOEXEC;
  }
  return flags;
}
function symlinkSafeDirectoryOpenFlags() {
  var _a19;
  const constants12 = fs4.constants;
  let flags = (_a19 = constants12.O_RDONLY) !== null && _a19 !== void 0 ? _a19 : 0;
  if (typeof constants12.O_DIRECTORY === "number") {
    flags |= constants12.O_DIRECTORY;
  }
  if (typeof constants12.O_NOFOLLOW === "number") {
    flags |= constants12.O_NOFOLLOW;
  }
  if (typeof constants12.O_CLOEXEC === "number") {
    flags |= constants12.O_CLOEXEC;
  }
  return flags;
}
function symlinkSafeExclusiveWriteFlags() {
  var _a19;
  const constants12 = fs4.constants;
  let flags = (_a19 = constants12.O_WRONLY) !== null && _a19 !== void 0 ? _a19 : 0;
  if (typeof constants12.O_CREAT === "number") {
    flags |= constants12.O_CREAT;
  }
  if (typeof constants12.O_EXCL === "number") {
    flags |= constants12.O_EXCL;
  }
  if (typeof constants12.O_NOFOLLOW === "number") {
    flags |= constants12.O_NOFOLLOW;
  }
  if (typeof constants12.O_CLOEXEC === "number") {
    flags |= constants12.O_CLOEXEC;
  }
  return flags;
}
function isNofollowSymlinkRefusal(error42) {
  if (!isNodeError3(error42)) {
    return false;
  }
  if (error42.code === "ELOOP" || error42.code === "EMLINK") {
    return true;
  }
  if (error42.code === "EPERM" && hasNofollowConstant()) {
    return true;
  }
  return false;
}
function hasNofollowConstant() {
  return typeof fs4.constants.O_NOFOLLOW === "number";
}
function isNodeError3(error42) {
  return error42 instanceof Error && typeof error42.code === "string";
}
