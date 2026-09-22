/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/session-materialization.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_async_hooks2 = require("node:async_hooks");
var import_promises65 = require("node:fs/promises");
var import_node_path137 = require("node:path");
init_errors();
init_invariant();

// @recovered-fragment 2/2
var SandAgentMissingError = class extends SandDomainError {
  name = "SandAgentMissingError";
  isAgentMissing = true;
};
var DEFAULT_AGENT_AUTOMATIONS = [];
var SandSessionMaterialization = class {
  constructor(host) {
    this.host = host;
  }
  host;
  workerPool = null;
  mintChain = Promise.resolve();
  mintInFlight = new import_node_async_hooks2.AsyncLocalStorage();
  requireWorkerPool() {
    if (this.workerPool == null) {
      this.workerPool = this.host.createBlobWorkerPool();
    }
    return this.workerPool;
  }
  blobStoreFor(dbPath) {
    const agentDir = (0, import_node_path137.dirname)(dbPath);
    return new WorkerBlobStore(
      this.requireWorkerPool(),
      (0, import_node_path137.basename)(agentDir),
      (0, import_node_path137.join)(agentDir, CONVERSATION_BLOBS_FILENAME),
      dbPath
    );
  }
  async closeWorkerPool() {
    if (this.workerPool == null) return;
    await this.workerPool.closeAll();
    this.workerPool = null;
  }
  async listAgentRecordIds() {
    let entries;
    try {
      entries = await (0, import_promises65.readdir)(this.host.rootDir, { withFileTypes: true });
    } catch (error42) {
      if (error42.code === "ENOENT") return [];
      throw error42;
    }
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  }
  async countOwnedAgents() {
    return (await this.listAgentRecordIds()).length;
  }
  enqueueMint(run) {
    invariant(
      this.mintInFlight.getStore() == null,
      "enqueueMint: a mint called back into the mint chain; the nested call would wait on a chain only it can advance"
    );
    const chained = () => this.mintInFlight.run(true, run);
    const next = this.mintChain.then(chained, chained);
    this.mintChain = next.then(
      () => void 0,
      () => void 0
    );
    return next;
  }
  async mintAgent(mint2, providedId) {
    return await this.enqueueMint(() => this.runMint(providedId ?? crypto.randomUUID(), mint2));
  }
  async runMint(agentId, mint2) {
    try {
      return await mint2(agentId);
    } catch (error42) {
      await (0, import_promises65.rm)(this.host.getAgentDir(agentId), {
        recursive: true,
        force: true
      }).catch((cleanupError) => {
        reportSessionDiagnostic({
          family: "materialize",
          kind: "mint_cleanup_failed",
          agentId,
          errorClass: errorLogTag(cleanupError)
        });
      });
      throw error42;
    }
  }
  async createSession(profile, origin = "user", options2 = {}) {
    return await this.mintAgent(
      (agentId) => this.materializeSession(agentId, profile, origin, options2),
      options2.providedId
    );
  }
  async createFallbackSession() {
    return await this.enqueueMint(
      () => this.runMint(
        crypto.randomUUID(),
        (agentId) => this.materializeSession(agentId, void 0, "user")
      )
    );
  }
  async materializeSession(agentId, profile, origin, options2 = {}) {
    const dbPath = getAgentDbPath(this.host.rootDir, agentId);
    const db = this.host.createAgentDb(dbPath);
    db.set("agentId", agentId);
    db.setAgentOrigin(origin);
    if (options2.purpose != null) db.setAgentPurpose(options2.purpose);
    const trimmedName = profile?.name.trim();
    const hasProvidedName = trimmedName != null && trimmedName.length > 0;
    let namedBy = options2.namedBy;
    if (namedBy === void 0) {
      if (hasProvidedName) {
        namedBy = "user";
      } else {
        namedBy = "app";
      }
    }
    const identity = {
      name: hasProvidedName ? trimmedName : SAND_DEFAULT_AGENT_NAME,
      description: profile?.description.trim() ?? "",
      title: profile?.title?.trim() ?? "",
      avatarShape: profile?.avatarShape?.trim() ?? "",
      avatarColor: profile?.avatarColor?.trim() ?? "",
      ...namedBy === null ? {} : { namedBy }
    };
    const profilePath = getSandProfilePath((0, import_node_path137.dirname)(dbPath));
    if (options2.serverId !== void 0) {
      writeServerBackedProfileFile(profilePath, identity, {
        serverId: options2.serverId,
        ...options2.harness === void 0 ? {} : { harness: options2.harness }
      });
    } else {
      writeSandProfileFile(profilePath, identity);
    }
    writeSandSettingsFile(getSandSettingsPath((0, import_node_path137.dirname)(dbPath)), {
      notifyOnAgentUpdates: true
    });
    const automations = automationStoreForDbPath(
      dbPath,
      this.host.resolveUserTimeZone,
      this.host.isFiveMinuteAutomationFloorEnabled,
      this.host.automationChangeClock
    );
    for (const spec of DEFAULT_AGENT_AUTOMATIONS) {
      automations.upsert(spec, "user");
    }
    return {
      id: agentId,
      dbPath,
      db,
      agentStore: new AgentStore2(this.blobStoreFor(dbPath), db, {
        fixedRootBlobId: SAND_CONVERSATION_ROOT_SLOT_ID
      }),
      memory: this.host.memory().createAgentStore((0, import_node_path137.dirname)(dbPath)),
      automations,
      skills: skillStoreForDbPath(
        dbPath,
        this.host.resolveUserTimeZone,
        this.host.isFiveMinuteAutomationFloorEnabled
      ),
      channels: channelStoreForDbPath(dbPath)
    };
  }
  async recoverConversationRootIfMissing(dbPath, db) {
    if (db.get("latestRootBlobId").length > 0) return { outcome: "complete" };
    const agentStore = new AgentStore2(this.blobStoreFor(dbPath), db, {
      fixedRootBlobId: SAND_CONVERSATION_ROOT_SLOT_ID
    });
    try {
      await agentStore.resetFromDb(this.host.ctx);
      try {
        await recoverConversationIfRootMissing(this.host.maintenanceHost(), dbPath, db, agentStore);
      } catch (error42) {
        if (error42 instanceof ConversationRecoveryScanError) {
          return { outcome: "scan-failed", errorClass: error42.detail };
        }
        throw error42;
      }
      return { outcome: "complete" };
    } finally {
      await agentStore.dispose();
    }
  }
  async openSession(agentId) {
    const dbPath = getAgentDbPath(this.host.rootDir, agentId);
    if (!this.host.agentExists(agentId)) {
      throw new SandAgentMissingError(`Sand agent ${agentId} does not exist`);
    }
    const db = this.host.createAgentDb(dbPath);
    ensureProfileFile(dbPath, db);
    ensureSettingsFile(dbPath);
    const agentStore = new AgentStore2(this.blobStoreFor(dbPath), db, {
      fixedRootBlobId: SAND_CONVERSATION_ROOT_SLOT_ID
    });
    await agentStore.resetFromDb(this.host.ctx);
    const maintenance = this.host.maintenanceHost();
    if (db.get("latestRootBlobId").length === 0) {
      await recoverConversationIfRootMissing(maintenance, dbPath, db, agentStore);
    }
    await repairHiddenTranscriptEntriesOnce(maintenance, dbPath, db, agentStore);
    await clearStaleCheckpointRootsOnce(maintenance, dbPath, db, agentStore);
    await retireLegacyStoreBlobsOnce(maintenance, dbPath, db, agentStore);
    scheduleConversationSizeMaintenance(maintenance, dbPath, db);
    return {
      id: agentId,
      dbPath,
      db,
      agentStore,
      memory: this.host.memory().createAgentStore((0, import_node_path137.dirname)(dbPath)),
      automations: automationStoreForDbPath(
        dbPath,
        this.host.resolveUserTimeZone,
        this.host.isFiveMinuteAutomationFloorEnabled,
        this.host.automationChangeClock
      ),
      skills: skillStoreForDbPath(
        dbPath,
        this.host.resolveUserTimeZone,
        this.host.isFiveMinuteAutomationFloorEnabled
      ),
      channels: channelStoreForDbPath(dbPath)
    };
  }
};

