init_locale();
init_unknown_record();
var REQUEST_SOURCES2 = /* @__PURE__ */ new Set([
  "turn",
  "automation",
  "notification",
  "connector",
  "event",
  "handoff-resume",
  "background-revival",
  "web-search",
  "web-fetch"
]);
var EMPTY_SAND_PROFILE = {
  description: "",
  avatarPath: null
};
var EMPTY_UNREAD_STATE = {
  lastActivityAt: 0,
  lastUnreadActivityAt: 0,
  lastViewedAt: 0,
  isManuallyUnread: false,
  unreadCount: 0
};
var EMPTY_SPEND_GUARD_STATE = {
  nudgedAtMs: null,
  snoozedUntilMs: null,
  optedOut: false,
  cardEntryIds: [],
  pausedAutomationIds: []
};
var agentMetadataSerde = new AgentMetadataSerde();
var KV_METADATA = "metadata";
var KV_PROFILE = "sandProfile";
var KV_UNREAD_STATE = "unreadState";
var KV_AWAITING_USER_RESPONSE = "awaitingUserResponse";
var KV_LATEST_REQUEST_ID = "latestRequestId";
var KV_REQUEST_IDS = "requestIds";
var KV_EPISODE_PENDING = "episodePending";
var KV_MEMORY_PROMPT_SNAPSHOT = "memoryPromptSnapshot";
var KV_AGENT_PROFILE_PROMPT_SNAPSHOT = "agentProfilePromptSnapshot";
var KV_PROMPT_PREFIX_SNAPSHOT = "promptPrefixSnapshot";
var KV_PROMPT_SECTION_SNAPSHOTS = "promptSectionSnapshots";
var KV_ORIGIN = "origin";
var KV_INTRODUCTION_PENDING = "introductionPending";
var KV_INTRODUCTION_LANGUAGE = "introductionLanguage";
var KV_SERVER_INTRODUCTION = "serverIntroduction";
var KV_SPEND_GUARD_STATE = "automationSpendGuardState";
var KV_SPEND_GUARD_NUDGED_AT = "automationSpendGuardNudgedAt";
var KV_WATCHED_SLACK_CHANNELS = "watchedSlackChannels";
var KV_HIDDEN_ENTRY_REPAIR_VERSION = "hiddenEntryRepairVersion";
var KV_STALE_ROOT_CLEANUP_VERSION = "staleRootCleanupVersion";
var KV_LAST_TURN_SETTLEMENT = "lastTurnSettlement";
var REQUEST_ID_HISTORY_MAX = 200;
var REQUEST_ID_PROMPT_MAX = 200;
function parseServerIntroductionState(raw) {
  return raw === "owed" || raw === "settled" ? raw : null;
}
function parseIntroductionLanguage(raw) {
  return raw !== null && isLanguageTag(raw) ? raw : void 0;
}
function parseTranscriptEntry(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  return transcriptEntryOfJson(parsed2);
}
function parseProfile(raw) {
  if (raw == null) return EMPTY_SAND_PROFILE;
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return EMPTY_SAND_PROFILE;
  }
  const description9 = typeof parsed2.description === "string" ? parsed2.description : "";
  const avatarPath = typeof parsed2.avatarPath === "string" && parsed2.avatarPath.length > 0 ? parsed2.avatarPath : null;
  return { description: description9, avatarPath };
}
function parseUnreadState(raw) {
  if (raw == null) return EMPTY_UNREAD_STATE;
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return EMPTY_UNREAD_STATE;
  }
  const lastActivityAt = typeof parsed2.lastActivityAt === "number" && Number.isFinite(parsed2.lastActivityAt) ? parsed2.lastActivityAt : 0;
  const lastViewedAt = typeof parsed2.lastViewedAt === "number" && Number.isFinite(parsed2.lastViewedAt) ? parsed2.lastViewedAt : 0;
  const lastUnreadActivityAt = typeof parsed2.lastUnreadActivityAt === "number" && Number.isFinite(parsed2.lastUnreadActivityAt) ? parsed2.lastUnreadActivityAt : lastActivityAt;
  const unreadCount = typeof parsed2.unreadCount === "number" && Number.isFinite(parsed2.unreadCount) && parsed2.unreadCount >= 0 ? Math.floor(parsed2.unreadCount) : lastUnreadActivityAt > lastViewedAt ? 1 : 0;
  return {
    lastActivityAt,
    lastUnreadActivityAt,
    lastViewedAt,
    isManuallyUnread: parsed2.isManuallyUnread === true,
    unreadCount
  };
}
function resolveSpendGuardState(raw) {
  if (raw.state == null) {
    const legacy = Number(raw.legacyNudgedAt);
    return Number.isFinite(legacy) && legacy > 0 ? { ...EMPTY_SPEND_GUARD_STATE, nudgedAtMs: legacy } : EMPTY_SPEND_GUARD_STATE;
  }
  let parsed2;
  try {
    parsed2 = JSON.parse(raw.state);
  } catch {
    return EMPTY_SPEND_GUARD_STATE;
  }
  if (parsed2 == null || typeof parsed2 !== "object") return EMPTY_SPEND_GUARD_STATE;
  const positiveMs3 = (value) => typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
  const stringIds = (value) => Array.isArray(value) ? value.filter((id) => typeof id === "string" && id.length > 0) : [];
  const pausedAutomationIds = stringIds(parsed2.pausedAutomationIds);
  return {
    nudgedAtMs: positiveMs3(parsed2.nudgedAtMs),
    snoozedUntilMs: positiveMs3(parsed2.snoozedUntilMs),
    optedOut: parsed2.optedOut === true,
    cardEntryIds: stringIds(parsed2.cardEntryIds),
    pausedAutomationIds
  };
}
function serializeSpendGuardState(state) {
  const isEmpty = state.nudgedAtMs == null && state.snoozedUntilMs == null && !state.optedOut && state.cardEntryIds.length === 0 && state.pausedAutomationIds.length === 0;
  return isEmpty ? null : JSON.stringify(state);
}
function parseAwaitingState(raw) {
  if (raw == null) return null;
  const parsed2 = parseJsonOrUndefined(raw);
  if (!isUnknownRecord(parsed2)) return null;
  const tabId = typeof parsed2.tabId === "string" ? parsed2.tabId : "";
  const reason = typeof parsed2.reason === "string" ? parsed2.reason : "";
  const since = typeof parsed2.since === "number" && Number.isFinite(parsed2.since) ? parsed2.since : 0;
  if (tabId.length === 0) return null;
  const reasonCopy = parseSandAutoReviewAwaitingCopy(parsed2.reasonCopy);
  return {
    tabId,
    reason,
    ...reasonCopy === void 0 ? {} : { reasonCopy },
    since
  };
}
function parseTurnBotBlock(raw) {
  if (!isUnknownRecord(raw)) return void 0;
  const family = typeof raw.family === "string" && raw.family.length > 0 ? raw.family : void 0;
  const confidence = raw.confidence === "high" || raw.confidence === "low" ? raw.confidence : void 0;
  return family !== void 0 && confidence !== void 0 ? { family, confidence } : void 0;
}
function parseTurnSettlement(raw) {
  if (raw == null) return null;
  const parsed2 = parseJsonOrUndefined(raw);
  if (!isUnknownRecord(parsed2)) return null;
  const clientNonce = typeof parsed2.clientNonce === "string" ? parsed2.clientNonce : "";
  const outcome = SAND_TURN_SETTLEMENT_OUTCOMES.find((value) => value === parsed2.outcome);
  const settledAtMs = typeof parsed2.settledAtMs === "number" && Number.isFinite(parsed2.settledAtMs) ? parsed2.settledAtMs : 0;
  if (clientNonce.length === 0 || outcome === void 0 || settledAtMs <= 0) return null;
  const botBlock = parseTurnBotBlock(parsed2.botBlock);
  return {
    clientNonce,
    outcome,
    settledAtMs,
    ...typeof parsed2.errorCode === "string" && parsed2.errorCode.length > 0 ? { errorCode: parsed2.errorCode } : {},
    ...typeof parsed2.errorDomain === "string" && parsed2.errorDomain.length > 0 ? { errorDomain: parsed2.errorDomain } : {},
    ...typeof parsed2.errorRetryable === "boolean" ? { errorRetryable: parsed2.errorRetryable } : {},
    ...botBlock === void 0 ? {} : { botBlock }
  };
}
function parseRequestRecords(raw) {
  if (raw == null) return [];
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed2)) return [];
  const records2 = [];
  for (const entry of parsed2) {
    if (entry == null || typeof entry !== "object") continue;
    const id = typeof entry.id === "string" ? entry.id.trim() : "";
    if (id.length === 0) continue;
    const at2 = typeof entry.at === "number" && Number.isFinite(entry.at) && entry.at > 0 ? entry.at : 0;
    const prompt = typeof entry.prompt === "string" && entry.prompt.length > 0 ? entry.prompt : void 0;
    const source = entry.source != null && REQUEST_SOURCES2.has(entry.source) ? entry.source : void 0;
    records2.push({
      id,
      at: at2,
      ...prompt != null ? { prompt } : {},
      ...source != null ? { source } : {}
    });
  }
  return records2;
}
function parseMemoryPromptSnapshot(raw) {
  if (raw == null) return null;
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed2 == null || typeof parsed2 !== "object") return null;
  if (typeof parsed2.render !== "string" || typeof parsed2.compactionEpoch !== "number" || !Number.isFinite(parsed2.compactionEpoch)) {
    return null;
  }
  return { render: parsed2.render, compactionEpoch: parsed2.compactionEpoch };
}
