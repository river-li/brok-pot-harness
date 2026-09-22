/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-image-assets.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_proto();
init_mcp_diagnostics();
function describeSavedImage(image2) {
  const dimensions = image2.width != null && image2.height != null ? ` (${image2.width}x${image2.height})` : "";
  return `Saved this image to disk at ${image2.fileUrl}${dimensions}. To show it to the user, pass that path to SendToUser as {"type":"attachment","url":"${image2.fileUrl}"}.`;
}
async function augmentMcpResultWithSavedImages(result, persistImage) {
  if (result.result.case !== "success") return result;
  const success2 = result.result.value;
  if (!success2.content.some((item) => item.content.case === "image")) {
    return result;
  }
  const augmented = [];
  for (const item of success2.content) {
    augmented.push(item);
    if (item.content.case !== "image") continue;
    const image2 = item.content.value;
    if (image2.data.length === 0) continue;
    let saved = null;
    try {
      saved = await persistImage(image2.data, image2.mimeType);
    } catch (error42) {
      reportMcpHostEdgeFailure("image-persist", error42);
      saved = null;
    }
    if (saved == null) continue;
    augmented.push(
      new McpToolResultContentItem({
        content: {
          case: "text",
          value: new McpTextContent({ text: describeSavedImage(saved) })
        }
      })
    );
  }
  return new McpResult({
    result: {
      case: "success",
      value: new McpSuccess({
        content: augmented,
        isError: success2.isError,
        structuredContent: success2.structuredContent
      })
    }
  });
}

