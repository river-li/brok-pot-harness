/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/inline-image.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var logger27 = createLogger("tools/inline-image");
var inlineImageBoundCounter = createCounter("agent.tools.inline_image.bound", {
  description: "Image bytes bounded before being persisted in a tool step, by source and outcome",
  labelNames: ["source", "outcome"]
});
var inlineImageInputBytes = createHistogram("agent.tools.inline_image.input_bytes", {
  description: "Image bytes a tool produced before bounding",
  labelNames: ["source"]
});
var inlineImageOutputBytes = createHistogram("agent.tools.inline_image.output_bytes", {
  description: "Image bytes persisted in the tool step after bounding",
  labelNames: ["source"]
});
function recordBound(ctx, source, outcome, inputBytes, outputBytes) {
  try {
    inlineImageInputBytes.histogram(ctx, inputBytes, { source });
    inlineImageOutputBytes.histogram(ctx, outputBytes, { source });
    inlineImageBoundCounter.increment(ctx, 1, { source, outcome });
  } catch {
    return;
  }
}
async function boundInlineImageForModel(ctx, bytes, { mimeType, source }) {
  const original = Buffer.from(bytes);
  let resized;
  try {
    resized = await resizeImageBufferIfNeeded(original, {
      webpWithoutCodec: "passthrough"
    });
  } catch (error42) {
    recordBound(ctx, source, "failed", original.byteLength, original.byteLength);
    logger27.warn(ctx, "Failed to bound inline image; keeping original bytes", {
      source,
      mimeType,
      bytes: original.byteLength,
      error: error42 instanceof Error ? error42.message : String(error42)
    });
    return { data: bytes, mimeType };
  }
  const unchanged = resized.data.byteLength === original.byteLength && original.equals(resized.data);
  recordBound(ctx, source, unchanged ? "unchanged" : "resized", original.byteLength, resized.data.byteLength);
  return { data: unchanged ? bytes : resized.data, mimeType: resized.mimeType };
}

