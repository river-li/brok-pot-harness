var import_node_fs6 = require("node:fs");
var import_node_path7 = require("node:path");
init_zod();
var SAND_FILES_MODES = ["local", "agent-store"];
var sourceEntrySchema = external_exports.object({
  sourceId: external_exports.string().min(1),
  mode: external_exports.enum(SAND_FILES_MODES)
});
var sourceMapSchema = external_exports.record(external_exports.string(), sourceEntrySchema);
function getSourceMapPath() {
  return (0, import_node_path7.join)(getSandRootDir(), "source-map.json");
}
var BOX_STORE_SOURCE_KEY = "box-store";
var SandSourceMap = class {
  constructor(path31 = getSourceMapPath()) {
    this.path = path31;
  }
  path;
  cache;
  async getOrCreate(agentId) {
    const map4 = await this.load();
    const existing = map4[agentId];
    if (existing != null) return existing;
    const entry = { sourceId: crypto.randomUUID(), mode: "local" };
    map4[agentId] = entry;
    await this.save(map4);
    return entry;
  }
  async getOrCreateBoxStore() {
    return this.getOrCreate(BOX_STORE_SOURCE_KEY);
  }
  async getBoxStore() {
    const map4 = await this.load();
    return map4[BOX_STORE_SOURCE_KEY] ?? null;
  }
  async setMode(agentId, mode) {
    const map4 = await this.load();
    const entry = map4[agentId] ?? {
      sourceId: crypto.randomUUID(),
      mode
    };
    const next = { sourceId: entry.sourceId, mode };
    map4[agentId] = next;
    await this.save(map4);
    return next;
  }
  async load() {
    if (this.cache != null) return this.cache;
    try {
      const raw = await import_node_fs6.promises.readFile(this.path, "utf8");
      const parsed2 = sourceMapSchema.safeParse(JSON.parse(raw));
      this.cache = parsed2.success ? { ...parsed2.data } : {};
    } catch (error42) {
      reportFallbackUnlessAbsent("source_map_service", error42);
      this.cache = {};
    }
    return this.cache;
  }
  async save(map4) {
    this.cache = map4;
    await writeFileAtomic(this.path, JSON.stringify(map4, null, 2));
  }
};
