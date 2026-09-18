init_errors();
init_proto();
init_cursor_inference();
var SandGenerateImageError = class extends SandDomainError {
  constructor(message, provider = { statusCode: void 0, contentSafetyBlocked: false }) {
    super(message);
    this.provider = provider;
  }
  provider;
  name = "SandGenerateImageError";
};
var SandGenerateImageModelRestrictedError = class extends SandDomainError {
  name = "SandGenerateImageModelRestrictedError";
};
function createCursorGenerateImageService(options2) {
  const client = createSandCursorBackendClient(AiService2, options2);
  return async (description10, referenceImages) => {
    const response = await client.runGenerateImage(
      new RunGenerateImageRequest({
        description: description10,
        referenceImages: (referenceImages ?? []).map(
          (image2) => new GenerateImageReferenceImage({
            data: image2.data,
            mimeType: image2.mimeType
          })
        ),
        modelId: options2.modelId,
        maxMode: options2.maxMode ?? false
      })
    );
    switch (response.result.case) {
      case "success":
        return {
          imageData: response.result.value.imageData,
          mimeType: response.result.value.mimeType
        };
      case "error":
        if (response.result.value.modelRestricted) {
          throw new SandGenerateImageModelRestrictedError(response.result.value.error);
        }
        throw new SandGenerateImageError(response.result.value.error, {
          statusCode: response.result.value.providerStatusCode,
          contentSafetyBlocked: response.result.value.contentSafetyBlocked
        });
      case void 0:
        throw new SandGenerateImageError("Image generation returned no result.");
      default: {
        const _exhaustive = response.result;
        return _exhaustive;
      }
    }
  };
}
