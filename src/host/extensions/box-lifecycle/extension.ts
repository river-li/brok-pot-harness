/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-lifecycle/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_grok_bot_connect();
init_cursor_inference();

// @recovered-fragment 2/2
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

