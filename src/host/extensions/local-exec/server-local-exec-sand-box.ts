init_scheduling();
init_exec_pb();
init_grok_bot_pb();
init_utils_pb();
init_esm2();
init_local_exec_failure_classifier();
init_unknown_record();
var SERVER_USER_COMPUTER_PRESENCE_TTL_MS = 1e4;
var SERVER_USER_COMPUTER_UNAVAILABLE_SUPPRESS_MS = 6e4;
var SERVER_USER_COMPUTER_PRESENCE_POLL_MS = 15e3;
var SERVER_USER_COMPUTER_PRESENCE_TIMEOUT_MS = 1e4;
var FALLBACK_TERMINALS_FOLDER2 = "terminals";
function presenceOf(proto) {
  return {
    machineId: proto.machineId,
    label: proto.hello?.label ?? "",
    terminalsFolder: proto.hello?.terminalsFolder ?? "",
    messagesOp: proto.hello?.capabilities?.messagesOp === true
  };
}
var ServerUserComputerPresenceCache = class {
  constructor(client, clock, refreshDeadline, onRefreshFailure) {
    this.client = client;
    this.clock = clock;
    this.refreshDeadline = refreshDeadline;
    this.onRefreshFailure = onRefreshFailure;
  }
  client;
  clock;
  refreshDeadline;
  onRefreshFailure;
  computers = [];
  fetchedAt = Number.NEGATIVE_INFINITY;
  inflight;
  generation = 0;
  consecutiveFailures = 0;
  suppressedUntil = /* @__PURE__ */ new Map();
  current() {
    return this.computers;
  }
  async refresh() {
    if (this.clock.now() - this.fetchedAt < SERVER_USER_COMPUTER_PRESENCE_TTL_MS) {
      return this.computers;
    }
    if (this.inflight !== void 0) return this.inflight;
    const generation = ++this.generation;
    const inflight = this.refreshDeadline.run((signal) => this.client.listGrokBotUserComputers({}, { signal })).then(
      (response) => {
        if (generation !== this.generation) return this.computers;
        this.consecutiveFailures = 0;
        const now = this.clock.now();
        this.computers = response.computers.map(presenceOf).filter((computer) => (this.suppressedUntil.get(computer.machineId) ?? 0) <= now);
        this.fetchedAt = this.computers.length === 0 ? Number.NEGATIVE_INFINITY : this.clock.now();
        return this.computers;
      },
      (error42) => {
        this.onRefreshFailure(error42);
        if (generation !== this.generation) return this.computers;
        this.consecutiveFailures += 1;
        if (this.consecutiveFailures > 1) this.computers = [];
        this.fetchedAt = this.clock.now();
        return this.computers;
      }
    ).finally(() => {
      if (this.inflight === inflight) this.inflight = void 0;
    });
    this.inflight = inflight;
    return inflight;
  }
  invalidate(machineId) {
    if (machineId !== void 0) {
      this.suppressedUntil.set(
        machineId,
        this.clock.now() + SERVER_USER_COMPUTER_UNAVAILABLE_SUPPRESS_MS
      );
    }
    this.generation += 1;
    this.inflight = void 0;
    this.consecutiveFailures = 0;
    this.computers = machineId === void 0 ? [] : this.computers.filter((computer) => computer.machineId !== machineId);
    this.fetchedAt = Number.NEGATIVE_INFINITY;
  }
};
function boundedCwdState2(value) {
  return LOCAL_EXEC_CWD_STATES.find((state) => state === value);
}
async function resolvePresence(deps, machineId) {
  const computers = await deps.presence.refresh();
  const match2 = machineId === void 0 ? computers[0] : computers.find((computer) => computer.machineId === machineId);
  if (match2 === void 0) throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
  return match2;
}
async function resolveMessagesPresence(deps, machineId) {
  const computers = await deps.presence.refresh();
  const match2 = machineId === void 0 ? computers.find((computer) => computer.messagesOp) ?? computers[0] : computers.find((computer) => computer.machineId === machineId);
  if (match2 === void 0) {
    throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
  }
  if (!match2.messagesOp) {
    throw new SandLocalExecError(sandMessagesUnsupportedMessage(match2.label));
  }
  return match2;
}
function isTerminalResponse(frame) {
  switch (frame.frame.case) {
    case "file":
      return frame.frame.value.last;
    case "fileError":
    case "messagesResult":
    case "messagesError":
    case "messagesConsentResult":
      return true;
    case "control": {
      const control = ExecClientControlMessage.fromJsonString(frame.frame.value.messageJson, {
        ignoreUnknownFields: true
      });
      return control.message.case === "throw" || control.message.case === "streamClose";
    }
    case "client":
    case "messagesAccepted":
    case void 0:
      return false;
  }
}
async function* openWithWatchdog(deps, ctx, machine, frame, watchdogPolicy = deps.responseWatchdog) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (ctx.signal.aborted) onAbort();
  else ctx.signal.addEventListener("abort", onAbort, { once: true });
  let timedOut = false;
  let watchdog;
  let terminalResponse;
  const kick = () => {
    if (watchdog === void 0) {
      watchdog = watchdogPolicy.arm(() => {
        timedOut = true;
        controller.abort();
      });
      return;
    }
    watchdog.kick();
  };
  try {
    kick();
    const stream3 = deps.client.openGrokBotUserComputerRequest(
      { machineId: machine.machineId, frame },
      { signal: controller.signal }
    );
    for await (const response of stream3) {
      kick();
      if (terminalResponse !== void 0) continue;
      if (isTerminalResponse(response)) {
        terminalResponse = response;
        continue;
      }
      yield response;
    }
    if (timedOut) throw unavailable(machine);
    if (terminalResponse !== void 0) yield terminalResponse;
  } catch (error42) {
    if (timedOut) throw unavailable(machine);
    const refusal = serverRefusalDetail(error42);
    if (refusal !== void 0) {
      throw new SandLocalExecError(refusal, { cause: error42 });
    }
    if (error42 instanceof ConnectError && error42.code === Code.Unavailable) {
      throw unavailable(machine);
    }
    throw error42;
  } finally {
    watchdog?.dispose();
    ctx.signal.removeEventListener("abort", onAbort);
    controller.abort();
  }
}
function serverRefusalDetail(error42) {
  if (!(error42 instanceof ConnectError)) return void 0;
  if (error42.code !== Code.Unavailable && error42.code !== Code.InvalidArgument) return void 0;
  const detail = error42.findDetails(ErrorDetails).at(0)?.details?.detail;
  if (detail === void 0 || detail.length === 0) return void 0;
  return detail;
}
function unavailable(machine) {
  return new SandLocalExecError(sandComputerTemporarilyUnreachableMessage(machine.label));
}
var ServerUserComputerExecManager = class {
  constructor(deps, machineId, getTerminalsFolder) {
    this.deps = deps;
    this.machineId = machineId;
    this.getTerminalsFolder = getTerminalsFolder;
  }
  deps;
  machineId;
  getTerminalsFolder;
  nextId = 0;
  async *createExecInstance(ctx, argsSerializer) {
    const serverMessage = argsSerializer(this.nextId++);
    const scope = ctx.get(sandLocalToolScopeKey);
    const requestedMachineId = serverMessage.machineId ?? this.machineId;
    if (requestedMachineId !== void 0) {
      const blocked = this.deps.gate.blockedReason(requestedMachineId);
      if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
    }
    const machine = await resolvePresence(this.deps, requestedMachineId);
    if (requestedMachineId === void 0) {
      const blocked = this.deps.gate.blockedReason(machine.machineId);
      if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
    }
    const described = describeLocalExec(serverMessage, this.getTerminalsFolder());
    if (described === void 0 && this.deps.gate.requiresApproval(machine.machineId)) {
      throw new SandLocalToolPermissionDeniedError(SAND_LOCAL_TOOLS_UNDESCRIBABLE_MESSAGE);
    }
    const approvalId = described === void 0 ? void 0 : await authorizeLocalToolAction(this.deps.gate, scope, {
      ...described,
      machineId: machine.machineId,
      signal: ctx.signal
    });
    const frame = new GrokBotUserComputerRequestFrame({
      frame: {
        case: "exec",
        value: { serverMessageJson: serverMessage.toJsonString(), approvalId }
      }
    });
    for await (const response of openWithWatchdog(this.deps, ctx, machine, frame)) {
      switch (response.frame.case) {
        case "client":
          yield ExecClientMessage.fromJsonString(response.frame.value.messageJson, {
            ignoreUnknownFields: true
          });
          break;
        case "control": {
          const control = ExecClientControlMessage.fromJsonString(
            response.frame.value.messageJson,
            { ignoreUnknownFields: true }
          );
          if (control.message.case === "throw") {
            const thrown = control.message.value;
            const cwdState = boundedCwdState2(response.frame.value.cwdState);
            this.deps.reportFailure?.({
              ...classifyLocalExecFailure(thrown.error),
              site: "exec",
              ...cwdState !== void 0 ? { cwdState } : {},
              ...scope?.agentId !== void 0 ? { conversationId: scope.agentId } : {}
            });
            const error42 = new Error(thrown.error);
            if (thrown.stackTrace !== void 0 && thrown.stackTrace.length > 0) {
              error42.stack = thrown.stackTrace;
            }
            throw error42;
          }
          if (control.message.case === "streamClose") return;
          break;
        }
        case "file":
        case "fileError":
        case void 0:
          break;
      }
    }
  }
};
var ServerUserComputerSandBox = class {
  deps;
  machineId;
  constructor(options2) {
    this.machineId = options2.machineId;
    this.deps = {
      client: options2.client,
      presence: options2.presence,
      gate: options2.gate,
      reportFailure: options2.reportFailure,
      responseWatchdog: options2.responseWatchdog ?? createIdleWatchdogPolicy({
        name: "sand-server-user-computer-response",
        idleMs: SAND_LOCAL_EXEC_RESPONSE_TIMEOUT_MS
      }),
      transferWatchdog: options2.transferWatchdog ?? createIdleWatchdogPolicy({
        name: "sand-server-user-computer-transfer",
        idleMs: SAND_LOCAL_EXEC_DATA_POST_TIMEOUT_MS
      })
    };
  }
  presentMachine() {
    const computers = this.deps.presence.current();
    return this.machineId === void 0 ? computers[0] : computers.find((computer) => computer.machineId === this.machineId);
  }
  terminalsFolder() {
    const folder = this.presentMachine()?.terminalsFolder;
    return folder === void 0 || folder.length === 0 ? FALLBACK_TERMINALS_FOLDER2 : folder;
  }
  async ensureReady(_ctx, _agentId) {
    await this.deps.presence.refresh();
    const terminalsFolder = () => this.terminalsFolder();
    return {
      remoteAccessor: new RemoteResourceAccessor(
        new ServerUserComputerExecManager(this.deps, this.machineId, terminalsFolder)
      ),
      vncUrl: "",
      get terminalsFolder() {
        return terminalsFolder();
      }
    };
  }
  async hibernate(_ctx, _agentId) {
  }
  async runState(_ctx, _agentId) {
    await this.deps.presence.refresh();
    return this.presentMachine() === void 0 ? "absent" : "running";
  }
  async listBoxes() {
    return [];
  }
  async transfer(ctx, action, boxPath, buildFrame) {
    const machine = await resolvePresence(this.deps, this.machineId);
    const blocked = this.deps.gate.blockedReason(machine.machineId);
    if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
    const approvalId = await authorizeLocalToolAction(
      this.deps.gate,
      ctx.get(sandLocalToolScopeKey),
      {
        action,
        target: boxPath,
        machineId: machine.machineId,
        signal: ctx.signal
      }
    );
    const frame = buildFrame(approvalId);
    const chunks = [];
    let total = 0;
    for await (const response of openWithWatchdog(
      this.deps,
      ctx,
      machine,
      frame,
      this.deps.transferWatchdog
    )) {
      if (response.frame.case === "fileError") {
        throw new SandLocalExecError(response.frame.value.error);
      }
      if (response.frame.case !== "file") continue;
      const data = response.frame.value.data;
      total += data.length;
      if (total > DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES) {
        throw new SandLocalExecError(
          localExecFileTooLargeMessage(total, DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES)
        );
      }
      chunks.push(data);
      if (response.frame.value.last) return concat(chunks, total);
    }
    throw unavailable(machine);
  }
  async uploadFile(ctx, _agentId, boxPath, data) {
    if (data.length > DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES) {
      throw new SandLocalExecError(
        localExecFileTooLargeMessage(data.length, DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES)
      );
    }
    await this.transfer(
      ctx,
      "write-file",
      boxPath,
      (approvalId) => new GrokBotUserComputerRequestFrame({
        frame: {
          case: "upload",
          value: { path: boxPath, data: new Uint8Array(data), approvalId }
        }
      })
    );
  }
  async downloadFile(ctx, _agentId, boxPath) {
    return this.transfer(
      ctx,
      "read-file",
      boxPath,
      (approvalId) => new GrokBotUserComputerRequestFrame({
        frame: { case: "download", value: { path: boxPath, approvalId } }
      })
    );
  }
  async runMessagesOp(ctx, op, machineId = this.machineId, display) {
    if (machineId !== void 0) {
      const blocked = this.deps.gate.blockedReason(machineId);
      if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
    }
    const machine = await resolveMessagesPresence(this.deps, machineId);
    if (machineId === void 0) {
      const blocked = this.deps.gate.blockedReason(machine.machineId);
      if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
    }
    const approvalId = await authorizeLocalToolAction(
      this.deps.gate,
      ctx.get(sandLocalToolScopeKey),
      {
        ...describeMessagesOp(op),
        ...display?.recipientName === void 0 ? {} : { recipientName: display.recipientName },
        machineId: machine.machineId,
        signal: ctx.signal
      }
    );
    const frame = new GrokBotUserComputerRequestFrame({
      frame: { case: "messagesOp", value: { opJson: JSON.stringify(op), approvalId } }
    });
    for await (const response of openWithWatchdog(
      this.deps,
      ctx,
      machine,
      frame,
      createIdleWatchdogPolicy({
        name: "sand-server-user-computer-messages",
        idleMs: messagesOpIdleBudgetMs(op)
      })
    )) {
      if (response.frame.case === "messagesResult") {
        return requireMessagesResult(
          op,
          parseMessagesResult(parseJsonOrUndefined(response.frame.value.resultJson))
        );
      }
      if (response.frame.case === "messagesError") {
        throw new SandLocalExecError(response.frame.value.error);
      }
    }
    throw unavailable(machine);
  }
};
function concat(chunks, total) {
  if (chunks.length === 1) return chunks[0];
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}
async function retireServerUserComputerApproval(args) {
  await args.deadline.run(async (signal) => {
    const stream3 = args.client.openGrokBotUserComputerRequest(
      {
        frame: new GrokBotUserComputerRequestFrame({
          frame: { case: "retireApproval", value: { approvalId: args.approvalId } }
        })
      },
      { signal }
    );
    for await (const frame of stream3) void frame;
  });
}
function createServerUserComputers(options2) {
  const descriptors = () => options2.presence.current().map((computer) => ({
    id: computer.machineId,
    label: computer.label,
    connected: true
  }));
  return {
    list: () => {
      void options2.presence.refresh();
      return descriptors();
    },
    resolve: (id) => {
      void options2.presence.refresh();
      const computers = options2.presence.current();
      const match2 = id === void 0 ? computers[0] : computers.find((computer) => computer.machineId === id);
      if (match2 === void 0) return void 0;
      return {
        id: match2.machineId,
        label: match2.label,
        box: new ServerUserComputerSandBox({ ...options2, machineId: match2.machineId }),
        terminalsFolder: () => match2.terminalsFolder.length > 0 ? match2.terminalsFolder : FALLBACK_TERMINALS_FOLDER2
      };
    }
  };
}
