/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-trigger.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var TRIGGER_MAX_CHANNEL_LENGTH = 80;
var TRIGGER_MAX_KEYWORD_LENGTH = 120;
var TRIGGER_MAX_REPO_LENGTH = 140;
var TRIGGER_MAX_BRANCH_LENGTH = 200;
var TRIGGER_MAX_ALLOWLIST_LOGINS = 50;
var TRIGGER_MAX_ALLOWLIST_LOGIN_LENGTH = 80;
var TRIGGER_MAX_FILTER_IDS = 50;
var TRIGGER_MAX_ID_LENGTH = 200;
function isGithubEventKind(value) {
  return typeof value === "string" && GITHUB_EVENT_KINDS.some((kind) => kind === value);
}
function isOriginEventKind(value) {
  return typeof value === "string" && ORIGIN_EVENT_KINDS.some((kind) => kind === value);
}
function normalizeScopeToken(raw, maxLength) {
  if (typeof raw !== "string") return null;
  const clamped = clampLine(raw, maxLength);
  return clamped.length > 0 ? clamped : null;
}
function parseStringList(raw) {
  if (!Array.isArray(raw)) return [];
  const values = [];
  for (const entry of raw) {
    const value = normalizeScopeToken(entry, TRIGGER_MAX_ID_LENGTH);
    if (value != null && !values.includes(value)) values.push(value);
    if (values.length >= TRIGGER_MAX_FILTER_IDS) break;
  }
  return values;
}
function parseReactionEmoji(raw) {
  if (!Array.isArray(raw)) return [];
  const names3 = [];
  for (const entry of raw) {
    if (typeof entry !== "string") continue;
    const name17 = normalizeReactionEmoji(entry);
    if (!REACTION_EMOJI_PATTERN.test(name17) || names3.includes(name17)) continue;
    names3.push(name17);
    if (names3.length >= TRIGGER_MAX_REACTION_EMOJI) break;
  }
  return names3;
}
function parseSlackMatch(value) {
  if (!isUnknownRecord(value)) {
    return triggerParseFailure(
      "slack",
      "needs 'match' (an object with kind mention, message, reaction, or keyword)"
    );
  }
  switch (value.kind) {
    case "mention":
      return { kind: "mention" };
    case "message":
      return { kind: "message" };
    case "reaction": {
      const emoji2 = parseReactionEmoji(value.emoji);
      return {
        kind: "reaction",
        ...emoji2.length > 0 ? { emoji: emoji2 } : {},
        ...value.bySelf === true ? { bySelf: true } : {}
      };
    }
    case "keyword": {
      const keyword = normalizeScopeToken(value.keyword, TRIGGER_MAX_KEYWORD_LENGTH);
      return keyword == null ? triggerParseFailure("slack", "needs a non-empty 'match.keyword'") : { kind: "keyword", keyword };
    }
    default:
      return triggerParseFailure(
        "slack",
        "needs 'match.kind' (one of mention, message, reaction, keyword)"
      );
  }
}
function parseSlackListener(value) {
  const channel = normalizeScopeToken(value.channel, TRIGGER_MAX_CHANNEL_LENGTH);
  if (channel == null) {
    return triggerParseFailure("slack", `needs 'channel' (a "#channel", a "@dm", or "*")`);
  }
  const match2 = parseSlackMatch(value.match);
  if (isTriggerParseFailure(match2)) return match2;
  return { type: "slack", channel, match: match2 };
}
function parseGithubUserAllowlist(raw) {
  if (!Array.isArray(raw)) return void 0;
  const logins = [];
  const seenLogins = /* @__PURE__ */ new Set();
  for (const entry of raw) {
    const token = normalizeScopeToken(entry, TRIGGER_MAX_ALLOWLIST_LOGIN_LENGTH);
    const login = token?.replace(/^@+/, "");
    if (login == null || login.length === 0) continue;
    const loginKey = login.toLowerCase();
    if (!seenLogins.has(loginKey)) {
      seenLogins.add(loginKey);
      logins.push(login);
    }
    if (logins.length >= TRIGGER_MAX_ALLOWLIST_LOGINS) break;
  }
  return logins.length > 0 ? logins : void 0;
}
function parseCiBranch(raw) {
  const branch = normalizeScopeToken(raw, TRIGGER_MAX_BRANCH_LENGTH);
  return branch != null && isValidGitBranch(branch) ? branch : void 0;
}
function parseGithubListener(value) {
  const repo = normalizeScopeToken(value.repo, TRIGGER_MAX_REPO_LENGTH);
  if (repo == null || !isValidGithubRepo(repo)) {
    return triggerParseFailure("github", `needs 'repo' (one concrete "owner/name", no wildcards)`);
  }
  const rawEvents = Array.isArray(value.events) ? value.events : [];
  const parsedEvents = [];
  for (const entry of rawEvents) {
    if (isGithubEventKind(entry) && !parsedEvents.includes(entry)) {
      parsedEvents.push(entry);
    }
  }
  if (parsedEvents.length === 0) {
    return triggerParseFailure("github", "needs 'events' (at least one GitHub event kind)");
  }
  const pr2 = typeof value.pr === "number" && Number.isSafeInteger(value.pr) && value.pr > 0 ? value.pr : void 0;
  const ciBranch = parseCiBranch(value.ciBranch);
  const events = pr2 === void 0 && ciBranch === void 0 ? parsedEvents.filter((event) => !isGithubCiEventKind(event)) : parsedEvents;
  if (events.length === 0) {
    return triggerParseFailure(
      "github",
      "needs 'ciBranch' (ci-passed and ci-failed fire on one branch's settled checks)"
    );
  }
  const userAllowlist = parseGithubUserAllowlist(value.userAllowlist);
  const watchesCi = events.some(isGithubCiEventKind);
  return {
    type: "github",
    repo,
    events,
    ...pr2 !== void 0 ? { pr: pr2 } : {},
    ...userAllowlist !== void 0 ? { userAllowlist } : {},
    ...watchesCi && pr2 === void 0 && ciBranch !== void 0 ? { ciBranch } : {}
  };
}
function parseOriginListener(value) {
  const repo = normalizeScopeToken(value.repo, TRIGGER_MAX_REPO_LENGTH);
  if (repo == null || !isValidOriginRepo(repo)) {
    return triggerParseFailure("origin", `needs 'repo' (one concrete "owner/name", no wildcards)`);
  }
  const rawEvents = Array.isArray(value.events) ? value.events : [];
  const parsedEvents = [];
  for (const entry of rawEvents) {
    if (isOriginEventKind(entry) && !parsedEvents.includes(entry)) {
      parsedEvents.push(entry);
    }
  }
  if (parsedEvents.length === 0) {
    return triggerParseFailure("origin", "needs 'events' (at least one Origin event kind)");
  }
  const pr2 = typeof value.pr === "number" && Number.isSafeInteger(value.pr) && value.pr > 0 ? value.pr : void 0;
  const events = pr2 === void 0 ? parsedEvents.filter((event) => !isOriginCiEventKind(event)) : parsedEvents;
  if (events.length === 0) {
    return triggerParseFailure(
      "origin",
      "needs 'pr' (Origin CI events are delivered only for one explicitly scoped PR)"
    );
  }
  const userAllowlist = parseGithubUserAllowlist(value.userAllowlist);
  return {
    type: "origin",
    repo,
    events,
    ...pr2 !== void 0 ? { pr: pr2 } : {},
    ...userAllowlist !== void 0 ? { userAllowlist } : {}
  };
}
function parseMicrosoftTeamsTrigger(value) {
  const tenantId = normalizeScopeToken(value.tenantId, TRIGGER_MAX_ID_LENGTH);
  if (tenantId == null) {
    return triggerParseFailure(
      "microsoftTeams",
      "needs 'tenantId' (the Microsoft Entra tenant ID)"
    );
  }
  const legacyTeamId = normalizeScopeToken(value.teamId, TRIGGER_MAX_ID_LENGTH);
  const parsedTeamIds = parseStringList(value.teamIds);
  let teamIds = parsedTeamIds;
  if (teamIds.length === 0) teamIds = legacyTeamId == null ? [] : [legacyTeamId];
  if (teamIds.length === 0) {
    return triggerParseFailure(
      "microsoftTeams",
      "needs at least one team id in 'teamId' or 'teamIds'"
    );
  }
  return {
    type: "microsoftTeams",
    tenantId,
    teamIds,
    channelIds: parseStringList(value.channelIds),
    messageContains: typeof value.messageContains === "string" ? clampLine(value.messageContains, TRIGGER_MAX_KEYWORD_LENGTH) : "",
    messageContainsIsRegex: value.messageContainsIsRegex === true,
    blockUnauthenticatedTeamsUsers: value.blockUnauthenticatedTeamsUsers === true
  };
}
function parseLinearTrigger(value) {
  const eventCaseReason = `needs 'event.case' (one of ${LINEAR_EVENT_CASES.join(", ")})`;
  if (!isUnknownRecord(value.event)) return triggerParseFailure("linear", eventCaseReason);
  const eventCase = value.event.case;
  if (!isSandLinearEventCase(eventCase)) return triggerParseFailure("linear", eventCaseReason);
  let event;
  switch (eventCase) {
    case "issueCreated":
      event = { case: "issueCreated" };
      break;
    case "statusChanged":
      event = {
        case: "statusChanged",
        statusIds: parseStringList(value.event.statusIds)
      };
      break;
    case "endOfCycle":
      event = {
        case: "endOfCycle",
        cycleIds: parseStringList(value.event.cycleIds)
      };
      break;
  }
  return {
    type: "linear",
    event,
    projectIds: parseStringList(value.projectIds),
    teamIds: parseStringList(value.teamIds)
  };
}
function parseSentryTrigger(value) {
  const eventCaseReason = `needs 'event.case' (one of ${SENTRY_EVENT_CASES.join(", ")})`;
  if (!isUnknownRecord(value.event)) return triggerParseFailure("sentry", eventCaseReason);
  switch (value.event.case) {
    case "issueCreated":
    case "issueResolved":
    case "issueAssigned":
    case "issueArchived":
    case "issueUnresolved":
    case "issueAny":
      return {
        type: "sentry",
        event: { case: value.event.case },
        projectIds: parseStringList(value.projectIds)
      };
    default:
      return triggerParseFailure("sentry", eventCaseReason);
  }
}
function parsePagerDutyTrigger(value) {
  const eventCaseReason = `needs 'event.case' (one of ${PAGERDUTY_EVENT_CASES.join(", ")})`;
  if (!isUnknownRecord(value.event)) return triggerParseFailure("pagerduty", eventCaseReason);
  switch (value.event.case) {
    case "incidentTriggered":
    case "incidentAcknowledged":
    case "incidentResolved":
    case "incidentEscalated":
    case "incidentAny":
      return {
        type: "pagerduty",
        event: { case: value.event.case },
        serviceIds: parseStringList(value.serviceIds)
      };
    default:
      return triggerParseFailure("pagerduty", eventCaseReason);
  }
}
function normalizeEmailAddress(raw) {
  const token = normalizeScopeToken(raw, EMAIL_TRIGGER_MAX_ADDRESS_LENGTH);
  return token === null ? null : token.toLowerCase();
}
function parseEmailFromAddresses(raw) {
  if (!Array.isArray(raw)) return void 0;
  const addresses = [];
  for (const entry of raw) {
    const address = normalizeEmailAddress(entry);
    if (address === null || addresses.includes(address)) continue;
    addresses.push(address);
    if (addresses.length >= EMAIL_TRIGGER_MAX_FROM_ADDRESSES) break;
  }
  return addresses.length > 0 ? addresses : void 0;
}
function parseEmailTrigger(value) {
  const inbox = normalizeEmailAddress(value.inbox);
  if (inbox === null) {
    return triggerParseFailure("email", "needs 'inbox' (one of the user's inbox addresses)");
  }
  const from2 = parseEmailFromAddresses(value.from);
  return {
    type: "email",
    inbox,
    ...from2 !== void 0 ? { from: from2 } : {},
    ...value.requireAuthPass === false ? { requireAuthPass: false } : {}
  };
}
function parseTriggerMember(value) {
  if (!isUnknownRecord(value)) {
    return triggerParseFailure("unrecognized", "must be a trigger object with a 'type'");
  }
  switch (value.type) {
    case "cron": {
      const schedule = normalizeScopeToken(value.schedule, 120);
      return schedule == null ? triggerParseFailure("cron", "needs 'schedule' (a cron expression)") : { type: "cron", schedule };
    }
    case "slack":
      return parseSlackListener(value);
    case "github":
      return parseGithubListener(value);
    case "origin":
      return parseOriginListener(value);
    case "microsoftTeams":
      return parseMicrosoftTeamsTrigger(value);
    case "linear":
      return parseLinearTrigger(value);
    case "sentry":
      return parseSentryTrigger(value);
    case "pagerduty":
      return parsePagerDutyTrigger(value);
    case "email":
      return parseEmailTrigger(value);
    case "webhook":
      return { type: "webhook" };
    default:
      return triggerParseFailure(
        "unrecognized",
        "needs 'type' (one of cron, slack, github, origin, microsoftTeams, linear, sentry, pagerduty, email, webhook)"
      );
  }
}
function parseTriggerMembers(entries) {
  const members = [];
  let firstFailure;
  for (const entry of entries) {
    const member = parseTriggerMember(entry);
    if (isTriggerParseFailure(member)) {
      firstFailure ??= member;
      continue;
    }
    members.push(member);
    if (members.length >= TRIGGER_MAX_GROUP_LISTENERS) break;
  }
  if (members.some((member) => member.type === "origin")) {
    const incompatible = members.find(
      (member) => ["microsoftTeams", "linear", "sentry", "pagerduty", "email", "webhook"].includes(member.type)
    );
    if (incompatible !== void 0) {
      return triggerParseFailure(
        "group",
        `can't mix Origin with '${incompatible.type}' until both have one scheduling authority`
      );
    }
  }
  const trigger = triggerFromList(members);
  if (trigger != null) return trigger;
  return firstFailure ?? triggerParseFailure("group", "needs at least one member");
}
function parseStoredTrigger(value) {
  if (Array.isArray(value)) return parseTriggerMembers(value);
  if (!isUnknownRecord(value)) {
    return triggerParseFailure("unrecognized", "must be a trigger object or an array of members");
  }
  if (value.type === "group") {
    return parseTriggerMembers(Array.isArray(value.listeners) ? value.listeners : []);
  }
  return parseTriggerMember(value);
}
function serializeTriggerMember(member) {
  switch (member.type) {
    case "cron":
      return { type: "cron", schedule: member.schedule };
    case "slack":
      return { type: "slack", channel: member.channel, match: member.match };
    case "github":
      return {
        type: "github",
        repo: member.repo,
        events: member.events,
        ...member.pr !== void 0 ? { pr: member.pr } : {},
        ...member.userAllowlist !== void 0 && member.userAllowlist.length > 0 ? { userAllowlist: member.userAllowlist } : {},
        ...member.ciBranch !== void 0 ? { ciBranch: member.ciBranch } : {}
      };
    case "origin":
      return {
        type: "origin",
        repo: member.repo,
        events: member.events,
        ...member.pr !== void 0 ? { pr: member.pr } : {},
        ...member.userAllowlist !== void 0 && member.userAllowlist.length > 0 ? { userAllowlist: member.userAllowlist } : {}
      };
    case "microsoftTeams":
      return {
        type: "microsoftTeams",
        tenantId: member.tenantId,
        teamIds: member.teamIds,
        channelIds: member.channelIds,
        messageContains: member.messageContains,
        messageContainsIsRegex: member.messageContainsIsRegex,
        blockUnauthenticatedTeamsUsers: member.blockUnauthenticatedTeamsUsers
      };
    case "linear":
      return {
        type: "linear",
        event: member.event,
        projectIds: member.projectIds,
        teamIds: member.teamIds
      };
    case "sentry":
      return {
        type: "sentry",
        event: member.event,
        projectIds: member.projectIds
      };
    case "pagerduty":
      return {
        type: "pagerduty",
        event: member.event,
        serviceIds: member.serviceIds
      };
    case "email":
      return {
        type: "email",
        inbox: member.inbox,
        ...member.from !== void 0 && member.from.length > 0 ? { from: member.from } : {},
        ...member.requireAuthPass === false ? { requireAuthPass: false } : {}
      };
    case "webhook":
      return { type: "webhook" };
  }
}
function serializeStoredTrigger(trigger) {
  if (trigger.type === "group") {
    return {
      type: "group",
      listeners: trigger.listeners.map((member) => serializeTriggerMember(member))
    };
  }
  return serializeTriggerMember(trigger);
}

