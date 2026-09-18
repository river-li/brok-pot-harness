function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function matchesCommandGlob(pattern, value) {
  const trimmedPattern = pattern.trim();
  const escapedPattern = escapeRegExp2(trimmedPattern);
  const regexSource = `^${escapedPattern.replace(/\\\*/g, ".*")}$`;
  try {
    return new RegExp(regexSource).test(value);
  } catch (_a20) {
    return trimmedPattern === value;
  }
}
var init_command_glob = __esm({
  "../packages/utils/dist/command-glob.js"() {
    "use strict";
  }
});
