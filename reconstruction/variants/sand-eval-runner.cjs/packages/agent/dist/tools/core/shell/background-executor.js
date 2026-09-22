/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/background-executor.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();
init_background_shell_exec_pb();
init_shell_exec_pb();

// @recovered-fragment 2/2
var logger87 = createLogger("tools/shell/background-executor");
function createShellToolCall2(shellTool) {
  return new ToolCall({
    tool: {
      case: "shellToolCall",
      value: shellTool
    }
  });
}
async function executeBackgroundCommand(ctx, backgroundShellExecutor, interactionHandler, options2) {
  const backgroundArgs = new BackgroundShellSpawnArgs({
    command: options2.command,
    workingDirectory: options2.workingDirectory,
    toolCallId: options2.toolCallId,
    parsingResult: options2.analysis.structured,
    sandboxPolicy: options2.requestedSandboxPolicy,
    description: options2.description,
    classifierResult: options2.classifierResult,
    smartModeApproval: options2.smartModeApproval,
    skipApproval: options2.skipApproval ?? false,
    outputNotification: options2.outputNotification,
    conversationId: options2.conversationId,
    requestId: options2.requestId,
    secretScopeId: options2.secretScopeId,
    adminCommandDenylist: [...options2.adminCommandDenylist]
  });
  const args = new ShellArgs({
    command: options2.command,
    workingDirectory: options2.workingDirectory,
    timeout: void 0,
    toolCallId: options2.toolCallId,
    simpleCommands: options2.analysis.legacy.simpleCommands,
    hasInputRedirect: options2.analysis.legacy.hasInputRedirect,
    hasOutputRedirect: options2.analysis.legacy.hasOutputRedirect,
    parsingResult: options2.analysis.structured,
    isBackground: true,
    description: options2.description,
    outputNotification: options2.outputNotification,
    smartModeApproval: options2.smartModeApproval,
    skipApproval: options2.skipApproval ?? false,
    conversationId: options2.conversationId,
    requestId: options2.requestId,
    secretScopeId: options2.secretScopeId
  });
  const shellTool = new ShellToolCall({
    args,
    result: void 0,
    description: options2.description
  });
  await interactionHandler.emitPartialToolCall(ctx, options2.toolCallId, createShellToolCall2(new ShellToolCall({ args, result: void 0 })));
  let shellId;
  const startTime = performance.now();
  return await interactionHandler.executeToolCall(ctx, createShellToolCall2(shellTool), options2.toolCallId, async (ctx2) => {
    let completed = false;
    try {
      await options2.preflight?.(ctx2, { backgroundArgs, shellArgs: args });
      await options2.beforeExecute?.(ctx2);
      const execId = generateShellExecId(ctx2, options2.toolCallId);
      const execResult = await backgroundShellExecutor.execute(ctx2, backgroundArgs, {
        execId,
        hookContextCollector: options2.hookContextCollector,
        ...options2.machineId !== void 0 ? { machineId: options2.machineId } : {}
      });
      switch (execResult.result.case) {
        case "success": {
          await options2.onApproved?.(ctx2);
          completed = true;
          const { shellId: newShellId, command, pid } = execResult.result.value;
          shellId = newShellId;
          recordBackgroundShellStarted(ctx2, {
            shellId: newShellId,
            pid,
            conversationId: options2.conversationId,
            toolCallId: options2.toolCallId,
            hasOutputNotification: (options2.outputNotification?.pattern.trim().length ?? 0) > 0,
            source: "spawn"
          });
          return new ShellResult({
            result: {
              case: "success",
              value: new ShellSuccess({
                command,
                workingDirectory: options2.workingDirectory,
                shellId,
                pid,
                executionTime: Math.round(performance.now() - startTime),
                backgroundReason: ShellBackgroundReason.USER_REQUEST
              })
            },
            isBackground: true,
            terminalsFolder: options2.terminalsFolder
          });
        }
        case "error": {
          const { error: error3 } = execResult.result.value;
          throw new Error(error3);
        }
        case "rejected": {
          const { reason } = execResult.result.value;
          throw new ShellRejectedError(options2.command, options2.workingDirectory, reason);
        }
        case "permissionDenied": {
          const { error: error3, isReadonly } = execResult.result.value;
          throw new ShellPermissionDeniedError(options2.command, options2.workingDirectory, error3, isReadonly);
        }
        case "sandboxUnsupported": {
          const { sandboxPolicyType, reason, isReadonly } = execResult.result.value;
          throw new ShellSandboxUnsupportedError(options2.command, options2.workingDirectory, sandboxPolicyType, reason, isReadonly);
        }
        case void 0:
          throw new Error("Unknown error starting background command");
        default: {
          const _exhaustiveCheck = execResult.result;
          throw new Error(`Unhandled background result case: ${_exhaustiveCheck}`);
        }
      }
    } finally {
      if (!completed) {
        try {
          await options2.onRejected?.(ctx2);
        } catch (error3) {
          logger87.warn(ctx2, "Failed to clean up rejected background shell approval", {
            error: error3
          });
        }
      }
    }
  }, (r) => createShellToolCall2(new ShellToolCall({ ...shellTool, result: r })), options2.hookContextCollector);
}

