/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/box-env.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_control_service_pb();
async function applyBoxEnvironmentViaTransport(ctx, transport, update) {
  const control = createContextPropagatingClient(ControlService, transport);
  await control.updateEnvironmentVariables(
    ctx,
    new UpdateEnvironmentVariablesRequest({
      env: { ...update.env },
      replace: update.replace
    })
  );
}

