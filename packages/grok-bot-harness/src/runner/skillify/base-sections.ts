var CLOUD_AGENTS_UNAVAILABLE_ON_PLAN_CODE_CHANGES_BODY = [
  "Cursor cloud agents are not included in this user's Cursor plan, so you cannot launch or manage them. When the user asks for repository work, say plainly that it needs a Cursor plan that includes cloud agents (https://cursor.com/pricing) and offer what you can do instead: a narrow read-only lookup, a plan or PR description, or the forge's CLI authenticated on your own computer. Never push files one at a time through a connector as a substitute for a cloud agent.",
  `Before offering the CLI, check whether one is already authenticated. If not, offer to install the forge's CLI when it is missing and run its login, handing your computer over with request_box_help for the device code or browser step; never ask the user to paste a token. An authenticated CLI plus the user's go-ahead is the explicit-request exception to the checkout rule: clone under /workspace on your own computer, make the change, run the tests, push once, and open the PR with the CLI. For a narrow lookup use the built-in source-control tools when they are in your tool list, otherwise the provider's remote read-only CLI or API or web views. ${builtinScmAbsenceGuidance({ cloudAgentsEnabled: false })}`
];
var SKILLIFY_SKILL_IDS = {
  automations: "routines",
  codeChanges: "code-changes",
  boxDesktop: "box-desktop",
  noConnectorFallback: "no-connector-fallback",
  inChatForms: "in-chat-forms",
  channels: "channels",
  groupChatTurns: "group-chat-turns",
  voiceCalls: "voice-calls",
  outboundCalls: "outbound-calls",
  purchases: "purchases",
  sendOnBehalf: "send-on-behalf",
  skillAuthoring: "skill-authoring",
  sourceControl: "source-control"
};
var ADD_CONNECTOR_SKILL_ID = "add-connector";
var REMOVED_CLOUD_AGENT_CANVAS_SKILL_ID = "canvases";
var RESERVED_MANAGED_SKILL_IDS = /* @__PURE__ */ new Set([
  ...Object.values(SKILLIFY_SKILL_IDS),
  ADD_CONNECTOR_SKILL_ID,
  "shared-bot-plugins",
  REMOVED_CLOUD_AGENT_CANVAS_SKILL_ID
]);
function skillifyPointer(when, id) {
  return `${when}, Read the Cursor-managed \`${id}\` skill first and follow it.`;
}
function builtinScmAbsenceGuidance(options2) {
  const fallback2 = options2.cloudAgentsEnabled ? "Fall back to `gh`, the API, or a cloud agent, and treat a CloudAgent result as the only source of truth on a missing connection." : "Fall back to `gh` or the API for the lookup.";
  return `If \`cursor-github-*\` is not in your tool list, the built-in is not available for this account; that says nothing about whether GitHub is connected, so do not tell the user to connect or reconnect and do not show a connect card for it. ${fallback2}`;
}
var BUILTIN_SCM_ABSENCE_GUIDANCE = builtinScmAbsenceGuidance({ cloudAgentsEnabled: true });
var SKILLIFY_BASE_HEADINGS = /* @__PURE__ */ new Set([
  "## Managing plugins and connectors",
  "## Reaching services that have no connector",
  "## Writing on the user's behalf",
  "## Cursor Origin",
  "## Code changes",
  "## Voice calls"
]);
function skillifyBaseSections(sections, options2) {
  if (options2.skillifyEnabled !== true) return sections;
  return sections.flatMap((section) => {
    if (!SKILLIFY_BASE_HEADINGS.has(section.heading)) return [section];
    if (section.heading === "## Code changes" && !options2.cloudAgentsEnabled) {
      if (options2.cloudAgentsUnavailableReason === "plan") {
        return [{ ...section, body: CLOUD_AGENTS_UNAVAILABLE_ON_PLAN_CODE_CHANGES_BODY }];
      }
      return [
        {
          ...section,
          body: [
            "Cursor cloud agents are disabled by your team's admin: you cannot launch or manage them, and you do not perform non-trivial repository changes or broad code investigation yourself. Say so plainly and point the user to Cursor.",
            `Use the built-in source-control tools when they are in your tool list (\`cursor-github-*\` for GitHub), otherwise the provider's remote read-only CLI or API (\`gh\` for GitHub, \`glab\` for GitLab, or the Bitbucket / Azure DevOps API) or web views only for a narrow lookup (a file, a diff, a PR or issue, blame, commit history). ${builtinScmAbsenceGuidance({ cloudAgentsEnabled: false })} Repository checkouts stay off every computer you can reach; never clone, fetch, download, or unpack one to work around this.`
          ]
        }
      ];
    }
    return [];
  });
}
