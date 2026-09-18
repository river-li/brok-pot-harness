var ENV_VAR_PATTERN = /\$\{(?:env:([A-Za-z_][A-Za-z0-9_]*)|([^:}]+)(?::-([^}]*))?)\}/g;
function recordToCaseInsensitiveLookup(variables) {
  const variablesByLowercaseKey = new Map(Object.entries(variables).map(([key, value]) => [key.toLowerCase(), value]));
  return (key) => {
    var _a19;
    return (_a19 = variables[key]) !== null && _a19 !== void 0 ? _a19 : variablesByLowercaseKey.get(key.toLowerCase());
  };
}
function expandEnvVarsWithLookup(obj, envLookup) {
  const lookup3 = typeof envLookup === "function" ? envLookup : recordToCaseInsensitiveLookup(envLookup);
  return expandWithLookup(obj, lookup3);
}
function expandWithLookup(obj, lookup3) {
  if (typeof obj === "string") {
    return obj.replace(ENV_VAR_PATTERN, (match2, envVarName, varName, defaultValue) => {
      var _a19;
      if (envVarName !== void 0) {
        return (_a19 = lookup3(envVarName)) !== null && _a19 !== void 0 ? _a19 : match2;
      }
      const envValue = lookup3(varName);
      if (envValue !== void 0) {
        return envValue;
      }
      if (defaultValue !== void 0) {
        return defaultValue;
      }
      return match2;
    });
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => expandWithLookup(item, lookup3));
  }
  if (obj !== null && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = expandWithLookup(value, lookup3);
    }
    return result;
  }
  return obj;
}
