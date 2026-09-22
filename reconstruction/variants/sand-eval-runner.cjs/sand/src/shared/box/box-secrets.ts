/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/box/box-secrets.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_cloud_agent();
var ENV_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
var RESERVED_EXACT_NAMES = /* @__PURE__ */ new Set([
  "PATH",
  "HOME",
  "USER",
  "SHELL",
  "TERM",
  "PWD",
  "DISPLAY",
  CLOUD_AGENT_INJECTED_SECRET_NAMES_ENV_VAR
]);
var RESERVED_NAME_PREFIXES = ["SAND_", "__CURSOR", "LD_"];
var CURSOR_SANDBOX_NAME_PATTERN = /CURSOR_SANDBOX/i;
var MAX_BOX_SECRET_VALUE_LENGTH = 32 * 1024;
var MAX_BOX_SECRETS_TOTAL_LENGTH = 96 * 1024;
function validateBoxSecretKey(key) {
  if (!ENV_NAME_PATTERN.test(key)) {
    return `"${key}" is not a valid environment variable name`;
  }
  if (RESERVED_EXACT_NAMES.has(key)) {
    return `${key} is reserved by the box runtime`;
  }
  for (const prefix of RESERVED_NAME_PREFIXES) {
    if (key.startsWith(prefix)) {
      return `Names starting with ${prefix} are reserved by the box runtime`;
    }
  }
  if (CURSOR_SANDBOX_NAME_PATTERN.test(key)) {
    return `${key} is reserved by the box runtime`;
  }
  return null;
}

