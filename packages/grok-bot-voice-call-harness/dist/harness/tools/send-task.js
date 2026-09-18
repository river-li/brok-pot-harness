init_zod();
var INPUT3 = external_exports.object({
  request: external_exports.unknown().transform((value, ctx) => {
    const parsed2 = VoiceCallRequests.parse(value);
    if (parsed2.kind === "rejected") {
      ctx.addIssue({ code: external_exports.ZodIssueCode.custom, message: parsed2.error });
      return external_exports.NEVER;
    }
    return parsed2.request;
  }).describe(VoiceCallToolDescriptions.sendTaskRequest())
});
var OUTPUT3 = external_exports.discriminatedUnion("relay", [
  external_exports.object({ relay: external_exports.literal("accepted") }),
  external_exports.object({ relay: external_exports.literal("refused"), spoken: external_exports.string() }),
  external_exports.object({
    relay: external_exports.literal("unreachable"),
    spoken: external_exports.string(),
    errorClass: external_exports.string(),
    failureCode: external_exports.string().optional()
  })
]);
var SendTaskTool = class _SendTaskTool extends VoiceCallTool {
  static definition = {
    name: VOICE_CALL_NUDGE_MAIN_TOOL,
    descriptor: VoiceCallSessionTools.descriptor(VOICE_CALL_NUDGE_MAIN_TOOL),
    input: INPUT3,
    output: OUTPUT3,
    invalidInputError: VOICE_CALL_MISSING_REQUEST_ERROR
  };
  relay;
  constructor(relay) {
    super(_SendTaskTool.definition);
    this.relay = relay;
  }
  async execute({ request: request3 }, { agentId, callId }) {
    return _SendTaskTool.outputOf(await this.relay({ agentId, callId, request: request3 }));
  }
  /** What the model is told for each relay answer; the desktop reuses it when the harness itself cannot be reached. */
  static outputOf(outcome) {
    switch (outcome.kind) {
      case "accepted":
        return { relay: "accepted" };
      case "refused":
        return {
          relay: "refused",
          spoken: VoiceCallRefusals.reply(outcome.refusal)
        };
      case "unreachable":
        return {
          relay: "unreachable",
          spoken: VOICE_CALL_AGENT_UNREACHABLE_ANSWER,
          errorClass: outcome.errorClass,
          ...outcome.failureCode === void 0 ? {} : { failureCode: outcome.failureCode }
        };
    }
  }
};
