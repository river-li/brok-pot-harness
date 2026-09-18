init_control_service_pb();
init_esm2();
init_errors();
var SandBoxMcpUnsupportedError = class extends SandDomainError {
  name = "SandBoxMcpUnsupportedError";
};
async function loadBoxMcpServersViaTransport(ctx, transport, configJson) {
  const control = createContextPropagatingClient(ControlService, transport);
  try {
    const response = await control.loadMcpServers(
      ctx,
      new LoadMcpServersRequest({
        mcpConfigJson: configJson,
        removeMissing: true
      })
    );
    return response.loadedServerNames;
  } catch (error41) {
    if (error41 instanceof ConnectError && error41.code === Code.Unimplemented) {
      throw new SandBoxMcpUnsupportedError(
        "Grok Bot's computer is running an older image without MCP support \u2014 update it from Settings \u2192 Updates \u2192 Update Grok Bot's Computer.",
        { cause: error41 }
      );
    }
    throw error41;
  }
}
