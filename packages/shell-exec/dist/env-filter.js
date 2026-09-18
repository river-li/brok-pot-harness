function filterElectronEnv(env) {
  const sourceEnv = env || process.env;
  const { ELECTRON_RUN_AS_NODE, ...filteredEnv } = sourceEnv;
  return filteredEnv;
}
function scrubSocketEnvVars(env) {
  const result = { ...env };
  for (const key of SOCKET_ENV_VARS_TO_SCRUB) {
    delete result[key];
  }
  return result;
}
var SOCKET_ENV_VARS_TO_SCRUB;
var init_env_filter = __esm({
  "../packages/shell-exec/dist/env-filter.js"() {
    "use strict";
    SOCKET_ENV_VARS_TO_SCRUB = [
      "SSH_AUTH_SOCK",
      "DBUS_SESSION_BUS_ADDRESS",
      "XDG_RUNTIME_DIR",
      "WAYLAND_DISPLAY"
    ];
  }
});
