var KNOWN = {
  [VOICE_CALL_NUDGE_MAIN_TOOL]: {
    line: `- ${VOICE_CALL_NUDGE_MAIN_TOOL}: speak a short beat that names the job in how you talk, then send it. Never start that beat with a confirmation. Never say you are calling the tool. Work that needs their computer, files, web, browser, or mail and chat they send goes through it; do not refuse it. That call is a receipt, never the outcome, and never the quick path. The outcome lands later, on its own, as a ${VOICE_CALL_WORK_LANDED_TOOL} entry.`,
    inFlight: [],
    receipt: null
  },
  [VOICE_CALL_RECALL_TEXTS_TOOL]: {
    line: `- ${VOICE_CALL_RECALL_TEXTS_TOOL}: read ${VOICE_CALL_RECALL_TEXTS_SCOPE} ${VOICE_CALL_RECALL_TEXTS_WHEN}`,
    inFlight: [],
    receipt: null
  },
  [VOICE_CALL_SEARCH_CONVERSATIONS_TOOL]: {
    line: `- ${VOICE_CALL_SEARCH_CONVERSATIONS_TOOL}: search ${VOICE_CALL_SEARCH_CONVERSATIONS_SCOPE} ${VOICE_CALL_SEARCH_CONVERSATIONS_WHEN} Speak what you found as something you know, placing it roughly in time or place when it came from an earlier chat or call, and never as a search, a lookup, or a record you consulted.`,
    inFlight: [],
    receipt: null
  },
  [VOICE_CALL_SILENT_TOOL]: {
    line: `- ${VOICE_CALL_SILENT_TOOL}: say nothing this turn, only when the last landed entry is ${VOICE_CALL_WORK_LANDED_TOOL} or ${VOICE_CALL_WORK_OVERHEARD_TOOL} and there is nothing new to say. Never when they just talked to you. Never on the unpaid turn after ${VOICE_CALL_NUDGE_MAIN_TOOL}. Never on a ${VOICE_CALL_WORK_LANDED_TOOL} outcome they have not heard.`,
    inFlight: [
      `Never ${VOICE_CALL_SILENT_TOOL} on a turn they talked to you, even if a ${VOICE_CALL_WORK_LANDED_TOOL} entry just landed.`,
      `${VOICE_CALL_SILENT_TOOL} only when they have said nothing since your last line and the last thing that landed is a ${VOICE_CALL_WORK_LANDED_TOOL} or ${VOICE_CALL_WORK_OVERHEARD_TOOL} entry and speaking would give them nothing new.`,
      `Never ${VOICE_CALL_SILENT_TOOL} on the same turn as spoken words.`
    ],
    receipt: `Do not ${VOICE_CALL_SILENT_TOOL}.`
  },
  [VOICE_CALL_HANGUP_TOOL]: {
    line: `- ${VOICE_CALL_HANGUP_TOOL}: hang up only on a parting greeting. Say your goodbye first; the line drops the moment you call it.`,
    inFlight: [],
    receipt: null
  }
};
var VoiceCallToolPrompts = class _VoiceCallToolPrompts {
  static of(tool) {
    return KNOWN[tool.name] ?? {
      line: `- ${tool.name}: ${tool.description}`,
      inFlight: [],
      receipt: null
    };
  }
  static lines(tools) {
    return tools.map((tool) => _VoiceCallToolPrompts.of(tool).line);
  }
  static inFlight(tools) {
    return tools.flatMap((tool) => _VoiceCallToolPrompts.of(tool).inFlight);
  }
  static receipt(tools) {
    return tools.flatMap((tool) => {
      const receipt = _VoiceCallToolPrompts.of(tool).receipt;
      return receipt === null ? [] : [receipt];
    });
  }
};
