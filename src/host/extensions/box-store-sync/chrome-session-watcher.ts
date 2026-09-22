/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/chrome-session-watcher.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs20 = require("node:fs");
var import_node_path21 = require("node:path");
init_errors();
init_system_errno();
var ChromeSessionWatcher = class {
  constructor(deps) {
    this.deps = deps;
    this.startWatch = deps.startWatch ?? ((dir, listener) => (0, import_node_fs20.watch)(
      dir,
      { persistent: false },
      (_event, name17) => listener(typeof name17 === "string" ? name17 : null)
    ));
    this.trigger = deps.debounce.wrap(() => {
      if (this.stopped) return;
      try {
        this.deps.onSessionChange();
      } catch (error42) {
        this.log(`onSessionChange threw (ignored): ${errorLogTag(error42)}`);
      }
    });
    this.statMtimeMs = deps.statMtimeMs ?? ((path31) => {
      try {
        return (0, import_node_fs20.statSync)(path31).mtimeMs;
      } catch (error42) {
        if (!isMissingPathError(error42))
          reportBoxStoreDiagnostic({
            extension: "box_store",
            kind: "chrome_session_stat_failed",
            errorClass: errorLogTag(error42)
          });
        return void 0;
      }
    });
    this.log = deps.log;
  }
  deps;
  watcher;
  stopped = false;
  startWatch;
  trigger;
  statMtimeMs;
  log;
  lastMtimes = /* @__PURE__ */ new Map();
  start() {
    if (this.stopped || this.watcher !== void 0) return;
    this.refreshSessionDbMtimes();
    try {
      this.watcher = this.startWatch(this.deps.watchDir, (name17) => this.handleFsEvent(name17));
      this.log(`watching ${this.deps.watchDir} for session-db changes`);
    } catch (error42) {
      this.log(`watch could not arm (periodic cycle is the backstop): ${errorLogTag(error42)}`);
    }
  }
  handleFsEvent(filename) {
    if (this.stopped) return;
    if (filename === null) {
      if (!this.sessionDbChangedSinceLastCheck()) return;
    } else if (!this.isSessionDbFile(filename)) {
      return;
    }
    this.trigger();
  }
  isSessionDbFile(filename) {
    return this.deps.sessionDbNames.some((name17) => filename.startsWith(name17));
  }
  sessionDbChangedSinceLastCheck() {
    let changed = false;
    for (const name17 of this.deps.sessionDbNames) {
      const mtime = this.statMtimeMs((0, import_node_path21.join)(this.deps.watchDir, name17));
      if (mtime === void 0) continue;
      const last = this.lastMtimes.get(name17);
      if (last === void 0 || mtime > last) {
        this.lastMtimes.set(name17, mtime);
        changed = true;
      }
    }
    return changed;
  }
  refreshSessionDbMtimes() {
    for (const name17 of this.deps.sessionDbNames) {
      const mtime = this.statMtimeMs((0, import_node_path21.join)(this.deps.watchDir, name17));
      if (mtime !== void 0) this.lastMtimes.set(name17, mtime);
    }
  }
  stop() {
    this.stopped = true;
    this.trigger.dispose();
    try {
      this.watcher?.close();
    } catch {
    }
    this.watcher = void 0;
  }
};

