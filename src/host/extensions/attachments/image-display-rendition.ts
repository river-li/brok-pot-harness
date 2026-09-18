var DISPLAY_RENDITION_MAX_EDGE = 4096;
var JPEG_QSCALE = "2";
var MAX_CACHED_RENDITIONS = 32;
var CONTAINER_HEAD_BYTES = 1024 * 1024;
var ImageProbeUnrecognizedError = class extends SandDomainError {
  name = "ImageProbeUnrecognizedError";
};
var countSchema = external_exports.number().int().nonnegative();
var extentSchema = external_exports.number().int().positive();
var dispositionSchema = external_exports.object({ default: external_exports.number().optional() }).optional();
var probeSchema = external_exports.object({
  streams: external_exports.array(
    external_exports.object({
      index: countSchema,
      codec_type: external_exports.string().optional(),
      width: extentSchema.optional(),
      height: extentSchema.optional(),
      disposition: dispositionSchema
    })
  ).default([]),
  stream_groups: external_exports.array(
    external_exports.object({
      type: external_exports.string().optional(),
      disposition: dispositionSchema,
      components: external_exports.array(
        external_exports.object({
          coded_width: extentSchema,
          coded_height: extentSchema,
          width: extentSchema,
          height: extentSchema,
          horizontal_offset: countSchema,
          vertical_offset: countSchema,
          subcomponents: external_exports.array(
            external_exports.object({
              stream_index: countSchema,
              tile_horizontal_offset: countSchema,
              tile_vertical_offset: countSchema
            })
          ).default([])
        })
      ).default([])
    })
  ).default([])
});
function isDefaultDisposition(entry) {
  return entry.disposition?.default === 1;
}
function videoStreamsOf(probe) {
  const streams = [];
  for (const entry of probe.streams) {
    if (entry.codec_type !== "video" || entry.width === void 0 || entry.height === void 0) {
      continue;
    }
    streams.push({
      stream: { streamIndex: entry.index, width: entry.width, height: entry.height },
      isDefault: isDefaultDisposition(entry)
    });
  }
  return streams;
}
function tileGridOf(group, streams) {
  const component = group.components[0];
  if (component === void 0) return null;
  const output = { width: component.width, height: component.height };
  const offset = { x: component.horizontal_offset, y: component.vertical_offset };
  if (offset.x + output.width > component.coded_width || offset.y + output.height > component.coded_height) {
    return null;
  }
  const knownStreams = new Set(streams.map((candidate) => candidate.stream.streamIndex));
  const tiles = [];
  for (const tile of component.subcomponents) {
    if (!knownStreams.has(tile.stream_index)) return null;
    tiles.push({
      streamIndex: tile.stream_index,
      x: tile.tile_horizontal_offset,
      y: tile.tile_vertical_offset
    });
  }
  if (tiles.length === 0) return null;
  return { output, offset, tiles };
}
function primaryStreamOf(streams) {
  const flagged = streams.find((candidate) => candidate.isDefault);
  if (flagged !== void 0) return flagged.stream;
  let largest = null;
  for (const { stream: stream3 } of streams) {
    if (largest === null || stream3.width * stream3.height > largest.width * largest.height) {
      largest = stream3;
    }
  }
  return largest;
}
function parseProbeJson(json3) {
  const parsed2 = probeSchema.safeParse(JSON.parse(json3));
  if (!parsed2.success) {
    throw new ImageProbeUnrecognizedError("ffprobe output does not match the image probe schema");
  }
  return parsed2.data;
}
function parseImageProbe(json3) {
  const probe = parseProbeJson(json3);
  const streams = videoStreamsOf(probe);
  const gridGroups = probe.stream_groups.filter((group) => group.type === "Tile Grid");
  const gridGroup = gridGroups.find(isDefaultDisposition) ?? gridGroups[0];
  if (gridGroup !== void 0) {
    const grid = tileGridOf(gridGroup, streams);
    return grid === null ? null : { kind: "grid", grid };
  }
  const stream3 = primaryStreamOf(streams);
  return stream3 === null ? null : { kind: "stream", stream: stream3 };
}
function evenFit(dimensions, maxEdge) {
  const longEdge = Math.max(dimensions.width, dimensions.height);
  if (longEdge <= maxEdge) return null;
  const ratio = maxEdge / longEdge;
  const even = (value) => Math.max(2, Math.round(value * ratio / 2) * 2);
  return { width: even(dimensions.width), height: even(dimensions.height) };
}
function transformFilters(transform2) {
  if (transform2 === null) return [];
  const filters = [];
  switch (transform2.quarterTurns) {
    case 1:
      filters.push("transpose=cclock");
      break;
    case 2:
      filters.push("hflip", "vflip");
      break;
    case 3:
      filters.push("transpose=clock");
      break;
    default:
      break;
  }
  if (transform2.mirrorAxis === "vertical") filters.push("hflip");
  if (transform2.mirrorAxis === "horizontal") filters.push("vflip");
  return filters;
}
function displayFilterGraph(layout, transform2) {
  let inputs;
  const filters = [];
  let presented;
  if (layout.kind === "grid") {
    const { tiles, output, offset } = layout.grid;
    inputs = tiles.map((tile) => `[0:${tile.streamIndex}]`).join("");
    if (tiles.length > 1) {
      const positions = tiles.map((tile) => `${tile.x}_${tile.y}`).join("|");
      filters.push(`xstack=inputs=${tiles.length}:layout=${positions}:fill=black`);
    }
    filters.push(`crop=${output.width}:${output.height}:${offset.x}:${offset.y}`);
    presented = output;
  } else {
    inputs = `[0:${layout.stream.streamIndex}]`;
    presented = layout.stream;
  }
  const fitted = evenFit(presented, DISPLAY_RENDITION_MAX_EDGE);
  if (fitted !== null) filters.push(`scale=${fitted.width}:${fitted.height}`);
  filters.push(...transformFilters(transform2));
  if (filters.length === 0) filters.push("null");
  return `${inputs}${filters.join(",")}[out]`;
}
function displayRenditionArgs({
  sourcePath,
  filterGraph,
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
    "-filter_complex",
    filterGraph,
    "-map",
    "[out]",
    "-frames:v",
    "1",
    "-f",
    "image2",
    "-c:v",
    "mjpeg",
    "-q:v",
    JPEG_QSCALE,
    outputPath
  ];
}
function needsDisplayRendition(sourcePath) {
  return imageMimeFromPath(sourcePath) == null && servableImageMimeFromPath(sourcePath) != null;
}
async function readContainerHead(sourcePath) {
  const handle = await import_node_fs50.promises.open(sourcePath, "r");
  try {
    const buffer = new Uint8Array(CONTAINER_HEAD_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, buffer.byteLength, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}
var displayableImageRecipe = {
  medium: "image",
  renditionExtension: ".jpg",
  maxCached: MAX_CACHED_RENDITIONS,
  async plan(sourcePath, step) {
    if (!needsDisplayRendition(sourcePath)) return { kind: "source" };
    const probed = await step.attempt("probe", async () => {
      const json3 = await step.run("ffprobe", [
        "-v",
        "error",
        "-protocol_whitelist",
        "file",
        "-show_streams",
        "-show_stream_groups",
        "-of",
        "json",
        sourcePath
      ]);
      const layout = parseImageProbe(json3);
      if (layout === null) {
        throw new ImageProbeUnrecognizedError("ffprobe reported no decodable image layout");
      }
      return { layout, transform: readHeicTransform(await readContainerHead(sourcePath)) };
    });
    if (probed === null) return null;
    const filterGraph = displayFilterGraph(probed.layout, probed.transform);
    return {
      kind: "rendition",
      ffmpegArgs: (outputPath) => displayRenditionArgs({ sourcePath, filterGraph, outputPath })
    };
  }
};
var withDisplayableImageSource = createMediaRenditionCache(displayableImageRecipe);
