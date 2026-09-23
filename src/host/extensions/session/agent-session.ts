function resolveProfileName(trimmedName, current) {
  if (trimmedName.length > 0) return trimmedName;
  if (current?.name != null && current.name.trim().length > 0) return current.name;
  return SAND_DEFAULT_AGENT_NAME;
}
var SandAgentSessionStore = class {
  constructor(reportHostLog, rootDir = getSandAgentsRootDir(), resolveUserTimeZone = () => void 0, createBlobWorkerPool = () => new AgentWorkerPool({ reportHostLog }), seams = {}) {
    this.reportHostLog = reportHostLog;
    this.rootDir = rootDir;
    this.resolveUserTimeZone = resolveUserTimeZone;
    const createAgentDb = seams.createAgentDb ?? ((dbPath, options2) => new SandAgentDb(dbPath, options2));
    this.createAgentDb = (dbPath, options2) => createAgentDb(dbPath, {
      ...options2,
      onFailure: (failure2) => {
        const agentId = (0, import_node_path142.basename)((0, import_node_path142.dirname)(dbPath));
        let text2;
        switch (failure2.kind) {
          case "checkpoint_on_close_failed":
            text2 = `[sand-agent-db] checkpoint-on-close failed for ${agentId}: ${errorLogTag(failure2.error)}`;
            break;
          case "write_busy":
            text2 = (0, import_node_util14.format)(
              `[sand-agent-db] ${failure2.operation} dropped on locked db (${agentId}):`,
              failure2.error
            );
            break;
          case "write_corrupt":
            text2 = `[sand-agent-db] ${failure2.operation} hit corruption (${agentId}); recovering in place: ${errorLogTag(failure2.error)}`;
            break;
          case "recovery_deferred":
            text2 = `[sand-agent-db] deferring in-place recovery for ${agentId}: ${failure2.otherLiveHandles} other live handle(s) hold this store open`;
            break;
          case "recovery_failed": {
            const code = failure2.error != null && typeof failure2.error === "object" && "code" in failure2.error ? failure2.error.code : void 0;
            text2 = `[sand-agent-db] in-place recovery failed for ${agentId} (${code ?? "error"})`;
            break;
          }
        }
        reportHostLog("error", text2);
        options2?.onFailure?.(failure2);
      }
    });
    this.statIfExists = seams.statIfExists ?? statIfExists;
    this.connectorSecrets = new SandConnectorSecretStore(getConnectorSecretsRoot(rootDir));
    this.materialization = new SandSessionMaterialization({
      ctx: this.ctx,
      rootDir,
      createAgentDb: (dbPath, options2) => this.createAgentDb(dbPath, options2),
      createBlobWorkerPool,
      memory: () => this.memory,
      resolveUserTimeZone: () => this.resolveUserTimeZone(),
      isFiveMinuteAutomationFloorEnabled: () => this.isFiveMinuteAutomationFloorEnabled(),
      automationChangeClock: seams.automationChangeClock,
      maintenanceHost: () => this.maintenanceHost(),
      agentExists: (agentId) => this.agentExists(agentId),
      getAgentDir: (agentId) => this.getAgentDir(agentId)
    });
    this.conversationState = new SandSessionConversationState({
      ctx: this.ctx,
      rootDir,
      createAgentDb: (dbPath, options2) => this.createAgentDb(dbPath, options2),
      openSession: (agentId) => this.openSession(agentId)
    });
  }
  reportHostLog;
  rootDir;
  resolveUserTimeZone;
  ctx = createContext();
  memory = NO_SESSION_MEMORY;
  isFiveMinuteAutomationFloorEnabled = () => false;
  connectorSecrets;
  extrasCache = /* @__PURE__ */ new Map();
  isAgentBeingDeleted = () => false;
  materialization;
  conversationState;
  createAgentDb;
  statIfExists;
  async closeWorkerPool() {
    await this.materialization.closeWorkerPool();
  }
  getRootDir() {
    return this.rootDir;
  }
  setMemory(memory) {
    this.memory = memory;
  }
  setBeingDeletedPredicate(isBeingDeleted) {
    this.isAgentBeingDeleted = isBeingDeleted;
  }
  setUserTimeZoneResolver(resolveUserTimeZone) {
    this.resolveUserTimeZone = resolveUserTimeZone;
  }
  setFiveMinuteAutomationFloorResolver(isEnabled) {
    this.isFiveMinuteAutomationFloorEnabled = isEnabled;
  }
  getUserTimeZone() {
    return this.resolveUserTimeZone();
  }
  async listAgentRecordIds() {
    return await this.materialization.listAgentRecordIds();
  }
  async countOwnedAgents() {
    return await this.materialization.countOwnedAgents();
  }
  async mintAgent(mint2) {
    return await this.materialization.mintAgent(mint2);
  }
  async createSession(profile, origin = "user", options2 = {}) {
    return await this.materialization.createSession(profile, origin, options2);
  }
  async createFallbackSession() {
    return await this.materialization.createFallbackSession();
  }
  async openSession(agentId) {
    return await this.materialization.openSession(agentId);
  }
  async ensureConversationCapacityForTurn(session) {
    await ensureConversationCapacityForTurn(this.maintenanceHost(), session.dbPath, session.db);
  }
  async readWorkingStateExportSnapshot(agentId, limits = {}, onProgress) {
    if (!this.agentExists(agentId)) return null;
    const dbPath = getAgentDbPath(this.rootDir, agentId);
    return await this.withAgentDb(agentId, async (db) => {
      const hasTranscript = db.getTranscriptTail({ limit: 1 }).entries.length > 0;
      onProgress?.({
        kind: "snapshot",
        hasTranscript
      });
      let liveRootBlobId = db.get("latestRootBlobId");
      if (liveRootBlobId.length === 0) {
        const recovery = await this.materialization.recoverConversationRootIfMissing(dbPath, db);
        if (recovery.outcome === "complete") {
          liveRootBlobId = db.get("latestRootBlobId");
        }
      }
      const walk = liveRootBlobId.length === 0 ? { outcome: "skipped", reason: "no-root" } : await this.materialization.requireWorkerPool().walkExportClosure({
        agentId,
        blobDbPath: (0, import_node_path142.join)((0, import_node_path142.dirname)(dbPath), CONVERSATION_BLOBS_FILENAME),
        retainedRootIdHex: toHex3(liveRootBlobId),
        legacyBlobDbPath: dbPath,
        maxClosureBytes: limits.maxClosureBytes,
        maxClosureBlobs: limits.maxClosureBlobs,
        ...onProgress === void 0 ? {} : {
          onProgress: (progress) => onProgress({ kind: "closure", ...progress, hasTranscript })
        }
      });
      return {
        walk,
        pendingCompletions: db.getPendingAutomationCompletions(),
        hasTranscript
      };
    });
  }
  async readConversationBlobsByHexIds(agentId, blobIdsHex) {
    const dbPath = getAgentDbPath(this.rootDir, agentId);
    return await this.materialization.requireWorkerPool().getConversationBlobsByHexIds(
      {
        agentId,
        blobDbPath: (0, import_node_path142.join)((0, import_node_path142.dirname)(dbPath), CONVERSATION_BLOBS_FILENAME),
        legacyBlobDbPath: dbPath
      },
      [...blobIdsHex]
    );
  }
  getAgentDir(agentId) {
    return (0, import_node_path142.dirname)(getAgentDbPath(this.rootDir, agentId));
  }
  agentExists(agentId) {
    return (0, import_node_fs88.existsSync)(getAgentDbPath(this.rootDir, agentId));
  }
  agentDirExists(agentId) {
    return (0, import_node_fs88.existsSync)(this.getAgentDir(agentId));
  }
  cloneAgentDir(sourceDir, targetDir, newAgentId, cloneName) {
    cloneAgentDir(sourceDir, targetDir, newAgentId, cloneName, this.createAgentDb);
  }
  writeAgentProfileFile(agentId, profile) {
    const path31 = getSandProfilePath(this.getAgentDir(agentId));
    const current = readSandProfileFile(path31);
    const trimmedName = profile.name.trim();
    const isRename = trimmedName.length > 0 && trimmedName !== current?.name.trim();
    const namedBy = isRename ? "user" : current?.namedBy;
    writeSandProfileFile(path31, {
      name: resolveProfileName(trimmedName, current),
      description: profile.description.trim(),
      title: profile.title?.trim() ?? current?.title ?? "",
      avatarShape: profile.avatarShape?.trim() ?? current?.avatarShape ?? "",
      avatarColor: profile.avatarColor?.trim() ?? current?.avatarColor ?? "",
      ...namedBy == null ? {} : { namedBy }
    });
  }
  async withAgentDb(agentId, fn) {
    const dbPath = getAgentDbPath(this.rootDir, agentId);
    const db = this.createAgentDb(dbPath);
    try {
      return await fn(db, dbPath);
    } finally {
      db.close();
    }
  }
  async deleteSession(agentId) {
    const dbPath = getAgentDbPath(this.rootDir, agentId);
    this.extrasCache.delete(agentId);
    deleteSandAgentDbWriteGeneration(dbPath);
    await (0, import_promises69.rm)((0, import_node_path142.dirname)(dbPath), { recursive: true, force: true });
    publishTranscriptMutation({ kind: "agent-removed", agentId });
  }
  activeAgentPointerPath() {
    return (0, import_node_path142.join)(this.rootDir, ACTIVE_AGENT_FILENAME);
  }
  readActiveAgentId() {
    let raw;
    try {
      raw = (0, import_node_fs88.readFileSync)(this.activeAgentPointerPath(), "utf8");
    } catch (error42) {
      reportFallbackUnlessAbsent("agent_session", error42);
      return null;
    }
    try {
      const parsed2 = JSON.parse(raw);
      return typeof parsed2.activeAgentId === "string" && parsed2.activeAgentId.length > 0 ? parsed2.activeAgentId : null;
    } catch {
      return null;
    }
  }
  writeActiveAgentId(agentId) {
    const path31 = this.activeAgentPointerPath();
    try {
      writeFileAtomicSync(path31, JSON.stringify({ activeAgentId: agentId }));
    } catch {
    }
  }
  async updateAgentProfile(agentId, profile) {
    return await updateAgentProfile(this.profileFilesHost(), agentId, profile);
  }
  async setAgentAvatarBytes(db, dbPath, agentId, pngBytes, activeAgentId) {
    return await setAgentAvatarBytes(
      this.mutationsHost(),
      db,
      dbPath,
      agentId,
      pngBytes,
      activeAgentId
    );
  }
  async setAgentAvatarBytesById(agentId, pngBytes) {
    return await this.withAgentDb(
      agentId,
      async (db, dbPath) => this.setAgentAvatarBytes(db, dbPath, agentId, pngBytes, void 0)
    );
  }
  getAgentProfileText(agentId) {
    return getAgentProfileText(this.profileFilesHost(), agentId);
  }
  async getAgentAvatar(agentId) {
    return await getAgentAvatar(this.profileFilesHost(), agentId);
  }
  async getAgentAvatarPng(agentId) {
    return await getAgentAvatarPng(this.profileFilesHost(), agentId);
  }
  async getAgentNotificationAvatar(agentId) {
    return await getAgentNotificationAvatar(this.profileFilesHost(), agentId);
  }
  async summarizeOpenSession(session) {
    const dbStats = await this.statIfExists(session.dbPath);
    if (this.isAgentBeingDeleted(session.id)) return null;
    return await buildSummary({
      extras: loadAgentDbExtras(session.db, session.dbPath, session.id, dbStats),
      dbPath: session.dbPath,
      dirName: session.id,
      dbStats,
      activeAgentId: session.id,
      includeBlank: true,
      agentHasMemory: (candidate) => this.memory.agentHasContent(candidate)
    });
  }
  async summarizeSession(session, activeAgentId) {
    const dbStats = await this.statIfExists(session.dbPath);
    if (this.isAgentBeingDeleted(session.id)) return null;
    const extras = dbStats == null ? loadAgentDbExtras(session.db, session.dbPath, session.id, dbStats) : await this.loadCachedExtras({
      dirName: session.id,
      dbPath: session.dbPath,
      dbStats,
      readExtras: () => loadAgentDbExtras(session.db, session.dbPath, session.id, dbStats)
    });
    if (!session.db.isOpen) return null;
    if (this.isAgentBeingDeleted(session.id)) return null;
    return await buildSummary({
      extras,
      dbPath: session.dbPath,
      dirName: session.id,
      dbStats,
      activeAgentId,
      includeBlank: true,
      agentHasMemory: (candidate) => this.memory.agentHasContent(candidate)
    });
  }
  adoptMaterializedAgentDb(agentId) {
    if (this.agentExists(agentId)) return;
    if (!(0, import_node_fs88.existsSync)(getSandProfilePath(this.getAgentDir(agentId)))) return;
    this.reseedMinimalStoreDbIfMissing(getAgentDbPath(this.rootDir, agentId));
  }
  reseedMinimalStoreDbIfMissing(dbPath) {
    if ((0, import_node_fs88.existsSync)(dbPath)) return;
    if (hasLiveSandAgentDbHandle(dbPath)) return;
    try {
      const db = this.createAgentDb(dbPath);
      db.close();
    } catch (error42) {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "reseed_failed",
        agentId: (0, import_node_path142.basename)((0, import_node_path142.dirname)(dbPath)),
        errorClass: errorLogTag(error42)
      });
    }
  }
  async summarizeAgentById(agentId, activeAgentId) {
    return await summarizeAgentById(this.rosterHost(), agentId, activeAgentId);
  }
  async cleanupLegacyGroupMemberDirs() {
    await cleanupLegacyGroupMemberDirs(this.maintenanceHost());
  }
  async loadCachedExtras(args) {
    const { dirName, dbPath, dbStats } = args;
    const readExtras = args.readExtras ?? (() => this.readExtrasFromDisk(dbPath, dirName, dbStats));
    const walStats = await this.statIfExists(`${dbPath}-wal`);
    const generation = getSandAgentDbWriteGeneration(dbPath);
    const key = `${generation}:${dbStats.size}:${dbStats.mtimeMs}:${walStats?.size ?? -1}:${walStats?.mtimeMs ?? -1}`;
    const cached2 = this.extrasCache.get(dirName);
    if (cached2 != null && cached2.key === key && (0, import_node_fs88.existsSync)(getSandProfilePath((0, import_node_path142.dirname)(dbPath)))) {
      return cached2.extras;
    }
    if (this.isAgentBeingDeleted(dirName)) return null;
    const extras = readExtras();
    if (extras != null) {
      this.extrasCache.set(dirName, { key, extras });
    }
    return extras;
  }
  readExtrasFromDisk(dbPath, dirName, dbStats) {
    let db;
    try {
      db = this.createAgentDb(dbPath, { recoverOnCorruption: false });
    } catch (error42) {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "unreadable",
        agentId: (0, import_node_path142.basename)((0, import_node_path142.dirname)(dbPath)),
        errorClass: errorLogTag(error42)
      });
      return null;
    }
    try {
      return loadAgentDbExtras(db, dbPath, dirName, dbStats);
    } finally {
      db.close();
    }
  }
  maintenanceHost() {
    return {
      ctx: this.ctx,
      rootDir: this.rootDir,
      reportHostLog: this.reportHostLog,
      requireWorkerPool: () => this.materialization.requireWorkerPool(),
      resolveConversationState: (structure, blobStore) => this.conversationState.resolveConversationState(structure, blobStore)
    };
  }
  rosterHost() {
    return {
      rootDir: this.rootDir,
      memory: this.memory,
      loadCachedExtras: (args) => this.loadCachedExtras(args),
      pruneExtrasCache: (present) => {
        for (const dir of this.extrasCache.keys()) {
          if (!present.has(dir)) this.extrasCache.delete(dir);
        }
      },
      recoverAgentWithMissingDb: (args) => recoverAgentWithMissingDb(this.mutationsHost(), args),
      isAgentBeingDeleted: (agentId) => this.isAgentBeingDeleted(agentId)
    };
  }
  mutationsHost() {
    return {
      memory: this.memory,
      isAgentBeingDeleted: (agentId) => this.isAgentBeingDeleted(agentId),
      reseedMinimalStoreDbIfMissing: (dbPath) => this.reseedMinimalStoreDbIfMissing(dbPath)
    };
  }
  profileFilesHost() {
    return {
      memory: this.memory,
      getAgentDir: (agentId) => this.getAgentDir(agentId),
      agentExists: (agentId) => this.agentExists(agentId),
      withAgentDb: (agentId, fn) => this.withAgentDb(agentId, fn),
      statOpenDb: (args) => this.statOpenDb(args),
      writeAgentProfileFile: (agentId, profile) => this.writeAgentProfileFile(agentId, profile)
    };
  }
  async listAgents(activeAgentId) {
    return await listAgents(this.rosterHost(), activeAgentId);
  }
  async getTranscriptEntries(session) {
    return await this.conversationState.getTranscriptEntries(session);
  }
  async getSessionOutline(session) {
    return await this.conversationState.getSessionOutline(session);
  }
  async getAgentOutline(agentId) {
    return await this.conversationState.getAgentOutline(agentId);
  }
  readAgentTranscriptEntries(agentId) {
    return this.conversationState.readAgentTranscriptEntries(agentId);
  }
  readAgentTranscriptPage(agentId, query) {
    return this.conversationState.readAgentTranscriptPage(agentId, query);
  }
  readAgentTranscriptWindow(agentId, query) {
    return this.conversationState.readAgentTranscriptWindow(agentId, query);
  }
  readAgentTranscriptTail(agentId, query) {
    return this.conversationState.readAgentTranscriptTail(agentId, query);
  }
  readAgentThread(agentId, rootId) {
    return this.conversationState.readAgentThread(agentId, rootId);
  }
  async getAgentTranscriptEntries(agentId) {
    return await this.conversationState.getAgentTranscriptEntries(agentId);
  }
  async markSessionViewed(session, at3 = Date.now(), options2 = {}) {
    await this.seedSessionActivityFromDbMtime(session);
    session.db.markViewed(at3, options2);
  }
  markSessionActivity(session, options2 = {}) {
    session.db.markActivity(options2.at, options2);
  }
  markSessionViewedNow(session, at3 = Date.now(), options2 = {}) {
    session.db.markViewed(at3, options2);
  }
  markAgentViewed(agentId, at3 = Date.now(), options2 = {}) {
    const dbPath = getAgentDbPath(this.rootDir, agentId);
    let db;
    try {
      db = this.createAgentDb(dbPath, { recoverOnCorruption: false });
      db.markViewed(at3, options2);
    } catch {
    } finally {
      db?.close();
    }
  }
  async setSessionUnread(agentId, isUnread, at3 = Date.now()) {
    await this.withAgentDb(agentId, async (db, dbPath) => {
      if (isUnread) {
        const dbStats = await this.statOpenDb({ dbPath, agentId });
        seedActivityFromMtime(db, agentId, dbStats);
        db.markUnread(at3);
      } else {
        db.markRead(at3);
      }
    });
  }
  setSessionNotifyOnUpdates(agentId, isEnabled) {
    writeSandSettingsFile(getSandSettingsPath(this.getAgentDir(agentId)), {
      notifyOnAgentUpdates: isEnabled
    });
  }
  setSessionVoice({ agentId, voiceId, voiceSpeed, voiceLanguage }) {
    writeSandSettingsFile(getSandSettingsPath(this.getAgentDir(agentId)), {
      ...voiceId === void 0 ? {} : { voiceId },
      ...voiceSpeed === void 0 ? {} : { voiceSpeed },
      ...voiceLanguage === void 0 ? {} : { voiceLanguage }
    });
  }
  setSessionHiddenFromSidebar(agentId, isHidden) {
    writeSandSettingsFile(getSandSettingsPath(this.getAgentDir(agentId)), {
      hiddenFromSidebar: isHidden
    });
  }
  async setAwaitingUserResponse(agentId, state) {
    await this.withAgentDb(agentId, async (db) => {
      db.setAwaitingUserResponse(state);
    });
  }
  async expirePendingAutoReviewApprovals(agentId, onlyRequestId) {
    return await this.withAgentDb(
      agentId,
      async (db) => expirePendingAutoReviewApprovalEntries(db, onlyRequestId)
    );
  }
  async expirePendingCookieOriginApprovals(args) {
    return await this.withAgentDb(
      args.agentId,
      async (db) => expirePendingCookieOriginApprovalEntries(db, {
        onlyRequestId: args.onlyRequestId,
        ifPendingBeforeMs: args.ifPendingBeforeMs,
        unlessRequestId: args.unlessRequestId
      })
    );
  }
  async expirePendingLocalToolPermissionAsks(args) {
    return await this.withAgentDb(
      args.agentId,
      async (db) => expirePendingLocalToolPermissionAskEntries(db, {
        onlyRequestId: args.onlyRequestId,
        ifPendingBeforeMs: args.ifPendingBeforeMs,
        unlessRequestId: args.unlessRequestId,
        status: args.status
      })
    );
  }
  async expirePendingVirtualCardApprovals(args) {
    return await this.withAgentDb(
      args.agentId,
      async (db) => expirePendingVirtualCardApprovalEntries(db, {
        onlyRequestId: args.onlyRequestId,
        ifPendingBeforeMs: args.ifPendingBeforeMs,
        unlessRequestId: args.unlessRequestId
      })
    );
  }
  async settleVirtualCardApproval(args) {
    return await this.withAgentDb(
      args.agentId,
      async (db) => settleVirtualCardApprovalEntry(db, {
        requestId: args.requestId,
        status: args.status,
        ...args.spendRequestId === void 0 ? {} : { spendRequestId: args.spendRequestId },
        ...args.failureReason === void 0 ? {} : { failureReason: args.failureReason },
        ...args.wakeOutcomeUnseen === true ? { wakeOutcomeUnseen: true } : {}
      })
    );
  }
  async settleStrandedDraftSends(agentId, isInFlight) {
    return await this.withAgentDb(agentId, async (db) => sweepStrandedDraftSends(db, isInFlight));
  }
  async setAwaitingUserResponseForTab(agentId, tabId, state, options2) {
    return await this.withAgentDb(
      agentId,
      async (db) => db.setAwaitingUserResponseForTab(tabId, state, options2)
    );
  }
  automationStoreFor(agentId) {
    return automationStoreForDbPath(
      getAgentDbPath(this.rootDir, agentId),
      this.resolveUserTimeZone,
      () => this.isFiveMinuteAutomationFloorEnabled()
    );
  }
  listAgentAutomations(agentId) {
    return this.automationStoreFor(agentId).list().slice(0, AUTOMATION_UI_LIMIT);
  }
  setAgentAutomationEnabled(agentId, automationId, isEnabled) {
    const store = this.automationStoreFor(agentId);
    store.setEnabled(automationId, isEnabled);
    return store.list().slice(0, AUTOMATION_UI_LIMIT);
  }
  createAgentAutomation(agentId, spec, provenance = "user") {
    const store = this.automationStoreFor(agentId);
    store.upsert(spec, provenance);
    return store.list().slice(0, AUTOMATION_UI_LIMIT);
  }
  updateAgentAutomation(agentId, automationId, spec) {
    const store = this.automationStoreFor(agentId);
    store.update(automationId, spec, "user");
    return store.list().slice(0, AUTOMATION_UI_LIMIT);
  }
  removeAgentAutomation(agentId, automationId) {
    const store = this.automationStoreFor(agentId);
    store.remove(automationId);
    return store.list().slice(0, AUTOMATION_UI_LIMIT);
  }
  skillStoreFor(agentId) {
    return skillStoreForDbPath(
      getAgentDbPath(this.rootDir, agentId),
      this.resolveUserTimeZone,
      () => this.isFiveMinuteAutomationFloorEnabled()
    );
  }
  async listAgentSkills(agentId) {
    return limitSurfacedSkills(this.skillStoreFor(agentId).listAll());
  }
  async getAgentSkill(agentId, workflowId) {
    return this.skillStoreFor(agentId).get(workflowId);
  }
  createAgentWorkflow(agentId, spec) {
    const store = this.skillStoreFor(agentId);
    store.create(spec, "user");
    return limitSurfacedSkills(store.listAll());
  }
  updateAgentWorkflow(agentId, workflowId, spec) {
    const store = this.skillStoreFor(agentId);
    store.update(workflowId, spec, "user");
    return limitSurfacedSkills(store.listAll());
  }
  removeAgentSkill(agentId, workflowId) {
    const store = this.skillStoreFor(agentId);
    store.remove(workflowId);
    return limitSurfacedSkills(store.listAll());
  }
  async importAgentSkillMarkdown(agentId, markdown, fallbackName) {
    const store = this.skillStoreFor(agentId);
    const imported = store.importMarkdown(markdown, fallbackName);
    const result = imported != null ? { imported: [imported], skipped: [] } : { imported: [], skipped: [{ source: "pasted skill", reason: "empty or invalid" }] };
    return {
      workflows: limitSurfacedSkills(store.listAll()),
      result
    };
  }
  async importAgentSkillSource(agentId, source, fallbackName) {
    const store = this.skillStoreFor(agentId);
    const imported = store.importLiveSource(source, fallbackName);
    const result = imported != null ? { imported: [imported], skipped: [] } : { imported: [], skipped: [{ source, reason: "could not link" }] };
    return {
      workflows: limitSurfacedSkills(store.listAll()),
      result
    };
  }
  openChannelStore(agentId) {
    return channelStoreForDbPath(getAgentDbPath(this.rootDir, agentId));
  }
  listAgentChannels(agentId) {
    return this.openChannelStore(agentId).listConnections().filter(
      (connection) => this.connectorSecrets.getSecret(agentId, connection.platform, CHANNEL_CREDENTIAL_FIELD) != null
    );
  }
  listChannelConfigs(agentId) {
    const store = this.openChannelStore(agentId);
    const configs = [];
    for (const platform2 of store.listPlatforms()) {
      const token = this.connectorSecrets.getSecret(agentId, platform2, CHANNEL_CREDENTIAL_FIELD);
      if (token == null) continue;
      configs.push({
        platform: platform2,
        token,
        label: store.readLabel(platform2) ?? platform2
      });
    }
    return configs;
  }
  storeConnectorCredential(agentId, platform2, field, value) {
    if (!this.connectorSecrets.setSecret(agentId, platform2, field, value)) {
      return false;
    }
    this.openChannelStore(agentId).writeMetadata(platform2);
    return true;
  }
  disconnectChannel(agentId, platform2) {
    this.connectorSecrets.removeAgentPlatform(agentId, platform2);
    return this.openChannelStore(agentId).remove(platform2);
  }
  async listAgentIds() {
    let entries;
    try {
      entries = await (0, import_promises69.readdir)(this.rootDir, { withFileTypes: true });
    } catch (error42) {
      if (error42.code === "ENOENT") return [];
      throw error42;
    }
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  }
  async listAllAutomations() {
    return this.listAllAutomationsFrom({ definitionsOnly: false });
  }
  async listAllAutomationDefinitions() {
    return this.listAllAutomationsFrom({ definitionsOnly: true });
  }
  async listAllAutomationsFrom({
    definitionsOnly
  }) {
    let entries;
    try {
      entries = await (0, import_promises69.readdir)(this.rootDir, { withFileTypes: true });
    } catch (error42) {
      if (error42.code === "ENOENT") return [];
      throw error42;
    }
    const result = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const agentId = entry.name;
      let automations;
      try {
        const store = this.automationStoreFor(agentId);
        automations = definitionsOnly ? store.listDefinitions() : store.list();
      } catch {
        continue;
      }
      for (const automation of automations) {
        result.push({ agentId, automation });
      }
    }
    return result;
  }
  async seedSessionActivityFromDbMtime(session) {
    const dbStats = await this.statOpenDb({ dbPath: session.dbPath, agentId: session.id });
    seedActivityFromMtime(session.db, session.id, dbStats);
  }
  async statOpenDb(args) {
    return (0, import_promises69.stat)(args.dbPath).catch((error42) => {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "stat_failed",
        agentId: args.agentId,
        errorClass: errorLogTag(error42)
      });
      return void 0;
    });
  }
};
