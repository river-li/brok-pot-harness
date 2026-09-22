/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/browser-ua/fingerprint-spoof-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises46 = __toESM(require("node:fs/promises"), 1);
init_errors();
function createFingerprintSpoofReconciler(options2) {
  const path31 = options2.path ?? BROWSER_FINGERPRINT_SPOOF_MARKER_PATH;
  let lastApplied = null;
  let queue = Promise.resolve();
  const applyOnce = async () => {
    const enabled = options2.isEnabled();
    const profile = enabled ? options2.profileName() : null;
    if (profile != null && profile === lastApplied) return;
    try {
      if (profile != null) {
        await import_promises46.default.writeFile(path31, `${profile}
`, { encoding: "utf8", mode: 420 });
      } else {
        await import_promises46.default.rm(path31, { force: true, recursive: true });
      }
      lastApplied = profile;
    } catch (error42) {
      options2.log(`fingerprint-spoof marker update failed: ${errorLogTag(error42)}`);
    }
  };
  return () => {
    queue = queue.then(applyOnce, applyOnce);
    return queue;
  };
}

