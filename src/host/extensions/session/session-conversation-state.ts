var SandSessionConversationState = class {
  constructor(host) {
    this.host = host;
  }
  host;
  async resolveConversationState(structure, blobStore) {
    const cachedBlobStore = cacheBlobReads(blobStore);
    const requestIds = await readDurableTurnRequestIds(this.host.ctx, structure, cachedBlobStore);
    if (requestIds == null) return null;
    const state = await deriveConversationStateFromStructure(
      this.host.ctx,
      structure,
      cachedBlobStore
    );
    if (state.turns.length === 0 || state.turns.length < structure.turns.length) {
      return null;
    }
    applyTurnRequestIds(state, requestIds);
    return state;
  }
  async getTranscriptEntries(session) {
    return session.db.getTranscriptEntries();
  }
  async getSessionOutline(session) {
    const state = await session.agentStore.getFullConversation(this.host.ctx);
    return deriveOutlineFromConversationState(state);
  }
  async getAgentOutline(agentId) {
    const session = await this.host.openSession(agentId);
    try {
      return await this.getSessionOutline(session);
    } finally {
      await session.agentStore.dispose();
      session.db.close();
    }
  }
  withReadOnlyAgentDb(agentId, read) {
    const dbPath = getAgentDbPath(this.host.rootDir, agentId);
    let db;
    try {
      db = this.host.createAgentDb(dbPath, { recoverOnCorruption: false });
      return read(db);
    } catch (error42) {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "unreadable",
        agentId,
        errorClass: errorLogTag(error42)
      });
      throw new SandAgentStoreUnreadableError(agentId, { cause: error42 });
    } finally {
      db?.close();
    }
  }
  readAgentTranscriptEntries(agentId) {
    return this.withReadOnlyAgentDb(agentId, (db) => db.getTranscriptEntries());
  }
  readAgentTranscriptPage(agentId, query) {
    return this.withReadOnlyAgentDb(agentId, (db) => db.getTranscriptPage(query));
  }
  readAgentTranscriptWindow(agentId, query) {
    return this.withReadOnlyAgentDb(agentId, (db) => db.getTranscriptWindow(query));
  }
  readAgentTranscriptTail(agentId, query) {
    return this.withReadOnlyAgentDb(agentId, (db) => db.getTranscriptTail(query));
  }
  readAgentThread(agentId, rootId) {
    return this.withReadOnlyAgentDb(agentId, (db) => db.getThread(rootId));
  }
  async getAgentTranscriptEntries(agentId) {
    const session = await this.host.openSession(agentId);
    try {
      return await this.getTranscriptEntries(session);
    } finally {
      await session.agentStore.dispose();
      session.db.close();
    }
  }
};
