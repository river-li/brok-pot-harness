/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/box/box-mcp.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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
  } catch (error42) {
    if (error42 instanceof ConnectError && error42.code === Code.Unimplemented) {
      throw new SandBoxMcpUnsupportedError(
        "Grok Bot's computer is running an older image without MCP support \u2014 update it from Settings \u2192 Updates \u2192 Update Grok Bot's Computer.",
        { cause: error42 }
      );
    }
    throw error42;
  }
}

