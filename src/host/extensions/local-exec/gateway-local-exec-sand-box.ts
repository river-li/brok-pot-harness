/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/local-exec/gateway-local-exec-sand-box.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_exec_pb();
init_local_exec_failure_classifier();

// @recovered-fragment 2/2
async function runBridgeMessagesOp(bridge, gate, ctx, op, computerId, display) {
  const scope = ctx.get(sandLocalToolScopeKey);
  if (computerId !== void 0) {
    const blocked = gate.blockedReason(computerId);
    if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
  }
  const resolvedComputerId = bridge.assertComputerAvailable(
    computerId,
    { site: "messages-op", agentId: scope?.agentId },
    computerId === void 0
  );
  if (computerId === void 0) {
    const blocked = gate.blockedReason(resolvedComputerId);
    if (blocked !== void 0) throw new SandLocalToolPermissionDeniedError(blocked);
  }
  const approvalId = await authorizeLocalToolAction(gate, scope, {
    ...describeMessagesOp(op),
    ...display?.recipientName === void 0 ? {} : { recipientName: display.recipientName },
    machineId: resolvedComputerId,
    signal: ctx.signal
  });
  for await (const frame of bridge.request(
    ctx,
    { kind: "messages-op", op, ...approvalId !== void 0 ? { approvalId } : {} },
    resolvedComputerId,
    { watchResponse: true, permissionMachineId: resolvedComputerId }
  )) {
    if (frame.kind === "messages-result") return requireMessagesResult(op, frame.result);
    if (frame.kind === "messages-error") throw new SandLocalExecError(frame.error);
  }
  throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
}
var FALLBACK_TERMINALS_FOLDER = "terminals";
function boundedCwdState(value) {
  return LOCAL_EXEC_CWD_STATES.find((state) => state === value);
}
var GatewayLocalExecManager = class {
  constructor(bridge, gate, defaultComputerId, getTerminalsFolder, reportFailure) {
    this.bridge = bridge;
    this.gate = gate;
    this.defaultComputerId = defaultComputerId;
    this.getTerminalsFolder = getTerminalsFolder;
    this.reportFailure = reportFailure;
  }
  bridge;
  gate;
  defaultComputerId;
  getTerminalsFolder;
  reportFailure;
  nextId = 0;
  async *createExecInstance(ctx, argsSerializer) {
    const serverMessage = argsSerializer(this.nextId++);
    const computerId = serverMessage.machineId ?? this.defaultComputerId;
    const described = describeLocalExec(serverMessage, this.getTerminalsFolder(computerId));
    const scope = ctx.get(sandLocalToolScopeKey);
    if (computerId !== void 0) {
      const blocked = this.gate.blockedReason(computerId);
      if (blocked !== void 0) {
        throw new SandLocalToolPermissionDeniedError(blocked);
      }
    }
    const resolvedComputerId = this.bridge.assertComputerAvailable(
      computerId,
      {
        site: "exec",
        agentId: scope?.agentId
      },
      computerId === void 0
    );
    if (computerId === void 0) {
      const blocked = this.gate.blockedReason(resolvedComputerId);
      if (blocked !== void 0) {
        throw new SandLocalToolPermissionDeniedError(blocked);
      }
    }
    if (described === void 0 && this.gate.requiresApproval(resolvedComputerId)) {
      throw new SandLocalToolPermissionDeniedError(SAND_LOCAL_TOOLS_UNDESCRIBABLE_MESSAGE);
    }
    const approvalId = described === void 0 ? void 0 : await authorizeLocalToolAction(this.gate, scope, {
      ...described,
      machineId: resolvedComputerId,
      signal: ctx.signal
    });
    const frames = this.bridge.request(
      ctx,
      {
        kind: "exec",
        serverMessage: serverMessage.toJson(),
        ...approvalId !== void 0 ? { approvalId } : {}
      },
      resolvedComputerId,
      {
        watchResponse: true,
        permissionMachineId: resolvedComputerId
      }
    );
    for await (const frame of frames) {
      if (frame.kind === "client") {
        yield ExecClientMessage.fromJson(frame.message, {
          ignoreUnknownFields: true
        });
      } else if (frame.kind === "control") {
        const control = ExecClientControlMessage.fromJson(frame.message, {
          ignoreUnknownFields: true
        });
        if (control.message.case === "throw") {
          const thrown = control.message.value;
          const cwdState = boundedCwdState(frame.cwdState);
          this.reportFailure?.({
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
        if (control.message.case === "streamClose") {
          return;
        }
      }
    }
  }
};
var GatewayLocalExecSandBox = class {
  constructor(bridge, options2) {
    this.bridge = bridge;
    this.gate = options2.gate;
    this.computerId = options2.computerId;
    this.maxFileBytes = options2.maxFileBytes ?? DEFAULT_MAX_LOCAL_EXEC_FILE_BYTES;
    this.reportFailure = options2.reportFailure;
  }
  bridge;
  gate;
  computerId;
  maxFileBytes;
  reportFailure;
  getTerminalsFolder(computerId = this.computerId) {
    return this.bridge.getProviderInfo(computerId)?.terminalsFolder ?? FALLBACK_TERMINALS_FOLDER;
  }
  requireUsableComputer(ctx, site) {
    if (this.computerId !== void 0) {
      const blocked = this.gate.blockedReason(this.computerId);
      if (blocked !== void 0) {
        throw new SandLocalToolPermissionDeniedError(blocked);
      }
    }
    const computerId = this.bridge.assertComputerAvailable(
      this.computerId,
      {
        site,
        agentId: ctx.get(sandLocalToolScopeKey)?.agentId
      },
      false
    );
    if (this.computerId === void 0) {
      const blocked = this.gate.blockedReason(computerId);
      if (blocked !== void 0) {
        throw new SandLocalToolPermissionDeniedError(blocked);
      }
    }
    return { computerId };
  }
  async ensureReady(_ctx, _agentId) {
    return {
      remoteAccessor: new RemoteResourceAccessor(
        new GatewayLocalExecManager(
          this.bridge,
          this.gate,
          this.computerId,
          (computerId) => this.getTerminalsFolder(computerId),
          this.reportFailure
        )
      ),
      vncUrl: "",
      terminalsFolder: this.getTerminalsFolder()
    };
  }
  async hibernate(_ctx, _agentId) {
  }
  async runState(_ctx, _agentId) {
    return this.bridge.hasProvider() ? "running" : "absent";
  }
  async listBoxes() {
    return [];
  }
  async uploadFile(ctx, _agentId, boxPath, data) {
    if (data.length > this.maxFileBytes) {
      throw new SandLocalExecError(localExecFileTooLargeMessage(data.length, this.maxFileBytes));
    }
    const { computerId } = this.requireUsableComputer(ctx, "upload");
    const approvalId = await authorizeLocalToolAction(this.gate, ctx.get(sandLocalToolScopeKey), {
      action: "write-file",
      target: boxPath,
      machineId: computerId,
      signal: ctx.signal
    });
    for await (const frame of this.bridge.request(
      ctx,
      {
        kind: "upload",
        path: boxPath,
        bytesBase64: Buffer.from(data).toString("base64"),
        ...approvalId !== void 0 ? { approvalId } : {}
      },
      computerId,
      { permissionMachineId: computerId }
    )) {
      if (frame.kind === "file") return;
      if (frame.kind === "file-error") throw new SandLocalExecError(frame.error);
    }
    throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
  }
  async downloadFile(ctx, _agentId, boxPath) {
    const { computerId } = this.requireUsableComputer(ctx, "download");
    const approvalId = await authorizeLocalToolAction(this.gate, ctx.get(sandLocalToolScopeKey), {
      action: "read-file",
      target: boxPath,
      machineId: computerId,
      signal: ctx.signal
    });
    for await (const frame of this.bridge.request(
      ctx,
      {
        kind: "download",
        path: boxPath,
        ...approvalId !== void 0 ? { approvalId } : {}
      },
      computerId,
      { permissionMachineId: computerId }
    )) {
      if (frame.kind === "file") {
        return new Uint8Array(Buffer.from(frame.bytesBase64 ?? "", "base64"));
      }
      if (frame.kind === "file-error") throw new SandLocalExecError(frame.error);
    }
    throw new SandLocalExecError(SAND_NO_LOCAL_MACHINE_MESSAGE);
  }
};
function createBridgeUserComputers(bridge, gate, reportFailure) {
  return {
    list: () => bridge.listComputers().map((computer) => ({
      id: computer.id,
      label: computer.label,
      connected: computer.connected
    })),
    resolve: (id) => {
      const match2 = id === void 0 ? bridge.activeComputer() : bridge.listComputers().find((computer) => computer.id === id);
      if (match2 === void 0) return void 0;
      const box = new GatewayLocalExecSandBox(bridge, {
        gate,
        computerId: match2.id,
        reportFailure
      });
      return {
        id: match2.id,
        label: match2.label,
        box,
        terminalsFolder: () => box.getTerminalsFolder()
      };
    }
  };
}

