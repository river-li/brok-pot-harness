/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/state-backstop/state-backstop-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs87 = require("node:fs");
var import_node_path144 = require("node:path");
init_errors();
var SAND_STATE_BACKSTOP_REL_PATH = "state/store.db";
var DEFAULT_MAX_SNAPSHOT_BYTES = 64 * 1024 * 1024;
var STATE_BACKSTOP_DEBOUNCE_MS = 5e3;
function readStoreDbBytes(dbPath) {
  if (!(0, import_node_fs87.existsSync)(dbPath)) return null;
  checkpointSandAgentDb(dbPath);
  return (0, import_node_fs87.readFileSync)(dbPath);
}
var SandStateBackstop = class {
  constructor(deps) {
    this.deps = deps;
    this.agentsRootDir = deps.agentsRootDir ?? getSandAgentsRootDir();
    this.maxSnapshotBytes = deps.maxSnapshotBytes ?? DEFAULT_MAX_SNAPSHOT_BYTES;
    this.readDbBytes = deps.readDbBytes ?? readStoreDbBytes;
    this.log = deps.log ?? ((message) => console.log(`[sand-state-backstop] ${message}`));
  }
  deps;
  agentsRootDir;
  maxSnapshotBytes;
  readDbBytes;
  log;
  pending = /* @__PURE__ */ new Map();
  disposed = false;
  dbPathFor(agentId) {
    return (0, import_node_path144.join)(this.agentsRootDir, agentId, "store.db");
  }
  scheduleSnapshot(agentId) {
    if (this.disposed) return;
    let trigger2 = this.pending.get(agentId);
    if (trigger2 === void 0) {
      trigger2 = this.deps.debounce.wrap(() => {
        void this.snapshotNow(agentId).catch((error42) => {
          this.log(`snapshot rejected for ${agentId}: ${errorMessage(error42)}`);
        });
      });
      this.pending.set(agentId, trigger2);
    }
    trigger2();
  }
  async snapshotNow(agentId) {
    try {
      const bytes = this.readDbBytes(this.dbPathFor(agentId));
      if (bytes == null) {
        return { status: "skipped", reason: "no store.db" };
      }
      if (bytes.byteLength > this.maxSnapshotBytes) {
        const reason = `store.db ${bytes.byteLength}B over ${this.maxSnapshotBytes}B cap`;
        this.log(`skip ${agentId}: ${reason}`);
        return { status: "skipped", reason };
      }
      const { sourceId } = await this.deps.sourceMap.getOrCreate(agentId);
      await this.deps.objectStoreProvider.forStore(sourceId).put(SAND_STATE_BACKSTOP_REL_PATH, bytes);
      this.log(`uploaded ${agentId} (${bytes.byteLength}B)`);
      return { status: "uploaded", bytes: bytes.byteLength };
    } catch (error42) {
      const message = errorMessage(error42);
      this.log(`snapshot ${agentId} failed: ${message}`);
      return { status: "error", error: message };
    }
  }
  async readSnapshot(agentId) {
    const { sourceId } = await this.deps.sourceMap.getOrCreate(agentId);
    return this.deps.objectStoreProvider.forStore(sourceId).get(SAND_STATE_BACKSTOP_REL_PATH);
  }
  async dispose() {
    this.disposed = true;
    for (const trigger2 of this.pending.values()) trigger2.dispose();
    this.pending.clear();
  }
};

