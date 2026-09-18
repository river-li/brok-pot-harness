init_shell_exec_pb();
function toRedactedShellCommandParsingResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    parsingFailed: msg.parsingFailed,
    executableCommands: msg.executableCommands.map((v2) => toRedactedShellCommandParsingResult_ExecutableCommand(v2, privacyMode)),
    hasRedirects: msg.hasRedirects,
    hasCommandSubstitution: msg.hasCommandSubstitution,
    allRedirectsAreDevNull: msg.allRedirectsAreDevNull,
    redirects: msg.redirects.map((v2) => toRedactedShellCommandParsingResult_Redirect(v2, privacyMode))
  };
}
function fromRedactedShellCommandParsingResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellCommandParsingResult({
    parsingFailed: msg.parsingFailed,
    executableCommands: msg.executableCommands.map((v2) => fromRedactedShellCommandParsingResult_ExecutableCommand(v2, purpose, opts)),
    hasRedirects: msg.hasRedirects,
    hasCommandSubstitution: msg.hasCommandSubstitution,
    allRedirectsAreDevNull: msg.allRedirectsAreDevNull,
    redirects: msg.redirects.map((v2) => fromRedactedShellCommandParsingResult_Redirect(v2, purpose, opts))
  });
}
function createRedactedShellCommandParsingResult(privacyMode, partial2) {
  return {
    parsingFailed: false,
    executableCommands: [],
    hasRedirects: false,
    hasCommandSubstitution: false,
    allRedirectsAreDevNull: void 0,
    redirects: [],
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedShellCommandParsingResult_ExecutableCommandArg(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    type: msg.type,
    value: createRedactedString(msg.value, DataClassification.CODE, "value", privacyMode)
  };
}
function fromRedactedShellCommandParsingResult_ExecutableCommandArg(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellCommandParsingResult_ExecutableCommandArg({
    type: msg.type,
    value: msg.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedShellCommandParsingResult_ExecutableCommand(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: createRedactedString(msg.name, DataClassification.CODE, "name", privacyMode),
    args: msg.args.map((v2) => toRedactedShellCommandParsingResult_ExecutableCommandArg(v2, privacyMode)),
    fullText: createRedactedString(msg.fullText, DataClassification.CODE, "full_text", privacyMode)
  };
}
function fromRedactedShellCommandParsingResult_ExecutableCommand(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellCommandParsingResult_ExecutableCommand({
    name: msg.name.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    args: msg.args.map((v2) => fromRedactedShellCommandParsingResult_ExecutableCommandArg(v2, purpose, opts)),
    fullText: msg.fullText.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedShellCommandParsingResult_Redirect(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    operator: msg.operator,
    destinationFds: msg.destinationFds,
    targetNodeType: msg.targetNodeType,
    targetText: msg.targetText !== void 0 ? createRedactedString(msg.targetText, DataClassification.PATH, "target_text", privacyMode) : void 0
  };
}
function fromRedactedShellCommandParsingResult_Redirect(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellCommandParsingResult_Redirect({
    operator: msg.operator,
    destinationFds: msg.destinationFds,
    targetNodeType: msg.targetNodeType,
    targetText: msg.targetText?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCommandClassifierResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    commands: msg.commands.map((v2) => toRedactedCommandClassifierResult_ClassifiedCommand(v2, privacyMode)),
    suggestedSandboxMode: msg.suggestedSandboxMode,
    classificationFailed: msg.classificationFailed
  };
}
function fromRedactedCommandClassifierResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommandClassifierResult({
    commands: msg.commands.map((v2) => fromRedactedCommandClassifierResult_ClassifiedCommand(v2, purpose, opts)),
    suggestedSandboxMode: msg.suggestedSandboxMode,
    classificationFailed: msg.classificationFailed
  });
}
function toRedactedCommandClassifierResult_ClassifiedCommand(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: createRedactedString(msg.name, DataClassification.CODE, "name", privacyMode),
    arguments: msg.arguments.map((v2) => createRedactedString(v2, DataClassification.CODE, "arguments", privacyMode)),
    suggestedAllowlistEntry: msg.suggestedAllowlistEntry !== void 0 ? createRedactedString(msg.suggestedAllowlistEntry, DataClassification.CODE, "suggested_allowlist_entry", privacyMode) : void 0,
    subcommandTokens: msg.subcommandTokens.map((v2) => createRedactedString(v2, DataClassification.CODE, "subcommand_tokens", privacyMode))
  };
}
function fromRedactedCommandClassifierResult_ClassifiedCommand(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommandClassifierResult_ClassifiedCommand({
    name: msg.name.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    arguments: msg.arguments.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    suggestedAllowlistEntry: msg.suggestedAllowlistEntry?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    subcommandTokens: msg.subcommandTokens.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }))
  });
}
function toRedactedShellOutputNotificationConfig(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pattern: createRedactedString(msg.pattern, DataClassification.CODE, "pattern", privacyMode),
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode),
    debounce: msg.debounce,
    notificationLimit: msg.notificationLimit
  };
}
function fromRedactedShellOutputNotificationConfig(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellOutputNotificationConfig({
    pattern: msg.pattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    debounce: msg.debounce,
    notificationLimit: msg.notificationLimit
  });
}
function toRedactedShellHookApprovalRequirement(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    kind: msg.kind,
    reason: msg.reason !== void 0 ? createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode) : void 0
  };
}
function fromRedactedShellHookApprovalRequirement(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellHookApprovalRequirement({
    kind: msg.kind,
    reason: msg.reason?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedShellArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    timeout: msg.timeout,
    toolCallId: msg.toolCallId,
    simpleCommands: msg.simpleCommands.map((v2) => createRedactedString(v2, DataClassification.CODE, "simple_commands", privacyMode)),
    hasInputRedirect: msg.hasInputRedirect,
    hasOutputRedirect: msg.hasOutputRedirect,
    parsingResult: msg.parsingResult !== void 0 ? toRedactedShellCommandParsingResult(msg.parsingResult, privacyMode) : void 0,
    requestedSandboxPolicy: msg.requestedSandboxPolicy !== void 0 ? toRedactedSandboxPolicy(msg.requestedSandboxPolicy, privacyMode) : void 0,
    fileOutputThresholdBytes: msg.fileOutputThresholdBytes,
    isBackground: msg.isBackground,
    skipApproval: msg.skipApproval,
    timeoutBehavior: msg.timeoutBehavior,
    hardTimeout: msg.hardTimeout,
    description: msg.description,
    classifierResult: msg.classifierResult !== void 0 ? toRedactedCommandClassifierResult(msg.classifierResult, privacyMode) : void 0,
    closeStdin: msg.closeStdin,
    outputNotification: msg.outputNotification !== void 0 ? toRedactedShellOutputNotificationConfig(msg.outputNotification, privacyMode) : void 0,
    smartModeApproval: msg.smartModeApproval !== void 0 ? toRedactedSmartModeApproval(msg.smartModeApproval, privacyMode) : void 0,
    hookApprovalRequirement: msg.hookApprovalRequirement !== void 0 ? toRedactedShellHookApprovalRequirement(msg.hookApprovalRequirement, privacyMode) : void 0,
    conversationId: msg.conversationId,
    adminCommandDenylist: msg.adminCommandDenylist.map((v2) => createRedactedString(v2, DataClassification.CODE, "admin_command_denylist", privacyMode)),
    requestId: msg.requestId,
    secretScopeId: msg.secretScopeId
  };
}
function fromRedactedShellArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellArgs({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    timeout: msg.timeout,
    toolCallId: msg.toolCallId,
    simpleCommands: msg.simpleCommands.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    hasInputRedirect: msg.hasInputRedirect,
    hasOutputRedirect: msg.hasOutputRedirect,
    parsingResult: msg.parsingResult !== void 0 ? fromRedactedShellCommandParsingResult(msg.parsingResult, purpose, opts) : void 0,
    requestedSandboxPolicy: msg.requestedSandboxPolicy !== void 0 ? fromRedactedSandboxPolicy(msg.requestedSandboxPolicy, purpose, opts) : void 0,
    fileOutputThresholdBytes: msg.fileOutputThresholdBytes,
    isBackground: msg.isBackground,
    skipApproval: msg.skipApproval,
    timeoutBehavior: msg.timeoutBehavior,
    hardTimeout: msg.hardTimeout,
    description: msg.description,
    classifierResult: msg.classifierResult !== void 0 ? fromRedactedCommandClassifierResult(msg.classifierResult, purpose, opts) : void 0,
    closeStdin: msg.closeStdin,
    outputNotification: msg.outputNotification !== void 0 ? fromRedactedShellOutputNotificationConfig(msg.outputNotification, purpose, opts) : void 0,
    smartModeApproval: msg.smartModeApproval !== void 0 ? fromRedactedSmartModeApproval(msg.smartModeApproval, purpose, opts) : void 0,
    hookApprovalRequirement: msg.hookApprovalRequirement !== void 0 ? fromRedactedShellHookApprovalRequirement(msg.hookApprovalRequirement, purpose, opts) : void 0,
    conversationId: msg.conversationId,
    adminCommandDenylist: msg.adminCommandDenylist.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    requestId: msg.requestId,
    secretScopeId: msg.secretScopeId
  });
}
function createRedactedShellArgs(privacyMode, partial2) {
  return {
    command: createRedactedString("", DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString("", DataClassification.PATH, "working_directory", privacyMode),
    timeout: 0,
    toolCallId: "",
    simpleCommands: [],
    hasInputRedirect: false,
    hasOutputRedirect: false,
    parsingResult: void 0,
    requestedSandboxPolicy: void 0,
    fileOutputThresholdBytes: void 0,
    isBackground: false,
    skipApproval: false,
    timeoutBehavior: 0,
    hardTimeout: void 0,
    description: void 0,
    classifierResult: void 0,
    closeStdin: false,
    outputNotification: void 0,
    smartModeApproval: void 0,
    hookApprovalRequirement: void 0,
    conversationId: void 0,
    adminCommandDenylist: [],
    requestId: void 0,
    secretScopeId: void 0,
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedShellResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? toRedactedSandboxPolicy(msg.sandboxPolicy, privacyMode) : void 0,
    isBackground: msg.isBackground,
    terminalsFolder: msg.terminalsFolder !== void 0 ? createRedactedString(msg.terminalsFolder, DataClassification.PATH, "terminals_folder", privacyMode) : void 0,
    pid: msg.pid,
    result: toRedactedShellResult_result(msg.result, privacyMode)
  };
}
function toRedactedShellResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedShellSuccess(oneof.value, privacyMode) };
    case "failure":
      return { case: "failure", value: toRedactedShellFailure(oneof.value, privacyMode) };
    case "timeout":
      return { case: "timeout", value: toRedactedShellTimeout(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedShellRejected(oneof.value, privacyMode) };
    case "spawnError":
      return { case: "spawnError", value: toRedactedShellSpawnError(oneof.value, privacyMode) };
    case "permissionDenied":
      return { case: "permissionDenied", value: toRedactedShellPermissionDenied(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedShellResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellResult({
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? fromRedactedSandboxPolicy(msg.sandboxPolicy, purpose, opts) : void 0,
    isBackground: msg.isBackground,
    terminalsFolder: msg.terminalsFolder?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    pid: msg.pid,
    result: fromRedactedShellResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedShellResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedShellSuccess(oneof.value, purpose, opts) };
    case "failure":
      return { case: "failure", value: fromRedactedShellFailure(oneof.value, purpose, opts) };
    case "timeout":
      return { case: "timeout", value: fromRedactedShellTimeout(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedShellRejected(oneof.value, purpose, opts) };
    case "spawnError":
      return { case: "spawnError", value: fromRedactedShellSpawnError(oneof.value, purpose, opts) };
    case "permissionDenied":
      return { case: "permissionDenied", value: fromRedactedShellPermissionDenied(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedShellStreamStdout(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    data: createRedactedString(msg.data, DataClassification.CODE, "data", privacyMode)
  };
}
function fromRedactedShellStreamStdout(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellStreamStdout({
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function createRedactedShellStreamStdout(privacyMode, partial2) {
  return {
    data: createRedactedString("", DataClassification.CODE, "data", privacyMode),
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedShellStreamStderr(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    data: createRedactedString(msg.data, DataClassification.CODE, "data", privacyMode)
  };
}
function fromRedactedShellStreamStderr(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellStreamStderr({
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function createRedactedShellStreamStderr(privacyMode, partial2) {
  return {
    data: createRedactedString("", DataClassification.CODE, "data", privacyMode),
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedShellStreamExit(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    code: msg.code,
    cwd: createRedactedString(msg.cwd, DataClassification.PATH, "cwd", privacyMode),
    outputLocation: msg.outputLocation !== void 0 ? toRedactedOutputLocation(msg.outputLocation, privacyMode) : void 0,
    aborted: msg.aborted,
    abortReason: msg.abortReason,
    localExecutionTimeMs: msg.localExecutionTimeMs
  };
}
function fromRedactedShellStreamExit(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellStreamExit({
    code: msg.code,
    cwd: msg.cwd.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputLocation: msg.outputLocation !== void 0 ? fromRedactedOutputLocation(msg.outputLocation, purpose, opts) : void 0,
    aborted: msg.aborted,
    abortReason: msg.abortReason,
    localExecutionTimeMs: msg.localExecutionTimeMs
  });
}
function createRedactedShellStreamExit(privacyMode, partial2) {
  return {
    code: 0,
    cwd: createRedactedString("", DataClassification.PATH, "cwd", privacyMode),
    outputLocation: void 0,
    aborted: false,
    abortReason: void 0,
    localExecutionTimeMs: void 0,
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedShellStreamStart(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? toRedactedSandboxPolicy(msg.sandboxPolicy, privacyMode) : void 0
  };
}
function fromRedactedShellStreamStart(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellStreamStart({
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? fromRedactedSandboxPolicy(msg.sandboxPolicy, purpose, opts) : void 0
  });
}
function createRedactedShellStreamStart(privacyMode, partial2) {
  return {
    sandboxPolicy: void 0,
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedShellStreamBackgrounded(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    shellId: msg.shellId,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    pid: msg.pid,
    msToWait: msg.msToWait,
    reason: msg.reason
  };
}
function toRedactedShellStreamHookContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => toRedactedHookAdditionalContext(v2, privacyMode))
  };
}
function toRedactedShellSandboxUnsupported(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    sandboxPolicyType: msg.sandboxPolicyType,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode),
    isReadonly: msg.isReadonly
  };
}
function toRedactedShellStream(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    event: toRedactedShellStream_event(msg.event, privacyMode)
  };
}
function toRedactedShellStream_event(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "stdout":
      return { case: "stdout", value: toRedactedShellStreamStdout(oneof.value, privacyMode) };
    case "stderr":
      return { case: "stderr", value: toRedactedShellStreamStderr(oneof.value, privacyMode) };
    case "exit":
      return { case: "exit", value: toRedactedShellStreamExit(oneof.value, privacyMode) };
    case "start":
      return { case: "start", value: toRedactedShellStreamStart(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedShellRejected(oneof.value, privacyMode) };
    case "permissionDenied":
      return { case: "permissionDenied", value: toRedactedShellPermissionDenied(oneof.value, privacyMode) };
    case "backgrounded":
      return { case: "backgrounded", value: toRedactedShellStreamBackgrounded(oneof.value, privacyMode) };
    case "hookContext":
      return { case: "hookContext", value: toRedactedShellStreamHookContext(oneof.value, privacyMode) };
    case "sandboxUnsupported":
      return { case: "sandboxUnsupported", value: toRedactedShellSandboxUnsupported(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedShellSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    exitCode: msg.exitCode,
    signal: msg.signal,
    stdout: createRedactedString(msg.stdout, DataClassification.CODE, "stdout", privacyMode),
    stderr: createRedactedString(msg.stderr, DataClassification.CODE, "stderr", privacyMode),
    executionTime: msg.executionTime,
    outputLocation: msg.outputLocation !== void 0 ? toRedactedOutputLocation(msg.outputLocation, privacyMode) : void 0,
    shellId: msg.shellId,
    interleavedOutput: msg.interleavedOutput !== void 0 ? createRedactedString(msg.interleavedOutput, DataClassification.CODE, "interleaved_output", privacyMode) : void 0,
    pid: msg.pid,
    msToWait: msg.msToWait,
    localExecutionTimeMs: msg.localExecutionTimeMs,
    backgroundReason: msg.backgroundReason,
    outputHead: msg.outputHead !== void 0 ? createRedactedString(msg.outputHead, DataClassification.CODE, "output_head", privacyMode) : void 0,
    outputTail: msg.outputTail !== void 0 ? createRedactedString(msg.outputTail, DataClassification.CODE, "output_tail", privacyMode) : void 0,
    elidedChars: msg.elidedChars
  };
}
function fromRedactedShellSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellSuccess({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    exitCode: msg.exitCode,
    signal: msg.signal,
    stdout: msg.stdout.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    stderr: msg.stderr.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    executionTime: msg.executionTime,
    outputLocation: msg.outputLocation !== void 0 ? fromRedactedOutputLocation(msg.outputLocation, purpose, opts) : void 0,
    shellId: msg.shellId,
    interleavedOutput: msg.interleavedOutput?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    pid: msg.pid,
    msToWait: msg.msToWait,
    localExecutionTimeMs: msg.localExecutionTimeMs,
    backgroundReason: msg.backgroundReason,
    outputHead: msg.outputHead?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputTail: msg.outputTail?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    elidedChars: msg.elidedChars
  });
}
function toRedactedShellFailure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    exitCode: msg.exitCode,
    signal: msg.signal,
    stdout: createRedactedString(msg.stdout, DataClassification.CODE, "stdout", privacyMode),
    stderr: createRedactedString(msg.stderr, DataClassification.CODE, "stderr", privacyMode),
    executionTime: msg.executionTime,
    outputLocation: msg.outputLocation !== void 0 ? toRedactedOutputLocation(msg.outputLocation, privacyMode) : void 0,
    interleavedOutput: msg.interleavedOutput !== void 0 ? createRedactedString(msg.interleavedOutput, DataClassification.CODE, "interleaved_output", privacyMode) : void 0,
    abortReason: msg.abortReason,
    aborted: msg.aborted,
    localExecutionTimeMs: msg.localExecutionTimeMs,
    outputHead: msg.outputHead !== void 0 ? createRedactedString(msg.outputHead, DataClassification.CODE, "output_head", privacyMode) : void 0,
    outputTail: msg.outputTail !== void 0 ? createRedactedString(msg.outputTail, DataClassification.CODE, "output_tail", privacyMode) : void 0,
    elidedChars: msg.elidedChars
  };
}
function fromRedactedShellFailure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellFailure({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    exitCode: msg.exitCode,
    signal: msg.signal,
    stdout: msg.stdout.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    stderr: msg.stderr.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    executionTime: msg.executionTime,
    outputLocation: msg.outputLocation !== void 0 ? fromRedactedOutputLocation(msg.outputLocation, purpose, opts) : void 0,
    interleavedOutput: msg.interleavedOutput?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    abortReason: msg.abortReason,
    aborted: msg.aborted,
    localExecutionTimeMs: msg.localExecutionTimeMs,
    outputHead: msg.outputHead?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputTail: msg.outputTail?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    elidedChars: msg.elidedChars
  });
}
function toRedactedShellTimeout(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    timeoutMs: msg.timeoutMs
  };
}
function fromRedactedShellTimeout(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellTimeout({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    timeoutMs: msg.timeoutMs
  });
}
function toRedactedShellRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode),
    isReadonly: msg.isReadonly
  };
}
function fromRedactedShellRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellRejected({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isReadonly: msg.isReadonly
  });
}
function toRedactedShellPermissionDenied(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode),
    isReadonly: msg.isReadonly
  };
}
function fromRedactedShellPermissionDenied(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellPermissionDenied({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isReadonly: msg.isReadonly
  });
}
function toRedactedShellSpawnError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    workingDirectory: createRedactedString(msg.workingDirectory, DataClassification.PATH, "working_directory", privacyMode),
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedShellSpawnError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellSpawnError({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    workingDirectory: msg.workingDirectory.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
