/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/path-utils.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function untildify(path30) {
  return path30.replace(/^~(?=$|\/|\\)/, (0, import_node_os.homedir)());
}
function stripFileUrlIfPresent(path30) {
  if (!path30.startsWith("file://")) {
    return path30;
  }
  try {
    return (0, import_node_url2.fileURLToPath)(path30);
  } catch (_a20) {
    return path30;
  }
}
function resolvePath(path30, basePath) {
  const untildified = untildify(stripFileUrlIfPresent(path30));
  if (basePath && !(0, import_node_path2.isAbsolute)(untildified)) {
    return (0, import_node_path2.resolve)(basePath, untildified);
  }
  return (0, import_node_path2.resolve)(untildified);
}
function resolveRealPathStrict(path30, basePath) {
  return __awaiter5(this, void 0, void 0, function* () {
    const normalized = resolvePath(path30, basePath);
    let current = normalized;
    while (true) {
      try {
        const resolvedCurrent = yield (0, import_promises2.realpath)(current);
        return (0, import_node_path2.resolve)(resolvedCurrent, (0, import_node_path2.relative)(current, normalized));
      } catch (err) {
        if (err.code !== "ENOENT") {
          return null;
        }
        const parent = (0, import_node_path2.dirname)(current);
        if (parent === current) {
          return normalized;
        }
        current = parent;
      }
    }
  });
}
function isPathWithin({ basePath, targetPath }) {
  const resolvedBase = (0, import_node_path2.resolve)(basePath);
  const resolvedTarget = (0, import_node_path2.resolve)(basePath, targetPath);
  if (resolvedBase === (0, import_node_path2.parse)(resolvedBase).root) {
    return (
      // 1) The resolved target root is the same as the resolved base root
      (0, import_node_path2.parse)(resolvedTarget).root === resolvedBase && // 2) target is root OR is a path under the root.
      (resolvedTarget === resolvedBase || resolvedTarget.length > resolvedBase.length)
    );
  }
  return resolvedTarget === resolvedBase || resolvedTarget.startsWith(resolvedBase + import_node_path2.sep);
}
function isPathWithinAnyRoot(targetPath, roots) {
  for (const root of roots) {
    if (isPathWithin({ basePath: root, targetPath })) {
      return true;
    }
  }
  return false;
}
function normalizeToUnixPath(path30) {
  return path30.replace(/\\/g, SEP);
}
function isWorktreesPath(path30) {
  const normalizedPath = normalizeToUnixPath(path30);
  return normalizedPath.includes(".cursor/worktrees");
}
function getWorktreesRepoRoot(worktreePath) {
  var _a20;
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
  const repoName = (_a20 = parts[0]) !== null && _a20 !== void 0 ? _a20 : "";
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
  if (!workspacePaths.every((path30) => isWorktreesPath(path30))) {
    return false;
  }
  if (isPathWithinAnyRoot(targetPath, workspacePaths)) {
    return false;
  }
  const resolvedTargets = (0, import_node_path2.isAbsolute)(targetPath) ? [(0, import_node_path2.resolve)(targetPath)] : workspacePaths.map((workspacePath) => (0, import_node_path2.resolve)(workspacePath, targetPath));
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
var import_promises2, import_node_os, import_node_path2, import_node_url2, __awaiter5, SEP, WORKTREE_GUARD_ERROR;
var init_path_utils = __esm({
  "../packages/utils/dist/path-utils.js"() {
    "use strict";
    import_promises2 = require("node:fs/promises");
    import_node_os = require("node:os");
    import_node_path2 = require("node:path");
    import_node_url2 = require("node:url");
    __awaiter5 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve14) {
          resolve14(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
          result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    SEP = "/";
    WORKTREE_GUARD_ERROR = "You cannot search other worktrees for this repository, stay within your workspace paths.";
  }
});

