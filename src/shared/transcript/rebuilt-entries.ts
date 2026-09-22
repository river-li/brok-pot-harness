var REBUILT_ENTRY_ID_PREFIX = "recovered-";
function rebuiltEntryId(outlineItemId) {
  return `${REBUILT_ENTRY_ID_PREFIX}${outlineItemId}`;
}
function isRebuiltEntry(entry) {
  return entry.id.startsWith(REBUILT_ENTRY_ID_PREFIX);
}
