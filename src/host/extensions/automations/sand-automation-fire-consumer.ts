init_bounded();
init_errors();
init_system_errno();
init_cursor_inference();
init_sand_client_metadata();
init_unknown_record();
var ERROR_BACKOFF_MS2 = 3e4;
var MAX_NEXT_POLL_DELAY_MS = 6e4;
var MAX_REPORTED_REJECTED_FIRES = 256;
function parseAutomationFireWireEvent(value) {
  if (!isUnknownRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.automationId !== "string" || typeof value.sandAgentId !== "string" || typeof value.timestampMs !== "number") {
    return null;
  }
  if (value.definitionRevision !== void 0 && typeof value.definitionRevision !== "string") {
    return null;
  }
  if (value.scheduledForMs !== void 0 && typeof value.scheduledForMs !== "number") {
    return null;
  }
  if (value.runAsSubagent !== void 0 && typeof value.runAsSubagent !== "boolean") {
    return null;
  }
  return {
    id: value.id,
    automationId: value.automationId,
    sandAgentId: value.sandAgentId,
    timestampMs: value.timestampMs,
    ...value.definitionRevision !== void 0 ? { definitionRevision: value.definitionRevision } : {},
    ...value.scheduledForMs !== void 0 ? { scheduledForMs: value.scheduledForMs } : {},
    ...value.runAsSubagent !== void 0 ? { runAsSubagent: value.runAsSubagent } : {},
    ...value.event !== void 0 ? { event: value.event } : {}
  };
}
function telemetryViewOfMalformedFire(element) {
  const record2 = isUnknownRecord(element) ? element : {};
  return {
    id: typeof record2.id === "string" ? record2.id : (JSON.stringify(record2.id) ?? "malformed").slice(0, 100),
    sandAgentId: typeof record2.sandAgentId === "string" ? record2.sandAgentId : "unknown",
    timestampMs: typeof record2.timestampMs === "number" ? record2.timestampMs : Date.now(),
    ...typeof record2.definitionRevision === "string" ? { definitionRevision: record2.definitionRevision } : {},
    ...typeof record2.scheduledForMs === "number" ? { scheduledForMs: record2.scheduledForMs } : {},
    ...record2.event !== void 0 ? { event: record2.event } : {}
  };
}
function isGithubEventKind3(value) {
  return typeof value === "string" && GITHUB_EVENT_KINDS.includes(value);
}
function parseFireTriggerEvent(value) {
  if (!isUnknownRecord(value)) return null;
  const timestampMs2 = typeof value.timestampMs === "number" ? value.timestampMs : Date.now();
  if (value.source === "slack") {
    if (typeof value.channel !== "string" || value.channel.length === 0) {
      return null;
    }
    return {
      source: "slack",
      channel: value.channel,
      sender: typeof value.sender === "string" ? value.sender : "someone",
      text: typeof value.text === "string" ? value.text : "",
      isMention: value.isMention === true,
      ...value.isSelf === true ? { isSelf: true } : {},
      ...typeof value.reactionEmoji === "string" && value.reactionEmoji.length > 0 ? { reactionEmoji: value.reactionEmoji } : {},
      ...typeof value.ts === "string" && value.ts.length > 0 ? { ts: value.ts } : {},
      ...typeof value.threadTs === "string" && value.threadTs.length > 0 ? { threadTs: value.threadTs } : {},
      timestampMs: timestampMs2
    };
  }
  if (value.source === "microsoftTeams") {
    return parseMicrosoftTeamsFireTriggerEvent(value, timestampMs2);
  }
  if (value.source === "linear") {
    return parseLinearFireTriggerEvent(value, timestampMs2);
  }
  if (value.source === "sentry") {
    return parseSentryFireTriggerEvent(value, timestampMs2);
  }
  if (value.source === "pagerduty") {
    return parsePagerDutyFireTriggerEvent(value, timestampMs2);
  }
  if (value.source === "email") {
    return parseEmailFireTriggerEvent(value, timestampMs2);
  }
  if (value.source === "webhook") {
    return parseWebhookFireTriggerEvent(value, timestampMs2);
  }
  return parseGithubFireTriggerEvent(value, timestampMs2);
}
function admitsBareFire(trigger2, event) {
  const cronSchedules = triggerCronSchedules(trigger2);
  if (cronSchedules.length === 0) return false;
  if (triggerEventTriggers(trigger2).length === 0) return true;
  return event.scheduledForMs !== void 0;
}
function fireEventMatchesTrigger(trigger2, parsed2, wire) {
  const options2 = { admitMissingSubject: true, platformMatched: true };
  if (triggerMatchesEvent(trigger2, parsed2, options2)) return true;
  if (parsed2.source !== "slack" || !isUnknownRecord(wire)) return false;
  const channelId = typeof wire.channelId === "string" && wire.channelId.length > 0 ? wire.channelId : null;
  if (channelId === null || channelId === parsed2.channel) return false;
  return triggerMatchesEvent(trigger2, { ...parsed2, channel: channelId }, options2);
}
var FIRE_EVENT_ID_MAX_LENGTH = 200;
var FIRE_EVENT_TEXT_MAX_LENGTH = 4e3;
var FIRE_EVENT_TITLE_MAX_LENGTH = 400;
var FIRE_EVENT_URL_MAX_LENGTH = 600;
var FIRE_EVENT_STATUS_MAX_LENGTH = 200;
var FIRE_EVENT_EMAIL_ADDRESS_MAX_LENGTH = 320;
var FIRE_EVENT_EMAIL_SUBJECT_MAX_LENGTH = 998;
function hasOversizedString(fields2) {
  return fields2.some(([value, maxLength]) => typeof value === "string" && value.length > maxLength);
}
function nonEmptyString2(value, maxLength) {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength ? value : void 0;
}
function parseMicrosoftTeamsFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (hasOversizedString([
    [value.tenantId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.teamId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.channelId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.text, FIRE_EVENT_TEXT_MAX_LENGTH],
    [value.aadObjectId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.activityId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.rootMessageId, FIRE_EVENT_ID_MAX_LENGTH]
  ])) {
    return null;
  }
  const tenantId = nonEmptyString2(value.tenantId, FIRE_EVENT_ID_MAX_LENGTH);
  const teamId = nonEmptyString2(value.teamId, FIRE_EVENT_ID_MAX_LENGTH);
  const channelId = nonEmptyString2(value.channelId, FIRE_EVENT_ID_MAX_LENGTH);
  const rootMessageId = nonEmptyString2(value.rootMessageId, FIRE_EVENT_ID_MAX_LENGTH);
  if (tenantId === void 0 || teamId === void 0 || channelId === void 0) {
    return null;
  }
  return {
    source: "microsoftTeams",
    tenantId,
    teamId,
    channelId,
    text: typeof value.text === "string" ? value.text : "",
    aadObjectId: nonEmptyString2(value.aadObjectId, FIRE_EVENT_ID_MAX_LENGTH) ?? "unknown",
    activityId: nonEmptyString2(value.activityId, FIRE_EVENT_ID_MAX_LENGTH) ?? "unknown",
    ...rootMessageId !== void 0 ? { rootMessageId } : {},
    timestampMs: timestampMs2
  };
}
function parseLinearFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (!isSandLinearEventCase(value.event)) return null;
  if (hasOversizedString([
    [value.issueIdentifier, FIRE_EVENT_ID_MAX_LENGTH],
    [value.title, FIRE_EVENT_TITLE_MAX_LENGTH],
    [value.url, FIRE_EVENT_URL_MAX_LENGTH],
    [value.status, FIRE_EVENT_STATUS_MAX_LENGTH],
    [value.projectId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.teamId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.statusId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.cycleId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.cycleName, FIRE_EVENT_TITLE_MAX_LENGTH]
  ])) {
    return null;
  }
  const issueIdentifier = nonEmptyString2(value.issueIdentifier, FIRE_EVENT_ID_MAX_LENGTH);
  const title = nonEmptyString2(value.title, FIRE_EVENT_TITLE_MAX_LENGTH);
  const url2 = nonEmptyString2(value.url, FIRE_EVENT_URL_MAX_LENGTH);
  const status = nonEmptyString2(value.status, FIRE_EVENT_STATUS_MAX_LENGTH);
  const projectId = nonEmptyString2(value.projectId, FIRE_EVENT_ID_MAX_LENGTH);
  const teamId = nonEmptyString2(value.teamId, FIRE_EVENT_ID_MAX_LENGTH);
  const statusId = nonEmptyString2(value.statusId, FIRE_EVENT_ID_MAX_LENGTH);
  const cycleId = nonEmptyString2(value.cycleId, FIRE_EVENT_ID_MAX_LENGTH);
  const cycleName = nonEmptyString2(value.cycleName, FIRE_EVENT_TITLE_MAX_LENGTH);
  return {
    source: "linear",
    event: value.event,
    ...issueIdentifier !== void 0 ? { issueIdentifier } : {},
    ...title !== void 0 ? { title } : {},
    ...url2 !== void 0 ? { url: url2 } : {},
    ...status !== void 0 ? { status } : {},
    ...projectId !== void 0 ? { projectId } : {},
    ...teamId !== void 0 ? { teamId } : {},
    ...statusId !== void 0 ? { statusId } : {},
    ...cycleId !== void 0 ? { cycleId } : {},
    ...cycleName !== void 0 ? { cycleName } : {},
    timestampMs: timestampMs2
  };
}
function isSentryEventCase(value) {
  return value === "issueCreated" || value === "issueResolved" || value === "issueAssigned" || value === "issueArchived" || value === "issueUnresolved";
}
function parseSentryFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (hasOversizedString([
    [value.issueId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.shortId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.title, FIRE_EVENT_TITLE_MAX_LENGTH],
    [value.projectId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.url, FIRE_EVENT_URL_MAX_LENGTH],
    [value.projectSlug, FIRE_EVENT_ID_MAX_LENGTH],
    [value.status, FIRE_EVENT_STATUS_MAX_LENGTH],
    [value.substatus, FIRE_EVENT_STATUS_MAX_LENGTH]
  ])) {
    return null;
  }
  const issueId = nonEmptyString2(value.issueId, FIRE_EVENT_ID_MAX_LENGTH);
  const shortId = nonEmptyString2(value.shortId, FIRE_EVENT_ID_MAX_LENGTH);
  const title = nonEmptyString2(value.title, FIRE_EVENT_TITLE_MAX_LENGTH);
  const projectId = nonEmptyString2(value.projectId, FIRE_EVENT_ID_MAX_LENGTH);
  const url2 = nonEmptyString2(value.url, FIRE_EVENT_URL_MAX_LENGTH);
  const projectSlug = nonEmptyString2(value.projectSlug, FIRE_EVENT_ID_MAX_LENGTH);
  const status = nonEmptyString2(value.status, FIRE_EVENT_STATUS_MAX_LENGTH);
  const substatus = nonEmptyString2(value.substatus, FIRE_EVENT_STATUS_MAX_LENGTH);
  if (!isSentryEventCase(value.event) || issueId === void 0 || shortId === void 0 || title === void 0) {
    return null;
  }
  return {
    source: "sentry",
    event: value.event,
    issueId,
    shortId,
    title,
    ...projectId !== void 0 ? { projectId } : {},
    ...url2 !== void 0 ? { url: url2 } : {},
    ...projectSlug !== void 0 ? { projectSlug } : {},
    ...status !== void 0 ? { status } : {},
    ...substatus !== void 0 ? { substatus } : {},
    timestampMs: timestampMs2
  };
}
function isPagerDutyEventCase(value) {
  return value === "incidentTriggered" || value === "incidentAcknowledged" || value === "incidentResolved" || value === "incidentEscalated";
}
function parsePagerDutyFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (hasOversizedString([
    [value.incidentId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.title, FIRE_EVENT_TITLE_MAX_LENGTH],
    [value.status, FIRE_EVENT_STATUS_MAX_LENGTH],
    [value.serviceId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.serviceName, FIRE_EVENT_ID_MAX_LENGTH],
    [value.url, FIRE_EVENT_URL_MAX_LENGTH]
  ])) {
    return null;
  }
  const incidentId = nonEmptyString2(value.incidentId, FIRE_EVENT_ID_MAX_LENGTH);
  const title = nonEmptyString2(value.title, FIRE_EVENT_TITLE_MAX_LENGTH);
  const status = nonEmptyString2(value.status, FIRE_EVENT_STATUS_MAX_LENGTH);
  const serviceId = nonEmptyString2(value.serviceId, FIRE_EVENT_ID_MAX_LENGTH);
  const serviceName = nonEmptyString2(value.serviceName, FIRE_EVENT_ID_MAX_LENGTH);
  const url2 = nonEmptyString2(value.url, FIRE_EVENT_URL_MAX_LENGTH);
  if (!isPagerDutyEventCase(value.event) || incidentId === void 0 || title === void 0 || status === void 0 || serviceId === void 0) {
    return null;
  }
  return {
    source: "pagerduty",
    event: value.event,
    incidentId,
    title,
    status,
    serviceId,
    ...serviceName !== void 0 ? { serviceName } : {},
    ...url2 !== void 0 ? { url: url2 } : {},
    timestampMs: timestampMs2
  };
}
function parseEmailFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (hasOversizedString([
    [value.messageId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.threadId, FIRE_EVENT_ID_MAX_LENGTH],
    [value.inboxEmail, FIRE_EVENT_EMAIL_ADDRESS_MAX_LENGTH],
    [value.fromAddress, FIRE_EVENT_EMAIL_ADDRESS_MAX_LENGTH],
    [value.fromDisplayName, FIRE_EVENT_ID_MAX_LENGTH],
    [value.subject, FIRE_EVENT_EMAIL_SUBJECT_MAX_LENGTH]
  ])) {
    return null;
  }
  const messageId = nonEmptyString2(value.messageId, FIRE_EVENT_ID_MAX_LENGTH);
  const threadId = nonEmptyString2(value.threadId, FIRE_EVENT_ID_MAX_LENGTH);
  const inboxEmail = nonEmptyString2(value.inboxEmail, FIRE_EVENT_EMAIL_ADDRESS_MAX_LENGTH);
  const fromAddress = nonEmptyString2(value.fromAddress, FIRE_EVENT_EMAIL_ADDRESS_MAX_LENGTH);
  const fromDisplayName = nonEmptyString2(value.fromDisplayName, FIRE_EVENT_ID_MAX_LENGTH);
  if (messageId === void 0 || threadId === void 0 || inboxEmail === void 0 || fromAddress === void 0 || typeof value.authPassed !== "boolean") {
    return null;
  }
  return {
    source: "email",
    messageId,
    threadId,
    inboxEmail,
    fromAddress,
    ...fromDisplayName !== void 0 ? { fromDisplayName } : {},
    subject: typeof value.subject === "string" ? value.subject : "",
    authPassed: value.authPassed,
    attachmentCount: typeof value.attachmentCount === "number" && Number.isSafeInteger(value.attachmentCount) ? Math.max(0, value.attachmentCount) : 0,
    isReply: value.isReply === true,
    timestampMs: timestampMs2
  };
}
function parseWebhookFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (typeof value.bodyDigest !== "string" || !/^sha256:[a-f0-9]{64}$/.test(value.bodyDigest)) {
    return null;
  }
  if (typeof value.context === "string" && value.context.length > FIRE_EVENT_TEXT_MAX_LENGTH) {
    return null;
  }
  if (typeof value.body === "string" && value.body.length > FIRE_EVENT_TEXT_MAX_LENGTH) {
    return null;
  }
  const headers = {};
  if (isUnknownRecord(value.headers)) {
    for (const [name17, headerValue] of Object.entries(value.headers)) {
      if (typeof headerValue === "string" && headerValue.length <= 500) {
        headers[name17] = headerValue;
      }
    }
  }
  return {
    source: "webhook",
    headers,
    bodyDigest: value.bodyDigest,
    ...typeof value.context === "string" && value.context.length > 0 ? { context: value.context } : {},
    ...typeof value.body === "string" && value.body.length > 0 ? { body: value.body } : {},
    timestampMs: timestampMs2
  };
}
function parseGithubFireTriggerEvent(value, timestampMs2) {
  if (!isUnknownRecord(value)) return null;
  if (value.source === "github") {
    if (typeof value.repo !== "string" || value.repo.length === 0 || !isGithubEventKind3(value.kind)) {
      return null;
    }
    return {
      source: "github",
      repo: value.repo,
      kind: value.kind,
      title: typeof value.title === "string" ? value.title : "",
      actor: typeof value.actor === "string" ? value.actor : "someone",
      ...typeof value.url === "string" && value.url.length > 0 ? { url: value.url } : {},
      ...typeof value.detail === "string" && value.detail.length > 0 ? { detail: value.detail } : {},
      ...typeof value.prNumber === "number" && Number.isSafeInteger(value.prNumber) && value.prNumber > 0 ? { prNumber: value.prNumber } : {},
      ...typeof value.prOwner === "string" && value.prOwner.length > 0 ? { prOwner: value.prOwner } : {},
      ...typeof value.branch === "string" && value.branch.length > 0 ? { branch: value.branch } : {},
      timestampMs: timestampMs2
    };
  }
  return null;
}
function hasOnlyHeldFires(states) {
  return states.size > 0 && [...states.values()].every((state) => state.phase === "held");
}
function completionOfOutcome(outcome) {
  if (outcome === "ok") {
    return { phase: "completed", status: "succeeded" };
  }
  return {
    phase: "completed",
    status: "failed",
    errorMessage: outcome === "interrupted" ? "Automation run was interrupted by a Sand host update; the box resumes it locally" : "Automation run failed on the Sand box"
  };
}
function classifyDeliveryError(error42) {
  if (error42 instanceof BackendStatusError) {
    return SandError.backendHttpStatus({ httpStatus: error42.status });
  }
  const errno = findSystemErrno(error42);
  if (errno !== void 0) {
    return SandError.backendUnreachable({ errno: brandedErrno(errno) });
  }
  return SandError.backendDeliveryFailed();
}
function coarseDeliveryErrorTypeAndCode(error42) {
  const errorCode = error42 instanceof BackendStatusError ? String(error42.status) : findSystemErrno(error42);
  return {
    errorType: error42 instanceof Error ? error42.constructor.name : typeof error42,
    ...errorCode != null ? { errorCode } : {}
  };
}
function completionOfExistingRun(automation, runUuid) {
  const run = automation.runs.find(
    (candidate) => candidate.id === runUuid || candidate.coalescedRunIds?.includes(runUuid) === true
  );
  if (run === void 0 || run.status === "running") {
    return void 0;
  }
  if (run.status === "ok") {
    return {
      phase: "completed",
      status: "succeeded"
    };
  }
  return {
    phase: "completed",
    status: "failed",
    ...run.detail !== void 0 ? { errorMessage: run.detail } : {}
  };
}
var SandAutomationFireConsumer = class {
  constructor(deps) {
    this.deps = deps;
    this.fetchImpl = deps.fetchImpl ?? fetch;
    this.telemetry = deps.telemetry ?? createNoopSandTelemetry();
  }
  deps;
  fetchImpl;
  telemetry;
  isTicking = false;
  isStopped = false;
  backoffUntilMs = 0;
  pollNotBeforeMs = 0;
  notifyGate = createNotifyDrainGate({
    isConnected: () => this.deps.isNotifyConnected?.() ?? false,
    isSafetyPollEnabled: () => this.deps.isNotifySafetyPollEnabled?.() ?? true,
    now: Date.now
  });
  drainedWhileUnschedulable = false;
  states = /* @__PURE__ */ new Map();
  reportedRejectedFireUuids = /* @__PURE__ */ new Set();
  completionReportWaiters = /* @__PURE__ */ new Map();
  start() {
    this.isStopped = false;
    this.drainedWhileUnschedulable = false;
    this.notifyGate.reset();
  }
  stop() {
    this.isStopped = true;
    this.backoffUntilMs = 0;
    this.pollNotBeforeMs = 0;
  }
  resetPollDelay() {
    this.pollNotBeforeMs = 0;
  }
  requestDrain() {
    this.notifyGate.recordNotify();
    this.pollNotBeforeMs = 0;
    void this.tick();
  }
  async reportRecoveredSubagentCompletion(args) {
    const phase = this.states.get(args.runUuid)?.phase;
    if (phase === "held" || phase === "reported") return;
    const completed = {
      phase: "completed",
      status: args.status,
      ...args.errorMessage !== void 0 ? { errorMessage: args.errorMessage } : {}
    };
    this.states.set(args.runUuid, completed);
    if (await this.reportCompletion(args.runUuid, completed)) return;
    await new Promise((resolve29) => {
      if (this.states.get(args.runUuid)?.phase === "reported") {
        resolve29();
        return;
      }
      const waiters = this.completionReportWaiters.get(args.runUuid) ?? /* @__PURE__ */ new Set();
      waiters.add(resolve29);
      this.completionReportWaiters.set(args.runUuid, waiters);
    });
  }
  async tick() {
    if (this.isTicking || this.isStopped) return;
    if (this.now() < this.backoffUntilMs) return;
    if (hasOnlyHeldFires(this.states) && this.now() < this.pollNotBeforeMs) return;
    this.isTicking = true;
    try {
      if (!await this.deps.isReady()) {
        return;
      }
      let observedServerSchedulable;
      if (this.states.size === 0) {
        if (this.now() < this.pollNotBeforeMs) {
          return;
        }
        if (!this.notifyGate.takeDrainDecision({ hasOwedWork: false })) {
          return;
        }
        const automations = await this.deps.listAutomations();
        observedServerSchedulable = automations.some(
          ({ agentId, automation }) => automation.isEnabled && this.deps.isBoxHostedAgent(agentId) && isServerSchedulable(automation)
        );
        if (!observedServerSchedulable && this.drainedWhileUnschedulable) {
          return;
        }
      }
      const ackRunUuids = [...this.states].filter(([, state]) => state.phase === "reported").map(([uuid3]) => uuid3);
      const reply2 = await this.callBackend("/sand/automation-events/poll", {
        ackRunUuids
      });
      if (!isUnknownRecord(reply2) || !Array.isArray(reply2.events)) {
        throw new MalformedPollReplyError("/sand/automation-events/poll");
      }
      const nextPollAfterMs = reply2.nextPollAfterMs;
      const events = [];
      for (const element of reply2.events) {
        const parsed2 = parseAutomationFireWireEvent(element);
        if (parsed2 === null) {
          this.reportRejectedFire({
            event: telemetryViewOfMalformedFire(element),
            reason: "event_unrecognized"
          });
          continue;
        }
        events.push(parsed2);
      }
      this.notifyGate.recordPoll();
      if (observedServerSchedulable !== void 0) {
        this.drainedWhileUnschedulable = !observedServerSchedulable;
      }
      const returnedIds = new Set(events.map((event) => event.id));
      for (const [uuid3, state] of this.states) {
        if ((state.phase === "held" || state.phase === "reported") && !returnedIds.has(uuid3)) {
          this.states.delete(uuid3);
        }
      }
      for (const event of events) {
        const state = this.states.get(event.id);
        if (state === void 0 || state.phase === "held") {
          if (!this.deps.isBoxHostedAgent(event.sandAgentId)) {
            if (state === void 0) {
              this.states.set(event.id, { phase: "held" });
              this.deps.log(
                `[sand:automations] holding server fire ${event.id} for non-BOX agent ${event.sandAgentId}`
              );
            }
            continue;
          }
          this.states.set(event.id, { phase: "running" });
          void this.deliver(event);
        }
      }
      for (const [uuid3, state] of this.states) {
        if (state.phase === "completed") {
          await this.reportCompletion(uuid3, state);
        }
      }
      if (hasOnlyHeldFires(this.states)) {
        this.pollNotBeforeMs = this.now() + MAX_NEXT_POLL_DELAY_MS;
      } else {
        this.pollNotBeforeMs = events.length === 0 && this.states.size === 0 && typeof nextPollAfterMs === "number" && Number.isFinite(nextPollAfterMs) && nextPollAfterMs > 0 ? this.now() + Math.min(nextPollAfterMs, MAX_NEXT_POLL_DELAY_MS) : 0;
      }
    } catch (error42) {
      this.backoffUntilMs = this.now() + ERROR_BACKOFF_MS2;
      this.telemetry.reportAgentError({
        source: "automation_fire_poll",
        error: classifyDeliveryError(error42),
        detail: sandErrorDetail(error42)
      });
    } finally {
      this.isTicking = false;
    }
  }
  now() {
    return this.deps.now?.() ?? Date.now();
  }
  async deliver(event) {
    let completed;
    try {
      if (event.runAsSubagent === true && this.deps.hasPendingAutomationSubagentRun?.(event.id) === true) {
        this.states.delete(event.id);
        return;
      }
      const target = (await this.deps.listAutomations()).find(
        (entry) => entry.agentId === event.sandAgentId && stableAutomationId({
          agentId: entry.agentId,
          localId: entry.automation.id
        }) === event.automationId
      );
      if (this.isStopped) {
        this.states.delete(event.id);
        return;
      }
      const existingRunCompletion = target === void 0 ? void 0 : completionOfExistingRun(target.automation, event.id);
      if (target === void 0) {
        completed = this.rejectFire({
          event,
          reason: "automation_missing",
          errorMessage: "Automation not found on the Sand box"
        });
      } else if (existingRunCompletion !== void 0) {
        completed = existingRunCompletion;
      } else if (!target.automation.isEnabled) {
        completed = this.rejectFire({
          event,
          reason: "automation_disabled",
          errorMessage: "Automation is disabled on the Sand box"
        });
      } else if (event.definitionRevision === void 0 && event.event == null && admitsBareFire(target.automation.trigger, event) && target.automation.lastRunAt !== null && target.automation.lastRunAt >= event.timestampMs) {
        completed = this.rejectFire({
          event,
          reason: "slot_already_covered",
          errorMessage: "Legacy automation fire was already covered on the Sand box"
        });
      } else if (event.definitionRevision !== void 0 && sandCloudDefinition({
        agentId: target.agentId,
        automation: target.automation,
        timeZone: this.deps.getTimeZone()
      })?.hash !== event.definitionRevision) {
        completed = this.rejectFire({
          event,
          reason: "definition_changed",
          errorMessage: "Automation definition changed on the Sand box"
        });
      } else if (event.event != null) {
        const parsed2 = parseFireTriggerEvent(event.event);
        if (parsed2 === null) {
          completed = this.rejectFire({
            event,
            reason: "event_unrecognized",
            errorMessage: "Event context not recognized by the Sand box"
          });
        } else if (!fireEventMatchesTrigger(target.automation.trigger, parsed2, event.event)) {
          completed = this.rejectFire({
            event,
            reason: "trigger_no_longer_matches",
            errorMessage: "Automation trigger no longer matches the event"
          });
        } else {
          const outcome = await this.deps.fireForEvent({
            agentId: target.agentId,
            automation: target.automation,
            event: parsed2,
            runUuid: event.id,
            ...event.runAsSubagent !== void 0 ? { runAsSubagent: event.runAsSubagent } : {}
          });
          if (outcome === void 0) {
            this.states.delete(event.id);
            return;
          }
          completed = completionOfOutcome(outcome);
        }
      } else if (!admitsBareFire(target.automation.trigger, event)) {
        completed = this.rejectFire({
          event,
          reason: "missing_event_context",
          errorMessage: "Fire carried no event context for a listener automation",
          trigger: "event"
        });
      } else {
        const outcome = await this.deps.fire({
          agentId: target.agentId,
          automation: target.automation,
          runUuid: event.id,
          ...event.runAsSubagent !== void 0 ? { runAsSubagent: event.runAsSubagent } : {},
          ...event.scheduledForMs !== void 0 ? { scheduledForMs: event.scheduledForMs } : {}
        });
        if (outcome === void 0) {
          this.states.delete(event.id);
          return;
        }
        completed = completionOfOutcome(outcome);
      }
    } catch (error42) {
      this.states.delete(event.id);
      this.reportRejectedFire({ event, reason: "delivery_error", error: error42 });
      return;
    }
    this.states.set(event.id, completed);
    await this.reportCompletion(event.id, completed);
  }
  rejectFire({
    event,
    reason,
    errorMessage: errorMessage6,
    trigger: trigger2
  }) {
    this.reportRejectedFire({
      event,
      reason,
      ...trigger2 !== void 0 ? { trigger: trigger2 } : {}
    });
    return { phase: "completed", status: "failed", errorMessage: errorMessage6 };
  }
  reportRejectedFire({
    event,
    reason,
    error: error42,
    trigger: trigger2 = event.event != null ? "event" : "schedule"
  }) {
    if (this.reportedRejectedFireUuids.has(event.id)) return;
    this.reportedRejectedFireUuids.add(event.id);
    while (this.reportedRejectedFireUuids.size > MAX_REPORTED_REJECTED_FIRES) {
      const oldest = this.reportedRejectedFireUuids.values().next().value;
      if (oldest === void 0) break;
      this.reportedRejectedFireUuids.delete(oldest);
    }
    const boxUptimeMs = this.deps.getBoxUptimeMs();
    this.telemetry.reportAutomationFireDropped({
      conversationId: event.sandAgentId,
      trigger: trigger2,
      reason,
      ...event.scheduledForMs != null ? {
        scheduledForMs: event.scheduledForMs,
        latenessMs: Math.max(0, Date.now() - event.scheduledForMs)
      } : {},
      runUuid: event.id,
      fireAgeMs: Math.max(0, Date.now() - event.timestampMs),
      hasDefinitionRevision: event.definitionRevision !== void 0,
      ...boxUptimeMs !== void 0 ? { boxUptimeMs } : {},
      ...error42 !== void 0 ? coarseDeliveryErrorTypeAndCode(error42) : {}
    });
  }
  async reportCompletion(runUuid, completed) {
    try {
      await this.callBackend("/sand/automation-runs/complete", {
        runUuid,
        status: completed.status,
        errorMessage: completed.errorMessage
      });
      this.states.set(runUuid, { phase: "reported" });
      for (const resolve29 of this.completionReportWaiters.get(runUuid) ?? []) resolve29();
      this.completionReportWaiters.delete(runUuid);
      return true;
    } catch (error42) {
      const status = error42 instanceof BackendStatusError ? error42.status : 0;
      if (status === 409 || status === 404) {
        this.states.set(runUuid, { phase: "reported" });
        for (const resolve29 of this.completionReportWaiters.get(runUuid) ?? []) resolve29();
        this.completionReportWaiters.delete(runUuid);
        return true;
      }
      return false;
    }
  }
  async callBackend(path31, body) {
    const backendUrl = this.deps.backend.backendUrl;
    const accessToken = await this.deps.getAccessToken({ backendUrl });
    const auth2 = await resolveSandBackendAuthContext({
      accessToken,
      getTeamId: this.deps.getTeamId
    });
    const response = await this.fetchImpl(new URL(path31, backendUrl).toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth2.accessToken}`,
        ...auth2.teamId !== void 0 ? { "x-cursor-team-id": String(auth2.teamId) } : {},
        ...getSandBackendClientHeaders(this.deps.backend)
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new BackendStatusError(path31, response.status);
    }
    return await response.json();
  }
};
var BackendStatusError = class extends SandDomainError {
  constructor(path31, status) {
    super(`sand automation relay ${path31} returned ${status}`);
    this.status = status;
  }
  status;
  name = "BackendStatusError";
};
var MalformedPollReplyError = class extends SandDomainError {
  name = "MalformedPollReplyError";
  constructor(path31) {
    super(`automation poll ${path31} replied with a malformed body`);
  }
};
