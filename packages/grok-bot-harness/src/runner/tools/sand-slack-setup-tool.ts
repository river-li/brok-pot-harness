init_zod();
var SAND_SLACK_SETUP_TOOL_NAME = "slack_setup";
var SLACK_SETUP_NOT_OWNER_LINE = "Only my owner can add me to Slack";
var SLACK_SETUP_TEAM_SETUP_UNDERWAY_LINE = "Nothing was started. This turn is your own setup, not the owner asking to be added to Slack, so the most you can do now is offer. When the owner asks, run slack_setup start then; status still answers now.";
var slackSetupParameters = external_exports.object({
  action: external_exports.enum(["start", "status"]).describe(
    "start: create and install your Slack app, or put the owner's next step in the chat. status: report where the install stands without changing anything."
  ),
  slack_team_id: external_exports.string().trim().min(1).optional().describe(
    "Only after a start listed several connected workspaces: the slackTeamId of the one the owner picked."
  )
});
function workspaceLabel(workspace) {
  return workspace.name === void 0 ? workspace.slackTeamId : `${workspace.name} (${workspace.slackTeamId})`;
}
function inWorkspace(name17) {
  return name17 === void 0 ? "the Slack workspace" : `the Slack workspace "${name17}"`;
}
function ownerStepMessage(outcome) {
  switch (outcome.kind) {
    case "authorize":
      return outcome.reason === "reconnect" ? `Grok Bot no longer has access to that Slack workspace. [Reconnect it](${outcome.url}), then tell me and I'll finish adding myself.` : `To add me to Slack, [connect a Slack workspace](${outcome.url}) you can install apps in and click Allow. Then tell me and I'll create my Slack app there.`;
    case "awaiting_admin":
      return `Slack needs a workspace admin to approve my app. [Submit the request to your Slack admins](${outcome.url}). Setup finishes on its own once they approve.`;
  }
}
function describeState(state) {
  switch (state.kind) {
    case "not_owner":
      return `Refused: only the owner can set up Slack, and only from their own conversation with this bot. Say just this, as is: ${SLACK_SETUP_NOT_OWNER_LINE}`;
    case "unavailable":
      return `Slack setup is not available for this bot: ${state.reason}`;
    case "not_started":
      return "Not in Slack yet, and no Slack workspace is connected. When the owner asks you to add yourself, run slack_setup start.";
    case "workspace_connected":
      return `Not in Slack yet. A Slack workspace is already connected (${state.workspaces.map(workspaceLabel).join(", ")}), so slack_setup start creates and installs your Slack app there without another authorization.`;
    case "awaiting_admin":
      return `Waiting for a Slack admin to approve your app in ${inWorkspace(state.workspaceName)}. ${state.requestFiled ? "The request is in their queue and nothing is left for the owner to do." : "The owner still has to submit the request; slack_setup start puts the link in the chat."} The install finishes on its own once they approve.`;
    case "installed":
      return `Installed in ${inWorkspace(state.workspaceName)} as your own Slack app${state.botUserId === void 0 ? "" : ` (Slack user id ${state.botUserId})`}. Teammates DM you or @mention you there.${state.needsUpdate ? " The app predates the current setup; the owner updates it from Team access with Update Slack app." : ""}`;
  }
}
function describeStart(outcome) {
  switch (outcome.kind) {
    case "authorize":
      return "The Slack authorization link is in the chat. The owner opens it, picks the workspace, clicks Allow, and lands on cursor.com. Ask them to tell you when that is done, then run slack_setup start again to create and install your Slack app. Don't repeat the link; it is short-lived, so if the owner comes back after it expired, run slack_setup start again for a fresh one.";
    case "awaiting_admin":
      return outcome.requestFiled ? describeState(outcome) : "The admin-request link is in the chat. The owner opens it and submits the request to their Slack admins; the install finishes on its own once an admin approves. Don't repeat the link.";
    case "choose_workspace":
      return `Several Slack workspaces are connected: ${outcome.workspaces.map(workspaceLabel).join(", ")}. Ask the owner which one, then run slack_setup start with that slack_team_id.`;
    case "retry_later":
      return outcome.retryAfterSeconds === void 0 ? "Another Slack install for this bot is in progress. Run slack_setup start again in a moment." : `Slack rate limited the install. Run slack_setup start again in ${outcome.retryAfterSeconds} seconds.`;
    case "rejected":
      return `Slack rejected the install: ${outcome.message}`;
    default:
      return describeState(outcome);
  }
}
function createSlackSetupTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_SLACK_SETUP_TOOL_NAME,
    description: "Add yourself to Slack, or check how far that has got. Only your owner can use it, from their own conversation with you; for anyone else it returns a one-line refusal to relay as is. start creates and installs your own Slack app in the owner's workspace; when a step needs the owner, such as allowing Cursor in their workspace or submitting the app to their Slack admins, the tool puts that step in the chat as a link and its result says what comes next. status reports where the install stands without changing anything.",
    parameters: slackSetupParameters,
    describeActivity: (args) => ({ detail: args.action }),
    execute: async (_ctx, args, d) => {
      if (args.action === "status") {
        return describeState(await d.setup.status());
      }
      if (d.isTeamSetupUnderway?.() === true) return SLACK_SETUP_TEAM_SETUP_UNDERWAY_LINE;
      const outcome = await d.setup.start(
        args.slack_team_id === void 0 ? {} : { slackTeamId: args.slack_team_id }
      );
      if (outcome.kind === "authorize" || outcome.kind === "awaiting_admin" && !outcome.requestFiled) {
        d.onSendMessage({ type: "text", content: ownerStepMessage(outcome) }, Date.now());
      }
      return describeStart(outcome);
    }
  });
}
