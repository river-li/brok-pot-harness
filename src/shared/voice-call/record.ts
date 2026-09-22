/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/voice-call/record.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
var SAND_VOICE_CALL_EVENT_KINDS = [
  "caller-speech-started",
  "caller-speech-stopped",
  "caller-interrupted",
  "agent-speech-started",
  "agent-speech-stopped",
  "response-create",
  "protocol-error"
];
var SandVoiceCallRecords = class _SandVoiceCallRecords {
  static CARD_FRAME = "message";
  static DIRECTION_OF_A_CALL_RECORDED_BEFORE_DIRECTIONS = "to-main";
  static nudge({
    id,
    request: request5,
    atMs,
    direction,
    answer = null,
    answeredAtMs = null
  }) {
    return { id, request: request5, atMs, direction, answer, answeredAtMs };
  }
  static directionOf(nudge) {
    return nudge.direction ?? _SandVoiceCallRecords.DIRECTION_OF_A_CALL_RECORDED_BEFORE_DIRECTIONS;
  }
  static isEnding(value) {
    return value === "hung-up" || value === "disconnected" || value === "failed";
  }
  static isRecord(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["callId"] === "string" && typeof value["agentId"] === "string" && typeof value["model"] === "string" && (value["realtimeConversationId"] == null || typeof value["realtimeConversationId"] === "string") && (value["agentRequestId"] === void 0 || typeof value["agentRequestId"] === "string") && typeof value["startedAtMs"] === "number" && typeof value["endedAtMs"] === "number" && typeof value["durationMs"] === "number" && _SandVoiceCallRecords.isEnding(value["ending"]) && Array.isArray(value["turns"]) && value["turns"].every(_SandVoiceCallRecords.isTurn) && Array.isArray(value["nudges"]) && value["nudges"].every(_SandVoiceCallRecords.isNudge) && (value["events"] === void 0 || Array.isArray(value["events"]) && value["events"].every(_SandVoiceCallRecords.isEvent)) && _SandVoiceCallRecords.isToolCallsOrAbsent(value["toolCalls"]) && _SandVoiceCallRecords.isOverheardOrAbsent(value["overheard"]) && (value["harnessMayCollect"] === void 0 || typeof value["harnessMayCollect"] === "boolean");
  }
  static conversation(record2) {
    return {
      turns: record2.turns,
      nudges: record2.nudges,
      events: record2.events ?? [],
      toolCalls: record2.toolCalls ?? [],
      overheard: record2.overheard ?? []
    };
  }
  static isEventKind(value) {
    const kinds = SAND_VOICE_CALL_EVENT_KINDS;
    return typeof value === "string" && kinds.includes(value);
  }
  static isEvent(value) {
    if (!isUnknownRecord(value)) return false;
    return _SandVoiceCallRecords.isEventKind(value["kind"]) && typeof value["atMs"] === "number";
  }
  static isConversation(value) {
    if (!isUnknownRecord(value)) return false;
    return Array.isArray(value["turns"]) && value["turns"].every(_SandVoiceCallRecords.isTurn) && Array.isArray(value["nudges"]) && value["nudges"].every(_SandVoiceCallRecords.isNudge) && Array.isArray(value["events"]) && value["events"].every(_SandVoiceCallRecords.isEvent) && _SandVoiceCallRecords.isToolCallsOrAbsent(value["toolCalls"]) && _SandVoiceCallRecords.isOverheardOrAbsent(value["overheard"]);
  }
  static isToolResult(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["json"] === "string" && typeof value["atMs"] === "number";
  }
  static isToolCall(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["id"] === "string" && typeof value["name"] === "string" && typeof value["argumentsJson"] === "string" && typeof value["atMs"] === "number" && (value["result"] === null || _SandVoiceCallRecords.isToolResult(value["result"]));
  }
  static isToolCallsOrAbsent(value) {
    return value === void 0 || Array.isArray(value) && value.every(_SandVoiceCallRecords.isToolCall);
  }
  static isOverheardStep(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["id"] === "string" && typeof value["text"] === "string" && typeof value["atMs"] === "number";
  }
  static isOverheardOrAbsent(value) {
    return value === void 0 || Array.isArray(value) && value.every(_SandVoiceCallRecords.isOverheardStep);
  }
  static summarize(record2) {
    return {
      callId: record2.callId,
      realtimeConversationId: record2.realtimeConversationId ?? null,
      durationMs: record2.durationMs,
      endedAtMs: record2.endedAtMs,
      ending: record2.ending,
      turnCount: record2.turns.length,
      nudgeCount: record2.nudges.length,
      answeredNudgeCount: record2.nudges.filter((nudge) => nudge.answeredAtMs != null).length,
      ...record2.agentRequestId === void 0 ? {} : { agentRequestId: record2.agentRequestId }
    };
  }
  static formatDuration(durationMs) {
    const totalSeconds = Math.max(0, Math.round(durationMs / 1e3));
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    const paddedSeconds = String(seconds).padStart(2, "0");
    if (hours === 0) return `${minutes}:${paddedSeconds}`;
    return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
  }
  static formatCardDuration(durationMs) {
    const totalSeconds = Math.max(0, Math.round(durationMs / 1e3));
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    const paddedSeconds = String(seconds).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    if (hours === 0) return `${paddedMinutes}:${paddedSeconds}`;
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  static hasNoDuration(summary) {
    return summary.ending === "failed" && summary.durationMs === 0;
  }
  static isTurn(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["id"] === "string" && (value["speaker"] === "user" || value["speaker"] === "assistant") && typeof value["text"] === "string" && typeof value["atMs"] === "number";
  }
  static isNudgeDirection(value) {
    return value === "to-main" || value === "to-voice";
  }
  static isNudgeCut(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["atMs"] === "number" && typeof value["heardMs"] === "number";
  }
  static isNudge(value) {
    if (!isUnknownRecord(value)) return false;
    return typeof value["id"] === "string" && typeof value["request"] === "string" && typeof value["atMs"] === "number" && (value["answer"] === null || typeof value["answer"] === "string") && (value["answeredAtMs"] == null || typeof value["answeredAtMs"] === "number") && (value["direction"] === void 0 || _SandVoiceCallRecords.isNudgeDirection(value["direction"])) && (value["cut"] == null || _SandVoiceCallRecords.isNudgeCut(value["cut"]));
  }
};

