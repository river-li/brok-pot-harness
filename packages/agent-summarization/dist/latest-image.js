var DEFAULT_IMAGE_MIME_TYPE = "image/png";
var DATA_OR_REMOTE_URL_PREFIX = /^(data:|https?:|blob:)/i;
function resolveImageMimeType(mimeType) {
  const trimmed = mimeType === null || mimeType === void 0 ? void 0 : mimeType.trim();
  return trimmed !== void 0 && trimmed !== "" ? trimmed : DEFAULT_IMAGE_MIME_TYPE;
}
function toUserMessageImagePart(part) {
  if (typeof part.image !== "string") {
    return Object.assign({ type: "image", image: part.image }, part.mimeType !== void 0 ? { mimeType: part.mimeType } : {});
  }
  const image2 = DATA_OR_REMOTE_URL_PREFIX.test(part.image) ? part.image : `data:${resolveImageMimeType(part.mimeType)};base64,${part.image}`;
  return Object.assign({ type: "image", image: image2 }, part.mimeType !== void 0 ? { mimeType: part.mimeType } : {});
}
function findLatestImagePart(messages2) {
  for (let i = messages2.length - 1; i >= 0; i--) {
    const message = messages2[i];
    if (message.role === "tool") {
      for (let j2 = message.content.length - 1; j2 >= 0; j2--) {
        const expContent = message.content[j2].experimental_content;
        if (expContent === void 0) {
          continue;
        }
        for (let k2 = expContent.length - 1; k2 >= 0; k2--) {
          const item = expContent[k2];
          if (item.type === "image" && typeof item.data === "string") {
            return Object.assign({ image: item.data }, typeof item.mimeType === "string" ? { mimeType: item.mimeType } : {});
          }
        }
      }
      continue;
    }
    if (message.role === "user" && Array.isArray(message.content)) {
      for (let j2 = message.content.length - 1; j2 >= 0; j2--) {
        const part = message.content[j2];
        if (part.type === "image") {
          return Object.assign({ image: part.image }, part.mimeType !== void 0 ? { mimeType: part.mimeType } : {});
        }
      }
    }
  }
  return null;
}
