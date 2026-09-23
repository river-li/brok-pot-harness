function untildify(path31) {
  return path31.replace(/^~(?=$|\/|\\)/, (0, import_node_os2.homedir)());
}
function stripFileUrlIfPresent(path31) {
  if (!path31.startsWith("file://")) {
    return path31;
  }
  try {
    return (0, import_node_url2.fileURLToPath)(path31);
  } catch (_a19) {
    return path31;
  }
}
function resolvePath(path31, basePath) {
  const untildified = untildify(stripFileUrlIfPresent(path31));
  if (basePath && !(0, import_node_path3.isAbsolute)(untildified)) {
    return (0, import_node_path3.resolve)(basePath, untildified);
  }
  return (0, import_node_path3.resolve)(untildified);
}
function resolveRealPathStrict(path31, basePath) {
  return __awaiter13(this, void 0, void 0, function* () {
    const normalized = resolvePath(path31, basePath);
    let current = normalized;
    while (true) {
      try {
        const resolvedCurrent = yield (0, import_promises4.realpath)(current);
        return (0, import_node_path3.resolve)(resolvedCurrent, (0, import_node_path3.relative)(current, normalized));
      } catch (err) {
        if (err.code !== "ENOENT") {
          return null;
        }
        const parent = (0, import_node_path3.dirname)(current);
        if (parent === current) {
          return normalized;
        }
        current = parent;
      }
    }
  });
}
function isPathWithin2({ basePath, targetPath }) {
  const resolvedBase = (0, import_node_path3.resolve)(basePath);
  const resolvedTarget = (0, import_node_path3.resolve)(basePath, targetPath);
  if (resolvedBase === (0, import_node_path3.parse)(resolvedBase).root) {
    return (
      // 1) The resolved target root is the same as the resolved base root
      (0, import_node_path3.parse)(resolvedTarget).root === resolvedBase && // 2) target is root OR is a path under the root.
      (resolvedTarget === resolvedBase || resolvedTarget.length > resolvedBase.length)
    );
  }
  return resolvedTarget === resolvedBase || resolvedTarget.startsWith(resolvedBase + import_node_path3.sep);
}
function isPathWithinAnyRoot(targetPath, roots) {
  for (const root of roots) {
    if (isPathWithin2({ basePath: root, targetPath })) {
      return true;
    }
  }
  return false;
}
function isPathInsideWorkspaceRoot(realAbsolutePath, realRootDirectory) {
  const isCaseInsensitiveFs = process.platform === "win32" || process.platform === "darwin";
  const target = isCaseInsensitiveFs ? realAbsolutePath.toLowerCase() : realAbsolutePath;
  const root = isCaseInsensitiveFs ? realRootDirectory.toLowerCase() : realRootDirectory;
  if (target === root) {
    return true;
  }
  const rootPrefix = root.endsWith(import_node_path3.sep) ? root : root + import_node_path3.sep;
  return target.startsWith(rootPrefix);
}
function normalizeToUnixPath(path31) {
  return path31.replace(/\\/g, SEP);
}
function isWorktreesPath(path31) {
  const normalizedPath = normalizeToUnixPath(path31);
  return normalizedPath.includes(".cursor/worktrees");
}
function getWorktreesRepoRoot(worktreePath) {
  var _a19;
  const normalizedPath = normalizeToUnixPath(worktreePath);
  const marker17 = "/.cursor/worktrees/";
  const markerIndex = normalizedPath.indexOf(marker17);
  if (markerIndex === -1) {
    return void 0;
  }
  const afterMarker = normalizedPath.slice(markerIndex + marker17.length);
  const parts = afterMarker.split("/");
  if (parts.length < 2) {
    return void 0;
  }
  const repoName = (_a19 = parts[0]) !== null && _a19 !== void 0 ? _a19 : "";
  if (repoName.length === 0) {
    return void 0;
  }
  return normalizedPath.slice(0, markerIndex + marker17.length + repoName.length);
}
function shouldBlockWorktreePath(params) {
  const { targetPath, workspacePaths, mainWorktreePath } = params;
  if (targetPath === void 0) {
    return false;
  }
  if (workspacePaths.length === 0) {
    return false;
  }
  if (!workspacePaths.every((path31) => isWorktreesPath(path31))) {
    return false;
  }
  if (isPathWithinAnyRoot(targetPath, workspacePaths)) {
    return false;
  }
  const resolvedTargets = (0, import_node_path3.isAbsolute)(targetPath) ? [(0, import_node_path3.resolve)(targetPath)] : workspacePaths.map((workspacePath) => (0, import_node_path3.resolve)(workspacePath, targetPath));
  const worktreeRepoRoots = workspacePaths.map((root) => getWorktreesRepoRoot(root)).filter((root) => root !== void 0);
  if (worktreeRepoRoots.length > 0) {
    if (resolvedTargets.some((target) => isPathWithinAnyRoot(target, worktreeRepoRoots))) {
      return true;
    }
  }
  if (mainWorktreePath !== void 0 && resolvedTargets.some((target) => isPathWithinAnyRoot(target, [mainWorktreePath]))) {
    return true;
  }
  return false;
}
var import_promises4, import_node_os2, import_node_path3, import_node_url2, __awaiter13, SEP, WORKTREE_GUARD_ERROR;
var init_path_utils = __esm({
  "../packages/utils/dist/path-utils.js"() {
    "use strict";
    import_promises4 = require("node:fs/promises");
    import_node_os2 = require("node:os");
    import_node_path3 = require("node:path");
    import_node_url2 = require("node:url");
    __awaiter13 = function(thisArg, _arguments, P2, generator) {
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
    SEP = "/";
    WORKTREE_GUARD_ERROR = "You cannot search other worktrees for this repository, stay within your workspace paths.";
  }
});
