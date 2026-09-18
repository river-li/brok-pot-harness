var DEFAULT_GROK_BOT_SESSION_ID = "";
var TRANSCRIPT_REPLICA_PREFIX = "transcript:";
var TRANSCRIPT_SESSION_SEPARATOR = "\0";
function transcriptReplicaKeyForSession(target) {
  if (target.sessionId === DEFAULT_GROK_BOT_SESSION_ID) {
    return transcriptReplicaKey(target.agentId);
  }
  return `${TRANSCRIPT_REPLICA_PREFIX}${target.agentId}${TRANSCRIPT_SESSION_SEPARATOR}${target.sessionId}`;
}
var GROUP_CHAT_SESSION_PREFIX = "group:";
function grokBotGroupChatRoomIdOf(sessionId) {
  return sessionId.length > GROUP_CHAT_SESSION_PREFIX.length && sessionId.startsWith(GROUP_CHAT_SESSION_PREFIX) ? sessionId.slice(GROUP_CHAT_SESSION_PREFIX.length) : void 0;
}
function normalizeGrokBotSessionId(sessionId) {
  return sessionId == null || sessionId.length === 0 ? DEFAULT_GROK_BOT_SESSION_ID : sessionId;
}
