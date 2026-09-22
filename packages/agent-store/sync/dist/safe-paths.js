var fs = __toESM(require("node:fs"), 1);
var path = __toESM(require("node:path"), 1);
var UnsafeAgentStorePathError = class extends Error {
  constructor(options2) {
    super(options2.message);
    this.name = "UnsafeAgentStorePathError";
    this.code = options2.code;
    this.relPath = options2.relPath;
    this.failedPath = options2.failedPath;
  }
};
var MAX_SEGMENT_LENGTH_BYTES = 255;
var WINDOWS_RESERVED = /* @__PURE__ */ new Set([
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
var WINDOWS_FORBIDDEN_FILENAME_CHARS = /[<>:"|?*]/;
function normalizeRelPath(relPath) {
  if (typeof relPath !== "string" || relPath.length === 0) {
    throw new UnsafeAgentStorePathError({
      code: "empty_path",
      message: "Agent store relative path must be a non-empty string",
      relPath
    });
  }
  if (relPath.includes("\0")) {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: "Agent store relative path must not contain NUL bytes",
      relPath
    });
  }
  if (path.posix.isAbsolute(relPath) || path.win32.isAbsolute(relPath)) {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: `Agent store relative path must not be absolute: ${relPath}`,
      relPath
    });
  }
  const rawSegments = relPath.replaceAll("\\", "/").split("/");
  const segments = [];
  for (const raw of rawSegments) {
    if (raw.length === 0 || raw === ".") {
      continue;
    }
    if (raw === "..") {
      throw new UnsafeAgentStorePathError({
        code: "invalid_segment",
        message: `Agent store relative path must not contain '..': ${relPath}`,
        relPath
      });
    }
    assertSafeSegment({ segment: raw, relPath });
    segments.push(raw);
  }
  if (segments.length === 0) {
    throw new UnsafeAgentStorePathError({
      code: "empty_path",
      message: `Agent store relative path resolved to empty: ${relPath}`,
      relPath
    });
  }
  return segments.join("/");
}
function validateRawSegmentName(name17) {
  if (typeof name17 !== "string" || name17.length === 0) {
    throw new UnsafeAgentStorePathError({
      code: "empty_path",
      message: "Agent store segment name must be a non-empty string",
      relPath: name17
    });
  }
  if (name17 === "." || name17 === "..") {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: `Agent store segment name must not be '.' or '..': ${name17}`,
      relPath: name17
    });
  }
  if (name17.includes("/")) {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: `Agent store segment name must not contain '/': ${name17}`,
      relPath: name17
    });
  }
  if (name17.includes("\\")) {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: `Agent store segment name must not contain '\\\\': ${name17}`,
      relPath: name17
    });
  }
  assertSafeSegment({ segment: name17, relPath: name17 });
  return name17;
}
function assertSafeSegment({ segment, relPath }) {
  if (Buffer.byteLength(segment, "utf8") > MAX_SEGMENT_LENGTH_BYTES) {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: `Agent store path segment exceeds ${MAX_SEGMENT_LENGTH_BYTES} bytes: ${segment}`,
      relPath
    });
  }
  for (let i = 0; i < segment.length; i++) {
    const code = segment.charCodeAt(i);
    if (code < 32 || code === 127) {
      throw new UnsafeAgentStorePathError({
        code: "invalid_segment",
        message: `Agent store path segment contains control character (0x${code.toString(16)}): ${segment}`,
        relPath
      });
    }
  }
  const lastChar = segment.charAt(segment.length - 1);
  if (lastChar === "." || lastChar === " ") {
    throw new UnsafeAgentStorePathError({
      code: "invalid_segment",
      message: `Agent store path segment must not end with '.' or space (Windows trims these): ${segment}`,
      relPath
    });
  }
  const stem = segment.toLowerCase().split(".")[0];
  if (stem !== void 0 && WINDOWS_RESERVED.has(stem)) {
    throw new UnsafeAgentStorePathError({
      code: "reserved_name",
      message: `Agent store path segment uses a reserved device name: ${segment}`,
      relPath
    });
  }
}
function hasWindowsIncompatibleFilenameChars(relPath) {
  for (const segment of relPath.split("/")) {
    if (segment.length > 0 && WINDOWS_FORBIDDEN_FILENAME_CHARS.test(segment)) {
      return true;
    }
  }
  return false;
}
function assertWindowsMaterializableRelPath({ relPath, platform: platform2 = process.platform }) {
  if (platform2 !== "win32" || !hasWindowsIncompatibleFilenameChars(relPath)) {
    return;
  }
  throw new UnsafeAgentStorePathError({
    code: "windows_incompatible",
    message: `Agent store path is not materializable on Windows (illegal filename character < > : " | ? *): ${relPath}`,
    relPath
  });
}
function resolveSafeChildPath({ base, relPath }) {
  if (!path.isAbsolute(base)) {
    throw new UnsafeAgentStorePathError({
      code: "outside_base",
      message: `Agent store base must be absolute: ${base}`,
      relPath
    });
  }
  const normalized = normalizeRelPath(relPath);
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(resolvedBase, normalized);
  if (!isEqualOrParent({ parent: resolvedBase, candidate: resolved })) {
    throw new UnsafeAgentStorePathError({
      code: "outside_base",
      message: `Agent store relative path resolves outside the base: ${relPath}`,
      relPath,
      failedPath: resolved
    });
  }
  return resolved;
}
function isEqualOrParent({ parent, candidate }) {
  if (candidate === parent) {
    return true;
  }
  const withSep = parent.endsWith(path.sep) ? parent : parent + path.sep;
  return candidate.startsWith(withSep);
}
function safeWalk(base, options2 = {}) {
  var _a19;
  const fsModule = (_a19 = options2.fs) !== null && _a19 !== void 0 ? _a19 : fs;
  if (!path.isAbsolute(base)) {
    throw new UnsafeAgentStorePathError({
      code: "outside_base",
      message: `safeWalk base must be absolute: ${base}`,
      failedPath: base
    });
  }
  const resolvedBase = path.resolve(base);
  assertAncestorChainNoSymlinks(resolvedBase, fsModule);
  const baseStat = fsModule.lstatSync(resolvedBase);
  if (baseStat.isSymbolicLink()) {
    throw new UnsafeAgentStorePathError({
      code: "symlink_refused",
      message: `Refusing to walk symlinked agent store base: ${resolvedBase}`,
      failedPath: resolvedBase
    });
  }
  if (!baseStat.isDirectory()) {
    throw new UnsafeAgentStorePathError({
      code: "not_regular_file",
      message: `safeWalk base is not a directory: ${resolvedBase}`,
      failedPath: resolvedBase
    });
  }
  const result = { files: [], refusals: [] };
  walkDirectory({
    fsModule,
    absDir: resolvedBase,
    relDir: "",
    base: resolvedBase,
    result,
    expectedDev: baseStat.dev,
    expectedIno: baseStat.ino
  });
  return result;
}
function safeStatChild({ base, relPath, fs: fsOverride }) {
  const fsModule = fsOverride !== null && fsOverride !== void 0 ? fsOverride : fs;
  const absPath = resolveSafeChildPath({ base, relPath });
  const resolvedBase = path.resolve(base);
  assertAncestorChainNoSymlinks(resolvedBase, fsModule);
  const baseStat = fsModule.lstatSync(resolvedBase);
  if (baseStat.isSymbolicLink()) {
    throw new UnsafeAgentStorePathError({
      code: "symlink_refused",
      message: `Refusing to stat under symlinked agent store base: ${resolvedBase}`,
      failedPath: resolvedBase
    });
  }
  if (!baseStat.isDirectory()) {
    throw new UnsafeAgentStorePathError({
      code: "not_regular_file",
      message: `Agent store base is not a directory: ${resolvedBase}`,
      failedPath: resolvedBase
    });
  }
  const normalized = normalizeRelPath(relPath);
  const segments = normalized.split("/");
  let currentAbs = resolvedBase;
  let currentRel = "";
  const intermediates = [];
  for (const segment of segments.slice(0, -1)) {
    currentAbs = path.join(currentAbs, segment);
    currentRel = currentRel.length === 0 ? segment : `${currentRel}/${segment}`;
    let stat28;
    try {
      stat28 = fsModule.lstatSync(currentAbs);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        return { kind: "absent" };
      }
      throw error42;
    }
    if (stat28.isSymbolicLink()) {
      return {
        kind: "refused",
        refusal: { relPath: currentRel, reason: "symlink_refused" }
      };
    }
    if (!stat28.isDirectory()) {
      return {
        kind: "refused",
        refusal: { relPath: currentRel, reason: "not_regular_file" }
      };
    }
    intermediates.push({
      abs: currentAbs,
      rel: currentRel,
      dev: stat28.dev,
      ino: stat28.ino
    });
  }
  for (const intermediate of intermediates) {
    let postStat;
    try {
      postStat = fsModule.lstatSync(intermediate.abs);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        return { kind: "absent" };
      }
      throw error42;
    }
    if (postStat.isSymbolicLink() || !postStat.isDirectory() || postStat.dev !== intermediate.dev || postStat.ino !== intermediate.ino) {
      return {
        kind: "refused",
        refusal: {
          relPath: intermediate.rel,
          reason: postStat.isSymbolicLink() ? "symlink_refused" : "not_regular_file"
        }
      };
    }
  }
  let leafStat;
  try {
    leafStat = fsModule.lstatSync(absPath);
  } catch (error42) {
    if (isNodeError(error42) && error42.code === "ENOENT") {
      return { kind: "absent" };
    }
    throw error42;
  }
  if (leafStat.isSymbolicLink()) {
    return {
      kind: "refused",
      refusal: { relPath: normalized, reason: "symlink_refused" }
    };
  }
  if (!leafStat.isFile()) {
    return {
      kind: "refused",
      refusal: { relPath: normalized, reason: "not_regular_file" }
    };
  }
  return {
    kind: "file",
    entry: {
      relPath: normalized,
      absPath,
      size: leafStat.size,
      mtimeMs: leafStat.mtimeMs,
      dev: leafStat.dev,
      ino: leafStat.ino
    }
  };
}
function safeLstatDirectory({ base, relPath, fs: fsOverride }) {
  const fsModule = fsOverride !== null && fsOverride !== void 0 ? fsOverride : fs;
  resolveSafeChildPath({ base, relPath });
  const resolvedBase = path.resolve(base);
  assertAncestorChainNoSymlinks(resolvedBase, fsModule);
  const baseStat = fsModule.lstatSync(resolvedBase);
  if (baseStat.isSymbolicLink()) {
    throw new UnsafeAgentStorePathError({
      code: "symlink_refused",
      message: `Refusing to stat under symlinked agent store base: ${resolvedBase}`,
      failedPath: resolvedBase
    });
  }
  if (!baseStat.isDirectory()) {
    throw new UnsafeAgentStorePathError({
      code: "not_regular_file",
      message: `Agent store base is not a directory: ${resolvedBase}`,
      failedPath: resolvedBase
    });
  }
  const normalized = normalizeRelPath(relPath);
  const segments = normalized.split("/");
  const leafName = segments[segments.length - 1];
  if (leafName === void 0) {
    return {
      kind: "refused",
      refusal: { relPath: normalized, reason: "not_regular_file" }
    };
  }
  let currentAbs = resolvedBase;
  let currentRel = "";
  const intermediates = [];
  for (const segment of segments.slice(0, -1)) {
    currentAbs = path.join(currentAbs, segment);
    currentRel = currentRel.length === 0 ? segment : `${currentRel}/${segment}`;
    let stat28;
    try {
      stat28 = fsModule.lstatSync(currentAbs);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        return { kind: "absent" };
      }
      throw error42;
    }
    if (stat28.isSymbolicLink()) {
      return {
        kind: "refused",
        refusal: { relPath: currentRel, reason: "symlink_refused" }
      };
    }
    if (!stat28.isDirectory()) {
      return {
        kind: "refused",
        refusal: { relPath: currentRel, reason: "not_regular_file" }
      };
    }
    intermediates.push({
      abs: currentAbs,
      rel: currentRel,
      dev: stat28.dev,
      ino: stat28.ino
    });
  }
  for (const intermediate of intermediates) {
    let postStat;
    try {
      postStat = fsModule.lstatSync(intermediate.abs);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        return { kind: "absent" };
      }
      throw error42;
    }
    if (postStat.isSymbolicLink() || !postStat.isDirectory() || postStat.dev !== intermediate.dev || postStat.ino !== intermediate.ino) {
      return {
        kind: "refused",
        refusal: {
          relPath: intermediate.rel,
          reason: postStat.isSymbolicLink() ? "symlink_refused" : "not_regular_file"
        }
      };
    }
  }
  const lastParent = intermediates[intermediates.length - 1];
  if (lastParent !== void 0) {
    let parentRecheck;
    try {
      parentRecheck = fsModule.lstatSync(lastParent.abs);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        return { kind: "absent" };
      }
      throw error42;
    }
    if (parentRecheck.isSymbolicLink() || !parentRecheck.isDirectory() || parentRecheck.dev !== lastParent.dev || parentRecheck.ino !== lastParent.ino) {
      return {
        kind: "refused",
        refusal: {
          relPath: lastParent.rel,
          reason: parentRecheck.isSymbolicLink() ? "symlink_refused" : "not_regular_file"
        }
      };
    }
  }
  const leafAbs = path.join(currentAbs, leafName);
  if (!isEqualOrParent({ parent: resolvedBase, candidate: leafAbs })) {
    return {
      kind: "refused",
      refusal: { relPath: normalized, reason: "not_regular_file" }
    };
  }
  let leafStat;
  try {
    leafStat = fsModule.lstatSync(leafAbs);
  } catch (error42) {
    if (isNodeError(error42) && error42.code === "ENOENT") {
      return { kind: "absent" };
    }
    throw error42;
  }
  if (leafStat.isSymbolicLink()) {
    return {
      kind: "refused",
      refusal: { relPath: normalized, reason: "symlink_refused" }
    };
  }
  if (!leafStat.isDirectory()) {
    return {
      kind: "refused",
      refusal: { relPath: normalized, reason: "not_regular_file" }
    };
  }
  return { kind: "directory", absPath: leafAbs };
}
function rmdirLocalEmptyAncestors(args) {
  let current = args.dirRelPath;
  let removedCount = 0;
  while (current !== void 0 && current !== "") {
    let dirStat;
    try {
      dirStat = safeLstatDirectory({
        base: args.base,
        relPath: current
      });
    } catch (_a19) {
      return { removedCount };
    }
    if (dirStat.kind === "refused") {
      return { removedCount };
    }
    try {
      if (dirStat.kind === "absent") {
        if (current === args.dirRelPath) {
          removedCount += 1;
        }
      } else if (!safeRmdirEmptyDirectoryTree({
        base: args.base,
        relPath: current,
        recursive: current === args.dirRelPath
      })) {
        return { removedCount };
      } else {
        removedCount += 1;
      }
    } catch (error42) {
      if (!isNodeError(error42)) {
        return { removedCount };
      }
      if (error42.code === "ENOTEMPTY") {
        return { removedCount };
      }
      if (error42.code !== "ENOENT") {
        return { removedCount };
      }
    }
    if (current === "") {
      return { removedCount };
    }
    const slash = current.lastIndexOf("/");
    current = slash < 0 ? "" : current.slice(0, slash);
  }
  return { removedCount };
}
function safeRmdirEmptyDirectoryTree(args) {
  const resolvedBase = path.resolve(args.base);
  const normalized = normalizeRelPath(args.relPath);
  resolveSafeChildPath({ base: args.base, relPath: normalized });
  const recursive = args.recursive !== false;
  const segments = normalized.split("/").filter((segment) => segment.length > 0);
  if (segments.length === 0) {
    return false;
  }
  if (supportsFdRelativePaths()) {
    return rmdirEmptyTreeViaFds({
      resolvedBase,
      segments,
      recursive
    });
  }
  return rmdirEmptyTreeViaVerifiedWalk({
    resolvedBase,
    relPath: normalized,
    recursive
  });
}
function supportsFdRelativePaths() {
  return process.platform === "linux";
}
function nofollowDirectoryFlags() {
  var _a19;
  const constants12 = fs.constants;
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
function fdDirPath(fd) {
  return `/proc/self/fd/${fd}`;
}
function fdChildPath(fd, name17) {
  return `${fdDirPath(fd)}/${name17}`;
}
function rmdirEmptyTreeViaFds(args) {
  const flags = nofollowDirectoryFlags();
  let baseFd;
  try {
    baseFd = fs.openSync(args.resolvedBase, flags);
  } catch (_a19) {
    return false;
  }
  const walkFds = [baseFd];
  try {
    for (const segment of args.segments.slice(0, -1)) {
      const parentFd2 = walkFds[walkFds.length - 1];
      if (parentFd2 === void 0) {
        return false;
      }
      let nextFd;
      try {
        nextFd = fs.openSync(fdChildPath(parentFd2, segment), flags);
      } catch (_b2) {
        return false;
      }
      walkFds.push(nextFd);
    }
    const parentFd = walkFds[walkFds.length - 1];
    const leaf = args.segments[args.segments.length - 1];
    if (parentFd === void 0 || leaf === void 0) {
      return false;
    }
    return emptyAndRmdirFd({ parentFd, name: leaf, recursive: args.recursive });
  } finally {
    for (const fd of walkFds.reverse()) {
      try {
        fs.closeSync(fd);
      } catch (_c2) {
      }
    }
  }
}
function emptyAndRmdirFd(args) {
  const flags = nofollowDirectoryFlags();
  let childFd;
  try {
    childFd = fs.openSync(fdChildPath(args.parentFd, args.name), flags);
  } catch (error42) {
    return isNodeError(error42) && error42.code === "ENOENT";
  }
  try {
    if (args.recursive) {
      let entries;
      try {
        entries = fs.readdirSync(fdDirPath(childFd), { withFileTypes: true });
      } catch (_a19) {
        return false;
      }
      for (const entry of entries) {
        if (entry.isSymbolicLink() || !entry.isDirectory()) {
          return false;
        }
        if (!emptyAndRmdirFd({
          parentFd: childFd,
          name: entry.name,
          recursive: true
        })) {
          return false;
        }
      }
    }
  } finally {
    try {
      fs.closeSync(childFd);
    } catch (_b2) {
    }
  }
  try {
    fs.rmdirSync(fdChildPath(args.parentFd, args.name));
    return true;
  } catch (error42) {
    return isNodeError(error42) && error42.code === "ENOENT";
  }
}
function rmdirEmptyTreeViaVerifiedWalk(args) {
  const listed = safeLstatDirectory({
    base: args.resolvedBase,
    relPath: args.relPath
  });
  if (listed.kind === "absent") {
    return true;
  }
  if (listed.kind !== "directory") {
    return false;
  }
  if (args.recursive) {
    let entries;
    try {
      entries = fs.readdirSync(listed.absPath, { withFileTypes: true });
    } catch (_a19) {
      return false;
    }
    const still = safeLstatDirectory({
      base: args.resolvedBase,
      relPath: args.relPath
    });
    if (still.kind !== "directory" || still.absPath !== listed.absPath) {
      return false;
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink() || !entry.isDirectory()) {
        return false;
      }
      const childRel = args.relPath === "" ? entry.name : `${args.relPath}/${entry.name}`;
      if (!rmdirEmptyTreeViaVerifiedWalk({
        resolvedBase: args.resolvedBase,
        relPath: childRel,
        recursive: true
      })) {
        return false;
      }
    }
  }
  const slash = args.relPath.lastIndexOf("/");
  const parentRel = slash === -1 ? "" : args.relPath.slice(0, slash);
  const leafName = slash === -1 ? args.relPath : args.relPath.slice(slash + 1);
  let parentAbs = args.resolvedBase;
  if (parentRel.length > 0) {
    const parent = safeLstatDirectory({
      base: args.resolvedBase,
      relPath: parentRel
    });
    if (parent.kind !== "directory") {
      return false;
    }
    parentAbs = parent.absPath;
  } else {
    try {
      const baseStat = fs.lstatSync(args.resolvedBase);
      if (baseStat.isSymbolicLink() || !baseStat.isDirectory()) {
        return false;
      }
    } catch (_b2) {
      return false;
    }
  }
  try {
    fs.rmdirSync(path.join(parentAbs, leafName));
    return true;
  } catch (error42) {
    return isNodeError(error42) && error42.code === "ENOENT";
  }
}
function walkDirectory({ fsModule, absDir, relDir, base, result, expectedDev, expectedIno }) {
  let entries;
  try {
    entries = fsModule.readdirSync(absDir, { withFileTypes: true });
  } catch (error42) {
    if (isNodeError(error42) && error42.code === "ENOENT") {
      result.refusals.push({
        relPath: relDir.length === 0 ? "." : relDir,
        reason: "not_regular_file"
      });
      return;
    }
    throw error42;
  }
  let postStat;
  try {
    postStat = fsModule.lstatSync(absDir);
  } catch (error42) {
    if (isNodeError(error42) && error42.code === "ENOENT") {
      result.refusals.push({
        relPath: relDir.length === 0 ? "." : relDir,
        reason: "not_regular_file"
      });
      return;
    }
    throw error42;
  }
  if (postStat.isSymbolicLink() || !postStat.isDirectory() || postStat.dev !== expectedDev || postStat.ino !== expectedIno) {
    result.refusals.push({
      relPath: relDir.length === 0 ? "." : relDir,
      reason: postStat.isSymbolicLink() ? "symlink_refused" : "not_regular_file"
    });
    return;
  }
  for (const entry of entries) {
    if (entry.name === "." || entry.name === "..") {
      continue;
    }
    let segment;
    try {
      segment = validateRawSegmentName(entry.name);
    } catch (_a19) {
      result.refusals.push({
        relPath: posixJoin({ dir: relDir, segment: entry.name }),
        reason: "not_regular_file"
      });
      continue;
    }
    const childRel = posixJoin({ dir: relDir, segment });
    const childAbs = path.join(absDir, segment);
    if (!isEqualOrParent({ parent: base, candidate: childAbs })) {
      result.refusals.push({
        relPath: childRel,
        reason: "not_regular_file"
      });
      continue;
    }
    let childStat;
    try {
      childStat = fsModule.lstatSync(childAbs);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        continue;
      }
      throw error42;
    }
    if (childStat.isSymbolicLink()) {
      result.refusals.push({ relPath: childRel, reason: "symlink_refused" });
      continue;
    }
    if (childStat.isDirectory()) {
      walkDirectory({
        fsModule,
        absDir: childAbs,
        relDir: childRel,
        base,
        result,
        expectedDev: childStat.dev,
        expectedIno: childStat.ino
      });
      continue;
    }
    if (!childStat.isFile()) {
      result.refusals.push({
        relPath: childRel,
        reason: "not_regular_file"
      });
      continue;
    }
    result.files.push({
      relPath: childRel,
      absPath: childAbs,
      size: childStat.size,
      mtimeMs: childStat.mtimeMs,
      dev: childStat.dev,
      ino: childStat.ino
    });
  }
}
function posixJoin({ dir, segment }) {
  return dir.length === 0 ? segment : `${dir}/${segment}`;
}
function isNodeError(error42) {
  return error42 instanceof Error && typeof error42.code === "string";
}
function assertAncestorChainNoSymlinks(absPath, fsModule) {
  const parsed2 = path.parse(absPath);
  const tail = absPath.slice(parsed2.root.length);
  const segments = tail.split(path.sep).filter((s3) => s3.length > 0);
  let current = parsed2.root;
  for (const segment of segments) {
    current = path.join(current, segment);
    let stat28;
    try {
      stat28 = fsModule.lstatSync(current);
    } catch (error42) {
      if (isNodeError(error42) && error42.code === "ENOENT") {
        return;
      }
      throw error42;
    }
    if (stat28.isSymbolicLink()) {
      throw new UnsafeAgentStorePathError({
        code: "symlink_refused",
        message: `Refusing to walk agent store path whose ancestor is a symlink: ${current}`,
        failedPath: current
      });
    }
  }
}
