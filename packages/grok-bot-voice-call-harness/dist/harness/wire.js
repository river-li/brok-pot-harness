init_zod();
var VOICE_CALL_HARNESS_SESSION_PATH = "/aiserver.v1.GrokBotService/VoiceCallHarnessSession";
var VOICE_CALL_HARNESS_TOOL_PATH = "/aiserver.v1.GrokBotService/VoiceCallHarnessTool";
var ID_MAX = 128;
var NAME_MAX = 200;
var VOICE_CALL_HARNESS_DESCRIPTION_MAX = 2e4;
var nonBlank = (max) => external_exports.string().trim().min(1).max(max);
var SessionRequest = external_exports.object({
  agentId: nonBlank(ID_MAX),
  agentName: nonBlank(NAME_MAX),
  userName: external_exports.string().max(NAME_MAX).nullish(),
  description: external_exports.string().max(VOICE_CALL_HARNESS_DESCRIPTION_MAX).optional(),
  spokenLanguage: external_exports.string().max(NAME_MAX).optional()
});
var LineState = external_exports.object({
  theyJustTalked: external_exports.boolean(),
  newsOwed: external_exports.boolean(),
  receiptOwed: external_exports.boolean(),
  alreadySpokeThisTurn: external_exports.boolean()
});
var ToolRequest = external_exports.object({
  agentId: nonBlank(ID_MAX),
  callId: nonBlank(ID_MAX),
  name: nonBlank(NAME_MAX),
  input: external_exports.unknown(),
  line: LineState
});
var Descriptor = external_exports.object({
  type: external_exports.literal("function"),
  name: external_exports.string(),
  description: external_exports.string(),
  parameters: external_exports.object({
    type: external_exports.literal("object"),
    properties: external_exports.record(external_exports.string(), external_exports.object({ type: external_exports.string(), description: external_exports.string() }).passthrough()),
    required: external_exports.array(external_exports.string()).optional()
  }).passthrough()
});
var SessionPlan = external_exports.object({
  instructions: external_exports.string(),
  tools: external_exports.array(Descriptor),
  hasOverheard: external_exports.boolean(),
  greeting: external_exports.object({ direction: external_exports.string(), withLandedWork: external_exports.string() }),
  receipt: external_exports.object({
    output: external_exports.object({ receipt: external_exports.string() }),
    instructions: external_exports.string()
  })
});
var ErrorOutput = external_exports.object({ error: external_exports.string() });
var ToolOutcome = external_exports.discriminatedUnion("kind", [
  external_exports.object({ kind: external_exports.literal("served"), output: external_exports.unknown() }),
  external_exports.object({ kind: external_exports.literal("unknown_tool"), output: ErrorOutput }),
  external_exports.object({ kind: external_exports.literal("invalid_input"), output: ErrorOutput })
]);
function parsed(result, shape) {
  return result.success ? { ok: true, value: shape(result.data) } : { ok: false, error: result.error.issues[0]?.message ?? "invalid" };
}
var VoiceCallHarnessWire = class {
  static parseSessionRequest(value) {
    return parsed(SessionRequest.safeParse(value), (request3) => ({
      agentId: request3.agentId,
      agentName: request3.agentName,
      ...request3.userName === void 0 ? {} : { userName: request3.userName },
      ...request3.description === void 0 ? {} : { description: request3.description },
      ...request3.spokenLanguage === void 0 ? {} : { spokenLanguage: request3.spokenLanguage }
    }));
  }
  static parseSessionPlan(value) {
    return parsed(SessionPlan.safeParse(value), (plan) => ({
      instructions: plan.instructions,
      tools: plan.tools.map((tool) => ({
        type: tool.type,
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.parameters.type,
          properties: tool.parameters.properties,
          ...tool.parameters.required === void 0 ? {} : { required: tool.parameters.required }
        }
      })),
      hasOverheard: plan.hasOverheard,
      greeting: plan.greeting,
      receipt: plan.receipt
    }));
  }
  static parseToolRequest(value) {
    return parsed(ToolRequest.safeParse(value), (request3) => ({
      agentId: request3.agentId,
      callId: request3.callId,
      name: request3.name,
      input: request3.input ?? {},
      line: request3.line
    }));
  }
  static parseToolOutcome(value) {
    return parsed(ToolOutcome.safeParse(value), (outcome) => outcome.kind === "served" ? { kind: "served", output: outcome.output } : outcome);
  }
};
