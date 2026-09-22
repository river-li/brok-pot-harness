/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/image-mime.ts
 * Bundle: sand-host/extensions/content-search/search-index-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function imageMimeFromPath(filePath) {
  return IMAGE_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function videoMimeFromPath(filePath) {
  return VIDEO_MIME_FROM_EXTENSION[extensionOf(filePath)];
}
function audioMimeFromPath(filePath) {
  return AUDIO_MIME_FROM_EXTENSION[extensionOf(filePath)];
}

