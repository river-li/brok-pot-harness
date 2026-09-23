var import_node_fs69 = require("node:fs");
var DEFAULT_CAPACITY = 2048;
var RACY_MTIME_TICK_WINDOW_MS = 2e3;
function mtimeTickCouldStillHideAnEdit(fingerprint2, nowMs2) {
  return nowMs2 - fingerprint2.newestMtimeMs < RACY_MTIME_TICK_WINDOW_MS;
}
function fingerprintOf(paths) {
  const parts = [];
  let newestMtimeMs = 0;
  for (const path31 of paths) {
    const stats = (0, import_node_fs69.statSync)(path31, { bigint: true, throwIfNoEntry: false });
    if (stats == null) return null;
    parts.push(`${stats.ino}:${stats.mtimeNs}:${stats.size}`);
    newestMtimeMs = Math.max(newestMtimeMs, Number(stats.mtimeNs / BigInt(1e6)));
  }
  return { statKey: parts.join("|"), newestMtimeMs };
}
var StatKeyedParseCache = class {
  constructor(capacity = DEFAULT_CAPACITY, nowMs2 = () => Date.now()) {
    this.capacity = capacity;
    this.nowMs = nowMs2;
  }
  capacity;
  nowMs;
  entries = /* @__PURE__ */ new Map();
  read(statPaths, parse11) {
    const cacheKey3 = statPaths.join("\0");
    let fingerprint2;
    try {
      fingerprint2 = fingerprintOf(statPaths);
    } catch {
      return parse11();
    }
    if (fingerprint2 == null) {
      this.entries.delete(cacheKey3);
      return null;
    }
    const hit = this.entries.get(cacheKey3);
    if (hit != null && hit.statKey === fingerprint2.statKey) return hit.value;
    const value = parse11();
    this.entries.delete(cacheKey3);
    if (mtimeTickCouldStillHideAnEdit(fingerprint2, this.nowMs())) {
      return value;
    }
    if (this.entries.size >= this.capacity) {
      const oldest = this.entries.keys().next().value;
      if (oldest != null) this.entries.delete(oldest);
    }
    this.entries.set(cacheKey3, { statKey: fingerprint2.statKey, value });
    return value;
  }
};
