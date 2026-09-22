/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/selected-image-inputs.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises76 = require("node:fs/promises");
function toSandSelectedImageInput(image2) {
  const source = image2.dataOrBlobId;
  switch (source.case) {
    case "data":
      return { data: source.value, path: image2.path, mimeType: image2.mimeType };
    case "blobIdWithData":
      return { data: source.value.data, path: image2.path, mimeType: image2.mimeType };
    default:
      throw new Error(
        `Cannot pass selected image source "${source.case ?? "unset"}" to a Sand runner without inline bytes. Resolve images before subagent dispatch.`
      );
  }
}
async function loadSelectedImageInputs(attachmentPaths) {
  if (attachmentPaths.length === 0) return [];
  const loaded = await Promise.all(
    attachmentPaths.map(async (path31) => {
      try {
        const data = await (0, import_promises76.readFile)(path31);
        return {
          data: new Uint8Array(data),
          path: path31,
          mimeType: imageMimeFromPath(path31)
        };
      } catch {
        return null;
      }
    })
  );
  return loaded.filter((image2) => image2 != null);
}

