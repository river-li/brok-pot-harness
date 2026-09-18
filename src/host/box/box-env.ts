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
