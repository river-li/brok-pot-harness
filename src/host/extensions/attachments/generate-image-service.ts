init_esm2();
init_errors();
init_cursor_inference();
var SandGenerateImagePersistError = class extends SandDomainError {
  name = "SandGenerateImagePersistError";
};
var USAGE_LIMITED_MESSAGE = "Image generation was refused because this account has reached its usage or rate limit.";
function createSandImageGenerator(environment, auth2, options2) {
  return createCursorGenerateImageService({
    backend: environment.backend,
    getAccessToken: auth2.getAccessToken,
    getTeamId: auth2.getTeamId,
    getMachineId: auth2.getMachineId,
    modelId: environment.agentModelOverride ?? SAND_DEFAULT_MODEL_ID,
    maxMode: true,
    ...options2?.onRequestId == null ? {} : { onRequestId: options2.onRequestId }
  });
}
function toGenerateImageToolError(error41) {
  if (error41 instanceof SandGenerateImageError) {
    return createGenerateImageProviderError({
      message: error41.message,
      providerStatusCode: error41.provider.statusCode,
      contentSafetyBlocked: error41.provider.contentSafetyBlocked
    });
  }
  if (error41 instanceof ConnectError && error41.code === Code.ResourceExhausted) {
    return new CustomToolCallError(ToolErrorClassification.PROVIDER_ERROR, {
      clientVisibleErrorMessage: USAGE_LIMITED_MESSAGE,
      modelVisibleErrorMessage: USAGE_LIMITED_MESSAGE,
      error: `${USAGE_LIMITED_MESSAGE} ${error41.message}`
    });
  }
  return error41;
}
function createSandGenerateImageService(environment, auth2, options2) {
  const generateImage = createSandImageGenerator(environment, auth2, {
    onRequestId: options2.onRequestId
  });
  return async (_ctx, description10, _filePath, referenceImages) => {
    const generated = await generateImage(description10, referenceImages).catch((error41) => {
      throw toGenerateImageToolError(error41);
    });
    const persisted = await options2.persistImage(
      Buffer.from(generated.imageData, "base64"),
      generated.mimeType
    );
    if (persisted == null) {
      throw new SandGenerateImagePersistError(
        "Failed to save the generated image into the agent's media store."
      );
    }
    return { filePath: persisted.absolutePath, imageData: generated.imageData };
  };
}
