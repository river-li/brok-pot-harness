/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/attachments/generate-image-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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
function toGenerateImageToolError(error42) {
  if (error42 instanceof SandGenerateImageError) {
    return createGenerateImageProviderError({
      message: error42.message,
      providerStatusCode: error42.provider.statusCode,
      contentSafetyBlocked: error42.provider.contentSafetyBlocked
    });
  }
  if (error42 instanceof ConnectError && error42.code === Code.ResourceExhausted) {
    return new CustomToolCallError(ToolErrorClassification.PROVIDER_ERROR, {
      clientVisibleErrorMessage: USAGE_LIMITED_MESSAGE,
      modelVisibleErrorMessage: USAGE_LIMITED_MESSAGE,
      error: `${USAGE_LIMITED_MESSAGE} ${error42.message}`
    });
  }
  return error42;
}
function createSandGenerateImageService(environment, auth2, options2) {
  const generateImage = createSandImageGenerator(environment, auth2, {
    onRequestId: options2.onRequestId
  });
  return async (_ctx, description9, _filePath, referenceImages) => {
    const generated = await generateImage(description9, referenceImages).catch((error42) => {
      throw toGenerateImageToolError(error42);
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

