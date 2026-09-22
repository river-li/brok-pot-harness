init_errors();
var RoutedTranscriptMirror = class {
  constructor(journal, legacy, isJournalEnabled, routes) {
    this.journal = journal;
    this.legacy = legacy;
    this.isJournalEnabled = isJournalEnabled;
    this.routes = routes;
  }
  journal;
  legacy;
  isJournalEnabled;
  routes;
  legacyPending = /* @__PURE__ */ new Map();
  route(conversationId) {
    let route = this.routes.get(conversationId);
    if (route != null) return route;
    route = (async () => {
      if (await this.journal.ownsConversation(conversationId)) {
        return "journal";
      }
      if (!await this.isJournalEnabled()) return "legacy";
      await this.journal.claimConversation(conversationId);
      return "journal";
    })();
    this.routes.set(conversationId, route);
    return route;
  }
  async recover(ctx, conversationId, checkpoint, blobStore) {
    if (await this.route(conversationId) === "journal") {
      await this.journal.recover(ctx, conversationId, checkpoint, blobStore);
    }
  }
  async prepareCheckpoint(ctx, conversationId, checkpoint, blobStore, finalizeCheckpoint = false, writeLegacyCheckpoint = finalizeCheckpoint) {
    if (await this.route(conversationId) === "journal") {
      await this.journal.prepareCheckpoint(
        ctx,
        conversationId,
        checkpoint,
        blobStore,
        finalizeCheckpoint
      );
      return;
    }
    if (writeLegacyCheckpoint) {
      this.legacyPending.set(conversationId, {
        checkpoint,
        blobStore
      });
    }
  }
  async commitCheckpoint(ctx, conversationId, stateBlobId) {
    if (await this.route(conversationId) === "journal") {
      await this.journal.commitCheckpoint(ctx, conversationId);
      return;
    }
    const pending = this.legacyPending.get(conversationId);
    if (pending == null) return;
    this.legacyPending.delete(conversationId);
    try {
      await this.legacy.write(
        ctx,
        conversationId,
        pending.checkpoint,
        pending.blobStore,
        stateBlobId
      );
    } catch (error42) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error42)
      });
    }
  }
  async abortCheckpoint(ctx, conversationId) {
    if (await this.route(conversationId) === "journal") {
      await this.journal.abortCheckpoint(ctx, conversationId);
      return;
    }
    this.legacyPending.delete(conversationId);
  }
  async skipCheckpoint(ctx, conversationId, checkpoint, blobStore) {
    let selected = this.routes.get(conversationId);
    let recoverOwnedJournal = false;
    if (selected == null) {
      if (!await this.journal.ownsConversation(conversationId)) {
        this.legacyPending.delete(conversationId);
        return;
      }
      recoverOwnedJournal = true;
      selected = Promise.resolve("journal");
      this.routes.set(conversationId, selected);
    }
    if (await selected === "journal") {
      if (recoverOwnedJournal) {
        await this.journal.recover(ctx, conversationId, checkpoint, blobStore);
      }
      await this.journal.skipCheckpoint(ctx, conversationId, checkpoint, blobStore);
      return;
    }
    this.legacyPending.delete(conversationId);
  }
};
