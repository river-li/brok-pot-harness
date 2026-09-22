/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/harness/tools/recall-text-messages.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var INPUT2 = external_exports.object({});
var OUTPUT2 = external_exports.object({
  messages: external_exports.array(external_exports.object({
    id: external_exports.string(),
    writer: external_exports.enum(["you", "them"]),
    text: external_exports.string()
  })).max(VOICE_CALL_SENT_MESSAGE_LIMIT)
});
var RecallTextMessagesTool = class _RecallTextMessagesTool extends VoiceCallTool {
  static definition = {
    name: VOICE_CALL_RECALL_TEXTS_TOOL,
    descriptor: VoiceCallSessionTools.descriptor(VOICE_CALL_RECALL_TEXTS_TOOL),
    input: INPUT2,
    output: OUTPUT2,
    invalidInputError: `invalid arguments for ${VOICE_CALL_RECALL_TEXTS_TOOL}`
  };
  read;
  constructor(read) {
    super(_RecallTextMessagesTool.definition);
    this.read = read;
  }
  async execute(_input, { agentId }) {
    const messages2 = await this.read(agentId);
    return { messages: messages2.slice(-VOICE_CALL_SENT_MESSAGE_LIMIT) };
  }
};

