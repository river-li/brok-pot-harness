init_shell_exec_pb();
var __awaiter42 = function(thisArg, _arguments, P2, generator) {
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
var ShellStreamResultCollector = class {
  constructor() {
    this.output = "";
  }
  onEvent(event) {
    if (event.event.case === "stdout") {
      this.output += event.event.value.data;
    } else if (event.event.case === "stderr") {
      this.output += event.event.value.data;
    } else if (event.event.case === "exit") {
      this.exitEvent = event.event.value;
    }
  }
  getOutput() {
    return this.output;
  }
  isAborted() {
    var _a19;
    var _b2;
    return (_b2 = (_a19 = this.exitEvent) === null || _a19 === void 0 ? void 0 : _a19.aborted) !== null && _b2 !== void 0 ? _b2 : false;
  }
  getExitCode() {
    var _a19;
    var _b2;
    return (_b2 = (_a19 = this.exitEvent) === null || _a19 === void 0 ? void 0 : _a19.code) !== null && _b2 !== void 0 ? _b2 : 0;
  }
};
var shellStreamHooksConfig = {
  toolName: HooksToolName.Shell,
  // Shell stream generates its own UUID - doesn't use toolCallId from args
  createToolInput: (args) => {
    const cwd = args.workingDirectory || "";
    const timeout2 = args.timeout;
    return Object.assign({ command: args.command, cwd }, typeof timeout2 === "number" && timeout2 > 0 && { timeout: timeout2 });
  },
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.command === "string") {
      args.command = updatedInput.command;
    }
    if (typeof updatedInput.cwd === "string") {
      args.workingDirectory = updatedInput.cwd;
    }
    if (typeof updatedInput.timeout === "number" && updatedInput.timeout >= 0) {
      args.timeout = updatedInput.timeout;
    }
  },
  createRejectedEvent: (args, reason) => new ShellStream({
    event: {
      case: "rejected",
      value: new ShellRejected({
        command: args.command,
        workingDirectory: args.workingDirectory,
        reason
      })
    }
  }),
  createHookContextEvent: (contexts) => new ShellStream({
    event: {
      case: "hookContext",
      value: new ShellStreamHookContext({
        hookAdditionalContexts: [...contexts]
      })
    }
  }),
  getExtraHookFields: (args) => {
    const cwd = args.workingDirectory || "";
    return { cwd };
  },
  createResultCollector: () => new ShellStreamResultCollector(),
  createSuccessOutput: (_args, collector) => ({
    output: collector.getOutput(),
    exitCode: collector.getExitCode()
  }),
  isStreamSuccess: (collector) => collector.getExitCode() === 0,
  getStreamErrorMessage: (_args, collector) => {
    const output = collector.getOutput().trim();
    return output || `Command failed with exit code ${collector.getExitCode()}`;
  },
  /**
   * Run beforeShellExecution hook before execution.
   * Throws HookDeniedError if hook denies execution.
   */
  runPreExecutionHooks: (params) => __awaiter42(void 0, void 0, void 0, function* () {
    const { args, baseHookRequest, hookExecutor } = params;
    const cwd = args.workingDirectory || "";
    const sandbox = isSandboxed(args.requestedSandboxPolicy);
    setShellHookApprovalRequirement(args, yield runBeforeShellExecutionPermissionHook({
      hookExecutor,
      baseHookRequest,
      command: args.command,
      cwd,
      sandbox
    }));
  }),
  /**
   * Run afterShellExecution hook after streaming completes.
   */
  runPostExecutionHooks: (params) => __awaiter42(void 0, void 0, void 0, function* () {
    const { args, baseHookRequest, hookExecutor, collector, executionDurationMs } = params;
    const sandbox = isSandboxed(args.requestedSandboxPolicy);
    yield hookExecutor.executeHookForStep(HookStep.afterShellExecution, Object.assign(Object.assign({}, baseHookRequest), { command: args.command, output: collector.getOutput(), duration: executionDurationMs, sandbox }));
  })
};
