/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/http-image.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function imageContentType(response) {
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  return contentType.startsWith("image/") ? contentType : null;
}
async function readCappedImageBytes(response, maxBytes) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  const body = response.body;
  if (body == null) return null;
  const chunks = [];
  let total = 0;
  const reader = body.getReader();
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return total > 0 ? Buffer.concat(chunks) : null;
}
async function responseToImageDataUrl(response, maxBytes) {
  if (!response.ok) return null;
  const contentType = imageContentType(response);
  if (contentType == null) return null;
  const bytes = await readCappedImageBytes(response, maxBytes);
  if (bytes == null) return null;
  return `data:${contentType};base64,${bytes.toString("base64")}`;
}
var init_http_image = __esm({
  "src/shared/node/http-image.ts"() {
    "use strict";
  }
});

