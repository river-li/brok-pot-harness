var __addDisposableResource19 = function(env, value, async) {
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
var __disposeResources19 = /* @__PURE__ */ (function(SuppressedError2) {
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
var LocalShellExecutor = class {
  constructor(permissionsService, coreExecutor, ignoreService, _pendingDecisionProvider) {
    this.permissionsService = permissionsService;
    this.coreExecutor = coreExecutor;
    this.ignoreService = ignoreService;
  }
  // Build a standardized result from base fields and exit code
  buildResultFromExit(base) {
    if ((base.exitCode ?? -1) === 0) {
      return new ShellResult({
        result: {
          case: "success",
          value: new ShellSuccess({
            ...base,
            // If file-based, empty the inline fields; otherwise populate them
            stdout: base.outputLocation ? "" : base.stdout,
            stderr: base.outputLocation ? "" : base.stderr
          })
        },
        sandboxPolicy: convertInternalToProtoPolicy(base.sandboxPolicy)
      });
    }
    return new ShellResult({
      result: {
        case: "failure",
        value: new ShellFailure({
          ...base,
          aborted: base.abortReason !== void 0,
          // If file-based, empty the inline fields; otherwise populate them
          stdout: base.outputLocation ? "" : base.stdout,
          stderr: base.outputLocation ? "" : base.stderr
        })
      },
      sandboxPolicy: convertInternalToProtoPolicy(base.sandboxPolicy)
    });
  }
  async executeWithPolicy(ctx, args, workingDirectory, timeout2, policy) {
    const startTime = Date.now();
    const timeoutController = new AbortController();
    const combinedSignal = ctx.signal ? AbortSignal.any([ctx.signal, timeoutController.signal]) : timeoutController.signal;
    const timer2 = setTimeout(() => {
      timeoutController.abort();
    }, timeout2);
    try {
      let stdout = "";
      let stderr = "";
      let exitCode = null;
      let abortReason2;
      let outputLocation;
      let localExecutionTimeMs;
      const sandboxPolicyMergeSources = policy ? { perRepo: policy } : void 0;
      for await (const event of this.coreExecutor.execute(ctx, {
        command: args.command,
        workingDirectory,
        signal: combinedSignal,
        toolCallId: args.toolCallId,
        conversationId: args.conversationId,
        requestId: args.requestId,
        secretScopeId: args.secretScopeId,
        sandboxPolicy: sandboxPolicyMergeSources,
        fileOutputThresholdBytes: args.fileOutputThresholdBytes,
        pipeStdin: false
        // currently not possible to send stdin to foreground shells
      })) {
        if (event.type === "stdout")
          stdout += event.data;
        else if (event.type === "stderr")
          stderr += event.data;
        else if (event.type === "exit") {
          exitCode = event.code != null ? event.code | 0 : null;
          outputLocation = event.outputLocation;
          if (!event.aborted) {
            abortReason2 = void 0;
          } else if (!combinedSignal.aborted) {
            abortReason2 = ShellAbortReason.UNSPECIFIED;
          } else if (timeoutController.signal.aborted && combinedSignal.reason === timeoutController.signal.reason) {
            abortReason2 = ShellAbortReason.TIMEOUT;
          } else {
            abortReason2 = ShellAbortReason.USER_ABORT;
          }
          localExecutionTimeMs = toOptionalDurationMsInt32(event.localExecutionTimeMs);
        }
      }
      clearTimeout(timer2);
      const executionTime = Date.now() - startTime;
      const baseResult = {
        command: args.command,
        workingDirectory,
        exitCode: abortReason2 !== void 0 ? -1 : exitCode ?? -1,
        signal: abortReason2 !== void 0 ? "SIGTERM" : "",
        abortReason: abortReason2,
        stdout,
        stderr,
        executionTime,
        localExecutionTimeMs,
        sandboxPolicy: policy,
        outputLocation
      };
      const res = this.buildResultFromExit(baseResult);
      return res;
    } catch (error3) {
      clearTimeout(timer2);
      if (timeoutController.signal.aborted && !ctx.signal.aborted) {
        return new ShellResult({
          result: {
            case: "timeout",
            value: new ShellTimeout({
              command: args.command,
              workingDirectory,
              timeoutMs: timeout2
            })
          },
          sandboxPolicy: convertInternalToProtoPolicy(policy)
        });
      }
      if (ctx.signal.aborted) {
        return new ShellResult({
          result: {
            case: "rejected",
            value: new ShellRejected({
              command: args.command,
              workingDirectory,
              reason: "Command aborted"
            })
          },
          sandboxPolicy: convertInternalToProtoPolicy(policy)
        });
      }
      return new ShellResult({
        result: {
          case: "spawnError",
          value: new ShellSpawnError({
            command: args.command,
            workingDirectory,
            error: error3 instanceof Error ? error3.message : "Unknown error"
          })
        },
        sandboxPolicy: convertInternalToProtoPolicy(policy)
      });
    }
  }
  async execute(parentCtx, args) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource19(env_1, createSpan(parentCtx.withName("LocalShellExecutor.execute")), false);
      const ctx = span.ctx;
      reportEvent(ctx, "LocalShellExecutor.execute");
      const command = args.command;
      const policy = args.requestedSandboxPolicy ? convertProtoToInternalPolicy(args.requestedSandboxPolicy) : void 0;
      const workingDirectory = args.workingDirectory || await this.coreExecutor.getCwd(args.conversationId);
      const timeout2 = resolveShellTimeoutMs(args);
      const resolvedWorkingDir = resolvePath(workingDirectory);
      if (!args.parsingResult) {
        return new ShellResult({
          result: {
            case: "spawnError",
            value: new ShellSpawnError({
              command,
              workingDirectory: resolvedWorkingDir,
              error: "Parsing result is required"
            })
          }
        });
      }
      let effectivePolicy;
      if (!args.skipApproval) {
        const decision = await this.permissionsService.shouldBlockShellCommand(ctx, command, {
          workingDirectory: resolvedWorkingDir,
          timeout: timeout2,
          parsingResult: args.parsingResult,
          toolCallId: args.toolCallId,
          smartModeApprovalReason: args.smartModeApproval?.reason,
          smartModeApprovalRequestId: args.smartModeApproval?.requestId,
          hookApprovalRequirement: getShellHookApprovalRequirement(args)
        }, policy);
        if (decision.kind === "block") {
          return new ShellResult({
            result: shellCommandBlockResult(command, resolvedWorkingDir, decision.reason)
          });
        }
        effectivePolicy = decision.policy;
      } else {
        const invariantBlock = await this.permissionsService.shouldEnforceShellInvariantBlocks(ctx, {
          workingDirectory: resolvedWorkingDir,
          skipUnsafeWorkingDirectoryBlock: true,
          command,
          parsingResult: args.parsingResult,
          toolCallId: args.toolCallId
        }, policy);
        if (invariantBlock.kind === "block") {
          return new ShellResult({
            result: shellCommandBlockResult(command, resolvedWorkingDir, invariantBlock.reason)
          });
        }
        effectivePolicy = policy;
      }
      if (isForcedShellEgressEnabled()) {
        effectivePolicy = forcedShellSandboxPolicy(command, args.parsingResult);
      }
      if (effectivePolicy && effectivePolicy.type !== "insecure_none") {
        const ignoreMapping = await resolveShellSandboxIgnoreMapping(this.ignoreService);
        effectivePolicy = {
          ...effectivePolicy,
          ignoreMapping
        };
      }
      return this.executeWithPolicy(ctx, args, workingDirectory, timeout2, effectivePolicy);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources19(env_1);
    }
  }
};
