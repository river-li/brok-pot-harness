function resolveRipgrepFromPath() {
  const resolved = findActualExecutable("rg", []).cmd;
  return resolved !== "rg" ? resolved : void 0;
}
function configureRipgrepPath(path30) {
  if (!path30) {
    throw new Error("configureRipgrepPath: path must not be empty");
  }
  configuredPath = path30;
}
function findPathEnvKey(env) {
  const pathKeys = Object.keys(env).filter((key) => key.toLowerCase() === "path");
  if (pathKeys.length === 0) {
    return void 0;
  }
  if (process.platform === "win32") {
    return pathKeys.find((key) => key === "Path") ?? pathKeys[0];
  }
  return pathKeys.find((key) => key === "PATH") ?? pathKeys[0];
}
function getPathEnvValue(env) {
  const pathKey = findPathEnvKey(env);
  return pathKey !== void 0 ? env[pathKey] ?? "" : "";
}
function setPathEnvValue(env, pathValue) {
  const pathKey = findPathEnvKey(env) ?? (process.platform === "win32" ? "Path" : "PATH");
  const result = { ...env };
  for (const key of Object.keys(result)) {
    if (key !== pathKey && key.toLowerCase() === "path") {
      delete result[key];
    }
  }
  result[pathKey] = pathValue;
  return result;
}
function prependExecutableDirToPath(env, executablePath) {
  const executableDir = (0, import_node_path3.dirname)(executablePath);
  if (!executableDir || executableDir === ".") {
    return env;
  }
  const currentPathEntries = getPathEnvValue(env).split(import_node_path3.delimiter).filter(Boolean);
  const newPathValue = [
    executableDir,
    ...currentPathEntries.filter((entry) => entry !== executableDir)
  ].join(import_node_path3.delimiter);
  return setPathEnvValue(env, newPathValue);
}
function withConfiguredRipgrepEnv(env) {
  if (!configuredPath || !(0, import_node_path3.isAbsolute)(configuredPath)) {
    return env;
  }
  return {
    ...prependExecutableDirToPath(env, configuredPath),
    CURSOR_RIPGREP_PATH: configuredPath
  };
}
function getRipgrepBinaryPath() {
  if (!configuredPath) {
    throw new Error("Ripgrep path not configured. Call configureRipgrepPath() at startup.");
  }
  return configuredPath;
}
function isRipgrepConfigured() {
  return configuredPath !== void 0;
}
var import_node_path3, configuredPath;
var init_ripgrep = __esm({
  "../packages/shell-exec/dist/ripgrep.js"() {
    "use strict";
    import_node_path3 = require("node:path");
    init_dist3();
  }
});
