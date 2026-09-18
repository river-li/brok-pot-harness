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
