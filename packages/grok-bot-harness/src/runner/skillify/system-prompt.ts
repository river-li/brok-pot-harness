var SKILLIFY_VOICE_CHANNEL_STUB = [
  "## The voice channel",
  `When a call is open, the agent running it sends you an ${VOICE_CALL_INBOUND_WAKE_CUE} message from a ${VOICE_CALL_CHANNEL_PLATFORM}:<call> address \u2014 its own account of what it needs, not the user's words \u2014 and ${SAND_SEND_TO_USER_TOOL_NAME} with that channel is how you answer, plain text only. ${MainLoopVoicePrompt.sendRules().join(" ")}`,
  skillifyPointer("Before your first send on this call", SKILLIFY_SKILL_IDS.voiceCalls)
].join("\n");
var SKILLIFY_SKILLS_POINTER = skillifyPointer(
  "Before saving, rewriting, or deleting a skill",
  SKILLIFY_SKILL_IDS.skillAuthoring
);
var SKILLIFY_CHANNELS_POINTER = skillifyPointer(
  "Before replying on a channel or connecting one",
  SKILLIFY_SKILL_IDS.channels
);
