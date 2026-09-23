init_errors();
init_unknown_record();
var SAND_AUTO_REVIEW_RESOLUTIONS = ["approved", "denied", "always"];
var SAND_CONNECTOR_GRANT_RESOLUTIONS = [
  "allowed",
  "skipped",
  "always_this_bot",
  "always_all_team_bots"
];
var SAND_FEEDBACK_ACTIONS = ["up", "down", "submit", "revert"];
var SAND_WIDGET_ACTION_STYLES = ["default", "primary", "danger"];
var SAND_CONNECTOR_CARD_VARIANTS = ["connected", "connect"];
var SAND_AUTO_REVIEW_STALE = "auto-review/stale";
var SAND_AUTO_REVIEW_STALE_MESSAGE = "The Auto-review request is stale, expired, or not authorized.";
var SAND_CONNECTOR_GRANT_STALE = "connector-grant/stale";
var SAND_CONNECTOR_GRANT_STALE_MESSAGE = "The connector grant request is stale, expired, or not authorized.";
var SAND_VIRTUAL_CARD_STALE = "virtual-card/stale";
var SAND_USER_FORM_STALE = "user-form/stale";
var SAND_SECRET_SAVE_REFUSED = "secret-request/save-refused";
var SAND_SECRET_SAVE_REFUSED_MESSAGE = "The secret was not saved.";
var SAND_SECRET_STORE_FAILED_MESSAGE = "The secret could not be applied to the box environment.";
var SandSecretStoreFailedError = class extends SandDomainError {
  name = "SandSecretStoreFailedError";
  failureCode = SAND_SECRET_SAVE_REFUSED;
  constructor() {
    super(SAND_SECRET_STORE_FAILED_MESSAGE);
  }
};
function isValidTimestampMs(timestampMs2) {
  return typeof timestampMs2 === "number" && Number.isFinite(timestampMs2) && timestampMs2 > 0;
}
function withTimestampMs(entry) {
  if (isValidTimestampMs(entry.timestampMs)) {
    return entry;
  }
  return { ...entry, timestampMs: Date.now() };
}
var SAND_AUTO_REVIEW_APPROVAL_CARD = {
  pendingOf: (message) => message.type === "auto-review-approval" && message.approval.status === "pending" ? message : null,
  requestIdOf: (message) => message.approval.requestId,
  withStatus: (message, status) => ({ ...message, approval: { ...message.approval, status } }),
  sweepDefaultStatus: "expired"
};
var SAND_LOCAL_TOOL_PERMISSION_ASK_CARD = {
  pendingOf: (message) => message.type === "local-tool-permission" && message.ask.status === "pending" ? message : null,
  requestIdOf: (message) => message.ask.requestId,
  withStatus: (message, status) => ({ ...message, ask: { ...message.ask, status } }),
  sweepDefaultStatus: "expired"
};
var SAND_COOKIE_ORIGIN_APPROVAL_CARD = {
  pendingOf: (message) => message.type === "cookie-origin-approval" && message.approval.status === "pending" ? message : null,
  requestIdOf: (message) => message.approval.requestId,
  withStatus: (message, status) => ({ ...message, approval: { ...message.approval, status } }),
  sweepDefaultStatus: "expired"
};
var SAND_VIRTUAL_CARD_APPROVAL_CARD = {
  pendingOf: (message) => message.type === "virtual-card-approval" && message.approval.status === "pending" ? message : null,
  requestIdOf: (message) => message.approval.requestId,
  withStatus: (message, status) => ({ ...message, approval: { ...message.approval, status } }),
  sweepDefaultStatus: "expired"
};
function settlePendingCardEntry(kind, entry, status, requestId2) {
  if (entry.kind !== "send-message") return null;
  const pending = kind.pendingOf(entry.message);
  if (pending == null) return null;
  if (requestId2 != null && kind.requestIdOf(pending) !== requestId2) return null;
  return { ...entry, message: kind.withStatus(pending, status) };
}
function settlePendingAutoReviewApprovalEntry(entry, status, requestId2) {
  return settlePendingCardEntry(SAND_AUTO_REVIEW_APPROVAL_CARD, entry, status, requestId2);
}
function settlePendingLocalToolPermissionEntry(entry, status, requestId2) {
  return settlePendingCardEntry(SAND_LOCAL_TOOL_PERMISSION_ASK_CARD, entry, status, requestId2);
}
function settlePendingCookieOriginApprovalEntry(entry, status, requestId2, settlement) {
  const settled = settlePendingCardEntry(
    SAND_COOKIE_ORIGIN_APPROVAL_CARD,
    entry,
    status,
    requestId2
  );
  if (settled === null || settlement === void 0) return settled;
  if (settled.kind !== "send-message" || settled.message.type !== "cookie-origin-approval") {
    return settled;
  }
  return {
    ...settled,
    message: {
      ...settled.message,
      approval: {
        ...settled.message.approval,
        ...settlement.items === void 0 ? {} : { items: settlement.items },
        ...settlement.approvedItems === void 0 ? {} : { approvedItems: settlement.approvedItems }
      }
    }
  };
}
function settlePendingVirtualCardApprovalEntry(entry, status, requestId2, outcome) {
  const settled = settlePendingCardEntry(SAND_VIRTUAL_CARD_APPROVAL_CARD, entry, status, requestId2);
  if (settled === null || outcome === void 0) return settled;
  if (settled.kind !== "send-message" || settled.message.type !== "virtual-card-approval") {
    return settled;
  }
  return {
    ...settled,
    message: {
      ...settled.message,
      approval: {
        ...settled.message.approval,
        ...outcome.spendRequestId === void 0 ? {} : { spendRequestId: outcome.spendRequestId },
        ...outcome.failureReason === void 0 ? {} : { failureReason: outcome.failureReason }
      }
    }
  };
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function isOptionalString(value) {
  return value === void 0 || typeof value === "string";
}
function isSandDraftPayload(value) {
  if (!isUnknownRecord(value) || !isUnknownRecord(value.draft)) return false;
  const draft = value.draft;
  if (value.type === "email-draft") {
    return typeof draft.from === "string" && isStringArray(draft.to) && (draft.cc === void 0 || isStringArray(draft.cc)) && typeof draft.subject === "string" && typeof draft.body === "string";
  }
  if (value.type === "slack-draft") {
    return isOptionalString(draft.workspace) && typeof draft.target === "string" && isOptionalString(draft.thread) && typeof draft.body === "string";
  }
  return false;
}
function settleSendingDraftEntry(entry, state, sentDraft) {
  if (entry.kind !== "send-message" || entry.draftSendState !== "sending") return null;
  if (entry.message.type === "email-draft") {
    const message = sentDraft?.type === "email-draft" ? { ...entry.message, draft: sentDraft.draft } : entry.message;
    return { ...entry, message, draftSendState: state };
  }
  if (entry.message.type === "slack-draft") {
    const message = sentDraft?.type === "slack-draft" ? { ...entry.message, draft: sentDraft.draft } : entry.message;
    return { ...entry, message, draftSendState: state };
  }
  return null;
}
function clearSendingDraftEntry(entry, editedDraft) {
  if (entry.kind !== "send-message" || entry.draftSendState !== "sending") return null;
  if (entry.message.type === "email-draft") {
    const message = editedDraft?.type === "email-draft" ? { ...entry.message, draft: editedDraft.draft } : entry.message;
    const { draftSendState: _state, ...rest } = { ...entry, message };
    return rest;
  }
  if (entry.message.type === "slack-draft") {
    const message = editedDraft?.type === "slack-draft" ? { ...entry.message, draft: editedDraft.draft } : entry.message;
    const { draftSendState: _state, ...rest } = { ...entry, message };
    return rest;
  }
  return null;
}
var SAND_REACTION_SELF = "me";
var SAND_REACTION_AGENT = "agent";
var SAND_FEEDBACK_VOTE_TARGET_MESSAGE = "Feedback prompt is no longer available";
var SandFeedbackVoteTargetError = class extends Error {
  constructor() {
    super(SAND_FEEDBACK_VOTE_TARGET_MESSAGE);
    this.name = "SandFeedbackVoteTargetError";
  }
};
var SandServerRoomSendError = class extends SandDomainError {
  name = "SandServerRoomSendError";
};
var SAND_TRANSCRIPT_ENTRY_KINDS = [
  "message",
  "tool-call",
  "send-message",
  "user-attachment",
  "notice",
  "event"
];
function isPendingCookieOriginApprovalEntry(entry) {
  return entry.kind === "send-message" && entry.message.type === "cookie-origin-approval" && entry.message.approval.status === "pending";
}
function getEntryReplyTo(entry) {
  if (entry.kind === "message" || entry.kind === "send-message" || entry.kind === "user-attachment" || entry.kind === "notice") {
    return entry.replyTo;
  }
  return void 0;
}
function isBranchedEntry(entry) {
  if (entry.kind === "message" || entry.kind === "send-message" || entry.kind === "user-attachment" || entry.kind === "notice") {
    return entry.branched === true;
  }
  return false;
}
function resolveBranchRoot(entry, byId) {
  let current = entry;
  const seen = /* @__PURE__ */ new Set([entry.id]);
  for (; ; ) {
    const parentId = getEntryReplyTo(current);
    if (parentId == null) return null;
    const parent = byId.get(parentId);
    if (parent == null) return null;
    if (!isBranchedEntry(parent)) return parentId;
    if (seen.has(parentId)) return null;
    seen.add(parentId);
    current = parent;
  }
}
function getChatTranscriptEntries(entries) {
  if (!entries.some(isVoiceCallChannelEntry)) return entries;
  return entries.filter((entry) => !isVoiceCallChannelEntry(entry));
}
function getMainTranscriptEntries(entries) {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const isThreadMessage = (entry) => isBranchedEntry(entry) && resolveBranchRoot(entry, byId) != null;
  const chat = getChatTranscriptEntries(entries);
  if (!chat.some(isThreadMessage)) return chat;
  return chat.filter((entry) => !isThreadMessage(entry));
}
function getThreadTranscriptEntries(entries, rootId) {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  if (!byId.has(rootId)) return [];
  const childrenByParent = /* @__PURE__ */ new Map();
  for (const candidate of entries) {
    const parentId = getEntryReplyTo(candidate);
    if (parentId == null) continue;
    const bucket = childrenByParent.get(parentId);
    if (bucket == null) childrenByParent.set(parentId, [candidate.id]);
    else bucket.push(candidate.id);
  }
  const thread = /* @__PURE__ */ new Set([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const nextId = queue.shift();
    if (nextId == null) continue;
    for (const childId of childrenByParent.get(nextId) ?? []) {
      if (thread.has(childId)) continue;
      const child = byId.get(childId);
      if (child == null || !isBranchedEntry(child)) continue;
      thread.add(childId);
      queue.push(childId);
    }
  }
  return entries.filter((candidate) => thread.has(candidate.id));
}
function isAgentPeerMessageEntry(entry) {
  return entry != null && entry.kind === "message" && (entry.fromAgent != null || entry.toAgent != null);
}
function isOutboundAgentPeerMessageEntry(entry) {
  return entry != null && entry.kind === "message" && entry.toAgent != null;
}
function isVisibleOutboundAgentPeerMessageEntry(entry) {
  return isOutboundAgentPeerMessageEntry(entry) && (entry.toAgent.kind === "agent" || entry.toAgent.kind === "cloud-agent");
}
function isHiddenOutboundAgentPeerMessageEntry(entry) {
  return isOutboundAgentPeerMessageEntry(entry) && entry.toAgent.kind !== "agent" && entry.toAgent.kind !== "cloud-agent";
}
function isVoiceCallChannelEntry(entry) {
  if (entry === void 0) return false;
  let channel;
  if (entry.kind === "message") {
    channel = entry.channel;
  } else if (entry.kind === "send-message" && (entry.message.type === "text" || entry.message.type === "attachment")) {
    channel = entry.message.channel;
  }
  return VoiceCallChannel.callIdOf(channel) !== null;
}
function entryRaisesUserActivitySignal(entry) {
  return !isAgentPeerMessageEntry(entry) && !isVoiceCallChannelEntry(entry);
}
function entryRaisesUnreadSignal(entry) {
  return entryRaisesUserActivitySignal(entry) && !(entry.kind === "send-message" && (entry.boxRequestId != null || entry.message.type === "auto-review-approval"));
}
