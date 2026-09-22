/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/automations/webhook-credential-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs54 = require("node:fs");
var import_node_path97 = require("node:path");
init_dashboard_pb();
init_dist3();
init_zod();
init_errors();
init_system_errno();
function assertWebhookCredentialTarget(automation, localId) {
  if (automation === void 0) {
    throw new SandWebhookCredentialTargetError(`Automation not found: ${localId}`);
  }
  if (!triggerList(automation.trigger).some((trigger2) => trigger2.type === "webhook")) {
    throw new SandWebhookCredentialTargetError(`Automation is not webhook-triggered: ${localId}`);
  }
}
var persistedWebhookKeysSchema = external_exports.discriminatedUnion("version", [
  external_exports.object({ version: external_exports.literal(1) }),
  external_exports.object({ version: external_exports.literal(2), keys: external_exports.record(external_exports.string(), external_exports.string()) })
]);
var SandWebhookCredentialService = class {
  constructor(deps) {
    this.deps = deps;
    this.storePath = deps.storePath ?? (0, import_node_path97.join)(getSandRootDir(), "webhook-keys.json");
    this.log = deps.log;
  }
  deps;
  storePath;
  log;
  writes = new PromiseQueue({ max: 1 });
  inFlightMints = /* @__PURE__ */ new Map();
  keysPromise;
  webhookUrl(automationId) {
    return new URL(`/automations/webhook/${automationId}`, this.deps.backend.backendUrl).toString();
  }
  async ensureKey(automationId) {
    const keys = await this.loadKeys();
    if (keys === null) return null;
    const stored = keys[automationId];
    if (stored !== void 0) return stored;
    const existing = this.inFlightMints.get(automationId);
    if (existing !== void 0) return await existing;
    const mint2 = this.mintAndPersist(automationId, keys).finally(() => {
      this.inFlightMints.delete(automationId);
    });
    this.inFlightMints.set(automationId, mint2);
    return await mint2;
  }
  async ensureKeys(automationIds) {
    for (const automationId of automationIds) {
      await this.ensureKey(automationId);
    }
  }
  async dropKeys(automationIds) {
    const inFlightMints = automationIds.flatMap((automationId) => {
      const mint2 = this.inFlightMints.get(automationId);
      return mint2 === void 0 ? [] : [mint2];
    });
    await Promise.all(inFlightMints);
    const keys = await this.loadKeys();
    if (keys === null) return;
    try {
      await this.writes.enqueue(async () => {
        let changed = false;
        for (const automationId of automationIds) {
          if (keys[automationId] === void 0) continue;
          delete keys[automationId];
          changed = true;
        }
        if (!changed) return;
        await this.writeStore(keys);
      });
    } catch (error42) {
      this.log(`webhook key drop failed for ${automationIds.join(", ")} (${errorLogTag(error42)})`);
    }
  }
  async getCredential({
    agentId,
    localId
  }) {
    const automationId = stableAutomationId({ agentId, localId });
    return {
      url: this.webhookUrl(automationId),
      key: await this.ensureKey(automationId)
    };
  }
  loadKeys() {
    this.keysPromise ??= this.readKeys().then((keys) => {
      if (keys === null) this.keysPromise = void 0;
      return keys;
    });
    return this.keysPromise;
  }
  async readKeys() {
    let raw;
    try {
      raw = (await import_node_fs54.promises.readFile(this.storePath)).toString();
    } catch (error42) {
      if (findSystemErrno(error42) === "ENOENT") return {};
      this.log(`webhook key store read failed (${errorLogTag(error42)}); keeping existing keys`);
      return null;
    }
    try {
      const parsed2 = persistedWebhookKeysSchema.safeParse(JSON.parse(raw));
      if (!parsed2.success) {
        this.log("webhook key store unreadable (schema mismatch); keeping existing keys");
        return null;
      }
      return parsed2.data.version === 1 ? {} : parsed2.data.keys;
    } catch (error42) {
      this.log(`webhook key store unreadable (${errorLogTag(error42)}); keeping existing keys`);
      return null;
    }
  }
  async mintAndPersist(automationId, keys) {
    let key;
    try {
      const response = await this.deps.client.createAutomationWebhookApiKey(
        new CreateAutomationWebhookApiKeyRequest({ automationId })
      );
      key = response.apiKey;
    } catch (error42) {
      this.log(`webhook key mint failed for ${automationId} (${errorLogTag(error42)})`);
      return null;
    }
    try {
      await this.writes.enqueue(async () => {
        await this.writeStore({ ...keys, [automationId]: key });
        keys[automationId] = key;
      });
    } catch (error42) {
      this.log(`webhook key store failed for ${automationId} (${errorLogTag(error42)})`);
      return null;
    }
    return key;
  }
  async writeStore(keys) {
    await writeFileAtomic(this.storePath, Buffer.from(JSON.stringify({ version: 2, keys })), {
      mode: 384
    });
  }
};

