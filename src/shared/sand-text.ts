/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/sand-text.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function clampLine(raw, maxLength) {
  return raw.replace(/\s+/g, " ").trim().slice(0, maxLength);
}
function clampBlock(raw, maxLength) {
  return raw.trim().slice(0, maxLength);
}
function decapitalize(phrase) {
  const first = phrase[0];
  return first == null ? phrase : first.toLowerCase() + phrase.slice(1);
}
function slugifyName(name17, fallbackPrefix) {
  const slug = name17.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  return slug.length > 0 ? slug : `${fallbackPrefix}-${Date.now()}`;
}

