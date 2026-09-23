var CUSTOM_MODE_ID_PREFIX2 = "custom-mode:";
function getCustomModeId(fullPath) {
  return `${CUSTOM_MODE_ID_PREFIX2}${fullPath}`;
}
var UNHYDRATED_CUSTOM_MODE_SOURCE_PATH_PREFIX2 = "unhydrated:";
function encodeUnhydratedCustomModeSourcePath(slashName) {
  return `${UNHYDRATED_CUSTOM_MODE_SOURCE_PATH_PREFIX2}${slashName.trim()}`;
}
