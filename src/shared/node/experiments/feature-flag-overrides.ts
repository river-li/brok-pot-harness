/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/experiments/feature-flag-overrides.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs59 = require("node:fs");
var import_node_path103 = require("node:path");
init_scheduling();
init_errors();
var FEATURE_FLAG_OVERRIDES_FILENAME = "sand-feature-flag-overrides.json";
var FEATURE_FLAG_OVERRIDE_TTL_MS = 24 * 60 * 60 * 1e3;
function isStoredFeatureFlagOverride(entry) {
  return typeof entry === "object" && entry != null && "value" in entry && typeof entry.value === "boolean" && "expiresAtMs" in entry && typeof entry.expiresAtMs === "number";
}
var SandFeatureFlagOverrideStore = class {
  constructor(getCacheDir, flags, clock = realClock) {
    this.getCacheDir = getCacheDir;
    this.flags = flags;
    this.clock = clock;
  }
  getCacheDir;
  flags;
  clock;
  overrides = /* @__PURE__ */ new Map();
  isFlagName(name17) {
    return isKeyOf(this.flags, name17);
  }
  getOverridesPath() {
    return (0, import_node_path103.join)(this.getCacheDir(), FEATURE_FLAG_OVERRIDES_FILENAME);
  }
  hydrateFromDisk() {
    try {
      const path31 = this.getOverridesPath();
      if (!(0, import_node_fs59.existsSync)(path31)) return;
      const parsed2 = JSON.parse((0, import_node_fs59.readFileSync)(path31, "utf-8"));
      if (parsed2 == null || typeof parsed2 !== "object" || !("overrides" in parsed2)) return;
      const overrides = parsed2.overrides;
      if (overrides == null || typeof overrides !== "object") return;
      const now = this.clock.now();
      for (const [name17, entry] of Object.entries(overrides)) {
        if (!this.isFlagName(name17)) continue;
        if (!isStoredFeatureFlagOverride(entry)) continue;
        if (entry.expiresAtMs <= now) continue;
        this.overrides.set(name17, {
          value: entry.value,
          expiresAtMs: entry.expiresAtMs
        });
      }
    } catch (error42) {
      reportExperimentsDiagnostic({
        kind: "overrides_load_failed",
        errorClass: errorLogTag(error42)
      });
    }
  }
  async persist() {
    try {
      const path31 = this.getOverridesPath();
      const overrides = {};
      for (const [name17, entry] of this.overrides) {
        overrides[name17] = entry;
      }
      await writeFileAtomic(path31, JSON.stringify({ overrides }));
    } catch (error42) {
      reportExperimentsDiagnostic({
        kind: "overrides_persist_failed",
        errorClass: errorLogTag(error42)
      });
    }
  }
  read(name17) {
    const entry = this.overrides.get(name17);
    if (entry == null) return void 0;
    if (entry.expiresAtMs <= this.clock.now()) {
      this.overrides.delete(name17);
      return void 0;
    }
    return entry.value;
  }
  activeOverrides() {
    const result = /* @__PURE__ */ new Map();
    const now = this.clock.now();
    for (const [name17, entry] of this.overrides) {
      if (entry.expiresAtMs > now) result.set(name17, entry.value);
    }
    return result;
  }
  activeRecord() {
    const record2 = {};
    for (const [name17, value] of this.activeOverrides()) {
      record2[name17] = value;
    }
    return record2;
  }
  get size() {
    return this.overrides.size;
  }
  set(name17, value) {
    if (this.flags[name17] == null) return false;
    this.overrides.set(name17, {
      value,
      expiresAtMs: this.clock.now() + FEATURE_FLAG_OVERRIDE_TTL_MS
    });
    return true;
  }
  clear(name17) {
    return this.overrides.delete(name17);
  }
  clearAll() {
    this.overrides.clear();
  }
  setAllToBundledDefaults() {
    const expiresAtMs = this.clock.now() + FEATURE_FLAG_OVERRIDE_TTL_MS;
    for (const name17 of Object.keys(this.flags)) {
      if (!this.isFlagName(name17)) continue;
      this.overrides.set(name17, {
        value: this.flags[name17]?.default ?? false,
        expiresAtMs
      });
    }
  }
  replaceAll(overrides) {
    const expiresAtMs = this.clock.now() + FEATURE_FLAG_OVERRIDE_TTL_MS;
    this.overrides.clear();
    for (const [name17, value] of Object.entries(overrides)) {
      if (typeof value !== "boolean" || !this.isFlagName(name17)) continue;
      this.overrides.set(name17, { value, expiresAtMs });
    }
  }
};

