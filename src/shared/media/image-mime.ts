function imageMimeFromPath(filePath) {
  return IMAGE_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function servableImageMimeFromPath(filePath) {
  return SERVABLE_IMAGE_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function extensionFromImageMime(mime2) {
  return EXTENSION_FROM_IMAGE_MIME[mime2.toLowerCase()];
}
function videoMimeFromPath(filePath) {
  return VIDEO_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function audioMimeFromPath(filePath) {
  return AUDIO_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function documentMimeFromPath(filePath) {
  return DOCUMENT_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function mediaKindAndMimeFromPath(filePath) {
  const image2 = imageMimeFromPath(filePath);
  if (image2 !== void 0) return { kind: "image", mimeType: image2 };
  const video = videoMimeFromPath(filePath);
  if (video !== void 0) return { kind: "video", mimeType: video };
  const document2 = documentMimeFromPath(filePath);
  if (document2 !== void 0) return { kind: "document", mimeType: document2 };
  return void 0;
}
