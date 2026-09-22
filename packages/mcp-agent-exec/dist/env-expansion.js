/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/env-expansion.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ENV_VAR_PATTERN = /\$\{(?:env:([A-Za-z_][A-Za-z0-9_]*)|([^:}]+)(?::-([^}]*))?)\}/g;
function expandString(value, envLookup) {
  return value.replace(ENV_VAR_PATTERN, (match2, envPrefixVar, plainVar, defaultValue) => {
    if (envPrefixVar !== void 0) {
      const envValue2 = envLookup(envPrefixVar);
      return envValue2 !== void 0 ? envValue2 : match2;
    }
    const envValue = envLookup(plainVar);
    if (envValue !== void 0) {
      return envValue;
    }
    if (defaultValue !== void 0) {
      return defaultValue;
    }
    return match2;
  });
}
function expandEnvVarsWithLookup2(obj, envLookup) {
  if (typeof obj === "string") {
    return expandString(obj, envLookup);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => expandEnvVarsWithLookup2(item, envLookup));
  }
  if (obj !== null && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = expandEnvVarsWithLookup2(value, envLookup);
    }
    return result;
  }
  return obj;
}

