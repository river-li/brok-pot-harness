/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/agent-identity/agent-identity-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs30 = require("node:fs");
var import_node_path32 = require("node:path");
init_grok_bot_pb();
init_esm2();

// @recovered-fragment 2/2
init_invariant();
var AGENT_IDENTITY_SYNC_ERROR_CODE = "SAND-E0416";
function isServerTemporalHarnessRefusal(error42) {
  return error42 instanceof ConnectError && error42.code === Code.FailedPrecondition && error42.rawMessage === SAND_TEMPORAL_HARNESS_UNAVAILABLE_MESSAGE;
}
function isServerAgentIdTakenRefusal(error42) {
  return error42 instanceof ConnectError && error42.code === Code.AlreadyExists && error42.rawMessage === SAND_AGENT_ID_TAKEN_MESSAGE;
}
function serverBindingOf(binding) {
  return {
    serverId: binding.serverId,
    ...binding.harness === null ? {} : { harness: binding.harness },
    ...binding.origin === void 0 ? {} : { origin: binding.origin },
    ...binding.purpose === void 0 ? {} : { purpose: binding.purpose },
    ...binding.role == null ? {} : { role: binding.role }
  };
}
function rowRenamedLocalAgent(agent, local) {
  if (local === null) return false;
  const localName = local.name.trim();
  return localName.length > 0 && localName !== agent.name.trim();
}
function identityFromRowKeepingNamedBy(agent, local) {
  const namedBy = rowRenamedLocalAgent(agent, local) ? "user" : local?.namedBy;
  return {
    name: agent.name,
    description: agent.description,
    title: agent.title,
    avatarShape: agent.avatarShape,
    avatarColor: agent.avatarColor,
    ...namedBy == null ? {} : { namedBy }
  };
}
function localIdentityDiverged(before, after) {
  return before.name !== after.name || before.description !== after.description || before.title !== after.title || (before.avatarShape ?? "") !== (after.avatarShape ?? "") || (before.avatarColor ?? "") !== (after.avatarColor ?? "");
}
var DIR_NAME_SAFE_UUID = /^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/;
function mirrorRoomMembers(agentDir, memberIds) {
  const current = readSandGroupConfig(agentDir);
  if (current !== null && current.memberIds.length === memberIds.length && current.memberIds.every((id, index) => id === memberIds[index])) {
    return;
  }
  writeSandGroupConfig(agentDir, { version: GROUP_CONFIG_VERSION, memberIds });
}
function toRemoteGrokBotAgent(wire) {
  if (!DIR_NAME_SAFE_UUID.test(wire.agentId)) return null;
  if (wire.id.trim().length === 0) return null;
  const { origin, purpose } = profileServerBindingFromJson(wire);
  if (wire.harness != null && wire.harness !== "" && wire.harness !== "box" && wire.harness !== "temporal")
    return null;
  const role = wire.role?.trim() ?? "";
  return {
    serverId: wire.id,
    handle: wire.agentId,
    name: wire.name,
    description: wire.description,
    title: wire.title,
    avatarShape: wire.avatarShape,
    avatarColor: wire.avatarColor,
    avatarVersion: wire.avatarVersion ?? null,
    avatarUrl: wire.avatarUrl ?? null,
    harness: wire.harness === "temporal" || wire.harness === "box" ? wire.harness : null,
    ...origin === void 0 ? {} : { origin },
    ...purpose === void 0 ? {} : { purpose },
    role: role.length > 0 ? role : null,
    roomMemberIds: wire.kind === GrokBotAgentKind.ROOM ? (wire.memberAgentIds ?? []).filter((id) => DIR_NAME_SAFE_UUID.test(id)) : null
  };
}
function identityInputFromRemote(agent) {
  return {
    name: defaultedName(agent.name),
    description: agent.description,
    title: agent.title,
    avatarShape: agent.avatarShape,
    avatarColor: agent.avatarColor
  };
}
function identitiesMatch(left, right) {
  return left.name === right.name && left.description === right.description && left.title === right.title && left.avatarShape === right.avatarShape && left.avatarColor === right.avatarColor;
}
function isServerSupportedAvatarDataUrl(dataUrl) {
  return dataUrl.startsWith("data:image/png;base64,") || dataUrl.startsWith("data:image/jpeg;base64,") || dataUrl.startsWith("data:image/webp;base64,") || dataUrl.startsWith("data:image/gif;base64,");
}
function changedAvatarUpdate(dataUrl) {
  if (dataUrl === null) return { kind: "clear" };
  if (!isServerSupportedAvatarDataUrl(dataUrl)) return { kind: "keep" };
  return { kind: "replace", dataUrl };
}
function createAvatarDataUrl(dataUrl) {
  return dataUrl !== null && isServerSupportedAvatarDataUrl(dataUrl) ? dataUrl : void 0;
}
var SandAgentIdentityService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  queue = Promise.resolve();
  pendingEditIds = /* @__PURE__ */ new Set();
  unacknowledgedEditIds = /* @__PURE__ */ new Set();
  expectedEditCounts = /* @__PURE__ */ new Map();
  mintedServerIds = /* @__PURE__ */ new Map();
  pendingLocalMaterializationIds = /* @__PURE__ */ new Set();
  serverIdentities = /* @__PURE__ */ new Map();
  serverAvatarVersions = /* @__PURE__ */ new Map();
  unresolvedAvatarBaselines = /* @__PURE__ */ new Map();
  unsupportedLocalAvatarBaselines = /* @__PURE__ */ new Map();
  locallyChangedAvatarIds = /* @__PURE__ */ new Set();
  adoptServerAgent(wire) {
    return this.runSerialized(async () => {
      const agent = toRemoteGrokBotAgent(wire);
      if (agent === null) return false;
      const root = this.deps.getAgentsRootDir();
      if (!await this.syncDownAgent(root, agent)) return false;
      this.serverAvatarVersions.set(agent.handle, agent.avatarVersion);
      await this.deps.publishAgentRoster();
      return true;
    }).catch((error42) => {
      this.deps.log(`[sand:agent-identity] adopt failed: ${errorMessage2(error42)}`);
      return false;
    });
  }
  async adoptServerAgentById(agentId) {
    const profilePath = this.profilePathFor(agentId);
    if (readSandProfileServerId(profilePath) !== null) return "bound";
    return this.runSerialized(async () => {
      if (readSandProfileServerId(profilePath) !== null) return "bound";
      const local = readSandProfileFile(profilePath);
      if (!this.deps.isEnabled()) return local === null ? "missing" : "local";
      let rows;
      try {
        rows = await this.deps.listRemoteAgents();
      } catch (error42) {
        this.deps.log(`[sand:agent-identity] adopt ${agentId} failed: ${errorMessage2(error42)}`);
        return local === null ? "unavailable" : "local";
      }
      const agent = rows.map(toRemoteGrokBotAgent).find((row) => row?.handle === agentId);
      if (agent == null) return local === null ? "missing" : "local";
      this.bindDirToRow(
        this.deps.getAgentsRootDir(),
        agent,
        local ?? identityFromRowKeepingNamedBy(agent, null)
      );
      this.rememberServerIdentity(agentId, agent);
      this.serverAvatarVersions.set(agentId, agent.avatarVersion);
      await this.deps.publishAgentRoster();
      return "bound";
    });
  }
  reconcileNow() {
    return this.runSerialized(async () => {
      const result = await this.reconcile();
      if (result.kind === "not_reconciled") return false;
      await this.deps.publishAgentRoster();
      return result.fullyReconciled;
    }).catch((error42) => this.reportReconcileFailure(error42));
  }
  reconcileResumeOwnershipNow(signal) {
    return this.runSerialized(async () => {
      const result = await this.reconcile(signal);
      if (result.kind === "not_reconciled") return false;
      signal?.throwIfAborted();
      try {
        await this.deps.publishAgentRoster();
        signal?.throwIfAborted();
      } catch (error42) {
        signal?.throwIfAborted();
        this.deps.log(
          `[sand:agent-identity] roster publication failed after ownership reconcile: ${errorMessage2(error42)}`
        );
        this.deps.report("warn", {
          op: "reconcile",
          outcome: "error",
          error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
        });
      }
      return true;
    }).catch((error42) => {
      signal?.throwIfAborted();
      return this.reportReconcileFailure(error42);
    });
  }
  noteAgentMinted(agentId) {
    return this.runSerialized(() => this.mint(agentId, "mint"));
  }
  backfillAgent(agentId) {
    return this.runSerialized(() => this.mint(agentId, "backfill"));
  }
  async createRemoteAgentFirst(fields2, options2) {
    const policy = await this.deps.getCreationPolicy();
    const create = this.deps.createRemoteAgent;
    if (options2?.harness === "temporal" && (!policy.durableIdentityWritesEnabled || !policy.temporalCreationEnabled || create == null)) {
      throw new ConnectError(SAND_TEMPORAL_HARNESS_UNAVAILABLE_MESSAGE, Code.FailedPrecondition);
    }
    if (!policy.durableIdentityWritesEnabled || create == null) return null;
    const agentId = this.deps.newAgentId();
    const dealt = withGeneratedMark(agentId, fields2);
    this.pendingLocalMaterializationIds.add(agentId);
    try {
      const confirmed = await this.mintRemoteFirst({
        create,
        agentId,
        fields: dealt,
        wantsTemporal: options2?.harness !== "box" && policy.temporalCreationEnabled,
        allowBoxFallback: options2?.harness !== "temporal" && policy.isLegacy
      });
      return {
        agentId,
        serverId: confirmed.serverId,
        harness: confirmed.harness,
        avatarShape: dealt.avatarShape,
        avatarColor: dealt.avatarColor
      };
    } catch (error42) {
      this.pendingLocalMaterializationIds.delete(agentId);
      throw error42;
    }
  }
  ensureServerRoomMembers(agentIds) {
    return this.runSerialized(async () => {
      if (agentIds.length === 0) return;
      const create = this.deps.createRemoteAgent;
      if (!(await this.deps.getCreationPolicy()).durableIdentityWritesEnabled || create == null) {
        throw new ConnectError(
          "Bot identities are not ready for server rooms.",
          Code.InvalidArgument
        );
      }
      for (const agentId of new Set(agentIds)) {
        if (!DIR_NAME_SAFE_UUID.test(agentId)) {
          throw new ConnectError("Room member id must be a UUID.", Code.InvalidArgument);
        }
        const profilePath = this.profilePathFor(agentId);
        const identity = readSandProfileFile(profilePath);
        if (identity == null || readSandGroupConfig((0, import_node_path32.join)(this.deps.getAgentsRootDir(), agentId)) !== null) {
          throw new ConnectError(
            `Member agent ${agentId} has no local Bot profile.`,
            Code.InvalidArgument
          );
        }
        const avatarDataUrl = await this.readLocalAvatarForUpload(agentId);
        const result = await this.requestMint(create, {
          agentId,
          ...withGeneratedMark(agentId, identityInput(identity)),
          harness: "box",
          introductionSuppressed: true,
          ...avatarDataUrl === void 0 ? {} : { avatarDataUrl }
        });
        switch (result.outcome) {
          case "tombstoned":
          case "already_taken":
            throw new ConnectError(
              `Member agent ${agentId} is not available to this account.`,
              Code.InvalidArgument
            );
          case "temporal_unavailable":
            throw new ConnectError(
              `Member agent ${agentId} could not be registered.`,
              Code.InvalidArgument
            );
          case "created": {
            const confirmed = toRemoteGrokBotAgent(result.agent);
            if (confirmed === null || confirmed.handle !== agentId || confirmed.roomMemberIds !== null) {
              throw new ConnectError(
                "The server did not confirm the room member identity.",
                Code.DataLoss
              );
            }
            this.mintedServerIds.set(agentId, confirmed.serverId);
            this.stampFromRemote(agentId, profilePath, confirmed, identity);
            await this.rememberLocalAvatarIfItDoesNotMatchRow(agentId, confirmed.avatarVersion);
            break;
          }
          default: {
            const exhaustive = result;
            return exhaustive;
          }
        }
      }
    });
  }
  ensureServerBacked(agentId) {
    return this.runSerialized(async () => {
      const profilePath = this.profilePathFor(agentId);
      const existingServerId = readSandProfileServerId(profilePath);
      if (existingServerId !== null) {
        return {
          kind: "server_backed",
          serverId: existingServerId,
          harness: readSandProfileHarness(profilePath)
        };
      }
      if (!this.deps.isSharedIdentityEnabled()) {
        return { kind: "local_only" };
      }
      const create = this.deps.createRemoteAgent;
      invariant(create != null, "ensureServerBacked: RPC client unavailable");
      const identity = readSandProfileFile(profilePath);
      invariant(identity != null, "ensureServerBacked: local profile unavailable");
      const dealt = withGeneratedMark(agentId, identityInput(identity));
      const avatarDataUrl = await this.readLocalAvatarForUpload(agentId);
      const result = await this.requestMint(create, {
        agentId,
        ...dealt,
        ...avatarDataUrl === void 0 ? {} : { avatarDataUrl }
      });
      invariant(result.outcome !== "tombstoned", "ensureServerBacked: agent_id tombstoned");
      invariant(result.outcome !== "already_taken", "ensureServerBacked: agent_id already taken");
      invariant(
        result.outcome !== "temporal_unavailable",
        "ensureServerBacked: box create refused as temporal"
      );
      const confirmed = toRemoteGrokBotAgent(result.agent);
      invariant(
        confirmed !== null && confirmed.handle === agentId,
        "ensureServerBacked: unparseable create confirmation"
      );
      this.stampFromRemote(agentId, profilePath, confirmed, identity);
      await this.rememberLocalAvatarIfItDoesNotMatchRow(agentId, confirmed.avatarVersion);
      return {
        kind: "server_backed",
        serverId: confirmed.serverId,
        harness: confirmed.harness
      };
    });
  }
  async createRemoteAgentFromTemplate(args) {
    const create = this.deps.createRemoteAgentFromTemplate;
    invariant(create != null, "createRemoteAgentFromTemplate: RPC client unavailable");
    const result = await create(args);
    const agent = toRemoteGrokBotAgent(result.agent);
    invariant(
      agent != null && agent.handle === args.agentId,
      "createRemoteAgentFromTemplate: unparseable create confirmation"
    );
    this.rememberServerIdentity(agent.handle, agent);
    this.serverAvatarVersions.set(agent.handle, agent.avatarVersion);
    const setup = result.setup.kind === "recipe" && result.isConversationalSetupEnabled === true ? { ...result.setup, isConversationalSetup: true } : result.setup;
    return {
      agent,
      setup: importedTemplateSetupForHarness(setup, agent.harness, {
        isServerSetupConfirmed: result.isSetupHandledByServer === true
      })
    };
  }
  noteLocalMaterializationFinished(agentId) {
    this.pendingLocalMaterializationIds.delete(agentId);
  }
  isAwaitingLocalMaterializationOf(agentId) {
    return this.pendingLocalMaterializationIds.has(agentId);
  }
  noteAgentImported(agent) {
    if (!this.deps.isEnabled()) return;
    this.stampFromRemote(agent.handle, this.profilePathFor(agent.handle), agent);
  }
  async mintRemoteFirst({
    create,
    agentId,
    fields: fields2,
    wantsTemporal,
    allowBoxFallback
  }) {
    const base = { agentId, ...fields2, name: defaultedName(fields2.name) };
    let result = await this.requestMint(
      create,
      wantsTemporal ? { ...base, harness: "temporal" } : base
    );
    if (result.outcome === "temporal_unavailable") {
      if (!allowBoxFallback) {
        throw new ConnectError(SAND_TEMPORAL_HARNESS_UNAVAILABLE_MESSAGE, Code.FailedPrecondition);
      }
      this.deps.log(
        `[sand:agent-identity] Temporal harness unavailable for ${agentId}; creating on the box instead`
      );
      this.deps.report("warn", {
        op: "mint",
        outcome: "temporal_unavailable",
        agent_id: agentId
      });
      result = await this.requestMint(create, base);
    }
    invariant(result.outcome !== "tombstoned", "createRemoteAgentFirst: fresh agent_id tombstoned");
    invariant(
      result.outcome !== "already_taken",
      "createRemoteAgentFirst: fresh agent_id already taken"
    );
    invariant(
      result.outcome !== "temporal_unavailable",
      "createRemoteAgentFirst: box create refused as temporal"
    );
    const confirmed = toRemoteGrokBotAgent(result.agent);
    if (confirmed === null || confirmed.handle !== agentId) {
      this.deps.report("warn", { op: "mint", outcome: "unparseable", agent_id: agentId });
      invariant(false, "createRemoteAgentFirst: unparseable create confirmation");
    }
    if (wantsTemporal && !allowBoxFallback && confirmed.harness !== "temporal") {
      await this.rollbackRemoteAgent({ agentId, serverId: confirmed.serverId });
      throw new ConnectError(
        "The server did not create a Temporal agent.",
        Code.FailedPrecondition
      );
    }
    this.rememberServerIdentity(agentId, confirmed);
    this.serverAvatarVersions.set(agentId, confirmed.avatarVersion);
    this.deps.report("info", {
      op: "mint",
      outcome: "ok",
      agent_id: agentId,
      harness: confirmed.harness ?? void 0
    });
    return confirmed;
  }
  async requestMint(create, request5) {
    try {
      return await this.deps.retry.runWithRetry(() => create(request5));
    } catch (error42) {
      this.deps.report("warn", {
        op: "mint",
        outcome: "error",
        agent_id: request5.agentId,
        error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
      });
      throw error42;
    }
  }
  rollbackRemoteAgent(args) {
    return this.enqueue(async () => {
      await this.deleteUpstream(args.agentId, args.serverId);
      this.pendingLocalMaterializationIds.delete(args.agentId);
    });
  }
  async expectLocalEdit(agentId, write2) {
    this.expectedEditCounts.set(agentId, (this.expectedEditCounts.get(agentId) ?? 0) + 1);
    try {
      return await write2();
    } finally {
      const remaining = (this.expectedEditCounts.get(agentId) ?? 0) - 1;
      if (remaining > 0) this.expectedEditCounts.set(agentId, remaining);
      else this.expectedEditCounts.delete(agentId);
    }
  }
  noteAgentIdentityChanged(agentId, options2 = {}) {
    if (options2.avatarChanged === true) this.locallyChangedAvatarIds.add(agentId);
    if (this.pendingEditIds.has(agentId)) return this.queue;
    this.pendingEditIds.add(agentId);
    this.unacknowledgedEditIds.add(agentId);
    return this.enqueue(async () => {
      this.pendingEditIds.delete(agentId);
      const acknowledged = await this.pushEdit(agentId);
      if (acknowledged && !this.pendingEditIds.has(agentId)) {
        this.unacknowledgedEditIds.delete(agentId);
      }
    });
  }
  noteAgentDeleted(agentId) {
    const serverId = readSandProfileServerId(this.profilePathFor(agentId));
    return this.enqueue(() => this.deleteUpstream(agentId, serverId));
  }
  flushPendingEdits() {
    return this.queue;
  }
  profilePathFor(agentId) {
    return getSandProfilePath((0, import_node_path32.join)(this.deps.getAgentsRootDir(), agentId));
  }
  enqueue(run) {
    void this.runSerialized(run);
    return this.queue;
  }
  runSerialized(run) {
    const next = this.queue.then(run, run);
    this.queue = next.then(
      () => void 0,
      (error42) => {
        this.deps.log(`[sand:agent-identity] operation failed: ${errorMessage2(error42)}`);
      }
    );
    return next;
  }
  reportReconcileFailure(error42) {
    this.deps.log(`[sand:agent-identity] reconcile failed: ${errorMessage2(error42)}`);
    this.deps.report("warn", {
      op: "reconcile",
      outcome: "error",
      error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
    });
    return false;
  }
  async reconcile(signal) {
    const enabled = this.deps.isEnabled();
    if (!enabled) return { kind: "not_reconciled" };
    const root = this.deps.getAgentsRootDir();
    let remote;
    try {
      remote = await this.deps.retry.runWithRetry(async (_attempt, retrySignal) => {
        const agents = await this.deps.listRemoteAgents(retrySignal);
        return agents.map(toRemoteGrokBotAgent).filter((agent) => agent != null);
      }, signal);
    } catch (error42) {
      signal?.throwIfAborted();
      this.deps.log(
        `[sand:agent-identity] ListGrokBotAgents failed after retries: ${errorMessage2(error42)}`
      );
      this.deps.report("warn", {
        op: "reconcile",
        outcome: "get_failed",
        error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
      });
      return { kind: "not_reconciled" };
    }
    signal?.throwIfAborted();
    let synced = 0;
    let skippedLocal = 0;
    let avatarsRestored = 0;
    let avatarRestoreFailed = 0;
    for (const agent of remote) {
      signal?.throwIfAborted();
      if (this.isAwaitingLocalMaterialization(root, agent.handle)) skippedLocal += 1;
      else if (await this.syncDownAgent(root, agent)) {
        signal?.throwIfAborted();
        synced += 1;
        this.serverAvatarVersions.set(agent.handle, agent.avatarVersion);
        const avatarOutcome = await this.reconcileAvatar(agent, signal);
        if (avatarOutcome === "restored") avatarsRestored += 1;
        else if (avatarOutcome === "failed") avatarRestoreFailed += 1;
      } else skippedLocal += 1;
    }
    signal?.throwIfAborted();
    this.deps.report("info", {
      op: "reconcile",
      outcome: "ok",
      remote_agents: String(remote.length),
      synced: String(synced),
      skipped_local: String(skippedLocal),
      avatars_restored: String(avatarsRestored),
      avatar_restore_failed: String(avatarRestoreFailed)
    });
    return {
      kind: "ownership_reconciled",
      fullyReconciled: avatarRestoreFailed === 0
    };
  }
  async reconcileAvatar(agent, signal) {
    signal?.throwIfAborted();
    const local = await this.deps.getLocalAvatar(agent.handle);
    signal?.throwIfAborted();
    if (local.version === agent.avatarVersion) return "unchanged";
    if (this.locallyChangedAvatarIds.has(agent.handle)) return "superseded";
    if (agent.avatarVersion === null) {
      if (agent.harness === "temporal") {
        return await this.applyRemoteAvatar(agent, local.version, null, signal);
      }
      this.serverAvatarVersions.set(agent.handle, local.version);
      this.unresolvedAvatarBaselines.delete(agent.handle);
      this.unsupportedLocalAvatarBaselines.delete(agent.handle);
      return "unchanged";
    }
    if (agent.avatarUrl === null) {
      this.unresolvedAvatarBaselines.set(agent.handle, local.version);
      return "failed";
    }
    let bytes;
    try {
      bytes = await this.deps.fetchRemoteAvatarBytes(agent.avatarUrl, signal);
    } catch (error42) {
      signal?.throwIfAborted();
      this.unresolvedAvatarBaselines.set(agent.handle, local.version);
      this.deps.log(
        `[sand:agent-identity] avatar restore ${agent.handle} failed: ${errorMessage2(error42)}`
      );
      return "failed";
    }
    signal?.throwIfAborted();
    return await this.applyRemoteAvatar(agent, local.version, bytes, signal);
  }
  async applyRemoteAvatar(agent, expectedVersion, bytes, signal) {
    signal?.throwIfAborted();
    try {
      const restored = await this.deps.setLocalAvatarBytes({
        agentId: agent.handle,
        expectedVersion,
        bytes,
        isCurrent: () => !this.locallyChangedAvatarIds.has(agent.handle)
      });
      signal?.throwIfAborted();
      if (!restored) return "superseded";
      this.unresolvedAvatarBaselines.delete(agent.handle);
      this.unsupportedLocalAvatarBaselines.delete(agent.handle);
      return "restored";
    } catch (error42) {
      signal?.throwIfAborted();
      this.unresolvedAvatarBaselines.set(agent.handle, expectedVersion);
      this.deps.log(
        `[sand:agent-identity] avatar restore ${agent.handle} failed: ${errorMessage2(error42)}`
      );
      return "failed";
    }
  }
  isAwaitingLocalMaterialization(root, handle) {
    if (!this.pendingLocalMaterializationIds.has(handle)) return false;
    if (!(0, import_node_fs30.existsSync)(getSandProfilePath((0, import_node_path32.join)(root, handle)))) return true;
    this.pendingLocalMaterializationIds.delete(handle);
    return false;
  }
  async syncDownAgent(root, agent) {
    const profilePath = getSandProfilePath((0, import_node_path32.join)(root, agent.handle));
    const isUnboundLocalDir = (0, import_node_fs30.existsSync)(profilePath) && readSandProfileServerId(profilePath) === null;
    if (isUnboundLocalDir) return this.adoptPromotedRoomDir(root, agent);
    const local = readSandProfileFile(profilePath);
    this.rememberServerIdentity(agent.handle, agent);
    if (local !== null && (this.unacknowledgedEditIds.has(agent.handle) || this.expectedEditCounts.has(agent.handle))) {
      void this.noteAgentIdentityChanged(agent.handle);
      return true;
    }
    this.bindDirToRow(root, agent, identityFromRowKeepingNamedBy(agent, local));
    if (agent.harness !== "temporal" && local !== null && local.name.trim().length > 0 && local.name.trim() !== agent.name.trim()) {
      await this.deps.onBoxAgentRenamed?.({
        agentId: agent.handle,
        previousName: local.name.trim(),
        name: agent.name.trim()
      });
    }
    return true;
  }
  adoptPromotedRoomDir(root, agent) {
    const agentDir = (0, import_node_path32.join)(root, agent.handle);
    if (agent.roomMemberIds === null || readSandGroupConfig(agentDir) === null) return false;
    const local = readSandProfileFile(getSandProfilePath(agentDir));
    this.rememberServerIdentity(agent.handle, agent);
    if (local === null) {
      this.bindDirToRow(root, agent, identityFromRowKeepingNamedBy(agent, null));
      return true;
    }
    this.bindDirToRow(root, agent, local);
    void this.noteAgentIdentityChanged(agent.handle, { avatarChanged: true });
    return true;
  }
  bindDirToRow(root, agent, identity) {
    const agentDir = (0, import_node_path32.join)(root, agent.handle);
    writeServerBackedProfileFile(getSandProfilePath(agentDir), identity, serverBindingOf(agent));
    if (agent.roomMemberIds !== null) mirrorRoomMembers(agentDir, agent.roomMemberIds);
  }
  async mint(agentId, op) {
    const create = this.deps.createRemoteAgent;
    if (!(await this.deps.getCreationPolicy()).durableIdentityWritesEnabled || create == null) {
      this.deps.report("info", { op, outcome: "writes_off", agent_id: agentId });
      return "writes_off";
    }
    const profilePath = this.profilePathFor(agentId);
    if (readSandProfileServerId(profilePath) !== null) {
      this.deps.report("info", { op, outcome: "already_bound", agent_id: agentId });
      return "already_bound";
    }
    const identity = readSandProfileFile(profilePath);
    if (identity == null) {
      if ((0, import_node_fs30.existsSync)(profilePath)) {
        this.deps.report("warn", { op, outcome: "unparseable", agent_id: agentId });
        return "unparseable";
      }
      this.deps.report((0, import_node_fs30.existsSync)((0, import_node_path32.dirname)(profilePath)) ? "warn" : "info", {
        op,
        outcome: "no_profile",
        agent_id: agentId
      });
      return "no_profile";
    }
    const dealt = withGeneratedMark(agentId, identityInput(identity));
    const avatarDataUrl = await this.readLocalAvatarForUpload(agentId);
    const attempt = await this.runWrite(
      op,
      agentId,
      () => create({
        agentId,
        ...dealt,
        ...avatarDataUrl === void 0 ? {} : { avatarDataUrl }
      })
    );
    if (!attempt.ok) return "error";
    const result = attempt.value;
    if (result.outcome === "already_taken") {
      this.deps.log(`[sand:agent-identity] ${op} ${agentId} refused: agent id already taken`);
      this.deps.report("warn", { op, outcome: "already_taken", agent_id: agentId });
      return "already_taken";
    }
    if (result.outcome === "tombstoned") {
      this.deps.report("info", { op, outcome: "tombstoned", agent_id: agentId });
      return "tombstoned";
    }
    if (result.outcome === "temporal_unavailable") {
      this.deps.report("warn", { op, outcome: result.outcome, agent_id: agentId });
      return "error";
    }
    const confirmed = toRemoteGrokBotAgent(result.agent);
    if (confirmed == null || confirmed.handle !== agentId) {
      this.deps.report("warn", { op, outcome: "unparseable", agent_id: agentId });
      return "unparseable";
    }
    this.mintedServerIds.set(agentId, confirmed.serverId);
    this.stampFromRemote(agentId, profilePath, confirmed, identity);
    await this.rememberLocalAvatarIfItDoesNotMatchRow(agentId, confirmed.avatarVersion);
    this.deps.report("info", { op, outcome: "ok", agent_id: agentId });
    return "minted";
  }
  async readLocalAvatarForUpload(agentId) {
    let dataUrl;
    try {
      dataUrl = (await this.deps.getLocalAvatar(agentId)).dataUrl;
    } catch (error42) {
      this.deps.log(`[sand:agent-identity] avatar read ${agentId} failed: ${errorMessage2(error42)}`);
      return void 0;
    }
    return createAvatarDataUrl(dataUrl);
  }
  async pushEdit(agentId) {
    const update = this.deps.updateRemoteAgent;
    if (update == null) return true;
    const profilePath = this.profilePathFor(agentId);
    const serverId = readSandProfileServerId(profilePath);
    if (serverId === null) return true;
    const identity = readSandProfileFile(profilePath);
    if (identity == null) return true;
    const localIdentity = identityInput(identity);
    const localAvatar = await this.deps.getLocalAvatar(agentId);
    const serverAvatarVersion = this.serverAvatarVersions.get(agentId);
    const unresolvedBaseline = this.unresolvedAvatarBaselines.get(agentId);
    const hasUnsupportedBaseline = this.unsupportedLocalAvatarBaselines.has(agentId);
    let avatar = { kind: "keep" };
    if (serverAvatarVersion !== void 0 && localAvatar.version !== serverAvatarVersion && (unresolvedBaseline === void 0 || localAvatar.version !== unresolvedBaseline)) {
      if (hasUnsupportedBaseline && localAvatar.dataUrl === null) {
        this.unsupportedLocalAvatarBaselines.set(agentId, null);
      } else {
        avatar = changedAvatarUpdate(localAvatar.dataUrl);
        if (avatar.kind === "keep" && localAvatar.dataUrl !== null) {
          this.unsupportedLocalAvatarBaselines.set(agentId, localAvatar.version);
        }
      }
    }
    const serverIdentity = this.serverIdentities.get(agentId);
    if (avatar.kind === "keep" && serverIdentity !== void 0 && identitiesMatch(localIdentity, serverIdentity)) {
      this.locallyChangedAvatarIds.delete(agentId);
      return true;
    }
    const attempt = await this.runWrite(
      "edit",
      agentId,
      () => update({ serverId, ...localIdentity, avatar })
    );
    if (!attempt.ok) return false;
    const result = attempt.value;
    if (result.outcome === "ok") {
      const confirmed = toRemoteGrokBotAgent(result.agent);
      if (confirmed !== null) {
        this.rememberServerIdentity(agentId, confirmed);
        this.serverAvatarVersions.set(agentId, confirmed.avatarVersion);
        if (avatar.kind !== "keep") {
          this.unresolvedAvatarBaselines.delete(agentId);
          this.unsupportedLocalAvatarBaselines.delete(agentId);
        }
      }
      this.locallyChangedAvatarIds.delete(agentId);
    }
    this.deps.report("info", {
      op: "edit",
      outcome: result.outcome === "not_found" ? "not_found" : "ok",
      agent_id: agentId,
      avatar_change: avatar.kind
    });
    return true;
  }
  async deleteUpstream(agentId, serverId) {
    const effectiveServerId = serverId ?? this.mintedServerIds.get(agentId) ?? null;
    if (effectiveServerId === null) return;
    const del = this.deps.deleteRemoteAgent;
    if (del == null) return;
    try {
      const attempt = await this.runWrite("delete", agentId, () => del(effectiveServerId));
      if (!attempt.ok) return;
      const result = attempt.value;
      this.deps.report("info", {
        op: "delete",
        outcome: result.outcome === "not_found" ? "not_found" : "ok",
        agent_id: agentId
      });
    } finally {
      this.mintedServerIds.delete(agentId);
      this.serverIdentities.delete(agentId);
      this.serverAvatarVersions.delete(agentId);
      this.unresolvedAvatarBaselines.delete(agentId);
      this.unsupportedLocalAvatarBaselines.delete(agentId);
      this.locallyChangedAvatarIds.delete(agentId);
    }
  }
  stampFromRemote(agentId, profilePath, remote, expectedLocal) {
    const local = readSandProfileFile(profilePath);
    if (local == null) return;
    const identity = expectedLocal !== void 0 && localIdentityDiverged(expectedLocal, local) ? local : identityFromRowKeepingNamedBy(remote, local);
    writeServerBackedProfileFile(profilePath, identity, serverBindingOf(remote));
    this.rememberServerIdentity(agentId, remote);
  }
  rememberServerIdentity(agentId, remote) {
    this.serverIdentities.set(agentId, identityInputFromRemote(remote));
  }
  async rememberLocalAvatarIfItDoesNotMatchRow(agentId, rowAvatarVersion) {
    let localVersion;
    try {
      localVersion = (await this.deps.getLocalAvatar(agentId)).version;
    } catch (error42) {
      this.deps.log(`[sand:agent-identity] avatar read ${agentId} failed: ${errorMessage2(error42)}`);
      return;
    }
    this.serverAvatarVersions.set(agentId, rowAvatarVersion);
    if (localVersion !== rowAvatarVersion) {
      this.unresolvedAvatarBaselines.set(agentId, localVersion);
    }
  }
  async runWrite(op, agentId, work) {
    try {
      return { ok: true, value: await this.deps.retry.runWithRetry(work) };
    } catch (error42) {
      this.deps.log(
        `[sand:agent-identity] ${op} ${agentId} failed after retries: ${errorMessage2(error42)}`
      );
      this.deps.report("warn", {
        op,
        outcome: "error",
        agent_id: agentId,
        error_code: AGENT_IDENTITY_SYNC_ERROR_CODE
      });
      return { ok: false };
    }
  }
};
function errorMessage2(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}
function defaultedName(raw) {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : SAND_DEFAULT_AGENT_NAME;
}
function clampToMax(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}
function identityInput(profile) {
  return {
    name: clampToMax(defaultedName(profile.name), SAND_GROK_BOT_AGENT_NAME_MAX_LENGTH),
    description: clampToMax(profile.description, SAND_GROK_BOT_AGENT_DESCRIPTION_MAX_LENGTH),
    title: clampToMax(profile.title, SAND_GROK_BOT_AGENT_TITLE_MAX_LENGTH),
    avatarShape: profile.avatarShape ?? "",
    avatarColor: profile.avatarColor ?? ""
  };
}
function withGeneratedMark(agentId, fields2) {
  const mark = resolveGrokBotMark({
    agentId,
    avatarShape: fields2.avatarShape,
    avatarColor: fields2.avatarColor
  });
  return { ...fields2, avatarShape: mark.shape, avatarColor: mark.color };
}

