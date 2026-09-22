/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/attachments/avatar-image-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createSandAvatarImageService(environment, auth2, createGenerator = () => createSandImageGenerator(environment, auth2)) {
  let generate;
  return async (description9) => {
    const trimmed = description9.trim();
    if (trimmed.length === 0) {
      throw new SandGenerateImageError("Image description is empty.");
    }
    generate ??= createGenerator();
    const generated = await generate(trimmed);
    return { imageBase64: generated.imageData, mimeType: generated.mimeType };
  };
}

