/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/local-exec/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_grok_bot_connect();
init_errors();
init_cursor_inference();

// @recovered-fragment 2/2
function startLocalExec(context2, createClient2 = createSandCursorBackendClient) {
  const gate = context2.deps["local-tool-permission"];
  const logs = context2.deps.telemetry.logs;
  const bridge = new SandLocalExecBridge({
    ...(process.env.GROKBOT_LOCAL_MODE === "1" ? {
      getLabel: (computerId, fallback) => require("./local/machine-labels.js").createLocalMachineLabels(getSandRootDir()).get(computerId) ?? fallback
    } : {}),
    clock: realClock,
    responseWatchdog: createIdleWatchdogPolicy({
      name: "sand-local-exec-response",
      idleMs: SAND_LOCAL_EXEC_RESPONSE_TIMEOUT_MS
    }),
    blockedReason: (computerId) => gate.blockedReason(computerId),
    report: {
      refused: (report) => logs.reportLocalExecRefused(report),
      provider: (report) => logs.reportLocalExecProvider(report)
    }
  });
  const reportFailure = (report) => logs.reportLocalExecFailed(report);
  if (process.env.GROKBOT_LOCAL_MODE === "1") {
    context2.onStop(context2.host.events.on("local-tool-permission.approval-retired", ({ approvalId }) => {
      bridge.retireApproval(approvalId);
    }));
    return {
      box: new GatewayLocalExecSandBox(bridge, { gate, reportFailure }),
      userComputers: createBridgeUserComputers(bridge, gate, reportFailure),
      registerProvider: (send) => {
        const unregister = bridge.registerProvider(send);
        void context2.host.events.emit("local-exec.computer-attached", {});
        return unregister;
      },
      submitResponses: (batch) => bridge.submitResponses(batch),
      checkLiveComputerForAsk: (agentId) => bridge.checkLiveComputerForAsk(agentId),
      runMessagesOp: (ctx, op, computerId, display) => runBridgeMessagesOp(bridge, gate, ctx, op, computerId, display)
    };
  }
  const client = createClient2(GrokBotService, {
    backend: context2.host.environment.backend,
    getAccessToken: context2.deps.auth.getAccessToken,
    getTeamId: context2.deps.auth.getTeamId,
    getMachineId: context2.deps.auth.getMachineId
  });
  const presence = new ServerUserComputerPresenceCache(
    client,
    realClock,
    createDeadlinePolicy({
      name: "sand-server-user-computer-presence-refresh",
      timeoutMs: SERVER_USER_COMPUTER_PRESENCE_TIMEOUT_MS
    }),
    (error42) => logs.reportHostExtensionDiagnostic({
      extension: "local_exec",
      kind: "server_presence",
      errorClass: errorLogTag(error42)
    })
  );
  const serverBox = new ServerUserComputerSandBox({ client, presence, gate, reportFailure });
  const serverRoute = {
    box: serverBox,
    userComputers: createServerUserComputers({ client, presence, gate, reportFailure }),
    prepare: () => presence.refresh().then(() => void 0),
    isAvailable: () => presence.current().length > 0
  };
  const retireDeadline = createDeadlinePolicy({
    name: "sand-local-exec-server-retire-approval",
    timeoutMs: SAND_LOCAL_EXEC_CONTROL_POST_TIMEOUT_MS
  });
  const offRetirement = context2.host.events.on(
    "local-tool-permission.approval-retired",
    async ({ approvalId }) => {
      bridge.retireApproval(approvalId);
      await retireServerUserComputerApproval({
        client,
        approvalId,
        deadline: retireDeadline
      }).catch(
        (error42) => logs.reportHostExtensionDiagnostic({
          extension: "local_exec",
          kind: "server_retire_approval",
          errorClass: errorLogTag(error42)
        })
      );
    }
  );
  context2.onStop(offRetirement);
  const presencePoll = createPollingPolicy2({
    name: "sand-server-user-computer-presence",
    intervalMs: SERVER_USER_COMPUTER_PRESENCE_POLL_MS
  }).start(async () => {
    if (context2.host.isIdle()) return;
    await presence.refresh();
  });
  context2.onStop(() => presencePoll.dispose());
  void presence.refresh();
  const gatewayBox = new GatewayLocalExecSandBox(bridge, { gate, reportFailure });
  const box = createPreferringUserComputerBox(serverRoute, gatewayBox, () => bridge.hasProvider());
  async function runMessagesOp(ctx, op, computerId, display) {
    await serverRoute.prepare();
    const computers = await presence.refresh();
    const capable = computers.some(
      (computer) => computer.messagesOp && (computerId === void 0 || computer.machineId === computerId)
    );
    return capable || !bridge.hasProvider() ? serverBox.runMessagesOp(ctx, op, computerId, display) : runBridgeMessagesOp(bridge, gate, ctx, op, computerId, display);
  }
  return {
    box,
    userComputers: createPreferringUserComputers(
      serverRoute,
      createBridgeUserComputers(bridge, gate, reportFailure),
      box.routeFor
    ),
    registerProvider: (send) => {
      const unregister = bridge.registerProvider(send);
      void context2.host.events.emit("local-exec.computer-attached", {});
      return unregister;
    },
    submitResponses: (batch) => bridge.submitResponses(batch),
    checkLiveComputerForAsk: (agentId) => {
      void presence.refresh();
      return presence.current().length > 0 || bridge.checkLiveComputerForAsk(agentId);
    },
    runMessagesOp
  };
}
var localExecExtension = defineHostExtension({
  id: "local-exec",
  dependencies: [HostExtensions.LocalToolPermission, HostExtensions.Telemetry, HostExtensions.Auth],
  start: startLocalExec
});
