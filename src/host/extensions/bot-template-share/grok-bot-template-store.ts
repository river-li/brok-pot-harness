init_grok_bot_pb();
init_esm2();
function visibilityOf(value) {
  if (value === GrokBotTemplateVisibility.TEAM) return "team";
  if (value === GrokBotTemplateVisibility.PUBLIC) return "public";
  return void 0;
}
function visibilityWireOf(value) {
  return value === "team" ? GrokBotTemplateVisibility.TEAM : GrokBotTemplateVisibility.PUBLIC;
}
function protoMillis(value) {
  if (value == null) return void 0;
  const ms2 = typeof value === "bigint" ? Number(value) : value;
  return Number.isFinite(ms2) && ms2 > 0 ? ms2 : void 0;
}
function recordOf(template) {
  const createdAtMs2 = protoMillis(template.createdAtMs);
  const updatedAtMs = protoMillis(template.updatedAtMs);
  const visibility = visibilityOf(template.visibility);
  return {
    shareId: template.shareId,
    name: template.name,
    avatarShape: template.avatarShape,
    avatarColor: template.avatarColor,
    description: botTemplatePostcardText(template),
    published: template.published,
    ...template.activeVersion == null ? {} : { activeVersion: template.activeVersion },
    ...template.sourceAgentId == null ? {} : { sourceAgentId: template.sourceAgentId },
    ...createdAtMs2 == null ? {} : { createdAtMs: createdAtMs2 },
    ...updatedAtMs == null ? {} : { updatedAtMs },
    ...visibility == null ? {} : { visibility }
  };
}
async function requireTemplate(rpc, call) {
  const { template } = await call();
  if (template == null) throw new BotTemplateShareEmptyResponse(rpc);
  return recordOf(template);
}
var GrokBotTemplateStore = class {
  constructor(client, ensureServerBacked) {
    this.client = client;
    this.ensureServerBacked = ensureServerBacked;
  }
  client;
  ensureServerBacked;
  lastExportPolicy;
  lastHasTeam;
  async create(input, signal) {
    const blob = input.blob;
    await this.ensureServerBacked(input.sourceAgentId);
    const response = await this.client.createGrokBotTemplate(
      {
        name: input.name,
        avatarShape: input.avatarShape,
        avatarColor: input.avatarColor,
        description: input.description,
        sourceAgentId: input.sourceAgentId,
        ...input.requestedVisibility == null ? {} : { requestedVisibility: visibilityWireOf(input.requestedVisibility) },
        ...blob == null ? {} : {
          blobContentType: blob.contentType,
          blobByteSize: BigInt(blob.bytes.byteLength)
        }
      },
      { signal }
    );
    if (response.template == null) {
      throw new BotTemplateShareEmptyResponse("CreateGrokBotTemplate");
    }
    const putUrl = response.blobPutUrl?.trim() ?? "";
    return {
      record: recordOf(response.template),
      version: response.version,
      ...putUrl.length === 0 ? {} : { blobPutUrl: putUrl }
    };
  }
  publish(args, signal) {
    return requireTemplate(
      "ActivateGrokBotTemplateVersion",
      () => this.client.activateGrokBotTemplateVersion(
        { shareId: args.shareId, version: args.version },
        { signal }
      )
    );
  }
  async getVersion(args, signal) {
    let details;
    try {
      details = await this.client.getGrokBotTemplateVersion(
        { shareId: args.shareId, version: args.version },
        { signal }
      );
    } catch (error42) {
      if (error42 instanceof ConnectError && error42.code === Code.NotFound) {
        throw new BotTemplateStoreNotFound();
      }
      throw error42;
    }
    const getUrl = details.blobGetUrl?.trim() ?? "";
    if (getUrl.length === 0) {
      throw new BotTemplateShareEmptyResponse("GetGrokBotTemplateVersion");
    }
    let bytes;
    try {
      const response = await fetch(getUrl, { method: "GET", signal });
      if (!response.ok) {
        throw new BotTemplateShareBlobDownloadFailed(`status ${response.status}`);
      }
      bytes = new Uint8Array(await response.arrayBuffer());
    } catch (error42) {
      if (error42 instanceof BotTemplateShareBlobDownloadFailed) throw error42;
      throw new BotTemplateShareBlobDownloadFailed(
        error42 instanceof Error ? error42.message : "fetch failed"
      );
    }
    try {
      const recipe = parseBotTemplateRecipe(bytes);
      const createdAtMs2 = Number(details.createdAtMs);
      const visibility = visibilityOf(details.visibility);
      return {
        version: details.version,
        record: {
          shareId: args.shareId,
          name: recipe.profile.name,
          avatarShape: recipe.profile.avatarShape ?? "",
          avatarColor: recipe.profile.avatarColor ?? "",
          description: recipe.profile.description.trim(),
          published: details.active,
          active: details.active,
          memory: recipe.memory,
          skills: recipe.skills,
          routines: recipe.routines,
          plugins: recipe.plugins,
          ...Number.isFinite(createdAtMs2) ? { createdAtMs: createdAtMs2 } : {},
          ...visibility == null ? {} : { visibility }
        }
      };
    } catch (error42) {
      throw new BotTemplateShareRecipeInvalid(
        error42 instanceof Error ? error42.message : "unparseable recipe",
        { cause: error42 }
      );
    }
  }
  async getForSourceAgent(args, signal) {
    const { template, exportPolicy, hasTeam } = await this.client.getGrokBotTemplateForSourceAgent(
      { sourceAgentId: args.sourceAgentId },
      { signal }
    );
    if (isSandShareBotExportPolicy(exportPolicy)) {
      this.lastExportPolicy = exportPolicy;
    }
    if (typeof hasTeam === "boolean") {
      this.lastHasTeam = hasTeam;
    }
    return template == null ? null : recordOf(template);
  }
  peekExportPolicy() {
    return this.lastExportPolicy;
  }
  peekHasTeam() {
    return this.lastHasTeam;
  }
  async getExportPolicy(signal) {
    const { exportPolicy, hasTeam } = await this.client.getGrokBotTemplateExportPolicy(
      {},
      { signal }
    );
    this.lastExportPolicy = isSandShareBotExportPolicy(exportPolicy) ? exportPolicy : void 0;
    if (typeof hasTeam === "boolean") {
      this.lastHasTeam = hasTeam;
    }
    return this.lastExportPolicy;
  }
  async delete(args, signal) {
    await this.client.deleteGrokBotTemplate({ shareId: args.shareId }, { signal });
  }
  setVisibility(args, signal) {
    return requireTemplate(
      "SetGrokBotTemplateVisibility",
      () => this.client.setGrokBotTemplateVisibility(
        { shareId: args.shareId, visibility: visibilityWireOf(args.visibility) },
        { signal }
      )
    );
  }
};
function createGrokBotTemplateStore(args) {
  return new GrokBotTemplateStore(args.client, args.ensureServerBacked);
}
