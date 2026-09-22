/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/bot-template-share/bot-template-share-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_errors();

// @recovered-fragment 2/2
function templateView(record2, extras = {}) {
  return {
    shareId: record2.shareId,
    name: record2.name,
    ...record2.title == null || record2.title.length === 0 ? {} : { title: record2.title },
    avatarShape: record2.avatarShape,
    avatarColor: record2.avatarColor,
    description: record2.description,
    shareUrl: grokBotTemplateShareUrl(record2.shareId),
    ...record2.memory == null ? {} : { memory: record2.memory },
    ...record2.skills == null ? {} : { skills: record2.skills },
    ...record2.routines == null ? {} : { routines: record2.routines },
    ...record2.plugins == null ? {} : { plugins: record2.plugins },
    published: record2.published,
    ...extras.version == null ? {} : { version: extras.version },
    ...record2.activeVersion == null ? {} : { activeVersion: record2.activeVersion },
    ...record2.active == null ? {} : { active: record2.active },
    ...record2.sourceAgentId == null ? {} : { sourceAgentId: record2.sourceAgentId },
    ...record2.createdAtMs == null ? {} : { createdAtMs: record2.createdAtMs },
    ...record2.updatedAtMs == null ? {} : { updatedAtMs: record2.updatedAtMs },
    ...record2.visibility == null ? {} : { visibility: record2.visibility }
  };
}
var BotTemplateShareService = class {
  constructor(store, reportFailure) {
    this.store = store;
    this.reportFailure = reportFailure;
  }
  store;
  reportFailure;
  bySourceAgent = /* @__PURE__ */ new Map();
  remember(view) {
    if (view.sourceAgentId != null) {
      this.bySourceAgent.set(view.sourceAgentId, view);
    }
    return view;
  }
  async run(call) {
    try {
      return await call();
    } catch (error42) {
      if (!(error42 instanceof BotTemplateStoreNotFound)) {
        this.reportFailure(errorLogTag(error42));
      }
      throw error42;
    }
  }
  async create(input, signal) {
    const { record: record2, version: version3, blobPutUrl } = await this.run(() => this.store.create(input, signal));
    if (input.blob != null) {
      const putUrl = blobPutUrl?.trim() ?? "";
      if (putUrl.length === 0) {
        const failure2 = new BotTemplateShareBlobUploadFailed("missing put url");
        this.reportFailure(errorLogTag(failure2));
        throw failure2;
      }
      try {
        const put = await fetch(putUrl, {
          method: "PUT",
          headers: {
            "Content-Type": input.blob.contentType,
            "Content-Length": String(input.blob.bytes.byteLength)
          },
          body: Uint8Array.from(input.blob.bytes),
          signal
        });
        if (!put.ok) {
          const failure2 = new BotTemplateShareBlobUploadFailed(`status ${put.status}`);
          this.reportFailure(errorLogTag(failure2));
          throw failure2;
        }
      } catch (error42) {
        if (!(error42 instanceof BotTemplateShareBlobUploadFailed)) {
          this.reportFailure(errorLogTag(error42));
        }
        throw error42;
      }
    }
    this.remember(templateView(record2));
    return {
      id: record2.shareId,
      name: input.name,
      avatarShape: input.avatarShape,
      avatarColor: input.avatarColor,
      description: input.description,
      shareUrl: grokBotTemplateShareUrl(record2.shareId),
      version: version3,
      published: record2.published,
      ...record2.activeVersion == null ? {} : { activeVersion: record2.activeVersion },
      ...record2.visibility == null ? {} : { visibility: record2.visibility }
    };
  }
  async publish(args, signal) {
    return this.remember(
      templateView(await this.run(() => this.store.publish(args, signal)), {
        version: args.version
      })
    );
  }
  async getVersion(args, signal) {
    const { record: record2, version: version3 } = await this.run(() => this.store.getVersion(args, signal));
    return this.remember(templateView(record2, { version: version3 }));
  }
  async getForSourceAgent(args, signal) {
    const record2 = await this.run(() => this.store.getForSourceAgent(args, signal));
    const fetched = record2 == null ? null : templateView(record2);
    const previous = this.bySourceAgent.get(args.sourceAgentId);
    const view = fetched == null || previous == null ? fetched : withResolvedBotTemplateAudience({ current: previous, incoming: fetched });
    this.bySourceAgent.set(args.sourceAgentId, view);
    return view;
  }
  peekForSourceAgent(args) {
    return this.bySourceAgent.get(args.sourceAgentId);
  }
  peekExportPolicy() {
    return this.store.peekExportPolicy?.();
  }
  peekHasTeam() {
    return this.store.peekHasTeam?.();
  }
  getExportPolicy(signal) {
    return this.store.getExportPolicy?.(signal) ?? Promise.resolve(void 0);
  }
  async delete(args, signal) {
    await this.run(() => this.store.delete(args, signal));
    for (const [sourceAgentId, view] of this.bySourceAgent) {
      if (view?.shareId === args.shareId) {
        this.bySourceAgent.set(sourceAgentId, null);
      }
    }
  }
  async setVisibility(args, signal) {
    return this.remember(
      templateView(await this.run(() => this.store.setVisibility(args, signal)))
    );
  }
};
function createBotTemplateShareService(store, reportFailure) {
  return new BotTemplateShareService(store, reportFailure);
}

