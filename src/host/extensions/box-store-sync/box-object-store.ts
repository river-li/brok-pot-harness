var AgentStoreObjectStoreProvider = class {
  constructor(deps) {
    this.deps = deps;
    this.clientInstance = deps.client;
  }
  deps;
  clientInstance;
  mutableEtags = new AgentStoreMutableWriteEtags();
  forStore(storeId) {
    return new AgentStoreObjectStore(this.deps.backend, this.client(), storeId, this.mutableEtags);
  }
  client() {
    this.clientInstance ??= createAgentStoreClient({
      backend: this.deps.backend,
      getAccessToken: this.deps.getAccessToken ?? (() => {
        invariant(false, "AgentStoreObjectStore: no getAccessToken provided");
      }),
      getMachineId: this.deps.getMachineId ?? (() => {
        invariant(false, "AgentStoreObjectStore: no getMachineId provided");
      }),
      getTeamId: this.deps.getTeamId
    });
    return this.clientInstance;
  }
};
var PREFETCHED_READ_FRESHNESS_MARGIN_MS2 = 3e4;
var AgentStoreObjectStore = class {
  constructor(backend, client, storeId, mutableEtags) {
    this.backend = backend;
    this.client = client;
    this.storeId = storeId;
    this.mutableEtags = mutableEtags;
  }
  backend;
  client;
  storeId;
  mutableEtags;
  prefetchedReads = /* @__PURE__ */ new Map();
  async prefetchReads(keys) {
    const presigned = await presignAgentStoreReadBatch(this.client, this.storeId, keys);
    for (const [key, url2] of presigned) {
      this.prefetchedReads.set(key, url2);
    }
  }
  takePrefetchedRead(key) {
    const cached2 = this.prefetchedReads.get(key);
    if (cached2 == null) return void 0;
    this.prefetchedReads.delete(key);
    return cached2.expiresAtMs - Date.now() > PREFETCHED_READ_FRESHNESS_MARGIN_MS2 ? cached2 : void 0;
  }
  async get(key) {
    const cached2 = this.takePrefetchedRead(key);
    if (cached2 != null) {
      try {
        const viaCache = await fetchAgentStoreObjectFromUrl(cached2.url, key);
        if (viaCache != null) return viaCache;
      } catch {
      }
    }
    return getAgentStoreObject(this.client, this.storeId, key);
  }
  async put(key, bytes, opts) {
    if (opts?.contentAddressed === true) {
      await putAgentStoreObjectContentAddressed({
        client: this.client,
        sourceId: this.storeId,
        relPath: key,
        data: bytes
      });
      return;
    }
    const result = await putAgentStoreObject({
      backend: this.backend,
      client: this.client,
      sourceId: this.storeId,
      relPath: key,
      data: bytes,
      etags: this.mutableEtags
    });
    if (result.outcome === "conflict") {
      throw new BoxStoreCanonicalWriteConflictError({
        key,
        conflictRelPath: result.conflictRelPath,
        baseEtag: result.baseEtag,
        baselineSource: result.baselineSource
      });
    }
  }
  async getToFile(key, destPath, opts) {
    const cached2 = this.takePrefetchedRead(key);
    if (cached2 != null) {
      try {
        const viaCache = await fetchAgentStoreObjectToFileFromUrl(
          cached2.url,
          key,
          destPath,
          opts?.maxBytes
        );
        if (viaCache != null) return viaCache;
      } catch {
      }
    }
    return getAgentStoreObjectToFile(this.client, this.storeId, key, destPath, opts?.maxBytes);
  }
  putFromFile(key, srcPath, sha, size) {
    return putAgentStoreObjectFromFile({
      client: this.client,
      sourceId: this.storeId,
      relPath: key,
      srcPath,
      sha,
      size
    });
  }
  list(prefix) {
    return listAgentStoreObjects(this.client, this.storeId, prefix);
  }
};
var LocalFsObjectStoreProvider = class {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }
  baseDir;
  forStore(storeId) {
    return new LocalFsObjectStore((0, import_node_path9.join)(this.baseDir, storeId));
  }
};
var LocalFsObjectStore = class {
  constructor(root) {
    this.root = root;
  }
  root;
  async get(key) {
    try {
      return new Uint8Array(await (0, import_promises11.readFile)(this.pathFor(key)));
    } catch (error41) {
      if (findSystemErrno(error41) === "ENOENT") return null;
      throw error41;
    }
  }
  async put(key, bytes, _opts) {
    const dest = this.pathFor(key);
    await (0, import_promises11.mkdir)((0, import_node_path9.dirname)(dest), { recursive: true });
    await (0, import_promises11.writeFile)(dest, bytes);
  }
  async getToFile(key, destPath, opts) {
    const src = this.pathFor(key);
    let size;
    try {
      size = (await (0, import_promises11.stat)(src)).size;
    } catch (error41) {
      if (findSystemErrno(error41) === "ENOENT") return null;
      throw error41;
    }
    if (opts?.maxBytes != null && size > opts.maxBytes) {
      throw new SandBoxStoreSyncError(`object ${key} is ${size}B over the ${opts.maxBytes}B cap`);
    }
    await (0, import_promises11.mkdir)((0, import_node_path9.dirname)(destPath), { recursive: true });
    await (0, import_promises12.pipeline)((0, import_node_fs9.createReadStream)(src), (0, import_node_fs9.createWriteStream)(destPath));
    return size;
  }
  async putFromFile(key, srcPath, _sha, _size2) {
    const dest = this.pathFor(key);
    await (0, import_promises11.mkdir)((0, import_node_path9.dirname)(dest), { recursive: true });
    await (0, import_promises12.pipeline)((0, import_node_fs9.createReadStream)(srcPath), (0, import_node_fs9.createWriteStream)(dest));
  }
  async list(prefix) {
    const found = [];
    await walkFiles(this.root, found);
    return found.map((abs) => (0, import_node_path9.relative)(this.root, abs).split(import_node_path9.sep).join("/")).filter((key) => isUnderPrefix(key, prefix)).sort();
  }
  async delete(key) {
    try {
      await (0, import_promises11.unlink)(this.pathFor(key));
    } catch (error41) {
      if (findSystemErrno(error41) !== "ENOENT") throw error41;
    }
  }
  pathFor(key) {
    return (0, import_node_path9.join)(this.root, ...key.split("/"));
  }
};
function resolveBoxObjectStoreProvider(deps) {
  const policy = deps.policy;
  switch (policy.kind) {
    case "local-fs":
      return new LocalFsObjectStoreProvider(policy.localDir ?? "");
    case "sand-box-store-v2":
      invariant(
        deps.agentStore.getAccessToken != null && deps.agentStore.getMachineId != null,
        "sand-box-store v2 selected but no backend auth was provided"
      );
      return new SandBoxStoreServiceProvider({
        backend: deps.agentStore.backend,
        getAccessToken: deps.agentStore.getAccessToken,
        getMachineId: deps.agentStore.getMachineId,
        getTeamId: deps.agentStore.getTeamId,
        manifestCommit: policy.manifestCommit
      });
    case "agent-store":
      return new AgentStoreObjectStoreProvider(deps.agentStore);
  }
}
function isUnderPrefix(key, prefix) {
  return prefix === "" || key.startsWith(`${prefix.replace(/\/+$/, "")}/`);
}
async function walkFiles(dir, out) {
  let entries;
  try {
    entries = await (0, import_promises11.readdir)(dir, { withFileTypes: true });
  } catch (error41) {
    if (findSystemErrno(error41) === "ENOENT") return;
    throw error41;
  }
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const abs = (0, import_node_path9.join)(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(abs, out);
    } else if (entry.isFile()) {
      out.push(abs);
    }
  }
}
