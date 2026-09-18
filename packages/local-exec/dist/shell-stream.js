init_dist();
init_shell_exec_pb();
init_dist4();
var __addDisposableResource21 = function(env, value, async) {
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
var __disposeResources21 = /* @__PURE__ */ (function(SuppressedError2) {
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
var logger22 = createLogger("local-exec:shell-stream");
var BackgroundableIterator = class {
  constructor(iterator, timeoutMs) {
    this.iterator = iterator;
    this.timeoutMs = timeoutMs;
    this.pendingPromise = null;
    this.stopPromise = new Promise((resolve14) => {
      this.stopResolve = resolve14;
    });
  }
  stop(reason) {
    if (this.stopReason !== void 0) {
      return false;
    }
    this.stopReason = reason;
    this.stopResolve?.();
    return true;
  }
  get timedOut() {
    return this.stopReason?.kind === "background" && this.stopReason.reason === ShellBackgroundReason.TIMEOUT;
  }
  get backgroundRequested() {
    return this.stopReason?.kind === "background";
  }
  get backgroundReasonValue() {
    return this.stopReason?.kind === "background" ? this.stopReason.reason : void 0;
  }
  get stopReasonValue() {
    return this.stopReason;
  }
  /**
   * Iterate with timeout. When timeout occurs, iteration stops and
   * `timedOut` becomes true. Call `getHandoffIterator()` to get an
   * iterator that includes any in-flight event.
   */
  async *iterate() {
    this.timer = setTimeout(() => {
      this.stop({
        kind: "background",
        reason: ShellBackgroundReason.TIMEOUT
      });
    }, this.timeoutMs);
    try {
      while (true) {
        this.pendingPromise = this.iterator.next();
        const raceResult = await Promise.race([
          this.pendingPromise.then((result) => ({ kind: "result", result })),
          this.stopPromise.then(() => ({ kind: "stopped" }))
        ]);
        if (raceResult.kind === "stopped") {
          return;
        }
        this.pendingPromise = null;
        if (raceResult.result.done)
          return;
        yield raceResult.result.value;
      }
    } finally {
      clearTimeout(this.timer);
    }
  }
  /**
   * Trigger background handoff programmatically (e.g. from user action).
   */
  requestBackground() {
    return this.stop({
      kind: "background",
      reason: ShellBackgroundReason.USER_REQUEST
    });
  }
  /**
   * Trigger timeout programmatically (e.g., from abort signal).
   */
  abort() {
    this.stop({ kind: "abort" });
  }
  /**
   * Get an iterator for handoff that includes any in-flight event.
   * Call this after iteration stops due to timeout.
   */
  getHandoffIterator() {
    if (this.pendingPromise) {
      const pending = this.pendingPromise;
      this.pendingPromise = null;
      let consumed = false;
      return {
        next: async () => {
          if (!consumed) {
            consumed = true;
            return pending;
          }
          return this.iterator.next();
        }
      };
    }
    return this.iterator;
  }
};
var LocalShellStreamExecutor = class {
  constructor(permissionsService, coreExecutor, ignoreService, backgroundShellManager) {
    this.permissionsService = permissionsService;
    this.coreExecutor = coreExecutor;
    this.ignoreService = ignoreService;
    this.backgroundShellManager = backgroundShellManager;
    this.activeForegroundExecutions = /* @__PURE__ */ new Map();
  }
  async forceBackgroundByToolCallId(toolCallId) {
    const execution = this.activeForegroundExecutions.get(toolCallId);
    const shellResult = execution?.requestBackground();
    if (!shellResult) {
      return new ForceBackgroundShellResult({
        status: ForceBackgroundShellStatus.NOT_FOUND
      });
    }
    return new ForceBackgroundShellResult({
      status: ForceBackgroundShellStatus.ACCEPTED,
      shellResult
    });
  }
  async *execute(ctx, args) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      ctx.signal?.throwIfAborted();
      const _span = __addDisposableResource21(env_1, createSpan(ctx.withName("LocalShellStreamExecutor.execute")), false);
      const command = args.command;
      let requestedPolicy = args.requestedSandboxPolicy ? convertProtoToInternalPolicy(args.requestedSandboxPolicy) : void 0;
      const workingDirectory = args.workingDirectory || await this.coreExecutor.getCwd();
      const timeout2 = resolveShellTimeoutMs(args);
      const resolvedWorkingDir = resolvePath(workingDirectory);
      const startTime = Date.now();
      const parsingResult = new ShellCommandParsingResult(analyzeShellCommand(command).structured);
      const modelShellBlockReason = getModelShellAdminCommandDenylistBlockReason({
        command,
        parsingResult,
        blockedCommands: args.adminCommandDenylist
      });
      if (modelShellBlockReason !== void 0) {
        yield new ShellStream({
          event: {
            case: "rejected",
            value: new ShellRejected({
              command,
              workingDirectory: resolvedWorkingDir,
              reason: modelShellBlockReason
            })
          }
        });
        return;
      }
      const invariantBlock = await this.permissionsService.shouldEnforceShellInvariantBlocks(ctx, {
        workingDirectory: resolvedWorkingDir,
        skipUnsafeWorkingDirectoryBlock: true,
        command,
        parsingResult,
        toolCallId: args.toolCallId
      }, requestedPolicy);
      if (invariantBlock.kind === "block") {
        if (invariantBlock.reason.type === "permissionsConfig") {
          yield new ShellStream({
            event: {
              case: "permissionDenied",
              value: new ShellPermissionDenied({
                command,
                workingDirectory: resolvedWorkingDir,
                error: "Command blocked by permissions configuration",
                isReadonly: invariantBlock.reason.isReadonly ?? false
              })
            }
          });
          return;
        }
        yield new ShellStream({
          event: {
            case: "rejected",
            value: new ShellRejected({
              command,
              workingDirectory: resolvedWorkingDir,
              reason: shellBlockReasonMessage(invariantBlock.reason)
            })
          }
        });
        return;
      }
      logger22.info(ctx, "Shell stream: approval gate reached", {
        toolCallId: args.toolCallId,
        skipApproval: args.skipApproval,
        hasSmartModeApproval: args.smartModeApproval !== void 0,
        hasSmartModeApprovalReason: args.smartModeApproval?.reason !== void 0,
        hasSmartModeApprovalRequestId: args.smartModeApproval?.requestId !== void 0,
        requestedPolicyType: requestedPolicy?.type ?? "undefined",
        parserCommandCount: parsingResult.executableCommands.length,
        classifierCommandCount: args.classifierResult?.commands.length ?? 0,
        commandLength: command.length
      });
      if (!args.skipApproval) {
        const blockResult = await this.permissionsService.shouldBlockShellCommand(ctx, command, {
          workingDirectory: resolvedWorkingDir,
          timeout: timeout2,
          parsingResult,
          toolCallId: args.toolCallId,
          classifierResult: args.classifierResult,
          smartModeApprovalReason: args.smartModeApproval?.reason,
          smartModeApprovalRequestId: args.smartModeApproval?.requestId,
          hookApprovalRequirement: getShellHookApprovalRequirement(args)
        }, requestedPolicy);
        if (blockResult.kind === "block") {
          logger22.info(ctx, "Shell stream: approval gate blocked command", {
            toolCallId: args.toolCallId,
            blockReasonType: blockResult.reason.type,
            hasSmartModeApproval: args.smartModeApproval !== void 0,
            skipApproval: args.skipApproval
          });
          if (blockResult.reason.type === "permissionsConfig") {
            yield new ShellStream({
              event: {
                case: "permissionDenied",
                value: new ShellPermissionDenied({
                  command,
                  workingDirectory: resolvedWorkingDir,
                  error: "Command blocked by permissions configuration",
                  isReadonly: blockResult.reason.isReadonly ?? false
                })
              }
            });
            return;
          }
          const reason = shellBlockReasonMessage(blockResult.reason);
          yield new ShellStream({
            event: {
              case: "rejected",
              value: new ShellRejected({
                command,
                workingDirectory: resolvedWorkingDir,
                reason
              })
            }
          });
          return;
        }
        requestedPolicy = blockResult.policy;
        logger22.info(ctx, "Shell stream: approval gate allowed command", {
          toolCallId: args.toolCallId,
          skipApproval: args.skipApproval,
          effectivePolicyType: requestedPolicy.type
        });
      } else {
        logger22.info(ctx, "Shell stream: skipped local approval", {
          toolCallId: args.toolCallId,
          requestedPolicyType: requestedPolicy?.type ?? "undefined"
        });
      }
      if (isForcedShellEgressEnabled()) {
        requestedPolicy = forcedShellSandboxPolicy(command, parsingResult);
      }
      if (requestedPolicy && requestedPolicy.type !== "insecure_none") {
        const ignoreMapping = await resolveShellSandboxIgnoreMapping(this.ignoreService);
        requestedPolicy = { ...requestedPolicy, ignoreMapping };
      }
      yield new ShellStream({
        event: {
          case: "start",
          value: new ShellStreamStart({
            sandboxPolicy: convertInternalToProtoPolicy(requestedPolicy)
          })
        }
      });
      const timeoutBehavior = args.timeoutBehavior;
      const shouldBackgroundOnTimeout = timeoutBehavior === TimeoutBehavior.BACKGROUND;
      const shouldPipeStdin = shouldBackgroundOnTimeout && !args.closeStdin && args.smartModeApproval === void 0;
      const abortController = new AbortController();
      const executionSignal = shouldBackgroundOnTimeout ? abortController.signal : ctx.signal ? AbortSignal.any([ctx.signal, abortController.signal]) : abortController.signal;
      const showElapsedTime = true;
      const sandboxPolicyMergeSources = requestedPolicy ? { perRepo: requestedPolicy } : void 0;
      const iterable = this.coreExecutor.execute(ctx, {
        command,
        workingDirectory,
        signal: executionSignal,
        toolCallId: args.toolCallId,
        conversationId: args.conversationId,
        requestId: args.requestId,
        secretScopeId: args.secretScopeId,
        sandboxPolicy: sandboxPolicyMergeSources,
        fileOutputThresholdBytes: args.fileOutputThresholdBytes,
        pipeStdin: shouldPipeStdin,
        showElapsedTime
      });
      let cancelTimer;
      if (!shouldBackgroundOnTimeout) {
        cancelTimer = setTimeout(() => abortController.abort(), timeout2);
      }
      const bgIterator = shouldBackgroundOnTimeout ? new BackgroundableIterator(iterable[Symbol.asyncIterator](), timeout2) : null;
      let collectedOutput = "";
      let stdin;
      let pid;
      let backgroundedShellId;
      let killedByHardTimeout = false;
      const foregroundExecution = args.toolCallId && bgIterator ? {
        requestBackground: () => {
          if (!bgIterator.requestBackground()) {
            return void 0;
          }
          backgroundedShellId = backgroundedShellId ?? this.backgroundShellManager.generateShellId();
          return new ShellResult({
            result: {
              case: "success",
              value: new ShellSuccess({
                shellId: backgroundedShellId,
                pid,
                command,
                workingDirectory: resolvedWorkingDir,
                msToWait: toOptionalDurationMsInt32(Date.now() - startTime),
                backgroundReason: ShellBackgroundReason.USER_REQUEST,
                interleavedOutput: collectedOutput
              })
            }
          });
        }
      } : void 0;
      if (args.toolCallId && foregroundExecution) {
        this.activeForegroundExecutions.set(args.toolCallId, foregroundExecution);
      }
      const clearForegroundExecution = () => {
        if (args.toolCallId && this.activeForegroundExecutions.get(args.toolCallId) === foregroundExecution) {
          this.activeForegroundExecutions.delete(args.toolCallId);
        }
      };
      if (bgIterator && ctx.signal) {
        ctx.signal.addEventListener("abort", () => {
          if (!bgIterator.backgroundRequested) {
            abortController.abort();
            bgIterator.abort();
          }
        }, {
          once: true
        });
      }
      let hardKillTimer;
      const hardTimeout = args.hardTimeout;
      if (hardTimeout !== void 0 && hardTimeout > 0) {
        hardKillTimer = setTimeout(() => {
          if (backgroundedShellId !== void 0) {
            const aborted2 = this.backgroundShellManager.abort(backgroundedShellId);
            if (!aborted2) {
              abortController.abort();
            }
          } else {
            killedByHardTimeout = true;
            abortController.abort();
            bgIterator?.abort();
          }
        }, hardTimeout);
      }
      const eventSource = bgIterator?.iterate() ?? iterable;
      try {
        for await (const event of eventSource) {
          if (event.type === "stdout") {
            collectedOutput += event.data;
            yield new ShellStream({
              event: {
                case: "stdout",
                value: new ShellStreamStdout({ data: event.data })
              }
            });
          } else if (event.type === "stderr") {
            collectedOutput += event.data;
            yield new ShellStream({
              event: {
                case: "stderr",
                value: new ShellStreamStderr({ data: event.data })
              }
            });
          } else if (event.type === "stdin_ready") {
            stdin = event.stdin;
            pid = event.pid;
          } else if (event.type === "exit") {
            let abortReason2;
            if (event.aborted) {
              if (ctx.signal?.aborted) {
                abortReason2 = ShellAbortReason.USER_ABORT;
              } else if (bgIterator?.timedOut || abortController.signal.aborted) {
                abortReason2 = ShellAbortReason.TIMEOUT;
              } else {
                abortReason2 = ShellAbortReason.USER_ABORT;
              }
            }
            yield new ShellStream({
              event: {
                case: "exit",
                value: new ShellStreamExit({
                  // Convert to unsigned for uint32 proto field. Negative values
                  // (e.g. libuv errors like -4048) are invalid for uint32.
                  code: (event.code ?? 0) >>> 0,
                  cwd: await this.coreExecutor.getCwd(),
                  outputLocation: event.outputLocation,
                  aborted: event.aborted,
                  abortReason: abortReason2,
                  localExecutionTimeMs: toOptionalDurationMsInt32(event.localExecutionTimeMs)
                })
              }
            });
          }
        }
      } catch (error3) {
        if (!(error3 instanceof SandboxUnsupportedError)) {
          throw error3;
        }
        const policyType = requestedPolicy?.type ?? "unknown";
        logger22.warn(ctx, "Shell stream: sandbox policy unsupported on this host", {
          toolCallId: args.toolCallId,
          policyType,
          reason: error3.reason
        });
        yield new ShellStream({
          event: {
            case: "sandboxUnsupported",
            value: new ShellSandboxUnsupported({
              command,
              workingDirectory: resolvedWorkingDir,
              sandboxPolicyType: policyType,
              reason: error3.reason ?? error3.message,
              isReadonly: policyType === "workspace_readonly"
            })
          }
        });
        return;
      } finally {
        clearTimeout(cancelTimer);
        if (!bgIterator?.backgroundRequested) {
          clearTimeout(hardKillTimer);
        }
        clearForegroundExecution();
      }
      if (bgIterator?.backgroundRequested && !killedByHardTimeout) {
        const shellId = backgroundedShellId ?? this.backgroundShellManager.generateShellId();
        backgroundedShellId = shellId;
        const backgroundReason = bgIterator.backgroundReasonValue === ShellBackgroundReason.USER_REQUEST ? ShellBackgroundReason.USER_REQUEST : ShellBackgroundReason.TIMEOUT;
        const msToWait = backgroundReason === ShellBackgroundReason.USER_REQUEST ? Date.now() - startTime : timeout2;
        await this.backgroundShellManager.adopt({
          ctx,
          shellId,
          command,
          workingDirectory: resolvedWorkingDir,
          toolCallId: args.toolCallId,
          // Reuse the already-created merge sources
          sandboxPolicy: sandboxPolicyMergeSources,
          initialOutput: collectedOutput,
          stdin,
          pid,
          abortController,
          eventIterator: bgIterator.getHandoffIterator(),
          startTime,
          showElapsedTime,
          description: args.description,
          outputNotification: args.outputNotification
        });
        yield new ShellStream({
          event: {
            case: "backgrounded",
            value: new ShellStreamBackgrounded({
              shellId,
              command,
              workingDirectory: resolvedWorkingDir,
              pid,
              // Only include msToWait when feature flag is enabled (hardTimeout is set)
              msToWait: showElapsedTime ? msToWait : void 0,
              reason: backgroundReason
            })
          }
        });
      } else if (ctx.signal?.aborted && bgIterator?.stopReasonValue !== void 0) {
        clearTimeout(hardKillTimer);
        yield new ShellStream({
          event: {
            case: "exit",
            value: new ShellStreamExit({
              // Use unsigned representation of -1 for uint32 proto field
              code: 4294967295,
              cwd: await this.coreExecutor.getCwd(),
              aborted: true,
              abortReason: ShellAbortReason.USER_ABORT
            })
          }
        });
      } else {
        clearTimeout(hardKillTimer);
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources21(env_1);
    }
  }
};
