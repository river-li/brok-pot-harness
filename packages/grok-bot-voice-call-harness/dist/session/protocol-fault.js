var FRAME_KIND_BY_EVENT_ID_PREFIX = [
  [`${VoiceCallWrittenTurns.EVENT_ID_PREFIX}-`, "async_update_add"],
  [`${VoiceCallItemSeeding.CALL_ID_PREFIX}-`, "async_update_add"],
  [VoiceCallResponseCancel.EVENT_ID_PREFIX, "response_cancel"]
];
