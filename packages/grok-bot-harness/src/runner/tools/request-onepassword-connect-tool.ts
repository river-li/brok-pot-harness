/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/request-onepassword-connect-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var SAND_REQUEST_ONEPASSWORD_CONNECT_TOOL_NAME = "request_1password_connect";
var ONEPASSWORD_CONNECT_CARD_HINT = `Nothing was shown to the user. To ask them to connect one, call ${SAND_REQUEST_ONEPASSWORD_CONNECT_TOOL_NAME}, and only if the task needs their saved logins; otherwise use request_box_help for the sign-in.`;
var requestOnePasswordConnectParameters = external_exports.object({}).strict();
var cardOffered = createCounter("grok_bot.onepassword_connect.card_offered", {
  description: "request_1password_connect tool calls: the agent asked the user to connect a 1Password vault from the chat",
  labelNames: ["outcome"]
});
var REQUEST_ONEPASSWORD_CONNECT_DESCRIPTION = "Show an in-chat card asking the user to connect 1Password, so saved logins can fill on Grok Bot's computer with their approval. Call it once when ListCredentials or GetCredentialProviderStatus reports no vault and the task needs a saved login. The card is the whole ask: explain in your own words what connecting unblocks, and never paste a link or a settings path. Connecting happens on the user's Mac; on a phone the card says so. This does not end your turn and you are not woken when they connect: when the user says it is connected, call ListCredentials again.";
function createRequestOnePasswordConnectTool(deps) {
  let cardSent = false;
  return defineCommunicateTool(deps, {
    id: "REQUEST_ONEPASSWORD_CONNECT",
    name: SAND_REQUEST_ONEPASSWORD_CONNECT_TOOL_NAME,
    description: REQUEST_ONEPASSWORD_CONNECT_DESCRIPTION,
    parameters: requestOnePasswordConnectParameters,
    describeActivity: () => ({ detail: "Requesting a 1Password connection" }),
    execute: async (ctx, _args, d) => {
      if (d.turnRefusal !== void 0) {
        cardOffered.increment(ctx, 1, { outcome: "refused_turn" });
        return `The card was NOT shown: ${SAND_CREDENTIAL_TURN_REFUSAL_PHRASE[d.turnRefusal]}.`;
      }
      if (cardSent) {
        cardOffered.increment(ctx, 1, { outcome: "duplicate" });
        return "That card is already in the chat from earlier this turn; nothing new was shown. Wait for the user instead of sending it again.";
      }
      cardSent = true;
      d.onSendMessage({ type: "onepassword-connect" }, Date.now());
      cardOffered.increment(ctx, 1, { outcome: "shown" });
      return "The card is in the chat. You are not woken automatically; when the user says 1Password is connected, call ListCredentials again. Confirm with the user before retrying the blocked sign-in.";
    }
  });
}

