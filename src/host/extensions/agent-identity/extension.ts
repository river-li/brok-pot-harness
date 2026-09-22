/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/agent-identity/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/4
var import_node_crypto16 = require("node:crypto");
var import_node_path35 = require("node:path");
init_dist2();
init_scheduling();

// @recovered-fragment 2/4
init_grok_bot_connect();
init_grok_bot_pb();
init_esm2();

// @recovered-fragment 3/4
init_errors();
init_invariant();
init_cursor_inference();

// @recovered-fragment 4/4
var IDENTITY_BACKFILL_SENTINEL_FILENAME = "agent-identity-backfill.json";
var TEMPORAL_CREATE_GATE = "sand_create_temporal_agents";
function harnessKindOf(harness) {
  return harness === "temporal" ? GrokBotAgentHarnessKind.TEMPORAL : GrokBotAgentHarnessKind.UNSPECIFIED;
}
var templateRecipeDeadline = createDeadlinePolicy({
  name: "sand-template-import-recipe",
  timeoutMs: 3e4
});
var avatarDownloadDeadline = createDeadlinePolicy({
  name: "sand-agent-avatar-download",
  timeoutMs: 3e4
});
var TemplateRecipeReadError = class extends SandDomainError {
  name = "TemplateRecipeReadError";
};
var AvatarDownloadError = class extends SandDomainError {
  name = "AvatarDownloadError";
};
function isConnectCode(error42, code) {
  return error42 instanceof ConnectError && error42.code === code;
}
function avatarChangeOf(avatar) {
  switch (avatar.kind) {
    case "keep":
      return void 0;
    case "clear":
      return { case: "clearAvatar", value: {} };
    case "replace":
      return { case: "avatarDataUrl", value: avatar.dataUrl };
  }
}
async function fetchRemoteAvatarBytes(args) {
  const deadline = args.deadline ?? avatarDownloadDeadline;
  const fetchFn = args.fetchFn ?? fetch;
  return await deadline.run(async (signal) => {
    const response = await fetchFn(args.url, { redirect: "error", signal });
    if (!response.ok) {
      throw new AvatarDownloadError(`avatar GET failed with ${response.status}`);
    }
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > AVATAR_MAX_BYTES) {
      throw new AvatarDownloadError("avatar GET exceeded the byte limit");
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const mime2 = sniffAvatarMimeType(bytes);
    if (bytes.byteLength === 0 || bytes.byteLength > AVATAR_MAX_BYTES || mime2 === null || mime2 === "image/svg+xml") {
      throw new AvatarDownloadError("avatar body failed validation");
    }
    return bytes;
  }, args.signal);
}
var agentIdentityExtension = defineHostExtension({
  id: "agent-identity",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Telemetry,
    HostExtensions.Transcript
  ],
  start: (context2) => startAgentIdentity({ context: context2 })
});
function startAgentIdentity({
  context: context2,
  client = createSandCursorBackendClient(GrokBotService, {
    backend: context2.host.environment.backend,
    getAccessToken: context2.deps.auth.getAccessToken,
    getTeamId: context2.deps.auth.getTeamId,
    getMachineId: context2.deps.auth.getMachineId
  })
}) {
  let readsEnabled = false;
  let usesLegacyIdentity = false;
  let sharedIdentityEnabled = false;
  let hasEnabledReads = false;
  let firstReadReconcile;
  let firstReadReconcileController;
  const firstReadSignals = /* @__PURE__ */ new Map();
  const lifetime = new AbortController();
  const isSharedIdentityEnabled = () => sharedIdentityEnabled;
  const capabilitiesDeadline = createDeadlinePolicy({
    name: "sand-agent-identity-capabilities",
    timeoutMs: 1e4
  });
  const ownershipDeadline = createDeadlinePolicy({
    name: "sand-agent-identity-resume-ownership",
    timeoutMs: 1e4
  });
  const applyReads = (isOn) => {
    const wasEnabled = readsEnabled;
    readsEnabled = isOn;
    if (!isOn || wasEnabled) return;
    if (!hasEnabledReads) {
      hasEnabledReads = true;
      void startFirstReadReconcile();
      return;
    }
    void service.reconcileNow();
  };
  const getCreationPolicy = async (signal = lifetime.signal) => {
    if (process.env.GROKBOT_LOCAL_MODE === "1") return {
      isLegacy: true, durableIdentityEnabled: false, durableIdentityWritesEnabled: false, temporalCreationEnabled: false
    };
    const capabilities = await readAgentIdentityCapabilities({
      client,
      deadline: capabilitiesDeadline,
      signal,
      legacy: () => {
        const durableIdentityEnabled = context2.deps.experiments.getFeatureGateProperty("grok_bot_durable_identity").get();
        return {
          durableIdentityEnabled,
          durableIdentityWritesEnabled: durableIdentityEnabled && context2.deps.experiments.getFeatureGateProperty("grok_bot_durable_identity_writes").get(),
          temporalCreationEnabled: context2.deps.experiments.getFeatureGateProperty(TEMPORAL_CREATE_GATE).get()
        };
      }
    });
    usesLegacyIdentity = capabilities.isLegacy;
    applyReads(capabilities.durableIdentityEnabled);
    return capabilities;
  };
  const isWriteEnabled = async () => (await getCreationPolicy()).durableIdentityWritesEnabled;
  const identityBackfillSentinelPath = (0, import_node_path35.join)(getSandRootDir(), IDENTITY_BACKFILL_SENTINEL_FILENAME);
  let lastMigrationCoverage;
  const getHarnessMigrationCoverage = async () => {
    let coverage;
    try {
      coverage = await getHarnessMigrationIdentityCoverage({
        getAgentsRootDir: () => getSandAgentsRootDir(),
        listAgents: () => context2.deps.transcript.listAgents(),
        isWriteEnabled,
        sentinelPath: identityBackfillSentinelPath
      });
    } catch (error42) {
      if (lastMigrationCoverage !== "pending") {
        context2.host.log(
          `[sand:agent-identity] migration coverage read failed: ${errorLogTag(error42)}`
        );
      }
      coverage = "pending";
    }
    if (coverage === "blocked" && lastMigrationCoverage !== "blocked") {
      context2.deps.telemetry.logs.reportAgentIdentitySync("warn", {
        op: "migration_coverage",
        outcome: "blocked"
      });
    }
    lastMigrationCoverage = coverage;
    return coverage;
  };
  const capabilityRecovery = createRetryPolicy({
    name: "sand-agent-identity-capability-recovery",
    ...RUNTIME_CAPABILITIES_RETRY_OPTIONS
  });
  const reportCapabilityFailure = (error42) => {
    if (lifetime.signal.aborted) return;
    context2.host.log(`[sand:agent-identity] capabilities unavailable: ${errorLogTag(error42)}`);
    context2.deps.telemetry.logs.reportAgentIdentitySync("warn", {
      op: "reconcile",
      outcome: "get_failed",
      error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
    });
  };
  const backgroundRefresh = createSingleFlight({
    read: () => (async () => {
      await context2.host.whenBackgroundWorkReady;
      if (lifetime.signal.aborted) return;
      await capabilityRecovery.runWithRetry(
        (_attempt, signal) => getCreationPolicy(signal),
        lifetime.signal
      );
    })().catch(reportCapabilityFailure),
    install: () => {
    }
  });
  const downloadTemplateRecipe = async (blobGetUrl) => {
    if (blobGetUrl.length === 0) {
      throw new TemplateRecipeReadError("template recipe URL is unavailable");
    }
    const response = await templateRecipeDeadline.run(
      (signal) => fetch(blobGetUrl, { redirect: "error", signal })
    );
    if (!response.ok) {
      throw new TemplateRecipeReadError(`recipe GET failed with ${response.status}`);
    }
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > GROK_BOT_TEMPLATE_BLOB_MAX_BYTES) {
      throw new TemplateRecipeReadError("recipe GET exceeded the byte limit");
    }
    const raw = await response.text();
    if (new TextEncoder().encode(raw).byteLength > GROK_BOT_TEMPLATE_BLOB_MAX_BYTES) {
      throw new TemplateRecipeReadError("recipe body exceeded the byte limit");
    }
    const parsed2 = botTemplateSchema.safeParse(JSON.parse(raw));
    if (!parsed2.success) {
      throw new TemplateRecipeReadError("recipe body failed schema validation");
    }
    return parsed2.data;
  };
  const readTemplateSetup = async (blobGetUrl, gettingStartedTrusted) => {
    if (blobGetUrl == null || blobGetUrl.length === 0) return { kind: "unavailable" };
    try {
      const recipe = await downloadTemplateRecipe(blobGetUrl);
      return importedTemplateSetupFromRecipe(recipe, { gettingStartedTrusted });
    } catch (error42) {
      context2.host.log(
        `[sand:agent-identity] template recipe unavailable after create: ${errorLogTag(error42)}`
      );
      return { kind: "unavailable" };
    }
  };
  const createLocalAgentFromTemplate = async (args) => {
    const details = await client.getGrokBotTemplateImportDetails({
      shareId: args.shareId
    });
    if (details.expectedActiveVersion !== args.expectedActiveVersion) {
      throw new ConnectError(
        "The shared Grok Bot was updated. Review the new details and try again.",
        Code.Aborted
      );
    }
    const recipe = await downloadTemplateRecipe(details.blobGetUrl);
    const creatorContext = args.creatorContext?.trim() ?? "";
    const profile = {
      name: recipe.profile.name,
      description: creatorContext.length === 0 ? recipe.profile.description : `${recipe.profile.description} ${creatorContext}`,
      avatarShape: recipe.profile.avatarShape ?? "",
      avatarColor: recipe.profile.avatarColor ?? ""
    };
    return {
      kind: "local_only",
      profile,
      setup: importedTemplateSetupFromRecipe(recipe)
    };
  };
  const service = new SandAgentIdentityService({
    getAgentsRootDir: () => getSandAgentsRootDir(),
    newAgentId: () => (0, import_node_crypto16.randomUUID)(),
    listRemoteAgents: async (signal) => (await client.listGrokBotAgents({}, { signal })).agents,
    createRemoteAgent: async (req) => {
      const { harness, kickstartRequested, introductionSuppressed, purpose, ...fields2 } = req;
      try {
        const { agent } = await client.createGrokBotAgent({
          ...fields2,
          harness: harnessKindOf(harness),
          kickstartRequested,
          introductionSuppressed,
          ...purpose === void 0 ? {} : { purpose }
        });
        invariant(agent !== void 0, "CreateGrokBotAgent returned no agent");
        return { outcome: "created", agent };
      } catch (error42) {
        if (isServerAgentIdTakenRefusal(error42)) return { outcome: "already_taken" };
        if (isConnectCode(error42, Code.AlreadyExists)) return { outcome: "tombstoned" };
        if (isServerTemporalHarnessRefusal(error42)) return { outcome: "temporal_unavailable" };
        throw error42;
      }
    },
    getCreationPolicy,
    createRemoteAgentFromTemplate: async ({
      shareId,
      agentId,
      expectedActiveVersion,
      creatorContext,
      language
    }) => {
      try {
        const response = await client.createGrokBotAgentFromTemplate({
          shareId,
          agentId,
          expectedActiveVersion,
          creatorContext,
          setupDelegationSupported: true,
          language
        });
        invariant(response.agent !== void 0, "CreateGrokBotAgentFromTemplate returned no agent");
        return {
          agent: response.agent,
          setup: await readTemplateSetup(
            response.blobGetUrl,
            response.gettingStartedTrusted === true
          ),
          isSetupHandledByServer: response.setupHandledByServer === true,
          isConversationalSetupEnabled: response.conversationalSetupEnabled === true
        };
      } catch (error42) {
        if (isConnectCode(error42, Code.PermissionDenied)) {
          throw new BotTemplateImportAccessDeniedError();
        }
        throw error42;
      }
    },
    updateRemoteAgent: async (req) => {
      const { serverId, avatar, ...fields2 } = req;
      try {
        const { agent } = await client.updateGrokBotAgent({
          id: serverId,
          ...fields2,
          avatarChange: avatarChangeOf(avatar)
        });
        invariant(agent !== void 0, "UpdateGrokBotAgent returned no agent");
        return { outcome: "ok", agent };
      } catch (error42) {
        if (isConnectCode(error42, Code.NotFound)) return { outcome: "not_found" };
        throw error42;
      }
    },
    deleteRemoteAgent: async (serverId) => {
      try {
        await client.deleteGrokBotAgent({ id: serverId });
        return { outcome: "ok" };
      } catch (error42) {
        if (isConnectCode(error42, Code.NotFound)) return { outcome: "not_found" };
        throw error42;
      }
    },
    getLocalAvatar: (agentId) => context2.deps.transcript.getAgentAvatar(agentId),
    fetchRemoteAvatarBytes: (url2, signal) => fetchRemoteAvatarBytes({ url: url2, signal }),
    setLocalAvatarBytes: (args) => context2.deps.transcript.setAgentAvatarBytesIfVersion(args),
    isEnabled: () => readsEnabled,
    onBoxAgentRenamed: (change) => context2.deps.transcript.noteAgentIdentityRenamed(change),
    publishAgentRoster: () => context2.deps.transcript.refreshAgentRoster(),
    isSharedIdentityEnabled,
    log: context2.host.log,
    report: (level, metadata) => context2.deps.telemetry.logs.reportAgentIdentitySync(level, metadata),
    retry: createRetryPolicy({
      name: "agent-identity-boot-get",
      maxAttempts: 5,
      initialDelayMs: 2e3,
      maxDelayMs: 3e4
    })
  });
  function startFirstReadReconcile(signal = lifetime.signal) {
    if (firstReadReconcile === void 0) {
      firstReadReconcileController = new AbortController();
      const controller = firstReadReconcileController;
      let reconciled = false;
      firstReadReconcile = ownershipDeadline.run(
        (deadlineSignal) => service.reconcileResumeOwnershipNow(deadlineSignal),
        controller.signal
      ).then((result) => {
        reconciled = result;
        return result;
      }).catch((error42) => {
        reportCapabilityFailure(error42);
        return false;
      }).finally(() => {
        for (const remove of firstReadSignals.values()) remove();
        firstReadSignals.clear();
        firstReadReconcileController = void 0;
        if (!reconciled) firstReadReconcile = void 0;
      });
    }
    linkFirstReadSignal(signal);
    return firstReadReconcile;
  }
  function linkFirstReadSignal(signal) {
    if (firstReadReconcileController === void 0 || firstReadSignals.has(signal)) return;
    const abort = () => firstReadReconcileController?.abort(signal.reason);
    if (signal.aborted) abort();
    else {
      signal.addEventListener("abort", abort, { once: true });
      firstReadSignals.set(signal, () => signal.removeEventListener("abort", abort));
    }
  }
  const reconcileBeforeResume = async (startup, signal = lifetime.signal) => {
    if (startup) linkFirstReadSignal(signal);
    try {
      return {
        reconciled: await ownershipDeadline.run(async (deadlineSignal) => {
          const capabilities = await getCreationPolicy(deadlineSignal);
          if (!capabilities.durableIdentityEnabled) return true;
          return startup ? await startFirstReadReconcile(deadlineSignal) : await service.reconcileResumeOwnershipNow(deadlineSignal);
        }, signal)
      };
    } catch (error42) {
      signal.throwIfAborted();
      reportCapabilityFailure(error42);
      return { reconciled: false, errorClass: errorLogTag(error42) };
    }
  };
  context2.onStop(
    context2.deps.transcript.subscribeProfileChanged((event) => {
      void service.noteAgentIdentityChanged(event.agentId, {
        avatarChanged: event.avatarChanged
      });
    })
  );
  context2.onStop(() => lifetime.abort());
  const refreshAfterAuthRenewal = async () => {
    await (backgroundRefresh.isInFlight ? backgroundRefresh.run() : void 0);
    await backgroundRefresh.run();
  };
  context2.onStop(
    context2.deps.auth.subscribeToRenewal((event) => {
      if (event.outcome === "renewed") {
        void refreshAfterAuthRenewal().catch(reportCapabilityFailure);
      }
    })
  );
  let sweptThisBoot = false;
  let resweepRequested = false;
  const requestResweepAfterMintMiss = async (agentId) => {
    resweepRequested = true;
    sweptThisBoot = false;
    try {
      await requestIdentityResweep(identityBackfillSentinelPath);
    } catch (error42) {
      context2.host.log(
        `[sand:agent-identity] could not clear the sweep sentinel after mint ${agentId} missed: ${errorLogTag(error42)}`
      );
    }
  };
  const initialize = async () => {
    await context2.host.whenBackgroundWorkReady;
    if (lifetime.signal.aborted) return;
    const readsGate = context2.deps.experiments.getFeatureGateProperty("grok_bot_durable_identity");
    const writesGate = context2.deps.experiments.getFeatureGateProperty(
      "grok_bot_durable_identity_writes"
    );
    const backfillGate = context2.deps.experiments.getFeatureGateProperty(
      "grok_bot_identity_backfill"
    );
    const sweepOnce = async () => {
      try {
        const isRequested = resweepRequested;
        resweepRequested = false;
        if (!isRequested && await hasSweptWithin(identityBackfillSentinelPath, IDENTITY_BACKFILL_RESWEEP_AFTER_MS)) {
          return "already_swept";
        }
        return await runIdentityBackfill({
          getAgentsRootDir: () => getSandAgentsRootDir(),
          listAgents: () => context2.deps.transcript.listAgents(),
          mintAgent: (agentId) => service.backfillAgent(agentId),
          isMintPending: (agentId) => service.isAwaitingLocalMaterializationOf(agentId),
          isHostStopping: () => lifetime.signal.aborted,
          sentinelPath: identityBackfillSentinelPath,
          report: (level, metadata) => context2.deps.telemetry.logs.reportAgentIdentitySync(level, metadata)
        });
      } catch (error42) {
        context2.host.log(`[sand:agent-identity] backfill sweep failed: ${errorLogTag(error42)}`);
        return "threw";
      }
    };
    const hasCredential = () => context2.deps.auth.peekAccessToken() !== null;
    const sweepFlight = createSingleFlight({
      read: async () => {
        let writesOn = false;
        try {
          writesOn = await isWriteEnabled();
        } catch (error42) {
          context2.host.log(
            `[sand:agent-identity] backfill creation-policy read failed: ${errorLogTag(error42)}`
          );
          sweptThisBoot = false;
          return;
        }
        if (!writesOn || lifetime.signal.aborted) {
          sweptThisBoot = false;
          return;
        }
        const result = await sweepOnce();
        if (result === "threw" || result !== "already_swept" && (result.stopped !== void 0 || result.failed > 0)) {
          sweptThisBoot = false;
        }
      },
      install: () => {
      }
    });
    const startBackfillWhenArmed = () => {
      if (sweptThisBoot || sweepFlight.isInFlight || lifetime.signal.aborted) return;
      if (!backfillGate.get() || !hasCredential()) return;
      sweptThisBoot = true;
      void sweepFlight.run();
    };
    context2.onStop(
      readsGate.subscribe((isOn) => {
        if (usesLegacyIdentity) {
          applyReads(isOn);
          startBackfillWhenArmed();
        }
      })
    );
    context2.onStop(writesGate.subscribe(startBackfillWhenArmed));
    context2.onStop(backfillGate.subscribe(startBackfillWhenArmed));
    context2.onStop(
      context2.deps.auth.subscribeToRenewal((event) => {
        if (event.outcome === "renewed") startBackfillWhenArmed();
      })
    );
    const sharedIdentityGate = context2.deps.experiments.getFeatureGateProperty(
      "grok_bot_shared_identity"
    );
    context2.onStop(
      sharedIdentityGate.subscribe((isOn) => {
        sharedIdentityEnabled = isOn;
      })
    );
    sharedIdentityEnabled = sharedIdentityGate.get();
    await backgroundRefresh.run();
    startBackfillWhenArmed();
  };
  void initialize().catch(reportCapabilityFailure);
  return {
    isWriteEnabled,
    getHarnessMigrationCoverage,
    ensureServerBacked: (agentId) => service.ensureServerBacked(agentId),
    ensureServerRoomMembers: (agentIds) => service.ensureServerRoomMembers(agentIds),
    createRemoteAgentFirst: (fields2, options2) => service.createRemoteAgentFirst(fields2, options2),
    createAgentFromTemplate: async (args) => {
      if (!isSharedIdentityEnabled()) {
        return await createLocalAgentFromTemplate(args);
      }
      return {
        kind: "server_backed",
        ...await service.createRemoteAgentFromTemplate(args)
      };
    },
    noteAgentImported: (agent) => service.noteAgentImported(agent),
    rollbackRemoteAgent: (args) => service.rollbackRemoteAgent(args),
    noteAgentMinted: (agentId) => {
      void service.noteAgentMinted(agentId).then(
        async (outcome) => {
          if (outcome === "minted" || outcome === "already_bound" || outcome === "writes_off") {
            return;
          }
          if (outcome === "error" || outcome === "unparseable") {
            await requestResweepAfterMintMiss(agentId);
          }
          context2.host.log(
            `[sand:agent-identity] mint ${agentId} left the agent local: ${outcome}`
          );
        },
        async (error42) => {
          await requestResweepAfterMintMiss(agentId);
          context2.host.log(`[sand:agent-identity] mint ${agentId} failed: ${errorLogTag(error42)}`);
          context2.deps.telemetry.logs.reportAgentIdentitySync("warn", {
            op: "mint",
            outcome: "error",
            agent_id: agentId,
            error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
          });
        }
      );
    },
    noteAgentDeleted: async (agentId) => {
      await service.noteAgentDeleted(agentId);
    },
    flushPendingEdits: () => service.flushPendingEdits(),
    reconcileNow: async () => {
      await getCreationPolicy();
      return await service.reconcileNow();
    },
    adoptServerAgent: (wire) => service.adoptServerAgent(wire),
    adoptServerAgentById: (agentId) => service.adoptServerAgentById(agentId),
    expectLocalEdit: (agentId, write2) => service.expectLocalEdit(agentId, write2),
    clearGeneratedRoomNameStamps: (rooms) => clearGeneratedRoomNameStamps({
      agentsRootDir: getSandAgentsRootDir(),
      sentinelPath: (0, import_node_path35.join)(getSandRootDir(), GENERATED_ROOM_NAME_STAMP_CLEANUP_SENTINEL_FILENAME),
      rooms,
      publishAgentRoster: () => context2.deps.transcript.refreshAgentRoster()
    }),
    reconcileBeforeStartupResume: (signal) => reconcileBeforeResume(true, signal),
    reconcileBeforeResume: (signal) => reconcileBeforeResume(false, signal)
  };
}

