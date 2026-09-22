var import_node_fs57 = require("node:fs");
init_dist4();
init_system_errno();
async function statIsFile(boxPath) {
  try {
    return (await import_node_fs57.promises.stat(boxPath)).isFile();
  } catch (error42) {
    if (findSystemErrno(error42) === "ENOENT" || findSystemErrno(error42) === "ENOTDIR") {
      return false;
    }
    throw error42;
  }
}
function plannedFromArtifactFiles(files) {
  return files.map((file2) => ({
    artifact: { path: file2.absolutePath, sizeBytes: file2.sizeBytes },
    boxPath: file2.boxPath
  }));
}
var CloudAgentArtifactCache = class {
  constructor(deps) {
    this.deps = deps;
    this.isBoxFilePresent = deps.isBoxFilePresent ?? statIsFile;
  }
  deps;
  ctx = createContext().withName("cloudAgentArtifacts");
  inflight = /* @__PURE__ */ new Map();
  isBoxFilePresent;
  async syncPlanned(agentId, bcId, planned) {
    const pending = this.inflight.get(bcId);
    const start = () => this.syncMissing(agentId, bcId, planned);
    const run = (pending === void 0 ? start() : pending.then(start, start)).finally(() => {
      if (this.inflight.get(bcId) === run) this.inflight.delete(bcId);
    });
    this.inflight.set(bcId, run);
    return await run;
  }
  async syncMissing(agentId, bcId, planned) {
    const { present, missing } = await this.partitionByPresence(planned);
    if (missing.length === 0) {
      return { synced: present, skipped: [] };
    }
    const outcome = await syncCloudAgentArtifactsToBox({
      api: this.deps.api,
      writeBoxFile: (boxPath, data) => this.deps.box.uploadFile(this.ctx, agentId, boxPath, data),
      bcId,
      planned: missing
    });
    return { synced: [...present, ...outcome.synced], skipped: outcome.skipped };
  }
  async ensure(agentId, bcId) {
    if (!this.deps.isEnabled()) return [];
    const info2 = await this.deps.api.getInfo(bcId, { includeFiles: false, includeArtifacts: true });
    const artifacts = info2?.artifacts;
    if (artifacts === void 0 || artifacts.kind !== "listed") return [];
    const outcome = await this.syncPlanned(
      agentId,
      bcId,
      plannedFromArtifactFiles(artifacts.files)
    );
    const failedVmPaths = new Set(outcome.skipped.map((entry) => entry.path));
    return artifacts.files.map((file2) => ({
      boxPath: file2.boxPath,
      state: failedVmPaths.has(file2.absolutePath) ? "failed" : "present"
    }));
  }
  async partitionByPresence(planned) {
    const present = [];
    const missing = [];
    const presence = await Promise.all(
      planned.map((entry) => this.isBoxFilePresent(entry.boxPath))
    );
    for (const [index, entry] of planned.entries()) {
      if (presence[index] === true) {
        present.push({ boxPath: entry.boxPath, sizeBytes: entry.artifact.sizeBytes });
      } else {
        missing.push(entry);
      }
    }
    return { present, missing };
  }
};
