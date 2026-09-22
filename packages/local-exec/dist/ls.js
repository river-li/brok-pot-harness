/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/ls.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises21 = require("node:fs/promises");
var import_node_path33 = require("node:path");
init_dist();
init_ls_exec_pb();
init_dist3();
var __addDisposableResource16 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources16 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var DEFAULT_CHARACTER_BUDGET = 2500;
var DEFAULT_TIMEOUT_MS2 = 5e3;
var LocalLsExecutor = class {
  constructor(permissionsService, ignoreService, workspacePath) {
    this.permissionsService = permissionsService;
    this.ignoreService = ignoreService;
    this.workspacePath = workspacePath;
  }
  async execute(parentCtx, args) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource16(env_1, createSpan(parentCtx.withName("LocalLsExecutor.execute")), false);
      const ctx = span.ctx;
      const resolvedPath = resolvePath(args.path, this.workspacePath);
      try {
        let pathStats;
        try {
          pathStats = await (0, import_promises21.stat)(resolvedPath);
        } catch (error3) {
          if (error3.code === "ENOENT") {
            if (isCursorTerminalsDirectory(resolvedPath)) {
              return new LsResult({
                result: {
                  case: "error",
                  value: new LsError({
                    path: resolvedPath,
                    error: `No active terminals.`
                  })
                }
              });
            }
            return new LsResult({
              result: {
                case: "error",
                value: new LsError({
                  path: resolvedPath,
                  error: `Path does not exist: ${resolvedPath}`
                })
              }
            });
          }
          return new LsResult({
            result: {
              case: "error",
              value: new LsError({
                path: resolvedPath,
                error: error3.message
              })
            }
          });
        }
        if (!pathStats.isDirectory()) {
          return new LsResult({
            result: {
              case: "error",
              value: new LsError({
                path: resolvedPath,
                error: `Path is not a directory: ${resolvedPath}`
              })
            }
          });
        }
        const sandboxPolicy = convertProtoToInternalPolicy(args.sandboxPolicy);
        const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS2;
        const ctx2 = parentCtx.withTimeout(timeoutMs);
        const { tree, didTimeout } = await this.getDirectoryTree(ctx2, resolvedPath, args.ignore, sandboxPolicy);
        if (didTimeout) {
          return new LsResult({
            result: {
              case: "timeout",
              value: new LsTimeout({
                directoryTreeRoot: tree
              })
            }
          });
        }
        return new LsResult({
          result: {
            case: "success",
            value: new LsSuccess({
              directoryTreeRoot: tree
            })
          }
        });
      } catch (error3) {
        return new LsResult({
          result: {
            case: "error",
            value: new LsError({
              path: resolvedPath,
              error: error3 instanceof Error ? error3.message : "Unknown error occurred"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources16(env_1);
    }
  }
  async getDirectoryTree(parentCtx, directoryPath, ignoreGlobs, sandboxPolicy) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource16(env_2, createSpan(parentCtx.withName("LocalLsExecutor.getDirectoryTree")), false);
      return await this.buildTreeFromRipgrepStream(parentCtx, directoryPath, ignoreGlobs, sandboxPolicy, DEFAULT_CHARACTER_BUDGET);
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources16(env_2);
    }
  }
  /**
   * Build directory tree by streaming paths from ripgrep.
   * Process lines as they arrive - no buffering entire output.
   */
  async buildTreeFromRipgrepStream(ctx, directoryPath, ignoreGlobs, sandboxPolicy, characterBudget) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource16(env_3, createSpan(ctx.withName("LocalLsExecutor.buildTreeFromRipgrepStream")), false);
      const normalizedRoot = (0, import_node_path33.resolve)(directoryPath);
      const rootNode = new LsDirectoryTreeNode({
        absPath: normalizedRoot,
        childrenDirs: [],
        childrenFiles: [],
        childrenWereProcessed: true,
        fullSubtreeExtensionCounts: {}
      });
      const dirNodes = /* @__PURE__ */ new Map();
      dirNodes.set(normalizedRoot, rootNode);
      const state = {
        charactersUsed: normalizedRoot.length,
        budgetExceeded: false
      };
      const [cursorIgnoreFiles, repoBlockExcludeGlobs] = await Promise.all([
        this.ignoreService.listCursorIgnoreFilesByRoot(directoryPath),
        this.ignoreService.getRepoBlockExcludeGlobs(directoryPath)
      ]);
      const allExcludeGlobs = [...ignoreGlobs, ...repoBlockExcludeGlobs];
      const { lines: lines2, didTimeout } = ripwalk(ctx, {
        root: directoryPath,
        excludeGlobs: allExcludeGlobs,
        caseSensitive: true,
        cursorIgnoreFiles,
        sandboxPolicy,
        source: "ls"
      });
      for await (const line of lines2) {
        if (!line)
          continue;
        const filePath = (0, import_node_path33.resolve)(directoryPath, line);
        const resolvedForIgnore = await resolvePathForIgnoreService(filePath);
        if (resolvedForIgnore === null || await this.ignoreService.isCursorIgnored(resolvedForIgnore) || // Filter out files blocked by admin repo rules (OAL parity). This
        // handles the fallback case when git info is unavailable.
        await this.ignoreService.isRepoBlocked(resolvedForIgnore)) {
          continue;
        }
        this.addPathToTree(filePath, normalizedRoot, dirNodes, state, characterBudget);
      }
      this.sortTreeChildren(rootNode);
      return { tree: rootNode, didTimeout: await didTimeout };
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources16(env_3);
    }
  }
  /**
   * Add a single file path to the tree structure.
   * Called for each line streamed from ripgrep.
   */
  addPathToTree(filePath, normalizedRoot, dirNodes, state, characterBudget) {
    const fileName = (0, import_node_path33.basename)(filePath);
    const dirPath = (0, import_node_path33.dirname)(filePath);
    this.ensureDirectoryPath(dirPath, normalizedRoot, dirNodes, state.budgetExceeded);
    const parentNode = dirNodes.get(dirPath);
    if (!parentNode)
      return;
    const fileCharCost = fileName.length;
    if (!state.budgetExceeded && state.charactersUsed + fileCharCost <= characterBudget) {
      const fileNode = new LsDirectoryTreeNode_File({
        name: fileName
      });
      parentNode.childrenFiles.push(fileNode);
      state.charactersUsed += fileCharCost;
    } else {
      if (!state.budgetExceeded) {
        state.budgetExceeded = true;
        let currentDir2 = dirPath;
        while (currentDir2.startsWith(normalizedRoot)) {
          const node = dirNodes.get(currentDir2);
          if (node) {
            node.childrenWereProcessed = false;
          }
          const parentDir = (0, import_node_path33.dirname)(currentDir2);
          if (parentDir === currentDir2)
            break;
          currentDir2 = parentDir;
        }
      }
      const extension3 = (0, import_node_path33.extname)(filePath);
      let currentDir = dirPath;
      while (currentDir.startsWith(normalizedRoot)) {
        const node = dirNodes.get(currentDir);
        if (node) {
          node.fullSubtreeExtensionCounts[extension3] ??= 0;
          node.fullSubtreeExtensionCounts[extension3] = clampInt32(node.fullSubtreeExtensionCounts[extension3] + 1);
          node.numFiles ??= 0;
          node.numFiles = clampInt32(node.numFiles + 1);
        }
        const parentDir = (0, import_node_path33.dirname)(currentDir);
        if (parentDir === currentDir)
          break;
        currentDir = parentDir;
      }
    }
  }
  /**
   * Ensure directory path exists in tree, creating intermediate nodes as needed.
   */
  ensureDirectoryPath(dirPath, rootPath, dirNodes, budgetExceeded) {
    if (dirNodes.has(dirPath) || dirPath === rootPath) {
      return;
    }
    const parentPath = (0, import_node_path33.dirname)(dirPath);
    if (parentPath !== dirPath && parentPath.startsWith(rootPath)) {
      this.ensureDirectoryPath(parentPath, rootPath, dirNodes, budgetExceeded);
    }
    const dirNode = new LsDirectoryTreeNode({
      absPath: dirPath,
      childrenDirs: [],
      childrenFiles: [],
      childrenWereProcessed: !budgetExceeded,
      fullSubtreeExtensionCounts: {}
    });
    dirNodes.set(dirPath, dirNode);
    const parentNode = dirNodes.get(parentPath);
    if (parentNode) {
      parentNode.childrenDirs.push(dirNode);
    }
  }
  /**
   * Recursively sort children directories and files by name.
   */
  sortTreeChildren(node) {
    node.childrenDirs.sort((a, b2) => (0, import_node_path33.basename)(a.absPath).localeCompare((0, import_node_path33.basename)(b2.absPath)));
    node.childrenFiles.sort((a, b2) => a.name.localeCompare(b2.name));
    for (const childDir of node.childrenDirs) {
      this.sortTreeChildren(childDir);
    }
  }
};

