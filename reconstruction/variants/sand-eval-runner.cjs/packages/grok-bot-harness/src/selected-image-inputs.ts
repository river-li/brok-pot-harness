/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/selected-image-inputs.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

