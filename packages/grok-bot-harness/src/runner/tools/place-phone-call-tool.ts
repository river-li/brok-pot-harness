init_zod();
var SAND_PLACE_PHONE_CALL_TOOL_NAME = "place_phone_call";
var E1642 = /^\+[1-9]\d{7,14}$/;
var MAX_SPOKEN_INSTRUCTIONS_LENGTH = 320;
var placePhoneCallParameters = external_exports.object({
  to: external_exports.string().trim().regex(E1642, "must be an E.164 phone number such as +16508228863").describe("The destination phone number to call, in E.164 format (for example +16508228863)."),
  instructions: external_exports.string().trim().min(1).max(MAX_SPOKEN_INSTRUCTIONS_LENGTH).describe("The script the voice agent follows on the call.")
});
var description = [
  "Place a live outbound phone call to an external number through Grok Bot telephony.",
  skillifyPointer("Before placing a call", SKILLIFY_SKILL_IDS.outboundCalls)
].join("\n");
async function placePhoneCall(deps, args) {
  const decision = await deps.reviewCall({ target: args, signal: deps.signal });
  if (!decision.allowed) {
    return `The phone call was not approved: ${decision.reason} Nothing was placed. Do not retry unless the user asks again.`;
  }
  const result = await deps.outboundCall.placeCall(args);
  const part = (label, value) => value === void 0 || value.length === 0 ? "" : ` ${label} ${value}.`;
  return `Placed outbound phone call to ${args.to} from ${result.from}.${part("Status", result.status)}${part("Call id", result.callId)}`;
}
function createPlacePhoneCallTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_PLACE_PHONE_CALL_TOOL_NAME,
    description,
    parameters: placePhoneCallParameters,
    describeActivity: (args) => ({
      detail: `call ${args.to}`,
      target: args.to
    }),
    execute: async (ctx, args, d) => placePhoneCall({ ...d, signal: ctx.signal }, args)
  });
}
