var VoiceCallResponseCancel = class _VoiceCallResponseCancel {
  static EVENT_ID_PREFIX = "response_cancel.";
  static frame(sequence) {
    return {
      type: "response.cancel",
      event_id: `${_VoiceCallResponseCancel.EVENT_ID_PREFIX}${sequence}`
    };
  }
};
