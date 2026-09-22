/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/formatters.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_sandbox_pb();
init_shell_exec_pb();

// @recovered-fragment 2/2
var SHELL_CHAR_HARD_LIMIT = 2e4;
var SHELL_MISSING_EXIT_ERROR_MESSAGE = "The shell command returned no exit status, so its result is unknown \u2014 do not assume it ran or succeeded. If this repeats, the execution environment may need to be restarted.";
function formatCompletionMessage(isAborted2, executionTimeMs) {
  if (isAborted2) {
    return executionTimeMs !== void 0 ? `Command aborted after ${executionTimeMs} ms.` : "Command aborted.";
  }
  return executionTimeMs !== void 0 ? `Command completed in ${executionTimeMs} ms.` : "Command completed.";
}
function formatShellStateMessage(signal, workingDirectory) {
  if (signal === "SIGTERM") {
    return `The previous shell command aborted, so on the next invocation of this tool, a new shell will be started at the project root.`;
  }
  let msg = `Shell state (cwd, env vars) persists for subsequent calls.`;
  if (workingDirectory?.trim()) {
    msg += ` Current directory: ${workingDirectory}`;
  }
  return msg;
}
function formatShellResultMinimal(result) {
  if (result.outputLocation) {
    const totalSize = Number(result.outputLocation.sizeBytes);
    const lineCount = Number(result.outputLocation.lineCount);
    const sizeStr = totalSize >= 1024 ? `${(totalSize / 1024).toFixed(1)} KB` : `${totalSize} bytes`;
    let formatted2 = `Exit code: ${result.exitCode}
`;
    if (result.executionTimeMs !== void 0) {
      formatted2 += `Runtime: ${result.executionTimeMs} ms
`;
    }
    formatted2 += `Output written to: ${result.outputLocation.filePath} (${sizeStr}, ${lineCount} lines)`;
    return formatted2;
  }
  const combinedResult = truncateOutput(result.combinedOutput, SHELL_CHAR_HARD_LIMIT, true);
  let formatted = `Exit code: ${result.exitCode}
`;
  if (result.executionTimeMs !== void 0) {
    formatted += `Runtime: ${result.executionTimeMs} ms
`;
  }
  formatted += `Output:
${combinedResult.output}`;
  return formatted;
}
function formatShellResult(result) {
  if (result.useMinimalHarness) {
    return formatShellResultMinimal(result);
  }
  if (result.outputLocation) {
    const totalSize = Number(result.outputLocation.sizeBytes);
    const lineCount = Number(result.outputLocation.lineCount);
    const sizeStr = totalSize >= 1024 ? `${(totalSize / 1024).toFixed(1)} KB` : `${totalSize} bytes`;
    const isAborted3 = result.signal === "SIGTERM";
    let resultString = `Exit code: ${result.exitCode}

`;
    resultString += `Command output has been written to: ${result.outputLocation.filePath} (${sizeStr}, ${lineCount} lines)

`;
    resultString += `${formatCompletionMessage(isAborted3, result.executionTimeMs)}

`;
    resultString += formatShellStateMessage(result.signal, result.workingDirectory);
    resultString += formatSandboxingReminder(result.exitCode, result.combinedOutput, result.sandboxPolicy, result.command);
    return resultString;
  }
  const combinedResult = truncateOutput(result.combinedOutput, SHELL_CHAR_HARD_LIMIT, true);
  const isTruncated = combinedResult.truncated;
  const isAborted2 = result.signal === "SIGTERM";
  let formatted = `Exit code: ${result.exitCode}

`;
  formatted += `Command output${isTruncated ? ` (truncated to ${SHELL_CHAR_HARD_LIMIT} characters)` : ""}:

`;
  formatted += `\`\`\`
${combinedResult.output}
\`\`\`

`;
  formatted += `${formatCompletionMessage(isAborted2, result.executionTimeMs)}

`;
  formatted += formatShellStateMessage(result.signal, result.workingDirectory);
  formatted += formatSandboxingReminder(result.exitCode, result.combinedOutput, result.sandboxPolicy, result.command);
  return formatted;
}
function formatSandboxingReminder(exitCode, output, sandboxPolicy, command) {
  if (!sandboxPolicy) {
    return "";
  }
  if (sandboxPolicy.type === SandboxPolicy_Type.INSECURE_NONE) {
    if (sandboxPolicy.allowlistEscalated) {
      return "\n\nThis command ran outside the sandbox (no restrictions) because it matched the user's command allowlist.";
    }
    return "";
  }
  const isReadonly = sandboxPolicy.type === SandboxPolicy_Type.WORKSPACE_READONLY;
  const hasWorkspaceReadBoundary = sandboxPolicy.readBoundary === SandboxPolicy_ReadBoundaryMode.WORKSPACE;
  const hasNetworkAllowlist2 = sandboxPolicy.networkAccess === true && sandboxPolicy.networkPolicy?.allow !== void 0 && sandboxPolicy.networkPolicy.allow.length > 0;
  let resultString = "";
  resultString += `

SANDBOXING: This command ran in a sandbox with the following restrictions:`;
  if (isReadonly) {
    resultString += hasWorkspaceReadBoundary ? `
- Filesystem: Read-only access limited to the workspace directory and explicitly allowed paths` : `
- Filesystem: Read-only access to the filesystem (no file modifications allowed)`;
  } else if (sandboxPolicy.type === SandboxPolicy_Type.WORKSPACE_READWRITE) {
    resultString += hasWorkspaceReadBoundary ? `
- Filesystem: Read access limited to the workspace directory and explicitly allowed paths; write access limited to permitted writable paths` : `
- Filesystem: Write access limited to the workspace directory, read access to the rest of the filesystem`;
  }
  if (sandboxPolicy.networkAccess !== void 0) {
    if (sandboxPolicy.networkAccess) {
      if (hasNetworkAllowlist2) {
        resultString += `
- Network access: Limited (allowlist only)`;
      } else {
        resultString += `
- Network access: Allowed (unrestricted)`;
      }
    } else {
      resultString += `
- Network access: Blocked`;
    }
  }
  const hasNetworkRestriction = sandboxPolicy.networkAccess !== true || hasNetworkAllowlist2;
  const commandFailed = exitCode !== 0;
  let failureKind;
  if (commandFailed) {
    failureKind = analyzeFailure(exitCode, output, command);
  }
  if (commandFailed && failureKind === "sandbox" && !isReadonly) {
    resultString += `

The command likely failed due to sandbox restrictions (permission denied or access error). You should re-run with required_permissions: ["all"] to run outside the sandbox entirely. Don't needlessly ask for permission.`;
  } else if (commandFailed && failureKind === "network") {
    resultString += `

The command likely failed due to network restrictions. You should re-run with required_permissions: ["full_network"] to enable network access. Don't needlessly ask for permission.`;
  } else if (!isReadonly) {
    const missingPerms = [];
    if (hasNetworkRestriction)
      missingPerms.push('"full_network"');
    if (missingPerms.length > 0) {
      const example = `[${missingPerms[0]}]`;
      resultString += `
If you think the command failed due to sandbox restrictions, re-run with the required_permissions that you need (such as ${example}) or use required_permissions: ["all"] to run outside the sandbox entirely. Don't needlessly ask for permission.`;
    } else {
      resultString += `
If you think the command failed due to sandbox restrictions, re-run with required_permissions: ["all"] to run outside the sandbox entirely. Don't needlessly ask for permission.`;
    }
  }
  return resultString;
}
function formatTimeoutResult(partialOutput, command) {
  const truncatedOutput = truncateOutput(partialOutput, SHELL_CHAR_HARD_LIMIT, true);
  const isTruncated = truncatedOutput.truncated;
  let formatted = `Command timed out.

`;
  if (partialOutput.length > 0) {
    formatted += `Partial output before timeout${isTruncated ? ` (truncated to ${SHELL_CHAR_HARD_LIMIT} characters)` : ""}:

`;
    formatted += `\`\`\`
${truncatedOutput.output}
\`\`\`

`;
  }
  formatted += `The command "${command}" did not complete within the timeout period. The shell has been terminated.

`;
  formatted += `On the next invocation of this tool, a new shell will be started at the project root.`;
  return formatted;
}
function formatShellPartialOutputSection(partialOutput, options2) {
  if (partialOutput.length === 0) {
    return options2.emptyMessage ?? "";
  }
  const truncatedOutput = truncateOutput(partialOutput, SHELL_CHAR_HARD_LIMIT, true);
  const isTruncated = truncatedOutput.truncated;
  return `${options2.heading}${isTruncated ? options2.truncatedSuffix ?? " (truncated)" : ""}:

\`\`\`
${truncatedOutput.output}
\`\`\``;
}
function formatShellMissingExitDisplay(interleavedOutput) {
  const partialSection = formatShellPartialOutputSection(interleavedOutput, {
    heading: "Output collected before the stream closed",
    truncatedSuffix: ` (truncated to ${SHELL_CHAR_HARD_LIMIT} characters)`
  });
  if (partialSection.length === 0) {
    return SHELL_MISSING_EXIT_ERROR_MESSAGE;
  }
  return `${SHELL_MISSING_EXIT_ERROR_MESSAGE}

${partialSection}`;
}
function formatUserManuallyBackgroundedToolMessage(toolNoun, elapsedMs3, options2) {
  const elapsedText = elapsedMs3 !== void 0 ? ` after ${elapsedMs3}ms` : "";
  const awaitGuidance = options2?.discourageAwait === true ? " Do NOT await it; either continue with other work or end your turn." : "";
  return `The user manually backgrounded the ${toolNoun}${elapsedText}.${awaitGuidance}`;
}
function formatAutoBackgroundedForInterruptionToolMessage(toolNoun, elapsedMs3) {
  const elapsedText = elapsedMs3 !== void 0 ? ` after ${elapsedMs3}ms` : "";
  return `The ${toolNoun} was automatically backgrounded${elapsedText} because the user interrupted the chat. Consider killing the shell command if it should no longer run after the user's interruption.`;
}
function formatBackgroundedResult(partialOutput, shellId, outputPath, pid, msToWait, backgroundReason, options2) {
  if (msToWait !== void 0) {
    const intro = backgroundReason === ShellBackgroundReason.USER_REQUEST ? `${options2?.autoBackgroundedForInterruption === true ? formatAutoBackgroundedForInterruptionToolMessage("command", msToWait) : formatUserManuallyBackgroundedToolMessage("command", msToWait, options2)}
` : `The command did not complete in ${msToWait}ms and was sent to the background.
`;
    let formatted2 = intro;
    formatted2 += `Shell ID: ${shellId}
`;
    if (pid !== void 0 && pid !== 0) {
      formatted2 += `PID: ${pid}
`;
    }
    formatted2 += `The output is being written to ${outputPath}. Don't mention Shell ID to the user.

`;
    formatted2 += formatShellPartialOutputSection(partialOutput, {
      heading: "Output collected before backgrounding",
      truncatedSuffix: " (truncated)",
      emptyMessage: "No output was collected before backgrounding."
    });
    return formatted2;
  }
  let formatted = `Command exceeded block_until_ms and was moved to background.

`;
  const partialOutputSection = formatShellPartialOutputSection(partialOutput, {
    heading: "Output before backgrounding",
    truncatedSuffix: ` (truncated to ${SHELL_CHAR_HARD_LIMIT} characters)`,
    emptyMessage: "No output before backgrounding."
  });
  if (partialOutputSection.length > 0) {
    formatted += `${partialOutputSection}

`;
  }
  formatted += `Shell ID: ${shellId}
`;
  if (pid !== void 0 && pid !== 0) {
    formatted += `PID: ${pid}
`;
  }
  formatted += `Output will continue to be written to ${outputPath}. Don't mention Shell ID to the user.`;
  return formatted;
}
function formatExecutionTimeoutResult(timeout2) {
  const message = buildToolCallExecutionTimedOutMessage({
    toolName: "shell",
    executionTimeoutMs: timeout2.timeoutMs
  });
  return timeout2.command.length > 0 ? `${message}

Command: ${timeout2.command}` : message;
}
function renderShellResultToString(shellResult, options2 = {}) {
  const { result, sandboxPolicy, isBackground, terminalsFolder } = shellResult;
  if (isBackground) {
    switch (result.case) {
      case "success": {
        const { shellId, pid } = result.value;
        const outputPath = terminalsFolder ? `${terminalsFolder}/${shellId}.txt` : `<terminals_folder>/${shellId}.txt`;
        let message = `Background command started successfully.
Shell ID: ${shellId}
`;
        if (pid !== void 0 && pid !== 0) {
          message += `PID: ${pid}
`;
        }
        message += `Command: ${result.value.command}
Output will be written to ${outputPath}. Don't mention Shell ID to the user.`;
        return message;
      }
      case "failure":
        return result.value.stderr || result.value.stdout;
      case "rejected":
        return "Background command rejected by user";
      case "permissionDenied":
        return result.value.isReadonly ? ASK_MODE_MODEL_ERROR : `Permission denied: ${result.value.error}`;
      case "timeout":
        return formatExecutionTimeoutResult(result.value);
      case "spawnError":
        if (result.value.error.startsWith(SHELL_MISSING_EXIT_ERROR_MESSAGE)) {
          return result.value.error;
        }
        return result.value.command.length > 0 ? `Error: Command failed to spawn: ${result.value.error}

Command: ${result.value.command}` : `Error: Command failed to spawn: ${result.value.error}`;
      case void 0:
        return "Unknown error";
      default: {
        const _exhaustiveCheck = result;
        throw new Error(`Unhandled result case: ${_exhaustiveCheck}`);
      }
    }
  }
  switch (result.case) {
    case "success":
    case "failure": {
      const shellId = result.case === "success" ? result.value.shellId : void 0;
      const pid = result.case === "success" ? result.value.pid : void 0;
      const msToWait = result.case === "success" ? result.value.msToWait : void 0;
      const backgroundReason = result.case === "success" ? result.value.backgroundReason : void 0;
      const { interleavedOutput } = result.value;
      if (shellId !== void 0 && shellId !== 0) {
        const outputPath = terminalsFolder ? `${terminalsFolder}/${shellId}.txt` : `<terminals_folder>/${shellId}.txt`;
        return formatBackgroundedResult(interleavedOutput ?? "", shellId, outputPath, pid, msToWait, backgroundReason, {
          discourageAwait: options2.discourageAwait,
          autoBackgroundedForInterruption: options2.autoBackgroundedForInterruption
        });
      }
      const abortReason2 = result.case === "failure" ? result.value.abortReason : void 0;
      const aborted2 = result.case === "failure" && result.value.aborted;
      const wasTimeout = abortReason2 === ShellAbortReason.TIMEOUT;
      const wasAborted = abortReason2 === ShellAbortReason.USER_ABORT || aborted2 && abortReason2 === void 0;
      if (wasTimeout) {
        return formatTimeoutResult(interleavedOutput ?? "", result.value.command);
      }
      const formatted = options2.promptVersion === "dsv3-1018" ? formatShellResultDsv3({
        combinedOutput: interleavedOutput ?? "",
        exitCode: result.value.exitCode,
        command: result.value.command,
        workingDirectory: result.value.workingDirectory,
        signal: result.value.signal,
        sandboxPolicy
      }, result.value.command, {
        includeSandboxReminder: options2.sandboxPromptEnabled
      }) : formatShellResult({
        combinedOutput: interleavedOutput ?? "",
        exitCode: result.value.exitCode,
        outputLocation: result.value.outputLocation,
        sandboxPolicy,
        command: result.value.command,
        signal: result.value.signal,
        workingDirectory: result.value.workingDirectory,
        // Prefer exec-layer timing: `executionTime` is this request's wall clock and shrinks on replay
        // (e.g. same exec_id for idempotent replay).
        executionTimeMs: result.value.localExecutionTimeMs != null ? result.value.localExecutionTimeMs : result.value.executionTime,
        useMinimalHarness: options2.useMinimalHarness
      });
      return wasAborted ? `Command was aborted by the user.
${formatted}` : formatted;
    }
    case "timeout":
      return formatExecutionTimeoutResult(result.value);
    case "spawnError":
      if (result.value.error.startsWith(SHELL_MISSING_EXIT_ERROR_MESSAGE)) {
        return result.value.error;
      }
      return result.value.command.length > 0 ? `Error: Command failed to spawn: ${result.value.error}

Command: ${result.value.command}` : `Error: Command failed to spawn: ${result.value.error}`;
    case "rejected":
      return `Rejected: ${result.value.reason}`;
    case "permissionDenied":
      return result.value.isReadonly ? ASK_MODE_MODEL_ERROR : `Permission denied: ${result.value.error}`;
    case void 0:
      return "Unknown error";
    default: {
      const _exhaustiveCheck = result;
      throw new Error(`Unhandled result case: ${_exhaustiveCheck}`);
    }
  }
}
function formatShellResultDsv3(result, originalCommand, options2) {
  const executedCommand = result.command ?? originalCommand;
  const currentWorkingDirectory = result.workingDirectory;
  const outputWithCommand = `${executedCommand}
${result.combinedOutput.replace(/\n+$/, "")}`;
  const isTruncated = outputWithCommand.length > SHELL_CHAR_HARD_LIMIT;
  const displayedOutput = isTruncated ? outputWithCommand.slice(0, SHELL_CHAR_HARD_LIMIT) : outputWithCommand;
  let formatted = `Exit code: ${result.exitCode}

`;
  formatted += `Command output${isTruncated ? ` (truncated to ${SHELL_CHAR_HARD_LIMIT} characters)` : ""}:

`;
  formatted += `\`\`\`
${displayedOutput}
\`\`\`

`;
  formatted += `Command ${result.signal === "SIGTERM" ? "aborted" : "completed"}.

`;
  if (result.signal === "SIGTERM") {
    formatted += `The previous shell command aborted, so on the next invocation of this tool, a new shell will be started at the project root.`;
  } else {
    formatted += `The previous shell command ended, so on the next invocation of this tool, you will be reusing the shell.`;
    formatted += currentWorkingDirectory?.trim() ? `

On the next terminal tool call, the directory of the shell will already be ${currentWorkingDirectory}.` : "";
  }
  if (options2?.includeSandboxReminder) {
    formatted += formatSandboxingReminder(result.exitCode, result.combinedOutput, result.sandboxPolicy, result.command);
  }
  return formatted;
}

