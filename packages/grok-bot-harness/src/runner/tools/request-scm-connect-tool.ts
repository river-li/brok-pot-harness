/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/request-scm-connect-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var requestScmConnectParameters = external_exports.object({
  intent: external_exports.enum(SCM_CONNECT_INTENTS).describe(
    `"connect" when no (or not the right) source control integration is connected to the user's Cursor account; "access" when a connected integration can't see a repository the user wants cloud agents on, so they need to add it to Cursor's access.`
  ),
  provider: external_exports.enum(DASHBOARD_CONNECTABLE_PROVIDERS).optional().describe(
    "Optional. The integration that hosts the repository, when the URL or the user identifies it. Omit to show every supported integration."
  ),
  repo: external_exports.string().trim().regex(/^[^\s/]+\/[^\s/]+$/, 'repo must be an "owner/name" slug').optional().describe(
    'Optional, only with intent "access" and provider "github": the blocked repository as "owner/name". The card confirms once that repository becomes accessible.'
  ),
  reconnect: external_exports.boolean().optional().describe(
    'Optional, only with intent "connect": true when the integration is connected but its saved connection no longer works (the CloudAgent tool said to reconnect), so the card asks to connect it again.'
  )
});
var cardOffered2 = createCounter("grok_bot.scm_connect.card_offered", {
  description: "request_scm_connect tool calls: the agent asked the user to connect a source control integration (or grant it a repo); the top of the scm-connect funnel",
  labelNames: ["intent", "provider", "reconnect", "outcome", "wake"]
});
var REQUEST_SCM_CONNECT_DESCRIPTION = 'Show an in-chat card asking the user to connect a source control integration (GitHub, GitLab, Bitbucket, Azure DevOps) to their Cursor account so cloud agents can reach their repositories, or, with intent "access", to add a repository to an integration that is already connected. Call it with the exact arguments the CloudAgent tool result names, once per problem. The card is the whole ask: explain in your own words what connecting unblocks, and never paste a link or a settings path. This does not end your turn; the result says whether you are woken automatically when the user connects.';
function createRequestScmConnectTool(deps) {
  const sentCards = /* @__PURE__ */ new Set();
  return defineCommunicateTool(deps, {
    id: "REQUEST_SCM_CONNECT",
    name: SAND_REQUEST_SCM_CONNECT_TOOL_NAME,
    description: REQUEST_SCM_CONNECT_DESCRIPTION,
    parameters: requestScmConnectParameters,
    describeActivity: (args) => ({
      detail: args.intent === "access" ? "Requesting repository access" : "Requesting a connection"
    }),
    execute: async (ctx, args, d) => {
      const card = scmConnectCardFromRequest(args);
      const key = JSON.stringify(card);
      const cardLabels = {
        intent: args.intent,
        provider: card.provider ?? "any",
        reconnect: String(card.reason != null)
      };
      if (sentCards.has(key)) {
        cardOffered2.increment(ctx, 1, { ...cardLabels, outcome: "duplicate", wake: "none" });
        return "That card is already in the chat from earlier this turn; nothing new was shown. Wait for the user instead of sending it again.";
      }
      sentCards.add(key);
      d.onSendMessage(card, Date.now());
      const armed = d.registerScmConnectWait != null && await armScmConnectWaits(card, d.registerScmConnectWait);
      cardOffered2.increment(ctx, 1, {
        ...cardLabels,
        outcome: "shown",
        wake: armed ? "armed" : "unarmed"
      });
      const wake = armed ? "You're woken automatically once a source control integration is connected or updates its access, so don't ask the user to report back." : "You will not be woken automatically here; wait for the user to say it's connected.";
      return `The card is in the chat. ${wake} Confirm with the user before retrying the blocked action.`;
    }
  });
}

