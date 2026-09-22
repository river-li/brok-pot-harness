/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/rebuilt-entries.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var REBUILT_ENTRY_ID_PREFIX = "recovered-";
function rebuiltEntryId(outlineItemId) {
  return `${REBUILT_ENTRY_ID_PREFIX}${outlineItemId}`;
}
function isRebuiltEntry(entry) {
  return entry.id.startsWith(REBUILT_ENTRY_ID_PREFIX);
}

