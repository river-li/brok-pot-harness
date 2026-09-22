/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/browser-ua/web-bot-auth-marker-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises48 = __toESM(require("node:fs/promises"), 1);
init_errors();
var WEB_BOT_AUTH_MARKER_PATH = "/tmp/sand-web-bot-auth";
var WEB_BOT_AUTH_XHR_FETCH_MARKER_PATH = "/tmp/sand-web-bot-auth-xhr-fetch";
var WEB_BOT_AUTH_IFRAMES_MARKER_PATH = "/tmp/sand-web-bot-auth-iframes";
function createWebBotAuthMarkerReconciler(options2) {
  const path31 = options2.path ?? WEB_BOT_AUTH_MARKER_PATH;
  let lastApplied = null;
  let queue = Promise.resolve();
  const applyOnce = async () => {
    const enabled = options2.isEnabled();
    if (enabled && lastApplied === true) return;
    try {
      if (enabled) {
        await import_promises48.default.writeFile(path31, "1\n", { encoding: "utf8", mode: 420 });
      } else {
        await import_promises48.default.rm(path31, { force: true, recursive: true });
      }
      lastApplied = enabled;
    } catch (error42) {
      options2.log(`web-bot-auth marker update failed: ${errorLogTag(error42)}`);
    }
  };
  return () => {
    queue = queue.then(applyOnce);
    return queue;
  };
}

