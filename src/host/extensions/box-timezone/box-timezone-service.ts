var import_node_child_process11 = require("node:child_process");
var import_node_fs55 = require("node:fs");
var import_node_util9 = require("node:util");
init_errors();
var runCommand = (0, import_node_util9.promisify)(import_node_child_process11.execFile);
var SAND_BOX_TIMEZONE_COMMAND = "/usr/local/bin/sand-box-timezone";
var COMMAND_TIMEOUT_MS = 15e3;
function createBoxTimezoneApplier(options2) {
  const commandPath = options2.commandPath ?? SAND_BOX_TIMEZONE_COMMAND;
  if (!(0, import_node_fs55.existsSync)(commandPath)) return void 0;
  return async (timeZone) => {
    const { stdout } = await runCommand(commandPath, ["apply", timeZone], {
      timeout: COMMAND_TIMEOUT_MS
    });
    const line = stdout.trim();
    if (line.length > 0) options2.log(`box-timezone: ${line}`);
  };
}
function createBoxTimezoneService(deps) {
  let unsubscribe;
  let applied;
  let pending;
  let inFlight;
  let disposed = false;
  const drain = async () => {
    while (!disposed && pending !== void 0 && pending !== applied) {
      const timeZone = pending;
      try {
        await deps.applyZone(timeZone);
        applied = timeZone;
      } catch (error41) {
        deps.log(
          `box-timezone: could not set the box clock to ${timeZone} (${errorLogTag(error41)})`
        );
        if (pending === timeZone) pending = void 0;
      }
    }
  };
  const request3 = (timeZone) => {
    if (disposed || timeZone === void 0) return;
    pending = timeZone;
    if (inFlight === void 0) {
      inFlight = drain().finally(() => {
        inFlight = void 0;
      });
    }
  };
  return {
    start() {
      unsubscribe = deps.subscribeToUserTimeZone(request3);
      request3(deps.getUserTimeZone());
    },
    dispose() {
      disposed = true;
      unsubscribe?.();
      unsubscribe = void 0;
    },
    settled: () => inFlight ?? Promise.resolve()
  };
}
