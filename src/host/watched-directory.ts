var import_node_fs54 = require("node:fs");
var import_node_path95 = require("node:path");
init_errors();
init_system_errno();
var watchDirectoryWithNodeFs = (directory, onEvent) => (0, import_node_fs54.watch)(directory, { recursive: false }, (_eventType, filename) => {
  onEvent(filename);
});
function isSameDirectory(armed, onDisk) {
  return armed.dev === onDisk.dev && armed.ino === onDisk.ino && armed.birthtimeMs === onDisk.birthtimeMs;
}
var WatchedDirectory = class {
  constructor(root, debounce, watchDirectory = watchDirectoryWithNodeFs) {
    this.root = root;
    this.debounce = debounce;
    this.watchDirectory = watchDirectory;
  }
  root;
  debounce;
  watchDirectory;
  watchers = /* @__PURE__ */ new Map();
  notify;
  getLocation() {
    return this.root;
  }
  listSubdirectoryNames() {
    return this.listSubdirectoryNamesOf(this.root);
  }
  setOnChange(onChange) {
    this.notify?.dispose();
    this.notify = onChange == null ? void 0 : this.debounce.wrap(onChange);
    if (onChange == null) {
      this.stopWatching();
    } else {
      this.startWatching();
    }
  }
  startWatching() {
    if (this.watchers.size > 0) return;
    try {
      (0, import_node_fs54.mkdirSync)(this.root, { recursive: true });
    } catch (error42) {
      this.reportWatchUnavailable(error42);
      return;
    }
    this.watchDirectoryTree(this.root);
  }
  stopWatching() {
    for (const armed of this.watchers.values()) {
      armed.watcher.close();
    }
    this.watchers.clear();
    this.notify?.dispose();
    this.notify = void 0;
  }
  watchDirectoryTree(directory) {
    const entry = this.readDirectoryEntry(directory);
    if (entry.kind !== "directory") {
      this.unwatchSubtree(directory);
      return entry;
    }
    const armed = this.watchers.get(directory);
    if (armed !== void 0) {
      if (isSameDirectory(armed, entry.identity)) return entry;
      this.unwatchSubtree(directory);
    }
    this.armDirectory(directory, entry.identity);
    return entry;
  }
  armDirectory(directory, identity) {
    let watcher;
    try {
      watcher = this.watchDirectory(directory, (filename) => {
        this.onDirectoryEvent(directory, filename);
      });
    } catch (error42) {
      if (!isMissingPathError(error42)) this.reportWatchUnavailable(error42);
      return;
    }
    watcher.on("error", () => {
      this.unwatchSubtree(directory);
      this.scheduleNotify();
    });
    this.watchers.set(directory, { watcher, ...identity });
    this.watchSubdirectoriesOf(directory);
  }
  watchSubdirectoriesOf(directory) {
    for (const name17 of this.listSubdirectoryNamesOf(directory)) {
      this.watchDirectoryTree((0, import_node_path95.join)(directory, name17));
    }
  }
  readDirectoryEntry(path31) {
    try {
      const stats = (0, import_node_fs54.lstatSync)(path31);
      if (!stats.isDirectory()) return { kind: "other" };
      return {
        kind: "directory",
        identity: { dev: stats.dev, ino: stats.ino, birthtimeMs: stats.birthtimeMs }
      };
    } catch (error42) {
      reportFallbackUnlessAbsent("watched_directory", error42);
      return { kind: "missing" };
    }
  }
  listSubdirectoryNamesOf(directory) {
    let entries;
    try {
      entries = (0, import_node_fs54.readdirSync)(directory, { withFileTypes: true });
    } catch (error42) {
      reportFallbackUnlessAbsent("watched_directory", error42);
      return [];
    }
    return entries.filter((entry) => entry.isDirectory() && !entry.isSymbolicLink()).map((entry) => entry.name).sort();
  }
  onDirectoryEvent(directory, filename) {
    this.scheduleNotify();
    if (this.watchers.size === 0) return;
    if (filename == null) {
      if (this.watchDirectoryTree(directory).kind === "directory") {
        this.watchSubdirectoriesOf(directory);
      }
      return;
    }
    const entry = this.watchDirectoryTree((0, import_node_path95.join)(directory, filename.toString()));
    if (entry.kind === "missing") this.watchDirectoryTree(directory);
  }
  unwatchSubtree(path31) {
    const prefix = path31 + import_node_path95.sep;
    for (const [watched, armed] of this.watchers) {
      if (watched === path31 || watched.startsWith(prefix)) {
        armed.watcher.close();
        this.watchers.delete(watched);
      }
    }
  }
  reportWatchUnavailable(error42) {
    reportHostDiagnostic({
      kind: "watch_unavailable",
      errorClass: errorLogTag(error42)
    });
  }
  scheduleNotify() {
    this.notify?.();
  }
  writeFileAtomic(path31, contents) {
    writeFileAtomicSync(path31, contents);
    this.scheduleNotify();
  }
};
