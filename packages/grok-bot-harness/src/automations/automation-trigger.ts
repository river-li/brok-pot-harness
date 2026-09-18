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
      const emoji3 = parseReactionEmoji(value.emoji);
      return {
        kind: "reaction",
        ...emoji3.length > 0 ? { emoji: emoji3 } : {},
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
  const trigger2 = triggerFromList(members);
  if (trigger2 != null) return trigger2;
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
function serializeStoredTrigger(trigger2) {
  if (trigger2.type === "group") {
    return {
      type: "group",
      listeners: trigger2.listeners.map((member) => serializeTriggerMember(member))
    };
  }
  return serializeTriggerMember(trigger2);
}
function triggerIdentity(trigger2) {
  return trigger2.type === "cron" ? `cron:${trigger2.schedule}` : JSON.stringify(serializeStoredTrigger(trigger2));
}
function splitSlackScope(token) {
  const sigil = token.startsWith("#") || token.startsWith("@") ? token[0] : "";
  return { sigil, name: token.slice(sigil.length).toLowerCase() };
}
function slackScopeMatches(scope, actual) {
  if (scope === TRIGGER_ANY_SCOPE) return true;
  const wanted = splitSlackScope(scope);
  const got = splitSlackScope(actual);
  if (wanted.sigil !== "" && got.sigil !== "" && wanted.sigil !== got.sigil) {
    return false;
  }
  return wanted.name === got.name;
}
function slackListenerMatches(listener, event) {
  if (!slackScopeMatches(listener.channel, event.channel)) return false;
  const isReaction = event.reactionEmoji != null;
  switch (listener.match.kind) {
    case "reaction": {
      if (!isReaction) return false;
      if (listener.match.bySelf === true && event.isSelf !== true) return false;
      const emoji3 = listener.match.emoji ?? [];
      return emoji3.length === 0 || emoji3.includes(normalizeReactionEmoji(event.reactionEmoji));
    }
    case "mention":
      return !isReaction && event.isMention;
    case "keyword":
      return !isReaction && event.text.toLowerCase().includes(listener.match.keyword.toLowerCase());
    case "message":
      return !isReaction;
  }
}
function allowlistAdmits({
  userAllowlist,
  login,
  admitMissingSubject,
  identities
}) {
  const candidates = identities ?? (login === void 0 ? [] : [login]);
  if (candidates.length === 0) return admitMissingSubject;
  return userAllowlist.some(
    (entry) => candidates.some((candidate) => entry.toLowerCase() === candidate.toLowerCase())
  );
}
function githubUserAllowlistAdmits(listener, event, options2) {
  const userAllowlist = listener.userAllowlist ?? [];
  if (userAllowlist.length === 0) return true;
  const admitMissing = options2?.admitMissingSubject ?? false;
  switch (event.kind) {
    case "pr-opened":
    case "pr-pushed":
    case "pr-merged":
    case "pr-closed":
    case "pr-comment":
    case "inline-review-comment":
      return allowlistAdmits({
        userAllowlist,
        login: event.prOwner,
        admitMissingSubject: admitMissing
      });
    case "review-approved":
    case "review-changes-requested":
    case "review-commented":
    case "review-thread-resolved":
    case "review-thread-unresolved":
    case "review-requested":
      return allowlistAdmits({
        userAllowlist,
        login: event.actor,
        admitMissingSubject: admitMissing
      }) && allowlistAdmits({
        userAllowlist,
        login: event.prOwner,
        admitMissingSubject: admitMissing
      });
    case "issue-assigned":
      return allowlistAdmits({
        userAllowlist,
        login: event.actor,
        admitMissingSubject: admitMissing
      });
    case "ci-passed":
    case "ci-failed":
      return true;
  }
}
function githubCiBranchAdmits(listener, event, admitMissingSubject) {
  if (!isGithubCiEventKind(event.kind)) return true;
  if (listener.pr !== void 0) return true;
  if (event.prNumber !== void 0) return false;
  if (listener.ciBranch === void 0) return false;
  if (event.branch === void 0) return admitMissingSubject;
  return event.branch === listener.ciBranch;
}
function githubListenerMatches(listener, event, options2) {
  if (listener.repo.toLowerCase() !== event.repo.toLowerCase()) return false;
  const handlesClosedPr = event.kind === "pr-closed" && listener.pr !== void 0 && listener.events.includes("pr-merged");
  if (!listener.events.includes(event.kind) && !handlesClosedPr) return false;
  if (listener.pr !== void 0 && event.prNumber !== listener.pr) return false;
  if (!githubCiBranchAdmits(listener, event, options2?.admitMissingSubject ?? false)) {
    return false;
  }
  return githubUserAllowlistAdmits(listener, event, options2);
}
function originUserAllowlistAdmits(listener, event, options2) {
  const userAllowlist = listener.userAllowlist ?? [];
  if (userAllowlist.length === 0) return true;
  const admitMissing = options2?.admitMissingSubject ?? false;
  let admitted;
  switch (event.kind) {
    case "pr-opened":
    case "pr-pushed":
    case "pr-merged":
    case "pr-comment":
    case "inline-review-comment":
      admitted = allowlistAdmits({
        userAllowlist,
        login: event.prOwner,
        admitMissingSubject: admitMissing,
        identities: event.prOwnerIds
      });
      break;
    case "review-approved":
    case "review-changes-requested":
    case "review-commented":
    case "review-thread-resolved":
    case "review-thread-unresolved":
    case "review-requested":
      admitted = allowlistAdmits({
        userAllowlist,
        login: event.actor,
        admitMissingSubject: admitMissing,
        identities: event.actorIds
      }) && allowlistAdmits({
        userAllowlist,
        login: event.prOwner,
        admitMissingSubject: admitMissing,
        identities: event.prOwnerIds
      });
      break;
    case "ci-passed":
    case "ci-failed":
      return true;
  }
  if (!admitted) {
    options2?.onOriginAllowlistMismatch?.({
      kind: event.kind,
      ...event.prNumber !== void 0 ? { prNumber: event.prNumber } : {}
    });
  }
  return admitted;
}
function originListenerMatches(listener, event, options2) {
  if (listener.repo.toLowerCase() !== event.repo.toLowerCase()) return false;
  if (!listener.events.includes(event.kind)) return false;
  if (listener.pr !== void 0 && event.prNumber !== listener.pr) return false;
  if (isOriginCiEventKind(event.kind) && listener.pr === void 0) return false;
  return originUserAllowlistAdmits(listener, event, options2);
}
function matchesOptionalFilter(values, actual, platformMatched) {
  if (values.length === 0) return true;
  return actual === void 0 ? platformMatched : values.includes(actual);
}
function microsoftTeamsTriggerMatches(trigger2, event, platformMatched) {
  if (trigger2.tenantId !== "" && trigger2.tenantId !== event.tenantId) {
    return false;
  }
  if (!trigger2.teamIds.includes(event.teamId)) return false;
  if (trigger2.channelIds.length > 0 && !trigger2.channelIds.includes(event.channelId)) {
    return false;
  }
  const hasMessageFilter = trigger2.messageContains !== "";
  if (event.rootMessageId !== void 0 && !hasMessageFilter) return false;
  if (trigger2.blockUnauthenticatedTeamsUsers && !platformMatched) return false;
  if (!hasMessageFilter) return true;
  if (trigger2.messageContainsIsRegex) return platformMatched;
  return event.text.toLowerCase().includes(trigger2.messageContains.toLowerCase());
}
function linearTriggerMatches(trigger2, event, platformMatched) {
  if (trigger2.event.case !== event.event) return false;
  if (!matchesOptionalFilter(trigger2.projectIds, event.projectId, platformMatched)) {
    return false;
  }
  if (!matchesOptionalFilter(trigger2.teamIds, event.teamId, platformMatched)) {
    return false;
  }
  switch (trigger2.event.case) {
    case "issueCreated":
      return true;
    case "statusChanged":
      return matchesOptionalFilter(trigger2.event.statusIds, event.statusId, platformMatched);
    case "endOfCycle":
      return matchesOptionalFilter(trigger2.event.cycleIds, event.cycleId, platformMatched);
  }
}
function sentryTriggerMatches(trigger2, event, platformMatched) {
  if (!matchesOptionalFilter(trigger2.projectIds, event.projectId, platformMatched)) {
    return false;
  }
  return trigger2.event.case === "issueAny" || trigger2.event.case === event.event;
}
function pagerDutyTriggerMatches(trigger2, event, platformMatched) {
  if (!matchesOptionalFilter(trigger2.serviceIds, event.serviceId, platformMatched)) {
    return false;
  }
  return trigger2.event.case === "incidentAny" || trigger2.event.case === event.event;
}
function emailTriggerMatches(trigger2, event) {
  if (trigger2.inbox.toLowerCase() !== event.inboxEmail.toLowerCase()) return false;
  const from2 = trigger2.from ?? [];
  if (from2.length > 0 && !from2.includes(event.fromAddress.toLowerCase())) return false;
  return !emailTriggerRequiresAuthPass(trigger2) || event.authPassed;
}
function listenerMatchesEvent(listener, event, options2) {
  const platformMatched = options2?.platformMatched ?? false;
  switch (listener.type) {
    case "slack":
      return event.source === "slack" && slackListenerMatches(listener, event);
    case "github":
      return event.source === "github" && githubListenerMatches(listener, event, options2);
    case "origin":
      return event.source === "origin" && originListenerMatches(listener, event, options2);
    case "microsoftTeams":
      return event.source === "microsoftTeams" && microsoftTeamsTriggerMatches(listener, event, platformMatched);
    case "linear":
      return event.source === "linear" && linearTriggerMatches(listener, event, platformMatched);
    case "sentry":
      return event.source === "sentry" && sentryTriggerMatches(listener, event, platformMatched);
    case "pagerduty":
      return event.source === "pagerduty" && pagerDutyTriggerMatches(listener, event, platformMatched);
    case "email":
      return event.source === "email" && emailTriggerMatches(listener, event);
    case "webhook":
      return event.source === "webhook";
  }
}
function triggerMatchesEvent(trigger2, event, options2) {
  return triggerEventTriggers(trigger2).some(
    (listener) => listenerMatchesEvent(listener, event, options2)
  );
}
var GITHUB_EVENT_LABELS = {
  "pr-opened": "PR opened",
  "pr-pushed": "PR updated",
  "pr-merged": "PR merged",
  "pr-closed": "PR closed",
  "review-requested": "Review requested",
  "review-approved": "Review approved",
  "review-changes-requested": "Changes requested",
  "review-commented": "Review commented",
  "pr-comment": "PR comment",
  "inline-review-comment": "Inline review comment",
  "review-thread-resolved": "Review thread resolved",
  "review-thread-unresolved": "Review thread reopened",
  "issue-assigned": "Issue assigned",
  "ci-passed": "CI passed",
  "ci-failed": "CI failed"
};
var ORIGIN_EVENT_LABELS = {
  "pr-opened": "Origin PR opened",
  "pr-pushed": "Origin PR updated",
  "pr-merged": "Origin PR merged",
  "review-requested": "Origin review requested",
  "review-approved": "Origin review approved",
  "review-changes-requested": "Origin changes requested",
  "review-commented": "Origin review commented",
  "pr-comment": "Origin PR comment",
  "inline-review-comment": "Origin inline review comment",
  "review-thread-resolved": "Origin review thread resolved",
  "review-thread-unresolved": "Origin review thread reopened",
  "ci-passed": "Origin CI passed",
  "ci-failed": "Origin CI failed"
};
var LINEAR_EVENT_LABELS = {
  issueCreated: "Linear issue created",
  statusChanged: "Linear issue status changed",
  endOfCycle: "Linear cycle ended"
};
var SENTRY_EVENT_LABELS = {
  issueCreated: "Sentry issue created",
  issueResolved: "Sentry issue resolved",
  issueAssigned: "Sentry issue assigned",
  issueArchived: "Sentry issue archived",
  issueUnresolved: "Sentry issue unresolved",
  issueAny: "Sentry issue changed"
};
var PAGERDUTY_EVENT_LABELS = {
  incidentTriggered: "PagerDuty incident triggered",
  incidentAcknowledged: "PagerDuty incident acknowledged",
  incidentResolved: "PagerDuty incident resolved",
  incidentEscalated: "PagerDuty incident escalated",
  incidentAny: "PagerDuty incident changed"
};
function describeTriggerEvent(event) {
  switch (event.source) {
    case "slack": {
      if (event.reactionEmoji != null) {
        return `${event.sender} reacted ${event.reactionEmoji} in ${event.channel}`;
      }
      const text2 = clampLine(event.text, 120);
      return `${event.sender} in ${event.channel}: "${text2}"`;
    }
    case "github": {
      const title = clampLine(event.title, 120);
      return `${GITHUB_EVENT_LABELS[event.kind]} in ${event.repo}: "${title}" by ${event.actor}`;
    }
    case "origin": {
      const title = clampLine(event.title, 120);
      return `${ORIGIN_EVENT_LABELS[event.kind]} in ${event.repo}: "${title}" by ${event.actor}`;
    }
    case "microsoftTeams":
      return `Microsoft Teams message in ${event.channelId}: "${clampLine(event.text, 120)}"`;
    case "linear": {
      const subject = event.title ?? event.cycleName ?? event.issueIdentifier ?? event.cycleId ?? "";
      return `${LINEAR_EVENT_LABELS[event.event]}: "${clampLine(subject, 120)}"`;
    }
    case "sentry":
      return `${SENTRY_EVENT_LABELS[event.event]}: "${clampLine(event.title, 120)}"`;
    case "pagerduty":
      return `${PAGERDUTY_EVENT_LABELS[event.event]}: "${clampLine(event.title, 120)}"`;
    case "email":
      return `Email from ${event.fromAddress} to ${event.inboxEmail}: "${clampLine(event.subject, 120)}"`;
    case "webhook": {
      const summary = event.context ?? event.body;
      return summary != null && summary.length > 0 ? `Webhook POST: "${clampLine(summary, 120)}"` : "Webhook POST received";
    }
  }
}
function escapeEventText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function buildTriggerEventContextBlock(event) {
  switch (event.source) {
    case "slack": {
      const payload = {
        channel: event.channel,
        sender: event.sender,
        text: event.text,
        is_mention: event.isMention,
        ...event.reactionEmoji != null ? { reaction: event.reactionEmoji } : {},
        ...event.ts != null ? { ts: event.ts } : {},
        ...event.threadTs != null ? { thread_ts: event.threadTs } : {},
        timestamp_ms: event.timestampMs
      };
      return `<slack_message>
${escapeEventText(JSON.stringify(payload, null, 2))}
</slack_message>`;
    }
    case "github": {
      const payload = {
        repo: event.repo,
        event: event.kind,
        title: event.title,
        actor: event.actor,
        ...event.url != null ? { url: event.url } : {},
        ...event.detail != null ? { detail: event.detail } : {},
        ...event.prNumber != null ? { pr_number: event.prNumber } : {},
        ...event.prOwner != null ? { pr_owner: event.prOwner } : {},
        ...event.branch != null ? { branch: event.branch } : {},
        timestamp_ms: event.timestampMs
      };
      return `<github_event>
${escapeEventText(JSON.stringify(payload, null, 2))}
</github_event>`;
    }
    case "origin": {
      const payload = {
        repo: event.repo,
        event: event.kind,
        title: event.title,
        actor: event.actor,
        ...event.url != null ? { url: event.url } : {},
        ...event.detail != null ? { detail: event.detail } : {},
        ...event.prNumber != null ? { pr_number: event.prNumber } : {},
        ...event.prOwner != null ? { pr_owner: event.prOwner } : {},
        timestamp_ms: event.timestampMs
      };
      return `<origin_event>
${escapeEventText(JSON.stringify(payload, null, 2))}
</origin_event>`;
    }
    case "microsoftTeams": {
      const payload = {
        tenant_id: event.tenantId,
        team_id: event.teamId,
        channel_id: event.channelId,
        text: event.text,
        aad_object_id: event.aadObjectId,
        activity_id: event.activityId,
        ...event.rootMessageId != null ? { root_message_id: event.rootMessageId } : {},
        timestamp_ms: event.timestampMs
      };
      return `<microsoft_teams_message>
${escapeEventText(JSON.stringify(payload, null, 2))}
</microsoft_teams_message>`;
    }
    case "linear": {
      const payload = {
        event: event.event,
        ...event.issueIdentifier != null ? { issue_identifier: event.issueIdentifier } : {},
        ...event.title != null ? { title: event.title } : {},
        ...event.url != null ? { url: event.url } : {},
        ...event.status != null ? { status: event.status } : {},
        ...event.projectId != null ? { project_id: event.projectId } : {},
        ...event.teamId != null ? { team_id: event.teamId } : {},
        ...event.statusId != null ? { status_id: event.statusId } : {},
        ...event.cycleId != null ? { cycle_id: event.cycleId } : {},
        ...event.cycleName != null ? { cycle_name: event.cycleName } : {},
        timestamp_ms: event.timestampMs
      };
      return `<linear_event>
${escapeEventText(JSON.stringify(payload, null, 2))}
</linear_event>`;
    }
    case "sentry": {
      const payload = {
        event: event.event,
        issue_id: event.issueId,
        short_id: event.shortId,
        title: event.title,
        ...event.projectId != null ? { project_id: event.projectId } : {},
        ...event.url != null ? { url: event.url } : {},
        ...event.projectSlug != null ? { project_slug: event.projectSlug } : {},
        ...event.status != null ? { status: event.status } : {},
        ...event.substatus != null ? { substatus: event.substatus } : {},
        timestamp_ms: event.timestampMs
      };
      return `<sentry_event>
${escapeEventText(JSON.stringify(payload, null, 2))}
</sentry_event>`;
    }
    case "pagerduty": {
      const payload = {
        event: event.event,
        incident_id: event.incidentId,
        title: event.title,
        status: event.status,
        service_id: event.serviceId,
        ...event.serviceName != null ? { service_name: event.serviceName } : {},
        ...event.url != null ? { url: event.url } : {},
        timestamp_ms: event.timestampMs
      };
      return `<pagerduty_event>
${escapeEventText(JSON.stringify(payload, null, 2))}
</pagerduty_event>`;
    }
    case "email": {
      const payload = {
        message_id: event.messageId,
        thread_id: event.threadId,
        inbox_email: event.inboxEmail,
        from_address: event.fromAddress,
        ...event.fromDisplayName != null ? { from_display_name: event.fromDisplayName } : {},
        subject: event.subject,
        occurred_at_ms: event.timestampMs,
        auth_passed: event.authPassed,
        attachment_count: event.attachmentCount,
        is_reply: event.isReply
      };
      return `<email_received>
${escapeEventText(JSON.stringify(payload, null, 2))}
</email_received>`;
    }
    case "webhook": {
      const payload = {
        headers: event.headers,
        body_digest: event.bodyDigest,
        ...event.context != null ? { context: event.context } : {},
        ...event.body != null ? { body: event.body } : {},
        timestamp_ms: event.timestampMs
      };
      return `<webhook_event>
${escapeEventText(JSON.stringify(payload, null, 2))}
</webhook_event>`;
    }
  }
}
