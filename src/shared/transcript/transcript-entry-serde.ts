init_unknown_record();
var HIDDEN_TRANSCRIPT_ENTRY_KINDS = /* @__PURE__ */ new Set([
  "spend-initiation",
  "error"
]);
function isNewerTranscriptEntryKind(kind) {
  return typeof kind === "string" && kind.length > 0 && !HIDDEN_TRANSCRIPT_ENTRY_KINDS.has(kind);
}
function isValidTranscriptEntry(entry) {
  if (entry == null || typeof entry !== "object") return false;
  const candidate = entry;
  if (typeof candidate.id !== "string" || candidate.id.length === 0) return false;
  switch (candidate.kind) {
    case "send-message": {
      if (candidate.message == null) return false;
      return candidate.message.type !== "text" || typeof candidate.message.content === "string";
    }
    case "message":
      return typeof candidate.content === "string";
    case "user-attachment":
      return typeof candidate.file_path === "string";
    case "tool-call":
      return typeof candidate.name === "string";
    case "notice":
      return typeof candidate.text === "string";
    case "voice-call":
      return candidate.call != null && typeof candidate.call.callId === "string";
    case "event":
      return candidate.event != null && typeof candidate.event === "object" && typeof candidate.event.type === "string";
    case "feedback":
      return typeof candidate.requestId === "string";
    default: {
      const _exhaustive = candidate;
      void _exhaustive;
      return "kind" in entry && isNewerTranscriptEntryKind(entry.kind);
    }
  }
}
function withBoxEnvSecretTargetKeys(entry) {
  if (entry.kind !== "send-message" || entry.message.type !== "secret-request") return entry;
  const request5 = entry.message.secretRequest;
  if (!isUnknownRecord(request5) || !isUnknownRecord(request5.target)) return entry;
  const { kind, name: name17, platform: platform2, field } = request5.target;
  if (kind !== "box-env" || typeof name17 !== "string") return entry;
  if (typeof platform2 === "string" && typeof field === "string") return entry;
  return {
    ...entry,
    message: {
      ...entry.message,
      secretRequest: { ...entry.message.secretRequest, target: boxEnvSecretTarget(name17) }
    }
  };
}
function withVoiceCallNudgeCounts(entry) {
  if (entry.kind !== "voice-call") return entry;
  const { nudgeCount, answeredNudgeCount } = entry.call;
  if (typeof nudgeCount === "number" && typeof answeredNudgeCount === "number") return entry;
  return {
    ...entry,
    call: {
      ...entry.call,
      nudgeCount: typeof nudgeCount === "number" ? nudgeCount : 0,
      answeredNudgeCount: typeof answeredNudgeCount === "number" ? answeredNudgeCount : 0
    }
  };
}
function withEmailDraftFrom(entry) {
  if (entry.kind !== "send-message" || entry.message.type !== "email-draft") return entry;
  if (typeof entry.message.draft.from === "string") return entry;
  return {
    ...entry,
    message: { ...entry.message, draft: { ...entry.message.draft, from: "" } }
  };
}
function transcriptEntryOfJson(parsed2) {
  if (!isValidTranscriptEntry(parsed2)) return null;
  return withEmailDraftFrom(withVoiceCallNudgeCounts(withBoxEnvSecretTargetKeys(parsed2)));
}
