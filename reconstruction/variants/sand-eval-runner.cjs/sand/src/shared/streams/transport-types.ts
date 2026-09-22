/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/streams/transport-types.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isValidAttachmentUrl(rawUrl) {
  try {
    const url2 = new URL(rawUrl);
    return url2.protocol === "file:" || url2.protocol === "https:";
  } catch {
    return false;
  }
}

