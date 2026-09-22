/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/git-sparse-clone.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises11 = require("node:fs/promises");
var import_node_path20 = require("node:path");
var __awaiter22 = function(thisArg, _arguments, P2, generator) {
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
var DISABLE_SPARSE_PLUGIN_CLONES_ENV = "CURSOR_DISABLE_SPARSE_PLUGIN_CLONES";
var ALWAYS_SPARSE_DIRS = MARKETPLACE_MANIFEST_PATHS.map((p2) => p2.split("/")[0]);
function parseGitVersion(stdout) {
  const match2 = /git version (\d+)\.(\d+)/.exec(stdout);
  if (!match2) {
    return null;
  }
  return { major: Number(match2[1]), minor: Number(match2[2]) };
}
var MIN_SPARSE_GIT = { major: 2, minor: 26 };
var sparseSupportPromise;
function isSparseCloneSupported() {
  if (process.env[DISABLE_SPARSE_PLUGIN_CLONES_ENV]) {
    return Promise.resolve(false);
  }
  sparseSupportPromise !== null && sparseSupportPromise !== void 0 ? sparseSupportPromise : sparseSupportPromise = (() => __awaiter22(this, void 0, void 0, function* () {
    try {
      const { stdout } = yield execGitNonInteractive(["--version"]);
      const version3 = parseGitVersion(stdout);
      if (version3 === null) {
        return false;
      }
      return version3.major > MIN_SPARSE_GIT.major || version3.major === MIN_SPARSE_GIT.major && version3.minor >= MIN_SPARSE_GIT.minor;
    } catch (_a20) {
      return false;
    }
  }))();
  return sparseSupportPromise;
}
function normalizeSparseCheckoutDir(dir) {
  let normalized = dir.trim().replaceAll("\\", "/");
  while (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }
  normalized = normalized.replace(/\/+$/, "");
  if (normalized === "" || normalized === ".") {
    return null;
  }
  if (normalized.startsWith("/") || /^[a-zA-Z]:/.test(normalized)) {
    return null;
  }
  const segments = normalized.split("/");
  if (segments.some((s3) => s3 === "" || s3 === "." || s3 === "..")) {
    return null;
  }
  return normalized;
}
function materializeSpecForGitPaths(gitPaths) {
  const dirs = [];
  for (const gitPath of gitPaths) {
    const normalized = normalizeSparseCheckoutDir(gitPath);
    if (normalized === null) {
      return "all";
    }
    dirs.push(normalized);
  }
  return dirs;
}
function sparseDirsForInitialCheckout(dirs) {
  return [.../* @__PURE__ */ new Set([...ALWAYS_SPARSE_DIRS, ...dirs])];
}
function resolveSparseClonePlan(requested, sparsePluginClones) {
  return __awaiter22(this, void 0, void 0, function* () {
    const materialize2 = requested === "all" ? "all" : materializeSpecForGitPaths(requested);
    const sparse = sparsePluginClones && materialize2 !== "all" && (yield isSparseCloneSupported());
    return {
      materialize: materialize2,
      sparse,
      sparseDirs: sparse ? sparseDirsForInitialCheckout(materialize2) : []
    };
  });
}
function serverIgnoredFilter(stderr) {
  return stderr.toLowerCase().includes("filtering not recognized by server");
}
function setSparseCheckoutDirs(repoDir, dirs, execOpts) {
  return __awaiter22(this, void 0, void 0, function* () {
    yield execGitNonInteractive(["sparse-checkout", "set", "--cone", "--", ...dirs], Object.assign(Object.assign({}, execOpts), { cwd: repoDir }));
  });
}
function isSparseCheckoutRepo(repoDir) {
  return __awaiter22(this, void 0, void 0, function* () {
    try {
      yield (0, import_promises11.access)((0, import_node_path20.join)(repoDir, ".git", "info", "sparse-checkout"));
    } catch (_a20) {
      return false;
    }
    try {
      const { stdout } = yield execGitNonInteractive(["config", "--bool", "--get", "core.sparseCheckout"], { cwd: repoDir });
      return stdout.trim() === "true";
    } catch (_b2) {
      return false;
    }
  });
}
function materializeSparseDirs(repoDir, spec, execOpts) {
  return __awaiter22(this, void 0, void 0, function* () {
    if (spec !== "all" && spec.length === 0) {
      return;
    }
    if (!(yield isSparseCheckoutRepo(repoDir))) {
      return;
    }
    const gitOpts = Object.assign(Object.assign({}, execOpts), {
      cwd: repoDir,
      // Promisor blob fetches must never block on an interactive SSH prompt.
      sshBatchMode: true
    });
    if (spec === "all") {
      yield execGitNonInteractive(["sparse-checkout", "disable"], gitOpts);
      return;
    }
    const dirs = materializeSpecForGitPaths(spec);
    if (dirs === "all") {
      yield execGitNonInteractive(["sparse-checkout", "disable"], gitOpts);
      return;
    }
    yield execGitNonInteractive(["sparse-checkout", "add", "--", ...dirs], gitOpts);
  });
}

