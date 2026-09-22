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
