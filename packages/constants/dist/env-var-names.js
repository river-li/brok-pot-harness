function validateBoxSecretKey(key) {
  if (!ENV_NAME_PATTERN.test(key)) {
    return `"${key}" is not a valid environment variable name`;
  }
  if (BOX_SECRET_RESERVED_EXACT_NAMES.has(key)) {
    return `${key} is reserved by the box runtime`;
  }
  for (const prefix of BOX_SECRET_RESERVED_NAME_PREFIXES) {
    if (key.startsWith(prefix)) {
      return `Names starting with ${prefix} are reserved by the box runtime`;
    }
  }
  if (CURSOR_SANDBOX_ENV_NAME_PATTERN.test(key)) {
    return `${key} is reserved by the box runtime`;
  }
  return null;
}
var ENV_NAME_PATTERN, CURSOR_SANDBOX_ENV_NAME_PATTERN, BOX_SECRET_RESERVED_EXACT_NAMES, BOX_SECRET_RESERVED_NAME_PREFIXES;
var init_env_var_names = __esm({
  "../packages/constants/dist/env-var-names.js"() {
    "use strict";
    init_cloud_agent();
    ENV_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
    CURSOR_SANDBOX_ENV_NAME_PATTERN = /CURSOR_SANDBOX/i;
    BOX_SECRET_RESERVED_EXACT_NAMES = /* @__PURE__ */ new Set([
      "PATH",
      "HOME",
      "USER",
      "SHELL",
      "TERM",
      "PWD",
      "DISPLAY",
      CLOUD_AGENT_INJECTED_SECRET_NAMES_ENV_VAR
    ]);
    BOX_SECRET_RESERVED_NAME_PREFIXES = ["SAND_", "__CURSOR", "LD_"];
  }
});
