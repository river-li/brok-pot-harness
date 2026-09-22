var import_promises47 = __toESM(require("node:fs/promises"), 1);
init_errors();
function createUaTokenKillSwitchReconciler(options2) {
  const path31 = options2.path ?? UA_TOKEN_DISABLED_MARKER_PATH;
  let lastApplied = null;
  let queue = Promise.resolve();
  const applyOnce = async () => {
    const disabled = options2.isKillSwitchEnabled();
    if (disabled === lastApplied) return;
    try {
      if (disabled) {
        await import_promises47.default.writeFile(path31, "1\n", { encoding: "utf8", mode: 420 });
      } else {
        await import_promises47.default.rm(path31, { force: true });
      }
      lastApplied = disabled;
    } catch (error42) {
      options2.log(`ua-token kill-switch marker update failed: ${errorLogTag(error42)}`);
    }
  };
  return () => {
    queue = queue.then(applyOnce);
    return queue;
  };
}
