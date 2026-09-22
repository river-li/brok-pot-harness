/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/desktop/external-url-policy.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function externalUrl(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
function isHttpExternalUrl(value) {
  const url2 = externalUrl(value);
  return url2?.protocol === "http:" || url2?.protocol === "https:";
}

