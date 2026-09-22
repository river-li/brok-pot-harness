/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/computer-use.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_buffer4 = require("node:buffer");

// @recovered-fragment 2/2
var BOX_CDP_PORT_BASE = 9222;
var TAB_SWEEP_SHELL_TIMEOUT_MS = 3e4;
function tabSweepCommand(display) {
  const request3 = { op: "sweep", display, cdpPort: BOX_CDP_PORT_BASE + display };
  const encoded = import_node_buffer4.Buffer.from(JSON.stringify(request3), "utf8").toString("base64");
  return `node ${SAND_BROWSER_DRIVER_BOX_PATH} ${encoded}`;
}
function sweepShellFailure(result) {
  if (result.result.case !== "success") return result.result.case;
  if (result.result.value.exitCode !== 0) return `exit_${String(result.result.value.exitCode)}`;
  return void 0;
}
function remoteBoxPrewarmFor(subagentType, gates) {
  if (!isComputerUseSubagentType(subagentType)) return void 0;
  return { playwrightServer: gates.browserUsePlaywright({ logExposure: true }) };
}
function mergedModelId(ids) {
  if (ids.length === 0) return void 0;
  if (ids.length === 1) return ids[0];
  return "mixed";
}
function createComputerUseCoordination(deps) {
  const windowBySubagent = /* @__PURE__ */ new Map();
  const preparationBySubagent = /* @__PURE__ */ new Map();
  const auditActionCounts = /* @__PURE__ */ new Map();
  const modelIds = /* @__PURE__ */ new Set();
  let turnEndedCount = 0;
  let usage;
  let navigationProbe = deps.initialNavigationProbe;
  const driverUploadByBox = /* @__PURE__ */ new Map();
  const runningSweepByDisplay = /* @__PURE__ */ new Map();
  const displaysOwedAnotherSweep = /* @__PURE__ */ new Set();
  const uploadDriver = (ctx, boxId) => {
    let upload = driverUploadByBox.get(boxId);
    if (upload === void 0) {
      upload = deps.remoteBox.uploadFile(
        ctx,
        boxId,
        SAND_BROWSER_DRIVER_BOX_PATH,
        import_node_buffer4.Buffer.from(SAND_BROWSER_DRIVER_SOURCE, "utf8")
      ).catch((error3) => {
        driverUploadByBox.delete(boxId);
        throw error3;
      });
      driverUploadByBox.set(boxId, upload);
    }
    return upload;
  };
  const sweepDisplay = async (ctx, connection, display) => {
    await uploadDriver(ctx, deps.resolveBoxId());
    const result = await connection.remoteAccessor.get(shellExecutorResource).execute(
      ctx,
      buildHostShellArgs({
        command: tabSweepCommand(display),
        name: "node",
        workingDirectory: "/workspace",
        toolCallId: `sand-tab-sweep-${String(display)}`,
        timeoutMs: TAB_SWEEP_SHELL_TIMEOUT_MS
      })
    );
    const failure = sweepShellFailure(result);
    if (failure !== void 0) {
      reportHostDiagnostic({ kind: "tab_sweep_failed", errorClass: failure });
    }
  };
  return {
    allocateWindow(subagentAgentId) {
      const existing = windowBySubagent.get(subagentAgentId);
      if (existing != null) return existing;
      const mainBusy = [...windowBySubagent.values()].includes(1);
      if (mainBusy) return null;
      windowBySubagent.set(subagentAgentId, 1);
      return 1;
    },
    freeWindow(subagentAgentId) {
      windowBySubagent.delete(subagentAgentId);
      preparationBySubagent.delete(subagentAgentId);
    },
    prepareRemoteBox({ agentId, boxId, playwrightServer }) {
      const connection = deps.remoteBox.ensureReady(deps.ctx, boxId).then(
        (ready2) => isNoMonitorComputerUseExecutor(ready2.remoteAccessor.get(computerUseExecutorResource)) ? void 0 : ready2
      ).catch((error3) => {
        reportHostDiagnostic({
          kind: "computer_use_prewarm_skipped",
          stage: "box",
          errorClass: errorLogTag(error3)
        });
        return void 0;
      });
      let listToolsStartedAt;
      const serverReady = (outcome) => recordPlaywrightServerReady(deps.ctx, {
        outcome,
        harness: deps.harness,
        durationMs: listToolsStartedAt === void 0 ? 0 : performance.now() - listToolsStartedAt
      });
      preparationBySubagent.set(
        agentId,
        connection.then(async (ready2) => {
          if (ready2 === void 0) return;
          await ready2.remoteAccessor.get(shellExecutorResource).execute(
            deps.ctx,
            buildHostShellArgs({
              command: "box-chrome --sand-prepare",
              name: "box-chrome",
              workingDirectory: "/workspace",
              toolCallId: `sand-cua-browser-prepare-${agentId}`
            })
          );
          if (!playwrightServer) return;
          const windowIndex = boxAgentWindowIndex(deps.remoteBox, boxId);
          if (windowIndex === void 0) {
            serverReady("unseated");
            return;
          }
          const serverName = playwrightBoxMcpServerName(windowIndex);
          listToolsStartedAt = performance.now();
          await deps.attachBoxServers?.();
          const [server] = await createBoxSandMcpExec(deps.remoteBox).listTools([serverName]);
          if (server === void 0) {
            serverReady("absent");
            reportHostDiagnostic({
              kind: "playwright_server_unavailable",
              reason: "absent",
              errorClass: "absent"
            });
            return;
          }
          if (server.status === "connected") {
            serverReady("connected");
            return;
          }
          serverReady("error");
          reportHostDiagnostic({
            kind: "playwright_server_unavailable",
            reason: "error",
            errorClass: boxStdioStatusClassOf(server.statusDetail)
          });
        }).catch((error3) => {
          reportHostDiagnostic({
            kind: "computer_use_prewarm_skipped",
            stage: "browser",
            errorClass: errorLogTag(error3)
          });
          if (playwrightServer) serverReady("prewarm_failed");
          return void 0;
        })
      );
      return connection;
    },
    recordAuditIntent(actionCase) {
      if (deps.actionAuditor() == null) return;
      const kind = computerUseAuditKind(actionCase);
      if (kind === void 0) return;
      auditActionCounts.set(kind, (auditActionCounts.get(kind) ?? 0) + 1);
    },
    auditActionCounts() {
      return auditActionCounts;
    },
    recordTurnEnded(turnUsage) {
      turnEndedCount++;
      usage = mergeTurnUsage(usage, turnUsage);
    },
    recordModelId(modelId) {
      modelIds.add(modelId);
    },
    usageSnapshot() {
      const ids = [...modelIds];
      return {
        modelId: mergedModelId(ids),
        turnEndedCount,
        usage
      };
    },
    getOrCreateNavigationProbe() {
      const auditor = deps.actionAuditor();
      if (auditor == null) return void 0;
      navigationProbe ??= createSandNavigationProbe({
        auditor,
        agentId: deps.getConversationId(),
        getBoxId: () => deps.resolveBoxId(),
        buildShellArgs: buildHostShellArgs
      });
      return navigationProbe;
    },
    sweepTabs(ctx, connection) {
      const display = connection.windowIndex ?? 1;
      const running = runningSweepByDisplay.get(display);
      if (running !== void 0) {
        displaysOwedAnotherSweep.add(display);
        return running;
      }
      const outlivesTheTurn = ctx.withDetached();
      const done = (async () => {
        do {
          displaysOwedAnotherSweep.delete(display);
          await sweepDisplay(outlivesTheTurn, connection, display).catch((error3) => {
            reportHostDiagnostic({ kind: "tab_sweep_failed", errorClass: errorLogTag(error3) });
          });
        } while (displaysOwedAnotherSweep.has(display));
        runningSweepByDisplay.delete(display);
      })();
      runningSweepByDisplay.set(display, done);
      return done;
    }
  };
}

