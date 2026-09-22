/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cloud-agents/model-catalog-fetch.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_aiserver_connect();
init_aiserver_pb();

// @recovered-fragment 2/2
init_cursor_inference();
async function fetchSandModelCatalog(options2) {
  const client = createSandCursorBackendClient(AiService, options2);
  const response = await client.availableModels(
    new AvailableModelsRequest({
      useModelParameters: true,
      doNotUseMarkdown: true,
      scope: AvailableModelsScope.USER_AVAILABLE
    })
  );
  return mapAvailableModels(response.models);
}

