/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/call/voice-channel.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VOICE_CALL_ENDED_MESSAGE = "The call ended. This channel is closed from now on, so anything still owed goes in the chat.";
var VOICE_CALL_SENDER = "the call";
var ADDRESS_PREFIX = `${VOICE_CALL_CHANNEL_PLATFORM}:`;
var OWNER_STARTED_SOURCES = ["turn", "voice-call", "handoff-resume"];
var VoiceCallChannel = class {
  static address(callId) {
    return `${ADDRESS_PREFIX}${callId}`;
  }
  static callIdOf(channel) {
    if (channel === void 0 || !channel.startsWith(ADDRESS_PREFIX))
      return null;
    const callId = channel.slice(ADDRESS_PREFIX.length).trim();
    return callId.length === 0 ? null : callId;
  }
  static isOwnerStarted(requestSource) {
    return requestSource !== void 0 && OWNER_STARTED_SOURCES.includes(requestSource);
  }
};
var VoiceCallChannelSends = class {
  static spokenText(text2) {
    const spoken = text2.trim();
    return spoken.length === 0 ? null : spoken;
  }
  static refusal({ isLive: isLive3, spokenText }) {
    if (!isLive3)
      return "call-closed";
    if (spokenText === null)
      return "not-spoken";
    return null;
  }
  static reason(refusal, { address, sendTool }) {
    switch (refusal) {
      case "call-closed":
        return `The voice call at ${address} is closed, so nobody heard that. Anything still owed goes in writing: a ${sendTool} with no channel for this chat, or another connected channel.`;
      case "subagent":
        return `Only the main agent speaks on the user's voice call, so nothing was said on ${address}. Put it in writing: a ${sendTool} with no channel, or your final response.`;
      case "not-spoken":
        return `${address} is a voice call: it carries spoken words only, so nothing was said. Send type:text with something to say and no images there, and put files or images in writing instead.`;
    }
  }
};

