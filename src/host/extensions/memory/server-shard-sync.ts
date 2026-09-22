/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/memory/server-shard-sync.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs75 = require("node:fs");
var import_node_path124 = require("node:path");
init_grok_bot_pb();
var SERVER_SHARD_SYNC_POLL_INTERVAL_MS = 5 * 60 * 1e3;
var SERVER_SHARD_SYNC_RPC_TIMEOUT_MS = 15e3;
var MEMORY_LOG_FILE_NAME = /^\d{4}-\d{2}\.md$/;
function readText2(path31) {
  return (0, import_node_fs75.existsSync)(path31) ? (0, import_node_fs75.readFileSync)(path31, "utf8") : "";
}
function listLogFileNames(logDir) {
  return (0, import_node_fs75.existsSync)(logDir) ? (0, import_node_fs75.readdirSync)(logDir).filter((name17) => MEMORY_LOG_FILE_NAME.test(name17)).sort() : [];
}
function readFolder(dir) {
  const logDir = (0, import_node_path124.join)(dir, MEMORY_LOG_DIRNAME);
  const logs = /* @__PURE__ */ new Map();
  for (const name17 of listLogFileNames(logDir)) {
    logs.set(name17, readText2((0, import_node_path124.join)(logDir, name17)));
  }
  return { profile: readText2((0, import_node_path124.join)(dir, MEMORY_PROFILE_FILENAME)), logs };
}
function writeFolder(dir, folder) {
  const logDir = (0, import_node_path124.join)(dir, MEMORY_LOG_DIRNAME);
  (0, import_node_fs75.mkdirSync)(logDir, { recursive: true });
  if (folder.profile.length > 0) {
    writeFileAtomicSync((0, import_node_path124.join)(dir, MEMORY_PROFILE_FILENAME), folder.profile);
  } else {
    (0, import_node_fs75.rmSync)((0, import_node_path124.join)(dir, MEMORY_PROFILE_FILENAME), { force: true });
  }
  const keep = /* @__PURE__ */ new Set();
  for (const [name17, raw] of Object.entries(folder.logs)) {
    if (!MEMORY_LOG_FILE_NAME.test(name17)) continue;
    keep.add(name17);
    writeFileAtomicSync((0, import_node_path124.join)(logDir, name17), raw);
  }
  for (const name17 of listLogFileNames(logDir)) {
    if (!keep.has(name17)) (0, import_node_fs75.rmSync)((0, import_node_path124.join)(logDir, name17), { force: true });
  }
}
function toFolder(files) {
  const logs = {};
  for (const [name17, raw] of files.logs) logs[name17] = raw;
  return { profile: files.profile, logs };
}
var ServerShardSync = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  pushes = Promise.resolve();
  report(event, error42) {
    this.options.report?.(event, error42);
  }
  async pullAll() {
    const shardsDir = getUserMemoryShardsDir(this.options.sandRoot);
    await this.options.client.listGrokBotMemoryShards({}, { timeoutMs: SERVER_SHARD_SYNC_RPC_TIMEOUT_MS }).then(({ shards }) => {
      for (const shard of shards) {
        if (!isSafeFolderId(shard.agentId)) continue;
        if (shard.harness !== GrokBotAgentHarnessKind.TEMPORAL || shard.folder == null) continue;
        writeFolder((0, import_node_path124.join)(shardsDir, shard.agentId), shard.folder);
      }
    }).then(void 0, (error42) => this.report("pull_user", error42));
  }
  pushUserShard(agentId) {
    const dir = getUserMemoryShardDir(this.options.sandRoot, agentId);
    this.pushes = this.pushes.then(async () => {
      await this.options.client.putGrokBotMemoryShard(
        { agentId, folder: toFolder(readFolder(dir)) },
        { timeoutMs: SERVER_SHARD_SYNC_RPC_TIMEOUT_MS }
      );
    }).then(void 0, (error42) => this.report("push_user", error42));
  }
  async flush() {
    await this.pushes;
  }
};

