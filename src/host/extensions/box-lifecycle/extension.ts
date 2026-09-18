function startBoxLifecycle(context2, createClient2 = createSandCursorBackendClient) {
  return new BoxLifecycleService(
    createClient2(GrokBotService, {
      backend: context2.host.environment.backend,
      getAccessToken: context2.deps.auth.getAccessToken,
      getTeamId: context2.deps.auth.getTeamId,
      getMachineId: context2.deps.auth.getMachineId
    })
  );
}
var boxLifecycleExtension = defineHostExtension({
  id: "box-lifecycle",
  dependencies: [HostExtensions.Auth],
  start: startBoxLifecycle
});
