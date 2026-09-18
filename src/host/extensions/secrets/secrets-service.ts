init_errors();
var SandBoxSecretsValidationError = class extends SandDomainError {
  name = "SandBoxSecretsValidationError";
};
var BOX_SECRETS_FILENAME = "box-secrets.json";
var secretValuesSchema = external_exports.record(external_exports.string(), external_exports.string());
var persistedSecretsSchema = external_exports.discriminatedUnion("version", [
  external_exports.object({ version: external_exports.literal(1), secrets: secretValuesSchema }),
  external_exports.object({
    version: external_exports.literal(2),
    desktop: secretValuesSchema,
    card: secretValuesSchema,
    cardRevision: external_exports.string().optional(),
    generation: external_exports.number().int().nonnegative().optional()
  })
]);
var NO_BOX_SECRETS = { desktop: {}, card: {}, cardRevision: null };
function effectiveBoxSecrets(owned) {
  return { ...owned.desktop, ...owned.card };
}
function getBoxSecretsStorePath() {
  return (0, import_node_path126.join)(getSandRootDir(), BOX_SECRETS_FILENAME);
}
var SECRETS_APPLY_WAIT_MS = 5e3;
var SECRETS_RETRY_INITIAL_MS = 1e3;
var SECRETS_RETRY_MAX_MS = 3e4;
var BoxSecretsApplier = class {
  applyToBox;
  storePath;
  retryPolicy;
  applyDeadline;
  log;
  desired = NO_BOX_SECRETS;
  desiredGeneration = 0;
  persistedGeneration = 0;
  replacementsAwaitingLoad = 0;
  appliedGeneration = 0;
  lastAppliedAtMs = null;
  isApplying = false;
  isStopped = false;
  stopSignal = new AbortController();
  appliedWaiters = [];
  persistQueue = Promise.resolve();
  constructor(options2) {
    this.applyToBox = options2.applyToBox;
    this.storePath = options2.storePath ?? getBoxSecretsStorePath();
    this.retryPolicy = options2.retryPolicy;
    this.applyDeadline = options2.applyDeadline;
    this.log = options2.log;
  }
  async setSecrets(ctx, secrets) {
    return this.replaceDesired(ctx, (current) => ({ ...current, desktop: { ...secrets } }));
  }
  async setSecret(ctx, secret) {
    return this.replaceDesired(ctx, (current) => ({
      desktop: current.desktop,
      card: { ...current.card, [secret.name]: secret.value },
      cardRevision: null
    }));
  }
  async syncUserSecrets(ctx, request3) {
    if (request3.secrets === void 0) {
      const generation = this.desiredGeneration;
      const persisted = generation > 0 ? this.desired : await this.loadPersisted();
      const raced = this.desiredGeneration !== generation;
      const current = raced ? this.desired : persisted ?? NO_BOX_SECRETS;
      return {
        revision: current.cardRevision,
        generation: raced || generation > 0 ? this.desiredGeneration : this.persistedGeneration,
        ...current.cardRevision === request3.revision ? {} : { card: current.card }
      };
    }
    const secrets = request3.secrets;
    const outcome = await this.tryReplaceDesired(
      ctx,
      (current) => ({
        desktop: current.desktop,
        card: { ...secrets },
        cardRevision: request3.revision
      }),
      request3.generation
    );
    if (outcome === "stale") {
      const report = await this.syncUserSecrets(ctx, { revision: request3.revision });
      return { ...report, replaced: false };
    }
    return { revision: request3.revision, generation: this.desiredGeneration, replaced: true };
  }
  async replaceDesired(ctx, next) {
    const outcome = await this.tryReplaceDesired(ctx, next, void 0);
    return outcome === "stale" ? this.getStatus() : outcome;
  }
  async tryReplaceDesired(ctx, next, expectedGeneration) {
    const desired = next(this.desiredGeneration > 0 ? this.desired : await this.loadDesired());
    const validationError = validateBoxSecrets(effectiveBoxSecrets(desired));
    if (validationError != null) {
      if (this.desiredGeneration === 0) void this.applyPersisted(ctx);
      throw new SandBoxSecretsValidationError(validationError);
    }
    const currentGeneration = this.desiredGeneration > 0 ? this.desiredGeneration : this.persistedGeneration;
    if (expectedGeneration !== void 0 && expectedGeneration !== currentGeneration) {
      return "stale";
    }
    this.desired = desired;
    this.desiredGeneration = currentGeneration + 1;
    const generation = this.desiredGeneration;
    const persist = this.persistQueue.catch((error41) => {
      this.log(`box secrets: prior persist failed (${errorLogTag(error41)}); retrying`);
    }).then(async () => await this.persist(desired, generation));
    this.persistQueue = persist;
    await persist;
    void this.runApplyLoop(ctx);
    await this.applyDeadline.run((signal) => this.waitForGeneration(generation, signal)).catch((error41) => {
      this.log(`box secrets: apply wait ended unconfirmed (${errorLogTag(error41)})`);
    });
    return this.getStatus();
  }
  async loadDesired() {
    this.replacementsAwaitingLoad += 1;
    try {
      const persisted = await this.loadPersisted();
      return this.desiredGeneration > 0 ? this.desired : persisted ?? NO_BOX_SECRETS;
    } finally {
      this.replacementsAwaitingLoad -= 1;
    }
  }
  hasDesired() {
    return this.desiredGeneration > 0 || this.replacementsAwaitingLoad > 0;
  }
  async applyPersisted(ctx) {
    if (this.hasDesired()) return;
    const persisted = await this.loadPersisted();
    if (persisted == null || this.hasDesired()) return;
    const secrets = effectiveBoxSecrets(persisted);
    if (validateBoxSecrets(secrets) != null) return;
    this.desired = persisted;
    this.desiredGeneration = this.persistedGeneration + 1;
    this.log(`applying ${Object.keys(secrets).length} persisted box secret(s) at startup`);
    await this.runApplyLoop(ctx);
  }
  getStatus() {
    return {
      keys: Object.keys(effectiveBoxSecrets(this.desired)).sort(),
      cardKeys: Object.keys(this.desired.card).sort(),
      isApplied: this.desiredGeneration > 0 && this.appliedGeneration === this.desiredGeneration,
      lastAppliedAtMs: this.lastAppliedAtMs
    };
  }
  async readCard(names3) {
    const { card } = this.desiredGeneration > 0 ? this.desired : await this.loadPersisted() ?? NO_BOX_SECRETS;
    const values = /* @__PURE__ */ new Map();
    for (const name17 of names3) {
      if (Object.hasOwn(card, name17)) values.set(name17, card[name17] ?? "");
    }
    return values;
  }
  stop() {
    this.isStopped = true;
    this.stopSignal.abort();
    this.notifyApplied();
  }
  async runApplyLoop(ctx) {
    if (this.isApplying || this.isStopped) return;
    this.isApplying = true;
    try {
      let attempt = 0;
      while (this.appliedGeneration < this.desiredGeneration && !this.isStopped) {
        const generation = this.desiredGeneration;
        try {
          await this.applyToBox(ctx, {
            env: buildBoxSecretsEnv(effectiveBoxSecrets(this.desired)),
            replace: true
          });
          this.appliedGeneration = generation;
          this.lastAppliedAtMs = Date.now();
          attempt = 0;
          this.notifyApplied();
        } catch (error41) {
          if (error41 instanceof BoxEnvironmentSyncUnsupportedError) {
            this.isStopped = true;
            this.log("box secrets: this box has no environment sync; giving up");
            return;
          }
          attempt += 1;
          this.log(`box secrets: apply failed (attempt ${attempt}); retrying`);
          const retry2 = this.retryPolicy.schedule(attempt, this.stopSignal.signal);
          try {
            await retry2.elapsed;
          } catch (error42) {
            if (this.isStopped) return;
            throw error42;
          } finally {
            retry2.dispose();
          }
        }
      }
    } finally {
      this.isApplying = false;
      this.notifyApplied();
    }
  }
  notifyApplied() {
    const waiters = this.appliedWaiters;
    this.appliedWaiters = [];
    for (const waiter of waiters) waiter();
  }
  async waitForGeneration(generation, signal) {
    while (this.appliedGeneration < generation && !this.isStopped) {
      if (signal.aborted) throw signal.reason;
      await new Promise((resolve29, reject2) => {
        const remove = () => {
          const index = this.appliedWaiters.indexOf(finish);
          if (index >= 0) this.appliedWaiters.splice(index, 1);
          signal.removeEventListener("abort", abort);
        };
        const finish = () => {
          remove();
          resolve29();
        };
        const abort = () => {
          remove();
          reject2(signal.reason);
        };
        this.appliedWaiters.push(finish);
        signal.addEventListener("abort", abort, { once: true });
      });
    }
  }
  async persist(desired, generation) {
    await writeFileAtomic(
      this.storePath,
      Buffer.from(
        JSON.stringify({
          version: 2,
          desktop: desired.desktop,
          card: desired.card,
          ...desired.cardRevision === null ? {} : { cardRevision: desired.cardRevision },
          generation
        })
      ),
      { mode: 384 }
    );
  }
  async loadPersisted() {
    let raw;
    try {
      raw = await import_node_fs77.promises.readFile(this.storePath, "utf8");
    } catch (error41) {
      reportFallbackUnlessAbsent("secrets_service", error41);
      return null;
    }
    try {
      const parsed2 = persistedSecretsSchema.safeParse(JSON.parse(raw));
      if (!parsed2.success) return null;
      if (parsed2.data.version === 1) {
        return { desktop: parsed2.data.secrets, card: {}, cardRevision: null };
      }
      this.persistedGeneration = Math.max(this.persistedGeneration, parsed2.data.generation ?? 0);
      return {
        desktop: parsed2.data.desktop,
        card: parsed2.data.card,
        cardRevision: parsed2.data.cardRevision ?? null
      };
    } catch {
      return null;
    }
  }
};
