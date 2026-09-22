/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/admin-command-denylist.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isAdminCommandDenylistSeparator(character) {
  return character === " " || character === "	" || character === "\n" || character === "\r" || character === "\xA0" || character === "\u200B" || character === "\u200C" || character === "\u200D" || character === "\uFEFF";
}
function normalizeAdminCommandDenylistText(value) {
  let result = "";
  let pendingSeparator = false;
  for (const character of value) {
    if (isAdminCommandDenylistSeparator(character)) {
      pendingSeparator = true;
      continue;
    }
    if (pendingSeparator && result.length > 0) {
      result += " ";
    }
    pendingSeparator = false;
    result += character;
  }
  return result;
}
function getAdminCommandDenylistRuleError(rule) {
  const trimmed = normalizeAdminCommandDenylistText(rule).trim();
  if (trimmed.length === 0) {
    return "Rule cannot be empty";
  }
  if (trimmed.length > ADMIN_COMMAND_DENYLIST_MAX_RULE_LENGTH) {
    return `Rule cannot exceed ${ADMIN_COMMAND_DENYLIST_MAX_RULE_LENGTH} characters`;
  }
  if (isOnlyWildcards(trimmed)) {
    return "Rule cannot match every command; be more specific than wildcards alone";
  }
  if (trimmed.startsWith(":")) {
    return "Colon rules need an executable before `:` (e.g. `aws:*s3 rm*`)";
  }
  const colonRule = parseAdminCommandDenylistColonRule(trimmed);
  if (colonRule !== void 0) {
    const { executablePattern, argsPattern } = colonRule;
    if (isOnlyWildcards(executablePattern) && (argsPattern.length === 0 || isOnlyWildcards(argsPattern))) {
      return "Rule cannot match every command; narrow the executable or argument pattern";
    }
  }
  return null;
}
function isOnlyWildcards(value) {
  return value.length > 0 && [...value].every((character) => character === "*");
}
function parseAdminCommandDenylistColonRule(rule) {
  const colonIndex = rule.indexOf(":");
  if (colonIndex <= 0)
    return void 0;
  const executablePattern = rule.slice(0, colonIndex).trim();
  if ([...executablePattern].some((character) => character.trim().length === 0)) {
    return void 0;
  }
  return {
    executablePattern,
    argsPattern: rule.slice(colonIndex + 1).trim()
  };
}
var ADMIN_COMMAND_DENYLIST_MAX_RULE_LENGTH;
var init_admin_command_denylist = __esm({
  "../packages/utils/dist/admin-command-denylist.js"() {
    "use strict";
    ADMIN_COMMAND_DENYLIST_MAX_RULE_LENGTH = 512;
  }
});

