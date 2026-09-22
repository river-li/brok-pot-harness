/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-voice-call-harness/dist/harness/tools/end-the-call.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var INPUT = external_exports.object({});
var OUTPUT = external_exports.object({ hangUp: external_exports.literal(true) });
var EndTheCallTool = class _EndTheCallTool extends VoiceCallTool {
  static definition = {
    name: VOICE_CALL_HANGUP_TOOL,
    descriptor: VoiceCallSessionTools.descriptor(VOICE_CALL_HANGUP_TOOL),
    input: INPUT,
    output: OUTPUT,
    invalidInputError: `invalid arguments for ${VOICE_CALL_HANGUP_TOOL}`
  };
  constructor() {
    super(_EndTheCallTool.definition);
  }
  execute() {
    return Promise.resolve({ hangUp: true });
  }
};

