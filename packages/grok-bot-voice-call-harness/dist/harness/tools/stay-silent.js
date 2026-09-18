init_zod();
var INPUT4 = external_exports.object({});
var OUTPUT4 = external_exports.discriminatedUnion("plan", [
  external_exports.object({ plan: external_exports.literal("silent") }),
  external_exports.object({ plan: external_exports.literal("spoken"), error: external_exports.string() })
]);
var StaySilentTool = class _StaySilentTool extends VoiceCallTool {
  static definition = {
    name: VOICE_CALL_SILENT_TOOL,
    descriptor: VoiceCallSessionTools.descriptor(VOICE_CALL_SILENT_TOOL),
    input: INPUT4,
    output: OUTPUT4,
    invalidInputError: `invalid arguments for ${VOICE_CALL_SILENT_TOOL}`
  };
  constructor() {
    super(_StaySilentTool.definition);
  }
  execute(_input, { line }) {
    const plan = VoiceSpeakPolicy.staySilentPlan({
      theyJustTalked: line.theyJustTalked,
      newsOwed: line.newsOwed,
      receiptOwed: line.receiptOwed,
      alreadySpokeThisTurn: line.alreadySpokeThisTurn
    });
    return Promise.resolve(plan.kind === "silent" ? { plan: "silent" } : { plan: "spoken", error: plan.error });
  }
};
