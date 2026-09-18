init_esm2();
init_system_errno();
var NO_DESIRED_CLOUD_AUTOMATION_IDS = /* @__PURE__ */ new Set();
function sameIds(left, right) {
  if (left.size !== right.size) return false;
  for (const id of left) {
    if (!right.has(id)) return false;
  }
  return true;
}
function sameSchedulingAuthority(left, right) {
  return left !== void 0 && sameIds(left.desiredCloudAutomationIds, right.desiredCloudAutomationIds) && sameIds(left.enabledRemoteAutomationIds, right.enabledRemoteAutomationIds);
}
function errorIdentity(error41) {
  const errorType = error41 instanceof Error ? error41.constructor.name : typeof error41;
  const errorCode = error41 instanceof ConnectError ? Code[error41.code] : findSystemErrno(error41);
  return errorCode === void 0 ? { errorType } : { errorType, errorCode };
}
function retainsUndesiredShadows(state) {
  return state === "configs_invalid" || state === "dir_empty";
}
function leavesUndesiredShadowsUntouched(state) {
  return state === "dir_missing";
}
function desiredShadowsOnly(remoteByAutomationId, desiredByAutomationId) {
  return new Map(
    [...remoteByAutomationId].filter(([automationId]) => desiredByAutomationId.has(automationId))
  );
}
var SandAutomationCloudSync = class {
  constructor(deps) {
    this.deps = deps;
    this.settings = {
      getUserTimeZone: deps.getTimeZone ?? (() => void 0)
    };
  }
  deps;
  inFlight;
  rerun = false;
  lastSuccessfulFingerprintByAgent = /* @__PURE__ */ new Map();
  schedulingEvidenceByAgent = /* @__PURE__ */ new Map();
  lastNotifiedSchedulingAuthorityByAgent = /* @__PURE__ */ new Map();
  failedAgentIds = /* @__PURE__ */ new Set();
  pendingAgentDeletions = /* @__PURE__ */ new Set();
  settings;
  setSettings(settings) {
    this.settings = settings;
  }
  shouldScheduleLocally({ agentId, automation }, event) {
    if (!isServerSchedulable(automation)) return true;
    const listeners2 = triggerListeners(automation.trigger);
    const isGithubSubscribed = this.deps.isGithubSubscribed;
    if (isGithubSubscribed !== void 0 && listeners2.some(
      (listener) => listener.type === "github" && !isGithubSubscribed(listener.repo) && (event === void 0 || event.source === "github" && event.repo.toLowerCase() === listener.repo.toLowerCase())
    )) {
      return true;
    }
    if (listeners2.length === 0) return false;
    const evidence = this.schedulingEvidenceByAgent.get(agentId);
    if (evidence?.kind !== "known") return false;
    return !evidence.enabledRemoteAutomationIds.has(
      stableAutomationId({ agentId, localId: automation.id })
    );
  }
  reconcileNow() {
    if (this.inFlight !== void 0) {
      this.rerun = true;
      return this.inFlight;
    }
    this.inFlight = this.reconcile().catch((error41) => {
      this.recordFailure({ operation: "reconcile", error: error41 });
    }).finally(() => {
      this.inFlight = void 0;
      if (this.rerun) {
        this.rerun = false;
        void this.reconcileNow();
      }
    });
    return this.inFlight;
  }
  async deleteAgent(agentId) {
    this.pendingAgentDeletions.add(agentId);
    const initial = await this.listRemote(agentId);
    if (initial === void 0) return false;
    const remoteAutomations = initial.workflows.flatMap(
      (entry) => entry.workflow === void 0 ? [] : [entry.workflow]
    );
    if (remoteAutomations.length === 0) {
      this.publishKnownSchedulingEvidence(agentId, initial, NO_DESIRED_CLOUD_AUTOMATION_IDS);
      this.finishAgentDeletion(agentId);
      return true;
    }
    let mutationFailed = false;
    for (const automation of remoteAutomations) {
      const succeeded = await this.runMutation(
        agentId,
        "delete",
        () => this.deps.client.deleteSandAutomation(
          new DeleteAutomationRequest({
            automationId: automation.automationId
          })
        )
      );
      mutationFailed ||= !succeeded;
      if (succeeded) await this.deps.dropWebhookKeys?.([automation.automationId]);
    }
    const readback = await this.listRemote(agentId);
    if (readback === void 0) return false;
    this.publishKnownSchedulingEvidence(agentId, readback, NO_DESIRED_CLOUD_AUTOMATION_IDS);
    const hasRemainingRows = readback.workflows.some((entry) => entry.workflow !== void 0);
    if (hasRemainingRows) {
      if (!mutationFailed) {
        this.recordFailure({
          agentId,
          operation: "verify",
          error: new Error("Remote automation deletion did not converge")
        });
      }
      return false;
    }
    this.finishAgentDeletion(agentId);
    return true;
  }
  async retryPendingAgentDeletions() {
    for (const agentId of [...this.pendingAgentDeletions]) {
      await this.deleteAgent(agentId);
    }
  }
  async reconcile() {
    if (!this.deps.hasCredential()) return;
    await this.retryPendingAgentDeletions();
    let scheduled;
    try {
      scheduled = await this.deps.listAutomations();
    } catch (error41) {
      this.recordFailure({ operation: "list-local", error: error41 });
      return;
    }
    let listedAgentIds;
    try {
      listedAgentIds = await this.deps.listAgentIds();
    } catch (error41) {
      this.recordFailure({ operation: "list-agents", error: error41 });
      return;
    }
    const agentIds = new Set(listedAgentIds);
    const desiredByAgent = /* @__PURE__ */ new Map();
    const timeZone = this.settings.getUserTimeZone();
    for (const { agentId, automation } of scheduled) {
      agentIds.add(agentId);
      const desired = sandCloudDefinition({
        agentId,
        automation,
        timeZone
      });
      if (desired === null) {
        continue;
      }
      const byAutomationId = desiredByAgent.get(agentId) ?? /* @__PURE__ */ new Map();
      byAutomationId.set(desired.automationId, desired);
      desiredByAgent.set(agentId, byAutomationId);
    }
    for (const agentId of agentIds) {
      const desired = desiredByAgent.get(agentId) ?? /* @__PURE__ */ new Map();
      const localInspection = this.deps.inspectLocalDefinitions?.(agentId);
      const retainUndesired = retainsUndesiredShadows(localInspection?.state);
      const leaveUndesired = leavesUndesiredShadowsUntouched(localInspection?.state);
      const fingerprint = [
        ...[...desired.values()].sort((a, b2) => a.automationId.localeCompare(b2.automationId)).map(
          (definition2) => `${definition2.automationId}:${definition2.marker}:${String(definition2.enabled)}`
        ),
        ...retainUndesired ? ["retain-undesired"] : [],
        ...leaveUndesired ? ["leave-undesired"] : []
      ].join("\0");
      if (this.lastSuccessfulFingerprintByAgent.get(agentId) === fingerprint) {
        continue;
      }
      try {
        if (await this.reconcileAgent(agentId, desired, localInspection)) {
          this.lastSuccessfulFingerprintByAgent.set(agentId, fingerprint);
        }
      } catch (error41) {
        this.recordFailure({
          agentId,
          operation: "reconcile",
          error: error41
        });
      }
    }
    const webhookAutomationIds = /* @__PURE__ */ new Set();
    for (const definitions of desiredByAgent.values()) {
      for (const definition2 of definitions.values()) {
        if (definition2.workflow.triggers.some((trigger2) => trigger2.trigger?.case === "webhook")) {
          webhookAutomationIds.add(definition2.automationId);
        }
      }
    }
    if (webhookAutomationIds.size === 0 || this.deps.ensureWebhookKeys === void 0) return;
    try {
      await this.deps.ensureWebhookKeys([...webhookAutomationIds]);
    } catch (error41) {
      this.recordFailure({ operation: "reconcile", error: error41 });
    }
  }
  async reconcileAgent(agentId, desiredByAutomationId, localInspection) {
    const desiredCloudAutomationIds = new Set(desiredByAutomationId.keys());
    const retainUndesired = retainsUndesiredShadows(localInspection?.state);
    const leaveUndesired = leavesUndesiredShadowsUntouched(localInspection?.state);
    const converges = (remoteByAutomationId2) => leaveUndesired ? isConverged(
      desiredShadowsOnly(remoteByAutomationId2, desiredByAutomationId),
      desiredByAutomationId,
      false
    ) : isConverged(remoteByAutomationId2, desiredByAutomationId, retainUndesired);
    const initial = await this.listRemote(agentId);
    if (initial === void 0) return false;
    const remoteByAutomationId = remoteShadowAutomationsById(initial);
    if (leaveUndesired) {
      for (const automationId of remoteByAutomationId.keys()) {
        if (desiredByAutomationId.has(automationId)) continue;
        this.deps.reportShadowPrune?.({
          conversationId: agentId,
          automationId,
          outcome: "untouched",
          localDefinitionState: localInspection?.state ?? "unknown",
          localDefinitionCount: localInspection?.validDefinitionCount ?? desiredByAutomationId.size,
          desiredCount: desiredByAutomationId.size,
          remoteShadowCount: remoteByAutomationId.size
        });
      }
    }
    if (converges(remoteByAutomationId)) {
      this.publishKnownSchedulingEvidence(agentId, initial, desiredCloudAutomationIds);
      this.recordRecovery(agentId);
      return true;
    }
    let mutationFailed = false;
    for (const [automationId, remote] of remoteByAutomationId) {
      if (desiredByAutomationId.has(automationId) || leaveUndesired) {
        continue;
      }
      if (retainUndesired) {
        if (!remote.enabled) continue;
        const succeeded2 = await this.runMutation(
          agentId,
          "update",
          () => this.deps.client.updateSandAutomation(
            new UpdateAutomationRequest({ automationId: remote.automationId, enabled: false })
          )
        );
        mutationFailed ||= !succeeded2;
        this.deps.reportShadowPrune?.({
          conversationId: agentId,
          automationId,
          outcome: succeeded2 ? "retained" : "failed",
          localDefinitionState: localInspection?.state ?? "unknown",
          localDefinitionCount: localInspection?.validDefinitionCount ?? desiredByAutomationId.size,
          desiredCount: desiredByAutomationId.size,
          remoteShadowCount: remoteByAutomationId.size
        });
        continue;
      }
      const succeeded = await this.runMutation(
        agentId,
        "delete",
        () => this.deps.client.deleteSandAutomation(
          new DeleteAutomationRequest({ automationId: remote.automationId })
        )
      );
      mutationFailed ||= !succeeded;
      if (succeeded) await this.deps.dropWebhookKeys?.([automationId]);
      this.deps.reportShadowPrune?.({
        conversationId: agentId,
        automationId,
        outcome: succeeded ? "deleted" : "failed",
        localDefinitionState: localInspection?.state ?? "unknown",
        localDefinitionCount: localInspection?.validDefinitionCount ?? desiredByAutomationId.size,
        desiredCount: desiredByAutomationId.size,
        remoteShadowCount: remoteByAutomationId.size
      });
    }
    for (const [automationId, desired] of desiredByAutomationId) {
      const remote = remoteByAutomationId.get(automationId);
      if (remote === void 0) {
        await this.deps.dropWebhookKeys?.([automationId]);
        const succeeded = await this.runMutation(
          agentId,
          "create",
          () => this.deps.client.createSandAutomation(
            new CreateAutomationRequest({
              description: desired.marker,
              name: desired.name,
              workflow: desired.workflow,
              enabled: desired.enabled,
              sandAgentId: agentId,
              sandAutomationId: automationId
            })
          )
        );
        mutationFailed ||= !succeeded;
        continue;
      }
      if (remote.description !== desired.marker || remote.enabled !== desired.enabled) {
        const succeeded = await this.runMutation(
          agentId,
          "update",
          () => this.update(remote.automationId, desired)
        );
        mutationFailed ||= !succeeded;
      }
    }
    const readback = await this.listRemote(agentId);
    if (readback === void 0) return false;
    const readbackByAutomationId = remoteShadowAutomationsById(readback);
    this.publishKnownSchedulingEvidence(agentId, readback, desiredCloudAutomationIds);
    const converged = converges(readbackByAutomationId);
    if (!converged) {
      if (!mutationFailed) {
        this.recordFailure({
          agentId,
          operation: "verify",
          error: new Error("Remote automation reconciliation did not converge")
        });
      }
      return false;
    }
    this.recordRecovery(agentId);
    return true;
  }
  async update(automationId, desired) {
    await this.deps.client.updateSandAutomation(
      new UpdateAutomationRequest({
        automationId,
        description: desired.marker,
        name: desired.name,
        workflow: desired.workflow,
        enabled: desired.enabled
      })
    );
  }
  async listRemote(agentId) {
    try {
      return await this.deps.client.listSandAutomations(
        new ListSandAutomationsRequest({ sandAgentId: agentId })
      );
    } catch (error41) {
      this.recordFailure({ agentId, operation: "list-remote", error: error41 });
      return void 0;
    }
  }
  async runMutation(agentId, operation, mutation) {
    this.schedulingEvidenceByAgent.set(agentId, { kind: "unknown" });
    try {
      await mutation();
      return true;
    } catch (error41) {
      this.recordFailure({ agentId, operation, error: error41 });
      return false;
    }
  }
  publishKnownSchedulingEvidence(agentId, response, desiredCloudAutomationIds) {
    const enabledIds = enabledRemoteAutomationIds(response);
    this.schedulingEvidenceByAgent.set(agentId, {
      kind: "known",
      enabledRemoteAutomationIds: enabledIds
    });
    const schedulingAuthority = {
      desiredCloudAutomationIds,
      enabledRemoteAutomationIds: enabledIds
    };
    const previous = this.lastNotifiedSchedulingAuthorityByAgent.get(agentId);
    if (sameSchedulingAuthority(previous, schedulingAuthority)) return;
    this.lastNotifiedSchedulingAuthorityByAgent.set(agentId, schedulingAuthority);
    try {
      this.deps.onSchedulingAuthorityChanged(agentId);
    } catch (error41) {
      this.logCallbackFailure("onSchedulingAuthorityChanged", agentId, error41);
    }
  }
  recordFailure(failure2) {
    if (failure2.agentId !== void 0) {
      this.failedAgentIds.add(failure2.agentId);
    }
    this.deps.reportDiagnostic?.({
      extension: "automation_cloud_sync",
      operation: failure2.operation,
      agentId: failure2.agentId,
      ...errorIdentity(failure2.error)
    });
    if (!this.deps.hasCredential()) return;
    try {
      this.deps.onFailure(failure2);
    } catch (error41) {
      this.logCallbackFailure("onFailure", failure2.agentId, error41);
    }
  }
  recordRecovery(agentId) {
    if (!this.failedAgentIds.delete(agentId)) return;
    try {
      this.deps.onRecovery(agentId);
    } catch (error41) {
      this.logCallbackFailure("onRecovery", agentId, error41);
    }
  }
  finishAgentDeletion(agentId) {
    this.pendingAgentDeletions.delete(agentId);
    this.lastSuccessfulFingerprintByAgent.delete(agentId);
    this.recordRecovery(agentId);
    this.schedulingEvidenceByAgent.delete(agentId);
    this.lastNotifiedSchedulingAuthorityByAgent.delete(agentId);
  }
  logCallbackFailure(callback, agentId, error41) {
    this.deps.reportDiagnostic?.({
      extension: "automation_cloud_sync",
      operation: callback,
      agentId,
      ...errorIdentity(error41)
    });
  }
};
