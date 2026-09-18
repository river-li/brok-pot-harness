var __addDisposableResource14 = function(env, value, async) {
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
var __disposeResources14 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
function unresolvedTargetPathError(path31) {
  return `Path '${path31}' could not be verified while resolving symlinks. This can happen when access is denied or the path contains a symlink loop.`;
}
function findOwningWorkspaceRoot(targetPath, workspaceRoots) {
  let owner;
  for (const candidateRoot of workspaceRoots) {
    if (isPathWithin2({ basePath: candidateRoot, targetPath }) && (owner === void 0 || candidateRoot.length > owner.length)) {
      owner = candidateRoot;
    }
  }
  return owner;
}
function fileBelongsToCurrentWorkspace(currentRoot, filePath, workspaceRoots) {
  const absoluteFilePath = (0, import_node_path74.resolve)(currentRoot, filePath);
  const owner = findOwningWorkspaceRoot(absoluteFilePath, workspaceRoots);
  return owner === void 0 || owner === currentRoot;
}
function deduplicateCrossWorkspaceResults(workspaceResults, workspacePaths) {
  if (workspacePaths.length <= 1)
    return workspaceResults;
  const resolvedRoots = [...new Set(workspacePaths.map((root) => (0, import_node_path74.resolve)(root)))];
  const deduped = {};
  for (const [root, unionResult] of Object.entries(workspaceResults)) {
    const resolvedRoot = (0, import_node_path74.resolve)(root);
    const belongsToCurrentWorkspace = (filePath) => fileBelongsToCurrentWorkspace(resolvedRoot, filePath, resolvedRoots);
    const result = unionResult.result;
    switch (result.case) {
      case "content": {
        const original = result.value;
        const filteredMatches = [];
        let droppedLineCount = 0;
        let droppedMatchedLines = 0;
        for (const m2 of original.matches) {
          if (belongsToCurrentWorkspace(m2.file)) {
            filteredMatches.push(m2);
          } else {
            droppedLineCount += m2.matches.length;
            droppedMatchedLines += m2.matches.filter((line) => !line.isContextLine).length;
          }
        }
        deduped[root] = new GrepUnionResult({
          result: {
            case: "content",
            value: new GrepContentResult({
              ...original,
              matches: filteredMatches,
              totalLines: Math.max(0, original.totalLines - droppedLineCount),
              totalMatchedLines: Math.max(0, original.totalMatchedLines - droppedMatchedLines)
            })
          }
        });
        break;
      }
      case "files": {
        const original = result.value;
        const filteredFiles = original.files.filter((f2) => belongsToCurrentWorkspace(f2));
        deduped[root] = new GrepUnionResult({
          result: {
            case: "files",
            value: new GrepFilesResult({
              ...original,
              files: filteredFiles,
              totalFiles: Math.max(0, original.totalFiles - (original.files.length - filteredFiles.length))
            })
          }
        });
        break;
      }
      case "count": {
        const original = result.value;
        const filteredCounts = [];
        let droppedMatchTotal = 0;
        for (const c of original.counts) {
          if (belongsToCurrentWorkspace(c.file)) {
            filteredCounts.push(c);
          } else {
            droppedMatchTotal += c.count;
          }
        }
        deduped[root] = new GrepUnionResult({
          result: {
            case: "count",
            value: new GrepCountResult({
              ...original,
              counts: filteredCounts,
              totalFiles: Math.max(0, original.totalFiles - (original.counts.length - filteredCounts.length)),
              totalMatches: Math.max(0, original.totalMatches - droppedMatchTotal)
            })
          }
        });
        break;
      }
      default:
        deduped[root] = unionResult;
    }
  }
  return deduped;
}
function parseFilesOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  return parseRipgrepFilesOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines);
}
function parseCountOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  return parseRipgrepCountOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines);
}
function parseContentOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines, ctx) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const _span = __addDisposableResource14(env_1, createSpan(ctx.withName("parseContentOutput")), false);
    return parseRipgrepContentOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines);
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources14(env_1);
  }
}
var logger39 = createLogger("local-exec/grep");
function isEnoentSpawnError(e) {
  if (!(e instanceof Error))
    return false;
  return e.message.includes("ENOENT") && e.message.includes("spawn");
}
function safeExists(path31) {
  try {
    return (0, import_node_fs44.existsSync)(path31);
  } catch {
    return "check_failed";
  }
}
function buildRipgrepEnoentMetadata(rgPath, cwd, error41, logContext) {
  return {
    ...probeRipgrepPath(rgPath),
    ...logContext,
    cwd,
    cwdExists: safeExists(cwd),
    errorMessage: error41.message,
    errorCode: error41.code,
    errno: error41.errno,
    syscall: error41.syscall,
    errorPath: error41.path
  };
}
function createPathDoesNotExistError(path31) {
  return new Error(`Path does not exist: ${path31}`);
}
function probeRipgrepPath(rgPath) {
  const probe = {
    rgPath,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    uptimeSeconds: Math.round(process.uptime()),
    execPath: process.execPath
  };
  try {
    probe.rgPathExists = (0, import_node_fs44.existsSync)(rgPath);
  } catch (e) {
    probe.rgPathExists = false;
    probe.rgPathExistsError = e instanceof Error ? e.message : String(e);
  }
  try {
    const lst = (0, import_node_fs44.lstatSync)(rgPath);
    probe.rgIsSymlink = lst.isSymbolicLink();
    if (lst.isSymbolicLink() && !probe.rgPathExists) {
      probe.rgBrokenSymlink = true;
    }
  } catch {
    probe.rgLstatFailed = true;
  }
  const MAX_DIR_ENTRIES = 50;
  const parentDir = (0, import_node_path74.dirname)(rgPath);
  try {
    probe.parentDirExists = (0, import_node_fs44.existsSync)(parentDir);
    if (probe.parentDirExists) {
      probe.parentDirContents = (0, import_node_fs44.readdirSync)(parentDir).slice(0, MAX_DIR_ENTRIES);
    }
  } catch (e) {
    probe.parentDirError = e instanceof Error ? e.message : String(e);
  }
  const grandparentDir = (0, import_node_path74.dirname)(parentDir);
  try {
    probe.grandparentDirExists = (0, import_node_fs44.existsSync)(grandparentDir);
    if (probe.grandparentDirExists) {
      probe.grandparentDirContents = (0, import_node_fs44.readdirSync)(grandparentDir).slice(0, MAX_DIR_ENTRIES);
    }
  } catch (e) {
    probe.grandparentDirError = e instanceof Error ? e.message : String(e);
  }
  if (probe.rgPathExists) {
    try {
      const st2 = (0, import_node_fs44.statSync)(rgPath);
      probe.rgFileSize = st2.size;
      probe.rgFileMode = st2.mode.toString(8);
      probe.rgIsFile = st2.isFile();
      probe.rgModifiedMs = st2.mtimeMs;
    } catch (e) {
      probe.rgStatError = e instanceof Error ? e.message : String(e);
    }
  }
  const asarUnpackedSegment = "node_modules.asar.unpacked";
  if (rgPath.includes(asarUnpackedSegment)) {
    const prefix = rgPath.split(asarUnpackedSegment)[0];
    if (prefix) {
      const asarPath = prefix.concat("node_modules.asar");
      try {
        probe.asarExists = (0, import_node_fs44.existsSync)(asarPath);
      } catch {
        probe.asarExists = "check_failed";
      }
      const asarUnpackedDir = prefix.concat(asarUnpackedSegment);
      try {
        probe.asarUnpackedDirExists = (0, import_node_fs44.existsSync)(asarUnpackedDir);
        if (probe.asarUnpackedDirExists) {
          const ripgrepPkgDir = (0, import_node_path74.join)(asarUnpackedDir, "@vscode", "ripgrep");
          probe.ripgrepPkgDirExists = (0, import_node_fs44.existsSync)(ripgrepPkgDir);
        }
      } catch {
        probe.asarUnpackedDirExists = "check_failed";
      }
    }
  }
  return probe;
}
var LocalGrepExecutor = class _LocalGrepExecutor {
  constructor(ignoreService, grepProvider, workspacePath, options2) {
    this.ignoreService = ignoreService;
    this.grepProvider = grepProvider;
    this.workspacePath = workspacePath;
    const firstWorkspacePath = Array.isArray(this.workspacePath) ? this.workspacePath[0] : this.workspacePath;
    this.singleWorkspacePath = Array.isArray(this.workspacePath) && this.workspacePath.length > 1 ? void 0 : firstWorkspacePath;
    this.mcpStateAccessor = options2?.mcpStateAccessor;
    this.permissionsService = options2?.permissionsService;
  }
  computeRelativeTarget(path31, root) {
    const resolvedPath = resolvePath(path31, this.singleWorkspacePath);
    if (resolvedPath === root) {
      return ".";
    }
    const result = (0, import_node_path74.relative)(root, resolvedPath);
    return result;
  }
  async buildArgs(root, params, mode) {
    const args = [];
    const ignoreFiles = await this.ignoreService.listCursorIgnoreFilesByRoot(root);
    for (const ignoreFile of ignoreFiles) {
      args.push("--cursor-ignore", ignoreFile);
    }
    if (mode === "content") {
      args.push("--line-number", "--with-filename", "--no-heading", "-0");
      if (params.contextBefore !== void 0) {
        args.push("--before-context", String(params.contextBefore));
      }
      if (params.contextAfter !== void 0) {
        args.push("--after-context", String(params.contextAfter));
      }
      args.push("--max-columns", String(1e3), "--max-columns-preview");
      if (params.context !== void 0 && params.contextBefore === void 0 && params.contextAfter === void 0) {
        args.push("--before-context", String(params.context), "--after-context", String(params.context));
      }
    } else if (mode === "files_with_matches") {
      args.push("-l");
    } else if (mode === "count") {
      args.push("-c", "--with-filename");
    } else {
      const _exhaustive = mode;
      throw new Error(`Unknown output mode: ${mode}`);
    }
    if (params.caseInsensitive === true) {
      args.push("--ignore-case");
    } else {
      args.push("--case-sensitive");
    }
    if (params.type) {
      args.push("--type", params.type);
    }
    if (params.glob) {
      args.push("--iglob", params.glob);
    }
    if (params.multiline) {
      args.push("--multiline", "--multiline-dotall");
    }
    const sortMode = params.sort ?? "modified";
    if (sortMode !== "none") {
      const flag = params.sortAscending === true ? "--sort" : "--sortr";
      args.push(flag, sortMode);
    }
    args.push("--no-config", "--color=never");
    args.push("--hidden");
    args.push("--follow");
    args.push("--regexp", params.pattern);
    args.push("--");
    args.push(params.path ? this.computeRelativeTarget(params.path, root) : ".");
    return args;
  }
  async filterBlockedFiles(items, root) {
    const boundaryBlocker = await this.permissionsService?.getFileReadBoundaryBlocker?.();
    const filtered = [];
    for (const item of items) {
      const requestedPath = resolvePath(item.file, root);
      const resolved = await resolvePathForIgnoreService(requestedPath);
      if (resolved === null || await this.isPostRipgrepBlocked(resolved) || boundaryBlocker !== void 0 && await boundaryBlocker(requestedPath, resolved)) {
        continue;
      }
      filtered.push(item);
    }
    return filtered;
  }
  async isPostRipgrepBlocked(filePath) {
    const [cursorIgnored, repoBlocked] = await Promise.all([
      this.ignoreService.isCursorIgnored(filePath),
      this.ignoreService.isRepoBlocked(filePath)
    ]);
    return cursorIgnored || repoBlocked;
  }
  async runFilesMode(ctx, root, params, sandboxPolicy, logContext) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource14(env_2, createSpan(ctx.withName("LocalGrepExecutor.runFilesMode")), false);
      const args = await this.buildArgs(root, params, "files_with_matches");
      const res = await this.executeRg(_span.ctx, root, args, void 0, sandboxPolicy, logContext);
      if ((res.stderr !== "" || res.exitCode === 2) && res.stdout.trim() === "") {
        throw new Error(res.stderr || `ripgrep exited with code ${res.exitCode}`);
      }
      const { files, totalFiles, clientTruncated, ripgrepTruncated } = parseFilesOutput(res.stdout, _LocalGrepExecutor.CLIENT_LIMIT_LINES, _LocalGrepExecutor.HARD_MAX_OUTPUT_LINES);
      const filteredFiles = (await this.filterBlockedFiles(files.map((file2) => ({ file: file2 })), root)).map(({ file: file2 }) => file2);
      const blockedFileCount = files.length - filteredFiles.length;
      const filesResult = new GrepFilesResult({
        files: filteredFiles,
        totalFiles: clampInt32(totalFiles - blockedFileCount),
        clientTruncated,
        ripgrepTruncated
      });
      return new GrepUnionResult({
        result: {
          case: "files",
          value: filesResult
        }
      });
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources14(env_2);
    }
  }
  async runCountMode(ctx, root, params, sandboxPolicy, logContext) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource14(env_3, createSpan(ctx.withName("LocalGrepExecutor.runCountMode")), false);
      const args = await this.buildArgs(root, params, "count");
      const res = await this.executeRg(_span.ctx, root, args, void 0, sandboxPolicy, logContext);
      if ((res.stderr !== "" || res.exitCode === 2) && res.stdout.trim() === "") {
        throw new Error(res.stderr || `ripgrep exited with code ${res.exitCode}`);
      }
      const { counts, totalFiles, totalMatches, clientTruncated, ripgrepTruncated } = parseCountOutput(res.stdout, _LocalGrepExecutor.CLIENT_LIMIT_LINES, _LocalGrepExecutor.HARD_MAX_OUTPUT_LINES);
      const filteredCounts = await this.filterBlockedFiles(counts, root);
      const filteredTotalMatches = filteredCounts.reduce((sum, c) => sum + c.count, 0);
      const blockedFileCount = counts.length - filteredCounts.length;
      const pageMatchTotal = counts.reduce((sum, c) => sum + c.count, 0);
      const blockedMatchTotal = pageMatchTotal - filteredTotalMatches;
      const countResult = new GrepCountResult({
        counts: filteredCounts.map((c) => new GrepFileCount({ file: c.file, count: clampInt32(c.count) })),
        totalFiles: clampInt32(totalFiles - blockedFileCount),
        totalMatches: clampInt32(totalMatches - blockedMatchTotal),
        clientTruncated,
        ripgrepTruncated
      });
      return new GrepUnionResult({
        result: {
          case: "count",
          value: countResult
        }
      });
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources14(env_3);
    }
  }
  async runContentMode(ctx, root, params, sandboxPolicy, logContext) {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource14(env_4, createSpan(ctx.withName("LocalGrepExecutor.runContentMode")), false);
      const args = await this.buildArgs(root, params, "content");
      const res = await this.executeRg(_span.ctx, root, args, void 0, sandboxPolicy, logContext);
      if ((res.stderr !== "" || res.exitCode === 2) && res.stdout.trim() === "") {
        throw new Error(res.stderr || `ripgrep exited with code ${res.exitCode}`);
      }
      const { byFile, totalLines, totalMatchedLines, clientTruncated, ripgrepTruncated } = parseContentOutput(res.stdout, _LocalGrepExecutor.CLIENT_LIMIT_LINES, _LocalGrepExecutor.HARD_MAX_OUTPUT_LINES, _span.ctx);
      const entries = Array.from(byFile.values());
      const filteredEntries = await this.filterBlockedFiles(entries, root);
      const blockedEntries = entries.filter((e) => !filteredEntries.includes(e));
      const blockedLineCount = blockedEntries.reduce((sum, e) => sum + e.matches.length, 0);
      const blockedMatchedLineCount = blockedEntries.reduce((sum, e) => sum + e.matches.filter((m2) => !m2.isContextLine).length, 0);
      const contentRes = new GrepContentResult({
        matches: filteredEntries.map((f2) => new GrepFileMatch({
          file: f2.file,
          matches: f2.matches.map((m2) => new GrepContentMatch({
            lineNumber: m2.lineNumber,
            content: m2.content,
            isContextLine: m2.isContextLine
          }))
        })),
        totalLines: clampInt32(totalLines - blockedLineCount),
        totalMatchedLines: clampInt32(totalMatchedLines - blockedMatchedLineCount),
        clientTruncated,
        ripgrepTruncated
      });
      return new GrepUnionResult({
        result: {
          case: "content",
          value: contentRes
        }
      });
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      __disposeResources14(env_4);
    }
  }
  async executeIndexedGrepWithTimeout(ctx, workspacePaths, args, logContext) {
    if (this.grepProvider.executeIndexedGrep === void 0) {
      return void 0;
    }
    const [indexedCtx, cancelIndexedCtx] = ctx.withTimeoutAndCancel(_LocalGrepExecutor.INDEXED_GREP_CONTEXT_TIMEOUT_MS);
    const diagnostics = { phase: "provider" };
    const startedAt = performance.now();
    try {
      return await withTimeout(this.grepProvider.executeIndexedGrep(indexedCtx, workspacePaths, args, diagnostics), _LocalGrepExecutor.INDEXED_GREP_TIMEOUT_MS, `Indexed grep timed out after ${_LocalGrepExecutor.INDEXED_GREP_TIMEOUT_MS / 1e3}s`);
    } catch (error41) {
      if (error41 instanceof TimeoutError) {
        logger39.warn(ctx, "indexed_grep.timeout_fallback", {
          ...logContext,
          totalMs: Math.round(performance.now() - startedAt),
          ...diagnostics
        });
        return void 0;
      }
      throw error41;
    } finally {
      cancelIndexedCtx();
    }
  }
  async executeRg(ctx, cwd, args, lineBudget, sandboxPolicy, logContext) {
    const span = createSpan(ctx.withName("LocalGrepExecutor.executeRg"));
    const enc = "utf8";
    const maxBytes = 8 * 1024 * 1024;
    lineBudget = lineBudget ?? _LocalGrepExecutor.HARD_MAX_OUTPUT_LINES;
    return new Promise((resolve29, reject2) => {
      let exited = false;
      let spanEnded = false;
      const endSpan = () => {
        if (!spanEnded) {
          spanEnded = true;
          span.span.end();
        }
      };
      let proc;
      let timeoutId;
      try {
        const p2 = sandboxPolicy;
        proc = spawnInSandbox(getRipgrepBinaryPath(), args, { cwd }, p2);
        if (isRipgrepInvocationRecordingEnabled()) {
          const regexpIdx = args.indexOf("--regexp");
          const patternLength = regexpIdx >= 0 && regexpIdx + 1 < args.length ? args[regexpIdx + 1].length : 0;
          let includeGlobCount = 0;
          for (const a of args) {
            if (a === "--iglob") {
              includeGlobCount++;
            }
          }
          recordRipgrepInvocation({
            timestamp: Date.now(),
            source: "agent_grep_tool",
            mode: logContext.outputMode,
            patternLength,
            hasPath: logContext.targetPath !== void 0,
            includeGlobCount,
            excludeGlobCount: 0,
            sandboxPolicyType: p2.type,
            toolCallId: logContext.toolCallId,
            execId: logContext.execId
          });
        }
      } catch (e) {
        endSpan();
        if (isEnoentSpawnError(e)) {
          const errnoErr = e;
          const rgPath = getRipgrepBinaryPath();
          logger39.error(ctx, "rg_diagnostics.spawn_throw", void 0, buildRipgrepEnoentMetadata(rgPath, cwd, errnoErr, logContext));
          if (safeExists(cwd) === false) {
            return reject2(createPathDoesNotExistError(cwd));
          }
        }
        return reject2(e);
      }
      const chunksStdout = [];
      const chunksStderr = [];
      let totalStdout = 0;
      let totalStderr = 0;
      let seenLines = 0;
      let lineBudgetExceeded = false;
      timeoutId = setTimeout(() => {
        if (!exited) {
          try {
            endSpan();
            reject2(new Error(`Timed out after ${_LocalGrepExecutor.MAIN_TIMEOUT_MS / 1e3}s`));
            proc.kill();
          } catch {
          }
        }
      }, _LocalGrepExecutor.MAIN_TIMEOUT_MS);
      proc.stdout?.on("data", (d) => {
        totalStdout += d.length;
        if (lineBudget !== void 0 && lineBudgetExceeded !== true) {
          let truncateIndex = -1;
          let linesInChunk = 0;
          for (let i = 0; i < d.length; i++) {
            if (d[i] === 10) {
              linesInChunk++;
              if (seenLines + linesInChunk >= lineBudget) {
                truncateIndex = i + 1;
                lineBudgetExceeded = true;
                try {
                  proc.kill();
                } catch {
                }
                break;
              }
            }
          }
          seenLines += linesInChunk;
          const bufferToAdd = truncateIndex >= 0 ? d.subarray(0, truncateIndex) : d;
          if (totalStdout <= maxBytes) {
            chunksStdout.push(bufferToAdd);
          }
        } else if (lineBudgetExceeded !== true && totalStdout <= maxBytes) {
          chunksStdout.push(d);
        }
      });
      proc.stderr?.on("data", (d) => {
        totalStderr += d.length;
        if (totalStderr <= maxBytes) {
          chunksStderr.push(d);
        }
      });
      proc.on("error", (err) => {
        clearTimeout(timeoutId);
        endSpan();
        if (isEnoentSpawnError(err)) {
          const rgPath = getRipgrepBinaryPath();
          const errnoErr = err;
          logger39.error(ctx, "rg_diagnostics.spawn_enoent", void 0, buildRipgrepEnoentMetadata(rgPath, cwd, errnoErr, logContext));
          if (safeExists(cwd) === false) {
            reject2(createPathDoesNotExistError(cwd));
            return;
          }
        }
        reject2(err);
      });
      proc.on("close", (code) => {
        exited = true;
        clearTimeout(timeoutId);
        const stdout = Buffer.concat(chunksStdout).toString(enc);
        const stderr = Buffer.concat(chunksStderr).toString(enc);
        endSpan();
        resolve29({ stdout, stderr, exitCode: code ?? 0 });
      });
    });
  }
  async execute(ctx, args, options2) {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource14(env_5, createSpan(ctx.withName("LocalGrepExecutor.execute")), false);
      const workspacePaths = Array.isArray(this.workspacePath) ? this.workspacePath : [this.workspacePath ?? process.cwd()];
      const mode = args.outputMode ?? "content";
      const logContext = {
        toolCallId: args.toolCallId,
        execId: options2?.execId,
        outputMode: mode,
        targetPath: args.path,
        workspacePaths
      };
      const sandboxPolicy = convertProtoToInternalPolicy(args.sandboxPolicy);
      try {
        const guardInfo = this.grepProvider.getWorktreeGuardInfo?.(workspacePaths);
        const shouldBlock = shouldBlockWorktreePath({
          targetPath: args.path,
          workspacePaths,
          mainWorktreePath: guardInfo?.mainWorktreePath
        });
        if (shouldBlock) {
          return new GrepResult({
            result: {
              case: "error",
              value: new GrepError({ error: WORKTREE_GUARD_ERROR })
            }
          });
        }
        if (args.path) {
          const resolvedTargetPath = await resolvePathForIgnoreService(resolvePath(args.path, this.singleWorkspacePath));
          if (resolvedTargetPath === null) {
            return new GrepResult({
              result: {
                case: "error",
                value: new GrepError({
                  error: unresolvedTargetPathError(args.path)
                })
              }
            });
          }
          if (await this.ignoreService.isCursorIgnored(resolvedTargetPath)) {
            return new GrepResult({
              result: {
                case: "error",
                value: new GrepError({
                  error: `Path '${args.path}' is filtered out by .cursorignore`
                })
              }
            });
          }
          if (this.mcpStateAccessor !== void 0) {
            scheduleDiskMcpDiscoveryFreshnessOnMcpsPathAccess(ctx, this.mcpStateAccessor, resolvedTargetPath);
          }
        }
        let workspaceResults = {};
        const indexedResults = await this.executeIndexedGrepWithTimeout(_span.ctx, workspacePaths, args, logContext);
        if (indexedResults !== void 0) {
          workspaceResults = indexedResults;
          for (const [root, unionResult] of Object.entries(workspaceResults)) {
            const result = unionResult.result;
            switch (result.case) {
              case "content":
                result.value.matches = await this.filterBlockedFiles(result.value.matches, root);
                break;
              case "files":
                result.value.files = (await this.filterBlockedFiles(result.value.files.map((file2) => ({ file: file2 })), root)).map(({ file: file2 }) => file2);
                break;
              case "count":
                result.value.counts = await this.filterBlockedFiles(result.value.counts, root);
                break;
            }
          }
        } else {
          for (const root of workspacePaths) {
            if (safeExists(root) === false) {
              return new GrepResult({
                result: {
                  case: "error",
                  value: new GrepError({
                    error: `Path does not exist: ${root}`
                  })
                }
              });
            }
            let results;
            if (mode === "content") {
              results = await this.runContentMode(_span.ctx, root, args, sandboxPolicy, logContext);
            } else if (mode === "files_with_matches") {
              results = await this.runFilesMode(_span.ctx, root, args, sandboxPolicy, logContext);
            } else if (mode === "count") {
              results = await this.runCountMode(_span.ctx, root, args, sandboxPolicy, logContext);
            } else {
              const _exhaustive = mode;
              throw new Error(`Unknown output mode: ${mode}`);
            }
            workspaceResults[root] = results;
          }
        }
        const dedupedResults = deduplicateCrossWorkspaceResults(workspaceResults, workspacePaths);
        const success2 = new GrepSuccess({
          pattern: args.pattern,
          path: args.path,
          outputMode: mode,
          workspaceResults: dedupedResults
        });
        return new GrepResult({
          result: { case: "success", value: success2 }
        });
      } catch (e) {
        if (args.path) {
          const resolvedPath = resolvePath(args.path, this.singleWorkspacePath);
          try {
            await (0, import_promises42.stat)(resolvedPath);
          } catch (_e2) {
            return new GrepResult({
              result: {
                case: "error",
                value: new GrepError({
                  error: `Path does not exist: ${resolvedPath}`
                })
              }
            });
          }
        }
        return new GrepResult({
          result: {
            case: "error",
            value: new GrepError({
              error: e instanceof Error ? e.message : String(e)
            })
          }
        });
      }
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      __disposeResources14(env_5);
    }
  }
};
LocalGrepExecutor.MAIN_TIMEOUT_MS = 25e3;
LocalGrepExecutor.INDEXED_GREP_TIMEOUT_MS = 25e3;
LocalGrepExecutor.INDEXED_GREP_CONTEXT_TIMEOUT_MS = LocalGrepExecutor.INDEXED_GREP_TIMEOUT_MS + 100;
LocalGrepExecutor.HARD_MAX_OUTPUT_LINES = 1e4;
LocalGrepExecutor.CLIENT_LIMIT_LINES = 2e3;
