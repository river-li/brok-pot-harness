var import_node_fs52 = require("node:fs");
var PREVIEW_SOURCE_EXTENSIONS = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".bmp"]);
var WEBP_QUALITY = "82";
var WEBP_COMPRESSION_LEVEL = "2";
var MAX_CACHED_PREVIEWS = 512;
function previewRenditionArgs({
  sourcePath,
  size,
  transform: transform2,
  outputPath
}) {
  return [
    "-v",
    "error",
    "-nostdin",
    "-y",
    "-protocol_whitelist",
    "file",
    "-noautorotate",
    "-i",
    sourcePath,
    "-vf",
    [`scale=${size.width}:${size.height}`, ...transformFilters(transform2)].join(","),
    "-frames:v",
    "1",
    "-f",
    "image2",
    "-c:v",
    "libwebp",
    "-quality",
    WEBP_QUALITY,
    "-compression_level",
    WEBP_COMPRESSION_LEVEL,
    outputPath
  ];
}
function previewRenditionSize(sourcePath, sourceDimensions) {
  if (!PREVIEW_SOURCE_EXTENSIONS.has(extensionOf(sourcePath))) return null;
  if (sourceDimensions == null) return null;
  return fitLongEdge(sourceDimensions, PREVIEW_RENDITION_MAX_EDGE);
}
var previewImageRecipe = {
  medium: "image",
  renditionExtension: ".webp",
  maxCached: MAX_CACHED_PREVIEWS,
  async plan(sourcePath, step) {
    if (!PREVIEW_SOURCE_EXTENSIONS.has(extensionOf(sourcePath))) return { kind: "source" };
    const probed = await step.attempt(
      "probe",
      async () => {
        const bytes = await import_node_fs52.promises.readFile(sourcePath);
        const orientation = readJpegOrientation(bytes);
        return {
          dimensions: readImageFileDimensions(bytes),
          transform: orientation == null ? null : exifOrientationTransform(orientation)
        };
      },
      (error42) => error42 instanceof RangeError
    );
    const size = previewRenditionSize(sourcePath, probed?.dimensions ?? null);
    if (size == null) return { kind: "source" };
    const transform2 = probed?.transform ?? null;
    return {
      kind: "rendition",
      ffmpegArgs: (outputPath) => previewRenditionArgs({ sourcePath, size, transform: transform2, outputPath })
    };
  }
};
var withPreviewImageSource = createMediaRenditionCache(previewImageRecipe);
