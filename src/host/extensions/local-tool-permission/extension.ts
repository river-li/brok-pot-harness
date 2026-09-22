/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/local-tool-permission/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_errors();

// @recovered-fragment 2/2
var localToolPermissionExtension = defineHostExtension({
  id: "local-tool-permission",
  dependencies: [HostExtensions.Settings, HostExtensions.Telemetry, HostExtensions.Transcript],
  start: (context2) => {
    let canAsk = () => false;
    let hasLiveComputer = () => false;
    const controller = new SandLocalToolPermissionController({
      getPermission: (machineId) => context2.deps.settings.getLocalToolPermission(machineId),
      setPermission: (permission, machineId) => {
        context2.deps.settings.setLocalToolPermission(permission, machineId);
      },
      getMessagesEnabled: () => context2.deps.settings.getMessagesEnabled(),
      onApprovalRetired: (approvalId) => {
        void context2.host.events.emit("local-tool-permission.approval-retired", { approvalId });
      },
      canAsk: (agentId) => canAsk(agentId),
      hasLiveComputer: (agentId) => hasLiveComputer(agentId)
    });
    const sweepStrandedCards = (options2) => context2.deps.transcript.widgetResponses.expireAllPendingLocalToolPermissionCards({
      unlessRequestId: (requestId2) => controller.getPendingRequestById(requestId2) != null,
      ...options2?.activeOnly === true ? { activeOnly: true } : {}
    });
    void context2.host.whenBackgroundWorkReady.then(
      () => sweepStrandedCards().catch((error42) => {
        context2.host.log(`local-tool ask boot sweep failed (${errorLogTag(error42)})`);
      })
    );
    const offComputerAttached = context2.host.events.on("local-exec.computer-attached", async () => {
      try {
        await sweepStrandedCards({ activeOnly: true });
      } catch (error42) {
        context2.host.log(`local-tool ask reconnect sweep failed (${errorLogTag(error42)})`);
      }
    });
    context2.onStop(offComputerAttached);
    return Object.assign(controller, {
      bindAskSurfaces: (provider) => {
        canAsk = provider;
      },
      bindLiveComputerCheck: (provider) => {
        hasLiveComputer = provider;
      },
      sweepStrandedCards,
      resolveAsk: (args) => resolveLocalToolPermissionAsk(
        {
          asks: controller,
          transcript: context2.deps.transcript,
          onStrandedRetirement: () => context2.deps.telemetry.logs.reportLocalToolPermissionStrandedRetirement(),
          onCardWriteFailure: () => context2.host.log("local-tool ask card write failed")
        },
        args
      )
    });
  }
});

