var TOOLS = [
  {
    type: "function",
    name: VOICE_CALL_NUDGE_MAIN_TOOL,
    description: VoiceCallToolDescriptions.sendTask(),
    parameters: {
      type: "object",
      properties: {
        request: {
          type: "string",
          description: VoiceCallToolDescriptions.sendTaskRequest()
        }
      },
      required: ["request"]
    }
  },
  {
    type: "function",
    name: VOICE_CALL_RECALL_TEXTS_TOOL,
    description: VoiceCallToolDescriptions.recallTextMessages(),
    parameters: { type: "object", properties: {} }
  },
  {
    type: "function",
    name: VOICE_CALL_SILENT_TOOL,
    description: VoiceCallToolDescriptions.staySilent(),
    parameters: { type: "object", properties: {} }
  },
  {
    type: "function",
    name: VOICE_CALL_HANGUP_TOOL,
    description: VoiceCallToolDescriptions.endTheCall(),
    parameters: { type: "object", properties: {} }
  }
];
var EXPERIMENTAL = [
  {
    type: "function",
    name: VOICE_CALL_SEARCH_CONVERSATIONS_TOOL,
    description: VoiceCallToolDescriptions.searchConversations(),
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: VoiceCallToolDescriptions.searchConversationsQuery()
        },
        scope: {
          type: "string",
          description: VoiceCallToolDescriptions.searchConversationsScope(),
          enum: VOICE_CALL_SEARCH_SCOPES
        },
        id: {
          type: "string",
          description: VoiceCallToolDescriptions.searchConversationsId()
        },
        from: {
          type: "string",
          description: VoiceCallToolDescriptions.searchConversationsFrom()
        },
        to: {
          type: "string",
          description: VoiceCallToolDescriptions.searchConversationsTo()
        },
        if_missing: {
          type: "string",
          description: VoiceCallToolDescriptions.searchConversationsIfMissing(),
          enum: VOICE_CALL_SEARCH_MISS_FALLBACKS
        }
      },
      required: ["query", "if_missing"]
    }
  }
];
var VoiceCallSessionTools = class {
  static all() {
    return TOOLS;
  }
  static of(names3) {
    return TOOLS.filter((tool) => names3.includes(tool.name));
  }
  static descriptor(name17) {
    const descriptor2 = [...TOOLS, ...EXPERIMENTAL].find((tool) => tool.name === name17);
    if (descriptor2 === void 0) {
      throw new Error(`VoiceCallSessionTools.descriptor: ${name17} is not a voice tool`);
    }
    return descriptor2;
  }
  /** Whether a call by this name reaches a tool the line registered; anything else is served as unknown. */
  static registers(name17, tools) {
    return tools.some((tool) => tool.name === name17);
  }
};
